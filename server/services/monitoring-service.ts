/**
 * Monitoring Service
 * Implements RED metrics (Rate, Errors, Duration) and alerting
 */

import { config } from '../config';
import pino from 'pino';
import { siemService } from './siem-integration';

const logger = pino({
  name: 'monitoring',
  level: config.LOG_LEVEL || 'info'
});

export interface REDMetrics {
  rate: number; // Requests per second
  errors: number; // Error count
  duration: number; // Average response time in ms
  p50?: number; // 50th percentile
  p95?: number; // 95th percentile
  p99?: number; // 99th percentile
}

export interface MetricData {
  timestamp: number;
  endpoint: string;
  method: string;
  statusCode: number;
  duration: number;
  userId?: number;
}

export interface Alert {
  id: string;
  type: 'rate' | 'error' | 'duration' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  threshold: number;
  current: number;
  timestamp: Date;
  resolved?: boolean;
  endpoint?: string;
  method?: string;
}

export class MonitoringService {
  private metrics: Map<string, MetricData[]> = new Map();
  private alerts: Alert[] = [];
  private alertThresholds = {
    errorRate: 0.05, // 5% error rate
    responseTime: 1000, // 1 second
    requestRate: 1000, // 1000 req/s
  };

  /**
   * Record a metric
   */
  recordMetric(metricData: MetricData): void {
    const key = `${metricData.method}:${metricData.endpoint}`;
    const metrics = this.metrics.get(key) || [];
    
    metrics.push(metricData);
    
    // Keep only last 1000 metrics per endpoint
    if (metrics.length > 1000) {
      metrics.shift();
    }
    
    this.metrics.set(key, metrics);
    
    // Check for alerts
    this.checkAlerts(key, metricData);
  }

  /**
   * Get RED metrics for an endpoint
   */
  getREDMetrics(endpoint: string, method: string, windowSeconds: number = 60): REDMetrics {
    const key = `${method}:${endpoint}`;
    const metrics = this.metrics.get(key) || [];
    
    const now = Date.now();
    const windowStart = now - (windowSeconds * 1000);
    
    const recentMetrics = metrics.filter(m => m.timestamp >= windowStart);
    
    if (recentMetrics.length === 0) {
      return {
        rate: 0,
        errors: 0,
        duration: 0,
      };
    }

    const errors = recentMetrics.filter(m => m.statusCode >= 400).length;
    const durations = recentMetrics.map(m => m.duration).sort((a, b) => a - b);
    
    const rate = recentMetrics.length / windowSeconds;
    const errorCount = errors;
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    
    const p50 = durations[Math.floor(durations.length * 0.5)];
    const p95 = durations[Math.floor(durations.length * 0.95)];
    const p99 = durations[Math.floor(durations.length * 0.99)];

    return {
      rate,
      errors: errorCount,
      duration: avgDuration,
      p50,
      p95,
      p99,
    };
  }

  /**
   * Get all metrics
   */
  getAllMetrics(windowSeconds: number = 60): Record<string, REDMetrics> {
    const result: Record<string, REDMetrics> = {};
    
    for (const [key] of this.metrics.entries()) {
      const [method, endpoint] = key.split(':');
      result[key] = this.getREDMetrics(endpoint, method, windowSeconds);
    }
    
    return result;
  }

