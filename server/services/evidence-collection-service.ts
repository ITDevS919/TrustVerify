/**
 * Evidence Collection Layer
 * Collects and validates evidence from TrustVerify logs, vendor logs, and buyer evidence
 */

import { db } from '../db';
import { disputes, transactions, disputeEvidence, apiUsageLogs } from '../shared/schema';
import { eq } from 'drizzle-orm';
import pino from 'pino';

const logger = pino({ name: 'evidence-collection-service' });

export interface EvidencePacket {
  trustverifyLogs: any[];
  vendorLogs: any[];
  buyerEvidence: any[];
  unifiedPacket: any;
  collectedAt: Date;
  validated: boolean;
}

export class EvidenceCollectionService {
  /**
   * Request evidence collection when dispute is created
   */
  static async requestEvidence(disputeId: number): Promise<void> {
    try {
      logger.info({ disputeId }, 'Requesting evidence collection');

      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) {
        throw new Error(`Dispute ${disputeId} not found`);
      }

      // Automatically fetch TrustVerify logs
      await this.fetchTrustVerifyLogs(disputeId, dispute.transactionId);

      // Get transaction to notify parties
      const [transaction] = await db.select()
        .from(transactions)
        .where(eq(transactions.id, dispute.transactionId));

      if (transaction) {
        // Notify buyer to submit evidence
        const { DisputeNotificationService } = await import('./dispute-notification-service');
        await DisputeNotificationService.notifyEvidenceRequested(disputeId, transaction.buyerId, 'buyer');
        
        // Notify vendor to submit logs
        await DisputeNotificationService.notifyEvidenceRequested(disputeId, transaction.sellerId, 'vendor');
      }

      logger.info({ disputeId }, 'Evidence collection requested');
    } catch (error: any) {
      logger.error({ error, disputeId }, 'Failed to request evidence');
      throw error;
    }
  }

  /**
   * Fetch TrustVerify system logs for the transaction
   */
  static async fetchTrustVerifyLogs(disputeId: number, transactionId: number): Promise<void> {
    try {
      logger.info({ disputeId, transactionId }, 'Fetching TrustVerify logs');

      // Get transaction details
      const [transaction] = await db.select()
        .from(transactions)
        .where(eq(transactions.id, transactionId));

      if (!transaction) {
        throw new Error(`Transaction ${transactionId} not found`);
      }

      // Get audit logs related to this transaction
      // Note: This would integrate with actual audit log system
      const auditLogs = await this.getAuditLogsForTransaction(transactionId);

      // Get API usage logs if applicable
      const usageLogs = await db.select()
        .from(apiUsageLogs)
        .where(eq(apiUsageLogs.apiKeyId, transactionId)); // Adjust based on actual schema

      // Compile TrustVerify logs
      const trustverifyLogs = {
        transaction: {
          id: transaction.id,
          amount: transaction.amount,
          status: transaction.status,
          createdAt: transaction.createdAt,
          completedAt: transaction.completedAt,
          riskScore: transaction.riskScore,
          fraudFlags: transaction.fraudFlags,
        },
        auditLogs,
        usageLogs: usageLogs.map(log => ({
          endpoint: log.endpoint,
          method: log.method,
          statusCode: log.statusCode,
          responseTime: log.responseTime,
          createdAt: log.createdAt,
        })),
        systemEvents: await this.getSystemEvents(transactionId),
      };

      // Store TrustVerify logs as evidence
      await db.insert(disputeEvidence).values({
        disputeId,
        submittedBy: 0, // System user
        evidenceType: 'trustverify_logs',
        evidenceData: trustverifyLogs,
        source: 'trustverify',
        validated: true,
        validatedAt: new Date(),
      });

      logger.info({ disputeId }, 'TrustVerify logs collected');
    } catch (error: any) {
      logger.error({ error, disputeId, transactionId }, 'Failed to fetch TrustVerify logs');
      throw error;
    }
  }

  /**
   * Submit vendor logs
   */
  static async submitVendorLogs(
    disputeId: number,
    vendorId: number,
    logs: any
  ): Promise<void> {
    try {
      logger.info({ disputeId, vendorId }, 'Submitting vendor logs');

      // Validate vendor has permission
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) {
        throw new Error(`Dispute ${disputeId} not found`);
      }

      const [transaction] = await db.select()
        .from(transactions)
        .where(eq(transactions.id, dispute.transactionId));

      if (transaction.sellerId !== vendorId) {
        throw new Error('Vendor not authorized to submit logs for this dispute');
      }

      // Validate log structure
      const validated = this.validateVendorLogs(logs);

      // Store vendor logs
      await db.insert(disputeEvidence).values({
        disputeId,
        submittedBy: vendorId,
        evidenceType: 'vendor_logs',
        evidenceData: logs,
        source: 'vendor',
        validated,
        validatedAt: validated ? new Date() : null,
      });

      logger.info({ disputeId, vendorId, validated }, 'Vendor logs submitted');
    } catch (error: any) {
      logger.error({ error, disputeId, vendorId }, 'Failed to submit vendor logs');
      throw error;
    }
  }

  /**
   * Submit buyer evidence
   */
  static async submitBuyerEvidence(
    disputeId: number,
    buyerId: number,
    evidence: any
  ): Promise<void> {
    try {
      logger.info({ disputeId, buyerId }, 'Submitting buyer evidence');

      // Validate buyer has permission
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) {
        throw new Error(`Dispute ${disputeId} not found`);
      }

      if (dispute.raisedBy !== buyerId) {
        throw new Error('Buyer not authorized to submit evidence for this dispute');
      }

      // Store buyer evidence
      await db.insert(disputeEvidence).values({
        disputeId,
        submittedBy: buyerId,
        evidenceType: 'buyer_evidence',
        evidenceData: evidence,
        source: 'buyer',
        validated: false, // Buyer evidence needs validation
        validatedAt: null,
      });

      logger.info({ disputeId, buyerId }, 'Buyer evidence submitted');
    } catch (error: any) {
      logger.error({ error, disputeId, buyerId }, 'Failed to submit buyer evidence');
      throw error;
    }
  }

  /**
   * Generate unified evidence packet for AI analysis
   */
  static async generateUnifiedPacket(disputeId: number): Promise<EvidencePacket> {
    try {
      logger.info({ disputeId }, 'Generating unified evidence packet');

      // Get all evidence
      const allEvidence = await db.select()
        .from(disputeEvidence)
        .where(eq(disputeEvidence.disputeId, disputeId));

      // Separate by type
      const trustverifyLogs = allEvidence
        .filter(e => e.evidenceType === 'trustverify_logs')
        .map(e => e.evidenceData);

      const vendorLogs = allEvidence
        .filter(e => e.evidenceType === 'vendor_logs')
        .map(e => e.evidenceData);

      const buyerEvidence = allEvidence
        .filter(e => e.evidenceType === 'buyer_evidence')
        .map(e => e.evidenceData);

      // Generate unified packet
      const unifiedPacket = {
        disputeId,
        collectedAt: new Date().toISOString(),
        trustverifyLogs: trustverifyLogs.length > 0 ? trustverifyLogs[0] : null,
        vendorLogs: vendorLogs.length > 0 ? vendorLogs[0] : null,
        buyerEvidence: buyerEvidence.length > 0 ? buyerEvidence : [],
        evidenceSummary: {
          trustverifyLogsCount: trustverifyLogs.length,
          vendorLogsCount: vendorLogs.length,
          buyerEvidenceCount: buyerEvidence.length,
          totalEvidenceItems: allEvidence.length,
          validatedCount: allEvidence.filter(e => e.validated).length,
        },
        crossValidation: this.crossValidateEvidence(trustverifyLogs, vendorLogs, buyerEvidence),
      };

      // Store unified packet
      await db.insert(disputeEvidence).values({
        disputeId,
        submittedBy: 0, // System user
        evidenceType: 'unified_packet',
        evidenceData: unifiedPacket,
        source: 'ai_generated',
        validated: true,
        validatedAt: new Date(),
      });

      logger.info({ disputeId }, 'Unified evidence packet generated');

      return {
        trustverifyLogs,
        vendorLogs,
        buyerEvidence,
        unifiedPacket,
        collectedAt: new Date(),
        validated: true,
      };
    } catch (error: any) {
      logger.error({ error, disputeId }, 'Failed to generate unified evidence packet');
      throw error;
    }
  }

  /**
   * Check if evidence collection is complete
   */
  static async isEvidenceComplete(disputeId: number): Promise<boolean> {
    const evidence = await db.select()
      .from(disputeEvidence)
      .where(eq(disputeEvidence.disputeId, disputeId));

    // At minimum, we need TrustVerify logs
    const hasTrustverifyLogs = evidence.some(e => e.evidenceType === 'trustverify_logs');
    
    // Ideally, we also want vendor logs and buyer evidence
    const hasVendorLogs = evidence.some(e => e.evidenceType === 'vendor_logs');
    const hasBuyerEvidence = evidence.some(e => e.evidenceType === 'buyer_evidence');

    // Evidence is complete if we have TrustVerify logs and at least one other source
    return hasTrustverifyLogs && (hasVendorLogs || hasBuyerEvidence);
  }

  /**
   * Get audit logs for a transaction
   */
  private static async getAuditLogsForTransaction(transactionId: number): Promise<any[]> {
    // This would integrate with the actual audit log system
    // For now, return mock data structure
    return [
      {
        eventType: 'transaction.created',
        transactionId,
        timestamp: new Date().toISOString(),
      },
      {
        eventType: 'transaction.status.changed',
        transactionId,
        timestamp: new Date().toISOString(),
      },
    ];
  }

  /**
   * Get system events for a transaction
   */
  private static async getSystemEvents(_transactionId: number): Promise<any[]> {
    // This would fetch from system event logs
    return [];
  }

  /**
   * Validate vendor logs structure
   */
  private static validateVendorLogs(logs: any): boolean {
    // Basic validation - check if logs have required structure
    if (!logs || typeof logs !== 'object') {
      return false;
    }

    // Check for common log fields
    const hasTimestamp = logs.timestamp || logs.createdAt || logs.date;
    const hasEventType = logs.eventType || logs.type || logs.action;

    return hasTimestamp && hasEventType;
  }

  /**
   * Cross-validate evidence from different sources
   */
  private static crossValidateEvidence(
    trustverifyLogs: any[],
    vendorLogs: any[],
    buyerEvidence: any[]
  ): {
    consistency: number; // 0-1
    conflicts: string[];
    agreements: string[];
  } {
    const conflicts: string[] = [];
    const agreements: string[] = [];
    let consistency = 1.0;

    // Compare timestamps if available
    if (trustverifyLogs.length > 0 && vendorLogs.length > 0) {
      const tvLog = trustverifyLogs[0];
      const vendorLog = vendorLogs[0];

      // Check for timestamp discrepancies
      if (tvLog.transaction?.createdAt && vendorLog.timestamp) {
        const tvTime = new Date(tvLog.transaction.createdAt).getTime();
        const vendorTime = new Date(vendorLog.timestamp).getTime();
        const diff = Math.abs(tvTime - vendorTime);

        if (diff > 24 * 60 * 60 * 1000) { // More than 24 hours difference
          conflicts.push('Significant timestamp discrepancy between TrustVerify and vendor logs');
          consistency -= 0.2;
        } else {
          agreements.push('Timestamps are consistent');
        }
      }
    }

    // Check for amount consistency
    if (trustverifyLogs.length > 0 && buyerEvidence.length > 0) {
      const tvAmount = trustverifyLogs[0]?.transaction?.amount;
      const buyerAmount = buyerEvidence[0]?.amount;

      if (tvAmount && buyerAmount && tvAmount !== buyerAmount) {
        conflicts.push('Amount mismatch between TrustVerify logs and buyer evidence');
        consistency -= 0.3;
      } else if (tvAmount && buyerAmount) {
        agreements.push('Amounts are consistent');
      }
    }

    consistency = Math.max(0, consistency);

    return {
      consistency,
      conflicts,
      agreements,
    };
  }

  /**
   * Get all evidence for a dispute
   */
  static async getEvidence(disputeId: number): Promise<any[]> {
    const evidence = await db.select()
      .from(disputeEvidence)
      .where(eq(disputeEvidence.disputeId, disputeId))
      .orderBy(disputeEvidence.createdAt);

    return evidence.map(e => ({
      id: e.id,
      type: e.evidenceType,
      source: e.source,
      validated: e.validated,
      submittedBy: e.submittedBy,
      createdAt: e.createdAt,
      // Don't return full evidence data in list view for performance
      hasData: !!e.evidenceData,
    }));
  }
}

