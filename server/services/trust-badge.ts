/**
 * Customer Trust Badge Service
 * Provides trust badge API and reporting dashboard
 */

import { config } from '../config';
import pino from 'pino';
import { storage } from '../storage';
import { trustScoreEngine } from './trustScore';

const logger = pino({
  name: 'trust-badge',
  level: config.LOG_LEVEL || 'info'
});

export interface TrustBadge {
  userId: number;
  badgeLevel: 'bronze' | 'silver' | 'gold' | 'platinum' | 'verified';
  score: number; // 0-100
  verified: boolean;
  kycStatus: 'none' | 'pending' | 'approved' | 'rejected';
  transactionCount: number;
  successRate: number; // 0-100
  accountAge: number; // days
  badges: string[];
  issuedAt: Date;
  expiresAt?: Date;
  metadata: Record<string, any>;
}

export interface TrustBadgeReport {
  userId: number;
  username: string;
  email: string;
  badge: TrustBadge;
  statistics: {
    totalTransactions: number;
    completedTransactions: number;
    successfulTransactions: number;
    disputeCount: number;
    averageTransactionAmount: number;
    totalVolume: number;
    lastTransactionDate?: Date;
  };
  trends: {
    scoreHistory: Array<{ date: Date; score: number }>;
    transactionVolume: Array<{ month: string; volume: number }>;
  };
  recommendations: string[];
}

export class TrustBadgeService {
  /**
   * Get or generate trust badge for user
   */
  async getTrustBadge(userId: number): Promise<TrustBadge> {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Calculate trust score
    const trustScoreResult = await trustScoreEngine.calculateUserTrustScore(userId);
    const score = trustScoreResult.score;

    // Get transaction statistics
    const transactions = await storage.getTransactionsByUser(userId, 1000, 0);
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    const successfulTransactions = completedTransactions.filter(t => {
      // Consider successful if completed without dispute
      return t.status === 'completed' && !t.fraudFlags;
    });
    // Note: disputeCount is calculated but not used in badge calculation
    // transactions.filter(t => t.status === 'disputed').length;

    const successRate = completedTransactions.length > 0
      ? (successfulTransactions.length / completedTransactions.length) * 100
      : 0;

    // Calculate account age
    const accountAge = user.createdAt
      ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Determine badge level
    const badgeLevel = this.determineBadgeLevel(score, successRate, accountAge, user.isVerified || false);

    // Collect badges
    const badges = this.collectBadges(user, score, successRate, accountAge, completedTransactions.length);

    const badge: TrustBadge = {
      userId,
      badgeLevel,
      score,
      verified: user.isVerified || false,
      kycStatus: user.verificationLevel === 'full' ? 'approved' : user.verificationLevel === 'basic' ? 'pending' : 'none',
      transactionCount: completedTransactions.length,
      successRate,
      accountAge,
      badges,
      issuedAt: new Date(),
      metadata: {
        trustScoreFactors: trustScoreResult.factors,
        flags: trustScoreResult.flags,
      },
    };

    return badge;
  }

