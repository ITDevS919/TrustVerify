/**
 * Escrow Service Integration for TrustVerify
 * Implements modular escrow with multiple providers (Mangopay, Stripe Treasury, etc.)
 */

import { storage } from "../storage";
import { trustScoreEngine } from "./trustScore";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required for escrow services');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

export interface EscrowProvider {
  name: string;
  createEscrow(amount: number, currency: string, buyerId: number, sellerId: number): Promise<EscrowAccount>;
  releaseEscrow(escrowId: string, amount?: number): Promise<EscrowTransaction>;
  refundEscrow(escrowId: string, reason?: string): Promise<EscrowTransaction>;
  getEscrowStatus(escrowId: string): Promise<EscrowStatus>;
}

export interface EscrowAccount {
  id: string;
  providerId: string;
  amount: number;
  currency: string;
  status: 'created' | 'funded' | 'held' | 'released' | 'refunded';
  buyerId: number;
  sellerId: number;
  createdAt: Date;
  expiresAt?: Date;
}

export interface EscrowTransaction {
  id: string;
  escrowId: string;
  type: 'release' | 'refund' | 'partial_release';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

export interface EscrowStatus {
  escrowId: string;
  status: string;
  availableAmount: number;
  totalAmount: number;
  transactions: EscrowTransaction[];
}

/**
 * Stripe Treasury Escrow Provider
 * Uses Stripe's financial account capabilities for escrow
 */
export class StripeTreasuryProvider implements EscrowProvider {
  name = 'stripe_treasury';

  async createEscrow(amount: number, currency: string, buyerId: number, sellerId: number): Promise<EscrowAccount> {
    // Create a payment intent for escrow funding
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: currency.toLowerCase(),
      capture_method: 'manual', // Don't capture immediately
      metadata: {
        type: 'escrow',
        buyerId: buyerId.toString(),
        sellerId: sellerId.toString(),
      },
    });

    const escrowAccount: EscrowAccount = {
      id: paymentIntent.id,
      providerId: this.name,
      amount,
      currency,
      status: 'created',
      buyerId,
      sellerId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    return escrowAccount;
  }

  async releaseEscrow(escrowId: string, amount?: number): Promise<EscrowTransaction> {
    const paymentIntent = await stripe.paymentIntents.retrieve(escrowId);
    
    if (!paymentIntent) {
      throw new Error('Escrow account not found');
    }

    // Capture the payment to release funds
    const captured = await stripe.paymentIntents.capture(escrowId, {
      amount_to_capture: amount ? amount * 100 : undefined,
    });

    return {
      id: `rel_${Date.now()}`,
      escrowId,
      type: amount ? 'partial_release' : 'release',
      amount: amount || paymentIntent.amount / 100,
      status: captured.status === 'succeeded' ? 'completed' : 'pending',
      createdAt: new Date(),
      completedAt: captured.status === 'succeeded' ? new Date() : undefined,
    };
  }

  async refundEscrow(escrowId: string, reason?: string): Promise<EscrowTransaction> {
    const paymentIntent = await stripe.paymentIntents.retrieve(escrowId);
    
    if (!paymentIntent) {
      throw new Error('Escrow account not found');
    }

    // Cancel the payment intent to refund
    const refund = await stripe.paymentIntents.cancel(escrowId);

    return {
      id: `ref_${Date.now()}`,
      escrowId,
      type: 'refund',
      amount: paymentIntent.amount / 100,
      status: refund.status === 'canceled' ? 'completed' : 'pending',
      createdAt: new Date(),
      completedAt: refund.status === 'canceled' ? new Date() : undefined,
    };
  }

  async getEscrowStatus(escrowId: string): Promise<EscrowStatus> {
    const paymentIntent = await stripe.paymentIntents.retrieve(escrowId);
    
    if (!paymentIntent) {
      throw new Error('Escrow account not found');
    }

    return {
      escrowId,
      status: paymentIntent.status,
      availableAmount: paymentIntent.amount / 100,
      totalAmount: paymentIntent.amount / 100,
      transactions: [], // Would fetch from our database
    };
  }
}

