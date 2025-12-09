/**
 * Environment Service
 * Manages sandbox vs production environment switching
 */

import { storage } from '../storage';
import { db } from '../db';
import { apiKeys } from '../shared/schema';
import { eq } from 'drizzle-orm';
import pino from 'pino';

const logger = pino({ name: 'environment-service' });

export type Environment = 'sandbox' | 'production';

export interface EnvironmentConfig {
  environment: Environment;
  baseUrl: string;
  apiVersion: string;
  features: {
    webhooks: boolean;
    analytics: boolean;
    advancedWorkflows: boolean;
  };
  limits: {
    maxApiCallsPerMinute: number;
    maxWorkflows: number;
    maxWebhooks: number;
  };
}

const SANDBOX_CONFIG: EnvironmentConfig = {
  environment: 'sandbox',
  baseUrl: process.env.SANDBOX_BASE_URL || 'https://sandbox.trustverify.co.uk',
  apiVersion: 'v1',
  features: {
    webhooks: true,
    analytics: true,
    advancedWorkflows: true,
  },
  limits: {
    maxApiCallsPerMinute: 100,
    maxWorkflows: 10,
    maxWebhooks: 5,
  },
};

const PRODUCTION_CONFIG: EnvironmentConfig = {
  environment: 'production',
  baseUrl: process.env.PRODUCTION_BASE_URL || 'https://api.trustverify.co.uk',
  apiVersion: 'v1',
  features: {
    webhooks: true,
    analytics: true,
    advancedWorkflows: true,
  },
  limits: {
    maxApiCallsPerMinute: 1000,
    maxWorkflows: 100,
    maxWebhooks: 50,
  },
};

export class EnvironmentService {
  /**
   * Get environment configuration for an API key
   */
  async getEnvironmentConfig(apiKeyId: number): Promise<EnvironmentConfig> {
    try {
      const [apiKey] = await db
        .select()
        .from(apiKeys)
        .where(eq(apiKeys.id, apiKeyId));

      if (!apiKey) {
        throw new Error('API key not found');
      }

      const environment = (apiKey.environment || 'sandbox') as Environment;
      return environment === 'production' ? PRODUCTION_CONFIG : SANDBOX_CONFIG;
    } catch (error) {
      logger.error({ error, apiKeyId }, 'Failed to get environment config');
      return SANDBOX_CONFIG; // Default to sandbox
    }
  }

  /**
   * Get environment for a developer account
   */
  async getDeveloperEnvironment(developerId: number): Promise<Environment> {
    try {
      // Get the primary API key for the developer
      const [apiKey] = await db
        .select()
        .from(apiKeys)
        .where(eq(apiKeys.developerId, developerId))
        .orderBy(apiKeys.createdAt);

      if (!apiKey) {
        return 'sandbox'; // Default to sandbox
      }

      return (apiKey.environment || 'sandbox') as Environment;
    } catch (error) {
      logger.error({ error, developerId }, 'Failed to get developer environment');
      return 'sandbox';
    }
  }

  /**
   * Switch API key environment
   */
  async switchEnvironment(
    apiKeyId: number,
    environment: Environment
  ): Promise<void> {
    try {
      await db
        .update(apiKeys)
        .set({ environment })
        .where(eq(apiKeys.id, apiKeyId));

      logger.info({ apiKeyId, environment }, 'Environment switched');
    } catch (error) {
      logger.error({ error, apiKeyId, environment }, 'Failed to switch environment');
      throw error;
    }
  }

  /**
   * Check if feature is available in environment
   */
  async isFeatureAvailable(
    apiKeyId: number,
    feature: keyof EnvironmentConfig['features']
  ): Promise<boolean> {
    const config = await this.getEnvironmentConfig(apiKeyId);
    return config.features[feature];
  }

  /**
   * Check if limit is exceeded
   */
  async checkLimit(
    apiKeyId: number,
    limitType: keyof EnvironmentConfig['limits'],
    currentValue: number
  ): Promise<{ allowed: boolean; limit: number; current: number }> {
    const config = await this.getEnvironmentConfig(apiKeyId);
    const limit = config.limits[limitType];

    return {
      allowed: currentValue < limit,
      limit,
      current: currentValue,
    };
  }

  /**
   * Get environment-specific base URL
   */
  async getBaseUrl(apiKeyId: number): Promise<string> {
    const config = await this.getEnvironmentConfig(apiKeyId);
    return config.baseUrl;
  }
}

export const environmentService = new EnvironmentService();

