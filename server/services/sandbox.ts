/**
 * Sandbox Mode Service
 * Provides synthetic personas and test data for client testing
 */

import { config } from '../config';
import pino from 'pino';
import { storage } from '../storage';
import { randomBytes } from 'crypto';

const logger = pino({
  name: 'sandbox',
  level: config.LOG_LEVEL || 'info'
});

export interface SyntheticPersona {
  id: string;
  type: 'buyer' | 'seller' | 'both';
  profile: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    trustScore: number;
    verificationLevel: 'none' | 'basic' | 'full';
    accountAge: number; // days
    transactionCount: number;
    successRate: number;
  };
  behavior: {
    transactionFrequency: 'low' | 'medium' | 'high';
    averageTransactionAmount: number;
    disputeRate: number;
    responseTime: 'fast' | 'medium' | 'slow';
  };
  riskProfile: 'low' | 'medium' | 'high';
  metadata: Record<string, any>;
}

export interface SandboxScenario {
  id: string;
  name: string;
  description: string;
  personas: SyntheticPersona[];
  transactions: Array<{
    buyerId: string;
    sellerId: string;
    amount: number;
    status: 'pending' | 'active' | 'completed' | 'disputed';
    fraudRisk?: 'low' | 'medium' | 'high';
  }>;
  createdAt: Date;
}

export class SandboxService {
  private personas: Map<string, SyntheticPersona> = new Map();
  private scenarios: Map<string, SandboxScenario> = new Map();
  private enabled: boolean = false;

  constructor() {
    this.enabled = process.env.SANDBOX_ENABLED === 'true' || config.NODE_ENV === 'development';
    
    if (this.enabled) {
      this.initializeDefaultPersonas();
      this.initializeDefaultScenarios();
    }
  }

  /**
   * Check if sandbox mode is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Initialize default synthetic personas
   */
  private initializeDefaultPersonas(): void {
    // Low-risk buyer
    this.personas.set('buyer_low_risk', {
      id: 'buyer_low_risk',
      type: 'buyer',
      profile: {
        username: 'test_buyer_trusted',
        email: 'buyer.trusted@test.trustverify.com',
        firstName: 'John',
        lastName: 'Trusted',
        trustScore: 85,
        verificationLevel: 'full',
        accountAge: 365,
        transactionCount: 50,
        successRate: 98,
      },
      behavior: {
        transactionFrequency: 'medium',
        averageTransactionAmount: 500,
        disputeRate: 0,
        responseTime: 'fast',
      },
      riskProfile: 'low',
      metadata: {
        description: 'Trusted buyer with excellent history',
      },
    });

    // High-risk buyer
    this.personas.set('buyer_high_risk', {
      id: 'buyer_high_risk',
      type: 'buyer',
      profile: {
        username: 'test_buyer_risky',
        email: 'buyer.risky@test.trustverify.com',
        firstName: 'Jane',
        lastName: 'Risky',
        trustScore: 35,
        verificationLevel: 'none',
        accountAge: 5,
        transactionCount: 2,
        successRate: 50,
      },
      behavior: {
        transactionFrequency: 'high',
        averageTransactionAmount: 5000,
        disputeRate: 50,
        responseTime: 'slow',
      },
      riskProfile: 'high',
      metadata: {
        description: 'High-risk buyer with suspicious patterns',
      },
    });

    // Trusted seller
    this.personas.set('seller_trusted', {
      id: 'seller_trusted',
      type: 'seller',
      profile: {
        username: 'test_seller_trusted',
        email: 'seller.trusted@test.trustverify.com',
        firstName: 'Alice',
        lastName: 'Reliable',
        trustScore: 92,
        verificationLevel: 'full',
        accountAge: 730,
        transactionCount: 200,
        successRate: 99,
      },
      behavior: {
        transactionFrequency: 'high',
        averageTransactionAmount: 1000,
        disputeRate: 1,
        responseTime: 'fast',
      },
      riskProfile: 'low',
      metadata: {
        description: 'Platinum seller with excellent reputation',
        sellerTier: 'platinum',
      },
    });

    // New seller
    this.personas.set('seller_new', {
      id: 'seller_new',
      type: 'seller',
      profile: {
        username: 'test_seller_new',
        email: 'seller.new@test.trustverify.com',
        firstName: 'Bob',
        lastName: 'Newbie',
        trustScore: 45,
        verificationLevel: 'basic',
        accountAge: 10,
        transactionCount: 3,
        successRate: 67,
      },
      behavior: {
        transactionFrequency: 'low',
        averageTransactionAmount: 200,
        disputeRate: 33,
        responseTime: 'medium',
      },
      riskProfile: 'medium',
      metadata: {
        description: 'New seller building reputation',
        sellerTier: 'new',
      },
    });

    // Fraudulent persona
    this.personas.set('fraudster', {
      id: 'fraudster',
      type: 'both',
      profile: {
        username: 'test_fraudster',
        email: 'fraudster@test.trustverify.com',
        firstName: 'Scam',
        lastName: 'Artist',
        trustScore: 15,
        verificationLevel: 'none',
        accountAge: 1,
        transactionCount: 0,
        successRate: 0,
      },
      behavior: {
        transactionFrequency: 'high',
        averageTransactionAmount: 10000,
        disputeRate: 100,
        responseTime: 'slow',
      },
      riskProfile: 'high',
      metadata: {
        description: 'Synthetic fraudster for testing detection',
        fraudFlags: ['new_account', 'high_value', 'suspicious_patterns'],
      },
    });
  }

