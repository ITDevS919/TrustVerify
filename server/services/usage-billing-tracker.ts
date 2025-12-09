/**
 * Usage-Based Billing Tracker Service
 * Tracks API usage per module for billing purposes
 */

import { storage } from '../storage';
import { db } from '../db';
import { apiUsageLogs, developerAccounts } from '../shared/schema';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import pino from 'pino';

const logger = pino({ name: 'usage-billing-tracker' });

export type ModuleType = 'kyc' | 'kyb' | 'escrow' | 'arbitration' | 'fraud' | 'workflow' | 'webhook' | 'device_ip';

export interface ModuleUsage {
  module: ModuleType;
  count: number;
  cost: number; // Cost in pence/cents
  periodStart: Date;
  periodEnd: Date;
}

export interface DeveloperUsageSummary {
  developerId: number;
  periodStart: Date;
  periodEnd: Date;
  totalApiCalls: number;
  totalCost: number;
  moduleBreakdown: ModuleUsage[];
}

export interface BillingPeriod {
  start: Date;
  end: Date;
  totalUsage: number;
  totalCost: number;
  modules: Record<ModuleType, number>;
}

// Module pricing (in pence per 1000 calls)
const MODULE_PRICING: Record<ModuleType, number> = {
  kyc: 50,      // £0.50 per 1000 calls
  kyb: 75,      // £0.75 per 1000 calls
  escrow: 100,  // £1.00 per 1000 calls
  arbitration: 200, // £2.00 per 1000 calls
  fraud: 30,    // £0.30 per 1000 calls
  workflow: 25, // £0.25 per 1000 calls
  webhook: 10,  // £0.10 per 1000 calls
  device_ip: 20, // £0.20 per 1000 calls
};

/**
 * Map endpoint to module type
 */
function getModuleFromEndpoint(endpoint: string): ModuleType | null {
  const normalizedEndpoint = endpoint.toLowerCase();
  
  if (normalizedEndpoint.includes('/kyc/') || normalizedEndpoint.includes('/kyc')) {
    return 'kyc';
  }
  if (normalizedEndpoint.includes('/kyb/') || normalizedEndpoint.includes('/kyb')) {
    return 'kyb';
  }
  if (normalizedEndpoint.includes('/escrow/') || normalizedEndpoint.includes('/escrow')) {
    return 'escrow';
  }
  if (normalizedEndpoint.includes('/arbitration/') || normalizedEndpoint.includes('/arbitration') || 
      normalizedEndpoint.includes('/disputes/') || normalizedEndpoint.includes('/disputes')) {
    return 'arbitration';
  }
  if (normalizedEndpoint.includes('/fraud/') || normalizedEndpoint.includes('/fraud') ||
      normalizedEndpoint.includes('/device-ip/') || normalizedEndpoint.includes('/device-ip')) {
    if (normalizedEndpoint.includes('/device-ip/') || normalizedEndpoint.includes('/device-ip')) {
      return 'device_ip';
    }
    return 'fraud';
  }
  if (normalizedEndpoint.includes('/workflow/') || normalizedEndpoint.includes('/workflow')) {
    return 'workflow';
  }
  if (normalizedEndpoint.includes('/webhook/') || normalizedEndpoint.includes('/webhook')) {
    return 'webhook';
  }
  
  return null;
}

export class UsageBillingTracker {
  /**
   * Record API usage for billing
   */
  async recordUsage(
    developerId: number,
    apiKeyId: number,
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number
  ): Promise<void> {
    try {
      const module = getModuleFromEndpoint(endpoint);
      
      if (!module) {
        // Not a billable endpoint
        return;
      }

      // Usage is already logged in apiUsageLogs table
      // We just need to ensure it's tracked for billing
      logger.debug({
        developerId,
        apiKeyId,
        endpoint,
        module,
        statusCode
      }, 'Usage recorded for billing');

    } catch (error) {
      logger.error({ error, developerId, endpoint }, 'Failed to record usage for billing');
    }
  }

