/**
 * Fraud Detection Engine v2
 * Multi-signal scoring system with vendor integrations
 */

import { cacheService } from './cache-service';
import { storage } from '../storage';

export interface FraudSignal {
  signalType: string;
  signalName: string;
  score: number; // 0-100, higher = more risky
  weight: number; // 0-1, importance weight
  source: 'internal' | 'vendor' | 'ml';
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface FraudDetectionResult {
  overallScore: number; // 0-100, higher = more risky
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  signals: FraudSignal[];
  confidence: number; // 0-1, how confident we are in the score
  recommendations: string[];
  vendorResults?: {
    identity?: VendorIdentityResult;
    ip?: VendorIPResult;
    threatIntel?: VendorThreatIntelResult;
  };
  timestamp: Date;
}

export interface VendorIdentityResult {
  provider: string;
  verified: boolean;
  confidence: number;
  riskScore: number;
  flags: string[];
  metadata: Record<string, any>;
}

export interface VendorIPResult {
  provider: string;
  riskScore: number;
  isProxy: boolean;
  isVPN: boolean;
  isTor: boolean;
  country: string;
  city?: string;
  isp?: string;
  threatLevel: 'low' | 'medium' | 'high';
  flags: string[];
  metadata: Record<string, any>;
}

export interface VendorThreatIntelResult {
  provider: string;
  isThreat: boolean;
  threatTypes: string[];
  riskScore: number;
  lastSeen?: Date;
  metadata: Record<string, any>;
}

export interface FraudDetectionConfig {
  enableVendorAPIs: boolean;
  enableMLScoring: boolean;
  signalWeights: Record<string, number>;
  riskThresholds: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export class FraudDetectionEngineV2 {
  private config: FraudDetectionConfig;
  private signalCache: Map<string, FraudSignal[]> = new Map();

  constructor() {
    this.config = {
      enableVendorAPIs: process.env.FRAUD_ENABLE_VENDOR_APIS === 'true',
      enableMLScoring: process.env.FRAUD_ENABLE_ML === 'true',
      signalWeights: {
        // Internal signals
        accountAge: 0.10,
        transactionHistory: 0.15,
        deviceFingerprint: 0.12,
        behaviorPattern: 0.10,
        velocityChecks: 0.08,
        // Vendor signals
        identityVerification: 0.15,
        ipReputation: 0.12,
        threatIntelligence: 0.10,
        // ML signals
        anomalyDetection: 0.08,
      },
      riskThresholds: {
        low: 30,
        medium: 50,
        high: 70,
        critical: 85,
      },
    };
  }

  /**
   * Analyze transaction for fraud
   */
  async analyzeTransaction(
    transactionId: number,
    userId: number,
    ipAddress: string,
    userAgent?: string,
    deviceFingerprint?: string
  ): Promise<FraudDetectionResult> {
    const signals: FraudSignal[] = [];
    const vendorResults: FraudDetectionResult['vendorResults'] = {};

    // Gather internal signals
    const internalSignals = await this.gatherInternalSignals(
      userId,
      transactionId,
      ipAddress,
      userAgent,
      deviceFingerprint
    );
    signals.push(...internalSignals);

    // Gather vendor signals if enabled
    if (this.config.enableVendorAPIs) {
      const identityResult = await this.checkIdentityVendor(userId);
      if (identityResult) {
        vendorResults.identity = identityResult;
        signals.push({
          signalType: 'vendor',
          signalName: 'identity_verification',
          score: identityResult.riskScore,
          weight: this.config.signalWeights.identityVerification,
          source: 'vendor',
          metadata: identityResult.metadata,
          timestamp: new Date(),
        });
      }

      const ipResult = await this.checkIPVendor(ipAddress);
      if (ipResult) {
        vendorResults.ip = ipResult;
        signals.push({
          signalType: 'vendor',
          signalName: 'ip_reputation',
          score: ipResult.riskScore,
          weight: this.config.signalWeights.ipReputation,
          source: 'vendor',
          metadata: ipResult.metadata,
          timestamp: new Date(),
        });
      }

      const threatResult = await this.checkThreatIntelVendor(userId, ipAddress);
      if (threatResult) {
        vendorResults.threatIntel = threatResult;
        signals.push({
          signalType: 'vendor',
          signalName: 'threat_intelligence',
          score: threatResult.riskScore,
          weight: this.config.signalWeights.threatIntelligence,
          source: 'vendor',
          metadata: threatResult.metadata,
          timestamp: new Date(),
        });
      }
    }

    // ML-based anomaly detection if enabled
    if (this.config.enableMLScoring) {
      const mlSignals = await this.detectAnomalies(userId, transactionId, signals);
      signals.push(...mlSignals);
    }

    // Calculate weighted overall score
    const overallScore = this.calculateWeightedScore(signals);
    const riskLevel = this.determineRiskLevel(overallScore);
    const confidence = this.calculateConfidence(signals);
    const recommendations = this.generateRecommendations(overallScore, riskLevel, signals);

    const result: FraudDetectionResult = {
      overallScore,
      riskLevel,
      signals,
      confidence,
      recommendations,
      vendorResults: Object.keys(vendorResults).length > 0 ? vendorResults : undefined,
      timestamp: new Date(),
    };

    // Cache result
    await this.cacheResult(transactionId, result);

    return result;
  }

  /**
   * Gather internal fraud signals
   */
  private async gatherInternalSignals(
    userId: number,
    transactionId: number,
    _ipAddress: string,
    _userAgent?: string,
    deviceFingerprint?: string
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];
    const user = await storage.getUser(userId);
    if (!user) {
      return signals;
    }

    // Account age signal
    const accountAge = Date.now() - new Date(user.createdAt || new Date()).getTime();
    const accountAgeDays = accountAge / (1000 * 60 * 60 * 24);
    signals.push({
      signalType: 'internal',
      signalName: 'account_age',
      score: accountAgeDays < 7 ? 60 : accountAgeDays < 30 ? 30 : 10,
      weight: this.config.signalWeights.accountAge,
      source: 'internal',
      metadata: { days: accountAgeDays },
      timestamp: new Date(),
    });

    // Transaction history signal
    const transactions = await storage.getTransactionsByUser(userId, 100, 0);
    const completedCount = transactions.filter(t => t.status === 'completed').length;
    const disputeCount = transactions.filter(t => t.status === 'disputed').length;
    const disputeRatio = completedCount > 0 ? (disputeCount / completedCount) * 100 : 0;
    
    signals.push({
      signalType: 'internal',
      signalName: 'transaction_history',
      score: disputeRatio > 20 ? 80 : disputeRatio > 10 ? 50 : completedCount === 0 ? 40 : 15,
      weight: this.config.signalWeights.transactionHistory,
      source: 'internal',
      metadata: { completedCount, disputeCount, disputeRatio },
      timestamp: new Date(),
    });

    // Device fingerprint signal
    if (deviceFingerprint) {
      const deviceHistory = await this.checkDeviceHistory(deviceFingerprint, userId);
      signals.push({
        signalType: 'internal',
        signalName: 'device_fingerprint',
        score: deviceHistory.isNewDevice ? 50 : deviceHistory.isSuspicious ? 70 : 10,
        weight: this.config.signalWeights.deviceFingerprint,
        source: 'internal',
        metadata: deviceHistory,
        timestamp: new Date(),
      });
    }

    // Velocity checks (rapid transactions)
    const recentTransactions = transactions.filter(
      t => Date.now() - new Date(t.createdAt || new Date()).getTime() < 24 * 60 * 60 * 1000
    );
    signals.push({
      signalType: 'internal',
      signalName: 'velocity_checks',
      score: recentTransactions.length > 10 ? 70 : recentTransactions.length > 5 ? 40 : 10,
      weight: this.config.signalWeights.velocityChecks,
      source: 'internal',
      metadata: { recentCount: recentTransactions.length },
      timestamp: new Date(),
    });

    // Behavior pattern (transaction amount patterns)
    const avgAmount = transactions.length > 0
      ? transactions.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0) / transactions.length
      : 0;
    const currentTransaction = await storage.getTransaction(transactionId);
    if (currentTransaction && avgAmount > 0) {
      const currentAmount = parseFloat(currentTransaction.amount || '0');
      const deviation = Math.abs(currentAmount - avgAmount) / avgAmount;
      signals.push({
        signalType: 'internal',
        signalName: 'behavior_pattern',
        score: deviation > 5 ? 60 : deviation > 2 ? 30 : 10,
        weight: this.config.signalWeights.behaviorPattern,
        source: 'internal',
        metadata: { avgAmount, currentAmount, deviation },
        timestamp: new Date(),
      });
    }

