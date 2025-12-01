/**
 * API Key Rotation Service (Rule 1.2)
 * Implements 90-day API key rotation with environment separation
 */

import crypto from 'crypto';
import { db } from '../db';
import { apiKeys, developerAccounts } from '../shared/schema';
import { eq, and, lt, isNull } from 'drizzle-orm';
import pino from 'pino';

const logger = pino({
  name: 'api-key-rotation',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});

export interface APIKeyDetails {
  id: number;
  name: string;
  keyPrefix: string;
  fullKey?: string; // Only returned during creation
  environment: 'sandbox' | 'production';
  permissions: string[];
  expiresAt: Date;
  rotationDue: Date;
  isActive: boolean;
  rateLimit: number;
  monthlyQuota: number;
  currentMonthUsage: number;
}

export class APIKeyRotationService {

  /**
   * Create new API key with automatic 90-day expiry (Rule 1.2)
   */
  static async createAPIKey(
    developerId: number,
    name: string,
    environment: 'sandbox' | 'production',
    permissions: string[] = [],
    rateLimit: number = 100,
    monthlyQuota: number = 10000
  ): Promise<APIKeyDetails> {
    try {
      // Generate secure API key
      const fullKey = this.generateAPIKey();
      const keyHash = this.hashAPIKey(fullKey);
      const keyPrefix = fullKey.substring(0, 8);

      // Set expiration to 90 days from now (Rule 1.2)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 90);

      // Set rotation reminder to 7 days before expiry
      const rotationDue = new Date(expiresAt);
      rotationDue.setDate(rotationDue.getDate() - 7);

      // Create quota reset date (monthly)
      const quotaResetDate = new Date();
      quotaResetDate.setMonth(quotaResetDate.getMonth() + 1);
      quotaResetDate.setDate(1); // First day of next month

      const [newKey] = await db.insert(apiKeys).values({
        developerId,
        name,
        keyHash,
        keyPrefix,
        environment,
        permissions,
        isActive: true,
        expiresAt,
        rotationDue,
        lastRotated: new Date(),
        rateLimit,
        monthlyQuota,
        currentMonthUsage: 0,
        quotaResetDate,
        ipWhitelist: [],
        userAgent: null
      }).returning();

      logger.info({ 
        developerId, 
        keyId: newKey.id, 
        environment,
        expiresAt: expiresAt.toISOString()
      }, 'New API key created with 90-day expiry');

      return {
        id: newKey.id,
        name: newKey.name,
        keyPrefix: newKey.keyPrefix,
        fullKey, // Only return the full key during creation
        environment: newKey.environment as 'sandbox' | 'production',
        permissions: newKey.permissions as string[],
        expiresAt: newKey.expiresAt!,
        rotationDue: newKey.rotationDue!,
        isActive: newKey.isActive ?? true,
        rateLimit: newKey.rateLimit ?? 100,
        monthlyQuota: newKey.monthlyQuota ?? 10000,
        currentMonthUsage: newKey.currentMonthUsage ?? 0
      };

    } catch (error) {
      logger.error({ error, developerId, environment }, 'Failed to create API key');
      throw new Error('Failed to create API key');
    }
  }

