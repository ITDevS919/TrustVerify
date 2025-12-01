import { Request, Response, NextFunction } from 'express';
import { User } from '@shared/schema';
import AuditService, { AuditEventType } from './audit-logger';
import pino from 'pino';

const logger = pino({ name: 'compliance' });

// GDPR Compliance
export class GDPRService {
  static readonly DATA_RETENTION_DAYS = 2555; // 7 years for financial records
  static readonly DELETION_GRACE_PERIOD = 30; // 30 days grace period
  
  static async handleDataSubjectRequest(
    requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction',
    userId: number,
    requestedBy: User,
    req: Request
  ) {
    logger.info({
      requestType,
      userId,
      requestedBy: requestedBy.id,
      ip: req.ip
    }, 'GDPR data subject request received');
    
    AuditService.logEvent({
      eventType: AuditEventType.DATA_EXPORT,
      userId: requestedBy.id,
      targetUserId: userId,
      action: `gdpr_${requestType}_request`,
      riskLevel: 'high',
      metadata: { requestType, processingLawfulBasis: 'consent' }
    }, req);
    
    // Implementation would depend on specific requirements
    return {
      requestId: `gdpr_${Date.now()}_${requestType}`,
      status: 'processing',
      expectedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      dataCategories: this.getDataCategories(requestType)
    };
  }
  
  static getDataCategories(requestType: string): string[] {
    const categories = [
      'personal_identification',
      'contact_information',
      'transaction_history',
      'kyc_documents',
      'communication_records',
      'usage_analytics',
      'security_logs'
    ];
    
    // For erasure requests, exclude legally required retention data
    if (requestType === 'erasure') {
      return categories.filter(cat => !['transaction_history', 'kyc_documents', 'security_logs'].includes(cat));
    }
    
    return categories;
  }
  
  static validateDataProcessing(purpose: string, dataType: string): boolean {
    const lawfulBases = {
      'fraud_prevention': ['transaction_data', 'identity_data', 'behavioral_data'],
      'contract_performance': ['transaction_data', 'contact_information'],
      'legal_obligation': ['kyc_documents', 'transaction_history', 'audit_logs'],
      'legitimate_interest': ['security_logs', 'usage_analytics']
    };
    
    return Object.entries(lawfulBases).some(([basis, types]) => 
      types.includes(dataType) && this.isValidPurpose(purpose, basis)
    );
  }
  
  private static isValidPurpose(purpose: string, basis: string): boolean {
    const validCombinations = {
      'fraud_prevention': ['fraud_prevention', 'legitimate_interest'],
      'transaction_processing': ['contract_performance'],
      'compliance_reporting': ['legal_obligation'],
      'security_monitoring': ['legitimate_interest']
    };
    
    return validCombinations[purpose]?.includes(basis) || false;
  }
}

// KYC/AML Compliance
export class KYCAMLService {
  static readonly SANCTIONS_LISTS = [
    'OFAC_SDN', 'EU_SANCTIONS', 'UN_SANCTIONS', 'PEP_LIST'
  ];
  
  static async performAMLScreening(user: User, req: Request): Promise<{
    status: 'clear' | 'flagged' | 'blocked';
    riskScore: number;
    flags: string[];
  }> {
    const flags: string[] = [];
    let riskScore = 0;
    
    // Sanctions screening (mock implementation)
    if (await this.checkSanctionsList(user)) {
      flags.push('sanctions_match');
      riskScore += 100;
    }
    
    // PEP screening
    if (await this.checkPEPList(user)) {
      flags.push('pep_match');
      riskScore += 50;
    }
    
    // Geographic risk assessment
    const geoRisk = await this.assessGeographicRisk(req.ip);
    riskScore += geoRisk;
    if (geoRisk > 30) {
      flags.push('high_risk_jurisdiction');
    }
    
    // Transaction pattern analysis
    const transactionRisk = await this.analyzeTransactionPatterns(user.id);
    riskScore += transactionRisk;
    if (transactionRisk > 40) {
      flags.push('suspicious_transaction_pattern');
    }
    
    let status: 'clear' | 'flagged' | 'blocked' = 'clear';
    if (riskScore >= 100) status = 'blocked';
    else if (riskScore >= 50) status = 'flagged';
    
    AuditService.logEvent({
      eventType: AuditEventType.KYC_REVIEWED,
      userId: user.id,
      action: 'aml_screening',
      metadata: { riskScore, flags, status },
      riskLevel: status === 'blocked' ? 'critical' : status === 'flagged' ? 'high' : 'low'
    }, req);
    
    return { status, riskScore, flags };
  }
  
