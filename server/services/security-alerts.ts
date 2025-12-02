/**
 * Security Alerts and Dashboards Service
 * Monitors auth failures, exfiltration signals, and security events
 */

import { config } from '../config';
import pino from 'pino';
import { siemService } from './siem-integration';
import { telemetryService } from './telemetry';

const logger = pino({
  name: 'security-alerts',
  level: config.LOG_LEVEL || 'info'
});

export interface SecurityAlert {
  id: string;
  type: 'auth_failure' | 'exfiltration' | 'suspicious_activity' | 'data_breach' | 'rate_limit' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  userId?: number;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  correlationId?: string;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: number;
}

export interface AlertRule {
  id: string;
  name: string;
  type: SecurityAlert['type'];
  condition: (data: any) => boolean;
  threshold?: number;
  window?: number; // Time window in milliseconds
  severity: SecurityAlert['severity'];
  enabled: boolean;
}

export interface DashboardMetrics {
  authFailures: {
    last24h: number;
    last7d: number;
    last30d: number;
    byIp: Array<{ ip: string; count: number }>;
    byUser: Array<{ userId: number; count: number }>;
  };
  exfiltrationSignals: {
    last24h: number;
    last7d: number;
    suspiciousExports: number;
    largeDataAccess: number;
  };
  securityEvents: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  rateLimitHits: {
    last24h: number;
    topEndpoints: Array<{ endpoint: string; count: number }>;
  };
}

export class SecurityAlertsService {
  private alerts: SecurityAlert[] = [];
  private alertRules: AlertRule[] = [];
  private authFailureCounts: Map<string, { count: number; firstSeen: Date; lastSeen: Date }> = new Map();
  private exfiltrationSignals: Array<{ timestamp: Date; userId?: number; endpoint: string; dataSize: number }> = [];

  constructor() {
    this.initializeDefaultRules();
    this.startMonitoring();
  }

  /**
   * Initialize default alert rules
   */
  private initializeDefaultRules(): void {
    this.alertRules = [
      {
        id: 'auth_failure_threshold',
        name: 'Multiple Auth Failures',
        type: 'auth_failure',
        condition: (data: { count: number }) => data.count >= 5,
        threshold: 5,
        window: 15 * 60 * 1000, // 15 minutes
        severity: 'high',
        enabled: true,
      },
      {
        id: 'exfiltration_large_export',
        name: 'Large Data Export',
        type: 'exfiltration',
        condition: (data: { size: number }) => data.size > 10000, // 10k records
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'exfiltration_rapid_exports',
        name: 'Rapid Data Exports',
        type: 'exfiltration',
        condition: (data: { count: number }) => data.count >= 10,
        threshold: 10,
        window: 60 * 60 * 1000, // 1 hour
        severity: 'high',
        enabled: true,
      },
      {
        id: 'rate_limit_exceeded',
        name: 'Rate Limit Exceeded',
        type: 'rate_limit',
        condition: () => true, // Always trigger
        severity: 'medium',
        enabled: true,
      },
    ];
  }

  /**
   * Record authentication failure
   */
  recordAuthFailure(userId: number | undefined, ipAddress: string, userAgent?: string, endpoint?: string): void {
    const key = `${ipAddress}_${userId || 'anonymous'}`;
    const now = new Date();
    
    const existing = this.authFailureCounts.get(key);
    if (existing) {
      existing.count++;
      existing.lastSeen = now;
    } else {
      this.authFailureCounts.set(key, {
        count: 1,
        firstSeen: now,
        lastSeen: now,
      });
    }

    const context = telemetryService.createContext({} as any);
    
    // Check if threshold exceeded
    const rule = this.alertRules.find(r => r.type === 'auth_failure' && r.enabled);
    if (rule && rule.condition({ count: existing?.count || 1 })) {
      this.createAlert({
        type: 'auth_failure',
        severity: rule.severity,
        title: 'Multiple Authentication Failures Detected',
        description: `${existing?.count || 1} authentication failures from IP ${ipAddress}${userId ? ` for user ${userId}` : ''}`,
        userId,
        ipAddress,
        userAgent,
        endpoint,
        metadata: {
          failureCount: existing?.count || 1,
          timeWindow: rule.window,
        },
        correlationId: context.correlationId,
      });
    }

    // Log to SIEM
    siemService.logSecurityEvent(
      'auth_failure',
      'medium',
      userId,
      ipAddress,
      {
        userAgent,
        endpoint,
        failureCount: existing?.count || 1,
        correlationId: context.correlationId,
      }
    ).catch(() => {});
  }

