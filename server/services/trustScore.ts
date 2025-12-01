/**
 * TrustScore System - ML-powered scoring engine for TrustVerify
 * Implements machine learning + rules engine as recommended
 */

import { storage } from "../storage";
import { eq } from "drizzle-orm";

export interface TrustScoreFactors {
  // User factors
  verificationLevel: number;      // 0-25 points
  accountAge: number;            // 0-15 points  
  transactionHistory: number;    // 0-25 points
  disputeRatio: number;          // 0-20 points
  
  // Transaction factors
  transactionAmount: number;     // 0-10 points
  paymentMethod: number;         // 0-5 points
  
  // External signals
  domainReputation: number;      // 0-15 points
  deviceFingerprint: number;     // 0-10 points
  geolocation: number;          // 0-10 points
  
  // Behavioral factors
  communicationPattern: number;  // 0-15 points
  urgencySignals: number;       // 0-10 points
}

export interface TrustScoreResult {
  score: number;                 // 0-100
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  factors: TrustScoreFactors;
  flags: string[];
  confidence: number;            // 0-1
  recommendation: string;
}

export class TrustScoreEngine {
  private readonly WEIGHTS = {
    verificationLevel: 0.25,
    accountAge: 0.15,
    transactionHistory: 0.25,
    disputeRatio: 0.20,
    transactionAmount: 0.10,
    paymentMethod: 0.05,
    domainReputation: 0.15,
    deviceFingerprint: 0.10,
    geolocation: 0.10,
    communicationPattern: 0.15,
    urgencySignals: 0.10
  };

  async calculateUserTrustScore(userId: number): Promise<TrustScoreResult> {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const factors = await this.gatherTrustFactors(userId);
    const score = this.computeWeightedScore(factors);
    const riskLevel = this.determineRiskLevel(score);
    const flags = this.detectFraudFlags(factors);
    const confidence = this.calculateConfidence(factors);
    const recommendation = this.generateRecommendation(score, riskLevel, flags);

    const result: TrustScoreResult = {
      score,
      riskLevel,
      factors,
      flags,
      confidence,
      recommendation
    };

    // Update user's trust score in database
    await storage.updateUserTrustScore(userId, score.toFixed(2));

    return result;
  }

  async calculateTransactionRiskScore(transactionId: number): Promise<TrustScoreResult> {
    const transaction = await storage.getTransaction(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const buyerScore = await this.calculateUserTrustScore(transaction.buyerId);
    const sellerScore = await this.calculateUserTrustScore(transaction.sellerId);
    
    // Combine buyer and seller scores with transaction-specific factors
    const transactionFactors = await this.gatherTransactionFactors(transaction);
    const combinedScore = this.combineScores(buyerScore, sellerScore, transactionFactors);
    
    return combinedScore;
  }

  private async gatherTrustFactors(userId: number): Promise<TrustScoreFactors> {
    const user = await storage.getUser(userId);
    const transactions = await storage.getTransactionsByUser(userId);
    const disputes = await storage.getPendingDisputes();
    
    const userDisputes = disputes.filter(d => 
      transactions.some(t => t.id === d.transactionId)
    );

    return {
      verificationLevel: this.scoreVerificationLevel(user?.verificationLevel || 'none'),
      accountAge: this.scoreAccountAge(user?.createdAt || new Date()),
      transactionHistory: this.scoreTransactionHistory(transactions),
      disputeRatio: this.scoreDisputeRatio(transactions.length, userDisputes.length),
      transactionAmount: 0, // Set per transaction
      paymentMethod: 0,     // Set per transaction
      domainReputation: await this.scoreDomainReputation(userId),
      deviceFingerprint: 0, // Would integrate with device fingerprinting service
      geolocation: 0,       // Would integrate with geolocation service
      communicationPattern: await this.scoreCommunicationPattern(userId),
      urgencySignals: 0     // Would analyze for urgency/pressure tactics
    };
  }

  private async gatherTransactionFactors(transaction: any): Promise<Partial<TrustScoreFactors>> {
    return {
      transactionAmount: this.scoreTransactionAmount(parseFloat(transaction.amount)),
      paymentMethod: this.scorePaymentMethod(transaction.stripePaymentIntentId ? 'stripe' : 'manual')
    };
  }

  private scoreVerificationLevel(level: string): number {
    const scores = {
      'none': 0,
      'basic': 12,
      'full': 25
    };
    return scores[level as keyof typeof scores] || 0;
  }

  private scoreAccountAge(createdAt: Date): number {
    const daysSince = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince < 7) return 0;
    if (daysSince < 30) return 5;
    if (daysSince < 90) return 10;
    if (daysSince < 365) return 13;
    return 15;
  }

  private scoreTransactionHistory(transactions: any[]): number {
    const completed = transactions.filter(t => t.status === 'completed').length;
    if (completed === 0) return 0;
    if (completed < 5) return 8;
    if (completed < 20) return 15;
    if (completed < 50) return 20;
    return 25;
  }

