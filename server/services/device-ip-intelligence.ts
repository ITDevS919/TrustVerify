/**
 * Device/IP Intelligence Service
 * Standalone service for IP reputation, device fingerprinting, and threat intelligence
 * Extracted from vendor-integrations and fraud-detection-v2 to match architecture diagram
 */

import { config } from '../config';
import pino from 'pino';
import { cacheService } from './cache-service';
import { vendorIntegrations } from './vendor-integrations';

const logger = pino({
  name: 'device-ip-intelligence',
  level: config.LOG_LEVEL || 'info'
});

export interface IPReputationResult {
  riskScore: number; // 0-100, higher = more risky
  isProxy: boolean;
  isVPN: boolean;
  isTor: boolean;
  country: string;
  city?: string;
  isp?: string;
  threatLevel: 'low' | 'medium' | 'high';
  flags: string[];
  metadata: Record<string, any>;
  provider?: string;
}

export interface DeviceFingerprintResult {
  deviceId: string;
  isNewDevice: boolean;
  isSuspicious: boolean;
  deviceCount: number; // Number of users who have used this device
  firstSeen?: Date;
  lastSeen?: Date;
  associatedUsers: number[];
  riskScore: number; // 0-100, higher = more risky
  flags: string[];
  metadata: Record<string, any>;
}

export interface ThreatIntelligenceResult {
  isThreat: boolean;
  threatTypes: string[];
  riskScore: number; // 0-100, higher = more risky
  lastSeen?: Date;
  metadata: Record<string, any>;
  provider?: string;
}

export interface DeviceIPRiskAssessment {
  overallRiskScore: number; // 0-100, weighted combination
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  ipReputation: IPReputationResult | null;
  deviceFingerprint: DeviceFingerprintResult | null;
  threatIntelligence: ThreatIntelligenceResult | null;
  recommendations: string[];
  flags: string[];
  metadata: Record<string, any>;
}

export class DeviceIPIntelligenceService {
  /**
   * Check IP reputation using vendor integrations
   */
  async checkIPReputation(ipAddress: string): Promise<IPReputationResult | null> {
    if (!ipAddress || ipAddress === 'unknown') {
      logger.debug('Invalid IP address provided');
      return null;
    }

    try {
      // Check cache first
      const cacheKey = `ip_reputation:${ipAddress}`;
      const cached = await cacheService.get<IPReputationResult>(cacheKey);
      if (cached && typeof cached === 'object' && 'riskScore' in cached) {
        logger.debug({ ipAddress }, 'Returning cached IP reputation');
        return cached;
      }

      // Use vendor integrations for IP reputation
      const vendorResult = await vendorIntegrations.checkIPReputation(ipAddress);
      
      if (!vendorResult) {
        logger.debug({ ipAddress }, 'IP reputation check returned no result');
        return null;
      }

      // Convert vendor result to our format
      const result: IPReputationResult = {
        riskScore: vendorResult.riskScore,
        isProxy: vendorResult.isProxy,
        isVPN: vendorResult.isVPN,
        isTor: vendorResult.isTor,
        country: vendorResult.country,
        city: vendorResult.city,
        isp: vendorResult.isp,
        threatLevel: vendorResult.threatLevel,
        flags: vendorResult.flags,
        metadata: {
          ...vendorResult.metadata,
          provider: process.env.IP_VENDOR || 'maxmind',
        },
        provider: process.env.IP_VENDOR || 'maxmind',
      };

      // Cache result for 1 hour
      await cacheService.set(cacheKey, result, { ttl: 3600 });
      
      logger.info({ ipAddress, riskScore: result.riskScore }, 'IP reputation checked');
      return result;
    } catch (error: any) {
      logger.error({ error, ipAddress }, 'IP reputation check failed');
      return null;
    }
  }

