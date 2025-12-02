/**
 * GDPR Data Retention and Deletion Service
 * Implements automated data retention policies and deletion workflows
 */

import { storage } from '../storage';
import { config } from '../config';
import { db } from '../db';
import { 
  users, 
  transactions, 
  messages, 
  kycVerifications, 
  scamReports,
  disputes,
  apiUsageLogs,
  passwordResets
} from '../shared/schema';
import { lt, and, eq, sql } from 'drizzle-orm';
import pino from 'pino';
import { siemService } from './siem-integration';

const logger = pino({
  name: 'gdpr-data-management',
  level: config.LOG_LEVEL || 'info'
});

export interface DataRetentionPolicy {
  dataType: string;
  retentionDays: number;
  legalBasis: string;
  canDelete: boolean;
}

export interface DeletionRequest {
  userId: number;
  requestedAt: Date;
  requestedBy: number; // User who requested (could be the same user or admin)
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  reason?: string;
  scheduledDeletionDate?: Date;
}

export class GDPRDataManagementService {
  private readonly retentionDays = config.DATA_RETENTION_DAYS || 2555; // 7 years default
  private readonly gracePeriodDays = 30; // 30 days grace period before deletion

  /**
   * Data retention policies per data type
   */
  private readonly retentionPolicies: DataRetentionPolicy[] = [
    {
      dataType: 'transaction_history',
      retentionDays: 2555, // 7 years (legal requirement for financial records)
      legalBasis: 'legal_obligation',
      canDelete: false, // Cannot delete due to legal requirements
    },
    {
      dataType: 'kyc_documents',
      retentionDays: 2555, // 7 years (AML compliance)
      legalBasis: 'legal_obligation',
      canDelete: false,
    },
    {
      dataType: 'personal_identification',
      retentionDays: 365, // 1 year after account closure
      legalBasis: 'consent',
      canDelete: true,
    },
    {
      dataType: 'communication_records',
      retentionDays: 730, // 2 years
      legalBasis: 'legitimate_interest',
      canDelete: true,
    },
    {
      dataType: 'usage_analytics',
      retentionDays: 365, // 1 year
      legalBasis: 'legitimate_interest',
      canDelete: true,
    },
    {
      dataType: 'security_logs',
      retentionDays: 365, // 1 year
      legalBasis: 'legitimate_interest',
      canDelete: true,
    },
    {
      dataType: 'api_usage_logs',
      retentionDays: 90, // 3 months
      legalBasis: 'legitimate_interest',
      canDelete: true,
    },
    {
      dataType: 'password_reset_tokens',
      retentionDays: 1, // 1 day (temporary tokens)
      legalBasis: 'legitimate_interest',
      canDelete: true,
    },
  ];