  /**
   * Initialize default test scenarios
   */
  private initializeDefaultScenarios(): void {
    // Normal transaction scenario
    this.scenarios.set('normal_transaction', {
      id: 'normal_transaction',
      name: 'Normal Transaction Flow',
      description: 'Standard transaction between trusted users',
      personas: [
        this.personas.get('buyer_low_risk')!,
        this.personas.get('seller_trusted')!,
      ],
      transactions: [
        {
          buyerId: 'buyer_low_risk',
          sellerId: 'seller_trusted',
          amount: 500,
          status: 'completed',
          fraudRisk: 'low',
        },
      ],
      createdAt: new Date(),
    });

    // High-risk transaction scenario
    this.scenarios.set('high_risk_transaction', {
      id: 'high_risk_transaction',
      name: 'High-Risk Transaction',
      description: 'Transaction with high fraud risk',
      personas: [
        this.personas.get('buyer_high_risk')!,
        this.personas.get('seller_new')!,
      ],
      transactions: [
        {
          buyerId: 'buyer_high_risk',
          sellerId: 'seller_new',
          amount: 5000,
          status: 'pending',
          fraudRisk: 'high',
        },
      ],
      createdAt: new Date(),
    });

    // Fraud detection scenario
    this.scenarios.set('fraud_detection', {
      id: 'fraud_detection',
      name: 'Fraud Detection Test',
      description: 'Scenario to test fraud detection engine',
      personas: [
        this.personas.get('fraudster')!,
        this.personas.get('seller_trusted')!,
      ],
      transactions: [
        {
          buyerId: 'fraudster',
          sellerId: 'seller_trusted',
          amount: 10000,
          status: 'pending',
          fraudRisk: 'high',
        },
      ],
      createdAt: new Date(),
    });
  }

  /**
   * Get all available personas
   */
  getPersonas(): SyntheticPersona[] {
    return Array.from(this.personas.values());
  }

  /**
   * Get persona by ID
   */
  getPersona(id: string): SyntheticPersona | undefined {
    return this.personas.get(id);
  }

  /**
   * Create custom persona
   */
  createPersona(persona: Omit<SyntheticPersona, 'id'>): SyntheticPersona {
    const id = `persona_${Date.now()}_${randomBytes(4).toString('hex')}`;
    const newPersona: SyntheticPersona = {
      ...persona,
      id,
    };
    this.personas.set(id, newPersona);
    return newPersona;
  }

