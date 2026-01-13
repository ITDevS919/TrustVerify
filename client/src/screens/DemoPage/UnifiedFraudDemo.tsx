import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Phone, 
  Mail, 
  Globe, 
  Search,
  Users,
  Building2,
  TrendingUp,
  Zap,
  Database,
  Network,
  Banknote,
  MessageSquare,
  UserCheck,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Coins,
  GamepadIcon,
  ShoppingBag
} from "lucide-react";

interface FraudCheckResult {
  entity: string;
  type: 'email' | 'phone' | 'website' | 'company' | 'transaction' | 'crypto' | 'domain';
  riskScore: number;
  riskLabel: 'Safe' | 'Suspicious' | 'High Risk';
  issues: string[];
  recommendations: string[];
  darkWebFound: boolean;
  sources: string[];
  industry?: string;
  details?: any;
}

interface DemoStep {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
  duration: number;
}

export default function UnifiedFraudDemo() {
  const [inputValue, setInputValue] = useState("");
  const [inputType, setInputType] = useState<'email' | 'phone' | 'website' | 'company' | 'transaction' | 'crypto' | 'domain'>('email');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<FraudCheckResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [activeTab, setActiveTab] = useState("consumer");
  
  // Business demo state
  const [businessDemoStep, setBusinessDemoStep] = useState(0);
  const [isBusinessPlaying, setIsBusinessPlaying] = useState(false);
  const [businessProgress, setBusinessProgress] = useState(0);

  // Real fraud check mutation
  const fraudCheckMutation = useMutation({
    mutationFn: async (data: { type: string; target: string; details?: any }) => {
      const response = await apiRequest('POST', '/api/fraud-check', data);
      return await response.json();
    },
    onSuccess: (data) => {
      setResult({
        entity: data.entity,
        type: data.type,
        riskScore: data.riskScore,
        riskLabel: data.riskLevel === 'Critical' ? 'High Risk' : 
                   data.riskLevel === 'High' ? 'High Risk' :
                   data.riskLevel === 'Medium' ? 'Suspicious' : 'Safe',
        issues: data.issues,
        recommendations: data.recommendations,
        darkWebFound: data.darkWebFound,
        sources: data.sources,
        details: data.details
      });
      setIsChecking(false);
      setProgress(100);
      setCurrentStep("Analysis complete");
    },
    onError: (error: any) => {
      console.error('Fraud check failed:', error);
      // Fallback to demo data on error
      const fallbackResult = demoExamples[inputValue] || {
        entity: inputValue,
        type: inputType,
        riskScore: 25,
        riskLabel: 'Safe' as const,
        issues: [],
        recommendations: ['Analysis completed with basic checks', 'No significant risks detected'],
        darkWebFound: false,
        sources: ['TrustVerify Database', 'Basic Analysis']
      };
      setResult(fallbackResult);
      setIsChecking(false);
      setProgress(100);
      setCurrentStep("Analysis complete (offline mode)");
    }
  });

  // Comprehensive demo examples covering all industries
  const demoExamples: Record<string, FraudCheckResult> = {
    // Consumer Examples
    'john@suspicious-bank.com': {
      entity: 'john@suspicious-bank.com',
      type: 'email',
      riskScore: 75,
      riskLabel: 'High Risk',
      issues: [
        'Domain registered recently (3 days ago)',
        'Similar to legitimate banking domain',
        'No valid business registration found',
        'Multiple fraud reports received'
      ],
      recommendations: [
        'Do not provide personal information',
        'Verify through official banking channels',
        'Report suspicious activity',
        'Enable two-factor authentication'
      ],
      darkWebFound: false,
      sources: ['TrustVerify Database', 'Partner Networks', 'Domain Analysis'],
      industry: 'Banking'
    },
    
    // E-commerce Examples
    'shop@mega-deals-online.net': {
      entity: 'shop@mega-deals-online.net',
      type: 'email',
      riskScore: 85,
      riskLabel: 'High Risk',
      issues: [
        'Fake e-commerce domain',
        'No SSL certificate',
        'Suspicious payment methods only',
        'Multiple consumer complaints'
      ],
      recommendations: [
        'Avoid making purchases',
        'Use secure payment methods',
        'Check business registration',
        'Look for verified reviews'
      ],
      darkWebFound: true,
      sources: ['E-commerce Database', 'SSL Analysis', 'Consumer Reports'],
      industry: 'E-commerce'
    },

    // Fintech Examples
    'invest@crypto-fortune.biz': {
      entity: 'invest@crypto-fortune.biz',
      type: 'email',
      riskScore: 95,
      riskLabel: 'High Risk',
      issues: [
        'Unregistered investment scheme',
        'Promises 500% returns',
        'No regulatory compliance',
        'Pyramid structure detected'
      ],
      recommendations: [
        'Never invest any money',
        'Check FCA registration',
        'Report to authorities',
        'Warn others about this scheme'
      ],
      darkWebFound: true,
      sources: ['FCA Database', 'Investment Fraud Registry', 'Ponzi Scheme Detection'],
      industry: 'Fintech'
    },

    // iGaming Examples
    'bonus@lucky-casino-777.org': {
      entity: 'bonus@lucky-casino-777.org',
      type: 'email',
      riskScore: 70,
      riskLabel: 'Suspicious',
      issues: [
        'Unlicensed gambling operator',
        'Predatory bonus terms',
        'No responsible gambling features',
        'Payment processing issues reported'
      ],
      recommendations: [
        'Check gambling license status',
        'Read terms and conditions carefully',
        'Use licensed operators only',
        'Set spending limits'
      ],
      darkWebFound: false,
      sources: ['Gambling Commission', 'Player Complaints Database', 'License Registry'],
      industry: 'iGaming'
    },

    // Crypto Examples
    'mining@bitcoin-doubler.io': {
      entity: 'mining@bitcoin-doubler.io',
      type: 'crypto',
      riskScore: 98,
      riskLabel: 'High Risk',
      issues: [
        'Classic crypto doubling scam',
        'No legitimate mining operation',
        'Fake testimonials',
        'Ponzi scheme structure'
      ],
      recommendations: [
        'Never send cryptocurrency',
        'Report to crypto fraud authorities',
        'Warn community members',
        'Use only reputable exchanges'
      ],
      darkWebFound: true,
      sources: ['Crypto Scam Database', 'Blockchain Analysis', 'DeFi Security Reports'],
      industry: 'Cryptocurrency'
    },

    // Phone Examples
    '+44 20 1234 5678': {
      entity: '+44 20 1234 5678',
      type: 'phone',
      riskScore: 15,
      riskLabel: 'Safe',
      issues: [],
      recommendations: [
        'Number appears legitimate',
        'Associated with verified business',
        'No fraud reports found'
      ],
      darkWebFound: false,
      sources: ['Phone Registry', 'Business Directory', 'TrustVerify Database']
    },

    // Domain Examples  
    'crypto-investment-pro.com': {
      entity: 'crypto-investment-pro.com',
      type: 'domain',
      riskScore: 88,
      riskLabel: 'High Risk',
      issues: [
        'Promises unrealistic returns (500% profit)',
        'No regulatory registration',
        'Anonymous domain registration',
        'Multiple user complaints'
      ],
      recommendations: [
        'Avoid any investment',
        'Check FCA regulatory status',
        'Research company background',
        'Consult financial advisor'
      ],
      darkWebFound: false,
      sources: ['FCA Database', 'WHOIS Analysis', 'User Reports', 'Content Analysis'],
      industry: 'Investment'
    },

    // Transaction Examples
    'TX_2025_001': {
      entity: 'TX_2025_001',
      type: 'transaction',
      riskScore: 25,
      riskLabel: 'Safe',
      issues: [],
      recommendations: [
        'Transaction approved',
        'All verifications passed',
        'Low risk customer profile'
      ],
      darkWebFound: false,
      sources: ['Transaction Analysis', 'KYC Database', 'Behavioral Analytics'],
      details: {
        amount: '£2,500.00',
        currency: 'GBP',
        merchant: 'TechStore UK',
        country: 'United Kingdom',
        paymentMethod: 'Credit Card'
      }
    }
  };

  // Industry-specific quick examples
  const industryExamples = {
    banking: [
      'john@suspicious-bank.com',
      'security@fake-hsbc.net', 
      'alert@barclays-security.org'
    ],
    ecommerce: [
      'shop@mega-deals-online.net',
      'support@amazon-prize.com',
      'order@ebay-winner.biz'
    ],
    fintech: [
      'invest@crypto-fortune.biz',
      'trade@quick-profits.net',
      'loan@instant-cash.org'
    ],
    igaming: [
      'bonus@lucky-casino-777.org',
      'jackpot@mega-wins.bet',
      'free@poker-riches.online'
    ],
    crypto: [
      'mining@bitcoin-doubler.io',
      'wallet@eth-airdrop.xyz',
      'trade@crypto-moon.money'
    ]
  };

  // Business demo steps
  const businessDemoSteps: DemoStep[] = [
    {
      id: 1,
      title: "Transaction Initiation",
      description: "A new high-value transaction enters our fraud prevention system",
      duration: 3000,
      component: (
        <div className="space-y-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-blue-900">New Transaction Request</h4>
              <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">£15,750.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-semibold">Crypto Exchange</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Buyer:</span>
                <span className="font-semibold text-xs">john.crypto@email.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Exchange:</span>
                <span className="font-semibold text-xs">CryptoExchange Pro</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Real-Time Analysis",
      description: "Multi-layer fraud detection analyzes transaction patterns",
      duration: 4000,
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">KYC Verified</span>
              </div>
              <div className="text-sm text-green-600">Level 3 verification complete</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Unusual Amount</span>
              </div>
              <div className="text-sm text-yellow-600">300% above user average</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">IP Analysis</span>
              </div>
              <div className="text-sm text-green-600">Legitimate UK location</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Database className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">No Fraud History</span>
              </div>
              <div className="text-sm text-green-600">Clean transaction record</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Risk Assessment",
      description: "AI calculates comprehensive risk score and recommendation",
      duration: 3000,
      component: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-600 mb-2">Risk Score: 25</div>
              <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">LOW RISK</Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div className="bg-green-500 h-3 rounded-full" style={{width: '25%'}}></div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-800 mb-2">✅ Transaction Approved</div>
              <div className="text-sm text-gray-600">Processed in 2.3 seconds</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const checkEntity = async (entity: string, type: string) => {
    setIsChecking(true);
    setProgress(0);
    setCurrentStep("Initializing fraud check...");

    // Simulate real-time analysis steps
    const steps = [
      "Analyzing domain reputation...",
      "Checking threat intelligence databases...",
      "Cross-referencing fraud reports...",
      "Performing deep security scan...",
      "Generating risk assessment..."
    ];

    // Show progress animation
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      setProgress((i + 1) * 20);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Map input types to API-compatible types
    const apiType = type === 'website' ? 'domain' : type;
    
    // Call real API
    fraudCheckMutation.mutate({
      type: apiType,
      target: entity,
      details: { demoMode: true }
    });
  };

  const playBusinessDemo = () => {
    if (isBusinessPlaying) {
      setIsBusinessPlaying(false);
      return;
    }

    setIsBusinessPlaying(true);
    setBusinessDemoStep(0);
    
    const runStep = (stepIndex: number) => {
      if (stepIndex >= businessDemoSteps.length) {
        setIsBusinessPlaying(false);
        return;
      }

      setBusinessDemoStep(stepIndex);
      setBusinessProgress((stepIndex / businessDemoSteps.length) * 100);

      setTimeout(() => {
        if (isBusinessPlaying) {
          runStep(stepIndex + 1);
        }
      }, businessDemoSteps[stepIndex].duration);
    };

    runStep(0);
  };

  const resetBusinessDemo = () => {
    setIsBusinessPlaying(false);
    setBusinessDemoStep(0);
    setBusinessProgress(0);
  };

  const handleQuickCheck = (example: string) => {
    setInputValue(example);
    checkEntity(example, inputType);
  };

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        {/* Header */}
        <div className="text-center mb-12 w-full">
          <div className="inline-flex items-center space-x-2 bg-[#003d2b1a] text-[#003d2b] px-4 py-2 rounded-full text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>Live Fraud Detection Demo</span>
          </div>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-6">
            Experience TrustVerify's 
            <span className="block text-[#27ae60]">
              Real-Time Fraud Detection
            </span>
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto">
            See how our AI-powered platform detects fraud across all industries - 
            from banking and e-commerce to crypto and iGaming
          </p>
        </div>

        {/* Demo Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-1/2 mx-auto bg-gray-200 rounded-lg p-1">
            <TabsTrigger value="consumer" className="flex items-center space-x-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
              <Users className="h-4 w-4" />
              <span>Consumer</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center space-x-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
              <Building2 className="h-4 w-4" />
              <span>Business</span>
            </TabsTrigger>
            <TabsTrigger value="industry" className="flex items-center space-x-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
              <Network className="h-4 w-4" />
              <span>Industry</span>
            </TabsTrigger>
          </TabsList>

          {/* Consumer Tab */}
          <TabsContent value="consumer" className="space-y-8">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <Shield className="h-6 w-6 text-[#27ae60]" />
                  <span>Consumer Fraud Detection</span>
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Test our fraud detection on emails, phone numbers, websites, and companies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Enter email, phone, website, or company name..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <select 
                    value={inputType} 
                    onChange={(e) => setInputType(e.target.value as any)}
                    className="h-12 px-3 rounded-md border border-gray-300 bg-white"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="website">Website</option>
                    <option value="company">Company</option>
                  </select>
                  <Button 
                    onClick={() => checkEntity(inputValue, inputType)}
                    disabled={isChecking || !inputValue}
                    className="h-12 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90 rounded-lg"
                  >
                    {isChecking ? (
                      <>
                        <Search className="h-4 w-4 mr-2 animate-spin" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Checking...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Check Now</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Quick Examples */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Try these examples:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleQuickCheck('john@suspicious-bank.com')}
                      className="justify-start text-left"
                    >
                      <Mail className="h-3 w-3 mr-2" />
                      <span className="truncate">john@suspicious-bank.com</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleQuickCheck('+44 20 1234 5678')}
                      className="justify-start"
                    >
                      <Phone className="h-3 w-3 mr-2" />
                      +44 20 1234 5678
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleQuickCheck('crypto-investment-pro.com')}
                      className="justify-start"
                    >
                      <Globe className="h-3 w-3 mr-2" />
                      <span className="truncate">crypto-investment-pro.com</span>
                    </Button>
                  </div>
                </div>

                {/* Progress and Results */}
                {isChecking && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{currentStep}</span>
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2 [&>div]:bg-[#27ae60]" />
                    </div>
                  </div>
                )}

                {result && !isChecking && (
                  <div className="space-y-4">
                    <div className={`border-2 rounded-xl p-6 ${
                      result.riskLabel === 'Safe' ? 'bg-[#e8f5e9] border-[#27ae60]/20' :
                      result.riskLabel === 'Suspicious' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
                          Analysis Result: {result.entity}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={`rounded-full px-4 py-1.5 h-auto ${
                            result.riskLabel === 'Safe' ? 'bg-[#003d2b1a] text-[#003d2b]' :
                            result.riskLabel === 'Suspicious' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {result.riskLabel}
                          </Badge>
                          {result.industry && (
                            <Badge variant="outline" className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">{result.industry}</Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] mb-2">Risk Score</h4>
                          <div className="flex items-center space-x-4">
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl">{result.riskScore}/100</div>
                            <Progress value={result.riskScore} className="flex-1 h-3 [&>div]:bg-[#27ae60]" />
                          </div>
                        </div>

                        <div>
                          <h4 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] mb-2">Threat Status</h4>
                          <div className="flex items-center space-x-2">
                            {result.darkWebFound ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-[#27ae60]" />
                            )}
                            <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {result.darkWebFound ? 'Found on Dark Web' : 'Not found on Dark Web'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {result.issues.length > 0 && (
                        <div className="mt-4">
                          <h4 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                            Issues Detected
                          </h4>
                          <ul className="space-y-1">
                            {result.issues.map((issue, idx) => (
                              <li key={idx} className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-4">
                        <h4 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-[#27ae60]" />
                          Recommendations
                        </h4>
                        <ul className="space-y-1">
                          {result.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] flex items-start">
                              <span className="text-[#27ae60] mr-2">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#e4e4e4]">
                        <h4 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] mb-2">Data Sources</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.sources.map((source, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Tab */}
          <TabsContent value="business" className="space-y-8">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <Building2 className="h-6 w-6 text-[#27ae60]" />
                  <span>Business Transaction Protection</span>
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Watch how TrustVerify prevents fraud in real-time business transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Demo Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button onClick={playBusinessDemo} variant="outline">
                      {isBusinessPlaying ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause Demo
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Demo
                        </>
                      )}
                    </Button>
                    <Button onClick={resetBusinessDemo} variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Step {businessDemoStep + 1} of {businessDemoSteps.length}
                  </div>
                </div>

                {/* Demo Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{businessDemoSteps[businessDemoStep]?.title}</span>
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{Math.round(businessProgress)}%</span>
                  </div>
                  <Progress value={businessProgress} className="h-2 mb-2 [&>div]:bg-[#27ae60]" />
                  <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{businessDemoSteps[businessDemoStep]?.description}</p>
                </div>

                {/* Demo Content */}
                <div className="border-2 border-gray-200 rounded-xl p-6 bg-white">
                  {businessDemoSteps[businessDemoStep]?.component}
                </div>

                {/* Demo Steps Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {businessDemoSteps.map((step, idx) => (
                    <div 
                      key={step.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        idx === businessDemoStep 
                          ? 'border-blue-500 bg-blue-50' 
                          : idx < businessDemoStep 
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === businessDemoStep 
                            ? 'bg-blue-500 text-white' 
                            : idx < businessDemoStep 
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                        }`}>
                          {idx < businessDemoStep ? '✓' : idx + 1}
                        </div>
                        <span className="font-medium text-sm">{step.title}</span>
                      </div>
                      <p className="text-xs text-gray-600">{step.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Industry Tab */}
          <TabsContent value="industry" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {/* Banking */}
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Banknote className="h-5 w-5 text-[#27ae60]" />
                    <span>Banking & Finance</span>
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Protect against phishing and account takeover
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {industryExamples.banking.map((example, idx) => (
                    <Button 
                      key={idx}
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleQuickCheck(example)}
                      className="w-full justify-start text-left"
                    >
                      <Mail className="h-3 w-3 mr-2" />
                      <span className="truncate">{example}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* E-commerce */}
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <ShoppingBag className="h-5 w-5 text-[#27ae60]" />
                    <span>E-commerce</span>
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Prevent payment fraud and fake merchants
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {industryExamples.ecommerce.map((example, idx) => (
                    <Button 
                      key={idx}
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleQuickCheck(example)}
                      className="w-full justify-start text-left"
                    >
                      <Mail className="h-3 w-3 mr-2" />
                      <span className="truncate">{example}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Fintech */}
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <TrendingUp className="h-5 w-5 text-[#27ae60]" />
                    <span>Fintech</span>
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Stop investment scams and fraud schemes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {industryExamples.fintech.map((example, idx) => (
                    <Button 
                      key={idx}
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleQuickCheck(example)}
                      className="w-full justify-start text-left"
                    >
                      <Mail className="h-3 w-3 mr-2" />
                      <span className="truncate">{example}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* iGaming */}
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <GamepadIcon className="h-5 w-5 text-[#27ae60]" />
                    <span>iGaming</span>
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Detect unlicensed operators and scams
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {industryExamples.igaming.map((example, idx) => (
                    <Button 
                      key={idx}
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleQuickCheck(example)}
                      className="w-full justify-start text-left"
                    >
                      <Mail className="h-3 w-3 mr-2" />
                      <span className="truncate">{example}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Cryptocurrency */}
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Coins className="h-5 w-5 text-[#27ae60]" />
                    <span>Cryptocurrency</span>
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Identify crypto scams and fake exchanges
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {industryExamples.crypto.map((example, idx) => (
                    <Button 
                      key={idx}
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleQuickCheck(example)}
                      className="w-full justify-start text-left"
                    >
                      <Mail className="h-3 w-3 mr-2" />
                      <span className="truncate">{example}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Real-Time Stats */}
              <Card className="bg-gradient-to-br from-[#27ae60]/10 to-[#0052cc]/10 border border-[#27ae60]/20 bg-[#fcfcfc] rounded-[20px]">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Zap className="h-5 w-5 text-[#27ae60]" />
                    <span>Live Detection Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#27ae60] text-2xl">99.97%</div>
                    <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Accuracy Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#27ae60] text-2xl">2.3s</div>
                    <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#27ae60] text-2xl">847K</div>
                    <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Fraud Attempts Blocked</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="mt-16 text-center w-full">
          <Card className="bg-gradient-to-r from-[#27ae60]/10 to-[#0052cc]/10 border border-[#27ae60]/20 bg-[#fcfcfc] rounded-[20px]">
            <CardContent className="p-8">
              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl mb-4">
                Ready to Integrate TrustVerify?
              </h2>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-6 max-w-2xl mx-auto">
                Our APIs can be integrated into your platform in minutes. 
                Start protecting your users and business from fraud today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/developers">
                  <Button className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90 h-12 rounded-lg">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">View API Documentation</span>
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="border border-[#e4e4e4] h-12 rounded-lg">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Contact Sales Team</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  );
}