  /**
   * Record potential data exfiltration
   */
  recordExfiltrationSignal(
    userId: number | undefined,
    endpoint: string,
    dataSize: number,
    ipAddress?: string
  ): void {
    const now = new Date();
    this.exfiltrationSignals.push({
      timestamp: now,
      userId,
      endpoint,
      dataSize,
    });

    // Keep only last 24 hours
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    this.exfiltrationSignals = this.exfiltrationSignals.filter(s => s.timestamp > cutoff);

    const context = telemetryService.createContext({} as any);

    // Check for large export
    const largeExportRule = this.alertRules.find(r => r.type === 'exfiltration' && r.id === 'exfiltration_large_export');
    if (largeExportRule && largeExportRule.enabled && largeExportRule.condition({ size: dataSize })) {
      this.createAlert({
        type: 'exfiltration',
        severity: largeExportRule.severity,
        title: 'Large Data Export Detected',
        description: `Large data export detected: ${dataSize} records from ${endpoint}`,
        userId,
        ipAddress,
        endpoint,
        metadata: {
          dataSize,
          threshold: largeExportRule.threshold,
        },
        correlationId: context.correlationId,
      });
    }

    // Check for rapid exports
    const recentExports = this.exfiltrationSignals.filter(s => {
      const timeDiff = now.getTime() - s.timestamp.getTime();
      return timeDiff <= (60 * 60 * 1000); // Last hour
    });

    const rapidExportRule = this.alertRules.find(r => r.type === 'exfiltration' && r.id === 'exfiltration_rapid_exports');
    if (rapidExportRule && rapidExportRule.enabled && rapidExportRule.condition({ count: recentExports.length })) {
      this.createAlert({
        type: 'exfiltration',
        severity: rapidExportRule.severity,
        title: 'Rapid Data Exports Detected',
        description: `${recentExports.length} data exports in the last hour from ${endpoint}`,
        userId,
        ipAddress,
        endpoint,
        metadata: {
          exportCount: recentExports.length,
          timeWindow: '1 hour',
        },
        correlationId: context.correlationId,
      });
    }

    // Log to SIEM
    siemService.logSecurityEvent(
      'data_exfiltration',
      dataSize > 10000 ? 'critical' : 'high',
      userId,
      ipAddress,
      {
        endpoint,
        dataSize,
        correlationId: context.correlationId,
      }
    ).catch(() => {});
  }

