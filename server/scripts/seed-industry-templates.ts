/**
 * Seed Industry Templates
 * Populates the database with pre-built industry templates
 */

import { storage } from '../storage';

const industryTemplates = [
  // E-commerce Templates
  {
    name: 'E-commerce Checkout Flow',
    industry: 'ecommerce',
    useCase: 'checkout',
    description: 'Standard checkout flow with fraud detection and optional KYC verification',
    workflowSteps: [
      {
        id: 'fraud_check',
        name: 'Fraud Detection',
        type: 'fraud_check',
        order: 1,
        config: {
          riskThreshold: 50,
          enableML: true,
          checkDeviceFingerprint: true,
        },
      },
      {
        id: 'kyc_verification',
        name: 'KYC Verification',
        type: 'kyc',
        order: 2,
        conditions: {
          if: 'amount > 10000',
          then: 'execute',
          else: 'skip',
        },
        config: {
          verificationLevel: 'basic',
          requiredDocuments: ['id'],
        },
      },
      {
        id: 'payment_processing',
        name: 'Payment Processing',
        type: 'payment',
        order: 3,
        config: {
          provider: 'stripe',
          autoCapture: false,
        },
      },
    ],
    defaultRules: {
      minTrustScore: 60,
      maxTransactionAmount: 50000,
      requireKYC: false,
      kycThreshold: 10000,
    },
    recommendedSettings: {
      fraudCheckEnabled: true,
      kycEnabled: true,
      escrowEnabled: false,
    },
    documentation: `# E-commerce Checkout Flow

This template provides a standard checkout flow for e-commerce platforms.

## Workflow Steps

1. **Fraud Detection**: Analyzes transaction for fraud indicators
2. **KYC Verification**: Optional verification for high-value transactions
3. **Payment Processing**: Processes payment through Stripe

## Configuration

- Fraud check is always enabled
- KYC is required for transactions over $10,000
- Payment is held until order confirmation`,
    codeExamples: [
      {
        language: 'nodejs',
        code: `const transaction = await client.transactions.create({
  amount: 1000.00,
  currency: 'USD',
  workflow: 'ecommerce_checkout',
  metadata: {
    orderId: 'ORD-12345',
    customerId: 'CUST-67890'
  }
});`,
        description: 'Create transaction with e-commerce checkout workflow',
      },
      {
        language: 'python',
        code: `transaction = client.transactions.create(
    amount=1000.00,
    currency='USD',
    workflow='ecommerce_checkout',
    metadata={
        'orderId': 'ORD-12345',
        'customerId': 'CUST-67890'
    }
)`,
        description: 'Create transaction with e-commerce checkout workflow',
      },
    ],
  },
  {
    name: 'E-commerce Dispute Resolution',
    industry: 'ecommerce',
    useCase: 'dispute_resolution',
    description: 'Automated dispute resolution flow for e-commerce transactions',
    workflowSteps: [
      {
        id: 'dispute_creation',
        name: 'Dispute Creation',
        type: 'dispute',
        order: 1,
        config: {
          autoFreezeEscrow: true,
          disputeWindowHours: 72,
        },
      },
      {
        id: 'evidence_collection',
        name: 'Evidence Collection',
        type: 'custom',
        order: 2,
        config: {
          collectionDeadline: 24,
          requireBuyerEvidence: true,
          requireSellerEvidence: true,
        },
      },
      {
        id: 'ai_arbitration',
        name: 'AI Arbitration',
        type: 'dispute',
        order: 3,
        config: {
          enableAI: true,
          confidenceThreshold: 0.7,
        },
      },
      {
        id: 'resolution',
        name: 'Resolution & Refund',
        type: 'payment',
        order: 4,
        config: {
          autoRelease: true,
        },
      },
    ],
    defaultRules: {
      disputeWindowHours: 72,
      evidenceCollectionHours: 24,
      aiAnalysisHours: 48,
      autoResolve: true,
    },
    recommendedSettings: {
      enableAIArbitration: true,
      requireEvidence: true,
      autoFreezeEscrow: true,
    },
    documentation: `# E-commerce Dispute Resolution

Automated 72-hour dispute resolution workflow.

## Workflow Steps

1. **Dispute Creation**: Freezes escrow and starts 72-hour timer
2. **Evidence Collection**: Collects evidence from both parties (24 hours)
3. **AI Arbitration**: AI analyzes evidence and makes ruling (48 hours)
4. **Resolution**: Automatically releases funds based on AI decision

## Timeline

- 0-24 hours: Evidence collection
- 24-48 hours: AI analysis
- 48-72 hours: Final ruling and fund release`,
    codeExamples: [
      {
        language: 'nodejs',
        code: `const dispute = await client.disputes.create({
  transactionId: 'txn_123',
  reason: 'item_not_received',
  description: 'Item was not delivered',
  workflow: 'ecommerce_dispute'
});`,
        description: 'Create dispute with automated resolution workflow',
      },
    ],
  },
  // Fintech Templates
  {
    name: 'Fintech Account Opening',
    industry: 'fintech',
    useCase: 'account_opening',
    description: 'Complete KYC/AML flow for fintech account opening',
    workflowSteps: [
      {
        id: 'identity_verification',
        name: 'Identity Verification',
        type: 'kyc',
        order: 1,
        config: {
          verificationLevel: 'full',
          biometricCheck: true,
          livenessCheck: true,
        },
      },
      {
        id: 'document_verification',
        name: 'Document Verification',
        type: 'kyc',
        order: 2,
        config: {
          requiredDocuments: ['passport', 'proof_of_address', 'source_of_funds'],
          autoVerify: false,
        },
      },
      {
        id: 'aml_screening',
        name: 'AML Screening',
        type: 'fraud_check',
        order: 3,
        config: {
          enableAML: true,
          checkSanctions: true,
          checkPEP: true,
        },
      },
      {
        id: 'risk_assessment',
        name: 'Risk Assessment',
        type: 'fraud_check',
        order: 4,
        config: {
          riskThreshold: 30,
          enableML: true,
        },
      },
    ],
    defaultRules: {
      minTrustScore: 80,
      requireFullKYC: true,
      enableAML: true,
      complianceCheck: true,
    },
    recommendedSettings: {
      strictVerification: true,
      manualReviewRequired: true,
      enableBiometric: true,
    },
    documentation: `# Fintech Account Opening

Comprehensive KYC/AML workflow for financial services.

## Workflow Steps

1. **Identity Verification**: Full identity check with biometric verification
2. **Document Verification**: Verifies government-issued documents
3. **AML Screening**: Checks against sanctions and PEP lists
4. **Risk Assessment**: Calculates risk score using ML models

## Compliance

- Meets KYC/AML regulatory requirements
- Supports multiple jurisdictions
- Audit trail for all verifications`,
    codeExamples: [
      {
        language: 'nodejs',
        code: `const verification = await client.kyc.verify({
  userId: 'user_123',
  workflow: 'fintech_account_opening',
  documents: {
    passport: 'file_id_1',
    proofOfAddress: 'file_id_2',
    sourceOfFunds: 'file_id_3'
  }
});`,
        description: 'Start KYC verification with fintech account opening workflow',
      },
    ],
  },
  // Marketplace Templates
  {
    name: 'Marketplace Escrow Transaction',
    industry: 'marketplace',
    useCase: 'escrow',
    description: 'Buyer-seller escrow flow for marketplace platforms',
    workflowSteps: [
      {
        id: 'transaction_initiation',
        name: 'Transaction Initiation',
        type: 'escrow',
        order: 1,
        config: {
          autoHold: true,
          holdDuration: 72,
        },
      },
      {
        id: 'delivery_confirmation',
        name: 'Delivery Confirmation',
        type: 'custom',
        order: 2,
        config: {
          requireConfirmation: true,
          confirmationDeadline: 48,
        },
      },
      {
        id: 'fund_release',
        name: 'Fund Release',
        type: 'payment',
        order: 3,
        config: {
          autoRelease: true,
          releaseAfterHours: 72,
        },
      },
    ],
    defaultRules: {
      escrowHoldHours: 72,
      requireConfirmation: true,
      autoRelease: true,
      disputeWindow: 72,
    },
    recommendedSettings: {
      enableEscrow: true,
      requireDeliveryConfirmation: true,
      enableDisputeResolution: true,
    },
    documentation: `# Marketplace Escrow Transaction

Secure escrow flow for buyer-seller transactions.

## Workflow Steps

1. **Transaction Initiation**: Holds funds in escrow
2. **Delivery Confirmation**: Buyer confirms receipt
3. **Fund Release**: Automatically releases funds after confirmation

## Features

- 72-hour escrow hold
- Automatic fund release
- Dispute resolution support`,
    codeExamples: [
      {
        language: 'nodejs',
        code: `const transaction = await client.transactions.create({
  amount: 500.00,
  currency: 'USD',
  buyerId: 'buyer_123',
  sellerId: 'seller_456',
  workflow: 'marketplace_escrow',
  escrow: true
});`,
        description: 'Create escrow transaction for marketplace',
      },
    ],
  },
  // Cryptocurrency Templates
  {
    name: 'Crypto Exchange KYC',
    industry: 'crypto',
    useCase: 'kyc',
    description: 'KYC verification for cryptocurrency exchanges',
    workflowSteps: [
      {
        id: 'identity_verification',
        name: 'Identity Verification',
        type: 'kyc',
        order: 1,
        config: {
          verificationLevel: 'full',
          biometricCheck: true,
        },
      },
      {
        id: 'source_of_funds',
        name: 'Source of Funds Verification',
        type: 'kyc',
        order: 2,
        config: {
          requireSourceOfFunds: true,
          documentTypes: ['bank_statement', 'tax_return'],
        },
      },
      {
        id: 'aml_screening',
        name: 'AML Screening',
        type: 'fraud_check',
        order: 3,
        config: {
          enableAML: true,
          checkSanctions: true,
          checkPEP: true,
          checkAdverseMedia: true,
        },
      },
    ],
    defaultRules: {
      minTrustScore: 85,
      requireFullKYC: true,
      enableAML: true,
      strictCompliance: true,
    },
    recommendedSettings: {
      enableBiometric: true,
      requireSourceOfFunds: true,
      enableAML: true,
    },
    documentation: `# Crypto Exchange KYC

Comprehensive KYC/AML for cryptocurrency exchanges.

## Workflow Steps

1. **Identity Verification**: Full identity check with biometric
2. **Source of Funds**: Verifies legitimate source of funds
3. **AML Screening**: Comprehensive AML and sanctions screening

## Compliance

- Meets FATF recommendations
- Supports multiple jurisdictions
- Real-time sanctions screening`,
    codeExamples: [
      {
        language: 'nodejs',
        code: `const verification = await client.kyc.verify({
  userId: 'user_123',
  workflow: 'crypto_exchange_kyc',
  documents: {
    passport: 'file_id_1',
    sourceOfFunds: 'file_id_2'
  }
});`,
        description: 'Start KYC verification for crypto exchange',
      },
    ],
  },
];

export async function seedIndustryTemplates() {
  console.log('Seeding industry templates...');
  
  for (const template of industryTemplates) {
    try {
      const existing = await storage.listIndustryTemplates({
        industry: template.industry,
        useCase: template.useCase,
      });
      
      const exists = existing.some(t => t.name === template.name);
      
      if (!exists) {
        await storage.createIndustryTemplate(template);
        console.log(`✓ Created template: ${template.name}`);
      } else {
        console.log(`- Template already exists: ${template.name}`);
      }
    } catch (error) {
      console.error(`✗ Error creating template ${template.name}:`, error);
    }
  }
  
  console.log('Industry templates seeding completed!');
}

// Run if executed directly
seedIndustryTemplates()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding templates:', error);
    process.exit(1);
  });