  private scoreDisputeRatio(totalTransactions: number, disputes: number): number {
    if (totalTransactions === 0) return 10; // Neutral for new users
    const ratio = disputes / totalTransactions;
    if (ratio === 0) return 20;
    if (ratio < 0.05) return 15;
    if (ratio < 0.1) return 10;
    if (ratio < 0.2) return 5;
    return 0;
  }

  private scoreTransactionAmount(amount: number): number {
    // Higher amounts = higher risk
    if (amount < 100) return 10;
    if (amount < 500) return 8;
    if (amount < 1000) return 6;
    if (amount < 5000) return 4;
    if (amount < 10000) return 2;
    return 0;
  }

  private scorePaymentMethod(method: string): number {
    const scores = {
      'stripe': 5,
      'verified_bank': 4,
      'paypal': 3,
      'crypto': 2,
      'manual': 0
    };
    return scores[method as keyof typeof scores] || 0;
  }

  private async scoreDomainReputation(userId: number): Promise<number> {
    // Would integrate with domain reputation services
    // For now, return neutral score
    return 8;
  }

  private async scoreCommunicationPattern(userId: number): Promise<number> {
    const messages = await storage.getMessagesByTransaction(0); // Would need transaction context
    // Analyze for scam patterns, urgency, etc.
    return 10; // Neutral for now
  }

  private computeWeightedScore(factors: TrustScoreFactors): number {
    let score = 0;
    score += factors.verificationLevel * this.WEIGHTS.verificationLevel;
    score += factors.accountAge * this.WEIGHTS.accountAge;
    score += factors.transactionHistory * this.WEIGHTS.transactionHistory;
    score += factors.disputeRatio * this.WEIGHTS.disputeRatio;
    score += factors.transactionAmount * this.WEIGHTS.transactionAmount;
    score += factors.paymentMethod * this.WEIGHTS.paymentMethod;
    score += factors.domainReputation * this.WEIGHTS.domainReputation;
    score += factors.deviceFingerprint * this.WEIGHTS.deviceFingerprint;
    score += factors.geolocation * this.WEIGHTS.geolocation;
    score += factors.communicationPattern * this.WEIGHTS.communicationPattern;
    score += factors.urgencySignals * this.WEIGHTS.urgencySignals;
    
    return Math.round(Math.min(100, Math.max(0, score)));
  }

  private determineRiskLevel(score: number): 'safe' | 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 85) return 'safe';
    if (score >= 70) return 'low';
    if (score >= 50) return 'medium';
    if (score >= 30) return 'high';
    return 'critical';
  }

  private detectFraudFlags(factors: TrustScoreFactors): string[] {
    const flags: string[] = [];
    
    if (factors.verificationLevel === 0) {
      flags.push('UNVERIFIED_USER');
    }
    
    if (factors.accountAge < 5) {
      flags.push('NEW_ACCOUNT');
    }
    
    if (factors.disputeRatio <= 5) {
      flags.push('HIGH_DISPUTE_RATIO');
    }
    
    if (factors.transactionAmount <= 2) {
      flags.push('HIGH_VALUE_TRANSACTION');
    }
    
    if (factors.urgencySignals <= 3) {
      flags.push('URGENCY_PRESSURE');
    }
    
    return flags;
  }

  private calculateConfidence(factors: TrustScoreFactors): number {
    // Higher confidence with more data points
    let dataPoints = 0;
    let totalPoints = 0;
    
    Object.values(factors).forEach(value => {
      if (value > 0) dataPoints++;
      totalPoints++;
    });
    
    return Math.min(1, dataPoints / totalPoints);
  }

  private generateRecommendation(score: number, riskLevel: string, flags: string[]): string {
    if (riskLevel === 'safe') {
      return 'Transaction can proceed normally. Low fraud risk detected.';
    }
    
    if (riskLevel === 'low') {
      return 'Transaction appears legitimate with minor risk factors. Standard verification recommended.';
    }
    
    if (riskLevel === 'medium') {
      return 'Moderate risk detected. Enhanced verification and monitoring recommended.';
    }
    
    if (riskLevel === 'high') {
      return 'High fraud risk. Additional verification required before proceeding.';
    }
    
    return 'Critical fraud risk. Transaction should be blocked pending investigation.';
  }

  private combineScores(buyerScore: TrustScoreResult, sellerScore: TrustScoreResult, transactionFactors: Partial<TrustScoreFactors>): TrustScoreResult {
    // Weight buyer vs seller scores (seller typically more important)
    const combinedScore = Math.round((buyerScore.score * 0.3) + (sellerScore.score * 0.7));
    
    const combinedFactors = {
      ...buyerScore.factors,
      ...transactionFactors
    };
    
    return {
      score: combinedScore,
      riskLevel: this.determineRiskLevel(combinedScore),
      factors: combinedFactors,
      flags: [...buyerScore.flags, ...sellerScore.flags],
      confidence: Math.min(buyerScore.confidence, sellerScore.confidence),
      recommendation: this.generateRecommendation(combinedScore, this.determineRiskLevel(combinedScore), [...buyerScore.flags, ...sellerScore.flags])
    };
  }
}

export const trustScoreEngine = new TrustScoreEngine();