import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrustVerifyBadge } from "@/components/TrustVerifyBadge";
import { TrustScoreWidget } from "@/components/TrustScoreWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  CheckCircle, 
  Award,
  Store,
  Users,
  TrendingUp,
  Eye,
  Target,
  Building2,
  Briefcase,
  Zap,
  Code,
  ExternalLink,
  Clock,
  FileCheck,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TrustBadgeDemo() {
  const [selectedUseCase, setSelectedUseCase] = useState<'marketplace' | 'ecommerce' | 'service' | 'investor'>('marketplace');
  const [isLive, setIsLive] = useState(false);
  const [step, setStep] = useState(0);
  const { toast } = useToast();

  const useCases = {
    marketplace: {
      title: "Marketplace Seller Verification",
      icon: Store,
      description: "Trust badges help buyers identify legitimate sellers in online marketplaces",
      scenario: {
        seller: "TechGadgets Pro",
        domain: "techgadgets-pro.com",
        score: 92,
        risk: 'low' as const,
        tier: 'enterprise' as const
      },
      steps: [
        {
          title: "Seller Registration",
          description: "New seller creates account and submits business documentation",
          duration: 2000
        },
        {
          title: "Identity Verification",
          description: "KYB verification checks business registration and owner identity",
          duration: 3000
        },
        {
          title: "History Analysis",
          description: "System analyzes past transactions, reviews, and dispute history",
          duration: 2500
        },
        {
          title: "Trust Score Calculation",
          description: "ML algorithm calculates trust score based on 50+ data points",
          duration: 2000
        },
        {
          title: "Badge Issued",
          description: "Seller receives verified trust badge for profile and listings",
          duration: 1500
        }
      ],
      benefits: [
        "86% increase in buyer confidence",
        "43% higher conversion rates",
        "67% reduction in fraud disputes",
        "Premium placement in search results"
      ]
    },
    ecommerce: {
      title: "E-commerce Store Certification",
      icon: Building2,
      description: "Display trust badges on your website to build customer confidence",
      scenario: {
        seller: "Premium Fashion Ltd",
        domain: "premiumfashion.co.uk",
        score: 88,
        risk: 'low' as const,
        tier: 'standard' as const
      },
      steps: [
        {
          title: "Website Integration",
          description: "Store owner integrates TrustVerify API on their website",
          duration: 2000
        },
        {
          title: "Security Audit",
          description: "Platform scans SSL certificates, payment security, and data protection",
          duration: 3000
        },
        {
          title: "Business Verification",
          description: "Validates business registration, VAT number, and trading address",
          duration: 2500
        },
        {
          title: "Customer Review Check",
          description: "Analyzes customer reviews and complaint history across platforms",
          duration: 2000
        },
        {
          title: "Badge Deployment",
          description: "Trust badge widget embedded on website homepage and checkout",
          duration: 1500
        }
      ],
      benefits: [
        "52% reduction in cart abandonment",
        "34% increase in repeat purchases",
        "Trust badge displayed on 3M+ page views",
        "Enhanced SEO and domain authority"
      ]
    },
    service: {
      title: "Professional Service Provider",
      icon: Briefcase,
      description: "Freelancers and agencies showcase credentials with trust badges",
      scenario: {
        seller: "Digital Marketing Experts",
        domain: "digitalmarketingexperts.io",
        score: 84,
        risk: 'low' as const,
        tier: 'standard' as const
      },
      steps: [
        {
          title: "Professional Profile",
          description: "Service provider creates detailed profile with certifications",
          duration: 2000
        },
        {
          title: "Credential Verification",
          description: "System verifies professional licenses, certifications, and qualifications",
          duration: 3000
        },
        {
          title: "Portfolio Review",
          description: "Analyzes past client projects, testimonials, and case studies",
          duration: 2500
        },
        {
          title: "Payment History Check",
          description: "Reviews payment reliability and financial standing",
          duration: 2000
        },
        {
          title: "Badge Activation",
          description: "Trust badge issued for profile, proposals, and invoices",
          duration: 1500
        }
      ],
      benefits: [
        "71% higher proposal acceptance rate",
        "58% increase in premium pricing power",
        "92% client satisfaction score",
        "Featured in verified provider directory"
      ]
    },
    investor: {
      title: "Investor Due Diligence Platform",
      icon: TrendingUp,
      description: "Trust badges validate investment opportunities and reduce fraud risk",
      scenario: {
        seller: "GreenTech Innovations",
        domain: "greentech-innovations.io",
        score: 95,
        risk: 'low' as const,
        tier: 'enterprise' as const
      },
      steps: [
        {
          title: "Company Onboarding",
          description: "Startup submits pitch deck, financial statements, and legal documents",
          duration: 2000
        },
        {
          title: "Financial Audit",
          description: "Independent verification of revenue claims, cap table, and burn rate",
          duration: 3000
        },
        {
          title: "Founder Background Check",
          description: "Deep dive into founder history, past ventures, and references",
          duration: 2500
        },
        {
          title: "Market Validation",
          description: "Analyzes product-market fit, traction metrics, and growth potential",
          duration: 2000
        },
        {
          title: "Investment Badge Issued",
          description: "Verified company badge shown to accredited investors on platform",
          duration: 1500
        }
      ],
      benefits: [
        "95% fraud detection accuracy",
        "3x faster investor decision-making",
        "£2.4M average raise for verified companies",
        "Institutional investor access unlocked"
      ]
    }
  };

  const handlePlayDemo = () => {
    setIsLive(true);
    setStep(0);
    
    const steps = useCases[selectedUseCase].steps;
    let currentStep = 0;
    
    const runNextStep = () => {
      if (currentStep < steps.length) {
        const currentStepData = steps[currentStep];
        setStep(currentStep);
        toast({
          title: currentStepData.title,
          description: currentStepData.description,
          duration: currentStepData.duration,
        });
        
        setTimeout(() => {
          currentStep++;
          runNextStep();
        }, currentStepData.duration);
      } else {
        setIsLive(false);
        setStep(steps.length);
      }
    };
    
    runNextStep();
  };

  const currentUseCase = useCases[selectedUseCase];

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 w-full">
          <div className="flex justify-center mb-4">
            <div className="p-3 sm:p-4 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] rounded-2xl">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>
          </div>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
            Trust Badge System
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto px-4">
            Issue verified trust badges to credible businesses and service providers - Build confidence, reduce fraud, increase conversions
          </p>
        </div>

        {/* Value Proposition */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 w-full">
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] hover:border-[#27ae60]/50 transition-all">
            <CardHeader className="pb-4 pt-6 px-6">
              <div className="p-2 sm:p-3 bg-[#27ae60]/10 rounded-xl w-fit mb-2 sm:mb-3">
                <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-[#27ae60]" />
              </div>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base sm:text-xl leading-tight mb-2">Enhanced Visibility</CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] leading-relaxed text-sm">
                Verified badges appear on profiles, listings, and search results
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] hover:border-[#27ae60]/50 transition-all">
            <CardHeader className="pb-4 pt-6 px-6">
              <div className="p-2 sm:p-3 bg-[#27ae60]/10 rounded-xl w-fit mb-2 sm:mb-3">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-[#27ae60]" />
              </div>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base sm:text-xl leading-tight mb-2">Instant Credibility</CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] leading-relaxed text-sm">
                Trust scores 0-100 calculated from 50+ verification data points
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] hover:border-[#27ae60]/50 transition-all">
            <CardHeader className="pb-4 pt-6 px-6">
              <div className="p-2 sm:p-3 bg-[#27ae60]/10 rounded-xl w-fit mb-2 sm:mb-3">
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-[#27ae60]" />
              </div>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base sm:text-xl leading-tight mb-2">Real-Time Updates</CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] leading-relaxed text-sm">
                Badges update dynamically based on ongoing performance
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] hover:border-[#27ae60]/50 transition-all">
            <CardHeader className="pb-4 pt-6 px-6">
              <div className="p-2 sm:p-3 bg-[#27ae60]/10 rounded-xl w-fit mb-2 sm:mb-3">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 text-[#27ae60]" />
              </div>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base sm:text-xl leading-tight mb-2">Multi-Tier System</CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] leading-relaxed text-sm">
                Basic, Standard, and Enterprise certification levels available
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Use Case Selector */}
        <Card className="mb-8 bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] w-full">
          <CardHeader>
            <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl sm:text-2xl flex items-center gap-2">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-[#27ae60]" />
              Trust Badge Use Cases
            </CardTitle>
            <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm sm:text-base">
              See how different industries use trust badges to build credibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Button
                onClick={() => setSelectedUseCase('marketplace')}
                variant={selectedUseCase === 'marketplace' ? 'default' : 'outline'}
                className={`h-auto py-3 sm:py-4 flex flex-col items-center gap-2 rounded-lg ${selectedUseCase === 'marketplace' ? 'bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90' : 'border border-[#e4e4e4]'}`}
                data-testid="button-marketplace-case"
              >
                <Store className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Marketplace</span>
              </Button>
              <Button
                onClick={() => setSelectedUseCase('ecommerce')}
                variant={selectedUseCase === 'ecommerce' ? 'default' : 'outline'}
                className={`h-auto py-3 sm:py-4 flex flex-col items-center gap-2 rounded-lg ${selectedUseCase === 'ecommerce' ? 'bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90' : 'border border-[#e4e4e4]'}`}
                data-testid="button-ecommerce-case"
              >
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">E-commerce</span>
              </Button>
              <Button
                onClick={() => setSelectedUseCase('service')}
                variant={selectedUseCase === 'service' ? 'default' : 'outline'}
                className={`h-auto py-3 sm:py-4 flex flex-col items-center gap-2 rounded-lg ${selectedUseCase === 'service' ? 'bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90' : 'border border-[#e4e4e4]'}`}
                data-testid="button-service-case"
              >
                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Services</span>
              </Button>
              <Button
                onClick={() => setSelectedUseCase('investor')}
                variant={selectedUseCase === 'investor' ? 'default' : 'outline'}
                className={`h-auto py-3 sm:py-4 flex flex-col items-center gap-2 rounded-lg ${selectedUseCase === 'investor' ? 'bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90' : 'border border-[#e4e4e4]'}`}
                data-testid="button-investor-case"
              >
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Investors</span>
              </Button>
            </div>

            {/* Use Case Details */}
            <div className="bg-gradient-to-br from-[#00A859]/5 to-[#2C79D1]/5 rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-[#00A859] rounded-xl flex-shrink-0">
                  {(() => {
                    const IconComponent = currentUseCase.icon;
                    return <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {currentUseCase.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {currentUseCase.description}
                  </p>
                </div>
              </div>

              {/* Live Demo Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                <Button 
                  onClick={handlePlayDemo}
                  disabled={isLive}
                  className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90 h-12 rounded-lg flex-1 sm:flex-initial"
                  data-testid="button-play-demo"
                >
                  {isLive ? (
                    <>
                      <Activity className="mr-2 h-4 w-4 animate-pulse" />
                      Demo in Progress...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Play Live Demo
                    </>
                  )}
                </Button>
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-lg border border-gray-200">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-xs sm:text-sm text-gray-600">
                    {step === currentUseCase.steps.length ? 'Complete' : `Step ${step + 1}/${currentUseCase.steps.length}`}
                  </span>
                </div>
              </div>

              {/* Process Steps */}
              <div className="space-y-3">
                {currentUseCase.steps.map((processStep, index) => (
                  <div 
                    key={index}
                    className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg transition-all ${
                      step >= index + 1 
                        ? 'bg-[#00A859]/10 border-2 border-[#00A859]' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                      step >= index + 1
                        ? 'bg-[#00A859] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step > index ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm sm:text-base mb-1 ${
                        step >= index + 1 ? 'text-[#00A859]' : 'text-gray-700'
                      }`}>
                        {processStep.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {processStep.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge Demonstration */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Live Badge Preview */}
          <Card className="border-2 border-[#2C79D1]/20">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-[#2C79D1]" />
                Trust Badge Preview
              </CardTitle>
              <CardDescription className="text-sm">
                How the badge appears to customers and investors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <Tabs defaultValue="detailed" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="detailed" className="text-xs sm:text-sm">Detailed</TabsTrigger>
                  <TabsTrigger value="compact" className="text-xs sm:text-sm">Compact</TabsTrigger>
                  <TabsTrigger value="widget" className="text-xs sm:text-sm">Widget</TabsTrigger>
                </TabsList>
                <TabsContent value="detailed" className="mt-4">
                  <TrustVerifyBadge
                    domain={currentUseCase.scenario.domain}
                    trustScore={currentUseCase.scenario.score}
                    riskLevel={currentUseCase.scenario.risk}
                    variant="detailed"
                    certificationLevel={currentUseCase.scenario.tier}
                  />
                </TabsContent>
                <TabsContent value="compact" className="mt-4">
                  <TrustVerifyBadge
                    domain={currentUseCase.scenario.domain}
                    trustScore={currentUseCase.scenario.score}
                    riskLevel={currentUseCase.scenario.risk}
                    variant="compact"
                    certificationLevel={currentUseCase.scenario.tier}
                  />
                </TabsContent>
                <TabsContent value="widget" className="mt-4">
                  <TrustScoreWidget
                    domain={currentUseCase.scenario.domain}
                    trustScore={currentUseCase.scenario.score}
                    riskLevel={currentUseCase.scenario.risk}
                    size="medium"
                    showEmbed={true}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Business Benefits */}
          <Card className="border-2 border-[#00A859]/20">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-[#00A859]" />
                Measurable Business Impact
              </CardTitle>
              <CardDescription className="text-sm">
                Real results from {currentUseCase.scenario.seller}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentUseCase.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-r from-[#00A859]/5 to-[#2C79D1]/5 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-[#00A859] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700 font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}

                <div className="mt-6 p-4 sm:p-6 bg-gradient-to-br from-[#00A859] to-[#2C79D1] rounded-xl text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                    <h4 className="font-bold text-base sm:text-lg">Trust Badge ROI</h4>
                  </div>
                  <p className="text-sm sm:text-base opacity-90 mb-4">
                    Companies with verified trust badges see an average 3.7x return on investment within 90 days through increased conversions and reduced fraud.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                      +47% Conversions
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                      -63% Fraud
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                      +£180K Revenue
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How Badges Are Issued */}
        <Card className="border-2 border-[#2C79D1]/20 mb-8">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <FileCheck className="h-5 w-5 sm:h-6 sm:w-6 text-[#2C79D1]" />
              Badge Issuance Process
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Understanding how trust scores are calculated and badges are awarded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <div className="p-2 sm:p-3 bg-[#2C79D1] rounded-lg w-fit mb-3 sm:mb-4">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-900">Identity Verification</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li>• KYB/KYC documentation</li>
                  <li>• Business registration check</li>
                  <li>• Owner background screening</li>
                  <li>• Address & phone verification</li>
                </ul>
                <div className="mt-4 px-3 py-2 bg-white rounded-lg">
                  <span className="text-xs font-semibold text-[#2C79D1]">Score Impact: 0-25 points</span>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="p-2 sm:p-3 bg-[#00A859] rounded-lg w-fit mb-3 sm:mb-4">
                  <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-900">Performance History</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li>• Transaction completion rate</li>
                  <li>• Customer satisfaction scores</li>
                  <li>• Dispute & chargeback ratio</li>
                  <li>• Response time metrics</li>
                </ul>
                <div className="mt-4 px-3 py-2 bg-white rounded-lg">
                  <span className="text-xs font-semibold text-[#00A859]">Score Impact: 0-45 points</span>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="p-2 sm:p-3 bg-purple-600 rounded-lg w-fit mb-3 sm:mb-4">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-900">Security & Compliance</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li>• SSL/TLS certificates</li>
                  <li>• Payment security (PCI DSS)</li>
                  <li>• Data protection compliance</li>
                  <li>• Fraud detection signals</li>
                </ul>
                <div className="mt-4 px-3 py-2 bg-white rounded-lg">
                  <span className="text-xs font-semibold text-purple-600">Score Impact: 0-30 points</span>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl text-white">
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Code className="h-5 w-5" />
                Scoring Algorithm
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm font-mono">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Verification Level:</span>
                    <span className="text-[#00A859]">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Transaction History:</span>
                    <span className="text-[#00A859]">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Dispute Ratio:</span>
                    <span className="text-[#00A859]">20%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Account Age:</span>
                    <span className="text-[#2C79D1]">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Domain Reputation:</span>
                    <span className="text-[#2C79D1]">15%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-xs sm:text-sm text-gray-300">
                  ML algorithm processes 50+ data points in real-time. Scores update continuously based on ongoing activity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-[#27ae60]/10 to-[#0052cc]/10 border border-[#27ae60]/20 bg-[#fcfcfc] rounded-[20px] w-full">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="max-w-3xl mx-auto">
              <Award className="h-12 w-12 sm:h-16 sm:w-16 text-[#27ae60] mx-auto mb-4" />
              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl mb-3 sm:mb-4">
                Get Your Trust Badge Today
              </h2>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base sm:text-lg mb-6 sm:mb-8">
                Join 12,000+ verified businesses displaying TrustVerify badges. Start building customer confidence and increasing conversions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button 
                  className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90 px-6 sm:px-8 py-5 sm:py-6 h-12 rounded-lg"
                  data-testid="button-get-verified"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-base sm:text-lg">Get Verified Now</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="border border-[#e4e4e4] text-[#003d2b] hover:bg-[#f6f6f6] px-6 sm:px-8 py-5 sm:py-6 h-12 rounded-lg"
                  data-testid="button-view-pricing"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-base sm:text-lg">View Pricing</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
