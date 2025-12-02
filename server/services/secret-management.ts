/**
 * Secret Management Service
 * Integrates with cloud secret stores (AWS Secrets Manager, HashiCorp Vault)
 * Automates key rotation and secret management
 */

import { config } from '../config';
import pino from 'pino';
import crypto from 'crypto';

const logger = pino({
  name: 'secret-management',
  level: config.LOG_LEVEL || 'info'
});

export interface Secret {
  key: string;
  value: string;
  version?: string;
  updatedAt?: Date;
}

export type SecretStore = 'aws-secrets-manager' | 'hashicorp-vault' | 'env' | 'memory';

export class SecretManagementService {
  private store: SecretStore;
  private cache: Map<string, { value: string; expiresAt: number }> = new Map();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Determine which secret store to use
    if (config.AWS_SECRETS_MANAGER_SECRET_NAME && config.AWS_SECRETS_MANAGER_REGION) {
      this.store = 'aws-secrets-manager';
      logger.info({ region: config.AWS_SECRETS_MANAGER_REGION }, 'Using AWS Secrets Manager');
    } else if (config.HASHICORP_VAULT_ADDR && config.HASHICORP_VAULT_TOKEN) {
      this.store = 'hashicorp-vault';
      logger.info({ addr: config.HASHICORP_VAULT_ADDR }, 'Using HashiCorp Vault');
    } else {
      this.store = 'env';
      logger.warn('No cloud secret store configured, using environment variables');
    }
  }

  /**
   * Get secret from store
   */
  async getSecret(key: string): Promise<string | null> {
    // Check cache first
    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    try {
      let value: string | null = null;

      switch (this.store) {
        case 'aws-secrets-manager':
          value = await this.getFromAWSSecretsManager(key);
          break;
        case 'hashicorp-vault':
          value = await this.getFromVault(key);
          break;
        case 'env':
          value = process.env[key] || null;
          break;
        default:
          value = process.env[key] || null;
      }

      // Cache the value
      if (value) {
        this.cache.set(key, {
          value,
          expiresAt: Date.now() + this.cacheTTL,
        });
      }

      return value;
    } catch (error) {
      logger.error({ error, key }, 'Failed to get secret');
      // Fallback to environment variable
      return process.env[key] || null;
    }
  }

  /**
   * Rotate secret (generate new value and update store)
   */
  async rotateSecret(key: string, length: number = 32): Promise<string> {
    // Generate new secret
    const newValue = crypto.randomBytes(length).toString('hex');

    try {
      switch (this.store) {
        case 'aws-secrets-manager':
          await this.updateAWSSecret(key, newValue);
          break;
        case 'hashicorp-vault':
          await this.updateVaultSecret(key, newValue);
          break;
        case 'env':
          // Can't update env vars at runtime, log warning
          logger.warn({ key }, 'Cannot rotate environment variable at runtime');
          break;
      }

      // Clear cache
      this.cache.delete(key);

      logger.info({ key }, 'Secret rotated successfully');
      return newValue;
    } catch (error) {
      logger.error({ error, key }, 'Failed to rotate secret');
      throw error;
    }
  }

  /**
   * Get secret from AWS Secrets Manager
   */
  private async getFromAWSSecretsManager(key: string): Promise<string | null> {
    try {
      // Dynamic import to avoid requiring AWS SDK if not used
      const { SecretsManagerClient, GetSecretValueCommand } = await import('@aws-sdk/client-secrets-manager');

      const client = new SecretsManagerClient({
        region: config.AWS_SECRETS_MANAGER_REGION,
      });

      const command = new GetSecretValueCommand({
        SecretId: config.AWS_SECRETS_MANAGER_SECRET_NAME,
      });

      const response = await client.send(command);
      const secrets = JSON.parse(response.SecretString || '{}');
      return secrets[key] || null;
    } catch (error) {
      logger.error({ error, key }, 'Failed to get secret from AWS Secrets Manager');
      return null;
    }
  }

  /**
   * Update secret in AWS Secrets Manager
   */
  private async updateAWSSecret(key: string, value: string): Promise<void> {
    try {
      const { SecretsManagerClient, GetSecretValueCommand, PutSecretValueCommand } = await import('@aws-sdk/client-secrets-manager');

      const client = new SecretsManagerClient({
        region: config.AWS_SECRETS_MANAGER_REGION,
      });

      // Get current secrets
      const getCommand = new GetSecretValueCommand({
        SecretId: config.AWS_SECRETS_MANAGER_SECRET_NAME,
      });

      const getResponse = await client.send(getCommand);
      const secrets = JSON.parse(getResponse.SecretString || '{}');
      
      // Update the specific key
      secrets[key] = value;

      // Put updated secrets
      const putCommand = new PutSecretValueCommand({
        SecretId: config.AWS_SECRETS_MANAGER_SECRET_NAME,
        SecretString: JSON.stringify(secrets),
      });

      await client.send(putCommand);
    } catch (error) {
      logger.error({ error, key }, 'Failed to update secret in AWS Secrets Manager');
      throw error;
    }
  }

  /**
   * Get secret from HashiCorp Vault
   */
  private async getFromVault(key: string): Promise<string | null> {
    try {
      if (!config.HASHICORP_VAULT_ADDR || !config.HASHICORP_VAULT_TOKEN) {
        return null;
      }

      const url = `${config.HASHICORP_VAULT_ADDR}/v1/secret/data/${key}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Vault-Token': config.HASHICORP_VAULT_TOKEN,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Vault request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.data?.data?.value || null;
    } catch (error) {
      logger.error({ error, key }, 'Failed to get secret from Vault');
      return null;
    }
  }

  /**
   * Update secret in HashiCorp Vault
   */
  private async updateVaultSecret(key: string, value: string): Promise<void> {
    try {
      if (!config.HASHICORP_VAULT_ADDR || !config.HASHICORP_VAULT_TOKEN) {
        throw new Error('Vault not configured');
      }

      const url = `${config.HASHICORP_VAULT_ADDR}/v1/secret/data/${key}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Vault-Token': config.HASHICORP_VAULT_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: { value },
        }),
      });

      if (!response.ok) {
        throw new Error(`Vault update failed: ${response.status}`);
      }
    } catch (error) {
      logger.error({ error, key }, 'Failed to update secret in Vault');
      throw error;
    }
  }

  /**
   * Clear cache (useful after secret rotation)
   */
  clearCache(): void {
    this.cache.clear();
    logger.debug('Secret cache cleared');
  }

  /**
   * Get current store type
   */
  getStoreType(): SecretStore {
    return this.store;
  }
}

// Singleton instance
export const secretManager = new SecretManagementService();

