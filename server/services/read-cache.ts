/**
 * Read Cache Service
 * Provides in-memory caching for frequent database reads
 */

import { cacheService } from './cache-service';
import pino from 'pino';
import { config } from '../config';

const logger = pino({
  name: 'read-cache',
  level: config.LOG_LEVEL || 'info'
});

export interface CacheableQuery<T> {
  key: string;
  ttl?: number; // Time to live in seconds
  fetcher: () => Promise<T>;
}

export class ReadCacheService {
  private defaultTTL: number = 300; // 5 minutes default
  private cachePrefix: string = 'read_cache:';

  /**
   * Get or set cached value
   */
  async getOrSet<T>(query: CacheableQuery<T>): Promise<T> {
    const cacheKey = `${this.cachePrefix}${query.key}`;
    const ttl = query.ttl || this.defaultTTL;

    try {
      // Try to get from cache
      const cached = await cacheService.get<T>(cacheKey);
      if (cached !== null) {
        logger.debug({ key: query.key }, 'Cache hit');
        return cached;
      }

      // Cache miss - fetch data
      logger.debug({ key: query.key }, 'Cache miss, fetching data');
      const data = await query.fetcher();

      // Store in cache
      await cacheService.set(cacheKey, data, { ttl });

      return data;
    } catch (error: any) {
      logger.error({ error, key: query.key }, 'Cache operation failed, fetching directly');
      // On cache error, fetch directly
      return await query.fetcher();
    }
  }

  /**
   * Invalidate cache by key pattern
   */
  async invalidate(pattern: string): Promise<void> {
    try {
      await cacheService.delete(`${this.cachePrefix}${pattern}`);
      logger.info({ pattern }, 'Cache invalidated');
    } catch (error: any) {
      logger.error({ error, pattern }, 'Cache invalidation failed');
    }
  }

  /**
   * Invalidate all user-related cache
   */
  async invalidateUser(userId: number): Promise<void> {
    await this.invalidate(`user:${userId}:*`);
  }

  /**
   * Invalidate all transaction-related cache
   */
  async invalidateTransaction(transactionId: number): Promise<void> {
    await this.invalidate(`transaction:${transactionId}:*`);
  }

  /**
   * Clear all read cache
   */
  async clearAll(): Promise<void> {
    try {
      await cacheService.clear(this.cachePrefix);
      logger.info('All read cache cleared');
    } catch (error: any) {
      logger.error({ error }, 'Failed to clear read cache');
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    hits: number;
    misses: number;
    size: number;
  }> {
    // This would require cache service to track stats
    // For now, return placeholder
    return {
      hits: 0,
      misses: 0,
      size: 0,
    };
  }
}

export const readCache = new ReadCacheService();

