import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Download, 
  ExternalLink, 
  Book, 
  Terminal, 
  Zap,
  Shield,
  Globe,
  Copy,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

export default function SdkDocumentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    installation: `npm install @trustverify/sdk`,
    initialization: `import { TrustVerify } from '@trustverify/sdk';

const trustVerify = new TrustVerify({
  apiKey: 'your_api_key_here',
  environment: 'production' // or 'sandbox'
});`,
    createTransaction: `const transaction = await trustVerify.transactions.create({
  title: 'Website Development Project',
  description: 'Custom e-commerce website development',
  amount: 2500.00,
  currency: 'USD',
  buyerEmail: 'buyer@example.com',
  sellerEmail: 'seller@example.com',
  category: 'digital_services',
  deliveryTimeframe: '7_days'
});

console.log('Transaction created:', transaction.id);`,
    verifyIdentity: `const verification = await trustVerify.kyc.submitVerification({
  userId: 'user_123',
  documentType: 'passport',
  documentNumber: 'P123456789',
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    address: {
      street: '123 Main St',
      city: 'New York',
      country: 'US',
      postalCode: '10001'
    }
  },
  documents: {
    frontId: 'base64_encoded_image',
    backId: 'base64_encoded_image',
    selfie: 'base64_encoded_image'
  }
});`,
    fraudCheck: `const fraudResult = await trustVerify.fraud.analyze({
  transactionId: 'txn_123',
  userAgent: req.headers['user-agent'],
  ipAddress: req.ip,
  deviceFingerprint: 'device_fingerprint_hash',
  behaviorData: {
    sessionDuration: 120,
    clickPattern: 'normal',
    typingSpeed: 'average'
  }
});

if (fraudResult.riskScore > 0.8) {
  // High risk - requires additional verification
  console.log('High risk transaction detected');
}`
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-[#003d2b0d] blur-3xl" />
          <div className="absolute right-[-120px] top-6 h-80 w-80 rounded-full bg-[#0b3a7815] blur-3xl" />
        </div>
        <div className="relative max-w-[1270px] mx-auto text-center">
          <Badge className="h-[30px] bg-[#003d2b1a] text-[#003d2b] rounded-[800px] px-4 mb-6 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm leading-[14px] tracking-[0]">
              SDK DOCUMENTATION
            </span>
          </Badge>
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-[#0A3778] to-[#1DBF73] rounded-2xl text-white">
              <Code className="w-12 h-12" />
            </div>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px]">
              SDK Documentation
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xl text-[#808080] leading-[27px]">
              Complete guide to integrating TrustVerify SDK into your applications
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1270px] mx-auto px-6 md:px-10 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)] sticky top-8">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-lg text-[#003d2b]">Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b] hover:bg-[#f7f7f7]" onClick={() => document.getElementById('getting-started')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Zap className="h-4 w-4 mr-2 text-app-secondary" />
                  Getting Started
                </Button>
                <Button variant="ghost" className="w-full justify-start [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b] hover:bg-[#f7f7f7]" onClick={() => document.getElementById('installation')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Download className="h-4 w-4 mr-2 text-app-secondary" />
                  Installation
                </Button>
                <Button variant="ghost" className="w-full justify-start [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b] hover:bg-[#f7f7f7]" onClick={() => document.getElementById('transactions')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Globe className="h-4 w-4 mr-2 text-app-secondary" />
                  Transactions
                </Button>
                <Button variant="ghost" className="w-full justify-start [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b] hover:bg-[#f7f7f7]" onClick={() => document.getElementById('kyc')?.scrollIntoView({ behavior: 'smooth' })}>
                  <CheckCircle className="h-4 w-4 mr-2 text-app-secondary" />
                  KYC Verification
                </Button>
                <Button variant="ghost" className="w-full justify-start [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b] hover:bg-[#f7f7f7]" onClick={() => document.getElementById('fraud-detection')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Shield className="h-4 w-4 mr-2 text-app-secondary" />
                  Fraud Detection
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Getting Started */}
            <section id="getting-started">
              <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <CardHeader>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl text-[#003d2b] flex items-center">
                    <Zap className="h-6 w-6 mr-2 text-app-secondary" />
                    Getting Started
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]">
                    Start building secure transactions with TrustVerify SDK in minutes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-[#f7f7f7] border border-[#e4e4e4] rounded-[10px] p-4">
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">Prerequisites</h4>
                    <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080] space-y-1">
                      <li>• Node.js 16+ or Python 3.8+</li>
                      <li>• TrustVerify API key (get from Developer Portal)</li>
                      <li>• Basic understanding of REST APIs</li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#f7f7f7] rounded-[10px] p-4 text-center border border-[#e4e4e4]">
                      <Terminal className="h-8 w-8 text-app-secondary mx-auto mb-2" />
                      <h4 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Install SDK</h4>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080]">npm or pip install</p>
                    </div>
                    <div className="bg-[#f7f7f7] rounded-[10px] p-4 text-center border border-[#e4e4e4]">
                      <Code className="h-8 w-8 text-app-secondary mx-auto mb-2" />
                      <h4 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Initialize</h4>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080]">Configure with API key</p>
                    </div>
                    <div className="bg-[#f7f7f7] rounded-[10px] p-4 text-center border border-[#e4e4e4]">
                      <CheckCircle className="h-8 w-8 text-app-secondary mx-auto mb-2" />
                      <h4 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Start Building</h4>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080]">Create your first transaction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Installation */}
            <section id="installation">
              <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <CardHeader>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl text-[#003d2b] flex items-center">
                    <Download className="h-6 w-6 mr-2 text-app-secondary" />
                    Installation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="nodejs" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-[#f7f7f7] rounded-[10px] p-1">
                      <TabsTrigger value="nodejs" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm data-[state=active]:bg-white data-[state=active]:text-[#003d2b] rounded-[8px]">Node.js</TabsTrigger>
                      <TabsTrigger value="python" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm data-[state=active]:bg-white data-[state=active]:text-[#003d2b] rounded-[8px]">Python</TabsTrigger>
                      <TabsTrigger value="php" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm data-[state=active]:bg-white data-[state=active]:text-[#003d2b] rounded-[8px]">PHP</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="nodejs" className="space-y-4">
                      <div className="bg-[#121728] rounded-[10px] p-4 relative">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-app-secondary/20 text-app-secondary border-0 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">npm</Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(codeExamples.installation, 'install-npm')}
                            className="text-gray-400 hover:text-white"
                          >
                            {copiedCode === 'install-npm' ? <CheckCircle className="h-4 w-4 text-app-secondary" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <code className="text-app-secondary font-mono text-sm">{codeExamples.installation}</code>
                      </div>
                      <div className="bg-[#121728] rounded-[10px] p-4 relative">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-app-secondary/20 text-app-secondary border-0 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Initialize</Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(codeExamples.initialization, 'init-js')}
                            className="text-gray-400 hover:text-white"
                          >
                            {copiedCode === 'init-js' ? <CheckCircle className="h-4 w-4 text-app-secondary" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <pre className="text-white font-mono text-sm overflow-x-auto">{codeExamples.initialization}</pre>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="python" className="space-y-4">
                      <div className="bg-[#121728] rounded-[10px] p-4">
                        <Badge className="bg-app-secondary/20 text-app-secondary border-0 mb-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">pip</Badge>
                        <code className="text-app-secondary font-mono text-sm block">pip install trustverify-python</code>
                      </div>
                      <div className="bg-[#121728] rounded-[10px] p-4">
                        <Badge className="bg-app-secondary/20 text-app-secondary border-0 mb-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Initialize</Badge>
                        <pre className="text-white font-mono text-sm">{`from trustverify import TrustVerify

client = TrustVerify(
    api_key='your_api_key_here',
    environment='production'
)`}</pre>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="php" className="space-y-4">
                      <div className="bg-[#121728] rounded-[10px] p-4">
                        <Badge className="bg-app-secondary/20 text-app-secondary border-0 mb-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">composer</Badge>
                        <code className="text-app-secondary font-mono text-sm block">composer require trustverify/php-sdk</code>
                      </div>
                      <div className="bg-[#121728] rounded-[10px] p-4">
                        <Badge className="bg-app-secondary/20 text-app-secondary border-0 mb-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Initialize</Badge>
                        <pre className="text-white font-mono text-sm">{`<?php
require_once 'vendor/autoload.php';

use TrustVerify\\Client;

$trustVerify = new Client([
    'api_key' => 'your_api_key_here',
    'environment' => 'production'
]);`}</pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* Transactions */}
            <section id="transactions">
              <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <CardHeader>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl text-[#003d2b] flex items-center">
                    <Globe className="h-6 w-6 mr-2 text-app-secondary" />
                    Transaction Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-[#121728] rounded-[10px] p-4 relative">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-app-secondary/20 text-app-secondary border-0 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Create Transaction</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(codeExamples.createTransaction, 'create-txn')}
                        className="text-gray-400 hover:text-white"
                      >
                        {copiedCode === 'create-txn' ? <CheckCircle className="h-4 w-4 text-app-secondary" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <pre className="text-white font-mono text-sm overflow-x-auto">{codeExamples.createTransaction}</pre>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* KYC Verification */}
            <section id="kyc">
              <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <CardHeader>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl text-[#003d2b] flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2 text-app-secondary" />
                    KYC Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-[#121728] rounded-[10px] p-4 relative">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-app-secondary/20 text-app-secondary border-0 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Submit Verification</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(codeExamples.verifyIdentity, 'verify-kyc')}
                        className="text-gray-400 hover:text-white"
                      >
                        {copiedCode === 'verify-kyc' ? <CheckCircle className="h-4 w-4 text-app-secondary" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <pre className="text-white font-mono text-sm overflow-x-auto">{codeExamples.verifyIdentity}</pre>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Fraud Detection */}
            <section id="fraud-detection">
              <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <CardHeader>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl text-[#003d2b] flex items-center">
                    <Shield className="h-6 w-6 mr-2 text-app-secondary" />
                    Fraud Detection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-[#121728] rounded-[10px] p-4 relative">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-app-secondary/20 text-app-secondary border-0 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Analyze Risk</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(codeExamples.fraudCheck, 'fraud-check')}
                        className="text-gray-400 hover:text-white"
                      >
                        {copiedCode === 'fraud-check' ? <CheckCircle className="h-4 w-4 text-app-secondary" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <pre className="text-white font-mono text-sm overflow-x-auto">{codeExamples.fraudCheck}</pre>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Support */}
            <Card className="bg-[#f7f7f7] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="p-3 bg-[#27AE6d] rounded-lg">
                    <Book className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-lg text-[#003d2b] mb-2">Need Help?</h3>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]">Check out our API reference or contact our developer support team.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <Button variant="outline" className="border-[#0b3a78] text-[#0b3a78] hover:bg-[#0b3a780d] rounded-[10px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium" onClick={() => window.open('/developers/api', '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      API Reference
                    </Button>
                    <Button className="bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px] [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold" onClick={() => window.open('mailto:support@trustverify.com?subject=SDK Support Request', '_blank')}>
                      Contact Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
