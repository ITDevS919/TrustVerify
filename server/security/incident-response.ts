/**
 * Security Incident Response System (Rule 5.2)
 * Implements automatic threat detection and response
 */

import { db } from '../db';
import { securityIncidents, ipBlacklist, users } from '@shared/schema';
import { eq, and, desc, gt, lt } from 'drizzle-orm';
import pino from 'pino';

const logger = pino({
  name: 'incident-response',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});

export interface SecurityIncident {
  id?: number;
  incidentType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'investigating' | 'mitigated' | 'resolved';
  description: string;
  affectedSystems: string[];
  sourceIp?: string;
  userAgent?: string;
  attackVector?: string;
  autoMitigated: boolean;
  ipBlacklisted: boolean;
  socNotified: boolean;
  responseTime?: number;
  mitigationTime?: number;
  assignedTo?: number;
  escalationLevel: number;
  playbookExecuted?: string;
  evidence: any;
  resolution?: string;
  createdAt?: Date;
  resolvedAt?: Date;
}

export class IncidentResponseService {

  /**
   * Detect and log security incident (Rule 5.2)
   */
  static async createIncident(incident: Omit<SecurityIncident, 'id' | 'createdAt' | 'autoMitigated' | 'ipBlacklisted' | 'socNotified'>): Promise<number> {
    try {
      const startTime = Date.now();
      
      // Create incident record
      const [newIncident] = await db.insert(securityIncidents).values({
        incidentType: incident.incidentType,
        severity: incident.severity,
        status: 'detected',
        description: incident.description,
        affectedSystems: incident.affectedSystems,
        sourceIp: incident.sourceIp,
        userAgent: incident.userAgent,
        attackVector: incident.attackVector,
        autoMitigated: false,
        ipBlacklisted: false,
        socNotified: false,
        responseTime: Math.round((Date.now() - startTime) / 1000),
        assignedTo: incident.assignedTo,
        escalationLevel: incident.escalationLevel || 1,
        playbookExecuted: incident.playbookExecuted,
        evidence: incident.evidence,
        resolution: incident.resolution
      }).returning();

      // Trigger automatic response based on severity
      await this.triggerAutomaticResponse(newIncident.id, incident);

      logger.warn({
        incidentId: newIncident.id,
        type: incident.incidentType,
        severity: incident.severity,
        sourceIp: incident.sourceIp
      }, 'Security incident detected and logged');

      return newIncident.id;

    } catch (error) {
      logger.error({ error, incident }, 'Failed to create security incident');
      throw new Error('Failed to create security incident');
    }
  }

  /**
   * Trigger automatic response (Rule 5.2)
   */
  static async triggerAutomaticResponse(incidentId: number, incident: any): Promise<void> {
    try {
      const mitigationStart = Date.now();
      let autoMitigated = false;
      let ipBlacklisted = false;
      let socNotified = false;

      // Automatic IP blacklisting for high/critical incidents
      if ((incident.severity === 'high' || incident.severity === 'critical') && incident.sourceIp) {
        await this.blacklistIP(incident.sourceIp, incident.incidentType, incident.severity, incidentId);
        ipBlacklisted = true;
        autoMitigated = true;
        
        logger.info({ 
          incidentId, 
          sourceIp: incident.sourceIp 
        }, 'Automatic IP blacklisting executed');
      }

      // Automatic SOC notification for critical incidents
      if (incident.severity === 'critical') {
        await this.notifySOC(incidentId, incident);
        socNotified = true;
        
        logger.warn({ incidentId }, 'SOC team notified of critical incident');
      }

      // Execute specific playbooks based on incident type
      const playbookExecuted = await this.executePlaybook(incident.incidentType, incidentId, incident);
      if (playbookExecuted) {
        autoMitigated = true;
      }

      // Update incident with response details
      const mitigationTime = Math.round((Date.now() - mitigationStart) / 1000);
      
      await db.update(securityIncidents)
        .set({
          autoMitigated,
          ipBlacklisted,
          socNotified,
          mitigationTime,
          playbookExecuted,
          status: autoMitigated ? 'mitigated' : 'investigating'
        })
        .where(eq(securityIncidents.id, incidentId));

      logger.info({ 
        incidentId, 
        autoMitigated, 
        mitigationTime 
      }, 'Automatic incident response completed');

    } catch (error) {
      logger.error({ error, incidentId }, 'Failed to execute automatic response');
    }
  }

