
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  ExternalLink, 
  Github,
  ShoppingCart,
  CreditCard,
  Users,
  Building,
  Globe,
  Copy,
  CheckCircle,
  Download
} from "lucide-react";
import { useState } from "react";

export default function IntegrationExamples() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const examples = {
    ecommerce: `// E-commerce Transaction Flow
import { TrustVerify } from '@trustverify/sdk';

class EcommerceCheckout {
  constructor() {
    this.trustVerify = new TrustVerify({
      apiKey: process.env.TRUSTVERIFY_API_KEY,
      environment: 'production'
    });
  }

  async processOrder(orderData) {
    try {
      // Step 1: Create secure transaction
      const transaction = await this.trustVerify.transactions.create({
        title: \`Order #\${orderData.orderId}\`,
        description: orderData.items.map(item => item.name).join(', '),
        amount: orderData.total,
        currency: orderData.currency,
        buyerEmail: orderData.customer.email,
        sellerEmail: orderData.merchant.email,
        category: 'e_commerce',
        deliveryTimeframe: '7_days'
      });

      // Step 2: Run fraud detection
      const fraudCheck = await this.trustVerify.fraud.analyze({
        transactionId: transaction.id,
        userAgent: orderData.userAgent,
        ipAddress: orderData.ipAddress,
        deviceFingerprint: orderData.deviceId,
        behaviorData: {
          sessionDuration: orderData.sessionTime,
          clickPattern: 'normal',
          typingSpeed: 'average'
        }
      });

      if (fraudCheck.riskScore > 0.7) {
        return { status: 'review_required', transaction, fraudCheck };
      }

      // Step 3: Process payment into escrow
      const payment = await this.processPaymentToEscrow(transaction.id, orderData.paymentMethod);
      
      return { 
        status: 'success', 
        transaction, 
        payment,
        trackingUrl: \`/orders/\${transaction.id}/track\`
      };
    } catch (error) {
      console.error('Order processing failed:', error);
      throw error;
    }
  }

  async confirmDelivery(transactionId, deliveryProof) {
    return await this.trustVerify.transactions.complete({
      transactionId,
      deliveryProof,
      completedBy: 'buyer'
    });
  }
}`,
    marketplace: `// Freelance Marketplace Integration
import { TrustVerify } from '@trustverify/sdk';

class FreelanceMarketplace {
  constructor() {
    this.trustVerify = new TrustVerify({
      apiKey: process.env.TRUSTVERIFY_API_KEY,
      environment: 'production'
    });
  }

  async createProject(projectData) {
    // Step 1: Verify freelancer and client KYC status
    const [freelancerKyc, clientKyc] = await Promise.all([
      this.trustVerify.kyc.getStatus(projectData.freelancerId),
      this.trustVerify.kyc.getStatus(projectData.clientId)
    ]);

    if (freelancerKyc.level < 'basic' || clientKyc.level < 'basic') {
      return { status: 'kyc_required', freelancerKyc, clientKyc };
    }

    // Step 2: Create milestone-based transaction
    const transaction = await this.trustVerify.transactions.create({
      title: projectData.title,
      description: projectData.description,
      amount: projectData.totalAmount,
      currency: 'USD',
      buyerEmail: projectData.client.email,
      sellerEmail: projectData.freelancer.email,
      category: 'digital_services',
      deliveryTimeframe: projectData.estimatedDuration,
      milestones: projectData.milestones
    });

    return { status: 'created', transaction };
  }

  async submitMilestone(transactionId, milestoneId, deliverable) {
    // Freelancer submits work for milestone
    return await this.trustVerify.transactions.submitMilestone({
      transactionId,
      milestoneId,
      deliverable: {
        description: deliverable.description,
        files: deliverable.files,
        submittedAt: new Date().toISOString()
      }
    });
  }

  async approveMilestone(transactionId, milestoneId, feedback) {
    // Client approves milestone and releases payment
    return await this.trustVerify.transactions.approveMilestone({
      transactionId,
      milestoneId,
      feedback,
      releasePayment: true
    });
  }
}`,
    fintech: `// Fintech Application Integration
import { TrustVerify } from '@trustverify/sdk';

class FintechApplication {
  constructor() {
    this.trustVerify = new TrustVerify({
      apiKey: process.env.TRUSTVERIFY_API_KEY,
      environment: 'production'
    });
  }

  async processPayment(paymentData) {
    try {
      // Step 1: AML/KYC compliance check
      const complianceCheck = await this.trustVerify.compliance.verify({
        userId: paymentData.userId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        sourceOfFunds: paymentData.sourceOfFunds,
        beneficiaryInfo: paymentData.beneficiary
      });

      if (complianceCheck.status === 'requires_review') {
        return { status: 'compliance_review_required', complianceCheck };
      }

      // Step 2: Create secure transaction with regulatory compliance
      const transaction = await this.trustVerify.transactions.create({
        title: \`Payment to \${paymentData.beneficiary.name}\`,
        description: paymentData.description,
        amount: paymentData.amount,
        currency: paymentData.currency,
        buyerEmail: paymentData.sender.email,
        sellerEmail: paymentData.beneficiary.email,
        category: 'financial_services',
        deliveryTimeframe: 'instant',
        regulatoryData: {
          jurisdiction: paymentData.jurisdiction,
          transactionType: 'wire_transfer',
          reportingThreshold: paymentData.amount >= 10000
        }
      });

      // Step 3: Risk assessment for financial crime
      const riskAssessment = await this.trustVerify.risk.assess({
        transactionId: transaction.id,
        userRiskProfile: await this.getUserRiskProfile(paymentData.userId),
        transactionPattern: await this.analyzeTransactionPattern(paymentData.userId),
        geolocationData: paymentData.geolocation
      });

      if (riskAssessment.riskLevel === 'high') {
        // Enhanced due diligence required
        await this.initiateEnhancedDueDiligence(transaction.id);
        return { status: 'enhanced_due_diligence', transaction, riskAssessment };
      }

      // Step 4: Process payment with regulatory reporting
      const paymentResult = await this.processSecurePayment(transaction.id, paymentData);
      
      // Step 5: Generate regulatory reports if required
      if (paymentData.amount >= 10000) {
        await this.generateRegulatoryReport(transaction, paymentData);
      }

      return { 
        status: 'success', 
        transaction, 
        paymentResult,
        complianceStatus: 'approved'
      };
    } catch (error) {
      console.error('Payment processing failed:', error);
      await this.logComplianceEvent('payment_failure', error);
      throw error;
    }
  }

  async generateRegulatoryReport(transaction, paymentData) {
    return await this.trustVerify.compliance.generateReport({
      transactionId: transaction.id,
      reportType: 'suspicious_activity',
      regulatoryBody: 'FinCEN',
      metadata: {
        amount: paymentData.amount,
        crossBorder: paymentData.crossBorder,
        highRisk: paymentData.highRisk
      }
    });
  }
}`,
    enterprise: `// Enterprise B2B Integration
import { TrustVerify } from '@trustverify/sdk';

class EnterpriseB2BPlatform {
  constructor() {
    this.trustVerify = new TrustVerify({
      apiKey: process.env.TRUSTVERIFY_API_KEY,
      environment: 'production',
      webhookSecret: process.env.WEBHOOK_SECRET
    });
  }

  async processBulkTransactions(transactions) {
    const results = [];
    
    // Process transactions in batches for enterprise scale
    const batchSize = 100;
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(async (txnData) => {
          try {
            // Enterprise-level validation and processing
            const transaction = await this.createEnterpriseTransaction(txnData);
            return { status: 'success', transaction };
          } catch (error) {
            return { status: 'error', error: error.message, data: txnData };
          }
        })
      );
      
      results.push(...batchResults);
    }
    
    // Generate enterprise analytics report
    await this.generateEnterpriseReport(results);
    
    return results;
  }

  async createEnterpriseTransaction(txnData) {
    // Step 1: Enterprise KYB (Know Your Business) verification
    const kybVerification = await this.trustVerify.kyb.verify({
      businessId: txnData.businessId,
      businessName: txnData.businessName,
      registrationNumber: txnData.registrationNumber,
      jurisdiction: txnData.jurisdiction,
      beneficialOwners: txnData.beneficialOwners
    });

    if (kybVerification.status !== 'approved') {
      throw new Error(\`KYB verification failed: \${kybVerification.reason}\`);
    }

    // Step 2: Create enterprise transaction with custom workflow
    const transaction = await this.trustVerify.transactions.create({
      title: txnData.contractTitle,
      description: txnData.contractDescription,
      amount: txnData.contractValue,
      currency: txnData.currency,
      buyerEmail: txnData.buyer.email,
      sellerEmail: txnData.seller.email,
      category: 'enterprise_b2b',
      deliveryTimeframe: txnData.deliveryTimeframe,
      customWorkflow: {
        approvalLevels: txnData.approvalLevels,
        signatories: txnData.signatories,
        complianceChecks: txnData.complianceRequirements
      },
      metadata: {
        contractId: txnData.contractId,
        departmentCode: txnData.departmentCode,
        projectId: txnData.projectId,
        costCenter: txnData.costCenter
      }
    });

    // Step 3: Initiate enterprise approval workflow
    await this.initiateApprovalWorkflow(transaction.id, txnData.approvalChain);

    return transaction;
  }

  async initiateApprovalWorkflow(transactionId, approvalChain) {
    for (const approver of approvalChain) {
      await this.trustVerify.workflows.requestApproval({
        transactionId,
        approverId: approver.id,
        approverEmail: approver.email,
        approvalType: approver.type,
        requiredBy: approver.deadline,
        escalationRules: approver.escalation
      });
    }
  }

  async generateEnterpriseReport(results) {
    const analytics = {
      totalProcessed: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      totalValue: results
        .filter(r => r.status === 'success')
        .reduce((sum, r) => sum + r.transaction.amount, 0)
    };

    return await this.trustVerify.analytics.generateReport({
      reportType: 'enterprise_bulk_processing',
      timeframe: 'current_batch',
      metrics: analytics,
      exportFormat: 'excel',
      recipients: ['finance@company.com', 'compliance@company.com']
    });
  }
}`,
    webhook: `// Webhook Handler for Real-time Updates
import express from 'express';
import crypto from 'crypto';

const app = express();

// Webhook endpoint to receive TrustVerify events
app.post('/webhooks/trustverify', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-trustverify-signature'];
  const payload = req.body;
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.TRUSTVERIFY_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
    
  if (signature !== \`sha256=\${expectedSignature}\`) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = JSON.parse(payload);
  
  switch (event.type) {
    case 'transaction.created':
      handleTransactionCreated(event.data);
      break;
      
    case 'transaction.completed':
      handleTransactionCompleted(event.data);
      break;
      
    case 'kyc.approved':
      handleKycApproved(event.data);
      break;
      
    case 'fraud.high_risk_detected':
      handleHighRiskFraud(event.data);
      break;
      
    case 'dispute.created':
      handleDisputeCreated(event.data);
      break;
  }
  
  res.status(200).send('OK');
});

async function handleTransactionCreated(transaction) {
  // Send confirmation emails
  await sendEmail(transaction.buyerEmail, 'transaction-created', transaction);
  await sendEmail(transaction.sellerEmail, 'transaction-created', transaction);
  
  // Update internal database
  await db.transactions.create({
    trustverifyId: transaction.id,
    status: 'pending',
    amount: transaction.amount,
    buyerId: transaction.metadata.buyerId,
    sellerId: transaction.metadata.sellerId
  });
}

async function handleHighRiskFraud(fraudData) {
  // Immediately flag transaction for manual review
  await db.transactions.update(fraudData.transactionId, {
    status: 'under_review',
    riskScore: fraudData.riskScore,
    riskFactors: fraudData.riskFactors
  });
  
  // Notify compliance team
  await notifyComplianceTeam({
    transactionId: fraudData.transactionId,
    riskScore: fraudData.riskScore,
    priority: 'high'
  });
}`
  };

  const integrationScenarios = [
    {
      id: 'ecommerce',
      title: 'E-commerce Store',
      description: 'Secure online store transactions with fraud protection',
      icon: ShoppingCart,
      color: 'blue',
      features: ['Payment Processing', 'Fraud Detection', 'Order Tracking', 'Buyer Protection']
    },
    {
      id: 'marketplace',
      title: 'Freelance Platform',
      description: 'Milestone-based payments for service providers',
      icon: Users,
      color: 'green',
      features: ['KYC Verification', 'Milestone Payments', 'Dispute Resolution', 'Trust Scores']
    },
    {
      id: 'fintech',
      title: 'Fintech Application',
      description: 'Financial services with compliance and security',
      icon: CreditCard,
      color: 'purple',
      features: ['AML Compliance', 'Identity Verification', 'Risk Assessment', 'Regulatory Reporting']
    },
    {
      id: 'enterprise',
      title: 'Enterprise B2B',
      description: 'Large-scale business transaction management',
      icon: Building,
      color: 'orange',
      features: ['Bulk Processing', 'Custom Workflows', 'Advanced Analytics', 'White-label Solution']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-[1270px] mx-auto px-6 md:px-10 py-24">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="h-[30px] bg-[#003d2b1a] hover:bg-[#003d2b1a] rounded-[800px] px-4 mb-6 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm leading-[14px] tracking-[0]">
              INTEGRATION EXAMPLES
            </span>
          </Badge>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px] mb-4">
            Integration Examples
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg leading-[27px] max-w-3xl mx-auto">
            Real-world examples and implementation patterns for TrustVerify SDK
          </p>
        </div>

        {/* Quick Start Templates */}
        <section className="mb-16 bg-[#f4f4f4] py-16 px-6 rounded-[20px]">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[34px] sm:text-[40px] text-[#003d2b] mb-8 text-center">Quick Start Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrationScenarios.map((scenario) => {
              const IconComponent = scenario.icon;
              return (
                <Card key={scenario.id} className="bg-white border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] transition-shadow">
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-[#27ae60] flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">{scenario.title}</CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {scenario.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-[#0b3a78] text-[#0b3a78] hover:bg-[#0b3a780d] rounded-[10px] min-h-[44px]"
                      onClick={() => {
                        const targetId = scenario.id === 'marketplace' ? 'example-marketplace' :
                                       scenario.id === 'fintech' ? 'example-fintech' :
                                       scenario.id === 'enterprise' ? 'example-enterprise' :
                                       scenario.id === 'ecommerce' ? 'example-ecommerce' : null;
                        if (targetId) {
                          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">View Code</span>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Code Examples */}
        <section className="space-y-8">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[34px] sm:text-[40px] text-[#003d2b] mb-8">Implementation Examples</h2>
          
          {/* E-commerce Example */}
          <div id="example-ecommerce">
            <Card className="bg-white border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-2 text-[#0b3a78]" />
                  E-commerce Integration
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Complete checkout flow with fraud detection and escrow protection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#003d2b] rounded-lg p-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-[#0b3a781a] text-[#0b3a78] border-0 rounded-[800px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">E-commerce Checkout</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(examples.ecommerce, 'ecommerce')}
                      className="text-[#808080] hover:text-white"
                    >
                      {copiedCode === 'ecommerce' ? <CheckCircle className="h-4 w-4 text-app-secondary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="text-app-secondary font-mono text-sm overflow-x-auto max-h-96">{examples.ecommerce}</pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Marketplace Example */}
          <div id="example-marketplace">
            <Card className="bg-white border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] flex items-center">
                  <Users className="h-6 w-6 mr-2 text-app-secondary" />
                  Freelance Marketplace
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Milestone-based payments with KYC verification and dispute handling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#003d2b] rounded-lg p-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-[#1DBF731a] text-[#003d2b] border-0 rounded-[800px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Freelance Platform</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(examples.marketplace, 'marketplace')}
                      className="text-[#808080] hover:text-white"
                    >
                      {copiedCode === 'marketplace' ? <CheckCircle className="h-4 w-4 text-app-secondary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="text-app-secondary font-mono text-sm overflow-x-auto max-h-96">{examples.marketplace}</pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fintech Example */}
          <div id="example-fintech">
            <Card className="bg-white border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] flex items-center">
                  <CreditCard className="h-6 w-6 mr-2 text-[#0A3778]" />
                  Fintech Application
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Financial services with AML compliance and regulatory reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#003d2b] rounded-lg p-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-[#0A37781a] text-[#0b3a78] border-0 rounded-[800px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Fintech Platform</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(examples.fintech, 'fintech')}
                      className="text-[#808080] hover:text-white"
                    >
                      {copiedCode === 'fintech' ? <CheckCircle className="h-4 w-4 text-app-secondary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="text-app-secondary font-mono text-sm overflow-x-auto max-h-96">{examples.fintech}</pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enterprise B2B Example */}
          <div id="example-enterprise">
            <Card className="bg-white border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] flex items-center">
                  <Building className="h-6 w-6 mr-2 text-[#0b3a78]" />
                  Enterprise B2B
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Large-scale business transaction management with custom workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#003d2b] rounded-lg p-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-[#0b3a781a] text-[#0b3a78] border-0 rounded-[800px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Enterprise Platform</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(examples.enterprise, 'enterprise')}
                      className="text-[#808080] hover:text-white"
                    >
                      {copiedCode === 'enterprise' ? <CheckCircle className="h-4 w-4 text-app-secondary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="text-app-secondary font-mono text-sm overflow-x-auto max-h-96">{examples.enterprise}</pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Webhook Example */}
          <div id="example-webhook">
            <Card className="bg-white border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] flex items-center">
                  <Globe className="h-6 w-6 mr-2 text-[#0A3778]" />
                  Webhook Integration
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Real-time event handling and automated workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#003d2b] rounded-lg p-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-[#0A37781a] text-[#0b3a78] border-0 rounded-[800px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Webhook Handler</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(examples.webhook, 'webhook')}
                      className="text-[#808080] hover:text-white"
                    >
                      {copiedCode === 'webhook' ? <CheckCircle className="h-4 w-4 text-app-secondary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="text-app-secondary font-mono text-sm overflow-x-auto max-h-96">{examples.webhook}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sample Projects */}
        <section className="mt-16 bg-[#f4f4f4] py-16 px-6 rounded-[20px]">
          <Card className="bg-white border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardHeader>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] flex items-center">
                <Github className="h-6 w-6 mr-2" />
                Sample Projects & Repositories
              </CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                Complete starter projects and reference implementations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-[#e4e4e4] rounded-[18px] p-4 hover:bg-[#f4f4f4] transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <Github className="h-5 w-5 text-[#808080]" />
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Next.js E-commerce</h4>
                  </div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-3">Complete e-commerce store with TrustVerify integration</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-[#e4e4e4] text-[#003d2b] hover:bg-[#0b3a780d] rounded-[10px]" onClick={() => window.open('https://github.com/trustverify/nextjs-ecommerce-demo', '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">View Code</span>
                    </Button>
                    <Button size="sm" className="bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px]" onClick={() => window.open('https://demo-ecommerce.trustverify.com', '_blank')}>
                      <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">Live Demo</span>
                    </Button>
                  </div>
                </div>

                <div className="border border-[#e4e4e4] rounded-[18px] p-4 hover:bg-[#f4f4f4] transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <Github className="h-5 w-5 text-[#808080]" />
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">React Marketplace</h4>
                  </div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-3">Freelance marketplace with milestone payments</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-[#e4e4e4] text-[#003d2b] hover:bg-[#0b3a780d] rounded-[10px]" onClick={() => window.open('https://github.com/trustverify/react-marketplace-demo', '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">View Code</span>
                    </Button>
                    <Button size="sm" className="bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px]" onClick={() => window.open('https://demo-marketplace.trustverify.com', '_blank')}>
                      <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">Live Demo</span>
                    </Button>
                  </div>
                </div>

                <div className="border border-[#e4e4e4] rounded-[18px] p-4 hover:bg-[#f4f4f4] transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <Github className="h-5 w-5 text-[#808080]" />
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Python Flask API</h4>
                  </div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-3">Backend API integration with webhook handling</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-[#e4e4e4] text-[#003d2b] hover:bg-[#0b3a780d] rounded-[10px]" onClick={() => window.open('https://github.com/trustverify/python-flask-demo', '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">View Code</span>
                    </Button>
                    <Button size="sm" className="bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px]" onClick={() => window.open('/postman-collection', '_blank')}>
                      <Download className="h-4 w-4 mr-1" />
                      <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">Postman</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Support CTA */}
        <Card className="bg-[#f4f4f4] border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] mt-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Code className="h-8 w-8 text-[#0b3a78]" />
              <div className="flex-1">
                <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Need Custom Integration Help?</h3>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Our integration team can help you implement TrustVerify for your specific use case.</p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" className="border-[#0b3a78] text-[#0b3a78] hover:bg-[#0b3a780d] rounded-[10px] min-h-[44px]" onClick={() => window.open('/sdk-documentation', '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">SDK Docs</span>
                </Button>
                <Button className="bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px] min-h-[44px]" onClick={() => window.open('mailto:integrations@trustverify.com?subject=Custom Integration Request', '_blank')}>
                  <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">Contact Team</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
