import pino from 'pino';
import { Request, Response } from 'express';
import { createHash } from 'crypto';
import { User } from '../shared/schema.ts';

const auditLogger = pino({
  name: 'audit',
  level: 'info',
  formatters: {
    log(object) {
      return {
        ...object,
        service: 'trustverify',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      };
    }
  }
});

export enum AuditEventType {
  // Authentication Events
  LOGIN_SUCCESS = 'auth.login.success',
  LOGIN_FAILURE = 'auth.login.failure',
  LOGOUT = 'auth.logout',
  PASSWORD_CHANGE = 'auth.password.change',
  PASSWORD_RESET_REQUEST = 'auth.password.reset.request',
  PASSWORD_RESET_SUCCESS = 'auth.password.reset.success',
  ACCOUNT_LOCKED = 'auth.account.locked',
  
  // User Management Events
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  USER_STATUS_CHANGED = 'user.status.changed',
  USER_ROLE_CHANGED = 'user.role.changed',
  
  // Transaction Events
  TRANSACTION_CREATED = 'transaction.created',
  TRANSACTION_UPDATED = 'transaction.updated',
  TRANSACTION_STATUS_CHANGED = 'transaction.status.changed',
  ESCROW_FUNDS_HELD = 'escrow.funds.held',
  ESCROW_FUNDS_RELEASED = 'escrow.funds.released',
  ESCROW_FUNDS_DISPUTED = 'escrow.funds.disputed',
  
  // KYC Events
  KYC_SUBMITTED = 'kyc.submitted',
  KYC_APPROVED = 'kyc.approved',
  KYC_REJECTED = 'kyc.rejected',
  KYC_REVIEWED = 'kyc.reviewed',
  
  // Security Events
  SUSPICIOUS_ACTIVITY = 'security.suspicious.activity',
  RATE_LIMIT_EXCEEDED = 'security.rate_limit.exceeded',
  UNAUTHORIZED_ACCESS = 'security.unauthorized.access',
  API_KEY_CREATED = 'security.api_key.created',
  API_KEY_REVOKED = 'security.api_key.revoked',
  SESSION_HIJACK_ATTEMPT = 'security.session.hijack_attempt',
  
  // Admin Events
  ADMIN_ACTION = 'admin.action',
  SYSTEM_CONFIG_CHANGED = 'admin.system_config.changed',
  BULK_OPERATION = 'admin.bulk_operation',
  
  // Data Events
  DATA_EXPORT = 'data.export',
  DATA_DELETION = 'data.deletion',
  PII_ACCESS = 'data.pii.access',
  
  // Financial Events
  PAYMENT_PROCESSED = 'payment.processed',
  PAYMENT_FAILED = 'payment.failed',
  REFUND_ISSUED = 'payment.refund.issued',
  CHARGEBACK_RECEIVED = 'payment.chargeback.received'
}

export interface AuditEvent {
  eventType: AuditEventType;
  userId?: number;
  userEmail?: string;
  targetUserId?: number;
  resourceType?: string;
  resourceId?: string;
  action?: string;
  oldValue?: any;
  newValue?: any;
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  sessionId?: string;
  success?: boolean;
  errorMessage?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

// Deterministic hashing for identifiers to keep logs PII-safe (BR-OBS-02)
function hashIdentifier(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function redactPayload(payload: any): any {
  if (payload == null) return payload;
  if (Array.isArray(payload)) return payload.map(redactPayload);
  if (typeof payload === 'object') {
    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(payload)) {
      // Keys likely to contain PII or secrets
      if (/(password|token|secret|auth|card|pan|cvv|ssn|email|phone|address|name)/i.test(k)) {
        result[k] = '[REDACTED]';
      } else {
        result[k] = redactPayload(v);
      }
    }
    return result;
  }
  return payload;
}

export class AuditService {
  static logEvent(event: AuditEvent, req?: Request) {
    const safeEvent: any = { ...event };

    // Never log raw email addresses
    if (safeEvent.userEmail) {
      safeEvent.userEmailHash = hashIdentifier(String(safeEvent.userEmail));
      delete safeEvent.userEmail;
    }
    if (safeEvent.targetUserEmail) {
      safeEvent.targetUserEmailHash = hashIdentifier(String(safeEvent.targetUserEmail));
      delete safeEvent.targetUserEmail;
    }

    // Redact any potentially sensitive payloads in metadata
    if (safeEvent.metadata) {
      safeEvent.metadata = redactPayload(safeEvent.metadata);
    }

    const auditData = {
      ...safeEvent,
      ip: event.ip || req?.ip,
      userAgent: event.userAgent || req?.get('User-Agent'),
      sessionId: req?.sessionID,
      timestamp: new Date().toISOString(),
      correlationId: req?.headers['x-correlation-id'] || this.generateCorrelationId()
    };
    
    // Determine log level based on event type and risk level
    const logLevel = this.getLogLevel(event.eventType, event.riskLevel);
    
    switch (logLevel) {
      case 'error':
        auditLogger.error(auditData, `Audit Event: ${event.eventType}`);
        break;
      case 'warn':
        auditLogger.warn(auditData, `Audit Event: ${event.eventType}`);
        break;
      case 'info':
      default:
        auditLogger.info(auditData, `Audit Event: ${event.eventType}`);
        break;
    }
    
    // For critical events, also log to separate security log
    if (event.riskLevel === 'critical') {
      this.logCriticalSecurityEvent(auditData);
    }
  }
  
