/**
 * Error Handling Middleware
 * Provides consistent API error responses and error logging
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { siemService } from '../services/siem-integration';
import pino from 'pino';
import { config } from '../config';

const logger = pino({
  name: 'error-handler',
  level: config.LOG_LEVEL || 'info'
});

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
  isOperational?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path?: string;
    requestId?: string;
  };
  meta?: {
    version?: string;
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Custom error classes
 */
export class ValidationError extends Error implements ApiError {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  isOperational = true;
  details: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class NotFoundError extends Error implements ApiError {
  statusCode = 404;
  code = 'NOT_FOUND';
  isOperational = true;

  constructor(resource: string, identifier?: string | number) {
    super(`${resource}${identifier ? ` with id ${identifier}` : ''} not found`);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error implements ApiError {
  statusCode = 401;
  code = 'UNAUTHORIZED';
  isOperational = true;

  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error implements ApiError {
  statusCode = 403;
  code = 'FORBIDDEN';
  isOperational = true;

  constructor(message: string = 'Access forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends Error implements ApiError {
  statusCode = 409;
  code = 'CONFLICT';
  isOperational = true;

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends Error implements ApiError {
  statusCode = 429;
  code = 'RATE_LIMIT_EXCEEDED';
  isOperational = true;

  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Generate request ID for tracing
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Success response helper
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: Record<string, any>
): void {
  const requestId = res.locals.requestId || generateRequestId();
  
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      version: config.API_VERSION || 'v1',
      timestamp: new Date().toISOString(),
      requestId,
      ...meta,
    },
  };

  res.status(statusCode).json(response);
}

/**
 * Error response helper
 */
export function sendError(
  res: Response,
  error: ApiError | Error,
  statusCode?: number
): void {
  const requestId = res.locals.requestId || generateRequestId();
  const status = statusCode || (error as ApiError).statusCode || 500;
  const code = (error as ApiError).code || 'INTERNAL_ERROR';
  const isOperational = (error as ApiError).isOperational || false;

  // Don't expose internal error details in production
  // Check process.env directly to allow test overrides
  const isProduction = process.env.NODE_ENV === 'production' || config.NODE_ENV === 'production';
  const message = isProduction && !isOperational
    ? 'An internal error occurred'
    : error.message;

  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details: (error as ApiError).details,
      timestamp: new Date().toISOString(),
      path: res.locals.path,
      requestId,
    },
    meta: {
      version: config.API_VERSION || 'v1',
      timestamp: new Date().toISOString(),
      requestId,
    },
  };

  res.status(status).json(response);
}

/**
 * Main error handling middleware
 */
export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Generate request ID if not present
  if (!res.locals.requestId) {
    res.locals.requestId = generateRequestId();
  }
  res.locals.path = req.path;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const validationError = new ValidationError('Validation failed', {
      fields: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
        code: e.code,
      })),
    });
    return sendError(res, validationError);
  }

  // Handle known operational errors
  if ((err as ApiError).isOperational) {
    const apiError = err as ApiError;
    logger.warn({
      error: apiError.name,
      code: apiError.code,
      message: apiError.message,
      path: req.path,
      method: req.method,
      requestId: res.locals.requestId,
    }, 'Operational error');
    
    return sendError(res, apiError);
  }

  // Handle unknown errors
  logger.error({
    error: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: res.locals.requestId,
    userId: (req as any).user?.id,
  }, 'Unhandled error');

  // Log to SIEM
  siemService.logSecurityEvent(
    'server_error',
    'high',
    (req as any).user?.id,
    req.ip,
    {
      error: err.name,
      message: err.message,
      path: req.path,
      method: req.method,
      requestId: res.locals.requestId,
    }
  ).catch(() => {});

  // Send generic error response
  const internalError: ApiError = {
    name: 'InternalError',
    message: config.NODE_ENV === 'production' 
      ? 'An internal server error occurred'
      : err.message,
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    isOperational: false,
  };

  sendError(res, internalError);
}

/**
 * Async handler wrapper to catch errors in async routes
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  if (!res.locals.requestId) {
    res.locals.requestId = generateRequestId();
  }
  res.locals.path = req.path;
  
  const error: ApiError = {
    name: 'NotFoundError',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404,
    code: 'ROUTE_NOT_FOUND',
    isOperational: true,
  };

  sendError(res, error);
}

/**
 * Request ID middleware
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = req.headers['x-request-id'] as string || generateRequestId();
  res.locals.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}

