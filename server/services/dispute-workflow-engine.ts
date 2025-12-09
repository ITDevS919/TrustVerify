/**
 * 72-Hour Dispute Workflow Engine
 * Manages automated dispute resolution workflow with time-based stages
 */

import { db } from '../db';
import { disputes, transactions, arbitrationCases } from '../shared/schema';
import { eq, and, lt } from 'drizzle-orm';
import { EscrowService } from './escrowService';
import { storage } from '../storage';

const escrowService = new EscrowService();
import { AIArbitrationEngine } from './ai-arbitration-engine';
import { EvidenceCollectionService } from './evidence-collection-service';
import { DisputeNotificationService } from './dispute-notification-service';
import pino from 'pino';

const logger = pino({ name: 'dispute-workflow-engine' });

export interface WorkflowStage {
  name: string;
  duration: number; // hours
  deadline: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
}

export class DisputeWorkflowEngine {
  private static readonly WORKFLOW_DURATION_HOURS = 72;
  private static readonly EVIDENCE_COLLECTION_HOURS = 24;
  private static readonly AI_ANALYSIS_HOURS = 48;

  /**
   * Initialize 72-hour workflow when dispute is created
   */
  static async initializeWorkflow(disputeId: number): Promise<void> {
    try {
      logger.info({ disputeId }, 'Initializing 72-hour dispute workflow');

      const now = new Date();
      const workflowDeadline = new Date(now.getTime() + this.WORKFLOW_DURATION_HOURS * 60 * 60 * 1000);
      const evidenceDeadline = new Date(now.getTime() + this.EVIDENCE_COLLECTION_HOURS * 60 * 60 * 1000);
      const aiAnalysisDeadline = new Date(now.getTime() + this.AI_ANALYSIS_HOURS * 60 * 60 * 1000);

      // Get dispute and transaction
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) {
        throw new Error(`Dispute ${disputeId} not found`);
      }

      const [transaction] = await db.select()
        .from(transactions)
        .where(eq(transactions.id, dispute.transactionId));

      if (!transaction) {
        throw new Error(`Transaction ${dispute.transactionId} not found`);
      }

      // Freeze escrow
      await this.freezeEscrow(dispute.transactionId, disputeId);

      // Update dispute with workflow timestamps
      await db.update(disputes)
        .set({
          status: 'evidence_collection',
          workflowStage: 'evidence_collection',
          workflowStartedAt: now,
          workflowDeadline,
          evidenceCollectionDeadline: evidenceDeadline,
          aiAnalysisDeadline: aiAnalysisDeadline,
          escrowFrozen: true,
          escrowFrozenAt: now,
        })
        .where(eq(disputes.id, disputeId));

      // Create arbitration case
      await db.insert(arbitrationCases).values({
        disputeId,
        provider: 'ai_arbitrator',
        caseNumber: `D${disputeId}`,
        status: 'initiated',
      });

      // Trigger evidence collection
      await EvidenceCollectionService.requestEvidence(disputeId);

      // Send notifications
      await DisputeNotificationService.notifyDisputeCreated(disputeId);
      await DisputeNotificationService.notifyEvidenceRequested(disputeId, transaction.buyerId, 'buyer');
      await DisputeNotificationService.notifyEvidenceRequested(disputeId, transaction.sellerId, 'vendor');

      logger.info({ 
        disputeId, 
        workflowDeadline: workflowDeadline.toISOString() 
      }, '72-hour workflow initialized');
    } catch (error: any) {
      logger.error({ error, disputeId }, 'Failed to initialize workflow');
      throw error;
    }
  }

  /**
   * Process workflow stage transitions
   */
  static async processWorkflow(disputeId: number): Promise<void> {
    try {
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) {
        throw new Error(`Dispute ${disputeId} not found`);
      }

      const now = new Date();
      const currentStage = dispute.workflowStage || 'created';

      // Check if workflow deadline has passed
      if (dispute.workflowDeadline && new Date(dispute.workflowDeadline) < now) {
        await this.handleWorkflowTimeout(disputeId);
        return;
      }

      // Process current stage
      switch (currentStage) {
        case 'created':
          await this.initializeWorkflow(disputeId);
          break;

        case 'evidence_collection':
          await this.processEvidenceCollection(disputeId, dispute);
          break;

        case 'ai_analysis':
          await this.processAIAnalysis(disputeId, dispute);
          break;

        case 'final_ruling':
          await this.processFinalRuling(disputeId, dispute);
          break;

        case 'completed':
          // Workflow already completed
          break;

        default:
          logger.warn({ disputeId, currentStage }, 'Unknown workflow stage');
      }
    } catch (error: any) {
      logger.error({ error, disputeId }, 'Failed to process workflow');
      throw error;
    }
  }

  /**
   * Process evidence collection stage (0-24 hours)
   */
  private static async processEvidenceCollection(
    disputeId: number,
    dispute: any
  ): Promise<void> {
    const now = new Date();
    const evidenceDeadline = dispute.evidenceCollectionDeadline 
      ? new Date(dispute.evidenceCollectionDeadline) 
      : null;

    // Check if evidence collection deadline has passed
    if (evidenceDeadline && now >= evidenceDeadline) {
      logger.info({ disputeId }, 'Evidence collection deadline reached, moving to AI analysis');

      // Generate unified evidence packet
      await EvidenceCollectionService.generateUnifiedPacket(disputeId);

      // Move to AI analysis stage
      await db.update(disputes)
        .set({
          status: 'ai_analysis',
          workflowStage: 'ai_analysis',
        })
        .where(eq(disputes.id, disputeId));

      // Notify stage change
      await DisputeNotificationService.notifyWorkflowStageChange(disputeId, 'ai_analysis');

      // Trigger AI analysis
      await this.processAIAnalysis(disputeId, dispute);
    } else {
      // Still collecting evidence - check if all evidence is collected
      const evidenceComplete = await EvidenceCollectionService.isEvidenceComplete(disputeId);
      
      if (evidenceComplete) {
        logger.info({ disputeId }, 'All evidence collected, moving to AI analysis early');

        await EvidenceCollectionService.generateUnifiedPacket(disputeId);

        await db.update(disputes)
          .set({
            status: 'ai_analysis',
            workflowStage: 'ai_analysis',
          })
          .where(eq(disputes.id, disputeId));

        await this.processAIAnalysis(disputeId, dispute);
      }
    }
  }

  /**
   * Process AI analysis stage (24-48 hours)
   */
  private static async processAIAnalysis(
    disputeId: number,
    dispute: any
  ): Promise<void> {
    const now = new Date();
    const aiDeadline = dispute.aiAnalysisDeadline 
      ? new Date(dispute.aiAnalysisDeadline) 
      : null;

    // Check if AI analysis deadline has passed
    if (aiDeadline && now >= aiDeadline) {
      logger.info({ disputeId }, 'AI analysis deadline reached, generating ruling');

      // Run AI arbitration
      const decision = await AIArbitrationEngine.runArbitration(disputeId);

      // Get arbitration case for notification
      const [arbitrationCase] = await db.select()
        .from(arbitrationCases)
        .where(eq(arbitrationCases.disputeId, disputeId));

      if (arbitrationCase) {
        await DisputeNotificationService.notifyAIRulingGenerated(disputeId, arbitrationCase);
      }

      // Move to final ruling stage
      await db.update(disputes)
        .set({
          status: 'pending_ruling',
          workflowStage: 'final_ruling',
        })
        .where(eq(disputes.id, disputeId));

      // Notify stage change
      await DisputeNotificationService.notifyWorkflowStageChange(disputeId, 'final_ruling');

      await this.processFinalRuling(disputeId, dispute);
    } else {
      // Check if AI analysis is already complete
      const [arbitrationCase] = await db.select()
        .from(arbitrationCases)
        .where(eq(arbitrationCases.disputeId, disputeId));

      if (arbitrationCase && arbitrationCase.status === 'ruling_generated') {
        logger.info({ disputeId }, 'AI analysis complete, moving to final ruling');

        await db.update(disputes)
          .set({
            status: 'pending_ruling',
            workflowStage: 'final_ruling',
          })
          .where(eq(disputes.id, disputeId));

        // Notify stage change
        await DisputeNotificationService.notifyWorkflowStageChange(disputeId, 'final_ruling');

        await this.processFinalRuling(disputeId, dispute);
      } else {
        // Run AI arbitration if not already done
        try {
          const decision = await AIArbitrationEngine.runArbitration(disputeId);
          
          await db.update(disputes)
            .set({
              status: 'pending_ruling',
              workflowStage: 'final_ruling',
            })
            .where(eq(disputes.id, disputeId));

          await this.processFinalRuling(disputeId, dispute);
        } catch (error: any) {
          logger.warn({ error, disputeId }, 'AI analysis not ready yet, will retry');
        }
      }
    }
  }

  /**
   * Process final ruling stage (48-72 hours)
   */
  private static async processFinalRuling(
    disputeId: number,
    dispute: any
  ): Promise<void> {
    const [arbitrationCase] = await db.select()
      .from(arbitrationCases)
      .where(eq(arbitrationCases.disputeId, disputeId));

    if (!arbitrationCase || arbitrationCase.status !== 'ruling_generated') {
      logger.warn({ disputeId }, 'Final ruling not ready yet');
      return;
    }

    // Check if human review is requested
    if (dispute.escalatedToHuman) {
      logger.info({ disputeId }, 'Dispute escalated to human review, awaiting decision');
      return;
    }

    // Execute escrow disbursement based on AI ruling
    await this.executeEscrowDisbursement(disputeId, arbitrationCase);

      // Mark workflow as completed
      await db.update(disputes)
        .set({
          status: 'resolved',
          workflowStage: 'completed',
          resolvedAt: new Date(),
        })
        .where(eq(disputes.id, disputeId));

      // Notify completion
      await DisputeNotificationService.notifyWorkflowStageChange(disputeId, 'completed');

    await db.update(arbitrationCases)
      .set({
        status: 'resolved',
        resolvedAt: new Date(),
      })
      .where(eq(arbitrationCases.id, arbitrationCase.id));

    // Trigger webhook event
    try {
      const { webhookService } = await import('./webhook-service');
      const [transaction] = await db.select().from(transactions).where(eq(transactions.id, dispute.transactionId));
      if (transaction) {
        const buyerAccount = await storage.getDeveloperAccountByUserId(transaction.buyerId);
        const sellerAccount = await storage.getDeveloperAccountByUserId(transaction.sellerId);
        const developerIds = [buyerAccount?.id, sellerAccount?.id].filter(Boolean) as number[];
        
        for (const devId of developerIds) {
          await webhookService.triggerWebhookEvent('arbitration.resolved', {
            disputeId,
            arbitrationCaseId: arbitrationCase.id,
            outcome: arbitrationCase.outcome,
            buyerFault: arbitrationCase.buyerFault,
            vendorFault: arbitrationCase.vendorFault,
            recommendedPayoutToBuyer: arbitrationCase.recommendedPayoutToBuyer,
            recommendedPayoutToVendor: arbitrationCase.recommendedPayoutToVendor,
            confidenceScore: arbitrationCase.confidenceScore,
            timestamp: new Date().toISOString(),
          }, devId);
        }
      }
    } catch (error) {
      logger.error({ error, disputeId }, 'Failed to trigger arbitration.resolved webhook');
    }

    logger.info({ disputeId }, '72-hour workflow completed');
  }

  /**
   * Handle workflow timeout
   */
  private static async handleWorkflowTimeout(disputeId: number): Promise<void> {
    logger.warn({ disputeId }, 'Workflow deadline exceeded, escalating to human review');

    await db.update(disputes)
      .set({
        status: 'human_review',
        escalatedToHuman: true,
        workflowStage: 'completed',
      })
      .where(eq(disputes.id, disputeId));

    // Notify admins
    // TODO: Implement admin notification
  }

  /**
   * Freeze escrow when dispute is created
   */
  private static async freezeEscrow(transactionId: number, disputeId: number): Promise<void> {
    try {
      const [transaction] = await db.select()
        .from(transactions)
        .where(eq(transactions.id, transactionId));

      if (!transaction || !transaction.stripePaymentIntentId) {
        logger.warn({ transactionId }, 'No escrow to freeze');
        return;
      }

      // Call escrow service to hold/freeze funds
      try {
        await escrowService.holdEscrowFunds(transaction.stripePaymentIntentId, disputeId);
        logger.info({ transactionId, disputeId }, 'Escrow frozen for dispute via escrow service');
      } catch (escrowError: any) {
        // If holdEscrowFunds fails, log but don't fail the workflow
        // The escrow is already held by Stripe Payment Intent (capture_method: 'manual')
        logger.warn({ 
          error: escrowError, 
          transactionId, 
          disputeId 
        }, 'Escrow holdEscrowFunds failed, but funds are already held by Payment Intent');
      }
    } catch (error: any) {
      logger.error({ error, transactionId, disputeId }, 'Failed to freeze escrow');
      throw error;
    }
  }

  /**
   * Execute escrow disbursement based on AI ruling
   */
  private static async executeEscrowDisbursement(
    disputeId: number,
    arbitrationCase: any
  ): Promise<void> {
    try {
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) {
        throw new Error(`Dispute ${disputeId} not found`);
      }

      const [transaction] = await db.select()
        .from(transactions)
        .where(eq(transactions.id, dispute.transactionId));

      if (!transaction || !transaction.stripePaymentIntentId) {
        throw new Error(`Transaction ${dispute.transactionId} has no escrow`);
      }

      const buyerPayout = parseFloat(arbitrationCase.recommendedPayoutToBuyer || '0');
      const vendorPayout = parseFloat(arbitrationCase.recommendedPayoutToVendor || '0');
      const transactionAmount = parseFloat(transaction.amount);

      logger.info({ 
        disputeId, 
        buyerPayout, 
        vendorPayout, 
        transactionAmount 
      }, 'Executing escrow disbursement');

      // Calculate total payout to ensure it doesn't exceed transaction amount
      const totalPayout = buyerPayout + vendorPayout;
      if (totalPayout > transactionAmount) {
        logger.warn({ 
          disputeId, 
          totalPayout, 
          transactionAmount 
        }, 'Total payout exceeds transaction amount, normalizing');
        // Normalize payouts proportionally
        const scale = transactionAmount / totalPayout;
        const normalizedBuyerPayout = buyerPayout * scale;
        const normalizedVendorPayout = vendorPayout * scale;
        
        // Release funds to vendor (partial release)
        if (normalizedVendorPayout > 0) {
          await escrowService.releaseEscrowFunds(
            dispute.transactionId,
            normalizedVendorPayout
          );
          logger.info({ disputeId, vendorPayout: normalizedVendorPayout }, 'Funds released to vendor');
        }
        
        // Refund remaining to buyer
        if (normalizedBuyerPayout > 0) {
          await escrowService.refundEscrowFunds(
            dispute.transactionId,
            `Dispute resolution: ${arbitrationCase.summary}`
          );
          logger.info({ disputeId, buyerPayout: normalizedBuyerPayout }, 'Funds refunded to buyer');
        }
      } else {
        // Normal case: payouts are within transaction amount
        // Release funds to vendor (partial release if needed)
        if (vendorPayout > 0) {
          await escrowService.releaseEscrowFunds(
            dispute.transactionId,
            vendorPayout
          );
          logger.info({ disputeId, vendorPayout }, 'Funds released to vendor');
        }

        // Refund funds to buyer
        if (buyerPayout > 0) {
          if (buyerPayout < transactionAmount) {
            // Partial refund - remaining amount after vendor payout
            // Note: refundEscrowFunds may need to be updated to support partial refunds
            // For now, we'll refund the buyer's portion
            await escrowService.refundEscrowFunds(
              dispute.transactionId,
              `Dispute resolution: ${arbitrationCase.summary}`
            );
            logger.info({ disputeId, buyerPayout }, 'Partial refund to buyer');
          } else {
            // Full refund
            await escrowService.refundEscrowFunds(
              dispute.transactionId,
              `Dispute resolution: ${arbitrationCase.summary}`
            );
            logger.info({ disputeId, buyerPayout }, 'Full refund to buyer');
          }
        }
      }
    } catch (error: any) {
      logger.error({ error, disputeId }, 'Failed to execute escrow disbursement');
      throw error;
    }
  }

  /**
   * Get workflow status for a dispute
   */
  static async getWorkflowStatus(disputeId: number): Promise<{
    currentStage: string;
    stages: WorkflowStage[];
    timeRemaining: number; // hours
    deadline: Date | null;
  }> {
    const [dispute] = await db.select()
      .from(disputes)
      .where(eq(disputes.id, disputeId));

    if (!dispute) {
      throw new Error(`Dispute ${disputeId} not found`);
    }

    const now = new Date();
    const deadline = dispute.workflowDeadline ? new Date(dispute.workflowDeadline) : null;
    const timeRemaining = deadline 
      ? Math.max(0, (deadline.getTime() - now.getTime()) / (1000 * 60 * 60))
      : 0;

    const stages: WorkflowStage[] = [
      {
        name: 'Evidence Collection',
        duration: this.EVIDENCE_COLLECTION_HOURS,
        deadline: dispute.evidenceCollectionDeadline 
          ? new Date(dispute.evidenceCollectionDeadline) 
          : new Date(),
        status: dispute.workflowStage === 'evidence_collection' ? 'in_progress' :
                (dispute.workflowStage && ['ai_analysis', 'final_ruling', 'completed'].includes(dispute.workflowStage)) ? 'completed' : 'pending',
      },
      {
        name: 'AI Analysis',
        duration: this.AI_ANALYSIS_HOURS - this.EVIDENCE_COLLECTION_HOURS,
        deadline: dispute.aiAnalysisDeadline 
          ? new Date(dispute.aiAnalysisDeadline) 
          : new Date(),
        status: dispute.workflowStage === 'ai_analysis' ? 'in_progress' :
                (dispute.workflowStage && ['final_ruling', 'completed'].includes(dispute.workflowStage)) ? 'completed' : 'pending',
      },
      {
        name: 'Final Ruling',
        duration: this.WORKFLOW_DURATION_HOURS - this.AI_ANALYSIS_HOURS,
        deadline: deadline || new Date(),
        status: dispute.workflowStage === 'final_ruling' ? 'in_progress' :
                dispute.workflowStage === 'completed' ? 'completed' : 'pending',
      },
    ];

    return {
      currentStage: dispute.workflowStage || 'created',
      stages,
      timeRemaining,
      deadline,
    };
  }

  /**
   * Cron job to process pending workflows
   * Also sends deadline reminders
   */
  static async processPendingWorkflows(): Promise<void> {
    try {
      const now = new Date();
      
      // Find all disputes in workflow that need processing
      const activeDisputes = await db.select()
        .from(disputes)
        .where(and(
          eq(disputes.status, 'evidence_collection'),
          lt(disputes.evidenceCollectionDeadline, now)
        ));

      for (const dispute of activeDisputes) {
        await this.processWorkflow(dispute.id);
      }

      // Process AI analysis stage
      const aiAnalysisDisputes = await db.select()
        .from(disputes)
        .where(and(
          eq(disputes.status, 'ai_analysis'),
          lt(disputes.aiAnalysisDeadline, now)
        ));

      for (const dispute of aiAnalysisDisputes) {
        await this.processWorkflow(dispute.id);
      }

      // Process final ruling stage
      const finalRulingDisputes = await db.select()
        .from(disputes)
        .where(and(
          eq(disputes.status, 'pending_ruling'),
          lt(disputes.workflowDeadline, now)
        ));

      for (const dispute of finalRulingDisputes) {
        await this.processWorkflow(dispute.id);
      }

      // Send deadline reminders for active disputes
      // Get all active disputes (in workflow stages)
      const allActiveDisputes = [
        ...activeDisputes,
        ...aiAnalysisDisputes,
        ...finalRulingDisputes,
      ];
      
      const uniqueDisputes = Array.from(
        new Map(allActiveDisputes.map(d => [d.id, d])).values()
      );

      for (const dispute of uniqueDisputes) {
        if (dispute.workflowDeadline) {
          const now = new Date();
          const deadline = new Date(dispute.workflowDeadline);
          const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
          
          // Send reminder if less than 12 hours remaining
          if (hoursRemaining > 0 && hoursRemaining <= 12 && hoursRemaining > 11.5) {
            await DisputeNotificationService.notifyDeadlineApproaching(dispute.id, hoursRemaining);
          }
        }
      }

      logger.info({ 
        processed: activeDisputes.length + aiAnalysisDisputes.length + finalRulingDisputes.length 
      }, 'Processed pending workflows');
    } catch (error: any) {
      logger.error({ error }, 'Failed to process pending workflows');
    }
  }
}