  /**
   * Process data retention - delete expired data based on policies
   */
  async processDataRetention(): Promise<{
    deleted: Record<string, number>;
    errors: string[];
  }> {
    const deleted: Record<string, number> = {};
    const errors: string[] = [];

    logger.info('Starting data retention processing');

    for (const policy of this.retentionPolicies) {
      if (!policy.canDelete) {
        continue; // Skip non-deletable data
      }

      try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - policy.retentionDays);

        let count = 0;

        switch (policy.dataType) {
          case 'password_reset_tokens':
            count = await this.deleteExpiredPasswordResets(cutoffDate);
            break;
          case 'api_usage_logs':
            count = await this.deleteExpiredApiLogs(cutoffDate);
            break;
          case 'usage_analytics':
            // Analytics deletion would be handled separately
            count = 0;
            break;
          case 'security_logs':
            // Security logs deletion would be handled separately
            count = 0;
            break;
        }

        if (count > 0) {
          deleted[policy.dataType] = count;
          logger.info({ dataType: policy.dataType, count }, 'Deleted expired data');
        }
      } catch (error: any) {
        const errorMsg = `Failed to process retention for ${policy.dataType}: ${error.message}`;
        errors.push(errorMsg);
        logger.error({ error, dataType: policy.dataType }, 'Data retention error');
      }
    }

    // Log to SIEM
    await siemService.logSecurityEvent(
      'data_retention_processed',
      errors.length > 0 ? 'medium' : 'low',
      undefined,
      undefined,
      { deleted, errors: errors.length }
    );

    return { deleted, errors };
  }

  /**
   * Request data deletion (GDPR Right to Erasure)
   */
  async requestDataDeletion(
    userId: number,
    requestedBy: number,
    reason?: string
  ): Promise<DeletionRequest> {
    logger.info({ userId, requestedBy, reason }, 'Data deletion requested');

    // Check if user has active transactions or disputes
    const hasActiveTransactions = await this.hasActiveTransactions(userId);
    const hasOpenDisputes = await this.hasOpenDisputes(userId);

    if (hasActiveTransactions || hasOpenDisputes) {
      throw new Error(
        'Cannot delete account with active transactions or open disputes. Please resolve all pending items first.'
      );
    }

    // Schedule deletion with grace period
    const scheduledDeletionDate = new Date();
    scheduledDeletionDate.setDate(scheduledDeletionDate.getDate() + this.gracePeriodDays);

    const deletionRequest: DeletionRequest = {
      userId,
      requestedAt: new Date(),
      requestedBy,
      status: 'pending',
      reason,
      scheduledDeletionDate,
    };

    // Log deletion request
    await siemService.logSecurityEvent(
      'gdpr_deletion_requested',
      'high',
      requestedBy,
      undefined,
      { targetUserId: userId, scheduledDeletionDate }
    );

    // In a real implementation, you would store this in a deletion_requests table
    // For now, we'll process it immediately if grace period is 0
    if (this.gracePeriodDays === 0) {
      await this.executeDataDeletion(userId, requestedBy);
      deletionRequest.status = 'completed';
    }

    return deletionRequest;
  }

  /**
   * Execute data deletion for a user
   */
  async executeDataDeletion(userId: number, deletedBy: number): Promise<{
    deleted: Record<string, number>;
    errors: string[];
  }> {
    const deleted: Record<string, number> = {};
    const errors: string[] = [];

    logger.warn({ userId, deletedBy }, 'Executing data deletion');

    try {
      // Delete deletable data types
      for (const policy of this.retentionPolicies) {
        if (!policy.canDelete) {
          continue;
        }

        try {
          let count = 0;

          switch (policy.dataType) {
            case 'personal_identification':
              // Anonymize user data instead of deleting (for audit trail)
              count = await this.anonymizeUserData(userId);
              break;
            case 'communication_records':
              count = await this.deleteUserMessages(userId);
              break;
            case 'usage_analytics':
              // Analytics deletion handled separately
              count = 0;
              break;
            case 'api_usage_logs':
              count = await this.deleteUserApiLogs(userId);
              break;
          }

          if (count > 0) {
            deleted[policy.dataType] = count;
          }
        } catch (error: any) {
          errors.push(`${policy.dataType}: ${error.message}`);
        }
      }

      // Log deletion to SIEM
      await siemService.logSecurityEvent(
        'gdpr_deletion_executed',
        'critical',
        deletedBy,
        undefined,
        { targetUserId: userId, deleted, errors: errors.length }
      );

      logger.info({ userId, deleted, errors: errors.length }, 'Data deletion completed');
    } catch (error: any) {
      logger.error({ error, userId }, 'Data deletion failed');
      errors.push(`Deletion failed: ${error.message}`);
    }

    return { deleted, errors };
  }

  /**
   * Anonymize user data (instead of deleting for audit purposes)
   */
  private async anonymizeUserData(userId: number): Promise<number> {
    const [updated] = await db
      .update(users)
      .set({
        email: `deleted_${userId}@deleted.local`,
        username: `deleted_${userId}`,
        firstName: null,
        lastName: null,
        profileImage: null,
        googleId: null,
        // Keep: id, trustScore, transaction counts (for audit)
      })
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    return updated ? 1 : 0;
  }

  /**
   * Delete user messages
   */
  private async deleteUserMessages(userId: number): Promise<number> {
    // Delete messages where user is sender
    const result = await db
      .delete(messages)
      .where(eq(messages.senderId, userId));

    return result.rowCount || 0;
  }

  /**
   * Delete expired password reset tokens
   */
  private async deleteExpiredPasswordResets(cutoffDate: Date): Promise<number> {
    const result = await db
      .delete(passwordResets)
      .where(lt(passwordResets.expiresAt, cutoffDate));

    return result.rowCount || 0;
  }

  /**
   * Delete expired API usage logs
   */
  private async deleteExpiredApiLogs(cutoffDate: Date): Promise<number> {
    const result = await db
      .delete(apiUsageLogs)
      .where(lt(apiUsageLogs.createdAt, cutoffDate));

    return result.rowCount || 0;
  }

  /**
   * Delete user API logs
   */
  private async deleteUserApiLogs(userId: number): Promise<number> {
    // Get developer account ID for user
    const developerAccount = await storage.getDeveloperAccountByUserId(userId);
    if (!developerAccount) {
      return 0;
    }

    const result = await db
      .delete(apiUsageLogs)
      .where(eq(apiUsageLogs.developerId, developerAccount.id));

    return result.rowCount || 0;
  }

  /**
   * Check if user has active transactions
   */
  private async hasActiveTransactions(userId: number): Promise<boolean> {
    const activeStatuses = ['pending', 'active', 'escrow', 'buffer_period', 'disputed'];
    const [count] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(
        and(
          sql`${transactions.buyerId} = ${userId} OR ${transactions.sellerId} = ${userId}`,
          sql`${transactions.status} = ANY(${activeStatuses})`
        )
      );

    return (count?.count || 0) > 0;
  }

  /**
   * Check if user has open disputes
   */
  private async hasOpenDisputes(userId: number): Promise<boolean> {
    const openStatuses = ['open', 'investigating'];
    const [count] = await db
      .select({ count: sql<number>`count(*)` })
      .from(disputes)
      .where(
        and(
          eq(disputes.raisedBy, userId),
          sql`${disputes.status} = ANY(${openStatuses})`
        )
      );

    return (count?.count || 0) > 0;
  }

  /**
   * Get retention policy for data type
   */
  getRetentionPolicy(dataType: string): DataRetentionPolicy | undefined {
    return this.retentionPolicies.find((p) => p.dataType === dataType);
  }

  /**
   * Export user data (GDPR Right to Data Portability)
   */
  async exportUserData(userId: number): Promise<Record<string, any>> {
    logger.info({ userId }, 'Exporting user data');

    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userTransactions = await storage.getTransactionsByUserId(userId);
    const userMessages = await storage.getMessagesByUserId(userId);
    const kycData = await storage.getKycByUserId(userId);

    const exportData = {
      personal_information: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        trustScore: user.trustScore,
      },
      transactions: userTransactions,
      messages: userMessages,
      kyc_verification: kycData,
      exportDate: new Date().toISOString(),
    };

    // Log export
    await siemService.logSecurityEvent(
      'gdpr_data_exported',
      'medium',
      userId,
      undefined,
      { dataTypes: Object.keys(exportData) }
    );

    return exportData;
  }
}

// Singleton instance
export const gdprDataManagement = new GDPRDataManagementService();

