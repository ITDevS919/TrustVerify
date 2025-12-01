/**
 * KYB (Know Your Business) Verification Service (Rule 7)
 * Implements enhanced due diligence for business clients
 */

import { db } from '../db';
import { clientOrganizations, users, kycVerifications } from '@shared/schema';
import { eq, and, or } from 'drizzle-orm';
import AuditService from './audit-logger';
import pino from 'pino';

const logger = pino({
  name: 'kyb-verification',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});

export interface KYBVerificationData {
  orgId: number;
  companyName: string;
  registrationNumber: string;
  registrationCountry: string;
  businessAddress: string;
  industry: string;
  website?: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  businessDescription: string;
  expectedTransactionVolume: number;
  sourceOfFunds: string;
  beneficialOwners: BeneficialOwner[];
  complianceDocuments: ComplianceDocument[];
}

export interface BeneficialOwner {
  name: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  ownershipPercentage: number;
  isPoliticallyExposed: boolean;
  sanctions: boolean;
}

export interface ComplianceDocument {
  type: 'certificate_of_incorporation' | 'memorandum_of_association' | 'proof_of_address' | 'director_identity' | 'beneficial_owner_proof';
  filename: string;
  uploadDate: Date;
  verified: boolean;
  notes?: string;
}

export class KYBVerificationService {

  /**
   * Initiate KYB verification process (Rule 7.1)
   */
  static async initiateKYBVerification(kybData: KYBVerificationData): Promise<{
    success: boolean;
    verificationId?: string;
    errors: string[];
    riskLevel: 'low' | 'medium' | 'high';
    requiresManualReview: boolean;
  }> {
    try {
      const errors: string[] = [];
      
      // Validate required data
      const validation = this.validateKYBData(kybData);
      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors,
          riskLevel: 'high',
          requiresManualReview: true
        };
      }

      // Assess risk level based on industry and other factors (Rule 7.2)
      const riskAssessment = await this.assessBusinessRisk(kybData);
      
      // Update organization with KYB data
      await db.update(clientOrganizations)
        .set({
          name: kybData.companyName,
          website: kybData.website,
          industry: kybData.industry,
          riskLevel: riskAssessment.riskLevel,
          kybStatus: 'pending',
          requiresManualApproval: riskAssessment.requiresManualApproval,
          enhancedMonitoring: riskAssessment.enhancedMonitoring
        })
        .where(eq(clientOrganizations.id, kybData.orgId));

      // Generate verification ID
      const verificationId = `KYB-${kybData.orgId}-${Date.now()}`;

      // Log KYB initiation
      await AuditService.logComplianceEvent(
        1, // System user
        'kyb_initiated',
        'client_organization',
        kybData.orgId.toString(),
        'KYB_VERIFICATION',
        kybData.orgId
      );

      logger.info({
        orgId: kybData.orgId,
        verificationId,
        riskLevel: riskAssessment.riskLevel,
        requiresManualReview: riskAssessment.requiresManualApproval
      }, 'KYB verification initiated');

