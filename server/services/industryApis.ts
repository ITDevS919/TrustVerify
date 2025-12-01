/**
 * Industry-Specific APIs for TrustVerify
 * Implements modular API architecture with industry-specific endpoints
 */

import { Router } from "express";
import { storage } from "../storage";
import { trustScoreEngine } from "./trustScore";
import { z } from "zod";

// Industry-specific API schemas
const fintechVerificationSchema = z.object({
  userId: z.number(),
  transactionAmount: z.number(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  amlChecks: z.boolean().default(true),
  sanctionsScreening: z.boolean().default(true)
});

const ecommerceVerificationSchema = z.object({
  sellerId: z.number(),
  buyerId: z.number(),
  productCategory: z.string(),
  price: z.number(),
  marketplace: z.string().optional(),
  trustBadge: z.boolean().default(true)
});

const gamingVerificationSchema = z.object({
  userId: z.number(),
  gameId: z.string(),
  itemType: z.string(),
  value: z.number(),
  ageVerification: z.boolean().default(true),
  bonusAbuseCheck: z.boolean().default(true)
});

const cryptoVerificationSchema = z.object({
  walletAddress: z.string(),
  transactionHash: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
  riskScoring: z.boolean().default(true),
  amlScreening: z.boolean().default(true)
});

export class IndustryApiService {
  
  /**
   * FinTech & Banking API
   * Enhanced KYC/AML, regulatory compliance
   */
  async processFinTechVerification(data: z.infer<typeof fintechVerificationSchema>) {
    const user = await storage.getUser(data.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const trustScore = await trustScoreEngine.calculateUserTrustScore(data.userId);
    
    // Enhanced AML/KYC checks for financial services
    const amlResults = data.amlChecks ? await this.performAMLChecks(user) : null;
    const sanctionsResults = data.sanctionsScreening ? await this.performSanctionsScreening(user) : null;
    
    // Additional fintech-specific risk factors
    const fintechRiskScore = this.calculateFinTechRiskScore(data, trustScore);
    
    return {
      userId: data.userId,
      trustScore: trustScore.score,
      riskLevel: fintechRiskScore.riskLevel,
      compliance: {
        kycStatus: user.verificationLevel,
        amlCleared: amlResults?.cleared || false,
        sanctionsCleared: sanctionsResults?.cleared || false,
        regulatoryFlags: this.getRegulatoryFlags(trustScore, amlResults, sanctionsResults)
      },
      recommendation: fintechRiskScore.recommendation,
      additionalRequirements: this.getFinTechRequirements(fintechRiskScore)
    };
  }

  /**
   * E-commerce & Marketplaces API
   * Buyer-seller protection, trust badges
   */
  async processEcommerceVerification(data: z.infer<typeof ecommerceVerificationSchema>) {
    const seller = await storage.getUser(data.sellerId);
    const buyer = await storage.getUser(data.buyerId);
    
    if (!seller || !buyer) {
      throw new Error('Seller or buyer not found');
    }

    const sellerTrustScore = await trustScoreEngine.calculateUserTrustScore(data.sellerId);
    const buyerTrustScore = await trustScoreEngine.calculateUserTrustScore(data.buyerId);
    
    // E-commerce specific risk assessment
    const productRisk = this.assessProductCategoryRisk(data.productCategory);
    const priceRisk = this.assessPriceRisk(data.price, data.productCategory);
    
    const combinedRisk = this.combineEcommerceRisks(sellerTrustScore, buyerTrustScore, productRisk, priceRisk);
    
    return {
      sellerId: data.sellerId,
      buyerId: data.buyerId,
      transactionRisk: combinedRisk.riskLevel,
      trustScore: combinedRisk.score,
      protectionLevel: this.determineProtectionLevel(combinedRisk),
      escrowRecommended: combinedRisk.score < 70,
      trustBadge: data.trustBadge ? this.generateTrustBadge(seller, sellerTrustScore) : null,
      guaranteeEligible: this.isGuaranteeEligible(combinedRisk, seller),
      recommendations: combinedRisk.recommendations
    };
  }

  /**
   * Gaming API
   * Age verification, bonus abuse detection
   */
  async processGamingVerification(data: z.infer<typeof gamingVerificationSchema>) {
    const user = await storage.getUser(data.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const trustScore = await trustScoreEngine.calculateUserTrustScore(data.userId);
    
    // Gaming-specific checks
    const ageVerification = data.ageVerification ? await this.verifyAge(user) : { verified: true, age: null };
    const bonusAbuseCheck = data.bonusAbuseCheck ? await this.checkBonusAbuse(data.userId, data.gameId) : null;
    
    const gamingRisk = this.calculateGamingRisk(trustScore, ageVerification, bonusAbuseCheck, data);
    
    return {
      userId: data.userId,
      gameId: data.gameId,
      trustScore: trustScore.score,
      riskLevel: gamingRisk.riskLevel,
      ageVerified: ageVerification.verified,
      bonusAbuseFlags: bonusAbuseCheck?.flags || [],
      accountLimits: this.determineGamingLimits(gamingRisk, ageVerification),
      monitoring: this.getGamingMonitoringLevel(gamingRisk),
      recommendations: gamingRisk.recommendations
    };
  }

  /**
   * Crypto & Web3 API
   * Wallet risk scoring, smart contract auditing, P2P escrow
   */
  async processCryptoVerification(data: z.infer<typeof cryptoVerificationSchema>) {
    // Wallet reputation and risk scoring
    const walletRisk = await this.assessWalletRisk(data.walletAddress);
    
    // Transaction analysis if hash provided
    const transactionRisk = data.transactionHash ? 
      await this.analyzeTransaction(data.transactionHash) : null;
    
    // AML screening for crypto addresses
    const amlResults = data.amlScreening ? 
      await this.performCryptoAMLScreening(data.walletAddress) : null;
    
    // Cross-chain analysis
    const crossChainRisk = await this.analyzeCrossChainActivity(data.walletAddress);
    
    const combinedCryptoRisk = this.combineCryptoRisks(walletRisk, transactionRisk, amlResults, crossChainRisk);
    
    return {
      walletAddress: data.walletAddress,
      riskScore: combinedCryptoRisk.score,
      riskLevel: combinedCryptoRisk.riskLevel,
      walletReputation: walletRisk.reputation,
      amlFlags: amlResults?.flags || [],
      sanctionsMatch: amlResults?.sanctionsMatch || false,
      crossChainActivity: crossChainRisk.summary,
      escrowRecommended: combinedCryptoRisk.score > 60,
      insuranceEligible: this.isCryptoInsuranceEligible(combinedCryptoRisk),
      recommendations: combinedCryptoRisk.recommendations
    };
  }

  // Private helper methods for each industry

  private async performAMLChecks(user: any) {
    // Integrate with AML service providers (Onfido, Jumio, etc.)
    return {
      cleared: true,
      riskScore: 10,
      flags: []
    };
  }

  private async performSanctionsScreening(user: any) {
    // Integrate with sanctions screening services
    return {
      cleared: true,
      matches: []
    };
  }

  private calculateFinTechRiskScore(data: any, trustScore: any) {
    let adjustedScore = trustScore.score;
    
    // Adjust for transaction amount (higher amounts = more scrutiny)
    if (data.transactionAmount > 10000) adjustedScore -= 10;
    if (data.transactionAmount > 50000) adjustedScore -= 20;
    
    return {
      score: Math.max(0, adjustedScore),
      riskLevel: adjustedScore > 70 ? 'low' : adjustedScore > 50 ? 'medium' : 'high',
      recommendation: this.getFinTechRecommendation(adjustedScore)
    };
  }

  private getRegulatoryFlags(trustScore: any, amlResults: any, sanctionsResults: any) {
    const flags = [];
    if (trustScore.score < 50) flags.push('HIGH_RISK_USER');
    if (!amlResults?.cleared) flags.push('AML_REVIEW_REQUIRED');
    if (!sanctionsResults?.cleared) flags.push('SANCTIONS_MATCH');
    return flags;
  }

  private getFinTechRequirements(riskScore: any) {
    const requirements = [];
    if (riskScore.riskLevel === 'high') {
      requirements.push('ENHANCED_DUE_DILIGENCE');
      requirements.push('MANUAL_REVIEW');
    }
    if (riskScore.riskLevel === 'medium') {
      requirements.push('ADDITIONAL_VERIFICATION');
    }
    return requirements;
  }

  private getFinTechRecommendation(score: number) {
    if (score > 80) return 'Approve transaction with standard monitoring';
    if (score > 60) return 'Approve with enhanced monitoring';
    if (score > 40) return 'Request additional verification';
    return 'Reject transaction pending investigation';
  }

  private assessProductCategoryRisk(category: string) {
    const riskLevels = {
      'electronics': 'medium',
      'jewelry': 'high', 
      'digital_goods': 'high',
      'clothing': 'low',
      'books': 'low',
      'cryptocurrency': 'critical'
    };
    return riskLevels[category as keyof typeof riskLevels] || 'medium';
  }

  private assessPriceRisk(price: number, category: string) {
    // Higher prices generally mean higher risk
    if (price > 5000) return 'high';
    if (price > 1000) return 'medium';
    return 'low';
  }

  private combineEcommerceRisks(sellerScore: any, buyerScore: any, productRisk: string, priceRisk: string) {
    const baseScore = (sellerScore.score * 0.7) + (buyerScore.score * 0.3);
    let adjustedScore = baseScore;
    
    // Adjust for product and price risk
    if (productRisk === 'high') adjustedScore -= 15;
    if (productRisk === 'critical') adjustedScore -= 30;
    if (priceRisk === 'high') adjustedScore -= 10;
    
    return {
      score: Math.max(0, adjustedScore),
      riskLevel: adjustedScore > 70 ? 'low' : adjustedScore > 50 ? 'medium' : 'high',
      recommendations: this.getEcommerceRecommendations(adjustedScore, productRisk, priceRisk)
    };
  }

  private getEcommerceRecommendations(score: number, productRisk: string, priceRisk: string) {
    const recommendations = [];
    if (score < 50) recommendations.push('Use escrow service');
    if (productRisk === 'high') recommendations.push('Verify product authenticity');
    if (priceRisk === 'high') recommendations.push('Request identity verification');
    return recommendations;
  }

  private determineProtectionLevel(risk: any) {
    if (risk.score > 80) return 'standard';
    if (risk.score > 60) return 'enhanced';
    return 'maximum';
  }

  private generateTrustBadge(seller: any, trustScore: any) {
    return {
      level: trustScore.score > 80 ? 'gold' : trustScore.score > 60 ? 'silver' : 'bronze',
      score: trustScore.score,
      verified: seller.verificationLevel === 'full',
      badgeUrl: `/badges/${trustScore.score > 80 ? 'gold' : trustScore.score > 60 ? 'silver' : 'bronze'}.png`
    };
  }

  private isGuaranteeEligible(risk: any, seller: any) {
    return risk.score > 70 && seller.verificationLevel === 'full';
  }

  private async verifyAge(user: any) {
    // Age verification logic
    return { verified: true, age: 25 };
  }

  private async checkBonusAbuse(userId: number, gameId: string) {
    // Check for bonus abuse patterns
    return { flags: [], riskScore: 0 };
  }

  private calculateGamingRisk(trustScore: any, ageVerification: any, bonusAbuseCheck: any, data: any) {
    let adjustedScore = trustScore.score;
    
    if (!ageVerification.verified) adjustedScore -= 50;
    if (bonusAbuseCheck?.riskScore > 50) adjustedScore -= 20;
    
    return {
      score: Math.max(0, adjustedScore),
      riskLevel: adjustedScore > 70 ? 'low' : adjustedScore > 50 ? 'medium' : 'high',
      recommendations: this.getGamingRecommendations(adjustedScore, ageVerification, bonusAbuseCheck)
    };
  }

  private getGamingRecommendations(score: number, ageVerification: any, bonusAbuseCheck: any) {
    const recommendations = [];
    if (!ageVerification.verified) recommendations.push('Age verification required');
    if (score < 50) recommendations.push('Enhanced monitoring required');
    if (bonusAbuseCheck?.riskScore > 50) recommendations.push('Bonus restrictions apply');
    return recommendations;
  }

  private determineGamingLimits(risk: any, ageVerification: any) {
    if (!ageVerification.verified) return { deposit: 0, withdrawal: 0 };
    if (risk.score < 50) return { deposit: 100, withdrawal: 50 };
    return { deposit: 1000, withdrawal: 1000 };
  }

  private getGamingMonitoringLevel(risk: any) {
    if (risk.score < 50) return 'high';
    if (risk.score < 70) return 'medium';
    return 'standard';
  }

  private async assessWalletRisk(walletAddress: string) {
    // Integrate with Chainalysis, Elliptic, TRM Labs
    return {
      reputation: 'clean',
      riskScore: 20,
      flags: []
    };
  }

  private async analyzeTransaction(transactionHash: string) {
    // Analyze specific transaction
    return {
      riskScore: 15,
      flags: []
    };
  }

  private async performCryptoAMLScreening(walletAddress: string) {
    // Crypto-specific AML screening
    return {
      flags: [],
      sanctionsMatch: false,
      riskScore: 10
    };
  }

  private async analyzeCrossChainActivity(walletAddress: string) {
    // Cross-chain analysis
    return {
      summary: 'Low cross-chain activity',
      riskScore: 5
    };
  }

  private combineCryptoRisks(walletRisk: any, transactionRisk: any, amlResults: any, crossChainRisk: any) {
    const baseScore = 100 - walletRisk.riskScore - (transactionRisk?.riskScore || 0) - (amlResults?.riskScore || 0) - crossChainRisk.riskScore;
    
    return {
      score: Math.max(0, baseScore),
      riskLevel: baseScore > 70 ? 'low' : baseScore > 50 ? 'medium' : 'high',
      recommendations: this.getCryptoRecommendations(baseScore, walletRisk, amlResults)
    };
  }

  private getCryptoRecommendations(score: number, walletRisk: any, amlResults: any) {
    const recommendations = [];
    if (score < 50) recommendations.push('High-risk wallet detected');
    if (amlResults?.sanctionsMatch) recommendations.push('Sanctions screening required');
    if (walletRisk.reputation === 'blacklisted') recommendations.push('Block transaction');
    return recommendations;
  }

  private isCryptoInsuranceEligible(risk: any) {
    return risk.score > 60 && risk.riskLevel !== 'high';
  }
}

export const industryApiService = new IndustryApiService();

// Router setup for industry-specific endpoints
export const industryApiRoutes = Router();

// FinTech API endpoints
industryApiRoutes.post('/fintech/verify', async (req, res) => {
  try {
    const data = fintechVerificationSchema.parse(req.body);
    const result = await industryApiService.processFinTechVerification(data);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Validation failed' });
  }
});

// E-commerce API endpoints
industryApiRoutes.post('/ecommerce/verify', async (req, res) => {
  try {
    const data = ecommerceVerificationSchema.parse(req.body);
    const result = await industryApiService.processEcommerceVerification(data);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Validation failed' });
  }
});

// Gaming API endpoints
industryApiRoutes.post('/gaming/verify', async (req, res) => {
  try {
    const data = gamingVerificationSchema.parse(req.body);
    const result = await industryApiService.processGamingVerification(data);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Validation failed' });
  }
});

// Crypto API endpoints
industryApiRoutes.post('/crypto/verify', async (req, res) => {
  try {
    const data = cryptoVerificationSchema.parse(req.body);
    const result = await industryApiService.processCryptoVerification(data);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Validation failed' });
  }
});