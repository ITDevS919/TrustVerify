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
  FileText,
  Eye,
  Clock,
  Lock,
  Database,
  Zap
} from "lucide-react";

export default function AMLSolutionPage() {
  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full text-center mb-8">
          <div className="flex justify-center w-full mb-6">
            <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                AML Solution
              </span>
            </Badge>
          </div>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-4">
            Anti-Money Laundering Compliance
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-8">
            Comprehensive AML screening with real-time sanctions checks, 
            PEP identification, and transaction monitoring. Stay compliant 
            with global regulations while reducing false positives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/aml-screening">
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
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">200+</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Sanctions Lists</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">10M+</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">PEP Records</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">&lt;100ms</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Response Time</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">95%</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">False Positive Reduction</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-16">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Complete AML Compliance Suite
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg max-w-3xl mx-auto">
            From sanctions screening to transaction monitoring, our AML solution 
            provides comprehensive coverage for regulatory compliance.
          </p>
        </div>

          <Tabs defaultValue="sanctions" className="w-full" data-testid="aml-features-tabs">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-gray-200 rounded-lg p-1">
              <TabsTrigger value="sanctions" data-testid="tab-sanctions">Sanctions Screening</TabsTrigger>
              <TabsTrigger value="pep" data-testid="tab-pep">PEP Identification</TabsTrigger>
              <TabsTrigger value="transaction" data-testid="tab-transaction">Transaction Monitoring</TabsTrigger>
              <TabsTrigger value="reporting" data-testid="tab-reporting">Regulatory Reporting</TabsTrigger>
            </TabsList>

            <TabsContent value="sanctions" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Shield className="w-6 h-6 text-[#27ae60]" />
                    Sanctions Screening
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Real-time screening against global sanctions lists
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Global Coverage</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">OFAC, UN, EU, UK, and 200+ other sanctions lists</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Real-time Updates</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Sanctions lists updated within minutes of publication</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Fuzzy Matching</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Advanced algorithms to catch name variations</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Entity Resolution</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Accurate matching for individuals and entities</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Batch Screening</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Screen large volumes with bulk API</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Audit Trail</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Complete screening history for compliance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pep" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Eye className="w-6 h-6 text-[#27ae60]" />
                    PEP Identification
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Identify Politically Exposed Persons and their associates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">10M+ PEP Records</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Comprehensive global PEP database</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">RCA Coverage</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Relatives and Close Associates identification</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Risk Classification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Categorize PEPs by risk level</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Position History</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Track current and former positions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Enhanced Due Diligence</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Detailed profiles for high-risk matches</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transaction" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Database className="w-6 h-6 text-[#27ae60]" />
                    Transaction Monitoring
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    AI-powered detection of suspicious transaction patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Pattern Detection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">ML algorithms identify suspicious patterns</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Real-time Alerts</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Instant notifications for suspicious activity</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Custom Rules</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Define custom detection scenarios</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Network Analysis</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Detect complex money laundering networks</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Case Management</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Investigate and resolve alerts efficiently</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reporting" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <FileText className="w-6 h-6 text-[#27ae60]" />
                    Regulatory Reporting
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Automated compliance reporting for regulators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">SAR Generation</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Automated Suspicious Activity Reports</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">CTR Filing</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Currency Transaction Report automation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Regulatory Dashboard</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Real-time compliance status overview</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Audit-Ready Reports</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Complete documentation for examinations</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Multi-Jurisdiction</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Support for UK, EU, US, and global requirements</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </section>

      {/* Benefits Section */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Why Choose Our AML Solution?
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Zap className="w-12 h-12 text-[#27ae60] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">95% False Positive Reduction</h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">AI-powered matching reduces alert fatigue</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Clock className="w-12 h-12 text-[#27ae60] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">Sub-100ms Response</h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Real-time screening for frictionless onboarding</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Lock className="w-12 h-12 text-[#27ae60] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">Full Compliance</h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Meet FCA, FinCEN, and global AML requirements</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-7xl mx-auto rounded-xl px-4 sm:px-6 lg:px-[110px] py-10 my-16 bg-app-primary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 w-full ">
          <h2 className="text-2xl md:text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-white">
            Ready to Strengthen Your AML Compliance?
          </h2>
          <p className="text-lg text-white/90 [font-family:'DM_Sans_18pt-Regular',Helvetica]">
            Start screening against global sanctions and PEP lists today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/aml-screening">
              <Button 
                size="lg" 
                className="h-[45px] rounded-lg bg-white text-[#003d2b] hover:bg-white/80 font-semibold px-8" 
                data-testid="button-start-screening"
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