  /**
   * Create security alert
   */
  createAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp' | 'resolved'>): SecurityAlert {
    const newAlert: SecurityAlert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      resolved: false,
    };

    this.alerts.push(newAlert);

    // Keep only last 1000 alerts
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }

    logger.warn({
      alertId: newAlert.id,
      type: newAlert.type,
      severity: newAlert.severity,
      userId: newAlert.userId,
      ipAddress: newAlert.ipAddress,
    }, `Security Alert: ${newAlert.title}`);

    // Send to SIEM
    siemService.logSecurityEvent(
      newAlert.type,
      newAlert.severity,
      newAlert.userId,
      newAlert.ipAddress,
      {
        title: newAlert.title,
        description: newAlert.description,
        endpoint: newAlert.endpoint,
        correlationId: newAlert.correlationId,
      }
    ).catch(() => {});

    return newAlert;
  }

  /**
   * Get dashboard metrics
   */
  getDashboardMetrics(): DashboardMetrics {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Auth failures
    const authFailures24h = Array.from(this.authFailureCounts.values())
      .filter(a => a.lastSeen >= last24h)
      .reduce((sum, a) => sum + a.count, 0);

    const authFailures7d = Array.from(this.authFailureCounts.values())
      .filter(a => a.lastSeen >= last7d)
      .reduce((sum, a) => sum + a.count, 0);

    const authFailures30d = Array.from(this.authFailureCounts.values())
      .filter(a => a.lastSeen >= last30d)
      .reduce((sum, a) => sum + a.count, 0);

    // Group by IP
    const byIp = new Map<string, number>();
    Array.from(this.authFailureCounts.entries()).forEach(([key, data]) => {
      if (data.lastSeen >= last24h) {
        const ip = key.split('_')[0];
        byIp.set(ip, (byIp.get(ip) || 0) + data.count);
      }
    });

    // Group by User
    const byUser = new Map<number, number>();
    Array.from(this.authFailureCounts.entries()).forEach(([key, data]) => {
      if (data.lastSeen >= last24h) {
        const parts = key.split('_');
        if (parts[1] && parts[1] !== 'anonymous') {
          const userId = parseInt(parts[1], 10);
          if (!isNaN(userId)) {
            byUser.set(userId, (byUser.get(userId) || 0) + data.count);
          }
        }
      }
    });

    // Exfiltration signals
    const exfiltration24h = this.exfiltrationSignals.filter(s => s.timestamp >= last24h).length;
    const exfiltration7d = this.exfiltrationSignals.filter(s => s.timestamp >= last7d).length;
    const suspiciousExports = this.exfiltrationSignals.filter(s => s.dataSize > 10000).length;
    const largeDataAccess = this.exfiltrationSignals.filter(s => s.dataSize > 5000).length;

    // Security events by severity
    const alerts24h = this.alerts.filter(a => a.timestamp >= last24h);
    const securityEvents = {
      critical: alerts24h.filter(a => a.severity === 'critical').length,
      high: alerts24h.filter(a => a.severity === 'high').length,
      medium: alerts24h.filter(a => a.severity === 'medium').length,
      low: alerts24h.filter(a => a.severity === 'low').length,
    };

    // Rate limit hits
    const rateLimitAlerts = alerts24h.filter(a => a.type === 'rate_limit');
    const rateLimitEndpoints = new Map<string, number>();
    rateLimitAlerts.forEach(a => {
      if (a.endpoint) {
        rateLimitEndpoints.set(a.endpoint, (rateLimitEndpoints.get(a.endpoint) || 0) + 1);
      }
    });

    return {
      authFailures: {
        last24h: authFailures24h,
        last7d: authFailures7d,
        last30d: authFailures30d,
        byIp: Array.from(byIp.entries())
          .map(([ip, count]) => ({ ip, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        byUser: Array.from(byUser.entries())
          .map(([userId, count]) => ({ userId, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
      },
      exfiltrationSignals: {
        last24h: exfiltration24h,
        last7d: exfiltration7d,
        suspiciousExports,
        largeDataAccess,
      },
      securityEvents,
      rateLimitHits: {
        last24h: rateLimitAlerts.length,
        topEndpoints: Array.from(rateLimitEndpoints.entries())
          .map(([endpoint, count]) => ({ endpoint, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
      },
    };
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(severity?: SecurityAlert['severity']): SecurityAlert[] {
    let alerts = this.alerts.filter(a => !a.resolved);
    
    if (severity) {
      alerts = alerts.filter(a => a.severity === severity);
    }

    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string, resolvedBy: number): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) {
      return false;
    }

    alert.resolved = true;
    alert.resolvedAt = new Date();
    alert.resolvedBy = resolvedBy;

    logger.info({ alertId, resolvedBy }, 'Security alert resolved');

    return true;
  }

  /**
   * Start monitoring loop
   */
  private startMonitoring(): void {
    // Cleanup old data every hour
    setInterval(() => {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      // Cleanup old auth failures
      Array.from(this.authFailureCounts.entries()).forEach(([key, data]) => {
        if (data.lastSeen < cutoff) {
          this.authFailureCounts.delete(key);
        }
      });
    }, 60 * 60 * 1000);
  }
}

export const securityAlerts = new SecurityAlertsService();