    return signals;
  }

  /**
   * Check device history
   */
  private async checkDeviceHistory(
    deviceFingerprint: string,
    userId: number
  ): Promise<{ isNewDevice: boolean; isSuspicious: boolean; deviceCount: number }> {
    const cacheKey = `device:${deviceFingerprint}:${userId}`;
    const cached = await cacheService.get<{ isNewDevice: boolean; isSuspicious: boolean; deviceCount: number }>(cacheKey);
    
    if (cached && typeof cached === 'object' && 'isNewDevice' in cached) {
      return cached;
    }

    // Check if device was used by other users (suspicious)
    const deviceUsers = await cacheService.get<number[]>(`device:${deviceFingerprint}:users`) || [];
    const deviceUsersArray = Array.isArray(deviceUsers) ? deviceUsers : [];
    const isSuspicious = deviceUsersArray.length > 3;
    const isNewDevice = !deviceUsersArray.includes(userId);

    const result = {
      isNewDevice,
      isSuspicious,
      deviceCount: deviceUsersArray.length,
    };

    await cacheService.set(cacheKey, result, { ttl: 3600 * 24 }); // 24 hours
    return result;
  }

  /**
   * Check identity vendor
   */
  private async checkIdentityVendor(userId: number): Promise<VendorIdentityResult | null> {
    // This would integrate with vendors like:
    // - Jumio
    // - Onfido
    // - Trulioo
    // - Persona
    
    const user = await storage.getUser(userId);
    if (!user) {
      return null;
    }

    // Mock implementation - replace with actual vendor API calls
    const provider = process.env.IDENTITY_VENDOR || 'mock';
    
    // Check cache first (in-memory)
    const cacheKey = `identity:${userId}`;
    const cached = this.signalCache.get(cacheKey);
    if (cached && cached.length > 0) {
      const identitySignal = cached.find(s => s.signalName === 'identity_verification');
      if (identitySignal?.metadata) {
        return identitySignal.metadata as any;
      }
    }

    // Mock result - in production, call vendor API
    const result: VendorIdentityResult = {
      provider,
      verified: user.isVerified || false,
      confidence: user.isVerified ? 0.9 : 0.3,
      riskScore: user.isVerified ? 20 : 60,
      flags: user.isVerified ? [] : ['unverified_identity'],
      metadata: {
        verificationLevel: user.verificationLevel || 'none',
        kycStatus: user.isVerified ? 'verified' : 'unverified',
      },
    };

    // Cache in memory
    this.signalCache.set(cacheKey, [{
      signalType: 'vendor',
      signalName: 'identity_verification',
      score: result.riskScore,
      weight: 0,
      source: 'vendor',
      metadata: result,
      timestamp: new Date(),
    }]);

    return result;
  }

