import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  ArrowRight, 
  Lock,
  ShoppingCart,
  Brain,
  Zap,
  TrendingUp,
  Target,
  Activity
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";

export function EscrowServices() {
  const intelligenceModules = [
    {
      name: "CyberTrust Index",
      score: "0-100",
      trigger: "Score <50",
      icon: Shield,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      name: "Transaction Integrity",
      score: "Risk Level",
      trigger: "High/Critical",
      icon: Activity,
      color: "text-orange-600",
      bg: "bg-orange-100"
    },
    {
      name: "Vendor Diligence",
      score: "Trust Rating",
      trigger: "New seller <7 days",
      icon: Target,
      color: "text-[#1DBF73]",
      bg: "bg-[#1DBF73]/10"
    }
  ];

  const useCases = [
    {
      title: "C2C Marketplaces",
      description: "Protect buyers and sellers in peer-to-peer transactions with automated escrow for high-value items.",
      examples: ["Electronics & Tech", "Vehicles & Motors", "Collectibles", "Jewelry"],
      triggerRate: "12% of transactions"
    },
    {
      title: "E-Commerce Platforms",
      description: "Safeguard marketplace transactions with intelligent escrow activation based on seller trust score.",
      examples: ["New Seller Listings", "High-Value Products", "Custom Orders", "International Sales"],
      triggerRate: "8% of transactions"
    },
    {
      title: "Freelance Services",
      description: "Milestone-based escrow for project payments with deliverable verification and dispute resolution.",
      examples: ["Web Development", "Design Projects", "Content Creation", "Consulting"],
      triggerRate: "15% of transactions"
    },
    {
      title: "Handmade Goods",
      description: "Protect artisan marketplace transactions with escrow for custom creations and pre-orders.",
      examples: ["Custom Furniture", "Art Commissions", "Jewelry Design", "Clothing"],
      triggerRate: "10% of transactions"
    },
    {
      title: "Crypto P2P Trading",
      description: "Secure cryptocurrency exchanges with smart contract escrow and wallet risk assessment.",
      examples: ["Bitcoin Trading", "NFT Sales", "Token Swaps", "Stablecoin Transfers"],
      triggerRate: "25% of transactions"
    },
    {
      title: "Digital Services",
      description: "Protect digital product sales and subscriptions with automated escrow and fraud prevention.",
      examples: ["Software Licenses", "Online Courses", "Digital Assets", "SaaS Subscriptions"],
      triggerRate: "6% of transactions"
    }
  ];

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-6 md:px-10 py-20">
        <header className="px-6 mx-auto flex flex-col items-start gap-2.5 w-full max-w-[1180px]">
          <div className="flex justify-center w-full mb-6">
            <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                Intelligence-Triggered Settlement
              </span>
            </Badge>
          </div>
          <h1 className="flex items-center justify-center w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl tracking-[0] leading-[normal] text-center">
            Escrow That Knows When to Protect
          </h1>
          <p className="flex items-center justify-center w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl tracking-[0] leading-8 text-center">
            Our 6 intelligence modules detect high-risk transactions in real-time and automatically 
            recommend escrow protection—ensuring funds are only released when it's safe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full mt-4">
            <Button 
              size="lg" 
              className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8 py-6 text-lg font-bold"
              data-testid="button-cta-escrow"
            >
              <span className="font-semibold text-white text-sm">See How It Works</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/pricing">
              <Button 
                variant="outline" 
                size="lg" 
                className="relative h-[45px] rounded-lg border-none before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-lg before:[background:linear-gradient(118deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] hover:bg-gray-50 px-8 py-6 text-lg font-semibold"
                data-testid="button-view-pricing"
              >
                <span className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] bg-clip-text text-transparent font-semibold text-sm">View Escrow Fees</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Intelligence Module Triggers */}
        <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] w-full">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Brain className="h-12 w-12 text-[#436cc8] mx-auto mb-4" />
              <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl font-semibold text-[#003d2b] mb-2">
                Intelligence Modules That Trigger Escrow
              </h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                When these modules detect risk, escrow protection is automatically recommended
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {intelligenceModules.map((module, idx) => (
                <div key={idx} className="bg-white rounded-[10px] p-6 border border-[#e4e4e4]">
                  <div className={`${module.bg} w-14 h-14 rounded-[10px] flex items-center justify-center mb-4`}>
                    <module.icon className={`h-7 w-7 ${module.color}`} />
                  </div>
                  <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b] mb-2">{module.name}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Measures:</span>
                    <Badge variant="outline" className="text-xs">{module.score}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b] font-semibold">Triggers: {module.trigger}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* The SETTLE Lifecycle Stage */}
      <section className="flex flex-col items-start gap-[30px] w-full mx-auto px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="w-full max-w-[1300px] mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                The SETTLE Stage
              </span>
            </Badge>
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl mb-4">
              From Detection to Secure Settlement
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg max-w-3xl mx-auto">
              Escrow is the final layer in our 4-stage protection lifecycle: DETECT → DECIDE → SECURE → SETTLE
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#e3f2fd] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl font-bold text-[#436cc8]">1</span>
              </div>
              <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] mb-2">DETECT</h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">
                Intelligence modules scan transaction for fraud patterns, risk signals, and anomalies
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] mb-2">DECIDE</h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">
                System calculates composite risk score and determines if escrow protection is needed
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#e8f5e9] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl font-bold text-[#27ae60]">3</span>
              </div>
              <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] mb-2">SECURE</h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">
                Buyer deposits funds into secure escrow account with bank-level encryption
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] mb-2">SETTLE</h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">
                Upon buyer confirmation, funds automatically release to seller within 72 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Use Cases */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-[#f6f6f6]">
        <div className="w-full max-w-[1520px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl mb-4">
              Built for E-Commerce & Marketplaces
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg max-w-3xl mx-auto">
              Intelligent escrow protection for every type of online transaction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, idx) => (
              <Card key={idx} className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] hover:shadow-lg transition-all">
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#436cc8] text-xl">{useCase.title}</CardTitle>
                    <ShoppingCart className="h-6 w-6 text-[#27ae60]" />
                  </div>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-3">
                    <div>
                      <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xs text-[#808080] mb-2 font-semibold">COMMON SCENARIOS</p>
                      <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] space-y-1">
                        {useCase.examples.map((example, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#27ae60] flex-shrink-0" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-3 border-t border-[#e4e4e4]">
                      <div className="flex items-center justify-between">
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080]">Typical Activation</span>
                        <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-2 py-1 h-auto">
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0]">
                            {useCase.triggerRate}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Escrow Features */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="w-full max-w-[1520px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl mb-4">
              Enterprise-Grade Escrow Protection
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg">
              Bank-level security meets intelligent automation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <Lock className="h-10 w-10 text-[#27ae60] mb-4" />
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Bank-Level Security</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Funds protected by enterprise-grade security with multi-signature controls
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60] flex-shrink-0 mt-0.5" />
                    256-bit SSL encryption
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Multi-signature authentication
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Segregated escrow accounts
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    FDIC-insured protection
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <Clock className="h-10 w-10 text-[#27ae60] mb-4" />
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Smart Milestones</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Break transactions into milestones with automated release triggers
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Milestone-based releases
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Automated payment triggers
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Real-time progress tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Custom condition builders
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <Users className="h-10 w-10 text-[#27ae60] mb-4" />
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Dispute Resolution</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Professional mediation with experienced arbitrators
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Expert mediators
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Evidence collection system
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Fair arbitration process
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Binding decision enforcement
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <Shield className="h-10 w-10 text-[#27ae60] mb-4" />
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Real-Time Risk Monitoring</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Continuous fraud detection throughout escrow lifecycle
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    24/7 transaction monitoring
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Anomaly pattern detection
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Live risk score updates
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Instant fraud alerts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <Zap className="h-10 w-10 text-[#27ae60] mb-4" />
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Rapid Settlement</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Fast fund release with automated verification
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    72-hour settlement window
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Automated buyer verification
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Instant release notifications
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Same-day bank transfers
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <AlertCircle className="h-10 w-10 text-[#27ae60] mb-4" />
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Compliance & Audit Trail</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Complete transaction history with regulatory compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Full audit trail logging
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    GDPR & CCPA compliance
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    AML/KYC verification
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                    Export transaction reports
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-app-primary text-white">
        <div className="w-full">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white text-3xl sm:text-4xl mb-4">
              Transparent Escrow Pricing
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-white/90 text-xl">
              Simple, volume-based fees with no hidden charges
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center bg-white/10 backdrop-blur rounded-[20px] p-8 border border-white/20">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-5xl font-bold text-white mb-2">2%</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-lg font-medium mb-1">Standard Rate</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-white/80">Per transaction</div>
              <div className="mt-4 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-white/80">Minimum fee: £1</div>
            </div>
            
            <div className="text-center bg-white/10 backdrop-blur rounded-[20px] p-8 border-2 border-white shadow-2xl">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-5xl font-bold text-white mb-2">1.5%</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-lg font-medium mb-1">Volume Pricing</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-white/80">100+ trans/month</div>
              <Badge className="mt-4 w-fit bg-white text-app-primary rounded-full px-4 py-1.5 h-auto">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                  Most Popular
                </span>
              </Badge>
            </div>
            
            <div className="text-center bg-white/10 backdrop-blur rounded-[20px] p-8 border border-white/20">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-5xl font-bold text-white mb-2">1%</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-lg font-medium mb-1">Enterprise Rate</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-white/80">1,000+ trans/month</div>
              <div className="mt-4 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-white/80">+ dedicated support</div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-white/90 mb-6 max-w-2xl mx-auto">
              Combined with Intelligence API subscriptions (from £99/month), TrustVerify delivers 
              comprehensive fraud protection and secure settlement for your marketplace.
            </p>
            <Link href="/pricing">
              <Button 
                size="lg" 
                className="h-[45px] rounded-lg bg-white text-[#003d2b] hover:opacity-90 px-8 py-6 text-lg font-bold"
                data-testid="button-full-pricing"
              >
                <span className="font-semibold text-sm">View Full Pricing</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-2">
              Platform Performance
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg">
              Early metrics from our newly launched platform (2025)
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-4xl font-bold bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] bg-clip-text text-transparent mb-2">
                £2.4M+
              </div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-base font-medium text-[#003d2b]">Protected Volume</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080] mt-1">Cumulative escrow value</div>
            </div>
            
            <div className="text-center">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-4xl font-bold bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] bg-clip-text text-transparent mb-2">
                98.3%
              </div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-base font-medium text-[#003d2b]">Success Rate</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080] mt-1">Completed successfully</div>
            </div>
            
            <div className="text-center">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-4xl font-bold bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] bg-clip-text text-transparent mb-2">
                72hrs
              </div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-base font-medium text-[#003d2b]">Settlement Time</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080] mt-1">Average completion</div>
            </div>
            
            <div className="text-center">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-4xl font-bold bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] bg-clip-text text-transparent mb-2">
                1,200+
              </div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-base font-medium text-[#003d2b]">Transactions</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080] mt-1">Processed to date</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16">
        <div className="max-w-4xl mx-auto text-center text-white w-full">
          <TrendingUp className="h-16 w-16 text-[#27ae60] mx-auto mb-6" />
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl mb-6">
            Ready to Protect Your Marketplace?
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg sm:text-xl mb-8 max-w-7xl mx-auto">
            Join the next generation of intelligent escrow—where risk detection meets secure settlement. 
            Start with our free API tier and activate escrow only when you need it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button 
                size="lg" 
                className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8 py-6 text-lg font-bold"
                data-testid="button-get-started"
              >
                <span className="font-semibold text-white text-sm">Get Started</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-[#003D2B] text-[#003D2B] bg-white hover:text-[#003d2b] px-8 py-6 text-lg font-semibold"
                data-testid="button-contact-sales"
              >
                <span className="font-semibold text-sm">Contact Sales</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