  /**
   * Check device fingerprint and analyze device history
   */
  async checkDeviceFingerprint(
    deviceFingerprint: string,
    userId: number
  ): Promise<DeviceFingerprintResult | null> {
    if (!deviceFingerprint) {
      logger.debug('No device fingerprint provided');
      return null;
    }

    try {
      // Check cache first
      const cacheKey = `device_fingerprint:${deviceFingerprint}:${userId}`;
      const cached = await cacheService.get<DeviceFingerprintResult>(cacheKey);
      if (cached && typeof cached === 'object' && 'deviceId' in cached) {
        logger.debug({ deviceFingerprint, userId }, 'Returning cached device fingerprint');
        return cached;
      }

      // Check device history
      const deviceUsers = await cacheService.get<number[]>(`device:${deviceFingerprint}:users`) || [];
      const deviceUsersArray = Array.isArray(deviceUsers) ? deviceUsers : [];
      
      // Check if device was used by other users (suspicious)
      const isSuspicious = deviceUsersArray.length > 3;
      const isNewDevice = !deviceUsersArray.includes(userId);

      // Calculate risk score
      let riskScore = 10; // Base risk
      if (isNewDevice) riskScore += 40;
      if (isSuspicious) riskScore += 30;
      if (deviceUsersArray.length > 5) riskScore += 20;

      // Get device usage history
      const deviceHistory = await cacheService.get<{
        firstSeen: Date;
        lastSeen: Date;
      }>(`device:${deviceFingerprint}:history`);

      const result: DeviceFingerprintResult = {
        deviceId: deviceFingerprint,
        isNewDevice,
        isSuspicious,
        deviceCount: deviceUsersArray.length,
        firstSeen: deviceHistory?.firstSeen,
        lastSeen: deviceHistory?.lastSeen || new Date(),
        associatedUsers: deviceUsersArray,
        riskScore: Math.min(100, riskScore),
        flags: [
          ...(isNewDevice ? ['new_device'] : []),
          ...(isSuspicious ? ['suspicious_device_reuse'] : []),
          ...(deviceUsersArray.length > 5 ? ['high_device_sharing'] : []),
        ],
        metadata: {
          checkedAt: new Date().toISOString(),
        },
      };

      // Update device users list
      if (!deviceUsersArray.includes(userId)) {
        deviceUsersArray.push(userId);
        await cacheService.set(`device:${deviceFingerprint}:users`, deviceUsersArray, { ttl: 86400 * 30 }); // 30 days
      }

      // Update device history
      if (!deviceHistory) {
        await cacheService.set(`device:${deviceFingerprint}:history`, {
          firstSeen: new Date(),
          lastSeen: new Date(),
        }, { ttl: 86400 * 30 }); // 30 days
      } else {
        await cacheService.set(`device:${deviceFingerprint}:history`, {
          ...deviceHistory,
          lastSeen: new Date(),
        }, { ttl: 86400 * 30 }); // 30 days
      }

      // Cache result for 1 hour
      await cacheService.set(cacheKey, result, { ttl: 3600 });
      
      logger.info({ deviceFingerprint, userId, riskScore: result.riskScore }, 'Device fingerprint checked');
      return result;
    } catch (error: any) {
      logger.error({ error, deviceFingerprint, userId }, 'Device fingerprint check failed');
      return null;
    }
  }

  /**
   * Check threat intelligence for IP address and user
   */
  async checkThreatIntelligence(
    userId: number,
    ipAddress: string,
    email?: string
  ): Promise<ThreatIntelligenceResult | null> {
    if (!ipAddress || ipAddress === 'unknown') {
      logger.debug('Invalid IP address for threat intelligence check');
      return null;
    }

    try {
      // Check cache first
      const cacheKey = `threat_intel:${userId}:${ipAddress}`;
      const cached = await cacheService.get<ThreatIntelligenceResult>(cacheKey);
      if (cached && typeof cached === 'object' && 'isThreat' in cached) {
        logger.debug({ userId, ipAddress }, 'Returning cached threat intelligence');
        return cached;
      }

      // Use vendor integrations for threat intelligence
      const vendorResult = await vendorIntegrations.checkThreatIntelligence(userId, ipAddress, email);
      
      if (!vendorResult) {
        logger.debug({ userId, ipAddress }, 'Threat intelligence check returned no result');
        return null;
      }

      // Convert vendor result to our format
      const result: ThreatIntelligenceResult = {
        isThreat: vendorResult.isThreat,
        threatTypes: vendorResult.threatTypes,
        riskScore: vendorResult.riskScore,
        lastSeen: vendorResult.lastSeen,
        metadata: {
          ...vendorResult.metadata,
          provider: process.env.THREAT_INTEL_VENDOR || 'recordedfuture',
        },
        provider: process.env.THREAT_INTEL_VENDOR || 'recordedfuture',
      };

      // Cache result for 1 hour
      await cacheService.set(cacheKey, result, { ttl: 3600 });
      
      logger.info({ userId, ipAddress, isThreat: result.isThreat, riskScore: result.riskScore }, 'Threat intelligence checked');
      return result;
    } catch (error: any) {
      logger.error({ error, userId, ipAddress }, 'Threat intelligence check failed');
      return null;
    }
  }