  /**
   * Get usage summary for a developer in a period
   */
  async getUsageSummary(
    developerId: number,
    periodStart: Date,
    periodEnd: Date
  ): Promise<DeveloperUsageSummary> {
    try {
      // Get all API usage logs for the developer in the period
      const logs = await db
        .select()
        .from(apiUsageLogs)
        .where(
          and(
            eq(apiUsageLogs.developerId, developerId),
            gte(apiUsageLogs.createdAt, periodStart),
            lte(apiUsageLogs.createdAt, periodEnd)
          )
        );

      // Group by module
      const moduleCounts: Record<ModuleType, number> = {
        kyc: 0,
        kyb: 0,
        escrow: 0,
        arbitration: 0,
        fraud: 0,
        workflow: 0,
        webhook: 0,
        device_ip: 0,
      };

      let totalApiCalls = 0;

      for (const log of logs) {
        const module = getModuleFromEndpoint(log.endpoint);
        if (module) {
          moduleCounts[module]++;
          totalApiCalls++;
        }
      }

      // Calculate costs
      const moduleBreakdown: ModuleUsage[] = [];
      let totalCost = 0;

      for (const [module, count] of Object.entries(moduleCounts) as [ModuleType, number][]) {
        if (count > 0) {
          const cost = Math.ceil((count / 1000) * MODULE_PRICING[module]);
          totalCost += cost;
          moduleBreakdown.push({
            module,
            count,
            cost,
            periodStart,
            periodEnd,
          });
        }
      }

      return {
        developerId,
        periodStart,
        periodEnd,
        totalApiCalls,
        totalCost,
        moduleBreakdown,
      };
    } catch (error) {
      logger.error({ error, developerId }, 'Failed to get usage summary');
      throw error;
    }
  }

  /**
   * Get current month usage for a developer
   */
  async getCurrentMonthUsage(developerId: number): Promise<DeveloperUsageSummary> {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    return this.getUsageSummary(developerId, periodStart, periodEnd);
  }

  /**
   * Get billing period summary
   */
  async getBillingPeriod(
    developerId: number,
    year: number,
    month: number
  ): Promise<BillingPeriod> {
    const periodStart = new Date(year, month - 1, 1);
    const periodEnd = new Date(year, month, 0, 23, 59, 59);

    const summary = await this.getUsageSummary(developerId, periodStart, periodEnd);

    const modules: Record<ModuleType, number> = {
      kyc: 0,
      kyb: 0,
      escrow: 0,
      arbitration: 0,
      fraud: 0,
      workflow: 0,
      webhook: 0,
      device_ip: 0,
    };

    for (const breakdown of summary.moduleBreakdown) {
      modules[breakdown.module] = breakdown.count;
    }

    return {
      start: periodStart,
      end: periodEnd,
      totalUsage: summary.totalApiCalls,
      totalCost: summary.totalCost,
      modules,
    };
  }

  /**
   * Get module usage statistics
   */
  async getModuleUsageStats(
    developerId: number,
    module: ModuleType,
    periodStart: Date,
    periodEnd: Date
  ): Promise<{
    module: ModuleType;
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
    averageResponseTime: number;
    totalCost: number;
  }> {
    const logs = await db
      .select()
      .from(apiUsageLogs)
      .where(
        and(
          eq(apiUsageLogs.developerId, developerId),
          gte(apiUsageLogs.createdAt, periodStart),
          lte(apiUsageLogs.createdAt, periodEnd)
        )
      );

    const moduleLogs = logs.filter(log => getModuleFromEndpoint(log.endpoint) === module);

    const totalCalls = moduleLogs.length;
    const successfulCalls = moduleLogs.filter(log => log.statusCode < 400).length;
    const failedCalls = totalCalls - successfulCalls;
    const totalResponseTime = moduleLogs.reduce((sum, log) => sum + (log.responseTime || 0), 0);
    const averageResponseTime = totalCalls > 0 ? totalResponseTime / totalCalls : 0;
    const totalCost = Math.ceil((totalCalls / 1000) * MODULE_PRICING[module]);

    return {
      module,
      totalCalls,
      successfulCalls,
      failedCalls,
      averageResponseTime: Math.round(averageResponseTime),
      totalCost,
    };
  }

  /**
   * Get all developers' usage for a period (admin function)
   */
  async getAllDevelopersUsage(
    periodStart: Date,
    periodEnd: Date
  ): Promise<DeveloperUsageSummary[]> {
    const developers = await db
      .select({ id: developerAccounts.id })
      .from(developerAccounts)
      .where(eq(developerAccounts.status, 'approved'));

    const summaries: DeveloperUsageSummary[] = [];

    for (const dev of developers) {
      try {
        const summary = await this.getUsageSummary(dev.id, periodStart, periodEnd);
        if (summary.totalApiCalls > 0) {
          summaries.push(summary);
        }
      } catch (error) {
        logger.error({ error, developerId: dev.id }, 'Failed to get usage for developer');
      }
    }

    return summaries;
  }
}

export const usageBillingTracker = new UsageBillingTracker();

