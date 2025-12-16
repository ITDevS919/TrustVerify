import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Users, Briefcase, ArrowRight, User, FileText, Shield, CheckCheck } from "lucide-react";

export default function OnboardingDemo() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"hr" | "solicitor">("hr");

  const hrOnboarding = [
    { step: 1, title: "Identity Verification", description: "Verify employee identity with passport/ID", icon: User, color: "bg-blue-100 text-blue-600" },
    { step: 2, title: "Background Check", description: "Comprehensive criminal record screening", icon: Shield, color: "bg-purple-100 text-purple-600" },
    { step: 3, title: "Document Review", description: "Upload and verify employment documents", icon: FileText, color: "bg-green-100 text-green-600" },
    { step: 4, title: "Verification Complete", description: "Receive KYC certification", icon: CheckCheck, color: "bg-emerald-100 text-emerald-600" },
  ];

  const solicitorOnboarding = [
    { step: 1, title: "Legal Credentials", description: "Verify law license and regulatory status", icon: Briefcase, color: "bg-orange-100 text-orange-600" },
    { step: 2, title: "Compliance Check", description: "Sanctions & adverse media screening", icon: Shield, color: "bg-red-100 text-red-600" },
    { step: 3, title: "Professional Verification", description: "Bar association and disciplinary records", icon: FileText, color: "bg-indigo-100 text-indigo-600" },
    { step: 4, title: "Certification Issued", description: "Legal compliance certificate awarded", icon: CheckCheck, color: "bg-blue-100 text-blue-600" },
  ];

  const currentFlow = selectedRole === "hr" ? hrOnboarding : solicitorOnboarding;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-[1270px] mx-auto px-6 md:px-10 py-24">
        <div className="mb-12 text-center">
          <Badge className="h-[30px] bg-[#003d2b1a] hover:bg-[#003d2b1a] rounded-[800px] px-4 mb-6 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm leading-[14px] tracking-[0]">
              ONBOARDING DEMO
            </span>
          </Badge>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px] mb-4">
            Role-Based Onboarding Flows
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg max-w-3xl mx-auto">
            Streamlined verification processes for HR and Legal professionals with API-generated workflows
          </p>
        </div>

        {/* Role Selector */}
        <Tabs value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="hr" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              HR Onboarding
            </TabsTrigger>
            <TabsTrigger value="solicitor" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Solicitor Verification
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Workflow Visualization */}
        <Card className="mb-8 border-2 border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <CardHeader>
            <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center gap-2">
              {selectedRole === "hr" ? (
                <>
                  <Users className="h-6 w-6 text-[#0b3a78]" />
                  Employee Onboarding Process
                </>
              ) : (
                <>
                  <Briefcase className="h-6 w-6 text-[#0b3a78]" />
                  Legal Professional Verification
                </>
              )}
            </CardTitle>
            <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
              {selectedRole === "hr"
                ? "Complete KYC and background verification for new hires"
                : "Comprehensive compliance and credential verification for legal professionals"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Timeline */}
              <div className="relative">
                <div className="flex justify-between mb-8">
                  {currentFlow.map((item, idx) => (
                    <div key={item.step} className="flex-1">
                      <div className={`flex flex-col items-center`}>
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${item.color} flex-shrink-0`}
                        >
                          <item.icon className="h-8 w-8" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-center text-sm">{item.title}</h3>
                        <p className="text-xs text-gray-600 text-center mt-1">{item.description}</p>
                      </div>
                      {idx < currentFlow.length - 1 && (
                        <div className="absolute top-8 left-[50%] w-[calc(100%-4rem)] h-1 bg-gradient-to-r from-gray-300 to-gray-300 transform translate-y-0 -z-10"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t">
                {currentFlow.map((item) => (
                  <Card key={item.step} className="bg-gradient-to-br from-gray-50 to-gray-100">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge className="mt-1">{item.step}</Badge>
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-[#f4f4f4] py-16 px-6 rounded-[20px]">
          <Card className="border-2 border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardHeader>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">API-Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                Create custom onboarding flows via our developer API without any coding
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardHeader>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Role-Specific</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                Tailored workflows for HR managers, recruiters, and legal professionals
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardHeader>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Production-Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                Full audit trails, compliance reporting, and certification generation
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Button
            onClick={() => navigate("/developer-portal")}
            size="lg"
            className="bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px] min-h-[46px]"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">Create Custom Onboarding in Developer Portal</span>
          </Button>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
            Use the API to generate onboarding templates for your team
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
