/**
 * Dispute Notification Service
 * Sends notifications for dispute workflow stages and important events
 */

import { db } from '../db';
import { disputes, transactions, users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { EmailTemplateService } from './email-templates';
import pino from 'pino';

const logger = pino({ name: 'dispute-notification-service' });

export interface DisputeNotificationData {
  disputeId: number;
  transactionId: number;
  buyerId: number;
  vendorId: number;
  stage: string;
  deadline?: Date;
  timeRemaining?: number;
  message?: string;
}

export class DisputeNotificationService {
  /**
   * Send notification when dispute is created
   */
  static async notifyDisputeCreated(disputeId: number): Promise<void> {
    try {
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) return;

      const [transaction] = await db.select()
        .from(transactions)
        .where(eq(transactions.id, dispute.transactionId));

      if (!transaction) return;

      // Notify buyer
      const [buyer] = await db.select()
        .from(users)
        .where(eq(users.id, transaction.buyerId));

      if (buyer?.email) {
        await this.sendDisputeCreatedEmail(
          buyer.email,
          buyer.firstName || buyer.username || 'User',
          disputeId,
          transaction.id,
          dispute.workflowDeadline
        );
      }

      // Notify vendor
      const [vendor] = await db.select()
        .from(users)
        .where(eq(users.id, transaction.sellerId));

      if (vendor?.email) {
        await this.sendDisputeCreatedEmail(
          vendor.email,
          vendor.firstName || vendor.username || 'User',
          disputeId,
          transaction.id,
          dispute.workflowDeadline
        );
      }

      logger.info({ disputeId }, 'Dispute creation notifications sent');
    } catch (error: any) {
      logger.error({ error, disputeId }, 'Failed to send dispute creation notifications');
    }
  }

  /**
   * Send notification when evidence is requested
   */
  static async notifyEvidenceRequested(disputeId: number, userId: number, userType: 'buyer' | 'vendor'): Promise<void> {
    try {
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) return;

      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, userId));

      if (!user?.email) return;

      await this.sendEvidenceRequestEmail(
        user.email,
        user.firstName || user.username || 'User',
        disputeId,
        dispute.evidenceCollectionDeadline,
        userType
      );

      logger.info({ disputeId, userId, userType }, 'Evidence request notification sent');
    } catch (error: any) {
      logger.error({ error, disputeId, userId }, 'Failed to send evidence request notification');
    }
  }

  /**
   * Send notification when workflow stage changes
   */
  static async notifyWorkflowStageChange(disputeId: number, newStage: string): Promise<void> {
    try {
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) return;

      const [transaction] = await db.select()
        .from(transactions)
        .where(eq(transactions.id, dispute.transactionId));

      if (!transaction) return;

      // Notify both parties
      const [buyer] = await db.select()
        .from(users)
        .where(eq(users.id, transaction.buyerId));

      const [vendor] = await db.select()
        .from(users)
        .where(eq(users.id, transaction.sellerId));

      const stageMessages: Record<string, string> = {
        'evidence_collection': 'Evidence collection phase has started. Please submit your evidence.',
        'ai_analysis': 'AI analysis phase has begun. Your dispute is being analyzed.',
        'final_ruling': 'Final ruling has been generated. Review the decision.',
        'completed': 'Your dispute has been resolved.',
        'human_review': 'Your dispute has been escalated to human review.',
      };

      const message = stageMessages[newStage] || 'Your dispute status has been updated.';

      if (buyer?.email) {
        await this.sendWorkflowUpdateEmail(
          buyer.email,
          buyer.firstName || buyer.username || 'User',
          disputeId,
          newStage,
          message,
          dispute.workflowDeadline
        );
      }

      if (vendor?.email) {
        await this.sendWorkflowUpdateEmail(
          vendor.email,
          vendor.firstName || vendor.username || 'User',
          disputeId,
          newStage,
          message,
          dispute.workflowDeadline
        );
      }

      logger.info({ disputeId, newStage }, 'Workflow stage change notifications sent');
    } catch (error: any) {
      logger.error({ error, disputeId }, 'Failed to send workflow stage change notifications');
    }
  }

  /**
   * Send notification when AI ruling is generated
   */
  static async notifyAIRulingGenerated(disputeId: number, ruling: any): Promise<void> {
    try {
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) return;

      const [transaction] = await db.select()
        .from(transactions)
        .where(eq(transactions.id, dispute.transactionId));

      if (!transaction) return;

      const [buyer] = await db.select()
        .from(users)
        .where(eq(users.id, transaction.buyerId));

      const [vendor] = await db.select()
        .from(users)
        .where(eq(users.id, transaction.sellerId));

      if (buyer?.email) {
        await this.sendAIRulingEmail(
          buyer.email,
          buyer.firstName || buyer.username || 'User',
          disputeId,
          ruling,
          'buyer'
        );
      }

      if (vendor?.email) {
        await this.sendAIRulingEmail(
          vendor.email,
          vendor.firstName || vendor.username || 'User',
          disputeId,
          ruling,
          'vendor'
        );
      }

      logger.info({ disputeId }, 'AI ruling notifications sent');
    } catch (error: any) {
      logger.error({ error, disputeId }, 'Failed to send AI ruling notifications');
    }
  }

  /**
   * Send notification when deadline is approaching
   */
  static async notifyDeadlineApproaching(disputeId: number, hoursRemaining: number): Promise<void> {
    try {
      const [dispute] = await db.select()
        .from(disputes)
        .where(eq(disputes.id, disputeId));

      if (!dispute) return;

      const [transaction] = await db.select()
        .from(transactions)
        .where(eq(transactions.id, dispute.transactionId));

      if (!transaction) return;

      // Only notify if less than 12 hours remaining
      if (hoursRemaining > 12) return;

      const [buyer] = await db.select()
        .from(users)
        .where(eq(users.id, transaction.buyerId));

      const [vendor] = await db.select()
        .from(users)
        .where(eq(users.id, transaction.sellerId));

      if (buyer?.email) {
        await this.sendDeadlineReminderEmail(
          buyer.email,
          buyer.firstName || buyer.username || 'User',
          disputeId,
          hoursRemaining
        );
      }

      if (vendor?.email) {
        await this.sendDeadlineReminderEmail(
          vendor.email,
          vendor.firstName || vendor.username || 'User',
          disputeId,
          hoursRemaining
        );
      }

      logger.info({ disputeId, hoursRemaining }, 'Deadline reminder notifications sent');
    } catch (error: any) {
      logger.error({ error, disputeId }, 'Failed to send deadline reminder notifications');
    }
  }

  /**
   * Send dispute created email
   */
  private static async sendDisputeCreatedEmail(
    to: string,
    name: string,
    disputeId: number,
    transactionId: number,
    deadline: Date | null
  ): Promise<void> {
    const template = {
      subject: `Dispute Created - Case #D${disputeId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Dispute Created</h2>
          <p>Hello ${name},</p>
          <p>A dispute has been created for transaction #${transactionId}.</p>
          <p><strong>Dispute ID:</strong> D${disputeId}</p>
          ${deadline ? `<p><strong>Resolution Deadline:</strong> ${deadline.toLocaleString()}</p>` : ''}
          <p>The 72-hour automated resolution process has begun. You will be notified at each stage.</p>
          <p>Please submit any relevant evidence through the dispute portal.</p>
          <p><a href="${process.env.FRONTEND_URL || 'https://www.trustverify.co.uk'}/disputes/${disputeId}">View Dispute</a></p>
          <p>Best regards,<br>TrustVerify Team</p>
        </div>
      `,
      body: `Dispute Created - Case #D${disputeId}\n\nHello ${name},\n\nA dispute has been created for transaction #${transactionId}.\nDispute ID: D${disputeId}\n${deadline ? `Resolution Deadline: ${deadline.toLocaleString()}\n` : ''}\nThe 72-hour automated resolution process has begun. Please submit any relevant evidence.\n\nView Dispute: ${process.env.FRONTEND_URL || 'https://www.trustverify.co.uk'}/disputes/${disputeId}`,
    };

    await EmailTemplateService.sendEmail(to, template);
  }

  /**
   * Send evidence request email
   */
  private static async sendEvidenceRequestEmail(
    to: string,
    name: string,
    disputeId: number,
    deadline: Date | null,
    userType: 'buyer' | 'vendor'
  ): Promise<void> {
    const evidenceType = userType === 'buyer' 
      ? 'your evidence (screenshots, documents, etc.)' 
      : 'your service logs and documentation';

    const template = {
      subject: `Evidence Required - Dispute #D${disputeId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Evidence Required</h2>
          <p>Hello ${name},</p>
          <p>Your participation is required for dispute #D${disputeId}.</p>
          <p><strong>Please submit:</strong> ${evidenceType}</p>
          ${deadline ? `<p><strong>Deadline:</strong> ${deadline.toLocaleString()}</p>` : ''}
          <p>This evidence will be used in the AI arbitration process to reach a fair resolution.</p>
          <p><a href="${process.env.FRONTEND_URL || 'https://www.trustverify.co.uk'}/disputes/${disputeId}/evidence">Submit Evidence</a></p>
          <p>Best regards,<br>TrustVerify Team</p>
        </div>
      `,
      body: `Evidence Required - Dispute #D${disputeId}\n\nHello ${name},\n\nYour participation is required for dispute #D${disputeId}.\nPlease submit: ${evidenceType}\n${deadline ? `Deadline: ${deadline.toLocaleString()}\n` : ''}\nSubmit Evidence: ${process.env.FRONTEND_URL || 'https://www.trustverify.co.uk'}/disputes/${disputeId}/evidence`,
    };

    await EmailTemplateService.sendEmail(to, template);
  }

  /**
   * Send workflow update email
   */
  private static async sendWorkflowUpdateEmail(
    to: string,
    name: string,
    disputeId: number,
    stage: string,
    message: string,
    deadline: Date | null
  ): Promise<void> {
    const template = {
      subject: `Dispute Update - Case #D${disputeId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Dispute Status Update</h2>
          <p>Hello ${name},</p>
          <p>Your dispute #D${disputeId} has progressed to a new stage.</p>
          <p><strong>Current Stage:</strong> ${stage.replace('_', ' ').toUpperCase()}</p>
          <p><strong>Update:</strong> ${message}</p>
          ${deadline ? `<p><strong>Resolution Deadline:</strong> ${deadline.toLocaleString()}</p>` : ''}
          <p><a href="${process.env.FRONTEND_URL || 'https://www.trustverify.co.uk'}/disputes/${disputeId}">View Dispute Status</a></p>
          <p>Best regards,<br>TrustVerify Team</p>
        </div>
      `,
      body: `Dispute Update - Case #D${disputeId}\n\nHello ${name},\n\nYour dispute #D${disputeId} has progressed to a new stage.\nCurrent Stage: ${stage.replace('_', ' ').toUpperCase()}\nUpdate: ${message}\n${deadline ? `Resolution Deadline: ${deadline.toLocaleString()}\n` : ''}\nView Dispute: ${process.env.FRONTEND_URL || 'https://www.trustverify.co.uk'}/disputes/${disputeId}`,
    };

    await EmailTemplateService.sendEmail(to, template);
  }

  /**
   * Send AI ruling email
   */
  private static async sendAIRulingEmail(
    to: string,
    name: string,
    disputeId: number,
    ruling: any,
    userType: 'buyer' | 'vendor'
  ): Promise<void> {
    const buyerPayout = parseFloat(ruling.recommendedPayoutToBuyer || ruling.recommended_payout_to_buyer || '0');
    const vendorPayout = parseFloat(ruling.recommendedPayoutToVendor || ruling.recommended_payout_to_vendor || '0');
    const userPayout = userType === 'buyer' ? buyerPayout : vendorPayout;

    const template = {
      subject: `Dispute Resolution - Case #D${disputeId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Dispute Resolution</h2>
          <p>Hello ${name},</p>
          <p>The AI arbitration has completed for dispute #D${disputeId}.</p>
          <h3>Ruling Summary</h3>
          <p><strong>${ruling.summary || 'Decision has been made based on evidence analysis.'}</strong></p>
          <p><strong>Your Payout:</strong> $${userPayout.toFixed(2)}</p>
          <p><strong>Confidence Score:</strong> ${((parseFloat(ruling.confidenceScore || ruling.confidence_score || '0')) * 100).toFixed(0)}%</p>
          <p>Funds will be disbursed according to this ruling. If you disagree, you can request human review.</p>
          <p><a href="${process.env.FRONTEND_URL || 'https://www.trustverify.co.uk'}/disputes/${disputeId}">View Full Details</a></p>
          <p>Best regards,<br>TrustVerify Team</p>
        </div>
      `,
      body: `Dispute Resolution - Case #D${disputeId}\n\nHello ${name},\n\nThe AI arbitration has completed for dispute #D${disputeId}.\n\nRuling Summary:\n${ruling.summary || 'Decision has been made based on evidence analysis.'}\n\nYour Payout: $${userPayout.toFixed(2)}\nConfidence Score: ${((parseFloat(ruling.confidenceScore || ruling.confidence_score || '0')) * 100).toFixed(0)}%\n\nView Full Details: ${process.env.FRONTEND_URL || 'https://www.trustverify.co.uk'}/disputes/${disputeId}`,
    };

    await EmailTemplateService.sendEmail(to, template);
  }

  /**
   * Send deadline reminder email
   */
  private static async sendDeadlineReminderEmail(
    to: string,
    name: string,
    disputeId: number,
    hoursRemaining: number
  ): Promise<void> {
    const template = {
      subject: `Deadline Reminder - Dispute #D${disputeId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Deadline Reminder</h2>
          <p>Hello ${name},</p>
          <p>This is a reminder that dispute #D${disputeId} has <strong>${Math.round(hoursRemaining)} hours</strong> remaining until resolution.</p>
          <p>Please ensure all evidence has been submitted and review the current status.</p>
          <p><a href="${process.env.FRONTEND_URL || 'https://www.trustverify.co.uk'}/disputes/${disputeId}">View Dispute</a></p>
          <p>Best regards,<br>TrustVerify Team</p>
        </div>
      `,
      body: `Deadline Reminder - Dispute #D${disputeId}\n\nHello ${name},\n\nThis is a reminder that dispute #D${disputeId} has ${Math.round(hoursRemaining)} hours remaining until resolution.\n\nView Dispute: ${process.env.FRONTEND_URL || 'https://www.trustverify.co.uk'}/disputes/${disputeId}`,
    };

    await EmailTemplateService.sendEmail(to, template);
  }
}