  /**
   * Generate trust badge report
   */
  async generateReport(userId: number): Promise<TrustBadgeReport> {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const badge = await this.getTrustBadge(userId);

    // Get all transactions for statistics
    const transactions = await storage.getTransactionsByUser(userId, 10000, 0);
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    const successfulTransactions = completedTransactions.filter(t => !t.fraudFlags);
    const disputeCount = transactions.filter(t => t.status === 'disputed').length;

    const totalVolume = completedTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount || '0'),
      0
    );
    const averageTransactionAmount = completedTransactions.length > 0
      ? totalVolume / completedTransactions.length
      : 0;

    const lastTransaction = transactions.length > 0
      ? transactions.sort((a, b) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )[0]
      : null;

    // Generate trends (mock - in production, query historical data)
    const scoreHistory = this.generateScoreHistory(userId, 12); // Last 12 months
    const transactionVolume = this.generateTransactionVolume(transactions, 12); // Last 12 months

    // Generate recommendations
    const recommendations = this.generateRecommendations(badge, transactions);

    const report: TrustBadgeReport = {
      userId,
      username: user.username || 'unknown',
      email: user.email || 'unknown',
      badge,
      statistics: {
        totalTransactions: transactions.length,
        completedTransactions: completedTransactions.length,
        successfulTransactions: successfulTransactions.length,
        disputeCount,
        averageTransactionAmount,
        totalVolume,
        lastTransactionDate: lastTransaction?.createdAt ? new Date(lastTransaction.createdAt) : undefined,
      },
      trends: {
        scoreHistory,
        transactionVolume,
      },
      recommendations,
    };

    return report;
  }

  /**
   * Determine badge level
   */
  private determineBadgeLevel(
    score: number,
    successRate: number,
    accountAge: number,
    verified: boolean
  ): TrustBadge['badgeLevel'] {
    if (verified && score >= 90 && successRate >= 95 && accountAge >= 180) {
      return 'platinum';
    }
    if (verified && score >= 80 && successRate >= 90 && accountAge >= 90) {
      return 'gold';
    }
    if (score >= 70 && successRate >= 80 && accountAge >= 30) {
      return 'silver';
    }
    if (score >= 50 && successRate >= 70) {
      return 'bronze';
    }
    if (verified) {
      return 'verified';
    }
    return 'bronze';
  }

  /**
   * Collect badges for user
   */
  private collectBadges(
    user: any,
    score: number,
    successRate: number,
    accountAge: number,
    transactionCount: number
  ): string[] {
    const badges: string[] = [];

    if (user.isVerified) {
      badges.push('verified');
    }

    if (score >= 90) {
      badges.push('excellent_trust');
    } else if (score >= 80) {
      badges.push('high_trust');
    }

    if (successRate >= 95) {
      badges.push('reliable_seller');
    }

    if (accountAge >= 365) {
      badges.push('veteran');
    } else if (accountAge >= 180) {
      badges.push('experienced');
    }

    if (transactionCount >= 100) {
      badges.push('high_volume');
    } else if (transactionCount >= 50) {
      badges.push('active');
    }

    if (user.sellerTier === 'platinum' || user.sellerTier === 'gold') {
      badges.push('top_seller');
    }

    if (user.fastReleaseEligible) {
      badges.push('fast_release');
    }

    return badges;
  }

  /**
   * Generate score history (mock - replace with actual historical data)
   */
  private generateScoreHistory(_userId: number, months: number): Array<{ date: Date; score: number }> {
    const history: Array<{ date: Date; score: number }> = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      // Mock score - in production, query historical trust scores
      history.push({
        date,
        score: 70 + Math.random() * 20, // Random between 70-90
      });
    }

    return history;
  }

  /**
   * Generate transaction volume by month
   */
  private generateTransactionVolume(
    transactions: any[],
    months: number
  ): Array<{ month: string; volume: number }> {
    const volumeMap = new Map<string, number>();
    const now = new Date();

    // Initialize all months
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      volumeMap.set(monthKey, 0);
    }

    // Calculate volume per month
    for (const transaction of transactions) {
      if (transaction.createdAt && transaction.status === 'completed') {
        const date = new Date(transaction.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const current = volumeMap.get(monthKey) || 0;
        volumeMap.set(monthKey, current + parseFloat(transaction.amount || '0'));
      }
    }

    return Array.from(volumeMap.entries())
      .map(([month, volume]) => ({ month, volume }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(badge: TrustBadge, transactions: any[]): string[] {
    const recommendations: string[] = [];

    if (!badge.verified) {
      recommendations.push('Complete identity verification to improve your trust badge');
    }

    if (badge.score < 70) {
      recommendations.push('Complete more successful transactions to increase your trust score');
    }

    if (badge.successRate < 80) {
      recommendations.push('Focus on completing transactions successfully to improve your success rate');
    }

    if (badge.accountAge < 30) {
      recommendations.push('Build your account history by staying active on the platform');
    }

    const recentDisputes = transactions.filter(
      t => t.status === 'disputed' && 
      Date.now() - new Date(t.createdAt || 0).getTime() < 90 * 24 * 60 * 60 * 1000
    );

    if (recentDisputes.length > 0) {
      recommendations.push('Resolve any open disputes to maintain a good reputation');
    }

    if (badge.badgeLevel === 'bronze' && badge.score >= 60) {
      recommendations.push('You\'re close to Silver badge! Complete a few more successful transactions');
    }

    return recommendations;
  }

  /**
   * Get badge image URL (for embedding in websites)
   */
  getBadgeImageUrl(userId: number, badgeLevel: TrustBadge['badgeLevel']): string {
    const baseUrl = process.env.BADGE_BASE_URL || 'https://trustverify.com/badges';
    return `${baseUrl}/${badgeLevel}.svg?userId=${userId}`;
  }

  /**
   * Get badge embed code (HTML)
   */
  getBadgeEmbedCode(userId: number, badgeLevel: TrustBadge['badgeLevel']): string {
    const imageUrl = this.getBadgeImageUrl(userId, badgeLevel);
    const badgeUrl = `${process.env.FRONTEND_URL || 'https://trustverify.com'}/badge/${userId}`;
    
    return `<a href="${badgeUrl}" target="_blank" rel="noopener noreferrer">
      <img src="${imageUrl}" alt="TrustVerify ${badgeLevel} badge" style="height: 40px; width: auto;" />
    </a>`;
  }
}

export const trustBadgeService = new TrustBadgeService();

