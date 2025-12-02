/**
 * Caching Service
 * Provides Redis and in-memory caching for fraud signals and other data
 */

import { config } from '../config';
import pino from 'pino';
import crypto from 'crypto';

const logger = pino({
  name: 'cache-service',
  level: config.LOG_LEVEL || 'info'
});

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  namespace?: string;
}

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  createdAt: number;
}

export class CacheService {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private redisClient: any = null;
  private useRedis: boolean = false;
  private defaultTTL: number = 3600; // 1 hour default

  constructor() {
    this.initializeRedis().catch((error) => {
      logger.warn({ error }, 'Redis initialization failed, using in-memory cache');
    });
  }

  /**
   * Initialize Redis client if configured
   */
  private async initializeRedis(): Promise<void> {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      logger.info('Redis not configured, using in-memory cache');
      return;
    }

    try {
      // Dynamic import to avoid requiring redis if not used
      // @ts-ignore - Redis types may not be available
      const redis = await import('redis');
      this.redisClient = redis.createClient({ url: redisUrl });
      
      this.redisClient.on('error', (err: Error) => {
        logger.error({ error: err }, 'Redis client error');
        this.useRedis = false;
      });

      this.redisClient.on('connect', () => {
        logger.info('Redis client connected');
        this.useRedis = true;
      });

      await this.redisClient.connect();
    } catch (error) {
      logger.warn({ error }, 'Failed to connect to Redis, using in-memory cache');
      this.useRedis = false;
    }
  }

  /**
   * Generate cache key with namespace
   */
  private generateKey(key: string, namespace?: string): string {
    const prefix = namespace ? `${namespace}:` : '';
    return `${prefix}${key}`;
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const cacheKey = this.generateKey(key, options.namespace);

    try {
      if (this.useRedis && this.redisClient) {
        const value = await this.redisClient.get(cacheKey);
        if (value) {
          return JSON.parse(value) as T;
        }
        return null;
      }

      // Fallback to memory cache
      const entry = this.memoryCache.get(cacheKey);
      if (!entry) {
        return null;
      }

      // Check if expired
      if (Date.now() > entry.expiresAt) {
        this.memoryCache.delete(cacheKey);
        return null;
      }

      return entry.value as T;
    } catch (error) {
      logger.error({ error, key: cacheKey }, 'Cache get error');
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<boolean> {
    const cacheKey = this.generateKey(key, options.namespace);
    const ttl = options.ttl || this.defaultTTL;
    const expiresAt = Date.now() + (ttl * 1000);

    try {
      if (this.useRedis && this.redisClient) {
        await this.redisClient.setEx(
          cacheKey,
          ttl,
          JSON.stringify(value)
        );
        return true;
      }

      // Fallback to memory cache
      this.memoryCache.set(cacheKey, {
        value,
        expiresAt,
        createdAt: Date.now(),
      });

      // Cleanup expired entries periodically
      this.cleanupMemoryCache();

      return true;
    } catch (error) {
      logger.error({ error, key: cacheKey }, 'Cache set error');
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string, options: CacheOptions = {}): Promise<boolean> {
    const cacheKey = this.generateKey(key, options.namespace);

    try {
      if (this.useRedis && this.redisClient) {
        await this.redisClient.del(cacheKey);
        return true;
      }

      // Fallback to memory cache
      return this.memoryCache.delete(cacheKey);
    } catch (error) {
      logger.error({ error, key: cacheKey }, 'Cache delete error');
      return false;
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    const cacheKey = this.generateKey(key, options.namespace);

    try {
      if (this.useRedis && this.redisClient) {
        const result = await this.redisClient.exists(cacheKey);
        return result === 1;
      }

      // Fallback to memory cache
      const entry = this.memoryCache.get(cacheKey);
      if (!entry) {
        return false;
      }

      // Check if expired
      if (Date.now() > entry.expiresAt) {
        this.memoryCache.delete(cacheKey);
        return false;
      }

      return true;
    } catch (error) {
      logger.error({ error, key: cacheKey }, 'Cache exists error');
      return false;
    }
  }

  /**
   * Clear all cache entries (use with caution)
   */
  async clear(namespace?: string): Promise<boolean> {
    try {
      if (this.useRedis && this.redisClient) {
        if (namespace) {
          const pattern = `${namespace}:*`;
          const keys = await this.redisClient.keys(pattern);
          if (keys.length > 0) {
            await this.redisClient.del(keys);
          }
        } else {
          await this.redisClient.flushDb();
        }
        return true;
      }

      // Fallback to memory cache
      if (namespace) {
        const prefix = `${namespace}:`;
        for (const key of this.memoryCache.keys()) {
          if (key.startsWith(prefix)) {
            this.memoryCache.delete(key);
          }
        }
      } else {
        this.memoryCache.clear();
      }

      return true;
    } catch (error) {
      logger.error({ error, namespace }, 'Cache clear error');
      return false;
    }
  }

  /**
   * Get or set pattern (cache-aside)
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.get<T>(key, options);
    if (cached !== null) {
      return cached;
    }

    const value = await fetcher();
    await this.set(key, value, options);
    return value;
  }

  /**
   * Cleanup expired memory cache entries
   */
  private cleanupMemoryCache(): void {
    // Only cleanup every 100 operations to avoid performance impact
    if (Math.random() > 0.01) {
      return;
    }

    const now = Date.now();
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now > entry.expiresAt) {
        this.memoryCache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    type: 'redis' | 'memory';
    size: number;
    keys: number;
  } {
    if (this.useRedis && this.redisClient) {
      return {
        type: 'redis',
        size: 0, // Redis doesn't expose size easily
        keys: 0,
      };
    }

    return {
      type: 'memory',
      size: this.memoryCache.size,
      keys: this.memoryCache.size,
    };
  }
}

// Singleton instance
export const cacheService = new CacheService();

/**
 * Fraud signal cache helpers
 */
export class FraudSignalCache {
  private cache: CacheService;
  private namespace = 'fraud_signals';

  constructor(cache: CacheService) {
    this.cache = cache;
  }

  /**
   * Cache fraud risk score
   */
  async cacheRiskScore(
    userId: number,
    score: number,
    ttl: number = 3600
  ): Promise<void> {
    await this.cache.set(
      `risk_score:${userId}`,
      { score, timestamp: Date.now() },
      { namespace: this.namespace, ttl }
    );
  }

  /**
   * Get cached risk score
   */
  async getRiskScore(userId: number): Promise<number | null> {
    const cached = await this.cache.get<{ score: number; timestamp: number }>(
      `risk_score:${userId}`,
      { namespace: this.namespace }
    );

    if (!cached) {
      return null;
    }

    // Check if score is still fresh (less than 1 hour old)
    const age = Date.now() - cached.timestamp;
    if (age > 3600000) {
      await this.cache.delete(`risk_score:${userId}`, { namespace: this.namespace });
      return null;
    }

    return cached.score;
  }

  /**
   * Cache IP reputation
   */
  async cacheIPReputation(
    ip: string,
    reputation: 'good' | 'neutral' | 'bad',
    ttl: number = 86400 // 24 hours
  ): Promise<void> {
    const key = `ip_reputation:${crypto.createHash('sha256').update(ip).digest('hex')}`;
    await this.cache.set(
      key,
      { reputation, timestamp: Date.now() },
      { namespace: this.namespace, ttl }
    );
  }

  /**
   * Get cached IP reputation
   */
  async getIPReputation(ip: string): Promise<'good' | 'neutral' | 'bad' | null> {
    const key = `ip_reputation:${crypto.createHash('sha256').update(ip).digest('hex')}`;
    const cached = await this.cache.get<{ reputation: string; timestamp: number }>(
      key,
      { namespace: this.namespace }
    );

    return cached ? (cached.reputation as 'good' | 'neutral' | 'bad') : null;
  }

  /**
   * Cache transaction pattern
   */
  async cacheTransactionPattern(
    userId: number,
    pattern: {
      velocity: number;
      averageAmount: number;
      riskLevel: 'low' | 'medium' | 'high';
    },
    ttl: number = 1800 // 30 minutes
  ): Promise<void> {
    await this.cache.set(
      `tx_pattern:${userId}`,
      { ...pattern, timestamp: Date.now() },
      { namespace: this.namespace, ttl }
    );
  }

  /**
   * Get cached transaction pattern
   */
  async getTransactionPattern(userId: number): Promise<{
    velocity: number;
    averageAmount: number;
    riskLevel: 'low' | 'medium' | 'high';
  } | null> {
    const cached = await this.cache.get<{
      velocity: number;
      averageAmount: number;
      riskLevel: string;
      timestamp: number;
    }>(
      `tx_pattern:${userId}`,
      { namespace: this.namespace }
    );

    if (!cached) {
      return null;
    }

    return {
      velocity: cached.velocity,
      averageAmount: cached.averageAmount,
      riskLevel: cached.riskLevel as 'low' | 'medium' | 'high',
    };
  }
}

// Export fraud signal cache instance
export const fraudSignalCache = new FraudSignalCache(cacheService);

