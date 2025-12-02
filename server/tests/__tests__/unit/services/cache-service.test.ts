/**
 * Unit Tests for Cache Service
 */

import { CacheService, FraudSignalCache } from '../../../../services/cache-service';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService();
  });

  afterEach(async () => {
    await cacheService.clear();
  });

  describe('get and set', () => {
    it('should set and get a value', async () => {
      const key = 'test-key';
      const value = { data: 'test' };

      await cacheService.set(key, value, { ttl: 60 });
      const result = await cacheService.get(key);

      expect(result).toEqual(value);
    });

    it('should return null for non-existent key', async () => {
      const result = await cacheService.get('non-existent');
      expect(result).toBeNull();
    });

    it('should respect TTL', async () => {
      const key = 'ttl-test';
      const value = 'test';

      await cacheService.set(key, value, { ttl: 1 }); // 1 second
      
      const result1 = await cacheService.get(key);
      expect(result1).toBe(value);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      const result2 = await cacheService.get(key);
      expect(result2).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a key', async () => {
      const key = 'delete-test';
      const value = 'test';

      await cacheService.set(key, value);
      await cacheService.delete(key);
      
      const result = await cacheService.get(key);
      expect(result).toBeNull();
    });
  });

  describe('exists', () => {
    it('should return true if key exists', async () => {
      const key = 'exists-test';
      await cacheService.set(key, 'test');
      
      const result = await cacheService.exists(key);
      expect(result).toBe(true);
    });

    it('should return false if key does not exist', async () => {
      const result = await cacheService.exists('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('getOrSet', () => {
    it('should return cached value if exists', async () => {
      const key = 'getorset-test';
      const cachedValue = 'cached';
      
      await cacheService.set(key, cachedValue);
      
      const fetcher = jest.fn().mockResolvedValue('new-value');
      const result = await cacheService.getOrSet(key, fetcher);
      
      expect(result).toBe(cachedValue);
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('should call fetcher and cache if not exists', async () => {
      const key = 'getorset-test-2';
      const newValue = 'new-value';
      
      const fetcher = jest.fn().mockResolvedValue(newValue);
      const result = await cacheService.getOrSet(key, fetcher);
      
      expect(result).toBe(newValue);
      expect(fetcher).toHaveBeenCalled();
      
      // Verify it was cached
      const cached = await cacheService.get(key);
      expect(cached).toBe(newValue);
    });
  });
});

describe('FraudSignalCache', () => {
  let fraudCache: FraudSignalCache;
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService();
    fraudCache = new FraudSignalCache(cacheService);
  });

  afterEach(async () => {
    await cacheService.clear('fraud_signals');
  });

  describe('risk score caching', () => {
    it('should cache and retrieve risk score', async () => {
      const userId = 1;
      const score = 75.5;

      await fraudCache.cacheRiskScore(userId, score);
      const result = await fraudCache.getRiskScore(userId);

      expect(result).toBe(score);
    });

    it('should return null for expired risk score', async () => {
      const userId = 1;
      const score = 75.5;

      await fraudCache.cacheRiskScore(userId, score, 1); // 1 second TTL
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      const result = await fraudCache.getRiskScore(userId);
      expect(result).toBeNull();
    });
  });

  describe('IP reputation caching', () => {
    it('should cache and retrieve IP reputation', async () => {
      const ip = '192.168.1.1';
      const reputation = 'bad';

      await fraudCache.cacheIPReputation(ip, reputation);
      const result = await fraudCache.getIPReputation(ip);

      expect(result).toBe(reputation);
    });
  });

  describe('transaction pattern caching', () => {
    it('should cache and retrieve transaction pattern', async () => {
      const userId = 1;
      const pattern = {
        velocity: 10,
        averageAmount: 1000,
        riskLevel: 'medium' as const,
      };

      await fraudCache.cacheTransactionPattern(userId, pattern);
      const result = await fraudCache.getTransactionPattern(userId);

      expect(result).toEqual(pattern);
    });
  });
});