      return {
        success: true,
        verificationId,
        errors: [],
        riskLevel: riskAssessment.riskLevel,
        requiresManualReview: riskAssessment.requiresManualApproval
      };

    } catch (error) {
      logger.error({ error, orgId: kybData.orgId }, 'Failed to initiate KYB verification');
      return {
        success: false,
        errors: ['System error during KYB initiation'],
        riskLevel: 'high',
        requiresManualReview: true
      };
    }
  }

  /**
   * Assess business risk level (Rule 7.2)
   */
  static async assessBusinessRisk(kybData: KYBVerificationData): Promise<{
    riskLevel: 'low' | 'medium' | 'high';
    requiresManualApproval: boolean;
    enhancedMonitoring: boolean;
    riskFactors: string[];
  }> {
    const riskFactors: string[] = [];
    let riskScore = 0;

    // High-risk industries (Rule 7.2)
    const highRiskIndustries = [
      'gambling', 'gaming', 'crypto', 'cryptocurrency', 
      'forex', 'foreign_exchange', 'money_services', 
      'adult_entertainment', 'tobacco', 'weapons'
    ];

    const mediumRiskIndustries = [
      'financial_services', 'payments', 'loans', 
      'investment', 'trading', 'real_estate'
    ];

    if (highRiskIndustries.includes(kybData.industry.toLowerCase())) {
      riskScore += 40;
      riskFactors.push('High-risk industry');
    } else if (mediumRiskIndustries.includes(kybData.industry.toLowerCase())) {
      riskScore += 20;
      riskFactors.push('Medium-risk industry');
    }

    // High transaction volume risk
    if (kybData.expectedTransactionVolume > 1000000) { // >£1M
      riskScore += 25;
      riskFactors.push('High transaction volume (>£1M)');
    } else if (kybData.expectedTransactionVolume > 100000) { // >£100K
      riskScore += 15;
      riskFactors.push('Medium transaction volume (>£100K)');
    }

    // Beneficial owner risks
    for (const owner of kybData.beneficialOwners) {
      if (owner.isPoliticallyExposed) {
        riskScore += 30;
        riskFactors.push(`PEP identified: ${owner.name}`);
      }
      if (owner.sanctions) {
        riskScore += 50;
        riskFactors.push(`Sanctioned individual: ${owner.name}`);
      }
      if (owner.ownershipPercentage >= 25) {
        // Significant ownership requires enhanced verification
        riskScore += 5;
      }
    }

    // Geographic risk (simplified)
    const highRiskCountries = ['AF', 'IR', 'KP', 'SY']; // Sanctioned countries
    if (highRiskCountries.includes(kybData.registrationCountry)) {
      riskScore += 40;
      riskFactors.push('High-risk jurisdiction');
    }

    // Document completeness
    const requiredDocs = ['certificate_of_incorporation', 'proof_of_address', 'director_identity'];
    const providedDocs = kybData.complianceDocuments.map(d => d.type);
    const missingDocs = requiredDocs.filter(doc => !providedDocs.includes(doc as any));
    
    if (missingDocs.length > 0) {
      riskScore += missingDocs.length * 10;
      riskFactors.push(`Missing documents: ${missingDocs.join(', ')}`);
    }

    // Determine final risk level
    let riskLevel: 'low' | 'medium' | 'high';
    let requiresManualApproval = false;
    let enhancedMonitoring = false;

    if (riskScore >= 60) {
      riskLevel = 'high';
      requiresManualApproval = true;
      enhancedMonitoring = true;
    } else if (riskScore >= 30) {
      riskLevel = 'medium';
      requiresManualApproval = true;
      enhancedMonitoring = true;
    } else {
      riskLevel = 'low';
      requiresManualApproval = false;
      enhancedMonitoring = false;
    }

    logger.info({
      orgId: kybData.orgId,
      riskScore,
      riskLevel,
      riskFactors,
      requiresManualApproval,
      enhancedMonitoring
    }, 'Business risk assessment completed');

    return {
      riskLevel,
      requiresManualApproval,
      enhancedMonitoring,
      riskFactors
    };
  }

  /**
   * Complete KYB verification (Rule 7.1)
   */
  static async completeKYBVerification(
    orgId: number,
    approved: boolean,
    reviewedBy: number,
    reviewNotes?: string,
    conditions?: string[]
  ): Promise<boolean> {
    try {
      const kybStatus = approved ? 'approved' : 'rejected';
      
      await db.update(clientOrganizations)
        .set({
          kybStatus,
          kybCompletedAt: new Date()
        })
        .where(eq(clientOrganizations.id, orgId));

      // Log KYB completion
      await AuditService.logComplianceEvent(
        reviewedBy,
        `kyb_${kybStatus}`,
        'client_organization',
        orgId.toString(),
        'KYB_VERIFICATION',
        orgId
      );

      logger.info({
        orgId,
        approved,
        reviewedBy,
        reviewNotes
      }, 'KYB verification completed');

      return true;

    } catch (error) {
      logger.error({ error, orgId }, 'Failed to complete KYB verification');
      return false;
    }
  }

  /**
   * Check if production access should be granted (Rule 7.3)
   */
  static async assessProductionReadiness(orgId: number): Promise<{
    ready: boolean;
    requirements: string[];
    checklist: { [key: string]: boolean };
  }> {
    try {
      const [org] = await db.select()
        .from(clientOrganizations)
        .where(eq(clientOrganizations.id, orgId));

      if (!org) {
        return {
          ready: false,
          requirements: ['Organization not found'],
          checklist: {}
        };
      }

      const checklist = {
        kybApproved: org.kybStatus === 'approved',
        serviceAgreementSigned: org.serviceAgreementSigned ?? false,
        securityChecklistCompleted: org.securityChecklistCompleted ?? false,
        testingCompleted: true, // Would check actual testing completion
        complianceTraining: true // Would check compliance training completion
      };

      const requirements: string[] = [];
      
      if (!checklist.kybApproved) {
        requirements.push('KYB verification must be approved');
      }
      if (!checklist.serviceAgreementSigned) {
        requirements.push('Service agreement must be signed');
      }
      if (!checklist.securityChecklistCompleted) {
        requirements.push('Security checklist must be completed');
      }
      if (!checklist.testingCompleted) {
        requirements.push('API testing phase must be completed');
      }
      if (!checklist.complianceTraining) {
        requirements.push('Compliance training must be completed');
      }

      const ready = requirements.length === 0;

      if (ready) {
        // Auto-approve for production if all requirements met
        await db.update(clientOrganizations)
          .set({ productionApproved: true })
          .where(eq(clientOrganizations.id, orgId));

        logger.info({ orgId }, 'Organization approved for production access');
      }

      return { ready, requirements, checklist };

    } catch (error) {
      logger.error({ error, orgId }, 'Failed to assess production readiness');
      return {
        ready: false,
        requirements: ['System error during assessment'],
        checklist: {}
      };
    }
  }

  /**
   * Enhanced KYC for high-value transactions (Rule 6.1)
   */
  static async performEnhancedKYC(
    userId: number,
    transactionAmount: number,
    reason: string = 'high_value_transaction'
  ): Promise<{
    required: boolean;
    kycLevel: 'basic' | 'enhanced' | 'full';
    additionalDocuments: string[];
  }> {
    try {
      // Enhanced KYC required for transactions >£10,000 (Rule 6.1)
      const enhancedKYCThreshold = 10000;
      const fullKYCThreshold = 50000;

      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, userId));

      if (!user) {
        return {
          required: true,
          kycLevel: 'full',
          additionalDocuments: ['identity_verification', 'proof_of_address', 'source_of_funds']
        };
      }

      let kycLevel: 'basic' | 'enhanced' | 'full';
      let additionalDocuments: string[] = [];

      if (transactionAmount >= fullKYCThreshold) {
        kycLevel = 'full';
        additionalDocuments = [
          'government_issued_id',
          'proof_of_address',
          'source_of_funds_documentation',
          'bank_statements',
          'tax_returns',
          'employment_verification'
        ];
      } else if (transactionAmount >= enhancedKYCThreshold) {
        kycLevel = 'enhanced';
        additionalDocuments = [
          'government_issued_id',
          'proof_of_address',
          'source_of_funds_declaration'
        ];
      } else {
        kycLevel = 'basic';
        additionalDocuments = [];
      }

      // Check current verification level
      const currentLevel = user.verificationLevel || 'none';
      const required = this.isKYCUpgradeRequired(currentLevel, kycLevel);

      if (required) {
        // Log enhanced KYC requirement
        await AuditService.logComplianceEvent(
          userId,
          'enhanced_kyc_required',
          'user',
          userId.toString(),
          'KYC_VERIFICATION'
        );

        logger.info({
          userId,
          transactionAmount,
          currentLevel,
          requiredLevel: kycLevel,
          reason
        }, 'Enhanced KYC required for high-value transaction');
      }

      return {
        required,
        kycLevel,
        additionalDocuments
      };

    } catch (error) {
      logger.error({ error, userId, transactionAmount }, 'Failed to perform enhanced KYC check');
      return {
        required: true,
        kycLevel: 'full',
        additionalDocuments: ['identity_verification', 'proof_of_address', 'source_of_funds']
      };
    }
  }

  // Private helper methods

  private static validateKYBData(kybData: KYBVerificationData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!kybData.companyName?.trim()) {
      errors.push('Company name is required');
    }

    if (!kybData.registrationNumber?.trim()) {
      errors.push('Company registration number is required');
    }

    if (!kybData.registrationCountry?.trim()) {
      errors.push('Registration country is required');
    }

    if (!kybData.businessAddress?.trim()) {
      errors.push('Business address is required');
    }

    if (!kybData.industry?.trim()) {
      errors.push('Industry classification is required');
    }

    if (!kybData.primaryContactName?.trim()) {
      errors.push('Primary contact name is required');
    }

    if (!kybData.primaryContactEmail?.trim() || !this.isValidEmail(kybData.primaryContactEmail)) {
      errors.push('Valid primary contact email is required');
    }

    if (!kybData.sourceOfFunds?.trim()) {
      errors.push('Source of funds declaration is required');
    }

    if (!kybData.beneficialOwners || kybData.beneficialOwners.length === 0) {
      errors.push('At least one beneficial owner is required');
    }

    // Validate beneficial owners
    kybData.beneficialOwners?.forEach((owner, index) => {
      if (!owner.name?.trim()) {
        errors.push(`Beneficial owner ${index + 1}: Name is required`);
      }
      if (!owner.dateOfBirth) {
        errors.push(`Beneficial owner ${index + 1}: Date of birth is required`);
      }
      if (owner.ownershipPercentage < 0 || owner.ownershipPercentage > 100) {
        errors.push(`Beneficial owner ${index + 1}: Invalid ownership percentage`);
      }
    });

    // Check total ownership doesn't exceed 100%
    const totalOwnership = kybData.beneficialOwners?.reduce((sum, owner) => sum + owner.ownershipPercentage, 0) || 0;
    if (totalOwnership > 100) {
      errors.push('Total beneficial ownership cannot exceed 100%');
    }

    return { valid: errors.length === 0, errors };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isKYCUpgradeRequired(currentLevel: string, requiredLevel: string): boolean {
    const levels = { 'none': 0, 'basic': 1, 'enhanced': 2, 'full': 3 };
    return (levels[currentLevel as keyof typeof levels] || 0) < (levels[requiredLevel as keyof typeof levels] || 0);
  }
}