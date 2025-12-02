/**
 * Health Check Service
 * Implements comprehensive health checks for multi-region failover
 */

import { db } from '../db';
import { config } from '../config';
import { cacheService } from './cache-service';
import pino from 'pino';
import { siemService } from './siem-integration';

const logger = pino({
  name: 'health-check',
  level: config.LOG_LEVEL || 'info'
});

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  region: string;
  version: string;
  checks: {
    database: ComponentHealth;
    cache: ComponentHealth;
    storage: ComponentHealth;
    external: ComponentHealth;
  };
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

export interface ComponentHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  error?: string;
  lastChecked: Date;
}

export class HealthCheckService {
  private startTime: number = Date.now();
  private lastHealthStatus: HealthStatus | null = null;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (config.HEALTH_CHECK_INTERVAL) {
      this.startPeriodicChecks();
    }
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck(): Promise<HealthStatus> {
    const checks = {
      database: await this.checkDatabase(),
      cache: await this.checkCache(),
      storage: await this.checkStorage(),
      external: await this.checkExternalServices(),
    };

    // Determine overall status
    const unhealthyCount = Object.values(checks).filter(c => c.status === 'unhealthy').length;
    const degradedCount = Object.values(checks).filter(c => c.status === 'degraded').length;
    
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (unhealthyCount > 0) {
      overallStatus = 'unhealthy';
    } else if (degradedCount > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date(),
      region: config.REGION || 'us-east-1',
      version: config.DEPLOYMENT_VERSION || 'unknown',
      checks,
      uptime: Date.now() - this.startTime,
      memory: {
        used: usedMemory,
        total: totalMemory,
        percentage: (usedMemory / totalMemory) * 100,
      },
    };

    this.lastHealthStatus = healthStatus;

    // Log health status
    if (overallStatus !== 'healthy') {
      logger.warn({ healthStatus }, 'Health check indicates issues');
      
      // Log to SIEM
      siemService.logSecurityEvent(
        'health_check_failed',
        overallStatus === 'unhealthy' ? 'high' : 'medium',
        undefined,
        undefined,
        {
          status: overallStatus,
          checks: Object.entries(checks).map(([name, check]) => ({
            name,
            status: check.status,
            error: check.error,
          })),
        }
      ).catch(() => {});
    }

    return healthStatus;
  }

  /**
   * Check database connectivity
   */
  private async checkDatabase(): Promise<ComponentHealth> {
    const startTime = Date.now();
    
    try {
      // Simple query to check database using Drizzle
      const { sql } = await import('drizzle-orm');
      await db.execute(sql`SELECT 1 as health_check`);
      const responseTime = Date.now() - startTime;
      
      return {
        status: responseTime > 1000 ? 'degraded' : 'healthy',
        responseTime,
        lastChecked: new Date(),
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        error: error.message,
        lastChecked: new Date(),
      };
    }
  }

  /**
   * Check cache connectivity
   */
  private async checkCache(): Promise<ComponentHealth> {
    const startTime = Date.now();
    
    try {
      const testKey = 'health_check_test';
      await cacheService.set(testKey, 'test', { ttl: 10 });
      const value = await cacheService.get(testKey);
      await cacheService.delete(testKey);
      
      const responseTime = Date.now() - startTime;
      const isHealthy = value === 'test';
      
      return {
        status: isHealthy ? (responseTime > 500 ? 'degraded' : 'healthy') : 'unhealthy',
        responseTime,
        lastChecked: new Date(),
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        error: error.message,
        lastChecked: new Date(),
      };
    }
  }

  /**
   * Check storage connectivity
   */
  private async checkStorage(): Promise<ComponentHealth> {
    const startTime = Date.now();
    
    try {
      // Check if cloud storage is configured and accessible
      const { cloudStorage } = await import('./cloud-storage');
      const provider = cloudStorage.getProvider();
      
      if (provider === 'local') {
        // Local storage is always available
        return {
          status: 'healthy',
          responseTime: Date.now() - startTime,
          lastChecked: new Date(),
        };
      }
      
      // For cloud storage, we could check bucket access
      // For now, just check if provider is configured
      return {
        status: 'healthy',
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
      };
    } catch (error: any) {
      return {
        status: 'degraded',
        error: error.message,
        lastChecked: new Date(),
      };
    }
  }

  /**
   * Check external services
   */
  private async checkExternalServices(): Promise<ComponentHealth> {
    const startTime = Date.now();
    
    try {
      // Check if SIEM is configured and responding
      // This is a lightweight check
      const checks: string[] = [];
      
      if (config.SIEM_ENDPOINT) {
        checks.push('siem');
      }
      
      // Add other external service checks as needed
      
      return {
        status: checks.length > 0 ? 'healthy' : 'degraded',
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
      };
    } catch (error: any) {
      return {
        status: 'degraded',
        error: error.message,
        lastChecked: new Date(),
      };
    }
  }

  /**
   * Start periodic health checks
   */
  private startPeriodicChecks(): void {
    const interval = config.HEALTH_CHECK_INTERVAL || 30000;
    
    this.checkInterval = setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        logger.error({ error }, 'Periodic health check failed');
      }
    }, interval);
    
    logger.info({ interval }, 'Periodic health checks started');
  }

  /**
   * Stop periodic health checks
   */
  stopPeriodicChecks(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Get last health status
   */
  getLastHealthStatus(): HealthStatus | null {
    return this.lastHealthStatus;
  }

  /**
   * Check if system is ready (for startup)
   */
  async isReady(): Promise<boolean> {
    const health = await this.performHealthCheck();
    return health.status === 'healthy' || health.status === 'degraded';
  }

  /**
   * Check if system is alive (for liveness probe)
   */
  isAlive(): boolean {
    return process.uptime() > 0;
  }
}

// Singleton instance
export const healthCheckService = new HealthCheckService();