/**
 * Mock Mangopay Provider (placeholder for real integration)
 */
export class MangopayProvider implements EscrowProvider {
  name = 'mangopay';

  async createEscrow(amount: number, currency: string, buyerId: number, sellerId: number): Promise<EscrowAccount> {
    // Mock implementation - would integrate with Mangopay API
    return {
      id: `mango_${Date.now()}`,
      providerId: this.name,
      amount,
      currency,
      status: 'created',
      buyerId,
      sellerId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
  }

  async releaseEscrow(escrowId: string, amount?: number): Promise<EscrowTransaction> {
    return {
      id: `mango_rel_${Date.now()}`,
      escrowId,
      type: amount ? 'partial_release' : 'release',
      amount: amount || 0,
      status: 'completed',
      createdAt: new Date(),
      completedAt: new Date(),
    };
  }

  async refundEscrow(escrowId: string, reason?: string): Promise<EscrowTransaction> {
    return {
      id: `mango_ref_${Date.now()}`,
      escrowId,
      type: 'refund',
      amount: 0,
      status: 'completed',
      createdAt: new Date(),
      completedAt: new Date(),
    };
  }

  async getEscrowStatus(escrowId: string): Promise<EscrowStatus> {
    return {
      escrowId,
      status: 'held',
      availableAmount: 1000,
      totalAmount: 1000,
      transactions: [],
    };
  }
}

/**
 * Escrow Service Manager
 * Manages multiple escrow providers and intelligent routing
 */
export class EscrowService {
  private providers: Map<string, EscrowProvider> = new Map();
  private defaultProvider = 'stripe_treasury';

  constructor() {
    this.providers.set('stripe_treasury', new StripeTreasuryProvider());
    this.providers.set('mangopay', new MangopayProvider());
  }

