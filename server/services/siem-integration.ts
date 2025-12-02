/**
 * SIEM (Security Information and Event Management) Integration
 * Per BR-OBS standards for structured audit logging
 */

import { config } from '../config';
import pino from 'pino';
import https from 'https';
import http from 'http';

const logger = pino({
  name: 'siem-integration',
  level: config.LOG_LEVEL || 'info'
});

export interface SIEMEvent {
  timestamp: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  userId?: number;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  details: Record<string, any>;
  correlationId?: string;
}

export class SIEMService {
  private endpoint: string | null = null;
  private apiKey: string | null = null;
  private provider: string | null = null;
  private enabled: boolean = false;

  constructor() {
    if (config.SIEM_ENDPOINT && config.SIEM_API_KEY) {
      this.endpoint = config.SIEM_ENDPOINT;
      this.apiKey = config.SIEM_API_KEY;
      this.provider = config.SIEM_PROVIDER || 'custom';
      this.enabled = true;
      logger.info({ provider: this.provider, endpoint: this.endpoint }, 'SIEM integration enabled');
    } else {
      logger.warn('SIEM integration not configured');
    }
  }

  /**
   * Send event to SIEM system
   */
  async sendEvent(event: SIEMEvent): Promise<boolean> {
    if (!this.enabled || !this.endpoint) {
      // Log locally if SIEM not configured
      logger.info(event, 'SIEM event (local logging)');
      return false;
    }

    try {
      const payload = this.formatEventForProvider(event);
      
      await this.sendToSIEM(payload);
      
      logger.debug({ eventType: event.eventType, severity: event.severity }, 'SIEM event sent');
      return true;
    } catch (error) {
      logger.error({ error, event }, 'Failed to send SIEM event');
      // Don't throw - SIEM failures shouldn't break the application
      return false;
    }
  }

  /**
   * Format event based on SIEM provider
   */
  private formatEventForProvider(event: SIEMEvent): any {
    const baseEvent = {
      '@timestamp': event.timestamp,
      event: {
        kind: 'event',
        category: 'security',
        type: event.eventType,
        severity: event.severity,
      },
      source: {
        ip: event.ipAddress,
        user: {
          id: event.userId,
          email: event.userEmail,
        },
      },
      http: {
        request: {
          method: event.method,
          path: event.endpoint,
        },
        response: {
          status_code: event.statusCode,
        },
      },
      user_agent: {
        original: event.userAgent,
      },
      details: event.details,
      correlation_id: event.correlationId,
    };

    switch (this.provider) {
      case 'splunk':
        return {
          time: new Date(event.timestamp).getTime() / 1000,
          host: 'trustverify',
          source: 'trustverify-api',
          sourcetype: 'json',
          event: baseEvent,
        };

      case 'datadog':
        return {
          ddsource: 'trustverify',
          ddtags: `env:${config.NODE_ENV},severity:${event.severity}`,
          hostname: 'trustverify-api',
          service: 'trustverify',
          message: JSON.stringify(baseEvent),
        };

      case 'sentry':
        return {
          level: this.mapSeverityToSentryLevel(event.severity),
          message: event.eventType,
          tags: {
            severity: event.severity,
            endpoint: event.endpoint,
          },
          extra: baseEvent,
        };

      default:
        return baseEvent;
    }
  }

  /**
   * Send HTTP request to SIEM endpoint
   */
  private async sendToSIEM(payload: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.endpoint || !this.apiKey) {
        return reject(new Error('SIEM not configured'));
      }

      const url = new URL(this.endpoint);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const postData = JSON.stringify(payload);

      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'TrustVerify-SIEM-Client/1.0',
        },
        timeout: 5000, // 5 second timeout
      };

      const req = client.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(new Error(`SIEM request failed: ${res.statusCode} ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('SIEM request timeout'));
      });

      req.write(postData);
      req.end();
    });
  }

  /**
   * Map severity to Sentry level
   */
  private mapSeverityToSentryLevel(severity: string): string {
    switch (severity) {
      case 'critical':
        return 'fatal';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'info';
    }
  }

  /**
   * Log authentication event
   */
  async logAuthEvent(
    eventType: 'login' | 'logout' | 'login_failed' | 'mfa_required' | 'mfa_verified',
    userId: number | undefined,
    userEmail: string | undefined,
    ipAddress: string | undefined,
    success: boolean,
    details?: Record<string, any>
  ): Promise<void> {
    const severity = success ? 'low' : 'high';
    
    await this.sendEvent({
      timestamp: new Date().toISOString(),
      eventType: `auth.${eventType}`,
      severity,
      source: 'trustverify-api',
      userId,
      userEmail,
      ipAddress,
      details: {
        success,
        ...details,
      },
    });
  }

  /**
   * Log security event
   */
  async logSecurityEvent(
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    userId: number | undefined,
    ipAddress: string | undefined,
    details: Record<string, any>
  ): Promise<void> {
    await this.sendEvent({
      timestamp: new Date().toISOString(),
      eventType: `security.${eventType}`,
      severity,
      source: 'trustverify-api',
      userId,
      ipAddress,
      details,
    });
  }

  /**
   * Log API access event
   */
  async logAPIAccess(
    endpoint: string,
    method: string,
    statusCode: number,
    userId: number | undefined,
    ipAddress: string | undefined,
    userAgent: string | undefined,
    details?: Record<string, any>
  ): Promise<void> {
    const severity = statusCode >= 500 ? 'high' : statusCode >= 400 ? 'medium' : 'low';
    
    await this.sendEvent({
      timestamp: new Date().toISOString(),
      eventType: 'api.access',
      severity,
      source: 'trustverify-api',
      userId,
      ipAddress,
      userAgent,
      endpoint,
      method,
      statusCode,
      details: details || {},
    });
  }
}

// Singleton instance
export const siemService = new SIEMService();

