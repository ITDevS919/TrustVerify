/**
 * Arbitration & Dispute Resolution API Routes
 * Implements 72-hour automated dispute resolution workflow
 */

import { Express, Request, Response } from 'express';
import { requireDeveloperAuth } from '../middleware/apiAuth';
import { DisputeWorkflowEngine } from '../services/dispute-workflow-engine';
import { EvidenceCollectionService } from '../services/evidence-collection-service';
import { AIArbitrationEngine } from '../services/ai-arbitration-engine';
import { db } from '../db';
import { disputes, arbitrationCases } from '../shared/schema';
import { eq } from 'drizzle-orm';
import AuditService, { AuditEventType } from '../security/audit-logger';
import { storage } from '../storage';
import pino from 'pino';

const logger = pino({ name: 'arbitration-routes' });

export function registerArbitrationRoutes(app: Express) {
  /**
   * POST /api/disputes/create
   * Create a new dispute and initialize 72-hour workflow
   */
  const createDisputeHandler = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { transactionId, reason, description, disputeType } = req.body;

      if (!transactionId || !reason || !description) {
        return res.status(400).json({ 
          error: 'transactionId, reason, and description are required' 
        });
      }

      // Create dispute
      const [newDispute] = await db.insert(disputes).values({
        transactionId,
        raisedBy: req.user.id,
        reason,
        description,
        disputeType: disputeType || 'other',
        status: 'open',
        workflowStage: 'created',
      }).returning();

      // Initialize 72-hour workflow
      await DisputeWorkflowEngine.initializeWorkflow(newDispute.id);

      // Trigger webhook event
      try {
        const { webhookService } = await import('../services/webhook-service');
        const transaction = await storage.getTransaction(transactionId);
        if (transaction) {
          const buyerAccount = await storage.getDeveloperAccountByUserId(transaction.buyerId);
          const sellerAccount = await storage.getDeveloperAccountByUserId(transaction.sellerId);
          const developerIds = [buyerAccount?.id, sellerAccount?.id].filter(Boolean) as number[];
          
          for (const devId of developerIds) {
            await webhookService.triggerWebhookEvent('escrow.disputed', {
              disputeId: newDispute.id,
              transactionId,
              reason,
              disputeType: disputeType || 'other',
              timestamp: new Date().toISOString(),
            }, devId);
          }
        }
      } catch (error) {
        console.error('Failed to trigger escrow.disputed webhook:', error);
      }

      // Log dispute creation
      await AuditService.logEvent({
        eventType: AuditEventType.ADMIN_ACTION,
        userId: req.user.id,
        action: 'dispute_created',
        resourceType: 'dispute',
        resourceId: newDispute.id.toString(),
        metadata: {
          transactionId,
          reason,
          disputeType: disputeType || 'other',
        },
        riskLevel: 'medium',
      }, req);

      logger.info({ disputeId: newDispute.id, userId: req.user.id }, 'Dispute created');

      res.status(201).json({
        success: true,
        disputeId: newDispute.id,
        message: 'Dispute created and 72-hour workflow initialized',
        workflowDeadline: newDispute.workflowDeadline,
      });
    } catch (error: any) {
      logger.error({ error }, 'Failed to create dispute');
      res.status(500).json({ error: error.message });
    }
  };

  app.post('/api/disputes/create', requireDeveloperAuth, createDisputeHandler);
  
  // API Spec alias: POST /api/arbitration/open
  app.post('/api/arbitration/open', requireDeveloperAuth, createDisputeHandler);

  /**
   * POST /api/disputes/:id/evidence
   * Submit evidence for a dispute
   */
    app.post('/api/disputes/:id/evidence', requireDeveloperAuth, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const disputeId = parseInt(req.params.id);
      const { evidenceType, evidenceData } = req.body;

      if (!evidenceType || !evidenceData) {
        return res.status(400).json({ 
          error: 'evidenceType and evidenceData are required' 
        });
      }

      // Get dispute to verify permissions
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) {
        return res.status(404).json({ error: 'Dispute not found' });
      }

      // Submit evidence based on type
      if (evidenceType === 'vendor_logs') {
        await EvidenceCollectionService.submitVendorLogs(
          disputeId,
          req.user.id,
          evidenceData
        );
      } else if (evidenceType === 'buyer_evidence') {
        await EvidenceCollectionService.submitBuyerEvidence(
          disputeId,
          req.user.id,
          evidenceData
        );
      } else {
        return res.status(400).json({ error: 'Invalid evidenceType' });
      }

      // Log evidence submission
      await AuditService.logEvent({
        eventType: AuditEventType.ADMIN_ACTION,
        userId: req.user.id,
        action: 'evidence_submitted',
        resourceType: 'dispute',
        resourceId: disputeId.toString(),
        metadata: { evidenceType },
        riskLevel: 'low',
      }, req);

      res.json({
        success: true,
        message: 'Evidence submitted successfully',
      });
    } catch (error: any) {
      logger.error({ error }, 'Failed to submit evidence');
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/disputes/:id/status
   * Get dispute status and workflow progress
   */
  const getDisputeStatusHandler = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const disputeId = parseInt(req.params.id);

      // Get dispute
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) {
        return res.status(404).json({ error: 'Dispute not found' });
      }

      // Get workflow status
      const workflowStatus = await DisputeWorkflowEngine.getWorkflowStatus(disputeId);

      // Get arbitration case if exists
      const [arbitrationCase] = await db.select()
        .from(arbitrationCases)
        .where(eq(arbitrationCases.disputeId, disputeId));

      // Get evidence
      const evidence = await EvidenceCollectionService.getEvidence(disputeId);

      res.json({
        dispute: {
          id: dispute.id,
          status: dispute.status,
          workflowStage: dispute.workflowStage,
          disputeType: dispute.disputeType,
          reason: dispute.reason,
          description: dispute.description,
          escrowFrozen: dispute.escrowFrozen,
          createdAt: dispute.createdAt,
        },
        workflow: workflowStatus,
        arbitration: arbitrationCase ? {
          status: arbitrationCase.status,
          buyerFault: arbitrationCase.buyerFault,
          vendorFault: arbitrationCase.vendorFault,
          recommendedPayoutToBuyer: arbitrationCase.recommendedPayoutToBuyer,
          recommendedPayoutToVendor: arbitrationCase.recommendedPayoutToVendor,
          summary: arbitrationCase.summary,
          confidenceScore: arbitrationCase.confidenceScore,
        } : null,
        evidence: {
          items: evidence,
          count: evidence.length,
        },
      });
    } catch (error: any) {
      logger.error({ error }, 'Failed to get dispute status');
      res.status(500).json({ error: error.message });
    }
  };

  app.get('/api/disputes/:id/status', requireDeveloperAuth, getDisputeStatusHandler);
  
  // API Spec alias: GET /api/arbitration/status/:id
  app.get('/api/arbitration/status/:id', requireDeveloperAuth, getDisputeStatusHandler);

  /**
   * POST /api/disputes/:id/run-ai
   * Manually trigger AI arbitration analysis
   */
  app.post('/api/disputes/:id/run-ai', requireDeveloperAuth, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Check if user is admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const disputeId = parseInt(req.params.id);

      // Get dispute
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) {
        return res.status(404).json({ error: 'Dispute not found' });
      }

      // Run AI arbitration
      const decision = await AIArbitrationEngine.runArbitration(disputeId);

      // Log AI arbitration run
      await AuditService.logEvent({
        eventType: AuditEventType.ADMIN_ACTION,
        userId: req.user.id,
        action: 'ai_arbitration_run',
        resourceType: 'dispute',
        resourceId: disputeId.toString(),
        metadata: {
          confidenceScore: decision.confidence_score,
          buyerFault: decision.buyer_fault,
          vendorFault: decision.vendor_fault,
        },
        riskLevel: 'medium',
      }, req);

      res.json({
        success: true,
        decision,
      });
    } catch (error: any) {
      logger.error({ error }, 'Failed to run AI arbitration');
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/disputes/:id/human-review
   * Escalate dispute to human review or override AI decision
   */
  const humanReviewHandler = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Check if user is admin or assigned agent
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin or assigned agent access required' });
      }

      const disputeId = parseInt(req.params.id);
      const { overrideDecision, overrideReason, buyerPayout, vendorPayout } = req.body;

      // Get dispute
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) {
        return res.status(404).json({ error: 'Dispute not found' });
      }

      // Get arbitration case
      const [arbitrationCase] = await db.select()
        .from(arbitrationCases)
        .where(eq(arbitrationCases.disputeId, disputeId));

      if (!arbitrationCase) {
        return res.status(404).json({ error: 'Arbitration case not found' });
      }

      // Update dispute to human review
      await db.update(disputes)
        .set({
          status: 'human_review',
          escalatedToHuman: true,
          assignedAgent: req.user.id,
        })
        .where(eq(disputes.id, disputeId));

      // If override decision provided, update arbitration case
      if (overrideDecision) {
        await db.update(arbitrationCases)
          .set({
            humanReviewed: true,
            humanReviewerId: req.user.id,
            humanOverrideReason: overrideReason,
            recommendedPayoutToBuyer: buyerPayout?.toString(),
            recommendedPayoutToVendor: vendorPayout?.toString(),
            status: 'resolved',
            resolvedAt: new Date(),
          })
          .where(eq(arbitrationCases.id, arbitrationCase.id));

        // Execute escrow disbursement with override amounts
        // This would trigger the escrow release with human-reviewed amounts
      }

      // Log human review
      await AuditService.logEvent({
        eventType: AuditEventType.ADMIN_ACTION,
        userId: req.user.id,
        action: 'human_review_escalation',
        resourceType: 'dispute',
        resourceId: disputeId.toString(),
        metadata: {
          overrideDecision: !!overrideDecision,
          overrideReason,
        },
        riskLevel: 'high',
      }, req);

      res.json({
        success: true,
        message: overrideDecision 
          ? 'Human override applied and dispute resolved'
          : 'Dispute escalated to human review',
      });
    } catch (error: any) {
      logger.error({ error }, 'Failed to escalate to human review');
      res.status(500).json({ error: error.message });
    }
  };

  app.post('/api/disputes/:id/human-review', requireDeveloperAuth, humanReviewHandler);
  
  // API Spec alias: POST /api/arbitration/decision
  app.post('/api/arbitration/decision', requireDeveloperAuth, humanReviewHandler);

  /**
   * GET /api/disputes/:id/evidence
   * Get all evidence for a dispute
   */
  app.get('/api/disputes/:id/evidence', requireDeveloperAuth, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const disputeId = parseInt(req.params.id);

      const evidence = await EvidenceCollectionService.getEvidence(disputeId);

      res.json({
        success: true,
        evidence,
        count: evidence.length,
      });
    } catch (error: any) {
      logger.error({ error }, 'Failed to get evidence');
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/escrow/create
   * Create escrow for a transaction
   */
  app.post('/api/escrow/create', requireDeveloperAuth, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { transactionId, providerPreference } = req.body;

      if (!transactionId) {
        return res.status(400).json({ error: 'transactionId is required' });
      }

      const { escrowService } = await import('../services/escrowService');
      const escrowAccount = await escrowService.createEscrowTransaction(
        parseInt(transactionId),
        providerPreference
      );

      res.json({
        success: true,
        escrowId: escrowAccount.id,
        status: escrowAccount.status,
        message: 'Escrow created successfully',
      });
    } catch (error: any) {
      logger.error({ error }, 'Failed to create escrow');
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/escrow/refund
   * Refund escrow funds
   */
  app.post('/api/escrow/refund', requireDeveloperAuth, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { transactionId, reason } = req.body;

      if (!transactionId || !reason) {
        return res.status(400).json({ error: 'transactionId and reason are required' });
      }

      const { escrowService } = await import('../services/escrowService');
      const refundResult = await escrowService.refundEscrowFunds(
        parseInt(transactionId),
        reason || 'Refund requested'
      );

      res.json({
        success: true,
        escrowId: refundResult.id,
        status: refundResult.status,
        message: 'Escrow refund processed',
      });
    } catch (error: any) {
      logger.error({ error }, 'Failed to refund escrow');
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/escrow/dispute
   * Open dispute for escrow transaction (alias to /api/disputes/create)
   */
  app.post('/api/escrow/dispute', requireDeveloperAuth, createDisputeHandler);

  /**
   * POST /api/escrow/release
   * Manually release escrow funds (admin only)
   */
  app.post('/api/escrow/release', requireDeveloperAuth, async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { transactionId, amount, reason } = req.body;

      if (!transactionId) {
        return res.status(400).json({ error: 'transactionId is required' });
      }

      const { escrowService } = await import('../services/escrowService');
      const releaseResult = await escrowService.releaseEscrowFunds(
        parseInt(transactionId),
        amount ? parseFloat(amount) : undefined
      );

      res.json({
        success: true,
        escrowId: releaseResult.id,
        status: releaseResult.status,
        message: 'Escrow release initiated',
      });
    } catch (error: any) {
      logger.error({ error }, 'Failed to release escrow');
      res.status(500).json({ error: error.message });
    }
  });
}

