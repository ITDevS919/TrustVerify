/**
 * Webhook Service
 * Manages webhook configurations and deliveries
 */

import { storage } from '../storage';
import { createHmac } from 'crypto';
import { randomBytes } from 'crypto';
import { z } from 'zod';

export interface WebhookConfig {
  id?: number;
  developerId: number;
  name: string;
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
  retryPolicy?: {
    maxRetries: number;
    backoff: 'linear' | 'exponential';
  };
}

export interface WebhookDelivery {
  id?: number;
  webhookId: number;
  eventType: string;
  payload: Record<string, any>;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  statusCode?: number;
  responseBody?: string;
  attemptNumber: number;
  deliveredAt?: Date;
}

const webhookConfigSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  events: z.array(z.string()).min(1),
  isActive: z.boolean().default(true),
  retryPolicy: z.object({
    maxRetries: z.number().min(0).max(10).default(3),
    backoff: z.enum(['linear', 'exponential']).default('exponential'),
  }).optional(),
});

export class WebhookService {
  /**
   * Create webhook configuration
   */
  async createWebhook(
    developerId: number,
    data: Omit<WebhookConfig, 'id' | 'developerId' | 'secret'>
  ): Promise<WebhookConfig> {
    const validated = webhookConfigSchema.parse(data);
    
    // Generate webhook secret
    const secret = `whsec_${randomBytes(32).toString('hex')}`;

    const webhook = await storage.createWebhookConfiguration({
      developerId,
      ...validated,
      secret,
    });

    return webhook;
  }

  /**
   * Get webhook by ID
   */
  async getWebhook(webhookId: number, developerId: number): Promise<WebhookConfig | null> {
    const webhook = await storage.getWebhookConfiguration(webhookId);
    
    if (!webhook || webhook.developerId !== developerId) {
      return null;
    }

    return webhook;
  }

  /**
   * List webhooks for developer
   */
  async listWebhooks(developerId: number): Promise<WebhookConfig[]> {
    return await storage.listWebhookConfigurations(developerId);
  }

  /**
   * Update webhook
   */
  async updateWebhook(
    webhookId: number,
    developerId: number,
    updates: Partial<Omit<WebhookConfig, 'id' | 'developerId' | 'secret'>>
  ): Promise<WebhookConfig> {
    const existing = await this.getWebhook(webhookId, developerId);
    if (!existing) {
      throw new Error('Webhook not found or access denied');
    }

    const validated = webhookConfigSchema.partial().parse(updates);
    
    return await storage.updateWebhookConfiguration(webhookId, validated);
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(webhookId: number, developerId: number): Promise<void> {
    const existing = await this.getWebhook(webhookId, developerId);
    if (!existing) {
      throw new Error('Webhook not found or access denied');
    }

    await storage.deleteWebhookConfiguration(webhookId);
  }

  /**
   * Generate webhook signature
   */
  generateSignature(payload: string, secret: string): string {
    const hmac = createHmac('sha256', secret);
    hmac.update(payload);
    return hmac.digest('hex');
  }

  /**
   * Verify webhook signature
   */
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = this.generateSignature(payload, secret);
    return signature === expectedSignature;
  }

  /**
   * Deliver webhook event
   */
  async deliverWebhook(
    webhookId: number,
    eventType: string,
    payload: Record<string, any>
  ): Promise<WebhookDelivery> {
    const webhook = await storage.getWebhookConfiguration(webhookId);
    if (!webhook || !webhook.isActive) {
      throw new Error('Webhook not found or inactive');
    }

    // Create delivery record
    const delivery = await storage.createWebhookDelivery({
      webhookId,
      eventType,
      payload,
      status: 'pending',
      attemptNumber: 1,
    });

    // Attempt delivery
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-TrustVerify-Event': eventType,
          'X-TrustVerify-Signature': this.generateSignature(JSON.stringify(payload), webhook.secret),
          'X-TrustVerify-Delivery-Id': delivery.id!.toString(),
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.text();

      await storage.updateWebhookDelivery(delivery.id!, {
        status: response.ok ? 'delivered' : 'failed',
        statusCode: response.status,
        responseBody: responseBody.substring(0, 1000), // Limit response body size
        deliveredAt: new Date(),
      });

      return {
        ...delivery,
        status: response.ok ? 'delivered' : 'failed',
        statusCode: response.status,
        responseBody: responseBody.substring(0, 1000),
        deliveredAt: new Date(),
      };
    } catch (error: any) {
      await storage.updateWebhookDelivery(delivery.id!, {
        status: 'failed',
        responseBody: error.message?.substring(0, 1000),
      });

      // Retry logic
      const retryPolicy = webhook.retryPolicy || { maxRetries: 3, backoff: 'exponential' };
      if (delivery.attemptNumber < retryPolicy.maxRetries) {
        await this.retryWebhook(delivery.id!, retryPolicy);
      }

      throw error;
    }
  }

  /**
   * Retry webhook delivery
   */
  private async retryWebhook(
    deliveryId: number,
    retryPolicy: { maxRetries: number; backoff: 'linear' | 'exponential' }
  ): Promise<void> {
    const delivery = await storage.getWebhookDelivery(deliveryId);
    if (!delivery) return;

    const delay = retryPolicy.backoff === 'exponential'
      ? Math.pow(2, delivery.attemptNumber) * 1000 // Exponential: 2s, 4s, 8s...
      : delivery.attemptNumber * 2000; // Linear: 2s, 4s, 6s...

    setTimeout(async () => {
      await storage.updateWebhookDelivery(deliveryId, {
        status: 'retrying',
        attemptNumber: delivery.attemptNumber + 1,
      });

      try {
        await this.deliverWebhook(delivery.webhookId, delivery.eventType, delivery.payload);
      } catch (error) {
        // Will be handled by retry logic
      }
    }, delay);
  }

  /**
   * Get webhook delivery logs
   */
  async getDeliveryLogs(webhookId: number, developerId: number, limit = 50): Promise<WebhookDelivery[]> {
    const webhook = await this.getWebhook(webhookId, developerId);
    if (!webhook) {
      throw new Error('Webhook not found or access denied');
    }

    return await storage.getWebhookDeliveries(webhookId, limit);
  }
}

export const webhookService = new WebhookService();

