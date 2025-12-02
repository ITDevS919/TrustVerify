/**
 * Query Cache Middleware
 * Automatically caches frequent database queries
 */

import { Request, Response, NextFunction } from 'express';
import { readCache } from '../services/read-cache';
import crypto from 'crypto';

/**
 * Middleware to cache query results
 */
export function cacheQuery(
  ttl: number = 300, // 5 minutes default
  keyGenerator?: (req: Request) => string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key
    const cacheKey = keyGenerator 
      ? keyGenerator(req)
      : generateCacheKey(req);

    // Try to get from cache
    const cached = await readCache.getOrSet({
      key: cacheKey,
      ttl,
      fetcher: async () => {
        // Store original json method
        const originalJson = res.json.bind(res);
        let responseData: any;

        // Override json to capture response
        res.json = function(data: any) {
          responseData = data;
          return originalJson(data);
        };

        // Call next middleware
        await new Promise<void>((resolve) => {
          next();
          // Wait for response to be sent
          res.on('finish', () => {
            resolve();
          });
        });

        return responseData;
      },
    });

    // If cached, return immediately
    if (cached) {
      return res.json(cached);
    }

    next();
  };
}

/**
 * Generate cache key from request
 */
function generateCacheKey(req: Request): string {
  const keyParts = [
    req.method,
    req.path,
    JSON.stringify(req.query),
    req.user?.id || 'anonymous',
  ];

  const keyString = keyParts.join(':');
  return crypto.createHash('sha256').update(keyString).digest('hex');
}

/**
 * Invalidate cache for specific route
 */
export function invalidateCache(pattern: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Invalidate cache after successful mutation
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        await readCache.invalidate(pattern);
      }
    });

    next();
  };
}