  static logUserAction(
    eventType: AuditEventType,
    user: User,
    req: Request,
    additional?: Partial<AuditEvent>
  ) {
    this.logEvent({
      eventType,
      userId: user.id,
      userEmail: user.email,
      success: true,
      ...additional
    }, req);
  }
  
  static logSecurityEvent(
    eventType: AuditEventType,
    req: Request,
    additional?: Partial<AuditEvent>
  ) {
    this.logEvent({
      eventType,
      riskLevel: 'high',
      success: false,
      ...additional
    }, req);
  }
  
  static logAdminAction(
    action: string,
    admin: User,
    req: Request,
    additional?: Partial<AuditEvent>
  ) {
    this.logEvent({
      eventType: AuditEventType.ADMIN_ACTION,
      userId: admin.id,
      userEmail: admin.email,
      action,
      riskLevel: 'medium',
      success: true,
      ...additional
    }, req);
  }
  
  static logDataAccess(
    resourceType: string,
    resourceId: string,
    user: User,
    req: Request,
    containsPII: boolean = false
  ) {
    this.logEvent({
      eventType: containsPII ? AuditEventType.PII_ACCESS : AuditEventType.DATA_EXPORT,
      userId: user.id,
      userEmail: user.email,
      resourceType,
      resourceId,
      riskLevel: containsPII ? 'medium' : 'low',
      success: true
    }, req);
  }
  
  static logTransactionEvent(
    eventType: AuditEventType,
    transactionId: string,
    user: User,
    req: Request,
    additional?: Partial<AuditEvent>
  ) {
    this.logEvent({
      eventType,
      userId: user.id,
      userEmail: user.email,
      resourceType: 'transaction',
      resourceId: transactionId,
      riskLevel: 'medium',
      success: true,
      ...additional
    }, req);
  }
  
  static logFailedAttempt(
    eventType: AuditEventType,
    req: Request,
    errorMessage: string,
    additional?: Partial<AuditEvent>
  ) {
    this.logEvent({
      eventType,
      success: false,
      errorMessage,
      riskLevel: 'medium',
      ...additional
    }, req);
  }
  
  private static getLogLevel(eventType: AuditEventType, riskLevel?: string): string {
    const criticalEvents = [
      AuditEventType.ACCOUNT_LOCKED,
      AuditEventType.SUSPICIOUS_ACTIVITY,
      AuditEventType.UNAUTHORIZED_ACCESS,
      AuditEventType.SESSION_HIJACK_ATTEMPT,
      AuditEventType.SYSTEM_CONFIG_CHANGED
    ];
    
    const warningEvents = [
      AuditEventType.LOGIN_FAILURE,
      AuditEventType.RATE_LIMIT_EXCEEDED,
      AuditEventType.KYC_REJECTED,
      AuditEventType.PAYMENT_FAILED,
      AuditEventType.CHARGEBACK_RECEIVED
    ];
    
    if (riskLevel === 'critical' || criticalEvents.includes(eventType)) {
      return 'error';
    }
    
    if (riskLevel === 'high' || warningEvents.includes(eventType)) {
      return 'warn';
    }
    
    return 'info';
  }
  
  private static logCriticalSecurityEvent(auditData: any) {
    // In production, this would send to a separate security monitoring system
    auditLogger.error({
      ...auditData,
      securityAlert: true,
      severity: 'CRITICAL'
    }, `SECURITY ALERT: ${auditData.eventType}`);
  }
  
  private static generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static determineEventType(req: Request, statusCode: number): AuditEventType | null {
    const path = req.path;
    const method = req.method;
    
    if (path.includes('/login')) {
      return statusCode < 400 ? AuditEventType.LOGIN_SUCCESS : AuditEventType.LOGIN_FAILURE;
    }
    
    if (path.includes('/logout')) {
      return AuditEventType.LOGOUT;
    }
    
    if (path.includes('/register')) {
      return statusCode < 400 ? AuditEventType.USER_CREATED : AuditEventType.LOGIN_FAILURE;
    }
    
    if (path.includes('/transaction') && method === 'POST') {
      return AuditEventType.TRANSACTION_CREATED;
    }
    
    if (path.includes('/kyc') && method === 'POST') {
      return AuditEventType.KYC_SUBMITTED;
    }
    
    if (statusCode === 401) {
      return AuditEventType.UNAUTHORIZED_ACCESS;
    }
    
    if (statusCode === 429) {
      return AuditEventType.RATE_LIMIT_EXCEEDED;
    }
    
    return null;
  }
}

// Middleware to automatically log HTTP requests
export const auditMiddleware = (req: Request, res: Response, next: Function) => {
  const startTime = Date.now();
  
  // Override res.json to capture response data
  const originalJson = res.json;
  res.json = function(body: any) {
    const responseTime = Date.now() - startTime;
    
    // Log based on endpoint and status code
    if (req.path.includes('/auth') || req.path.includes('/admin') || res.statusCode >= 400) {
      const eventType = AuditService.determineEventType(req, res.statusCode);
      if (eventType) {
        AuditService.logEvent({
          eventType,
          userId: req.user?.id,
          userEmail: req.user?.email,
          action: `${req.method} ${req.path}`,
          success: res.statusCode < 400,
          metadata: {
            statusCode: res.statusCode,
            responseTime,
            requestBody: req.body,
            queryParams: req.query
          },
          riskLevel: res.statusCode >= 400 ? 'medium' : 'low'
        }, req);
      }
    }
    
    return originalJson.call(this, body);
  };
  
  next();
};


export default AuditService;