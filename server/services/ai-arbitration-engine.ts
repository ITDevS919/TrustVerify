/**
 * AI Arbitration Engine
 * Evaluates disputes using AI to compare SLA contracts vs actual performance
 * Generates fault scores and rulings within 72-hour timeframe
 */

import { db } from '../db';
import { disputes, transactions, arbitrationCases, disputeEvidence } from '../shared/schema';
import { eq, and } from 'drizzle-orm';
import pino from 'pino';

const logger = pino({ name: 'ai-arbitration-engine' });

export interface AIDecisionOutput {
  dispute_id: string;
  buyer_fault: number; // 0.00 to 1.00
  vendor_fault: number; // 0.00 to 1.00
  recommended_payout_to_buyer: number;
  recommended_payout_to_vendor: number;
  summary: string;
  confidence_score: number; // 0.00 to 1.00
  analysis_details?: {
    sla_violations?: string[];
    performance_metrics?: Record<string, any>;
    anomalies_detected?: string[];
    evidence_quality?: number;
  };
}

export interface SLAContract {
  uptime_requirement?: number; // percentage
  response_time_max?: number; // milliseconds
  delivery_deadline?: Date;
  quality_standards?: string[];
  performance_metrics?: Record<string, number>;
}

export class AIArbitrationEngine {
  /**
   * Run AI arbitration analysis on a dispute
   */
  static async runArbitration(disputeId: number): Promise<AIDecisionOutput> {
    try {
      logger.info({ disputeId }, 'Starting AI arbitration analysis');

      // Get dispute details
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) {
        throw new Error(`Dispute ${disputeId} not found`);
      }

      // Get transaction details
      const [transaction] = await db.select()
        .from(transactions)
        .where(eq(transactions.id, dispute.transactionId));

      if (!transaction) {
        throw new Error(`Transaction ${dispute.transactionId} not found`);
      }

      // Collect all evidence
      const evidence = await this.collectEvidence(disputeId);

      // Parse SLA contract (from transaction milestones or metadata)
      const slaContract = this.parseSLAContract(transaction);

      // Compare SLA vs actual performance
      const performanceComparison = await this.compareSLAvsPerformance(
        slaContract,
        evidence,
        transaction
      );

      // Detect anomalies
      const anomalies = this.detectAnomalies(evidence, transaction);

      // Generate fault scores
      const faultScores = this.calculateFaultScores(
        performanceComparison,
        anomalies,
        evidence,
        dispute
      );

      // Calculate recommended payouts
      const transactionAmount = parseFloat(transaction.amount);
      const payouts = this.calculatePayouts(
        faultScores,
        transactionAmount,
        dispute
      );

      // Generate summary
      const summary = this.generateSummary(
        faultScores,
        performanceComparison,
        anomalies,
        dispute
      );

      // Calculate confidence score
      const confidenceScore = this.calculateConfidenceScore(
        evidence,
        performanceComparison,
        anomalies
      );

      // Create AI decision output
      const decision: AIDecisionOutput = {
        dispute_id: `D${disputeId}`,
        buyer_fault: faultScores.buyerFault,
        vendor_fault: faultScores.vendorFault,
        recommended_payout_to_buyer: payouts.buyer,
        recommended_payout_to_vendor: payouts.vendor,
        summary,
        confidence_score: confidenceScore,
        analysis_details: {
          sla_violations: performanceComparison.violations,
          performance_metrics: performanceComparison.metrics,
          anomalies_detected: anomalies,
          evidence_quality: this.assessEvidenceQuality(evidence),
        },
      };

      // Store arbitration case result
      await this.storeArbitrationResult(disputeId, decision);

      logger.info({ disputeId, decision }, 'AI arbitration analysis completed');

      return decision;
    } catch (error: any) {
      logger.error({ error, disputeId }, 'Failed to run AI arbitration');
      throw error;
    }
  }

  /**
   * Collect all evidence for the dispute
   */
  private static async collectEvidence(disputeId: number): Promise<any[]> {
    const evidenceRecords = await db.select()
      .from(disputeEvidence)
      .where(eq(disputeEvidence.disputeId, disputeId));

    return evidenceRecords.map(record => ({
      type: record.evidenceType,
      data: record.evidenceData,
      source: record.source,
      validated: record.validated,
      submittedBy: record.submittedBy,
      createdAt: record.createdAt,
    }));
  }

  /**
   * Parse SLA contract from transaction metadata
   */
  private static parseSLAContract(transaction: any): SLAContract {
    const milestones = transaction.milestones || {};
    const metadata = transaction.milestones?.metadata || {};

    return {
      uptime_requirement: metadata.uptime_requirement || 99.9,
      response_time_max: metadata.response_time_max || 200,
      delivery_deadline: metadata.delivery_deadline 
        ? new Date(metadata.delivery_deadline) 
        : undefined,
      quality_standards: metadata.quality_standards || [],
      performance_metrics: metadata.performance_metrics || {},
    };
  }

  /**
   * Compare SLA requirements vs actual performance
   */
  private static async compareSLAvsPerformance(
    sla: SLAContract,
    evidence: any[],
    transaction: any
  ): Promise<{
    violations: string[];
    metrics: Record<string, any>;
    compliance_score: number;
  }> {
    const violations: string[] = [];
    const metrics: Record<string, any> = {};

    // Extract performance data from evidence
    const trustverifyLogs = evidence.find(e => e.type === 'trustverify_logs');
    const vendorLogs = evidence.find(e => e.type === 'vendor_logs');

    // Check uptime requirement
    if (sla.uptime_requirement) {
      const actualUptime = this.extractUptime(trustverifyLogs, vendorLogs);
      metrics.uptime_actual = actualUptime;
      metrics.uptime_required = sla.uptime_requirement;

      if (actualUptime < sla.uptime_requirement) {
        violations.push(
          `Uptime requirement violated: ${actualUptime}% < ${sla.uptime_requirement}%`
        );
      }
    }

    // Check response time
    if (sla.response_time_max) {
      const avgResponseTime = this.extractAvgResponseTime(trustverifyLogs, vendorLogs);
      metrics.response_time_actual = avgResponseTime;
      metrics.response_time_max = sla.response_time_max;

      if (avgResponseTime > sla.response_time_max) {
        violations.push(
          `Response time exceeded: ${avgResponseTime}ms > ${sla.response_time_max}ms`
        );
      }
    }

    // Check delivery deadline
    if (sla.delivery_deadline) {
      const actualDelivery = transaction.completedAt 
        ? new Date(transaction.completedAt) 
        : new Date();
      metrics.delivery_deadline = sla.delivery_deadline.toISOString();
      metrics.delivery_actual = actualDelivery.toISOString();

      if (actualDelivery > sla.delivery_deadline) {
        violations.push(
          `Delivery deadline missed: ${actualDelivery.toISOString()} > ${sla.delivery_deadline.toISOString()}`
        );
      }
    }

    // Calculate compliance score (0-1)
    const complianceScore = violations.length === 0 ? 1.0 : 
      Math.max(0, 1 - (violations.length * 0.2));

    return {
      violations,
      metrics,
      compliance_score: complianceScore,
    };
  }

  /**
   * Detect anomalies in evidence and transaction data
   */
  private static detectAnomalies(evidence: any[], transaction: any): string[] {
    const anomalies: string[] = [];

    // Check for missing evidence
    const hasTrustverifyLogs = evidence.some(e => e.type === 'trustverify_logs');
    const hasVendorLogs = evidence.some(e => e.type === 'vendor_logs');
    const hasBuyerEvidence = evidence.some(e => e.type === 'buyer_evidence');

    if (!hasTrustverifyLogs) {
      anomalies.push('Missing TrustVerify system logs');
    }
    if (!hasVendorLogs) {
      anomalies.push('Missing vendor-provided logs');
    }
    if (!hasBuyerEvidence) {
      anomalies.push('Missing buyer-submitted evidence');
    }

    // Check for timing anomalies
    const transactionAge = Date.now() - new Date(transaction.createdAt).getTime();
    const daysSinceTransaction = transactionAge / (1000 * 60 * 60 * 24);

    if (daysSinceTransaction > 30) {
      anomalies.push(`Dispute filed ${Math.round(daysSinceTransaction)} days after transaction`);
    }

    // Check for amount anomalies
    const transactionAmount = parseFloat(transaction.amount);
    if (transactionAmount > 10000) {
      anomalies.push('High-value transaction may require additional scrutiny');
    }

    return anomalies;
  }

  /**
   * Calculate fault scores for buyer and vendor
   */
  private static calculateFaultScores(
    performanceComparison: any,
    anomalies: string[],
    evidence: any[],
    dispute: any
  ): { buyerFault: number; vendorFault: number } {
    let buyerFault = 0.0;
    let vendorFault = 0.0;

    // Base fault on SLA violations
    const violationCount = performanceComparison.violations.length;
    if (violationCount > 0) {
      // Vendor is at fault for SLA violations
      vendorFault += Math.min(0.7, violationCount * 0.2);
    }

    // Adjust based on compliance score
    vendorFault += (1 - performanceComparison.compliance_score) * 0.3;

    // Adjust based on dispute type
    switch (dispute.disputeType) {
      case 'sla_breach':
        vendorFault += 0.2;
        break;
      case 'item_not_received':
        vendorFault += 0.15;
        break;
      case 'quality_issue':
        vendorFault += 0.1;
        buyerFault += 0.05; // Buyer might have unrealistic expectations
        break;
      case 'scam':
        vendorFault += 0.3;
        break;
      case 'unauthorized_charge':
        buyerFault += 0.1; // Could be buyer's payment method issue
        vendorFault += 0.2; // But vendor should verify
        break;
    }

    // Adjust based on evidence quality
    const evidenceQuality = this.assessEvidenceQuality(evidence);
    if (evidenceQuality < 0.5) {
      // Poor evidence quality - reduce confidence in fault assignment
      buyerFault *= 0.8;
      vendorFault *= 0.8;
    }

    // Adjust based on anomalies
    if (anomalies.length > 2) {
      // Multiple anomalies suggest systemic issues
      vendorFault += 0.1;
    }

    // Normalize to 0-1 range
    buyerFault = Math.min(1.0, Math.max(0.0, buyerFault));
    vendorFault = Math.min(1.0, Math.max(0.0, vendorFault));

    // Ensure they sum to approximately 1.0 (allowing for shared fault)
    const total = buyerFault + vendorFault;
    if (total > 1.0) {
      buyerFault = buyerFault / total;
      vendorFault = vendorFault / total;
    }

    return { buyerFault, vendorFault };
  }

  /**
   * Calculate recommended payouts based on fault scores
   */
  private static calculatePayouts(
    faultScores: { buyerFault: number; vendorFault: number },
    transactionAmount: number,
    dispute: any
  ): { buyer: number; vendor: number } {
    // If vendor is completely at fault, buyer gets full refund
    if (faultScores.vendorFault >= 0.9 && faultScores.buyerFault < 0.1) {
      return {
        buyer: transactionAmount,
        vendor: 0,
      };
    }

    // If buyer is completely at fault, vendor gets full payment
    if (faultScores.buyerFault >= 0.9 && faultScores.vendorFault < 0.1) {
      return {
        buyer: 0,
        vendor: transactionAmount,
      };
    }

    // Split based on fault percentages
    // Vendor gets: transactionAmount * (1 - vendorFault)
    // Buyer gets: transactionAmount * vendorFault (refund)
    const vendorPayout = transactionAmount * (1 - faultScores.vendorFault);
    const buyerRefund = transactionAmount * faultScores.vendorFault;

    return {
      buyer: Math.round(buyerRefund * 100) / 100,
      vendor: Math.round(vendorPayout * 100) / 100,
    };
  }

  /**
   * Generate human-readable summary
   */
  private static generateSummary(
    faultScores: { buyerFault: number; vendorFault: number },
    performanceComparison: any,
    anomalies: string[],
    dispute: any
  ): string {
    const parts: string[] = [];

    if (faultScores.vendorFault > 0.7) {
      parts.push('Vendor is primarily at fault.');
    } else if (faultScores.buyerFault > 0.7) {
      parts.push('Buyer is primarily at fault.');
    } else {
      parts.push('Fault is shared between buyer and vendor.');
    }

    if (performanceComparison.violations.length > 0) {
      parts.push(`SLA violations detected: ${performanceComparison.violations.length} violation(s).`);
      parts.push(`Primary issue: ${performanceComparison.violations[0]}`);
    }

    if (dispute.disputeType === 'sla_breach') {
      parts.push('Vendor breached SLA requirements.');
    }

    return parts.join(' ');
  }

  /**
   * Calculate confidence score for the AI decision
   */
  private static calculateConfidenceScore(
    evidence: any[],
    performanceComparison: any,
    anomalies: string[]
  ): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence with more evidence
    const evidenceCount = evidence.length;
    confidence += Math.min(0.2, evidenceCount * 0.05);

    // Increase confidence if evidence is validated
    const validatedCount = evidence.filter(e => e.validated).length;
    confidence += Math.min(0.15, validatedCount * 0.05);

    // Increase confidence with clear SLA violations
    if (performanceComparison.violations.length > 0) {
      confidence += 0.15;
    }

    // Decrease confidence with anomalies
    confidence -= Math.min(0.2, anomalies.length * 0.05);

    // Ensure 0-1 range
    return Math.min(1.0, Math.max(0.0, confidence));
  }

  /**
   * Assess quality of collected evidence
   */
  private static assessEvidenceQuality(evidence: any[]): number {
    if (evidence.length === 0) return 0.0;

    let quality = 0.0;
    let count = 0;

    evidence.forEach(e => {
      let itemQuality = 0.5; // Base quality

      if (e.validated) itemQuality += 0.3;
      if (e.data && typeof e.data === 'object' && Object.keys(e.data).length > 0) {
        itemQuality += 0.2;
      }

      quality += itemQuality;
      count++;
    });

    return count > 0 ? quality / count : 0.0;
  }

  /**
   * Extract uptime from logs
   */
  private static extractUptime(trustverifyLogs: any, vendorLogs: any): number {
    // Mock implementation - in production, parse actual logs
    // This would analyze system logs to calculate actual uptime
    return 98.5; // Mock value
  }

  /**
   * Extract average response time from logs
   */
  private static extractAvgResponseTime(trustverifyLogs: any, vendorLogs: any): number {
    // Mock implementation - in production, parse actual logs
    return 250; // Mock value in milliseconds
  }

  /**
   * Store arbitration result in database
   */
  private static async storeArbitrationResult(
    disputeId: number,
    decision: AIDecisionOutput
  ): Promise<void> {
    // Find or create arbitration case
    const [existingCase] = await db.select()
      .from(arbitrationCases)
      .where(eq(arbitrationCases.disputeId, disputeId));

    if (existingCase) {
      await db.update(arbitrationCases)
        .set({
          status: 'ruling_generated',
          buyerFault: decision.buyer_fault.toString(),
          vendorFault: decision.vendor_fault.toString(),
          recommendedPayoutToBuyer: decision.recommended_payout_to_buyer.toString(),
          recommendedPayoutToVendor: decision.recommended_payout_to_vendor.toString(),
          summary: decision.summary,
          confidenceScore: decision.confidence_score.toString(),
          aiAnalysisResult: decision.analysis_details,
          arbitratorNotes: JSON.stringify(decision),
        })
        .where(eq(arbitrationCases.id, existingCase.id));
    } else {
      await db.insert(arbitrationCases).values({
        disputeId,
        provider: 'ai_arbitrator',
        caseNumber: decision.dispute_id,
        status: 'ruling_generated',
        buyerFault: decision.buyer_fault.toString(),
        vendorFault: decision.vendor_fault.toString(),
        recommendedPayoutToBuyer: decision.recommended_payout_to_buyer.toString(),
        recommendedPayoutToVendor: decision.recommended_payout_to_vendor.toString(),
        summary: decision.summary,
        confidenceScore: decision.confidence_score.toString(),
        aiAnalysisResult: decision.analysis_details,
        arbitratorNotes: JSON.stringify(decision),
      });
    }
  }
}