  /**
   * Check IP vendor
   */
  private async checkIPVendor(ipAddress: string): Promise<VendorIPResult | null> {
    // This would integrate with vendors like:
    // - MaxMind GeoIP2
    // - IPQualityScore
    // - AbuseIPDB
    // - IPinfo
    
    if (!ipAddress || ipAddress === 'unknown') {
      return null;
    }

    // Check cache first
    const cacheKey = `ip:${ipAddress}`;
    const cached = await cacheService.get<VendorIPResult>(cacheKey);
    if (cached && typeof cached === 'object' && 'provider' in cached) {
      return cached;
    }

    // Mock implementation - replace with actual vendor API calls
    const provider = process.env.IP_VENDOR || 'mock';
    
    // Mock result - in production, call vendor API
    const result: VendorIPResult = {
      provider,
      riskScore: 30, // Default moderate risk
      isProxy: false,
      isVPN: false,
      isTor: false,
      country: 'US',
      threatLevel: 'low',
      flags: [],
      metadata: {},
    };

    // Simulate some risk scenarios
    if (ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.')) {
      result.riskScore = 20; // Private IP, lower risk
    }

    await cacheService.set(cacheKey, result, { ttl: 3600 }); // 1 hour
    return result;
  }

  /**
   * Check threat intelligence vendor
   */
  private async checkThreatIntelVendor(
    userId: number,
    ipAddress: string
  ): Promise<VendorThreatIntelResult | null> {
    // This would integrate with vendors like:
    // - Recorded Future
    // - ThreatConnect
    // - AlienVault OTX
    // - AbuseIPDB
    
    // Check cache first (in-memory)
    const cacheKey = `threat:${userId}:${ipAddress}`;
    const cached = this.signalCache.get(cacheKey);
    if (cached && cached.length > 0) {
      const threatSignal = cached.find(s => s.signalName === 'threat_intelligence');
      if (threatSignal?.metadata) {
        return threatSignal.metadata as any;
      }
    }

    // Mock implementation - replace with actual vendor API calls
    const provider = process.env.THREAT_INTEL_VENDOR || 'mock';
    
    // Mock result - in production, call vendor API
    const result: VendorThreatIntelResult = {
      provider,
      isThreat: false,
      threatTypes: [],
      riskScore: 10,
      metadata: {},
    };

    // Cache in memory
    this.signalCache.set(cacheKey, [{
      signalType: 'vendor',
      signalName: 'threat_intelligence',
      score: result.riskScore,
      weight: 0,
      source: 'vendor',
      metadata: result,
      timestamp: new Date(),
    }]);

    return result;
  }