  static async validateKYCRequirements(user: User, transactionAmount: number): Promise<{
    required: boolean;
    level: 'basic' | 'enhanced' | 'full';
    reason: string;
  }> {
    // Thresholds based on regulatory requirements
    const basicThreshold = 1000;
    const enhancedThreshold = 10000;
    const fullThreshold = 50000;
    
    if (transactionAmount >= fullThreshold) {
      return { required: true, level: 'full', reason: 'Transaction amount exceeds full KYC threshold' };
    }
    
    if (transactionAmount >= enhancedThreshold) {
      return { required: true, level: 'enhanced', reason: 'Transaction amount exceeds enhanced KYC threshold' };
    }
    
    if (transactionAmount >= basicThreshold) {
      return { required: true, level: 'basic', reason: 'Transaction amount exceeds basic KYC threshold' };
    }
    
    // Check cumulative transactions
    const monthlyTotal = await this.getMonthlyTransactionTotal(user.id);
    if (monthlyTotal >= basicThreshold) {
      return { required: true, level: 'basic', reason: 'Cumulative monthly transactions exceed threshold' };
    }
    
    return { required: false, level: 'basic', reason: 'Below regulatory thresholds' };
  }
  
  private static async checkSanctionsList(user: User): Promise<boolean> {
    // Mock implementation - in production, integrate with actual sanctions databases
    const suspiciousPatterns = ['test_sanctioned_user', 'blocked_entity'];
    return suspiciousPatterns.some(pattern => 
      user.username?.toLowerCase().includes(pattern) || 
      user.email?.toLowerCase().includes(pattern)
    );
  }
  
  private static async checkPEPList(user: User): Promise<boolean> {
    // Mock implementation - in production, integrate with PEP databases
    const pepIndicators = ['minister', 'president', 'ambassador', 'judge'];
    return pepIndicators.some(indicator => 
      user.username?.toLowerCase().includes(indicator)
    );
  }
  
  private static async assessGeographicRisk(ip: string): Promise<number> {
    // Mock implementation - in production, use IP geolocation and risk databases
    const highRiskIPs = ['192.168.1.1', '127.0.0.1']; // Mock high-risk IPs
    return highRiskIPs.includes(ip) ? 40 : 10;
  }
  
  private static async analyzeTransactionPatterns(userId: number): Promise<number> {
    // Mock implementation - analyze transaction velocity, amounts, timing
    // This would examine recent transaction history for suspicious patterns
    return Math.floor(Math.random() * 30); // Mock risk score 0-30
  }
  
  private static async getMonthlyTransactionTotal(userId: number): Promise<number> {
    // Mock implementation - sum transactions for current month
    return Math.floor(Math.random() * 5000); // Mock monthly total
  }
}

// SOC 2 Compliance
export class SOC2Service {
  static readonly CONTROLS = {
    CC1: 'Control Environment',
    CC2: 'Communication and Information',
    CC3: 'Risk Assessment',
    CC4: 'Monitoring Activities',
    CC5: 'Control Activities',
    CC6: 'Logical and Physical Access Controls',
    CC7: 'System Operations',
    CC8: 'Change Management',
    CC9: 'Risk Mitigation'
  };
  
  static async validateAccessControl(user: User, resource: string, action: string, req: Request): Promise<boolean> {
    // Log all access attempts for audit trail
    AuditService.logEvent({
      eventType: AuditEventType.DATA_EXPORT,
      userId: user.id,
      action: `access_${resource}_${action}`,
      resourceType: resource,
      metadata: { 
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      },
      riskLevel: 'low'
    }, req);
    
    // Implement least privilege principle
    return this.hasMinimumRequiredAccess(user, resource, action);
  }
  
  static async monitorSystemActivity(eventType: string, details: any, req: Request): Promise<void> {
    // Continuous monitoring for SOC 2
    const criticalEvents = [
      'configuration_change',
      'user_privilege_escalation',
      'system_access_failure',
      'data_export',
      'security_incident'
    ];
    
    const logLevel = criticalEvents.includes(eventType) ? 'critical' : 'medium';
    
    AuditService.logEvent({
      eventType: AuditEventType.ADMIN_ACTION,
      action: `soc2_monitoring_${eventType}`,
      metadata: details,
      riskLevel: logLevel
    }, req);
  }
  
  private static hasMinimumRequiredAccess(user: User, resource: string, action: string): boolean {
    // Implement role-based access control validation
    // This is a simplified version - production should use comprehensive RBAC
    const userRole = user.email?.includes('@trustverify.com') ? 'admin' : 'user';
    
    const accessMatrix = {
      'admin': ['read', 'write', 'delete', 'configure'],
      'user': ['read', 'write']
    };
    
    return accessMatrix[userRole]?.includes(action) || false;
  }
}

// Compliance middleware
export const complianceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Add compliance headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Log for compliance monitoring
  if (req.user && req.path.includes('/api/')) {
    SOC2Service.monitorSystemActivity('api_access', {
      userId: req.user.id,
      endpoint: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    }, req);
  }
  
  next();
};

export default {
  GDPRService,
  KYCAMLService,
  SOC2Service,
  complianceMiddleware
};