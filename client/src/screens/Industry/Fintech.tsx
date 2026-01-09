import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  CreditCard,
  Lock,
  Globe,
  FileCheck,
  Scale,
  TrendingUp,
  Smartphone
} from "lucide-react";

export default function FintechIndustryPage() {
  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full text-center mb-8">
          <div className="flex justify-center w-full mb-6">
            <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                Fintech & Banking
              </span>
            </Badge>
          </div>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-4">
            Compliance-First Solutions for Financial Services
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-8">
            Meet FCA, PSD2, and global regulatory requirements with comprehensive 
            KYC, AML, and fraud prevention solutions. Onboard customers in seconds 
            while maintaining the highest compliance standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/bank-onboarding-demo">
              <Button 
                size="lg" 
                className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8 py-4" 
                data-testid="button-try-demo"
              >
                <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Try Banking Demo</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/enterprise-contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="relative h-[45px] rounded-lg border-none before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-lg before:[background:linear-gradient(118deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] hover:bg-gray-50 px-8 py-4" 
                data-testid="button-contact-sales"
              >
                <span className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] bg-clip-text text-transparent font-semibold text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Contact Sales</span>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">FCA</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Compliant</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">PSD2</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Ready</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">6AML</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Directive</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">SOC 2</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Certified</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases Tabs */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Financial Services Use Cases
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-xl max-w-3xl mx-auto">
            From digital banks to payment processors, we power compliance for 
            the entire financial services ecosystem.
          </p>
        </div>

        <Tabs defaultValue="neobanks" className="w-full" data-testid="fintech-tabs">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-gray-200 rounded-lg p-1">
              <TabsTrigger value="neobanks" data-testid="tab-neobanks">Digital Banks</TabsTrigger>
              <TabsTrigger value="payments" data-testid="tab-payments">Payment Providers</TabsTrigger>
              <TabsTrigger value="lending" data-testid="tab-lending">Lending Platforms</TabsTrigger>
              <TabsTrigger value="wealth" data-testid="tab-wealth">Wealth Management</TabsTrigger>
            </TabsList>

            <TabsContent value="neobanks" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Smartphone className="w-6 h-6 text-[#27ae60]" />
                    Digital Banks & Neobanks
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Fast, compliant customer onboarding for digital-first banks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Instant Account Opening</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Complete KYC in under 2 minutes</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">FCA Electronic ID Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Meets MLR 2017 e-IDV requirements</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Biometric Authentication</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Liveness detection and face matching</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">PEP & Sanctions Screening</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Real-time screening against global lists</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Ongoing Monitoring</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Continuous customer due diligence</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <CreditCard className="w-6 h-6 text-[#27ae60]" />
                    Payment Service Providers
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    PSD2-compliant onboarding and transaction monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Merchant Onboarding</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">KYB verification for business accounts</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Transaction Monitoring</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Real-time fraud detection</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">SCA Compliance</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Strong Customer Authentication support</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Chargeback Prevention</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Reduce fraud-related chargebacks</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lending" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <TrendingUp className="w-6 h-6 text-[#27ae60]" />
                    Lending & Credit Platforms
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Comprehensive identity and income verification for lenders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Affordability Checks</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Open Banking income verification</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">First-Party Fraud Prevention</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Detect synthetic identity fraud</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Document Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Payslips, bank statements, P60s</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Credit Risk Scoring</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Fraud-adjusted risk models</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wealth" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Scale className="w-6 h-6 text-[#27ae60]" />
                    Wealth & Investment Management
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Enhanced due diligence for high-net-worth clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Source of Wealth Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Document and verify wealth origins</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">PEP Enhanced Screening</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Deep dive into political connections</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Adverse Media Monitoring</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Continuous reputation screening</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Complex Structure Analysis</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">UBO identification for trusts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </section>

      {/* Compliance Section */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Built for Financial Regulations
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Shield className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-1">FCA Compliant</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">UK Financial Conduct Authority</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Globe className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-1">6AMLD Ready</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">EU AML Directive Compliance</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Lock className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-1">PSD2/SCA</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Strong Authentication Support</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <FileCheck className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-1">GDPR & DPA</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Data Protection Compliant</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-20 bg-white" id="pricing">
        <div className="text-center mb-12 w-full">
          <Badge className="bg-[#27ae6033] text-[#27ae60] rounded-full mb-4">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Competitive Pricing</span>
          </Badge>
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Fintech & Banking Pricing
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-xl max-w-3xl mx-auto">
            FCA-compliant verification at 30-50% below market leaders. 
            Transparent pricing with no hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12 w-full max-w-7xl mx-auto">
          {/* Startup */}
          <Card className="relative border-2 border-[#e4e4e4] hover:border-[#27ae60] transition-colors bg-[#fcfcfc] rounded-[20px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                <span>Startup</span>
              </CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">For emerging fintechs</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">£499</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Up to 500 KYC verifications/month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Document verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">PEP & sanctions screening</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Basic AML checks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">FCA-compliant audit trail</span>
                </div>
              </div>
              <Link to="/enterprise-contact">
                <Button className="w-full mt-4 h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]" variant="outline" data-testid="button-startup">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Get Started</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Growth - Popular */}
          <Card className="relative border-2 border-[#27ae60] shadow-lg bg-[#fcfcfc] rounded-[20px]">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-[#27ae60] text-white rounded-full">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Most Popular</span>
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-between [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                <span>Growth</span>
              </CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">For scaling financial services</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">£1,249</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Up to 2,500 verifications/month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Everything in Startup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Biometric liveness detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">KYB business verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Ongoing monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">API access & webhooks</span>
                </div>
              </div>
              <Link to="/enterprise-contact">
                <Button className="w-full mt-4 h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90" data-testid="button-growth-fintech">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Get Started</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card className="relative border-2 border-[#e4e4e4] hover:border-[#27ae60] transition-colors bg-[#fcfcfc] rounded-[20px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                <span>Enterprise</span>
              </CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">For regulated institutions</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">£1,799</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Unlimited verifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Everything in Growth</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Enhanced due diligence (EDD)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Source of wealth verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Dedicated compliance support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Custom integration & SLA</span>
                </div>
              </div>
              <Link to="/enterprise-contact">
                <Button className="w-full mt-4 h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]" variant="outline" data-testid="button-enterprise-fintech">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Contact Sales</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Usage-based pricing note */}
        <div className="bg-[#f6f6f6] rounded-xl p-6 text-center w-full max-w-7xl mx-auto border border-[#e4e4e4]">
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-2">
            <strong className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Usage-based overage:</strong> £0.75 per additional KYC verification • £2.50 per KYB check
          </p>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">
            Annual contracts receive 20% discount • Volume pricing for 5,000+ verifications/month
          </p>
        </div>

        {/* Competitor comparison */}
        <div className="mt-12 bg-[#e8f5e9] rounded-xl p-8 w-full max-w-7xl mx-auto border border-[#27ae60]">
          <h3 className="text-xl font-bold text-center [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b] mb-6">
            How We Compare
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-red-500 line-through">£1,999+</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Incumbent KYC providers</div>
            </div>
            <div>
              <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">£1,249</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">TrustVerify Growth</div>
            </div>
            <div>
              <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">37% Savings</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Average customer savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-7xl mx-auto rounded-xl px-4 sm:px-6 lg:px-[110px] py-10 my-16 bg-app-primary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 w-full">
          <h2 className="text-2xl md:text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-white">
            Ready to Transform Your Financial Services Compliance?
          </h2>
          <p className="text-lg [font-family:'DM_Sans_18pt-Regular',Helvetica] text-white/90">
            Join leading banks and fintechs using TrustVerify
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/bank-onboarding-demo">
              <Button size="lg" className="h-[45px] rounded-lg bg-white text-[#003d2b] hover:bg-gray-100" data-testid="button-start-trial">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Start Free Trial</span>
              </Button>
            </Link>
            <Link to="/api-documentation">
              <Button size="lg" variant="outline" className="h-[45px] rounded-lg bg-transparent border border-white text-white hover:bg-white/90" data-testid="button-view-docs">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">View API Docs</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
