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
  Users,
  Lock,
  Globe,
  FileCheck,
  Eye,
  UserX
} from "lucide-react";

export default function GamingIndustryPage() {
  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full text-center mb-8">
          <div className="flex justify-center w-full mb-6">
            <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                iGaming & Gambling
              </span>
            </Badge>
          </div>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-4">
            Responsible Gaming & Regulatory Compliance
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-8">
            Meet UK Gambling Commission, MGA, and global gaming regulations with 
            comprehensive age verification, AML compliance, and responsible gambling 
            tools. Protect players while maintaining licence compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/biometric-verification">
              <Button 
                size="lg" 
                className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8 py-4" 
                data-testid="button-try-demo"
              >
                <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Try Age Verification</span>
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
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">UKGC</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Compliant</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">MGA</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Approved</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">18+</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Age Verified</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">GAMSTOP</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Integrated</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases Tabs */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Gaming Compliance Solutions
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-xl max-w-3xl mx-auto">
            From age verification to responsible gambling, we help gaming 
            operators maintain compliance and protect players.
          </p>
        </div>

        <Tabs defaultValue="age" className="w-full" data-testid="gaming-tabs">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-gray-200 rounded-lg p-1">
              <TabsTrigger value="age" data-testid="tab-age">Age Verification</TabsTrigger>
              <TabsTrigger value="kyc" data-testid="tab-kyc">Player KYC</TabsTrigger>
              <TabsTrigger value="aml" data-testid="tab-aml">AML Compliance</TabsTrigger>
              <TabsTrigger value="responsible" data-testid="tab-responsible">Responsible Gaming</TabsTrigger>
            </TabsList>

            <TabsContent value="age" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <UserX className="w-6 h-6 text-[#27ae60]" />
                    Age Verification
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    UKGC-compliant age and identity verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Document-Based Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Passport, driving licence, national ID</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Database Checks</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Electoral roll and credit reference data</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Biometric Age Estimation</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">AI-powered facial age analysis</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">72-Hour Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Meet UKGC mandatory timeframes</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Under-Age Blocking</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Immediate account restriction</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="kyc" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Users className="w-6 h-6 text-[#27ae60]" />
                    Player KYC
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Enhanced due diligence for high-value players
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">ID Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Document + liveness checks</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Address Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Proof of address document checks</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Source of Funds</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">SOF verification for high rollers</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Enhanced Due Diligence</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Risk-based verification tiers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aml" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Shield className="w-6 h-6 text-[#27ae60]" />
                    AML Compliance
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Anti-money laundering for gaming operators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">PEP Screening</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Screen against global PEP databases</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Sanctions Lists</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Real-time sanctions screening</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Transaction Monitoring</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Suspicious betting pattern detection</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">SAR Filing</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Automated suspicious activity reports</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="responsible" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Eye className="w-6 h-6 text-[#27ae60]" />
                    Responsible Gaming
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Protect vulnerable players and maintain licence compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">GAMSTOP Integration</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">National self-exclusion scheme checks</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Affordability Checks</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Open Banking spending analysis</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Behaviour Monitoring</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Identify problem gambling markers</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Intervention Triggers</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Automated player protection actions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </section>

      {/* Regulations */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Gaming Regulatory Compliance
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Shield className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-1">UK Gambling Commission</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">LCCP compliant</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Globe className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-1">Malta Gaming Authority</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">MGA approved</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Lock className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-1">GAMSTOP</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Self-exclusion integrated</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <FileCheck className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-1">6AMLD</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">AML Directive ready</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-7xl mx-auto rounded-xl px-4 sm:px-6 lg:px-[110px] py-10 my-16 bg-app-primary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 w-full">
          <h2 className="text-2xl md:text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-white">
            Ready to Ensure Gaming Compliance?
          </h2>
          <p className="text-lg [font-family:'DM_Sans_18pt-Regular',Helvetica] text-white/90">
            Protect players and your licence with TrustVerify
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/biometric-verification">
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
