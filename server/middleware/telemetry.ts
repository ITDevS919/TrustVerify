/**
 * Telemetry Middleware
 * Adds correlation IDs and trace context to requests
 */

import { Request, Response, NextFunction } from 'express';
import { telemetryService } from '../services/telemetry';

/**
 * Telemetry middleware - adds correlation IDs and trace context
 */
export function telemetryMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Create telemetry context
  const context = telemetryService.createContext(req, res);

  // Attach to request for use in handlers
  (req as any).telemetryContext = context;
  res.locals.telemetryContext = context;

  // Start root span
  const spanId = telemetryService.startSpan(
    `${req.method} ${req.path}`,
    context,
    undefined,
    {
      method: req.method,
      path: req.path || '',
      ip: req.ip || 'unknown',
    }
  );

  res.locals.spanId = spanId;

  // Log request start
  telemetryService.log({
    level: 'info',
    message: `Request started: ${req.method} ${req.path}`,
    context,
    metadata: {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    },
  });

  // End span when response finishes
  res.on('finish', () => {
    const startTime = res.locals.startTime || Date.now();
    const duration = Date.now() - startTime;
    telemetryService.endSpan(spanId, {
      statusCode: res.statusCode.toString(),
      duration: duration.toString(),
    });

    telemetryService.log({
      level: res.statusCode >= 400 ? 'warn' : 'info',
      message: `Request completed: ${req.method} ${req.path} ${res.statusCode}`,
      context,
      metadata: {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: Date.now() - (res.locals.startTime || Date.now()),
      },
    });
  });

  // Record request start time
  res.locals.startTime = Date.now();

  next();
}

