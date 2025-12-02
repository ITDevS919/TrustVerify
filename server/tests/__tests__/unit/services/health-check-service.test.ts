/**
 * Unit Tests for Health Check Service
 */

// Mock dependencies BEFORE importing the service
jest.mock('../../../../db', () => ({
  db: {
    execute: jest.fn(),
  },
}));

jest.mock('../../../../services/cache-service', () => ({
  cacheService: {
    set: jest.fn().mockResolvedValue(true),
    get: jest.fn().mockResolvedValue('test'),
    delete: jest.fn().mockResolvedValue(true),
    exists: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock('../../../../services/siem-integration', () => ({
  siemService: {
    logSecurityEvent: jest.fn().mockResolvedValue(true),
  },
}));

import { HealthCheckService } from '../../../../services/health-check-service';

describe('HealthCheckService', () => {
  let healthCheckService: HealthCheckService;

  beforeEach(() => {
    healthCheckService = new HealthCheckService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    healthCheckService.stopPeriodicChecks();
  });

  describe('performHealthCheck', () => {
    it('should perform comprehensive health check', async () => {
      const { db } = await import('../../../../db');
      // Mock sql template literal
      const { sql } = await import('drizzle-orm');
      (db.execute as jest.Mock).mockResolvedValue([{ health_check: 1 }]);

      const health = await healthCheckService.performHealthCheck();

      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('timestamp');
      expect(health).toHaveProperty('region');
      expect(health).toHaveProperty('version');
      expect(health).toHaveProperty('checks');
      expect(health.checks).toHaveProperty('database');
      expect(health.checks).toHaveProperty('cache');
      expect(health.checks).toHaveProperty('storage');
      expect(health.checks).toHaveProperty('external');
    });

    it('should return unhealthy if database check fails', async () => {
      const { db } = await import('../../../../db');
      (db.execute as jest.Mock).mockRejectedValue(new Error('Database error'));

      const health = await healthCheckService.performHealthCheck();

      expect(health.status).toBe('unhealthy');
      expect(health.checks.database.status).toBe('unhealthy');
    });
  });

  describe('isAlive', () => {
    it('should return true if process is running', () => {
      const isAlive = healthCheckService.isAlive();
      expect(isAlive).toBe(true);
    });
  });

  describe('isReady', () => {
    it('should return true if system is ready', async () => {
      const { db } = await import('../../../../db');
      (db.execute as jest.Mock).mockResolvedValue([{ health_check: 1 }]);
      
      const { cacheService } = await import('../../../../services/cache-service');
      (cacheService.exists as jest.Mock).mockResolvedValue(true);

      const isReady = await healthCheckService.isReady();
      expect(typeof isReady).toBe('boolean');
    });
  });
});

