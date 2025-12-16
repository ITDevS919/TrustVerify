import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  Search,
  CreditCard,
  Lock,
  Smartphone,
  Users
} from "lucide-react";

interface FraudCheckResult {
  entity: string;
  type: 'email' | 'phone' | 'website' | 'company';
  riskScore: number;
  riskLabel: 'Safe' | 'Suspicious' | 'High Risk';
  issues: string[];
  recommendations: string[];
  darkWebFound: boolean;
  sources: string[];
}

export default function DemoPage() {
  const [inputValue, setInputValue] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<FraudCheckResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  // Demo fraud examples with realistic scenarios
  const demoExamples: Record<string, FraudCheckResult> = {
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
      sources: ['TrustVerify Database', 'Partner Networks', 'Domain Analysis']
    },
    'support@paypal-security.net': {
      entity: 'support@paypal-security.net',
      type: 'email',
      riskScore: 95,
      riskLabel: 'High Risk',
      issues: [
        'Impersonating PayPal official domain',
        'Known phishing domain',
        'SSL certificate mismatch',
        'Reported in multiple scam databases'
      ],
      recommendations: [
        'Block this sender immediately',
        'Never click links from this email',
        'Report to PayPal security team',
        'Check your PayPal account directly'
      ],
      darkWebFound: true,
      sources: ['PhishTank', 'TrustVerify Database', 'SSL Analysis', 'Dark Web Monitoring']
    },
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
    'crypto-investment-pro.com': {
      entity: 'crypto-investment-pro.com',
      type: 'website',
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
      sources: ['FCA Database', 'WHOIS Analysis', 'User Reports', 'Content Analysis']
    }
  };

  const detectInputType = (value: string): 'email' | 'phone' | 'website' | 'company' => {
    if (value.includes('@')) return 'email';
    if (value.match(/^\+?[\d\s\-\(\)]+$/)) return 'phone';
    if (value.includes('.') && !value.includes('@')) return 'website';
    return 'company';
  };

  const simulateCheck = async (input: string) => {
    setIsChecking(true);
    setProgress(0);
    setCurrentStep("Initializing fraud check...");

    const steps = [
      "Checking internal fraud database...",
      "Analyzing domain reputation...",
      "Scanning dark web sources...",
      "Cross-referencing partner networks...",
      "Calculating risk score...",
      "Generating recommendations..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      setProgress((i + 1) * 16.67);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const detectedType = detectInputType(input);

    // Check if we have a demo result for this input
    if (demoExamples[input]) {
      setResult(demoExamples[input]);
    } else {
      // Generate a random result for demonstration
      const riskScore = Math.floor(Math.random() * 100);
      const riskLabel: 'Safe' | 'Suspicious' | 'High Risk' = 
        riskScore < 30 ? 'Safe' : riskScore < 60 ? 'Suspicious' : 'High Risk';

      setResult({
        entity: input,
        type: detectedType,
        riskScore,
        riskLabel,
        issues: riskScore > 60 ? ['Potential security concerns detected'] : [],
        recommendations: ['Continue with standard precautions'],
        darkWebFound: riskScore > 80,
        sources: ['TrustVerify Database', 'Partner Networks']
      });
    }

    setIsChecking(false);
  };

  const getRiskColor = (riskLabel: string) => {
    switch (riskLabel) {
      case 'Safe': return 'text-green-600 bg-green-50 border-green-200';
      case 'Suspicious': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High Risk': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-5 w-5" />;
      case 'phone': return <Phone className="h-5 w-5" />;
      case 'website': return <Globe className="h-5 w-5" />;
      case 'company': return <Shield className="h-5 w-5" />;
      default: return <Search className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-[#003d2b0d] blur-3xl" />
          <div className="absolute right-[-120px] top-6 h-80 w-80 rounded-full bg-[#0b3a7815] blur-3xl" />
          <div className="absolute left-1/3 bottom-[-140px] h-72 w-72 rounded-full bg-[#1DBF7315] blur-3xl" />
        </div>

        <div className="relative max-w-[1270px] mx-auto flex flex-col items-center gap-8 text-center">
          <Badge className="h-[30px] bg-[#003d2b1a] hover:bg-[#003d2b1a] rounded-[800px] px-4 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm leading-[14px] tracking-[0]">
              CONSUMER PROTECTION DEMO
            </span>
          </Badge>
          <div className="space-y-4 max-w-4xl">
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px] px-4">
              Consumer Protection Demo
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg sm:text-xl leading-[27px] px-4">
              Experience our personal security solutions. Safeguard your identity, finances, and digital life with advanced consumer protection tools.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="h-[30px] bg-[#003d2b1a] text-[#003d2b] rounded-[800px] px-4 border-0 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
              <Eye className="h-4 w-4 mr-2" />
              Identity Monitoring
            </Badge>
            <Badge className="h-[30px] bg-[#1DBF731a] text-[#003d2b] rounded-[800px] px-4 border-0 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
              <Shield className="h-4 w-4 mr-2" />
              Personal Protection
            </Badge>
            <Badge className="h-[30px] bg-[#0b3a781a] text-[#003d2b] rounded-[800px] px-4 border-0 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
              <Clock className="h-4 w-4 mr-2" />
              Real-time Alerts
            </Badge>
          </div>
        </div>
      </section>

      <div className="max-w-[1270px] mx-auto px-6 md:px-10 py-16">
        {/* Fraud Checker Tool */}
        <Card className="mb-12 shadow-[0_14px_50px_rgba(0,0,0,0.05)] border border-[#e4e4e4] rounded-[20px]">
          <CardHeader className="text-center pb-8">
            <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[34px] sm:text-[40px] text-[#003d2b] mb-4">
              Try Our Consumer Protection Tool
            </CardTitle>
            <CardDescription className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-lg text-[#808080]">
              Enter any email, phone number, website, or company name to check for fraud risks and protect yourself
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Enter email, phone, website, or company name..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 h-12 text-lg"
                disabled={isChecking}
              />
              <Button 
                onClick={() => simulateCheck(inputValue)}
                disabled={!inputValue || isChecking}
                className="h-12 px-8 bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px] min-h-[46px]"
              >
                <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">{isChecking ? "Checking..." : "Check for Fraud"}</span>
              </Button>
            </div>

            {/* Demo Examples */}
            <div className="text-center">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-3">Try these demo examples:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {Object.keys(demoExamples).map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue(example)}
                    className="text-xs border-[#e4e4e4] text-[#003d2b] hover:bg-[#0b3a780d] rounded-[10px]"
                    disabled={isChecking}
                  >
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica]">{example}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Progress Indicator */}
            {isChecking && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{currentStep}</span>
                  <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#0b3a78]">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Results */}
            {result && !isChecking && (
              <div className="space-y-6 mt-8 p-6 bg-[#f4f4f4] rounded-[18px] border border-[#e4e4e4]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getIcon(result.type)}
                    <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">{result.entity}</span>
                  </div>
                  <Badge className={`${getRiskColor(result.riskLabel)} border [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium`}>
                    {result.riskLabel}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Risk Score */}
                  <div className="space-y-3">
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Risk Analysis</h4>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Risk Score</span>
                          <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">{result.riskScore}/100</span>
                        </div>
                        <Progress 
                          value={result.riskScore} 
                          className={`h-3 ${
                            result.riskScore < 30 ? 'text-app-secondary' : 
                            result.riskScore < 60 ? 'text-yellow-600' : 'text-[#FF4B26]'
                          }`}
                        />
                      </div>
                    </div>
                    {result.darkWebFound && (
                      <div className="flex items-center space-x-2 text-[#FF4B26] bg-[#f3f3f3] border border-[#e4e4e4] p-2 rounded">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-sm font-medium">Found on dark web</span>
                      </div>
                    )}
                  </div>

                  {/* Sources */}
                  <div className="space-y-3">
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Data Sources</h4>
                    <div className="space-y-1">
                      {result.sources.map((source, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-app-secondary" />
                          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{source}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Issues and Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.issues.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center">
                        <XCircle className="h-4 w-4 text-[#FF4B26] mr-2" />
                        Security Issues
                      </h4>
                      <ul className="space-y-2">
                        {result.issues.map((issue, idx) => (
                          <li key={idx} className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] flex items-start">
                            <span className="text-[#FF4B26] mr-2">•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center">
                      <Shield className="h-4 w-4 text-app-secondary mr-2" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] flex items-start">
                          <span className="text-app-secondary mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consumer Service Offerings */}
        <section className="mb-16 bg-[#f4f4f4] py-16 px-6 rounded-[20px]">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[34px] sm:text-[40px] text-[#003d2b] mb-4">Personal Security Services</h2>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-lg text-[#808080] max-w-2xl mx-auto">
              Comprehensive personal protection solutions. Advanced security for individuals and families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] transition-shadow">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-br from-[#0b3a78] to-[#1DBF73] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] text-center">TrustVerify Personal Monitor</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center">24/7 Identity & Dark Web Surveillance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center mb-4">
                  Continuous monitoring of your personal information across the dark web and breach databases.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Dark web credential monitoring</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Data breach alert system</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Social media profile monitoring</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Public records surveillance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] transition-shadow">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-br from-[#1DBF73] to-[#0b3a78] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] text-center">TrustVerify Credit Guardian</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center">Complete Credit & Financial Protection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center mb-4">
                  Advanced credit monitoring with real-time alerts and identity theft protection.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">3-bureau credit monitoring</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Identity theft alerts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Credit score tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Financial account monitoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] transition-shadow">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-br from-[#0A3778] to-[#1DBF73] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] text-center">TrustVerify Digital Vault</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center">Secure Personal Document Storage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center mb-4">
                  Military-grade encryption for your important documents with biometric access control.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">End-to-end encryption storage</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Biometric authentication</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Secure document sharing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Emergency access recovery</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] transition-shadow">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-br from-[#0b3a78] to-[#1DBF73] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] text-center">TrustVerify Mobile Shield</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center">Smartphone & Device Security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center mb-4">
                  Comprehensive mobile device protection against scams, malware, and privacy threats.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Real-time scam call blocking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">SMS phishing protection</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">App security scanning</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Wi-Fi safety monitoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] transition-shadow">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-br from-[#1DBF73] to-[#0A3778] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] text-center">TrustVerify Web Guardian</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center">Browser & Online Shopping Protection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center mb-4">
                  Safe browsing protection with real-time website verification and shopping security.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Malicious website blocking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Shopping site verification</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Privacy protection tools</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Safe download scanning</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] transition-shadow">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-br from-[#0A3778] to-[#1DBF73] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] text-center">TrustVerify Family Plus</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center">Family-Wide Security Protection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center mb-4">
                  Comprehensive family protection plan covering all members with centralized monitoring and control.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Up to 6 family members</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Parental monitoring tools</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Centralized security dashboard</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-app-secondary mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Family emergency response</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}