  /**
   * Comprehensive risk assessment combining IP, device, and threat intelligence
   */
  async assessDeviceIPRisk(
    userId: number,
    ipAddress: string,
    deviceFingerprint?: string,
    email?: string
  ): Promise<DeviceIPRiskAssessment> {
    try {
      // Run all checks in parallel
      const [ipReputation, deviceFingerprintResult, threatIntelligence] = await Promise.all([
        this.checkIPReputation(ipAddress),
        deviceFingerprint ? this.checkDeviceFingerprint(deviceFingerprint, userId) : Promise.resolve(null),
        this.checkThreatIntelligence(userId, ipAddress, email),
      ]);

      // Calculate weighted overall risk score
      let overallRiskScore = 0;
      let totalWeight = 0;
      const flags: string[] = [];
      const recommendations: string[] = [];

      // IP Reputation (weight: 0.4)
      if (ipReputation) {
        overallRiskScore += ipReputation.riskScore * 0.4;
        totalWeight += 0.4;
        flags.push(...ipReputation.flags);
        
        if (ipReputation.isProxy || ipReputation.isVPN) {
          flags.push('proxy_or_vpn_detected');
          recommendations.push('Consider additional identity verification');
        }
        if (ipReputation.isTor) {
          flags.push('tor_network_detected');
          recommendations.push('High risk: Tor network usage detected');
        }
        if (ipReputation.threatLevel === 'high') {
          recommendations.push('IP address has high threat level');
        }
      }

      // Device Fingerprint (weight: 0.3)
      if (deviceFingerprintResult) {
        overallRiskScore += deviceFingerprintResult.riskScore * 0.3;
        totalWeight += 0.3;
        flags.push(...deviceFingerprintResult.flags);
        
        if (deviceFingerprintResult.isNewDevice) {
          recommendations.push('New device detected - consider additional verification');
        }
        if (deviceFingerprintResult.isSuspicious) {
          recommendations.push('Device shared across multiple accounts - high risk');
        }
      }

      // Threat Intelligence (weight: 0.3)
      if (threatIntelligence) {
        overallRiskScore += threatIntelligence.riskScore * 0.3;
        totalWeight += 0.3;
        
        if (threatIntelligence.isThreat) {
          flags.push('threat_detected');
          flags.push(...threatIntelligence.threatTypes.map(t => `threat_${t}`));
          recommendations.push('Threat intelligence indicates potential security risk');
        }
      }

      // Normalize risk score
      if (totalWeight > 0) {
        overallRiskScore = overallRiskScore / totalWeight;
      } else {
        overallRiskScore = 50; // Default moderate risk if no data
      }

      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high' | 'critical';
      if (overallRiskScore >= 85) {
        riskLevel = 'critical';
      } else if (overallRiskScore >= 65) {
        riskLevel = 'high';
      } else if (overallRiskScore >= 40) {
        riskLevel = 'medium';
      } else {
        riskLevel = 'low';
      }

      // Add default recommendations if none
      if (recommendations.length === 0 && riskLevel !== 'low') {
        recommendations.push(`Risk level: ${riskLevel} - monitor transaction closely`);
      }

      const assessment: DeviceIPRiskAssessment = {
        overallRiskScore: Math.round(overallRiskScore),
        riskLevel,
        ipReputation,
        deviceFingerprint: deviceFingerprintResult,
        threatIntelligence,
        recommendations,
        flags: [...new Set(flags)], // Remove duplicates
        metadata: {
          assessedAt: new Date().toISOString(),
          userId,
          ipAddress,
          deviceFingerprint: deviceFingerprint || null,
        },
      };

      logger.info({ 
        userId, 
        ipAddress, 
        overallRiskScore: assessment.overallRiskScore, 
        riskLevel: assessment.riskLevel 
      }, 'Device/IP risk assessment completed');

      return assessment;
    } catch (error: any) {
      logger.error({ error, userId, ipAddress }, 'Device/IP risk assessment failed');
      
      // Return default assessment on error
      return {
        overallRiskScore: 50,
        riskLevel: 'medium',
        ipReputation: null,
        deviceFingerprint: null,
        threatIntelligence: null,
        recommendations: ['Unable to complete full risk assessment'],
        flags: ['assessment_error'],
        metadata: {
          error: error.message,
          assessedAt: new Date().toISOString(),
        },
      };
    }
  }
}

export const deviceIPIntelligence = new DeviceIPIntelligenceService();

