import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Input sanitization utility
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .slice(0, 1000); // Limit length
}

// Validation middleware factory
export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanitize string inputs
      if (typeof req.body === 'object' && req.body !== null) {
        for (const [key, value] of Object.entries(req.body)) {
          if (typeof value === 'string') {
            req.body[key] = sanitizeInput(value);
          }
        }
      }

      // Validate with Zod
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          error: 'Validation failed',
          details: validationError.toString()
        });
      }
      next(error);
    }
  };
}

// Query parameter validation
export function validateQuery(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          error: 'Invalid query parameters',
          details: validationError.toString()
        });
      }
      next(error);
    }
  };
}

// Pagination schema
export const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? Math.min(parseInt(val) || 20, 100) : 20),
});

// Common validation schemas
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
});