import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  ArrowRight, 
  FileSearch,
  Car,
  Home,
  Heart,
  FileCheck,
  Users,
  BarChart3
} from "lucide-react";

export default function InsuranceIndustryPage() {
  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full text-center mb-8">
          <div className="flex justify-center w-full mb-6">
            <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                Insurance
              </span>
            </Badge>
          </div>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-4">
            Claims Fraud Prevention & Policy Verification
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-8">
            Detect fraudulent claims, verify policyholder identities, and streamline 
            underwriting with AI-powered fraud detection. Reduce losses while 
            maintaining excellent customer experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/developer-portal">
              <Button 
                size="lg" 
                className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8 py-4" 
                data-testid="button-get-api"
              >
                <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Get API Access</span>
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
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">99.5%</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Fraud Detection</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">60%</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Claims Savings</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">&lt;2s</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Verification</div>
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

      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Insurance Use Cases
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-xl max-w-3xl mx-auto">
            From motor claims to health insurance, we power fraud prevention 
            across the entire insurance ecosystem.
          </p>
        </div>

        <Tabs defaultValue="claims" className="w-full" data-testid="insurance-tabs">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-gray-200 rounded-lg p-1">
              <TabsTrigger value="claims" data-testid="tab-claims">Claims Fraud</TabsTrigger>
              <TabsTrigger value="motor" data-testid="tab-motor">Motor Insurance</TabsTrigger>
              <TabsTrigger value="health" data-testid="tab-health">Health Insurance</TabsTrigger>
              <TabsTrigger value="property" data-testid="tab-property">Property Insurance</TabsTrigger>
            </TabsList>

            <TabsContent value="claims" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <FileSearch className="w-6 h-6 text-[#27ae60]" />
                    Claims Fraud Detection
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    AI-powered analysis to identify fraudulent claims patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Key Features</h4>
                      <ul className="space-y-2">
                        {[
                          "Pattern recognition across claim history",
                          "Document authenticity verification",
                          "Network analysis for organized fraud",
                          "Real-time fraud scoring",
                          "Case prioritization for investigators"
                        ].map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                            <CheckCircle2 className="w-4 h-4 text-[#27ae60] mt-0.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-[#f6f6f6] rounded-lg p-4 border border-[#e4e4e4]">
                      <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-3">Fraud Types Detected</h4>
                      <div className="space-y-2">
                        <Badge variant="outline" className="mr-2 rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Staged accidents</Badge>
                        <Badge variant="outline" className="mr-2 rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Exaggerated claims</Badge>
                        <Badge variant="outline" className="mr-2 rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Identity fraud</Badge>
                        <Badge variant="outline" className="mr-2 rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Ghost broking</Badge>
                        <Badge variant="outline" className="mr-2 rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Application fraud</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="motor" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Car className="w-6 h-6 text-[#27ae60]" />
                    Motor Insurance Verification
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Complete vehicle and driver verification solutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: "Driver Verification", desc: "License & identity checks" },
                      { title: "Vehicle History", desc: "Damage & ownership records" },
                      { title: "Claims Analysis", desc: "Accident pattern detection" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-[#f6f6f6] p-4 rounded-lg border border-[#e4e4e4]">
                        <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{item.title}</h4>
                        <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Heart className="w-6 h-6 text-[#27ae60]" />
                    Health Insurance Protection
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Medical claims verification and fraud prevention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: "Provider Verification", desc: "Medical provider authentication" },
                      { title: "Claims Audit", desc: "Billing code analysis" },
                      { title: "Member ID Check", desc: "Identity verification" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-[#f6f6f6] p-4 rounded-lg border border-[#e4e4e4]">
                        <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{item.title}</h4>
                        <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="property" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Home className="w-6 h-6 text-[#27ae60]" />
                    Property Insurance Solutions
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Property verification and damage claim assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: "Property Verification", desc: "Address & ownership checks" },
                      { title: "Damage Assessment", desc: "AI-powered damage analysis" },
                      { title: "Risk Scoring", desc: "Location-based risk evaluation" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-[#f6f6f6] p-4 rounded-lg border border-[#e4e4e4]">
                        <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{item.title}</h4>
                        <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </section>

      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Insurance API Capabilities
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          {[
            { icon: FileSearch, title: "Claims Fraud Detection", desc: "AI-powered fraud pattern analysis" },
            { icon: Users, title: "Identity Verification", desc: "Policyholder KYC checks" },
            { icon: FileCheck, title: "Document Validation", desc: "Policy & claims document verification" },
            { icon: BarChart3, title: "Risk Assessment", desc: "Underwriting risk scoring" }
          ].map((feature, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-[#27ae60] mb-2" />
                <CardTitle className="text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-start gap-[30px] w-full max-w-7xl mx-auto rounded-xl px-4 sm:px-6 lg:px-[110px] py-10 my-16 bg-app-primary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 w-full">
          <h2 className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-4">
            Ready to Reduce Claims Fraud?
          </h2>
          <p className="text-xl [font-family:'DM_Sans_18pt-Regular',Helvetica] text-white/90 mb-8">
            Join leading insurers using TrustVerify to prevent fraud and protect their business.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/developer-portal">
              <Button size="lg" className="h-[45px] rounded-lg bg-white text-[#003d2b] hover:bg-gray-100">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Get API Access</span>
              </Button>
            </Link>
            <Link to="/enterprise-contact">
              <Button size="lg" variant="outline" className="h-[45px] rounded-lg bg-transparent border border-white text-white hover:bg-white/90">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Contact Sales</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