  /**
   * ML-based anomaly detection
   */
  private async detectAnomalies(
    _userId: number,
    _transactionId: number,
    existingSignals: FraudSignal[]
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    // Simple anomaly detection based on signal patterns
    // In production, this would use ML models
    const highRiskSignals = existingSignals.filter(s => s.score > 60);
    const anomalyScore = highRiskSignals.length > 3 ? 70 : highRiskSignals.length > 1 ? 40 : 10;

    signals.push({
      signalType: 'ml',
      signalName: 'anomaly_detection',
      score: anomalyScore,
      weight: this.config.signalWeights.anomalyDetection,
      source: 'ml',
      metadata: {
        highRiskSignalCount: highRiskSignals.length,
        pattern: highRiskSignals.length > 3 ? 'multiple_high_risk' : 'normal',
      },
      timestamp: new Date(),
    });

    return signals;
  }

  /**
   * Calculate weighted fraud score
   */
  private calculateWeightedScore(signals: FraudSignal[]): number {
    if (signals.length === 0) {
      return 0;
    }

    let weightedSum = 0;
    let totalWeight = 0;

    for (const signal of signals) {
      weightedSum += signal.score * signal.weight;
      totalWeight += signal.weight;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Determine risk level
   */
  private determineRiskLevel(score: number): FraudDetectionResult['riskLevel'] {
    if (score >= this.config.riskThresholds.critical) {
      return 'critical';
    }
    if (score >= this.config.riskThresholds.high) {
      return 'high';
    }
    if (score >= this.config.riskThresholds.medium) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Calculate confidence in the score
   */
  private calculateConfidence(signals: FraudSignal[]): number {
    if (signals.length === 0) {
      return 0;
    }

    // More signals = higher confidence
    const signalCount = signals.length;
    const vendorSignals = signals.filter(s => s.source === 'vendor').length;
    
    let confidence = Math.min(0.3 + (signalCount * 0.05), 0.9);
    confidence += vendorSignals * 0.05; // Vendor signals increase confidence
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    _score: number,
    riskLevel: FraudDetectionResult['riskLevel'],
    signals: FraudSignal[]
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push('Block transaction and flag for manual review');
      recommendations.push('Require additional identity verification');
    }

    if (riskLevel === 'medium') {
      recommendations.push('Require additional verification');
      recommendations.push('Monitor transaction closely');
    }

    const highRiskSignals = signals.filter(s => s.score > 60);
    if (highRiskSignals.some(s => s.signalName === 'ip_reputation')) {
      recommendations.push('Verify user location');
    }

    if (highRiskSignals.some(s => s.signalName === 'identity_verification')) {
      recommendations.push('Request KYC verification');
    }

    if (highRiskSignals.some(s => s.signalName === 'velocity_checks')) {
      recommendations.push('Review transaction velocity');
    }

    return recommendations;
  }

  /**
   * Cache fraud detection result
   */
  private async cacheResult(transactionId: number, result: FraudDetectionResult): Promise<void> {
    const cacheKey = `fraud:transaction:${transactionId}`;
    await cacheService.set(cacheKey, result, { ttl: 3600 * 24 }); // 24 hours
  }

  /**
   * Get cached result
   */
  async getCachedResult(transactionId: number): Promise<FraudDetectionResult | null> {
    const cacheKey = `fraud:transaction:${transactionId}`;
    return await cacheService.get(cacheKey);
  }
}

export const fraudDetectionEngineV2 = new FraudDetectionEngineV2();