  /**
   * Rotate existing API key (Rule 1.2)
   */
  static async rotateAPIKey(keyId: number, developerId: number): Promise<APIKeyDetails> {
    try {
      // Verify ownership
      const [existingKey] = await db.select()
        .from(apiKeys)
        .where(and(
          eq(apiKeys.id, keyId),
          eq(apiKeys.developerId, developerId)
        ));

      if (!existingKey) {
        throw new Error('API key not found or access denied');
      }

      // Generate new key
      const fullKey = this.generateAPIKey();
      const keyHash = this.hashAPIKey(fullKey);
      const keyPrefix = fullKey.substring(0, 8);

      // Extend expiry by 90 days
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 90);

      // Set rotation reminder to 7 days before expiry
      const rotationDue = new Date(expiresAt);
      rotationDue.setDate(rotationDue.getDate() - 7);

      // Update key with new values
      const [rotatedKey] = await db.update(apiKeys)
        .set({
          keyHash,
          keyPrefix,
          expiresAt,
          rotationDue,
          lastRotated: new Date()
        })
        .where(eq(apiKeys.id, keyId))
        .returning();

      logger.info({ 
        keyId, 
        developerId,
        newExpiresAt: expiresAt.toISOString()
      }, 'API key rotated successfully');

      return {
        id: rotatedKey.id,
        name: rotatedKey.name,
        keyPrefix: rotatedKey.keyPrefix,
        fullKey, // Return new key during rotation
        environment: rotatedKey.environment as 'sandbox' | 'production',
        permissions: rotatedKey.permissions as string[],
        expiresAt: rotatedKey.expiresAt!,
        rotationDue: rotatedKey.rotationDue!,
        isActive: rotatedKey.isActive ?? true,
        rateLimit: rotatedKey.rateLimit ?? 100,
        monthlyQuota: rotatedKey.monthlyQuota ?? 10000,
        currentMonthUsage: rotatedKey.currentMonthUsage ?? 0
      };

    } catch (error) {
      logger.error({ error, keyId, developerId }, 'Failed to rotate API key');
      throw error;
    }
  }

  /**
   * Get keys requiring rotation (Rule 1.2)
   */
  static async getKeysRequiringRotation(): Promise<APIKeyDetails[]> {
    try {
      const now = new Date();
      
      const keysNeedingRotation = await db.select()
        .from(apiKeys)
        .where(and(
          eq(apiKeys.isActive, true),
          lt(apiKeys.rotationDue, now),
          isNull(apiKeys.revokedAt)
        ));

      logger.info({ count: keysNeedingRotation.length }, 'Found keys requiring rotation');

      return keysNeedingRotation.map(key => ({
        id: key.id,
        name: key.name,
        keyPrefix: key.keyPrefix,
        environment: key.environment as 'sandbox' | 'production',
        permissions: key.permissions as string[],
        expiresAt: key.expiresAt!,
        rotationDue: key.rotationDue!,
        isActive: key.isActive ?? true,
        rateLimit: key.rateLimit ?? 100,
        monthlyQuota: key.monthlyQuota ?? 10000,
        currentMonthUsage: key.currentMonthUsage ?? 0
      }));

    } catch (error) {
      logger.error({ error }, 'Failed to get keys requiring rotation');
      return [];
    }
  }

  /**
   * Auto-disable expired keys (Rule 1.2)
   */
  static async disableExpiredKeys(): Promise<number> {
    try {
      const now = new Date();
      
      const expiredKeys = await db.update(apiKeys)
        .set({ 
          isActive: false,
          revokedAt: now
        })
        .where(and(
          eq(apiKeys.isActive, true),
          lt(apiKeys.expiresAt, now)
        ))
        .returning({ id: apiKeys.id });

      const disabledCount = expiredKeys.length;
      
      if (disabledCount > 0) {
        logger.warn({ 
          count: disabledCount,
          expiredKeyIds: expiredKeys.map(k => k.id)
        }, 'Automatically disabled expired API keys');
      }

      return disabledCount;

    } catch (error) {
      logger.error({ error }, 'Failed to disable expired keys');
      return 0;
    }
  }

  /**
   * Set IP whitelist for API key (Rule 1.2)
   */
  static async setIPWhitelist(keyId: number, developerId: number, ipAddresses: string[]): Promise<boolean> {
    try {
      const [updatedKey] = await db.update(apiKeys)
        .set({ ipWhitelist: ipAddresses })
        .where(and(
          eq(apiKeys.id, keyId),
          eq(apiKeys.developerId, developerId)
        ))
        .returning({ id: apiKeys.id });

      if (!updatedKey) {
        throw new Error('API key not found or access denied');
      }

      logger.info({ keyId, ipCount: ipAddresses.length }, 'IP whitelist updated for API key');
      return true;

    } catch (error) {
      logger.error({ error, keyId, developerId }, 'Failed to set IP whitelist');
      return false;
    }
  }

  /**
   * Update API key permissions (Rule 1.2)
   */
  static async updatePermissions(keyId: number, developerId: number, permissions: string[]): Promise<boolean> {
    try {
      const [updatedKey] = await db.update(apiKeys)
        .set({ permissions })
        .where(and(
          eq(apiKeys.id, keyId),
          eq(apiKeys.developerId, developerId)
        ))
        .returning({ id: apiKeys.id });

      if (!updatedKey) {
        throw new Error('API key not found or access denied');
      }

      logger.info({ keyId, permissions }, 'API key permissions updated');
      return true;

    } catch (error) {
      logger.error({ error, keyId, developerId }, 'Failed to update API key permissions');
      return false;
    }
  }

  /**
   * Revoke API key (Rule 1.2)
   */
  static async revokeAPIKey(keyId: number, developerId: number): Promise<boolean> {
    try {
      const [revokedKey] = await db.update(apiKeys)
        .set({ 
          isActive: false,
          revokedAt: new Date()
        })
        .where(and(
          eq(apiKeys.id, keyId),
          eq(apiKeys.developerId, developerId)
        ))
        .returning({ id: apiKeys.id });

      if (!revokedKey) {
        throw new Error('API key not found or access denied');
      }

      logger.info({ keyId, developerId }, 'API key revoked');
      return true;

    } catch (error) {
      logger.error({ error, keyId, developerId }, 'Failed to revoke API key');
      return false;
    }
  }

  /**
   * Reset monthly usage quota (Rule 3.1)
   */
  static async resetMonthlyQuotas(): Promise<number> {
    try {
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const resetKeys = await db.update(apiKeys)
        .set({ 
          currentMonthUsage: 0,
          quotaResetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1) // Next month
        })
        .where(lt(apiKeys.quotaResetDate, firstOfMonth))
        .returning({ id: apiKeys.id });

      logger.info({ count: resetKeys.length }, 'Monthly quotas reset for API keys');
      return resetKeys.length;

    } catch (error) {
      logger.error({ error }, 'Failed to reset monthly quotas');
      return 0;
    }
  }

  // Private helper methods

  private static generateAPIKey(): string {
    // Generate secure 64-character API key
    const prefix = 'tv_'; // TrustVerify prefix
    const randomBytes = crypto.randomBytes(32).toString('hex');
    return `${prefix}${randomBytes}`;
  }

  private static hashAPIKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  /**
   * Validate API key format (Rule 1.2)
   */
  static validateAPIKeyFormat(key: string): boolean {
    // Check format: tv_[64 hex characters]
    const pattern = /^tv_[a-f0-9]{64}$/;
    return pattern.test(key);
  }

  /**
   * Get developer's API keys (Rule 1.2)
   */
  static async getDeveloperAPIKeys(developerId: number, includeInactive: boolean = false): Promise<APIKeyDetails[]> {
    try {
      const conditions = [eq(apiKeys.developerId, developerId)];
      
      if (!includeInactive) {
        conditions.push(eq(apiKeys.isActive, true));
        conditions.push(isNull(apiKeys.revokedAt));
      }

      const keys = await db.select()
        .from(apiKeys)
        .where(and(...conditions));

      return keys.map(key => ({
        id: key.id,
        name: key.name,
        keyPrefix: key.keyPrefix,
        environment: key.environment as 'sandbox' | 'production',
        permissions: key.permissions as string[],
        expiresAt: key.expiresAt!,
        rotationDue: key.rotationDue!,
        isActive: key.isActive ?? true,
        rateLimit: key.rateLimit ?? 100,
        monthlyQuota: key.monthlyQuota ?? 10000,
        currentMonthUsage: key.currentMonthUsage ?? 0
      }));

    } catch (error) {
      logger.error({ error, developerId }, 'Failed to get developer API keys');
      return [];
    }
  }
}