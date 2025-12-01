/**
 * Fraud Check Quota Management Service (Rule 3)
 * Manages API rate limits and monthly quotas
 */

import { db } from '../db';
import { apiKeys, clientOrganizations, apiUsageLogs } from '@shared/schema';
import { eq, and, gte, sum, count } from 'drizzle-orm';
import AuditService from './audit-logger';
import pino from 'pino';

const logger = pino({
  name: 'fraud-quota-management',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});

export interface QuotaStatus {
  currentUsage: number;
  monthlyLimit: number;
  remainingQuota: number;
  usagePercentage: number;
  resetDate: Date;
  rateLimitPerSecond: number;
  quotaExceeded: boolean;
  warningLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  retryAfter?: number; // seconds
  quotaStatus: QuotaStatus;
}

export class FraudQuotaManagementService {

  /**
   * Check rate limit and quota before API call (Rule 3.1, 3.3)
   */
  static async checkRateLimit(apiKeyId: number, endpoint: string): Promise<RateLimitResult> {
    try {
      // Get API key and quota details
      const [apiKey] = await db.select()
        .from(apiKeys)
        .where(eq(apiKeys.id, apiKeyId));

      if (!apiKey) {
        return {
          allowed: false,
          reason: 'Invalid API key',
          quotaStatus: this.getEmptyQuotaStatus()
        };
      }

      if (!apiKey.isActive) {
        return {
          allowed: false,
          reason: 'API key is inactive',
          quotaStatus: this.getEmptyQuotaStatus()
        };
      }

      // Check if API key has expired
      if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
        return {
          allowed: false,
          reason: 'API key has expired',
          quotaStatus: this.getEmptyQuotaStatus()
        };
      }

      // Get current quota status
      const quotaStatus = await this.getQuotaStatus(apiKeyId);

      // Check monthly quota (Rule 3.1)
      if (quotaStatus.quotaExceeded) {
        await AuditService.logAPIKeyEvent(
          apiKey.developerId,
          apiKeyId,
          'used',
          undefined,
          undefined,
          { 
            endpoint, 
            blocked: true, 
            reason: 'Monthly quota exceeded',
            usage: quotaStatus.currentUsage,
            limit: quotaStatus.monthlyLimit
          }
        );

        return {
          allowed: false,
          reason: 'Monthly quota exceeded',
          quotaStatus
        };
      }

      // Check rate limit (Rule 3.1) - 100 requests per second default
      const rateLimitCheck = await this.checkPerSecondRateLimit(apiKeyId, apiKey.rateLimit ?? 100);
      
      if (!rateLimitCheck.allowed) {
        return {
          allowed: false,
          reason: 'Rate limit exceeded',
          retryAfter: rateLimitCheck.retryAfter,
          quotaStatus
        };
      }

      // All checks passed
      return {
        allowed: true,
        quotaStatus
      };

    } catch (error) {
      logger.error({ error, apiKeyId, endpoint }, 'Failed to check rate limit');
      return {
        allowed: false,
        reason: 'Rate limit check failed',
        quotaStatus: this.getEmptyQuotaStatus()
      };
    }
  }

  /**
   * Record API usage and update quotas (Rule 3.1)
   */
  static async recordAPIUsage(
    apiKeyId: number,
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number,
    userAgent?: string,
    ipAddress?: string,
    requestSize?: number,
    responseSize?: number,
    errorMessage?: string
  ): Promise<boolean> {
    try {
      // Get API key details
      const [apiKey] = await db.select()
        .from(apiKeys)
        .where(eq(apiKeys.id, apiKeyId));

      if (!apiKey) {
        logger.error({ apiKeyId }, 'API key not found for usage recording');
        return false;
      }

      // Record usage log
      await db.insert(apiUsageLogs).values({
        apiKeyId,
        developerId: apiKey.developerId,
        endpoint,
        method,
        statusCode,
        responseTime,
        userAgent,
        ipAddress,
        requestSize,
        responseSize,
        errorMessage
      });

      // Update API key usage count (Rule 3.1)
      await db.update(apiKeys)
        .set({
          currentMonthUsage: (apiKey.currentMonthUsage ?? 0) + 1,
          lastUsed: new Date()
        })
        .where(eq(apiKeys.id, apiKeyId));

      // Check for quota warnings
      const newUsage = (apiKey.currentMonthUsage ?? 0) + 1;
      const quota = apiKey.monthlyQuota ?? 10000;
      const usagePercentage = (newUsage / quota) * 100;

      if (usagePercentage >= 90) {
        await this.sendQuotaWarning(apiKeyId, 'critical', usagePercentage);
      } else if (usagePercentage >= 75) {
        await this.sendQuotaWarning(apiKeyId, 'high', usagePercentage);
      } else if (usagePercentage >= 50) {
        await this.sendQuotaWarning(apiKeyId, 'medium', usagePercentage);
      }

      logger.debug({
        apiKeyId,
        endpoint,
        statusCode,
        newUsage,
        quota,
        usagePercentage
      }, 'API usage recorded');

      return true;

    } catch (error) {
      logger.error({ error, apiKeyId, endpoint }, 'Failed to record API usage');
      return false;
    }
  }

  /**
   * Get quota status for API key (Rule 3.1)
   */
  static async getQuotaStatus(apiKeyId: number): Promise<QuotaStatus> {
    try {
      const [apiKey] = await db.select()
        .from(apiKeys)
        .where(eq(apiKeys.id, apiKeyId));

      if (!apiKey) {
        return this.getEmptyQuotaStatus();
      }

      const currentUsage = apiKey.currentMonthUsage ?? 0;
      const monthlyLimit = apiKey.monthlyQuota ?? 10000;
      const remainingQuota = Math.max(0, monthlyLimit - currentUsage);
      const usagePercentage = (currentUsage / monthlyLimit) * 100;
      const quotaExceeded = currentUsage >= monthlyLimit;

      let warningLevel: 'none' | 'low' | 'medium' | 'high' | 'critical' = 'none';
      if (usagePercentage >= 90) {
        warningLevel = 'critical';
      } else if (usagePercentage >= 75) {
        warningLevel = 'high';
      } else if (usagePercentage >= 50) {
        warningLevel = 'medium';
      } else if (usagePercentage >= 25) {
        warningLevel = 'low';
      }

      return {
        currentUsage,
        monthlyLimit,
        remainingQuota,
        usagePercentage: Math.round(usagePercentage * 100) / 100,
        resetDate: apiKey.quotaResetDate ?? new Date(),
        rateLimitPerSecond: apiKey.rateLimit ?? 100,
        quotaExceeded,
        warningLevel
      };

    } catch (error) {
      logger.error({ error, apiKeyId }, 'Failed to get quota status');
      return this.getEmptyQuotaStatus();
    }
  }

  /**
   * Update API key quotas (Rule 3.1)
   */
  static async updateAPIKeyQuota(
    apiKeyId: number,
    newMonthlyQuota: number,
    newRateLimit?: number
  ): Promise<boolean> {
    try {
      const updateData: any = { monthlyQuota: newMonthlyQuota };
      if (newRateLimit !== undefined) {
        updateData.rateLimit = newRateLimit;
      }

      await db.update(apiKeys)
        .set(updateData)
        .where(eq(apiKeys.id, apiKeyId));

      logger.info({
        apiKeyId,
        newMonthlyQuota,
        newRateLimit
      }, 'API key quota updated');

      return true;

    } catch (error) {
      logger.error({ error, apiKeyId }, 'Failed to update API key quota');
      return false;
    }
  }

  /**
   * Update client organization quota (Rule 3.1)
   */
  static async updateClientOrgQuota(
    clientOrgId: number,
    newMonthlyQuota: number
  ): Promise<boolean> {
    try {
      await db.update(clientOrganizations)
        .set({ monthlyFraudCheckQuota: newMonthlyQuota })
        .where(eq(clientOrganizations.id, clientOrgId));

      // Update all API keys for this organization
      const orgApiKeys = await db.select()
        .from(apiKeys)
        .innerJoin(
          clientOrganizations,
          eq(apiKeys.developerId, clientOrganizations.id)
        )
        .where(eq(clientOrganizations.id, clientOrgId));

      for (const keyRecord of orgApiKeys) {
        await this.updateAPIKeyQuota(keyRecord.api_keys.id, newMonthlyQuota);
      }

      logger.info({
        clientOrgId,
        newMonthlyQuota,
        updatedKeys: orgApiKeys.length
      }, 'Client organization quota updated');

      return true;

    } catch (error) {
      logger.error({ error, clientOrgId }, 'Failed to update client organization quota');
      return false;
    }
  }

  /**
   * Get quota usage analytics (Rule 3.3)
   */
  static async getQuotaAnalytics(clientOrgId: number): Promise<{
    totalAPICalls: number;
    successfulCalls: number;
    failedCalls: number;
    averageResponseTime: number;
    quotaUtilization: number;
    topEndpoints: { endpoint: string; calls: number; avgResponseTime: number }[];
    dailyUsage: { date: string; calls: number }[];
  }> {
    try {
      // This would use proper aggregation queries in production
      // For now, providing a simplified implementation

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get organization's API keys
      const orgApiKeys = await db.select()
        .from(apiKeys)
        .innerJoin(
          clientOrganizations,
          eq(apiKeys.developerId, clientOrganizations.id)
        )
        .where(eq(clientOrganizations.id, clientOrgId));

      if (orgApiKeys.length === 0) {
        return this.getEmptyAnalytics();
      }

      const apiKeyIds = orgApiKeys.map(k => k.api_keys.id);

      // Get usage logs for the last 30 days
      const usageLogs = await db.select()
        .from(apiUsageLogs)
        .where(and(
          eq(apiUsageLogs.apiKeyId, apiKeyIds[0]), // Simplified for first key
          gte(apiUsageLogs.createdAt, thirtyDaysAgo)
        ));

      const totalAPICalls = usageLogs.length;
      const successfulCalls = usageLogs.filter(log => log.statusCode >= 200 && log.statusCode < 400).length;
      const failedCalls = totalAPICalls - successfulCalls;
      
      const avgResponseTime = usageLogs.length > 0 
        ? usageLogs.reduce((sum, log) => sum + (log.responseTime || 0), 0) / usageLogs.length 
        : 0;

      // Calculate quota utilization
      const [org] = await db.select()
        .from(clientOrganizations)
        .where(eq(clientOrganizations.id, clientOrgId));

      const quotaUtilization = org 
        ? ((org.currentMonthUsage ?? 0) / (org.monthlyFraudCheckQuota ?? 1)) * 100
        : 0;

      // Top endpoints (simplified)
      const endpointMap = new Map<string, { calls: number; totalResponseTime: number }>();
      usageLogs.forEach(log => {
        const existing = endpointMap.get(log.endpoint) || { calls: 0, totalResponseTime: 0 };
        endpointMap.set(log.endpoint, {
          calls: existing.calls + 1,
          totalResponseTime: existing.totalResponseTime + (log.responseTime || 0)
        });
      });

      const topEndpoints = Array.from(endpointMap.entries())
        .map(([endpoint, data]) => ({
          endpoint,
          calls: data.calls,
          avgResponseTime: data.calls > 0 ? data.totalResponseTime / data.calls : 0
        }))
        .sort((a, b) => b.calls - a.calls)
        .slice(0, 10);

      // Daily usage (simplified)
      const dailyMap = new Map<string, number>();
      usageLogs.forEach(log => {
        const date = log.createdAt?.toISOString().split('T')[0] || '';
        dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
      });

      const dailyUsage = Array.from(dailyMap.entries())
        .map(([date, calls]) => ({ date, calls }))
        .sort((a, b) => a.date.localeCompare(b.date));

      logger.info({
        clientOrgId,
        totalAPICalls,
        quotaUtilization,
        topEndpointsCount: topEndpoints.length
      }, 'Quota analytics generated');

      return {
        totalAPICalls,
        successfulCalls,
        failedCalls,
        averageResponseTime: Math.round(avgResponseTime),
        quotaUtilization: Math.round(quotaUtilization * 100) / 100,
        topEndpoints,
        dailyUsage
      };

    } catch (error) {
      logger.error({ error, clientOrgId }, 'Failed to get quota analytics');
      return this.getEmptyAnalytics();
    }
  }

  // Private helper methods

  private static async checkPerSecondRateLimit(apiKeyId: number, rateLimit: number): Promise<{ allowed: boolean; retryAfter?: number }> {
    // This would implement actual rate limiting logic with Redis or in-memory cache
    // For now, returning allowed (simplified implementation)
    return { allowed: true };
  }

  private static async sendQuotaWarning(apiKeyId: number, level: string, usagePercentage: number): Promise<void> {
    // In production, this would send notifications to the client
    logger.warn({
      apiKeyId,
      warningLevel: level,
      usagePercentage
    }, 'Quota warning threshold reached');

    // Log the warning event
    await AuditService.logEvent({
      eventType: 'quota_warning',
      action: `quota_warning_${level}`,
      resource: 'api_key',
      resourceId: apiKeyId.toString(),
      newValues: { usagePercentage, warningLevel: level },
      riskLevel: level === 'critical' ? 'high' : 'medium'
    });
  }

  private static getEmptyQuotaStatus(): QuotaStatus {
    return {
      currentUsage: 0,
      monthlyLimit: 0,
      remainingQuota: 0,
      usagePercentage: 0,
      resetDate: new Date(),
      rateLimitPerSecond: 0,
      quotaExceeded: true,
      warningLevel: 'critical'
    };
  }

  private static getEmptyAnalytics() {
    return {
      totalAPICalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      averageResponseTime: 0,
      quotaUtilization: 0,
      topEndpoints: [],
      dailyUsage: []
    };
  }
}