  /**
   * Get all scenarios
   */
  getScenarios(): SandboxScenario[] {
    return Array.from(this.scenarios.values());
  }

  /**
   * Get scenario by ID
   */
  getScenario(id: string): SandboxScenario | undefined {
    return this.scenarios.get(id);
  }

  /**
   * Create custom scenario
   */
  createScenario(scenario: Omit<SandboxScenario, 'id' | 'createdAt'>): SandboxScenario {
    const id = `scenario_${Date.now()}_${randomBytes(4).toString('hex')}`;
    const newScenario: SandboxScenario = {
      ...scenario,
      id,
      createdAt: new Date(),
    };
    this.scenarios.set(id, newScenario);
    return newScenario;
  }

  /**
   * Execute scenario (create synthetic users and transactions)
   */
  async executeScenario(scenarioId: string): Promise<{
    users: number[];
    transactions: number[];
  }> {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error('Scenario not found');
    }

    const userIds: number[] = [];
    const transactionIds: number[] = [];

    // Create users for personas
    for (const persona of scenario.personas) {
      const user = await storage.createUser({
        username: persona.profile.username,
        email: persona.profile.email,
        firstName: persona.profile.firstName,
        lastName: persona.profile.lastName,
        password: 'test_password_123', // In sandbox, use simple password
        isVerified: persona.profile.verificationLevel === 'full',
      });
      
      // Update verification level and trust score separately
      if (persona.profile.verificationLevel !== 'none') {
        await storage.updateUserVerificationLevel(user.id, persona.profile.verificationLevel);
      }
      await storage.updateUserTrustScore(user.id, persona.profile.trustScore.toString());

      userIds.push(user.id);

      // Update user to match persona profile
      // Note: This would require additional storage methods
      logger.info({ userId: user.id, personaId: persona.id }, 'Created sandbox user');
    }

    // Create transactions
    for (const transaction of scenario.transactions) {
      const buyerPersona = scenario.personas.find(p => p.id === transaction.buyerId);
      const sellerPersona = scenario.personas.find(p => p.id === transaction.sellerId);

      if (!buyerPersona || !sellerPersona) {
        continue;
      }

      const buyerUser = await storage.getUserByEmail(buyerPersona.profile.email);
      const sellerUser = await storage.getUserByEmail(sellerPersona.profile.email);

      if (!buyerUser || !sellerUser) {
        continue;
      }

      const createdTransaction = await storage.createTransaction({
        title: `Sandbox Transaction - ${scenario.name}`,
        description: `Test transaction from scenario ${scenarioId}`,
        amount: transaction.amount.toString(),
        buyerId: buyerUser.id,
        sellerId: sellerUser.id,
      });
      
      // Update transaction status and fraud flags if needed
      if (transaction.status !== 'pending') {
        await storage.updateTransactionStatus(createdTransaction.id, transaction.status);
      }
      
      // Note: fraudFlags would need to be stored separately as it's not in the base schema
      // For now, we'll just log it
      if (transaction.fraudRisk === 'high') {
        logger.info({ transactionId: createdTransaction.id }, 'Sandbox high-risk transaction created');
      }

      transactionIds.push(createdTransaction.id);
      logger.info({ transactionId: createdTransaction.id }, 'Created sandbox transaction');
    }

    return {
      users: userIds,
      transactions: transactionIds,
    };
  }

  /**
   * Cleanup sandbox data
   */
  async cleanupSandboxData(): Promise<number> {
    // In production, mark sandbox users/transactions and clean them up
    // For now, this is a placeholder
    logger.info('Sandbox cleanup requested');
    return 0;
  }

  /**
   * Reset sandbox environment
   */
  async resetSandbox(): Promise<void> {
    this.personas.clear();
    this.scenarios.clear();
    this.initializeDefaultPersonas();
    this.initializeDefaultScenarios();
    await this.cleanupSandboxData();
    logger.info('Sandbox environment reset');
  }
}

export const sandboxService = new SandboxService();

