/**
 * Payload Size Validation Middleware
 * Enforces maximum payload size limits per endpoint
 */

import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import pino from 'pino';

const logger = pino({
  name: 'payload-validation',
  level: config.LOG_LEVEL || 'info'
});

const MAX_PAYLOAD_SIZE_MB = config.API_MAX_PAYLOAD_SIZE_MB || 10;
const MAX_PAYLOAD_SIZE_BYTES = MAX_PAYLOAD_SIZE_MB * 1024 * 1024;

/**
 * Validate request payload size
 */
export function validatePayloadSize(
  maxSizeMB: number = MAX_PAYLOAD_SIZE_MB
) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = req.headers['content-length'];
    
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      
      if (size > maxSizeBytes) {
        logger.warn({
          size,
          maxSize: maxSizeBytes,
          endpoint: req.path,
          method: req.method,
        }, 'Payload size exceeds limit');
        
        return res.status(413).json({
          error: 'Payload too large',
          message: `Maximum payload size is ${maxSizeMB}MB`,
          received: `${(size / 1024 / 1024).toFixed(2)}MB`,
          limit: `${maxSizeMB}MB`,
        });
      }
    }
    
    // Also check body size if already parsed
    if (req.body && typeof req.body === 'object') {
      const bodySize = JSON.stringify(req.body).length;
      if (bodySize > maxSizeBytes) {
        logger.warn({
          bodySize,
          maxSize: maxSizeBytes,
          endpoint: req.path,
        }, 'Request body size exceeds limit');
        
        return res.status(413).json({
          error: 'Payload too large',
          message: `Maximum payload size is ${maxSizeMB}MB`,
          received: `${(bodySize / 1024 / 1024).toFixed(2)}MB`,
          limit: `${maxSizeMB}MB`,
        });
      }
    }
    
    next();
  };
}

/**
 * Configure Express body parser with size limits
 */
export function configureBodyParser(app: any): void {
  const express = require('express');
  
  // JSON parser with size limit
  app.use(express.json({
    limit: `${MAX_PAYLOAD_SIZE_MB}mb`,
    verify: (req: any, res: any, buf: Buffer) => {
      if (buf.length > MAX_PAYLOAD_SIZE_BYTES) {
        throw new Error('Request entity too large');
      }
    },
  }));
  
  // URL-encoded parser with size limit
  app.use(express.urlencoded({
    extended: true,
    limit: `${MAX_PAYLOAD_SIZE_MB}mb`,
  }));
  
  logger.info({ maxSizeMB: MAX_PAYLOAD_SIZE_MB }, 'Body parser configured with size limits');
}