  async createEscrowTransaction(transactionId: number, providerPreference?: string): Promise<EscrowAccount> {
    const transaction = await storage.getTransaction(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Calculate trust scores to determine escrow requirements
    const buyerTrust = await trustScoreEngine.calculateUserTrustScore(transaction.buyerId);
    const sellerTrust = await trustScoreEngine.calculateUserTrustScore(transaction.sellerId);
    const transactionRisk = await trustScoreEngine.calculateTransactionRiskScore(transactionId);

    // Select optimal escrow provider based on risk and preferences
    const provider = this.selectOptimalProvider(transactionRisk, providerPreference);
    
    const escrowAccount = await provider.createEscrow(
      parseFloat(transaction.amount),
      transaction.currency || 'USD',
      transaction.buyerId,
      transaction.sellerId
    );

    // Update transaction with escrow information
    await storage.updateTransactionStatus(transactionId, 'escrow');
    await storage.updateTransactionStripeId(transactionId, escrowAccount.id);

    return escrowAccount;
  }

  async releaseEscrowFunds(transactionId: number, amount?: number): Promise<EscrowTransaction> {
    const transaction = await storage.getTransaction(transactionId);
    if (!transaction || !transaction.stripePaymentIntentId) {
      throw new Error('Transaction or escrow not found');
    }

    // Verify transaction is eligible for release
    await this.verifyReleaseEligibility(transaction);

    const provider = this.getProviderForTransaction(transaction);
    const releaseResult = await provider.releaseEscrow(transaction.stripePaymentIntentId, amount);

    // Update transaction status
    if (releaseResult.status === 'completed') {
      await storage.updateTransactionStatus(transactionId, 'completed');
    }

    return releaseResult;
  }

  async refundEscrowFunds(transactionId: number, reason: string): Promise<EscrowTransaction> {
    const transaction = await storage.getTransaction(transactionId);
    if (!transaction || !transaction.stripePaymentIntentId) {
      throw new Error('Transaction or escrow not found');
    }

    const provider = this.getProviderForTransaction(transaction);
    const refundResult = await provider.refundEscrow(transaction.stripePaymentIntentId, reason);

    // Update transaction status
    if (refundResult.status === 'completed') {
      await storage.updateTransactionStatus(transactionId, 'refunded');
    }

    return refundResult;
  }

  async getEscrowStatus(transactionId: number): Promise<EscrowStatus> {
    const transaction = await storage.getTransaction(transactionId);
    if (!transaction || !transaction.stripePaymentIntentId) {
      throw new Error('Transaction or escrow not found');
    }

    const provider = this.getProviderForTransaction(transaction);
    return await provider.getEscrowStatus(transaction.stripePaymentIntentId);
  }

  private selectOptimalProvider(transactionRisk: any, preference?: string): EscrowProvider {
    // If user has preference and it's available, use it
    if (preference && this.providers.has(preference)) {
      return this.providers.get(preference)!;
    }

    // High-risk transactions might benefit from different providers
    if (transactionRisk.riskLevel === 'critical' || transactionRisk.riskLevel === 'high') {
      return this.providers.get('mangopay') || this.providers.get(this.defaultProvider)!;
    }

    // Default to Stripe for most transactions
    return this.providers.get(this.defaultProvider)!;
  }

  private getProviderForTransaction(transaction: any): EscrowProvider {
    // Determine provider based on transaction metadata or escrow ID format
    if (transaction.stripePaymentIntentId?.startsWith('pi_')) {
      return this.providers.get('stripe_treasury')!;
    }
    if (transaction.stripePaymentIntentId?.startsWith('mango_')) {
      return this.providers.get('mangopay')!;
    }
    
    return this.providers.get(this.defaultProvider)!;
  }

  private async verifyReleaseEligibility(transaction: any): Promise<void> {
    // Check if transaction is in correct status
    if (transaction.status !== 'escrow' && transaction.status !== 'active') {
      throw new Error('Transaction not eligible for release');
    }

    // Check for any pending disputes
    const disputes = await storage.getDisputesByTransaction(transaction.id);
    const pendingDisputes = disputes.filter(d => d.status === 'open' || d.status === 'investigating');
    
    if (pendingDisputes.length > 0) {
      throw new Error('Cannot release funds with pending disputes');
    }

    // Check buffer period (if applicable)
    if (transaction.bufferEndTime && new Date() < transaction.bufferEndTime) {
      throw new Error('Cannot release funds during buffer period');
    }
  }

  async isEscrowRecommended(transactionId: number): Promise<{ recommended: boolean; reason: string; riskLevel: string }> {
    const transaction = await storage.getTransaction(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const riskScore = await trustScoreEngine.calculateTransactionRiskScore(transactionId);
    
    // Escrow recommendations based on risk and amount
    const amount = parseFloat(transaction.amount);
    const isHighValue = amount > 1000;
    const isHighRisk = riskScore.riskLevel === 'high' || riskScore.riskLevel === 'critical';
    const isMediumRisk = riskScore.riskLevel === 'medium';
    
    if (isHighRisk) {
      return {
        recommended: true,
        reason: 'High fraud risk detected - escrow strongly recommended',
        riskLevel: riskScore.riskLevel
      };
    }
    
    if (isHighValue && isMediumRisk) {
      return {
        recommended: true,
        reason: 'High value transaction with moderate risk - escrow recommended',
        riskLevel: riskScore.riskLevel
      };
    }
    
    if (isHighValue) {
      return {
        recommended: true,
        reason: 'High value transaction - escrow recommended for protection',
        riskLevel: riskScore.riskLevel
      };
    }
    
    return {
      recommended: false,
      reason: 'Low risk transaction - escrow optional',
      riskLevel: riskScore.riskLevel
    };
  }
}

export const escrowService = new EscrowService();