  /**
   * Blacklist IP address (Rule 5.2)
   */
  static async blacklistIP(
    ipAddress: string,
    reason: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    incidentId?: number,
    expiryHours: number = 24
  ): Promise<boolean> {
    try {
      // Check if IP is already blacklisted
      const [existingEntry] = await db.select()
        .from(ipBlacklist)
        .where(and(
          eq(ipBlacklist.ipAddress, ipAddress),
          eq(ipBlacklist.isActive, true)
        ));

      if (existingEntry) {
        logger.info({ ipAddress }, 'IP address already blacklisted');
        return true;
      }

      // Set expiry based on severity
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiryHours);

      // Create blacklist entry
      await db.insert(ipBlacklist).values({
        ipAddress,
        reason,
        severity,
        sourceType: 'automatic',
        incidentId,
        isActive: true,
        automaticExpiry: true,
        expiresAt
      });

      logger.warn({ 
        ipAddress, 
        reason, 
        severity, 
        expiresAt: expiresAt.toISOString() 
      }, 'IP address blacklisted');

      return true;

    } catch (error) {
      logger.error({ error, ipAddress }, 'Failed to blacklist IP address');
      return false;
    }
  }

  /**
   * Check if IP is blacklisted (Rule 5.2)
   */
  static async isIPBlacklisted(ipAddress: string): Promise<boolean> {
    try {
      const [blacklistEntry] = await db.select()
        .from(ipBlacklist)
        .where(and(
          eq(ipBlacklist.ipAddress, ipAddress),
          eq(ipBlacklist.isActive, true),
          gt(ipBlacklist.expiresAt, new Date())
        ));

      return !!blacklistEntry;

    } catch (error) {
      logger.error({ error, ipAddress }, 'Failed to check IP blacklist status');
      return false;
    }
  }

  /**
   * Remove IP from blacklist
   */
  static async removeIPFromBlacklist(ipAddress: string, reason: string): Promise<boolean> {
    try {
      await db.update(ipBlacklist)
        .set({
          isActive: false,
          revokedAt: new Date()
        })
        .where(and(
          eq(ipBlacklist.ipAddress, ipAddress),
          eq(ipBlacklist.isActive, true)
        ));

      logger.info({ ipAddress, reason }, 'IP address removed from blacklist');
      return true;

    } catch (error) {
      logger.error({ error, ipAddress }, 'Failed to remove IP from blacklist');
      return false;
    }
  }

  /**
   * Execute incident response playbook (Rule 5.2)
   */
  static async executePlaybook(incidentType: string, incidentId: number, incident: any): Promise<string | null> {
    try {
      let playbookName: string | null = null;

      switch (incidentType) {
        case 'sql_injection':
          playbookName = 'SQL_INJECTION_RESPONSE';
          await this.executeSQLInjectionPlaybook(incidentId, incident);
          break;

        case 'credential_stuffing':
          playbookName = 'CREDENTIAL_STUFFING_RESPONSE';
          await this.executeCredentialStuffingPlaybook(incidentId, incident);
          break;

        case 'ddos':
          playbookName = 'DDOS_RESPONSE';
          await this.executeDDoSPlaybook(incidentId, incident);
          break;

        case 'breach_attempt':
          playbookName = 'BREACH_ATTEMPT_RESPONSE';
          await this.executeBreachAttemptPlaybook(incidentId, incident);
          break;

        default:
          playbookName = 'GENERIC_SECURITY_RESPONSE';
          await this.executeGenericPlaybook(incidentId, incident);
          break;
      }

      logger.info({ 
        incidentId, 
        incidentType, 
        playbookName 
      }, 'Security playbook executed');

      return playbookName;

    } catch (error) {
      logger.error({ error, incidentId, incidentType }, 'Failed to execute playbook');
      return null;
    }
  }

  /**
   * Escalate incident (Rule 5.2)
   */
  static async escalateIncident(incidentId: number, newLevel: number, assignedTo?: number): Promise<boolean> {
    try {
      await db.update(securityIncidents)
        .set({
          escalationLevel: newLevel,
          assignedTo
        })
        .where(eq(securityIncidents.id, incidentId));

      logger.warn({ 
        incidentId, 
        newLevel, 
        assignedTo 
      }, 'Incident escalated');

      return true;

    } catch (error) {
      logger.error({ error, incidentId }, 'Failed to escalate incident');
      return false;
    }
  }

  /**
   * Resolve incident (Rule 5.2)
   */
  static async resolveIncident(incidentId: number, resolution: string, resolvedBy: number): Promise<boolean> {
    try {
      await db.update(securityIncidents)
        .set({
          status: 'resolved',
          resolution,
          resolvedAt: new Date(),
          assignedTo: resolvedBy
        })
        .where(eq(securityIncidents.id, incidentId));

      logger.info({ 
        incidentId, 
        resolvedBy 
      }, 'Security incident resolved');

      return true;

    } catch (error) {
      logger.error({ error, incidentId }, 'Failed to resolve incident');
      return false;
    }
  }

  /**
   * Get active security incidents (Rule 5.2)
   */
  static async getActiveIncidents(severity?: string): Promise<SecurityIncident[]> {
    try {
      let query = db.select()
        .from(securityIncidents)
        .where(and(
          eq(securityIncidents.status, 'detected'),
          eq(securityIncidents.status, 'investigating')
        ));

      const incidents = await query.orderBy(desc(securityIncidents.createdAt));

      return incidents.map(this.mapIncidentFromDB);

    } catch (error) {
      logger.error({ error }, 'Failed to get active incidents');
      return [];
    }
  }

  // Private playbook methods

  private static async executeSQLInjectionPlaybook(incidentId: number, incident: any): Promise<void> {
    // 1. Block the source IP immediately
    if (incident.sourceIp) {
      await this.blacklistIP(incident.sourceIp, 'SQL Injection Attempt', 'high', incidentId, 48);
    }

    // 2. Log for forensic analysis
    logger.error({ 
      incidentId, 
      sourceIp: incident.sourceIp,
      userAgent: incident.userAgent 
    }, 'SQL injection attempt detected - automatic mitigation active');

    // 3. Additional protective measures would go here
  }

  private static async executeCredentialStuffingPlaybook(incidentId: number, incident: any): Promise<void> {
    // 1. Rate limit the source IP
    if (incident.sourceIp) {
      await this.blacklistIP(incident.sourceIp, 'Credential Stuffing Attack', 'medium', incidentId, 24);
    }

    // 2. Enhanced monitoring
    logger.warn({ 
      incidentId, 
      sourceIp: incident.sourceIp 
    }, 'Credential stuffing attack detected - rate limiting applied');
  }

  private static async executeDDoSPlaybook(incidentId: number, incident: any): Promise<void> {
    // 1. Aggressive IP blocking
    if (incident.sourceIp) {
      await this.blacklistIP(incident.sourceIp, 'DDoS Attack', 'critical', incidentId, 72);
    }

    // 2. Alert infrastructure team
    logger.error({ 
      incidentId, 
      sourceIp: incident.sourceIp 
    }, 'DDoS attack detected - immediate blocking initiated');
  }

  private static async executeBreachAttemptPlaybook(incidentId: number, incident: any): Promise<void> {
    // 1. Maximum security response
    if (incident.sourceIp) {
      await this.blacklistIP(incident.sourceIp, 'Data Breach Attempt', 'critical', incidentId, 168); // 7 days
    }

    // 2. Immediate escalation
    await this.escalateIncident(incidentId, 5); // Maximum escalation

    logger.error({ 
      incidentId, 
      sourceIp: incident.sourceIp 
    }, 'Data breach attempt detected - maximum security response activated');
  }

  private static async executeGenericPlaybook(incidentId: number, incident: any): Promise<void> {
    // Generic security response
    logger.info({ 
      incidentId, 
      incidentType: incident.incidentType 
    }, 'Generic security playbook executed');
  }

  private static async notifySOC(incidentId: number, incident: any): Promise<void> {
    // In production, this would integrate with SOC notification systems
    logger.error({ 
      incidentId, 
      severity: incident.severity,
      type: incident.incidentType 
    }, 'CRITICAL INCIDENT: SOC team notification required');
  }

  private static mapIncidentFromDB(incident: any): SecurityIncident {
    return {
      id: incident.id,
      incidentType: incident.incidentType,
      severity: incident.severity as 'low' | 'medium' | 'high' | 'critical',
      status: incident.status as 'detected' | 'investigating' | 'mitigated' | 'resolved',
      description: incident.description,
      affectedSystems: incident.affectedSystems as string[],
      sourceIp: incident.sourceIp || undefined,
      userAgent: incident.userAgent || undefined,
      attackVector: incident.attackVector || undefined,
      autoMitigated: incident.autoMitigated,
      ipBlacklisted: incident.ipBlacklisted,
      socNotified: incident.socNotified,
      responseTime: incident.responseTime || undefined,
      mitigationTime: incident.mitigationTime || undefined,
      assignedTo: incident.assignedTo || undefined,
      escalationLevel: incident.escalationLevel,
      playbookExecuted: incident.playbookExecuted || undefined,
      evidence: incident.evidence,
      resolution: incident.resolution || undefined,
      createdAt: incident.createdAt,
      resolvedAt: incident.resolvedAt || undefined
    };
  }

  /**
   * Clean expired blacklist entries (Rule 5.2)
   */
  static async cleanExpiredBlacklist(): Promise<number> {
    try {
      const now = new Date();
      
      const expiredEntries = await db.update(ipBlacklist)
        .set({
          isActive: false,
          revokedAt: now
        })
        .where(and(
          eq(ipBlacklist.isActive, true),
          eq(ipBlacklist.automaticExpiry, true),
          lt(ipBlacklist.expiresAt, now)
        ))
        .returning({ id: ipBlacklist.id });

      logger.info({ count: expiredEntries.length }, 'Expired blacklist entries cleaned');
      return expiredEntries.length;

    } catch (error) {
      logger.error({ error }, 'Failed to clean expired blacklist entries');
      return 0;
    }
  }
}