  /**
   * Check for alert conditions
   */
  private checkAlerts(key: string, _data: MetricData): void {
    const [method, endpoint] = key.split(':');
    const metrics = this.getREDMetrics(endpoint, method, 60);
    
    // Check error rate
    const errorRate = metrics.errors / (metrics.rate * 60 || 1);
    if (errorRate > this.alertThresholds.errorRate) {
      this.triggerAlert({
        type: 'error',
        severity: errorRate > 0.2 ? 'critical' : errorRate > 0.1 ? 'high' : 'medium',
        message: `High error rate on ${method} ${endpoint}: ${(errorRate * 100).toFixed(2)}%`,
        threshold: this.alertThresholds.errorRate,
        current: errorRate,
        endpoint,
        method,
      });
    }
    
    // Check response time
    if (metrics.duration > this.alertThresholds.responseTime) {
      this.triggerAlert({
        type: 'duration',
        severity: metrics.duration > 5000 ? 'critical' : metrics.duration > 2000 ? 'high' : 'medium',
        message: `Slow response time on ${method} ${endpoint}: ${metrics.duration.toFixed(2)}ms`,
        threshold: this.alertThresholds.responseTime,
        current: metrics.duration,
        endpoint,
        method,
      });
    }
    
    // Check request rate
    if (metrics.rate > this.alertThresholds.requestRate) {
      this.triggerAlert({
        type: 'rate',
        severity: metrics.rate > 5000 ? 'critical' : 'high',
        message: `High request rate on ${method} ${endpoint}: ${metrics.rate.toFixed(2)} req/s`,
        threshold: this.alertThresholds.requestRate,
        current: metrics.rate,
        endpoint,
        method,
      });
    }
  }

  /**
   * Trigger an alert
   */
  private triggerAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'resolved'> & { endpoint: string; method: string }): void {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const fullAlert: Alert = {
      id: alertId,
      type: alert.type,
      severity: alert.severity,
      message: alert.message,
      threshold: alert.threshold,
      current: alert.current,
      endpoint: alert.endpoint,
      method: alert.method,
      timestamp: new Date(),
      resolved: false,
    };
    
    // Check if similar alert already exists
    const existingAlert = this.alerts.find(
      a => a.type === alert.type &&
           a.endpoint === alert.endpoint &&
           a.method === alert.method &&
           !a.resolved &&
           Date.now() - a.timestamp.getTime() < 300000 // 5 minutes
    );
    
    if (existingAlert) {
      return; // Don't duplicate recent alerts
    }
    
    this.alerts.push(fullAlert);
    
    // Log to SIEM
    siemService.logSecurityEvent(
      `alert_${alert.type}`,
      alert.severity,
      undefined,
      undefined,
      {
        alertId,
        message: alert.message,
        threshold: alert.threshold,
        current: alert.current,
        endpoint: alert.endpoint,
        method: alert.method,
      }
    ).catch(() => {});
    
    logger.warn({
      alert: fullAlert,
    }, 'Alert triggered');
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => !a.resolved);
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      return true;
    }
    return false;
  }

  /**
   * Get metrics summary for dashboard
   */
  getDashboardMetrics(): {
    totalRequests: number;
    totalErrors: number;
    averageResponseTime: number;
    activeAlerts: number;
    topEndpoints: Array<{ endpoint: string; method: string; metrics: REDMetrics }>;
  } {
    const allMetrics = this.getAllMetrics(300); // 5 minutes window
    const activeAlerts = this.getActiveAlerts();
    
    let totalRequests = 0;
    let totalErrors = 0;
    let totalDuration = 0;
    let metricCount = 0;
    
    const topEndpoints: Array<{ endpoint: string; method: string; metrics: REDMetrics }> = [];
    
    for (const [key, metrics] of Object.entries(allMetrics)) {
      const [method, endpoint] = key.split(':');
      totalRequests += metrics.rate * 300; // Convert to total requests
      totalErrors += metrics.errors;
      totalDuration += metrics.duration;
      metricCount++;
      
      topEndpoints.push({ endpoint, method, metrics });
    }
    
    // Sort by request rate
    topEndpoints.sort((a, b) => b.metrics.rate - a.metrics.rate);
    
    return {
      totalRequests: Math.round(totalRequests),
      totalErrors,
      averageResponseTime: metricCount > 0 ? totalDuration / metricCount : 0,
      activeAlerts: activeAlerts.length,
      topEndpoints: topEndpoints.slice(0, 10), // Top 10
    };
  }
}

// Singleton instance
export const monitoringService = new MonitoringService();

/**
 * Middleware to record metrics
 */
export function metricsMiddleware(req: any, res: any, next: any): void {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    monitoringService.recordMetric({
      timestamp: startTime,
      endpoint: req.path,
      method: req.method,
      statusCode: res.statusCode,
      duration,
      userId: req.user?.id,
    });
  });
  
  next();
}

