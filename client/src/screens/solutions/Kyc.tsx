import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Fingerprint,
  FileCheck,
  Clock,
  Lock,
  BarChart3
} from "lucide-react";

export default function KYCSolutionPage() {
  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full text-center mb-8">
          <div className="flex justify-center w-full mb-6">
            <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                KYC Solution
              </span>
            </Badge>
          </div>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-4">
            Know Your Customer Verification
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-8">
            Comprehensive identity verification with real-time document checks, 
            biometric authentication, and global watchlist screening. Onboard customers 
            in seconds while maintaining regulatory compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/biometric-verification">
              <Button 
                size="lg" 
                className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8 py-4" 
                data-testid="button-try-demo"
              >
                <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Try Live Demo</span>
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
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">99.2%</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Accuracy Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">&lt;10s</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Verification Time</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">195+</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Countries Covered</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">10K+</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Document Types</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-16">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Complete KYC Verification Suite
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg max-w-3xl mx-auto">
            From document verification to biometric authentication, our KYC solution 
            covers every aspect of customer identity verification.
          </p>
        </div>

          <Tabs defaultValue="document" className="w-full" data-testid="kyc-features-tabs">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-gray-200 rounded-lg p-1">
              <TabsTrigger value="document" data-testid="tab-document">Document Verification</TabsTrigger>
              <TabsTrigger value="biometric" data-testid="tab-biometric">Biometric Auth</TabsTrigger>
              <TabsTrigger value="screening" data-testid="tab-screening">Watchlist Screening</TabsTrigger>
              <TabsTrigger value="workflow" data-testid="tab-workflow">Custom Workflows</TabsTrigger>
            </TabsList>

            <TabsContent value="document" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <FileCheck className="w-6 h-6 text-[#27ae60]" />
                    Document Verification
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    AI-powered document analysis with fraud detection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Passport Verification</h4>
                          <p className="text-sm text-gray-600">MRZ extraction, photo matching, and authenticity checks</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Driver's License</h4>
                          <p className="text-sm text-gray-600">Support for 195+ countries with barcode validation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">National ID Cards</h4>
                          <p className="text-sm text-gray-600">Comprehensive global ID card verification</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Proof of Address</h4>
                          <p className="text-sm text-gray-600">Utility bills, bank statements, and more</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Fraud Detection</h4>
                          <p className="text-sm text-gray-600">AI detects tampering, forgery, and synthetic documents</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Data Extraction</h4>
                          <p className="text-sm text-gray-600">Automatic OCR with 99.2% accuracy</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="biometric" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Fingerprint className="w-6 h-6 text-[#27ae60]" />
                    Biometric Authentication
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Advanced liveness detection and facial recognition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Liveness Detection</h4>
                          <p className="text-sm text-gray-600">Passive and active liveness checks to prevent spoofing</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Face Matching</h4>
                          <p className="text-sm text-gray-600">Compare selfie to document photo with high accuracy</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Anti-Spoofing</h4>
                          <p className="text-sm text-gray-600">Detect masks, photos, and deepfake attempts</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">3D Face Mapping</h4>
                          <p className="text-sm text-gray-600">Advanced depth analysis for enhanced security</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Voice Biometrics</h4>
                          <p className="text-sm text-gray-600">Optional voice verification layer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="screening" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Shield className="w-6 h-6 text-[#27ae60]" />
                    Watchlist Screening
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Global sanctions and PEP screening in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Sanctions Lists</h4>
                          <p className="text-sm text-gray-600">OFAC, UN, EU, UK, and 200+ global sanctions lists</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">PEP Screening</h4>
                          <p className="text-sm text-gray-600">Politically Exposed Persons database coverage</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Adverse Media</h4>
                          <p className="text-sm text-gray-600">Continuous monitoring of negative news</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Criminal Records</h4>
                          <p className="text-sm text-gray-600">Global criminal database checks</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Ongoing Monitoring</h4>
                          <p className="text-sm text-gray-600">Continuous screening with real-time alerts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Zap className="w-6 h-6 text-[#27ae60]" />
                    Custom Workflows
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Build verification flows tailored to your needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Visual Workflow Builder</h4>
                          <p className="text-sm text-gray-600">Drag-and-drop workflow creation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Risk-Based Rules</h4>
                          <p className="text-sm text-gray-600">Conditional logic based on risk scores</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Auto-Approval</h4>
                          <p className="text-sm text-gray-600">Automatic approvals for low-risk verifications</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Manual Review Queue</h4>
                          <p className="text-sm text-gray-600">Efficient queue for edge cases</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold">Webhook Integration</h4>
                          <p className="text-sm text-gray-600">Real-time notifications to your systems</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </section>

      {/* Integration Section */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Easy Integration
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg">
            Get started in minutes with our developer-friendly APIs
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Clock className="w-12 h-12 text-[#27ae60] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">Quick Setup</h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Integrate in under 30 minutes with our SDKs</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Lock className="w-12 h-12 text-[#27ae60] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">Enterprise Security</h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">SOC 2, GDPR, and ISO 27001 compliant</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <BarChart3 className="w-12 h-12 text-[#27ae60] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">Real-Time Analytics</h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Dashboard with verification insights</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-7xl mx-auto rounded-xl px-4 sm:px-6 lg:px-[110px] py-10 my-16 bg-app-primary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 w-full">
          <h2 className="text-2xl md:text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-white">
            Ready to Streamline Your KYC Process?
          </h2>
          <p className="text-lg text-white/90 [font-family:'DM_Sans_18pt-Regular',Helvetica]">
            Start verifying customers in minutes with our comprehensive KYC solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/biometric-verification">
              <Button 
                size="lg" 
                className="h-[45px] rounded-lg bg-white text-[#003d2b] hover:bg-white/80 font-semibold px-8" 
                data-testid="button-start-verification"
              >
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Start Free Trial</span>
              </Button>
            </Link>
            <Link to="/api-documentation">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white bg-transparent hover:text-[#003d2b] px-8 h-[45px]" 
                data-testid="button-view-docs"
              >
                <span className="font-semibold text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">View API Docs</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
