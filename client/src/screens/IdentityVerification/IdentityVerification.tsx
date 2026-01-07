import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Scan, UserCheck, FileText, Globe, Clock, CheckCircle, Award } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";

export function IdentityVerification() {
  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] pt-20">
        <header className="flex flex-col items-start gap-2.5 w-full">
          <div className="flex justify-center w-full mb-6">
            <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                Identity Verification
              </span>
            </Badge>
          </div>
          <h1 className="flex items-center justify-center w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl tracking-[0] leading-[normal] text-center">
            Identity Verification & KYC
          </h1>
          <p className="flex items-center justify-center w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl tracking-[0] leading-8 text-center">
            Comprehensive identity verification solutions that comply with global KYC/AML regulations 
            while providing seamless user experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full mt-4">
            <Link href="/biometric-verification">
              <Button 
                size="lg" 
                className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8 py-4" 
                data-testid="button-start-verification"
              >
                <span className="font-semibold text-white text-sm">Start Verification</span>
              </Button>
            </Link>
            <Link href="/regulatory-compliance">
              <Button 
                variant="outline" 
                size="lg" 
                className="relative h-[45px] rounded-lg border-none before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-lg before:[background:linear-gradient(118deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] hover:bg-gray-50 px-8 py-4" 
                data-testid="button-view-compliance"
              >
                <span className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] bg-clip-text text-transparent font-semibold text-sm">View Compliance</span>
              </Button>
            </Link>
          </div>
        </header>
      </section>

      {/* Key Features */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-16">
        <div className="w-full">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
              Complete Identity Verification Suite
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg">
              Multi-layered verification process ensuring compliance and security
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <Scan className="h-10 w-10 text-[#27ae60] mb-4" />
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Document Verification</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Advanced OCR and AI-powered document analysis for government-issued IDs and documents
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                  <li>• Passport & driver's license scanning</li>
                  <li>• Security feature detection</li>
                  <li>• Document tampering analysis</li>
                  <li>• Global document support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <UserCheck className="h-10 w-10 text-[#27ae60] mb-4" />
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Biometric Matching</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Advanced facial recognition and liveness detection to prevent spoofing attempts
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                  <li>• Liveness detection</li>
                  <li>• Face-to-photo matching</li>
                  <li>• Anti-spoofing technology</li>
                  <li>• Real-time verification</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <Globe className="h-10 w-10 text-[#27ae60] mb-4" />
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Global Compliance</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Meet KYC/AML requirements across 195+ countries with automated regulatory compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                  <li>• GDPR, CCPA compliance</li>
                  <li>• AML screening</li>
                  <li>• PEP & sanctions checking</li>
                  <li>• Regulatory reporting</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <Clock className="h-10 w-10 text-[#27ae60] mb-4" />
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Instant Verification</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Complete identity checks in under 60 seconds with automated decision-making
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                  <li>• Sub-minute processing</li>
                  <li>• Real-time API responses</li>
                  <li>• Automated approvals</li>
                  <li>• Exception handling</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <FileText className="h-10 w-10 text-[#27ae60] mb-4" />
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Risk Assessment</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Comprehensive risk scoring based on multiple data points and behavioral analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                  <li>• Multi-factor risk scoring</li>
                  <li>• Behavioral analysis</li>
                  <li>• Database cross-referencing</li>
                  <li>• Continuous monitoring</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <Award className="h-10 w-10 text-[#27ae60] mb-4" />
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Trust Scoring</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Dynamic trust scores that evolve based on user behavior and transaction history
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                  <li>• Dynamic scoring algorithms</li>
                  <li>• Historical pattern analysis</li>
                  <li>• Peer comparison metrics</li>
                  <li>• Trust level categorization</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="w-full max-w-[1300px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
              Simple Three-Step Verification Process
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg">
              Seamless user experience with enterprise-grade security
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#e8f5e9] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Scan className="h-10 w-10 text-[#27ae60]" />
              </div>
              <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] mb-4">1. Document Upload</h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">
                Users upload government-issued ID documents through our secure, encrypted interface
              </p>
              <div className="bg-[#f6f6f6] p-4 rounded-[10px] text-left">
                <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-sm mb-2 text-[#003d2b]">Supported Documents:</h4>
                <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] space-y-1">
                  <li>• Passport</li>
                  <li>• Driver's License</li>
                  <li>• National ID Card</li>
                  <li>• Residence Permit</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-[#e8f5e9] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCheck className="h-10 w-10 text-[#27ae60]" />
              </div>
              <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] mb-4">2. Biometric Verification</h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">
                Advanced facial recognition matches the user to their document photo with liveness detection
              </p>
              <div className="bg-[#f6f6f6] p-4 rounded-[10px] text-left">
                <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-sm mb-2 text-[#003d2b]">Security Features:</h4>
                <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] space-y-1">
                  <li>• Liveness Detection</li>
                  <li>• Face Matching</li>
                  <li>• Anti-Spoofing</li>
                  <li>• Quality Assessment</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-[#e8f5e9] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-[#27ae60]" />
              </div>
              <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] mb-4">3. Instant Results</h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">
                Receive verification results within seconds, with detailed risk assessment and compliance status
              </p>
              <div className="bg-[#f6f6f6] p-4 rounded-[10px] text-left">
                <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-sm mb-2 text-[#003d2b]">Verification Outcomes:</h4>
                <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] space-y-1">
                  <li>• Verified</li>
                  <li>• Under Review</li>
                  <li>• Requires Additional Info</li>
                  <li>• Rejected</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white">
        <div className="w-full max-w-[1300px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white text-3xl mb-4">
              Global Regulatory Compliance
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-white/90 text-xl">
              Meet the highest standards for KYC/AML compliance worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-bold text-white mb-2">Global</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-lg font-medium">Platform Ready</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-white/80 mt-1">Worldwide coverage</div>
            </div>
            
            <div className="text-center">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-bold text-white mb-2">Secure</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-lg font-medium">Enterprise-Grade</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-white/80 mt-1">Advanced compliance</div>
            </div>
            
            <div className="text-center">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-bold text-white mb-2">Fast</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-lg font-medium">Quick Verification</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-white/80 mt-1">Rapid processing</div>
            </div>
            
            <div className="text-center">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-bold text-white mb-2">24/7</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-lg font-medium">Always Available</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-white/80 mt-1">Continuous service</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] pt-16">
        <div className="w-full max-w-[1300px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
              Industry Applications
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg">
              Trusted across multiple industries for critical identity verification needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#436cc8]">Financial Services</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">
                  Meet stringent banking regulations with comprehensive KYC processes for account opening and transactions.
                </p>
                <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] space-y-1">
                  <li>• Account opening verification</li>
                  <li>• Transaction monitoring</li>
                  <li>• AML compliance reporting</li>
                  <li>• Risk-based authentication</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#436cc8]">E-commerce & Marketplaces</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">
                  Verify sellers and high-value buyers to reduce fraud and build marketplace trust.
                </p>
                <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] space-y-1">
                  <li>• Seller verification programs</li>
                  <li>• High-value buyer checks</li>
                  <li>• Age verification</li>
                  <li>• Geographic restrictions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#436cc8]">Crypto & Digital Assets</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">
                  Comply with evolving cryptocurrency regulations and exchange requirements globally.
                </p>
                <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] space-y-1">
                  <li>• Exchange onboarding</li>
                  <li>• Wallet verification</li>
                  <li>• Transaction limits</li>
                  <li>• Regulatory reporting</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16">
        <div className="p-6 rounded-2xl max-w-[1300px] mx-auto text-center text-white w-full bg-app-primary">
          <Shield className="h-16 w-16 text-[#27ae60] mx-auto mb-6" />
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white text-4xl mb-6">
            Start Verifying Identities Today
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-white/80 text-xl mb-8">
            Join leading companies that trust TrustVerify for secure, compliant identity verification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/biometric-verification">
              <Button 
                size="lg" 
                className="rounded-lg bg-white text-app-primary hover:bg-white/80 px-8 py-4" 
                data-testid="button-get-started"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white bg-transparent hover:text-[#003d2b] px-8 py-4" 
                data-testid="button-schedule-demo"
              >
                <span className="font-semibold text-sm">Schedule Demo</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}