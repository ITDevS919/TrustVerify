/**
 * Unit Tests for Error Handler Middleware
 */

import { Request, Response, NextFunction } from 'express';
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  RateLimitError,
  sendSuccess,
  sendError,
  errorHandler,
  asyncHandler,
} from '../../../../middleware/error-handler';
import { ZodError } from 'zod';

describe('Error Handler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      path: '/api/test',
      method: 'GET',
      headers: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {},
    };

    mockNext = jest.fn();
  });

  describe('Custom Error Classes', () => {
    it('should create ValidationError with correct properties', () => {
      const error = new ValidationError('Invalid input', { field: 'email' });

      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.isOperational).toBe(true);
      expect(error.message).toBe('Invalid input');
      expect(error.details).toEqual({ field: 'email' });
    });

    it('should create NotFoundError with correct properties', () => {
      const error = new NotFoundError('User', 123);

      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.message).toBe('User with id 123 not found');
    });

    it('should create UnauthorizedError with correct properties', () => {
      const error = new UnauthorizedError('Authentication required');

      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
    });

    it('should create ForbiddenError with correct properties', () => {
      const error = new ForbiddenError('Access forbidden');

      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
    });

    it('should create ConflictError with correct properties', () => {
      const error = new ConflictError('Resource conflict');

      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('CONFLICT');
    });

    it('should create RateLimitError with correct properties', () => {
      const error = new RateLimitError('Rate limit exceeded');

      expect(error.statusCode).toBe(429);
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
    });
  });

  describe('sendSuccess', () => {
    it('should send success response with data', () => {
      const data = { id: 1, name: 'Test' };
      mockResponse.locals = { requestId: 'test-request-id' };

      sendSuccess(mockResponse as Response, data, 200);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data,
        meta: expect.objectContaining({
          timestamp: expect.any(String),
          requestId: 'test-request-id',
        }),
      });
    });
  });

  describe('sendError', () => {
    it('should send error response', () => {
      const error = new ValidationError('Validation failed');
      mockResponse.locals = { requestId: 'test-request-id', path: '/api/test' };

      sendError(mockResponse as Response, error);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          timestamp: expect.any(String),
          requestId: 'test-request-id',
          path: '/api/test',
        }),
        meta: expect.objectContaining({
          timestamp: expect.any(String),
          requestId: 'test-request-id',
        }),
      });
    });
  });

  describe('errorHandler', () => {
    it('should handle ZodError', () => {
      const zodError = new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['email'],
          message: 'Expected string, received number',
        },
      ]);

      errorHandler(zodError, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'VALIDATION_ERROR',
          }),
        })
      );
    });

    it('should handle operational errors', () => {
      const error = new NotFoundError('User', 123);
      mockResponse.locals = { requestId: 'test-id', path: '/api/test' };

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('should handle unknown errors', () => {
      const error = new Error('Unknown error');
      mockResponse.locals = { requestId: 'test-id', path: '/api/test' };

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('asyncHandler', () => {
    it('should handle async function success', async () => {
      const handler = asyncHandler(async (req, res, next) => {
        res.status(200).json({ success: true });
      });

      await handler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should catch and forward errors', async () => {
      const error = new Error('Async error');
      const handler = asyncHandler(async (req, res, next) => {
        throw error;
      });

      await handler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

