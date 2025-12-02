/**
 * Unit Tests for Monitoring Service
 */

import { MonitoringService, REDMetrics } from '../../../../services/monitoring-service';

describe('MonitoringService', () => {
  let monitoringService: MonitoringService;

  beforeEach(() => {
    monitoringService = new MonitoringService();
  });

  describe('recordMetric', () => {
    it('should record a metric', () => {
      const metricData = {
        timestamp: Date.now(),
        endpoint: '/api/test',
        method: 'GET',
        statusCode: 200,
        duration: 100,
      };

      monitoringService.recordMetric(metricData);

      const metrics = monitoringService.getAllMetrics(60);
      expect(metrics).toHaveProperty('GET:/api/test');
    });

    it('should limit stored metrics to 1000 per endpoint', () => {
      const metricData = {
        timestamp: Date.now(),
        endpoint: '/api/test',
        method: 'GET',
        statusCode: 200,
        duration: 100,
      };

      // Record 1001 metrics
      for (let i = 0; i < 1001; i++) {
        monitoringService.recordMetric({
          ...metricData,
          timestamp: Date.now() + i,
        });
      }

      const metrics = monitoringService.getREDMetrics('/api/test', 'GET', 60);
      // Should not exceed reasonable limit
      expect(metrics.rate).toBeGreaterThan(0);
    });
  });

  describe('getREDMetrics', () => {
    it('should calculate RED metrics correctly', () => {
      const now = Date.now();
      
      // Record multiple metrics
      for (let i = 0; i < 10; i++) {
        monitoringService.recordMetric({
          timestamp: now - (i * 1000),
          endpoint: '/api/test',
          method: 'GET',
          statusCode: i < 8 ? 200 : 500, // 2 errors
          duration: 50 + (i * 10),
        });
      }

      const metrics = monitoringService.getREDMetrics('/api/test', 'GET', 60);

      expect(metrics.rate).toBeGreaterThan(0);
      expect(metrics.errors).toBe(2);
      expect(metrics.duration).toBeGreaterThan(0);
      expect(metrics.p50).toBeDefined();
      expect(metrics.p95).toBeDefined();
      expect(metrics.p99).toBeDefined();
    });

    it('should return zero metrics for non-existent endpoint', () => {
      const metrics = monitoringService.getREDMetrics('/api/nonexistent', 'GET', 60);

      expect(metrics.rate).toBe(0);
      expect(metrics.errors).toBe(0);
      expect(metrics.duration).toBe(0);
    });
  });

  describe('alerts', () => {
    it('should trigger alert for high error rate', () => {
      const now = Date.now();
      
      // Record metrics with high error rate
      for (let i = 0; i < 20; i++) {
        monitoringService.recordMetric({
          timestamp: now - (i * 1000),
          endpoint: '/api/test',
          method: 'GET',
          statusCode: i < 10 ? 500 : 200, // 50% error rate
          duration: 100,
        });
      }

      const alerts = monitoringService.getActiveAlerts();
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts.some(a => a.type === 'error')).toBe(true);
    });

    it('should trigger alert for slow response time', () => {
      monitoringService.recordMetric({
        timestamp: Date.now(),
        endpoint: '/api/slow',
        method: 'GET',
        statusCode: 200,
        duration: 2000, // 2 seconds
      });

      const alerts = monitoringService.getActiveAlerts();
      expect(alerts.some(a => a.type === 'duration')).toBe(true);
    });

    it('should resolve alerts', () => {
      // Trigger an alert
      monitoringService.recordMetric({
        timestamp: Date.now(),
        endpoint: '/api/test',
        method: 'GET',
        statusCode: 500,
        duration: 100,
      });

      const alerts = monitoringService.getActiveAlerts();
      if (alerts.length > 0) {
        const alertId = alerts[0].id;
        const resolved = monitoringService.resolveAlert(alertId);
        
        expect(resolved).toBe(true);
        expect(monitoringService.getActiveAlerts().find(a => a.id === alertId)?.resolved).toBe(true);
      }
    });
  });

  describe('getDashboardMetrics', () => {
    it('should return dashboard metrics', () => {
      // Record some metrics
      monitoringService.recordMetric({
        timestamp: Date.now(),
        endpoint: '/api/test',
        method: 'GET',
        statusCode: 200,
        duration: 100,
      });

      const dashboard = monitoringService.getDashboardMetrics();

      expect(dashboard).toHaveProperty('totalRequests');
      expect(dashboard).toHaveProperty('totalErrors');
      expect(dashboard).toHaveProperty('averageResponseTime');
      expect(dashboard).toHaveProperty('activeAlerts');
      expect(dashboard).toHaveProperty('topEndpoints');
      expect(Array.isArray(dashboard.topEndpoints)).toBe(true);
    });
  });
});

