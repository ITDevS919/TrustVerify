import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Book, 
  Key, 
  Shield, 
  Webhook, 
  Package,
  AlertCircle,
  Gauge,
  Beaker,
  FileText,
  ArrowRight,
  CheckCircle,
  Copy,
  Zap,
  Users,
  CreditCard,
  FileSearch,
  Activity,
  Server,
  Terminal,
  Bell,
  Search,
  PlayCircle
} from "lucide-react";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ApiDocumentationPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const documentationSections = [
    { id: "introduction", label: "Introduction", icon: Book },
    { id: "getting-started", label: "Getting Started", icon: Zap },
    { id: "authentication", label: "Authentication", icon: Key },
    { id: "environments", label: "Environments", icon: Server },
    { id: "core-concepts", label: "Core Concepts", icon: FileSearch },
    { id: "identity-verification", label: "Identity Verification API", icon: Users },
    { id: "fraud-detection", label: "Fraud Detection API", icon: Shield },
    { id: "transactions", label: "Transactions API", icon: CreditCard },
    { id: "aml-screening", label: "AML Screening API", icon: Search },
    { id: "webhooks", label: "Webhooks", icon: Webhook },
    { id: "sdks", label: "SDKs & Libraries", icon: Package },
    { id: "error-handling", label: "Error Handling", icon: AlertCircle },
    { id: "rate-limits", label: "Rate Limits", icon: Gauge },
    { id: "testing", label: "Testing Guide", icon: Beaker },
    { id: "changelog", label: "Changelog", icon: FileText },
  ];

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full min-w-full lg:min-w-[1920px] flex flex-col">
      <Header />
      
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-20">
        <header className="flex flex-col items-start gap-2.5 w-full">
          <h1 className="flex items-center justify-start w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl tracking-[0] leading-[normal] text-center" data-testid="page-title">
            API Documentation
          </h1>
          <p className="flex items-center justify-start w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl tracking-[0] leading-8 text-center">
            Complete reference for integrating TrustVerify's identity verification, fraud detection, 
            and secure transaction APIs into your application.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
          <aside className="w-full lg:w-[330px]">
            <Card className="bg-white rounded-[14px] border-neutral-200 shadow-[0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_1px_3px_#0000001a,0px_1px_2px_-1px_#0000001a] border-[0.8px] sticky top-8">
              <CardHeader className="pb-3 px-6 pt-6">
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">Documentation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-220px)]">
                  <nav className="space-y-1 px-4 pb-4">
                    {documentationSections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-[10px] transition-colors ${
                            activeSection === section.id
                              ? "bg-[#27ae60] text-white"
                              : "text-[#808080] hover:bg-gray-50 hover:text-[#003d2b]"
                          }`}
                          data-testid={`nav-${section.id}`}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate [font-family:'DM_Sans_18pt-Regular',Helvetica]">{section.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </ScrollArea>
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1 space-y-6">
            <div className="lg:hidden mb-6">
              <Card className="bg-white rounded-[14px] border border-[#e4e4e4]">
                <CardContent className="p-3">
                  <ScrollArea className="w-full">
                    <div className="flex gap-2 pb-2">
                      {documentationSections.slice(0, 6).map((section) => (
                        <Button
                          key={section.id}
                          variant={activeSection === section.id ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setActiveSection(section.id)}
                          className={`whitespace-nowrap ${activeSection === section.id ? "bg-[#27ae60] text-white" : ""}`}
                          data-testid={`mobile-nav-${section.id}`}
                        >
                          {section.label}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3 mb-6">
              <Link href="/api-playground">
                <Button 
                  variant="outline"
                  className="relative h-[45px] rounded-lg border-none before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-lg before:[background:linear-gradient(118deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] hover:bg-gray-50"
                  data-testid="button-playground"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  <span className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] bg-clip-text text-transparent font-semibold text-sm">
                    API Playground
                  </span>
                </Button>
              </Link>
              <Link href="/developer-portal">
                <Button 
                  className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
                  data-testid="button-get-api-key"
                >
                  <Key className="h-4 w-4 mr-2" />
                  <span className="font-semibold text-white text-sm">Get API Key</span>
                </Button>
              </Link>
            </div>

            {activeSection === "introduction" && (
              <section className="space-y-6" data-testid="section-introduction">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <Book className="h-5 w-5 text-[#27ae60]" />
                      Welcome to TrustVerify API
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      Enterprise-grade identity verification, fraud prevention, and secure transaction APIs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base leading-6">
                      TrustVerify provides a comprehensive suite of REST APIs designed to help businesses 
                      verify identities, detect fraud, and secure transactions. Our APIs are used by 
                      leading fintech companies, e-commerce platforms, and financial institutions worldwide.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="border border-[#e4e4e4] rounded-[10px] p-4 bg-white">
                        <Users className="h-8 w-8 text-[#436cc8] mb-2" />
                        <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-1">Identity Verification</h4>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                          Verify identities with document scanning, facial recognition, and liveness detection
                        </p>
                      </div>
                      <div className="border border-[#e4e4e4] rounded-[10px] p-4 bg-white">
                        <Shield className="h-8 w-8 text-[#27ae60] mb-2" />
                        <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-1">Fraud Detection</h4>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                          AI-powered fraud scoring with real-time device fingerprinting and behavioral analysis
                        </p>
                      </div>
                      <div className="border border-[#e4e4e4] rounded-[10px] p-4 bg-white">
                        <CreditCard className="h-8 w-8 text-[#436cc8] mb-2" />
                        <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-1">Secure Transactions</h4>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                          Escrow-protected transactions with built-in dispute resolution
                        </p>
                      </div>
                      <div className="border border-[#e4e4e4] rounded-[10px] p-4 bg-white">
                        <Search className="h-8 w-8 text-[#27ae60] mb-2" />
                        <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-1">AML Screening</h4>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                          Sanctions, PEP, and watchlist screening with global coverage
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#121728] text-white rounded-[10px] p-6">
                      <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold mb-4">Quick Start</h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                          <div>
                            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">Get your API key</p>
                            <p className="text-gray-400 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">Create an account and generate your API credentials</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                          <div>
                            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">Make your first API call</p>
                            <p className="text-gray-400 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">Test with sandbox environment before going live</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                          <div>
                            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">Set up webhooks</p>
                            <p className="text-gray-400 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">Receive real-time notifications for verification events</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                          <div>
                            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">Go live</p>
                            <p className="text-gray-400 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">Switch to production and start verifying real users</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeSection === "getting-started" && (
              <section className="space-y-6" data-testid="section-getting-started">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <Zap className="h-5 w-5 text-[#27ae60]" />
                      Getting Started
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      Complete this guide in under 10 minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Prerequisites</h3>
                      <ul className="list-disc list-inside space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                        <li>A TrustVerify account with API access enabled</li>
                        <li>API key (sandbox for testing, production for live traffic)</li>
                        <li>Basic knowledge of REST APIs and JSON</li>
                        <li>HTTPS-capable server for webhook endpoints</li>
                      </ul>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Step 1: Create Your Account</h3>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                        Sign up for a TrustVerify developer account to access the API dashboard and generate credentials.
                      </p>
                      <Link href="/developer-portal">
                        <Button 
                          className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
                          data-testid="button-create-account"
                        >
                          <span className="font-semibold text-white text-sm">Create Developer Account</span>
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Step 2: Generate API Keys</h3>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                        Navigate to the Developer Portal and create your first API key. You'll receive:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border border-[#e4e4e4] rounded-[10px] p-4 bg-white">
                          <Badge className="mb-2 bg-[#27ae60]">Sandbox</Badge>
                          <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-1">Test API Key</p>
                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                            For development and testing. No real transactions processed.
                          </p>
                        </div>
                        <div className="border border-[#e4e4e4] rounded-[10px] p-4 bg-white">
                          <Badge className="mb-2 bg-[#436cc8]">Production</Badge>
                          <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-1">Live API Key</p>
                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                            For production use. Real verifications and charges apply.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Step 3: Make Your First API Call</h3>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base mb-4">
                        Test your integration by creating an applicant and starting a verification:
                      </p>
                      
                      <div className="bg-[#121728] rounded-[10px] overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1f35]">
                          <span className="text-sm text-gray-400 [font-family:'DM_Sans_18pt-Regular',Helvetica]">Create Applicant</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(`curl -X POST https://sandbox-api.trustverify.io/v1/applicants \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "first_name": "John",
    "last_name": "Smith",
    "email": "john.smith@example.com",
    "external_id": "user_12345"
  }'`, "create-applicant")}
                            className="text-gray-400 hover:text-white"
                            data-testid="button-copy-create-applicant"
                          >
                            {copiedCode === "create-applicant" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <pre className="p-4 text-sm text-[#27ae60] overflow-x-auto [font-family:'DM_Sans_18pt-Regular',Helvetica]">
{`curl -X POST https://sandbox-api.trustverify.io/v1/applicants \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "first_name": "John",
    "last_name": "Smith",
    "email": "john.smith@example.com",
    "external_id": "user_12345"
  }'`}
                        </pre>
                      </div>

                      <div className="bg-[#121728] rounded-[10px] overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1f35]">
                          <span className="text-sm text-gray-400 [font-family:'DM_Sans_18pt-Regular',Helvetica]">Response</span>
                        </div>
                        <pre className="p-4 text-sm text-[#436cc8] overflow-x-auto [font-family:'DM_Sans_18pt-Regular',Helvetica]">
{`{
  "id": "apr_2xK8nM3pQw7yL4vR",
  "object": "applicant",
  "first_name": "John",
  "last_name": "Smith",
  "email": "john.smith@example.com",
  "external_id": "user_12345",
  "status": "pending",
  "created_at": "2025-12-19T10:30:00Z"
}`}
                        </pre>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Step 4: Start a Verification</h3>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                        Create a verification session for your applicant:
                      </p>
                      
                      <div className="bg-[#121728] rounded-[10px] overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1f35]">
                          <span className="text-sm text-gray-400 [font-family:'DM_Sans_18pt-Regular',Helvetica]">Start Verification</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(`curl -X POST https://sandbox-api.trustverify.io/v1/verifications \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "applicant_id": "apr_2xK8nM3pQw7yL4vR",
    "type": "identity",
    "level": "basic",
    "redirect_url": "https://yoursite.com/verification-complete"
  }'`, "start-verification")}
                            className="text-gray-400 hover:text-white"
                            data-testid="button-copy-start-verification"
                          >
                            {copiedCode === "start-verification" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <pre className="p-4 text-sm text-[#27ae60] overflow-x-auto [font-family:'DM_Sans_18pt-Regular',Helvetica]">
{`curl -X POST https://sandbox-api.trustverify.io/v1/verifications \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "applicant_id": "apr_2xK8nM3pQw7yL4vR",
    "type": "identity",
    "level": "basic",
    "redirect_url": "https://yoursite.com/verification-complete"
  }'`}
                        </pre>
                      </div>

                      <div className="bg-[#121728] rounded-[10px] overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1f35]">
                          <span className="text-sm text-gray-400 [font-family:'DM_Sans_18pt-Regular',Helvetica]">Response</span>
                        </div>
                        <pre className="p-4 text-sm text-[#436cc8] overflow-x-auto [font-family:'DM_Sans_18pt-Regular',Helvetica]">
{`{
  "id": "vrf_9kL2mN4pQr8sT5uV",
  "object": "verification",
  "applicant_id": "apr_2xK8nM3pQw7yL4vR",
  "type": "identity",
  "level": "basic",
  "status": "pending",
  "verification_url": "https://verify.trustverify.io/v/9kL2mN4pQr8sT5uV",
  "expires_at": "2025-12-20T10:30:00Z",
  "created_at": "2025-12-19T10:30:00Z"
}`}
                        </pre>
                      </div>

                      <div className="bg-[#e8f5e9] border border-[#27ae60] rounded-[10px] p-4">
                        <p className="text-[#003d2b] text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                          <strong className="[font-family:'Suisse_Intl-SemiBold',Helvetica]">Note:</strong> The <code className="bg-white px-1 rounded text-[#27ae60]">verification_url</code> should 
                          be shared with your user to complete the verification process. They can open this URL on any device.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeSection === "authentication" && (
              <section className="space-y-6" data-testid="section-authentication">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <Key className="h-5 w-5 text-[#27ae60]" />
                      Authentication
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      Secure your API requests with bearer token authentication
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Bearer Token Authentication</h3>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                        All API requests must include your API key in the Authorization header using the Bearer scheme:
                      </p>
                      
                      <div className="bg-[#121728] rounded-[10px] p-4">
                        <pre className="text-sm text-[#27ae60] [font-family:'DM_Sans_18pt-Regular',Helvetica]">
{`Authorization: Bearer YOUR_API_KEY`}
                        </pre>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">API Key Types</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border border-[#e4e4e4] rounded-[10px] p-4 bg-white">
                          <div className="flex items-center gap-2 mb-2">
                            <Beaker className="h-5 w-5 text-[#27ae60]" />
                            <Badge className="bg-[#27ae60]">Sandbox</Badge>
                          </div>
                          <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-1">Test API Key</p>
                          <code className="text-xs bg-[#f6f6f6] px-2 py-1 rounded block mb-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                            tvsk_sandbox_xxxxxxxx
                          </code>
                          <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] space-y-1">
                            <li>- No real verifications</li>
                            <li>- Simulated responses</li>
                            <li>- No charges incurred</li>
                            <li>- Rate limit: 100/min</li>
                          </ul>
                        </div>
                        <div className="border border-[#e4e4e4] rounded-[10px] p-4 bg-white">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-5 w-5 text-[#436cc8]" />
                            <Badge className="bg-[#436cc8]">Production</Badge>
                          </div>
                          <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-1">Live API Key</p>
                          <code className="text-xs bg-[#f6f6f6] px-2 py-1 rounded block mb-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                            tvsk_live_xxxxxxxx
                          </code>
                          <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] space-y-1">
                            <li>- Real verifications</li>
                            <li>- Live data processing</li>
                            <li>- Usage charges apply</li>
                            <li>- Rate limit: 1000/min</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">SDK Token Generation</h3>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                        For client-side SDK integrations, generate temporary SDK tokens that are scoped to a specific applicant:
                      </p>
                      
                      <div className="bg-[#121728] rounded-[10px] overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1f35]">
                          <span className="text-sm text-gray-400 [font-family:'DM_Sans_18pt-Regular',Helvetica]">Generate SDK Token</span>
                        </div>
                        <pre className="p-4 text-sm text-[#27ae60] overflow-x-auto [font-family:'DM_Sans_18pt-Regular',Helvetica]">
{`curl -X POST https://api.trustverify.io/v1/sdk-tokens \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "applicant_id": "apr_2xK8nM3pQw7yL4vR",
    "expires_in": 3600
  }'`}
                        </pre>
                      </div>

                      <div className="bg-[#121728] rounded-[10px] overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1f35]">
                          <span className="text-sm text-gray-400 [font-family:'DM_Sans_18pt-Regular',Helvetica]">Response</span>
                        </div>
                        <pre className="p-4 text-sm text-[#436cc8] overflow-x-auto [font-family:'DM_Sans_18pt-Regular',Helvetica]">
{`{
  "token": "sdk_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2025-12-19T11:30:00Z"
}`}
                        </pre>
                      </div>

                      <div className="bg-[#ffe8e8] border border-[#ff6b6b] rounded-[10px] p-4">
                        <div className="flex gap-2">
                          <AlertCircle className="h-5 w-5 text-[#ff6b6b] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Security Warning</p>
                            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">
                              Never expose your API key in client-side code. Always generate SDK tokens server-side 
                              and implement proper key rotation policies.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Required Headers</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-[#f6f6f6]">
                            <tr>
                              <th className="px-4 py-2 text-left">Header</th>
                              <th className="px-4 py-2 text-left">Value</th>
                              <th className="px-4 py-2 text-left">Required</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">Authorization</td>
                              <td className="px-4 py-2">Bearer YOUR_API_KEY</td>
                              <td className="px-4 py-2"><Badge variant="destructive">Required</Badge></td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">Content-Type</td>
                              <td className="px-4 py-2">application/json</td>
                              <td className="px-4 py-2"><Badge variant="destructive">Required</Badge></td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">X-Request-Id</td>
                              <td className="px-4 py-2">Unique request identifier</td>
                              <td className="px-4 py-2"><Badge variant="secondary">Optional</Badge></td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">X-Idempotency-Key</td>
                              <td className="px-4 py-2">Idempotency key for POST requests</td>
                              <td className="px-4 py-2"><Badge variant="secondary">Recommended</Badge></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeSection === "environments" && (
              <section className="space-y-6" data-testid="section-environments">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <Server className="h-5 w-5 text-[#27ae60]" />
                      Environments & Base URLs
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      Configure your integration for sandbox testing or production use
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border border-[#e4e4e4] rounded-[10px] p-6 bg-white">
                        <div className="flex items-center gap-2 mb-4">
                          <Beaker className="h-6 w-6 text-[#27ae60]" />
                          <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b]">Sandbox</h3>
                        </div>
                        <div className="bg-[#f6f6f6] rounded-[10px] p-3 mb-4">
                          <code className="text-sm font-mono break-all text-[#003d2b]">
                            https://sandbox-api.trustverify.io/v1
                          </code>
                        </div>
                        <ul className="space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#27ae60]" />
                            No real data processed
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#27ae60]" />
                            Simulated verification responses
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#27ae60]" />
                            No charges incurred
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#27ae60]" />
                            Test document triggers available
                          </li>
                        </ul>
                      </div>

                      <div className="border border-[#e4e4e4] rounded-[10px] p-6 bg-white">
                        <div className="flex items-center gap-2 mb-4">
                          <Shield className="h-6 w-6 text-[#436cc8]" />
                          <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b]">Production</h3>
                        </div>
                        <div className="bg-[#f6f6f6] rounded-[10px] p-3 mb-4">
                          <code className="text-sm font-mono break-all text-[#003d2b]">
                            https://api.trustverify.io/v1
                          </code>
                        </div>
                        <ul className="space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#27ae60]" />
                            Real identity verification
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#27ae60]" />
                            Live fraud detection
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#27ae60]" />
                            Usage-based billing
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#27ae60]" />
                            Full regulatory compliance
                          </li>
                        </ul>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Regional Endpoints</h3>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                        For data residency requirements, use region-specific endpoints:
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-[#f6f6f6]">
                            <tr>
                              <th className="px-4 py-2 text-left [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Region</th>
                              <th className="px-4 py-2 text-left [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Base URL</th>
                              <th className="px-4 py-2 text-left [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Data Residency</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-[#e4e4e4]">
                              <td className="px-4 py-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-medium text-[#003d2b]">Europe (Default)</td>
                              <td className="px-4 py-2 font-mono text-xs text-[#003d2b]">api.trustverify.io</td>
                              <td className="px-4 py-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">UK / EU</td>
                            </tr>
                            <tr className="border-b border-[#e4e4e4]">
                              <td className="px-4 py-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-medium text-[#003d2b]">United States</td>
                              <td className="px-4 py-2 font-mono text-xs text-[#003d2b]">api.us.trustverify.io</td>
                              <td className="px-4 py-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">US East</td>
                            </tr>
                            <tr className="border-b border-[#e4e4e4]">
                              <td className="px-4 py-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-medium text-[#003d2b]">Asia Pacific</td>
                              <td className="px-4 py-2 font-mono text-xs text-[#003d2b]">api.apac.trustverify.io</td>
                              <td className="px-4 py-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Singapore</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-[#e8f5e9] border border-[#27ae60] rounded-[10px] p-4">
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b] text-sm">
                        <strong className="[font-family:'Suisse_Intl-SemiBold',Helvetica]">TLS Required:</strong> All API requests must use HTTPS with TLS 1.2 or higher. 
                        HTTP requests will be rejected.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeSection === "core-concepts" && (
              <section className="space-y-6" data-testid="section-core-concepts">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <FileSearch className="h-5 w-5 text-[#27ae60]" />
                      Core Concepts
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      Understanding the key objects and workflows in TrustVerify API
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border border-[#e4e4e4] rounded-[10px] p-4 bg-white">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-5 w-5 text-[#436cc8]" />
                          <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Applicants</h4>
                        </div>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-3">
                          An applicant represents an individual user undergoing verification. 
                          Store the applicant ID to retrieve results and perform additional checks.
                        </p>
                        <code className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs bg-[#f6f6f6] px-2 py-1 rounded text-[#003d2b]">apr_xxxxxxxx</code>
                      </div>

                      <div className="border border-[#e4e4e4] rounded-[10px] p-4 bg-white">
                        <div className="flex items-center gap-2 mb-3">
                          <Activity className="h-5 w-5 text-[#27ae60]" />
                          <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Verifications</h4>
                        </div>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-3">
                          A verification session where an applicant submits documents and biometrics. 
                          Each verification produces a result with detailed findings.
                        </p>
                        <code className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs bg-[#f6f6f6] px-2 py-1 rounded text-[#003d2b]">vrf_xxxxxxxx</code>
                      </div>

                      <div className="border border-[#e4e4e4] rounded-[10px] p-4 bg-white">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="h-5 w-5 text-[#436cc8]" />
                          <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Documents</h4>
                        </div>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-3">
                          Identity documents uploaded during verification: passports, driving licences, 
                          national ID cards, and proof of address documents.
                        </p>
                        <code className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs bg-[#f6f6f6] px-2 py-1 rounded text-[#003d2b]">doc_xxxxxxxx</code>
                      </div>

                      <div className="border border-[#e4e4e4] rounded-[10px] p-4 bg-white">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="h-5 w-5 text-[#27ae60]" />
                          <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Risk Scores</h4>
                        </div>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-3">
                          AI-generated fraud risk scores from 0-100, with detailed risk factors 
                          and recommendations for each transaction or verification.
                        </p>
                        <code className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs bg-[#f6f6f6] px-2 py-1 rounded text-[#003d2b]">score: 0-100</code>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Verification Workflow</h3>
                      <div className="bg-[#f6f6f6] rounded-[10px] p-6">
                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                          <div className="flex items-center gap-2 bg-white rounded-[10px] px-4 py-2 border border-[#e4e4e4]">
                            <div className="w-6 h-6 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Create Applicant</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#808080]" />
                          <div className="flex items-center gap-2 bg-white rounded-[10px] px-4 py-2 border border-[#e4e4e4]">
                            <div className="w-6 h-6 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Start Verification</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#808080]" />
                          <div className="flex items-center gap-2 bg-white rounded-[10px] px-4 py-2 border border-[#e4e4e4]">
                            <div className="w-6 h-6 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                            <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">User Submits</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#808080]" />
                          <div className="flex items-center gap-2 bg-white rounded-[10px] px-4 py-2 border border-[#e4e4e4]">
                            <div className="w-6 h-6 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                            <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Receive Webhook</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#808080]" />
                          <div className="flex items-center gap-2 bg-white rounded-[10px] px-4 py-2 border border-[#e4e4e4]">
                            <div className="w-6 h-6 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white rounded-full flex items-center justify-center text-xs font-bold">5</div>
                            <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Get Results</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Verification Levels</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-[#f6f6f6]">
                            <tr>
                              <th className="px-4 py-2 text-left [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Level</th>
                              <th className="px-4 py-2 text-left [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Checks Included</th>
                              <th className="px-4 py-2 text-left [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Use Case</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-[#e4e4e4]">
                              <td className="px-4 py-2">
                                <Badge variant="secondary" className="bg-[#f6f6f6] text-[#003d2b]">basic</Badge>
                              </td>
                              <td className="px-4 py-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Document + Selfie</td>
                              <td className="px-4 py-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Low-risk transactions</td>
                            </tr>
                            <tr className="border-b border-[#e4e4e4]">
                              <td className="px-4 py-2">
                                <Badge className="bg-[#27ae60]">standard</Badge>
                              </td>
                              <td className="px-4 py-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Document + Selfie + Liveness</td>
                              <td className="px-4 py-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Financial services</td>
                            </tr>
                            <tr className="border-b border-[#e4e4e4]">
                              <td className="px-4 py-2">
                                <Badge className="bg-[#436cc8]">enhanced</Badge>
                              </td>
                              <td className="px-4 py-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Document + Selfie + Liveness + PoA + AML</td>
                              <td className="px-4 py-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">High-value, regulated</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Verification Statuses</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 border border-[#e4e4e4] rounded-[10px] bg-white">
                          <Badge variant="secondary" className="mb-2 bg-[#f6f6f6] text-[#003d2b]">pending</Badge>
                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080]">Awaiting user submission</p>
                        </div>
                        <div className="text-center p-3 border border-[#e4e4e4] rounded-[10px] bg-white">
                          <Badge className="bg-[#436cc8] mb-2">processing</Badge>
                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080]">Under review</p>
                        </div>
                        <div className="text-center p-3 border border-[#e4e4e4] rounded-[10px] bg-white">
                          <Badge className="bg-[#27ae60] mb-2">approved</Badge>
                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080]">Verification passed</p>
                        </div>
                        <div className="text-center p-3 border border-[#e4e4e4] rounded-[10px] bg-white">
                          <Badge className="bg-red-500 mb-2">rejected</Badge>
                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080]">Verification failed</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeSection === "identity-verification" && (
              <section className="space-y-6" data-testid="section-identity-verification">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <Users className="h-5 w-5 text-[#27ae60]" />
                      Identity Verification API
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      Verify user identities with document scanning, facial recognition, and liveness detection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Create Applicant</h3>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                        Create an applicant record before starting any verification. Store the returned ID for future operations.
                      </p>
                      
                      <div className="border border-[#e4e4e4] rounded-[10px] overflow-hidden">
                        <div className="bg-[#f6f6f6] px-4 py-2 flex items-center gap-2">
                          <Badge className="bg-[#27ae60]">POST</Badge>
                          <code className="text-sm font-mono text-[#003d2b]">/v1/applicants</code>
                        </div>
                        <div className="p-4 space-y-4">
                          <div>
                            <h5 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">Request Body</h5>
                            <div className="bg-[#121728] rounded-[10px] p-4">
                              <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#27ae60] overflow-x-auto">
{`{
  "first_name": "string",        // Required
  "last_name": "string",         // Required
  "email": "string",             // Required, valid email
  "phone": "string",             // Optional, E.164 format
  "date_of_birth": "YYYY-MM-DD", // Optional
  "nationality": "string",       // Optional, ISO 3166-1 alpha-3
  "external_id": "string",       // Optional, your internal user ID
  "metadata": {                  // Optional, custom key-value pairs
    "user_tier": "premium"
  }
}`}
                              </pre>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-2">Response (201 Created)</h5>
                            <div className="bg-slate-900 rounded-lg p-4">
                              <pre className="text-sm text-blue-400 overflow-x-auto">
{`{
  "id": "apr_2xK8nM3pQw7yL4vR",
  "object": "applicant",
  "first_name": "John",
  "last_name": "Smith",
  "email": "john.smith@example.com",
  "phone": "+447123456789",
  "date_of_birth": "1990-05-15",
  "nationality": "GBR",
  "external_id": "user_12345",
  "status": "pending",
  "verification_count": 0,
  "created_at": "2025-12-19T10:30:00Z",
  "updated_at": "2025-12-19T10:30:00Z"
}`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Start Verification</h3>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                        Create a verification session for an applicant. The response includes a URL where the user can complete verification.
                      </p>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 flex items-center gap-2">
                          <Badge className="bg-green-500">POST</Badge>
                          <code className="text-sm font-mono">/v1/verifications</code>
                        </div>
                        <div className="p-4 space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Request Body</h5>
                            <div className="bg-slate-900 rounded-lg p-4">
                              <pre className="text-sm text-green-400 overflow-x-auto">
{`{
  "applicant_id": "apr_2xK8nM3pQw7yL4vR",  // Required
  "type": "identity",                       // identity, document, aml
  "level": "standard",                      // basic, standard, enhanced
  "country": "GBR",                         // Optional, restrict to country
  "documents": ["passport", "driving_licence"], // Optional, allowed types
  "redirect_url": "https://yoursite.com/complete",
  "webhook_url": "https://yoursite.com/webhooks",
  "locale": "en",                           // Optional, UI language
  "expires_in": 86400                       // Optional, seconds (default 24h)
}`}
                              </pre>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-2">Response (201 Created)</h5>
                            <div className="bg-slate-900 rounded-lg p-4">
                              <pre className="text-sm text-blue-400 overflow-x-auto">
{`{
  "id": "vrf_9kL2mN4pQr8sT5uV",
  "object": "verification",
  "applicant_id": "apr_2xK8nM3pQw7yL4vR",
  "type": "identity",
  "level": "standard",
  "status": "pending",
  "verification_url": "https://verify.trustverify.io/v/9kL2mN4pQr8sT5uV",
  "sdk_token": "sdk_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2025-12-20T10:30:00Z",
  "created_at": "2025-12-19T10:30:00Z"
}`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Get Verification Result</h3>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                        Retrieve the full verification result with extracted data and check results.
                      </p>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 flex items-center gap-2">
                          <Badge variant="secondary">GET</Badge>
                          <code className="text-sm font-mono">/v1/verifications/{"{verification_id}"}</code>
                        </div>
                        <div className="p-4 space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Response (200 OK)</h5>
                            <div className="bg-slate-900 rounded-lg p-4">
                              <pre className="text-sm text-blue-400 overflow-x-auto">
{`{
  "id": "vrf_9kL2mN4pQr8sT5uV",
  "object": "verification",
  "applicant_id": "apr_2xK8nM3pQw7yL4vR",
  "status": "approved",
  "result": {
    "decision": "approved",
    "risk_score": 15,
    "checks": {
      "document_authenticity": "passed",
      "face_match": "passed",
      "liveness": "passed",
      "data_consistency": "passed"
    }
  },
  "extracted_data": {
    "document_type": "passport",
    "document_number": "123456789",
    "first_name": "JOHN",
    "last_name": "SMITH",
    "date_of_birth": "1990-05-15",
    "expiry_date": "2030-05-14",
    "issuing_country": "GBR",
    "nationality": "GBR",
    "gender": "male",
    "mrz_line1": "P<GBRSMITH<<JOHN<<<<<<<<<<<<<<<<<<<<<<<<<<<",
    "mrz_line2": "1234567890GBR9005150M3005149<<<<<<<<<<<<<<00"
  },
  "documents": [
    {
      "id": "doc_xY7zW8vU",
      "type": "passport",
      "side": "front",
      "image_url": "https://api.trustverify.io/v1/documents/doc_xY7zW8vU/image"
    }
  ],
  "selfie": {
    "id": "slf_aB3cD4eF",
    "image_url": "https://api.trustverify.io/v1/selfies/slf_aB3cD4eF/image"
  },
  "completed_at": "2025-12-19T10:35:00Z",
  "created_at": "2025-12-19T10:30:00Z"
}`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Upload Document (API-Only Mode)</h3>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                        For headless integrations, upload documents directly via API:
                      </p>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 flex items-center gap-2">
                          <Badge className="bg-green-500">POST</Badge>
                          <code className="text-sm font-mono">/v1/verifications/{"{verification_id}"}/documents</code>
                        </div>
                        <div className="p-4 space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Request (multipart/form-data)</h5>
                            <div className="bg-slate-900 rounded-lg p-4">
                              <pre className="text-sm text-green-400 overflow-x-auto">
{`Content-Type: multipart/form-data

type: "passport"           // Required: passport, driving_licence, national_id
side: "front"              // Required: front, back
file: <binary>             // Required: image file (JPG, PNG, PDF)
                           // Max size: 10MB, Max resolution: 64MP`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-[#e8f5e9] border border-[#27ae60] rounded-[10px] p-4">
                        <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">Supported Documents</h4>
                        <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#003d2b] space-y-1">
                          <li>- Passports (190+ countries)</li>
                          <li>- Driving licences</li>
                          <li>- National ID cards</li>
                          <li>- Residence permits</li>
                          <li>- Proof of address</li>
                        </ul>
                      </div>
                      <div className="bg-[#e3f2fd] border border-[#436cc8] rounded-[10px] p-4">
                        <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">Verification Checks</h4>
                        <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#003d2b] space-y-1">
                          <li>- Document authenticity</li>
                          <li>- MRZ/barcode validation</li>
                          <li>- Facial similarity</li>
                          <li>- Active liveness detection</li>
                          <li>- Data cross-verification</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeSection === "fraud-detection" && (
              <section className="space-y-6" data-testid="section-fraud-detection">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <Shield className="h-5 w-5 text-[#27ae60]" />
                      Fraud Detection API
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      Real-time fraud scoring with device fingerprinting and behavioral analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Fraud Check</h3>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                        Submit transaction and device data for real-time fraud risk assessment:
                      </p>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 flex items-center gap-2">
                          <Badge className="bg-green-500">POST</Badge>
                          <code className="text-sm font-mono">/v1/fraud/check</code>
                        </div>
                        <div className="p-4 space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Request Body</h5>
                            <div className="bg-slate-900 rounded-lg p-4">
                              <pre className="text-sm text-green-400 overflow-x-auto">
{`{
  "transaction": {
    "id": "txn_your_internal_id",
    "type": "payment",              // payment, registration, login
    "amount": 150.00,
    "currency": "GBP"
  },
  "user": {
    "id": "user_12345",
    "email": "user@example.com",
    "phone": "+447123456789",
    "ip_address": "192.168.1.1",
    "created_at": "2024-01-15T10:00:00Z"
  },
  "device": {
    "fingerprint": "fp_abc123xyz789",
    "user_agent": "Mozilla/5.0...",
    "language": "en-GB",
    "timezone": "Europe/London",
    "screen_resolution": "1920x1080"
  },
  "session": {
    "id": "sess_xyz789",
    "started_at": "2025-12-19T10:00:00Z",
    "page_views": 5,
    "actions": ["view_product", "add_to_cart", "checkout"]
  }
}`}
                              </pre>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-2">Response (200 OK)</h5>
                            <div className="bg-slate-900 rounded-lg p-4">
                              <pre className="text-sm text-blue-400 overflow-x-auto">
{`{
  "id": "frd_8jK9mL2nPq4rS",
  "object": "fraud_check",
  "risk_score": 25,
  "risk_level": "low",           // low, medium, high, critical
  "recommendation": "approve",   // approve, review, decline
  "signals": {
    "device_reputation": 90,
    "ip_reputation": 85,
    "email_reputation": 95,
    "behavioral_score": 88,
    "velocity_score": 92
  },
  "risk_factors": [
    {
      "type": "new_device",
      "severity": "low",
      "description": "First time seeing this device"
    }
  ],
  "enrichment": {
    "email": {
      "valid": true,
      "disposable": false,
      "domain_age_days": 8500,
      "deliverable": true
    },
    "ip": {
      "country": "GB",
      "city": "London",
      "isp": "BT",
      "vpn": false,
      "proxy": false,
      "tor": false
    },
    "device": {
      "type": "desktop",
      "os": "Windows 11",
      "browser": "Chrome 120",
      "bot_detected": false
    }
  },
  "rules_triggered": [],
  "processing_time_ms": 45,
  "created_at": "2025-12-19T10:30:00Z"
}`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Device Fingerprinting</h3>
                      <p className="text-gray-700">
                        Include our JavaScript SDK to collect device fingerprints:
                      </p>
                      
                      <div className="bg-[#121728] rounded-[10px] overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1f35]">
                          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-gray-400">JavaScript SDK</span>
                        </div>
                        <pre className="p-4 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#27ae60] overflow-x-auto">
{`<script src="https://cdn.trustverify.io/sdk/v1/trustverify.min.js"></script>
<script>
  TrustVerify.init({ apiKey: 'YOUR_PUBLIC_KEY' });
  
  // Collect device fingerprint
  TrustVerify.getFingerprint().then(function(fingerprint) {
    // Include fingerprint in your fraud check request
    console.log('Fingerprint:', fingerprint);
  });
</script>`}
                        </pre>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Risk Score Interpretation</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 border rounded-lg bg-green-50 border-green-200">
                          <div className="text-2xl font-bold text-green-600 mb-1">0-25</div>
                          <Badge className="bg-green-500">Low Risk</Badge>
                          <p className="text-xs text-gray-600 mt-2">Auto-approve</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                          <div className="text-2xl font-bold text-yellow-600 mb-1">26-50</div>
                          <Badge className="bg-yellow-500">Medium</Badge>
                          <p className="text-xs text-gray-600 mt-2">Additional verification</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg bg-orange-50 border-orange-200">
                          <div className="text-2xl font-bold text-orange-600 mb-1">51-75</div>
                          <Badge className="bg-orange-500">High Risk</Badge>
                          <p className="text-xs text-gray-600 mt-2">Manual review</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg bg-red-50 border-red-200">
                          <div className="text-2xl font-bold text-red-600 mb-1">76-100</div>
                          <Badge variant="destructive">Critical</Badge>
                          <p className="text-xs text-gray-600 mt-2">Block transaction</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Provide Feedback</h3>
                      <p className="text-gray-700">
                        Improve fraud detection accuracy by providing feedback on previous checks:
                      </p>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 flex items-center gap-2">
                          <Badge className="bg-green-500">POST</Badge>
                          <code className="text-sm font-mono">/v1/fraud/feedback</code>
                        </div>
                        <div className="p-4">
                          <div className="bg-slate-900 rounded-lg p-4">
                            <pre className="text-sm text-green-400 overflow-x-auto">
{`{
  "fraud_check_id": "frd_8jK9mL2nPq4rS",
  "outcome": "fraud_confirmed",  // fraud_confirmed, legitimate, chargeback
  "notes": "Customer disputed transaction, confirmed fraudulent"
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeSection === "transactions" && (
              <section className="space-y-6" data-testid="section-transactions">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <CreditCard className="h-5 w-5 text-[#27ae60]" />
                      Transactions API
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      Create escrow-protected transactions with built-in dispute resolution
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Create Transaction</h3>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 flex items-center gap-2">
                          <Badge className="bg-green-500">POST</Badge>
                          <code className="text-sm font-mono">/v1/transactions</code>
                        </div>
                        <div className="p-4 space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Request Body</h5>
                            <div className="bg-slate-900 rounded-lg p-4">
                              <pre className="text-sm text-green-400 overflow-x-auto">
{`{
  "amount": 1500.00,
  "currency": "GBP",
  "description": "Website development project",
  "buyer": {
    "id": "user_buyer_123",
    "email": "buyer@example.com",
    "name": "John Buyer"
  },
  "seller": {
    "id": "user_seller_456",
    "email": "seller@example.com",
    "name": "Jane Seller"
  },
  "escrow": {
    "enabled": true,
    "release_days": 14,
    "inspection_days": 3
  },
  "metadata": {
    "order_id": "ORD-12345",
    "category": "services"
  }
}`}
                              </pre>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-2">Response (201 Created)</h5>
                            <div className="bg-slate-900 rounded-lg p-4">
                              <pre className="text-sm text-blue-400 overflow-x-auto">
{`{
  "id": "txn_5xY8zW3vQ9rS",
  "object": "transaction",
  "amount": 1500.00,
  "currency": "GBP",
  "status": "pending_payment",
  "escrow_status": "awaiting_funds",
  "payment_url": "https://pay.trustverify.io/txn_5xY8zW3vQ9rS",
  "buyer": { ... },
  "seller": { ... },
  "timeline": {
    "created_at": "2025-12-19T10:30:00Z",
    "payment_due": "2025-12-22T10:30:00Z",
    "inspection_ends": null,
    "escrow_release": null
  },
  "created_at": "2025-12-19T10:30:00Z"
}`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Transaction Lifecycle</h3>
                      <div className="bg-slate-50 rounded-lg p-6">
                        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                          <Badge variant="secondary">pending_payment</Badge>
                          <ArrowRight className="h-3 w-3" />
                          <Badge className="bg-blue-500">payment_received</Badge>
                          <ArrowRight className="h-3 w-3" />
                          <Badge className="bg-purple-500">in_escrow</Badge>
                          <ArrowRight className="h-3 w-3" />
                          <Badge className="bg-yellow-500">inspection</Badge>
                          <ArrowRight className="h-3 w-3" />
                          <Badge className="bg-green-500">completed</Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Release Escrow</h3>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 flex items-center gap-2">
                          <Badge className="bg-green-500">POST</Badge>
                          <code className="text-sm font-mono">/v1/transactions/{"{transaction_id}"}/release</code>
                        </div>
                        <div className="p-4">
                          <div className="bg-slate-900 rounded-lg p-4">
                            <pre className="text-sm text-green-400 overflow-x-auto">
{`{
  "confirmed_by": "buyer",
  "rating": 5,
  "feedback": "Excellent service, delivered on time"
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Open Dispute</h3>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 flex items-center gap-2">
                          <Badge className="bg-green-500">POST</Badge>
                          <code className="text-sm font-mono">/v1/transactions/{"{transaction_id}"}/dispute</code>
                        </div>
                        <div className="p-4">
                          <div className="bg-slate-900 rounded-lg p-4">
                            <pre className="text-sm text-green-400 overflow-x-auto">
{`{
  "reason": "item_not_as_described",
  "description": "The delivered work does not match specifications",
  "evidence": [
    {
      "type": "screenshot",
      "url": "https://yoursite.com/evidence/img1.png"
    }
  ]
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeSection === "aml-screening" && (
              <section className="space-y-6" data-testid="section-aml-screening">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <Search className="h-5 w-5 text-[#27ae60]" />
                      AML Screening API
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      Screen individuals and organizations against global sanctions, PEP, and watchlists
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Screen Individual</h3>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 flex items-center gap-2">
                          <Badge className="bg-green-500">POST</Badge>
                          <code className="text-sm font-mono">/v1/aml/screen</code>
                        </div>
                        <div className="p-4 space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Request Body</h5>
                            <div className="bg-slate-900 rounded-lg p-4">
                              <pre className="text-sm text-green-400 overflow-x-auto">
{`{
  "type": "individual",           // individual, organization
  "first_name": "John",
  "last_name": "Smith",
  "date_of_birth": "1980-05-15",
  "nationality": "GBR",
  "countries": ["GB", "US", "EU"],  // Jurisdictions to check
  "lists": [                       // Optional, specific lists
    "sanctions",
    "pep",
    "adverse_media",
    "watchlists"
  ],
  "match_threshold": 0.8,          // 0.0-1.0, name matching sensitivity
  "ongoing_monitoring": true       // Enable continuous monitoring
}`}
                              </pre>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-2">Response (200 OK)</h5>
                            <div className="bg-slate-900 rounded-lg p-4">
                              <pre className="text-sm text-blue-400 overflow-x-auto">
{`{
  "id": "aml_3kM8nP4qR7sT",
  "object": "aml_screening",
  "status": "completed",
  "result": "clear",              // clear, potential_match, match
  "matches": [],
  "lists_checked": {
    "sanctions": { "checked": true, "matches": 0 },
    "pep": { "checked": true, "matches": 0 },
    "adverse_media": { "checked": true, "matches": 0 },
    "watchlists": { "checked": true, "matches": 0 }
  },
  "monitoring": {
    "enabled": true,
    "next_check": "2025-12-26T10:30:00Z"
  },
  "created_at": "2025-12-19T10:30:00Z"
}`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Lists Covered</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>- OFAC SDN List (US)</li>
                          <li>- UK Sanctions List</li>
                          <li>- EU Consolidated List</li>
                          <li>- UN Security Council</li>
                          <li>- Global PEP databases</li>
                          <li>- Adverse media screening</li>
                        </ul>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Monitoring Features</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>- Daily screening updates</li>
                          <li>- Real-time list changes</li>
                          <li>- Webhook notifications</li>
                          <li>- Audit trail logging</li>
                          <li>- Case management</li>
                          <li>- Compliance reporting</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeSection === "webhooks" && (
              <section className="space-y-6" data-testid="section-webhooks">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <Webhook className="h-5 w-5 text-[#27ae60]" />
                      Webhooks
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      Receive real-time notifications for verification and transaction events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Webhook Events</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-[#f6f6f6]">
                            <tr>
                              <th className="px-4 py-2 text-left [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Event</th>
                              <th className="px-4 py-2 text-left [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-[#e4e4e4]">
                              <td className="px-4 py-2 font-mono text-xs text-[#003d2b]">verification.completed</td>
                              <td className="px-4 py-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Verification finished with result</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">verification.expired</td>
                              <td className="px-4 py-2">Verification session expired</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">transaction.payment_received</td>
                              <td className="px-4 py-2">Funds received in escrow</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">transaction.completed</td>
                              <td className="px-4 py-2">Transaction completed successfully</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">transaction.disputed</td>
                              <td className="px-4 py-2">Dispute opened on transaction</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">aml.match_found</td>
                              <td className="px-4 py-2">Potential match found during monitoring</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Webhook Payload</h3>
                      <div className="bg-[#121728] rounded-[10px] p-4">
                        <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#436cc8] overflow-x-auto">
{`{
  "id": "evt_9kL2mN4pQr8sT5uV",
  "object": "event",
  "type": "verification.completed",
  "api_version": "2025-12-01",
  "created_at": "2025-12-19T10:35:00Z",
  "data": {
    "object": {
      "id": "vrf_9kL2mN4pQr8sT5uV",
      "object": "verification",
      "applicant_id": "apr_2xK8nM3pQw7yL4vR",
      "status": "approved",
      "result": { ... }
    }
  }
}`}
                        </pre>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Signature Verification</h3>
                      <p className="text-gray-700">
                        Verify webhook authenticity using HMAC-SHA256 signature:
                      </p>
                      
                      <div className="bg-slate-900 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
                          <span className="text-sm text-slate-400">Node.js Example</span>
                        </div>
                        <pre className="p-4 text-sm text-green-400 overflow-x-auto">
{`const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from('sha256=' + expectedSignature)
  );
}

// In your webhook handler
app.post('/webhooks', (req, res) => {
  const signature = req.headers['x-trustverify-signature'];
  const isValid = verifyWebhookSignature(
    JSON.stringify(req.body),
    signature,
    process.env.WEBHOOK_SECRET
  );
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
  res.status(200).send('OK');
});`}
                        </pre>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Retry Policy</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 text-sm mb-3">
                          If your endpoint returns a non-2xx response, we'll retry with exponential backoff:
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>- Attempt 1: Immediate</li>
                          <li>- Attempt 2: 5 minutes</li>
                          <li>- Attempt 3: 30 minutes</li>
                          <li>- Attempt 4: 2 hours</li>
                          <li>- Attempt 5: 24 hours (final)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeSection === "sdks" && (
              <section className="space-y-6" data-testid="section-sdks">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <Package className="h-5 w-5 text-[#27ae60]" />
                      SDKs & Libraries
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      Official SDKs for quick integration in your preferred language
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="border border-[#e4e4e4] rounded-[10px] p-4 bg-white">
                        <div className="flex items-center gap-2 mb-3">
                          <Terminal className="h-5 w-5 text-[#27ae60]" />
                          <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Node.js</h4>
                        </div>
                        <div className="bg-[#121728] rounded-[10px] p-3 mb-3">
                          <code className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#27ae60]">npm install @trustverify/sdk</code>
                        </div>
                        <Link href="/sdk-documentation">
                          <Button variant="outline" size="sm" className="w-full" data-testid="button-sdk-nodejs">
                            View Documentation
                          </Button>
                        </Link>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Terminal className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold">Python</h4>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-3 mb-3">
                          <code className="text-sm text-green-400">pip install trustverify</code>
                        </div>
                        <Link href="/sdk-documentation">
                          <Button variant="outline" size="sm" className="w-full" data-testid="button-sdk-python">
                            View Documentation
                          </Button>
                        </Link>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Terminal className="h-5 w-5 text-purple-600" />
                          <h4 className="font-semibold">PHP</h4>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-3 mb-3">
                          <code className="text-sm text-green-400">composer require trustverify/sdk</code>
                        </div>
                        <Link href="/sdk-documentation">
                          <Button variant="outline" size="sm" className="w-full" data-testid="button-sdk-php">
                            View Documentation
                          </Button>
                        </Link>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Terminal className="h-5 w-5 text-red-600" />
                          <h4 className="font-semibold">Ruby</h4>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-3 mb-3">
                          <code className="text-sm text-green-400">gem install trustverify</code>
                        </div>
                        <Link href="/sdk-documentation">
                          <Button variant="outline" size="sm" className="w-full" data-testid="button-sdk-ruby">
                            View Documentation
                          </Button>
                        </Link>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Terminal className="h-5 w-5 text-cyan-600" />
                          <h4 className="font-semibold">Go</h4>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-3 mb-3">
                          <code className="text-sm text-green-400">go get trustverify.io/go</code>
                        </div>
                        <Link href="/sdk-documentation">
                          <Button variant="outline" size="sm" className="w-full" data-testid="button-sdk-go">
                            View Documentation
                          </Button>
                        </Link>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Terminal className="h-5 w-5 text-orange-600" />
                          <h4 className="font-semibold">Java</h4>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-3 mb-3">
                          <code className="text-xs text-green-400">implementation 'io.trustverify:sdk'</code>
                        </div>
                        <Link href="/sdk-documentation">
                          <Button variant="outline" size="sm" className="w-full" data-testid="button-sdk-java">
                            View Documentation
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Mobile SDKs</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">iOS SDK</h4>
                          <div className="bg-slate-900 rounded-lg p-3 mb-3">
                            <pre className="text-xs text-green-400">
{`// Swift Package Manager
.package(url: "https://github.com/trustverify/ios-sdk.git")`}
                            </pre>
                          </div>
                          <Badge>Swift 5.0+</Badge>
                          <Badge className="ml-2" variant="secondary">iOS 13+</Badge>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Android SDK</h4>
                          <div className="bg-slate-900 rounded-lg p-3 mb-3">
                            <pre className="text-xs text-green-400">
{`implementation 'io.trustverify:android-sdk:2.0.0'`}
                            </pre>
                          </div>
                          <Badge>Kotlin/Java</Badge>
                          <Badge className="ml-2" variant="secondary">API 21+</Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Web SDK (JavaScript)</h3>
                      <p className="text-gray-700">
                        Embed our verification flow directly in your web application:
                      </p>
                      <div className="bg-slate-900 rounded-lg p-4">
                        <pre className="text-sm text-green-400 overflow-x-auto">
{`<script src="https://cdn.trustverify.io/sdk/v2/trustverify.min.js"></script>
<script>
  const verification = TrustVerify.create({
    token: 'SDK_TOKEN_FROM_BACKEND',
    containerId: 'verification-container',
    onComplete: function(result) {
      console.log('Verification completed:', result);
    },
    onError: function(error) {
      console.error('Verification error:', error);
    }
  });
  
  verification.mount();
</script>`}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeSection === "error-handling" && (
              <section className="space-y-6" data-testid="section-error-handling">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <AlertCircle className="h-5 w-5 text-[#27ae60]" />
                      Error Handling
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      Understanding API error responses and how to handle them
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Error Response Format</h3>
                      <div className="bg-[#121728] rounded-[10px] p-4">
                        <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-red-400 overflow-x-auto">
{`{
  "error": {
    "code": "invalid_request",
    "message": "The applicant_id field is required",
    "type": "validation_error",
    "param": "applicant_id",
    "doc_url": "https://docs.trustverify.io/errors/invalid_request"
  }
}`}
                        </pre>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">HTTP Status Codes</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-100">
                            <tr>
                              <th className="px-4 py-2 text-left">Code</th>
                              <th className="px-4 py-2 text-left">Meaning</th>
                              <th className="px-4 py-2 text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="px-4 py-2"><Badge className="bg-green-500">200</Badge></td>
                              <td className="px-4 py-2">Success</td>
                              <td className="px-4 py-2">Process response</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2"><Badge className="bg-green-500">201</Badge></td>
                              <td className="px-4 py-2">Created</td>
                              <td className="px-4 py-2">Resource created successfully</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2"><Badge className="bg-red-500">400</Badge></td>
                              <td className="px-4 py-2">Bad Request</td>
                              <td className="px-4 py-2">Check request body/parameters</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2"><Badge className="bg-red-500">401</Badge></td>
                              <td className="px-4 py-2">Unauthorized</td>
                              <td className="px-4 py-2">Check API key</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2"><Badge className="bg-red-500">403</Badge></td>
                              <td className="px-4 py-2">Forbidden</td>
                              <td className="px-4 py-2">Check permissions</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2"><Badge className="bg-red-500">404</Badge></td>
                              <td className="px-4 py-2">Not Found</td>
                              <td className="px-4 py-2">Check resource ID</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2"><Badge className="bg-red-500">429</Badge></td>
                              <td className="px-4 py-2">Rate Limited</td>
                              <td className="px-4 py-2">Back off and retry</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2"><Badge className="bg-red-500">500</Badge></td>
                              <td className="px-4 py-2">Server Error</td>
                              <td className="px-4 py-2">Retry with backoff</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Error Codes</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-100">
                            <tr>
                              <th className="px-4 py-2 text-left">Code</th>
                              <th className="px-4 py-2 text-left">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">invalid_request</td>
                              <td className="px-4 py-2">Request body validation failed</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">authentication_failed</td>
                              <td className="px-4 py-2">Invalid or expired API key</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">insufficient_permissions</td>
                              <td className="px-4 py-2">API key lacks required permissions</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">resource_not_found</td>
                              <td className="px-4 py-2">Requested resource doesn't exist</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">rate_limit_exceeded</td>
                              <td className="px-4 py-2">Too many requests</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">verification_expired</td>
                              <td className="px-4 py-2">Verification session has expired</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">idempotency_conflict</td>
                              <td className="px-4 py-2">Duplicate idempotency key with different payload</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeSection === "rate-limits" && (
              <section className="space-y-6" data-testid="section-rate-limits">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <Gauge className="h-5 w-5 text-[#27ae60]" />
                      Rate Limits
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      Understanding and working within API rate limits
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Default Limits</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-[#f6f6f6]">
                            <tr>
                              <th className="px-4 py-2 text-left">Endpoint Category</th>
                              <th className="px-4 py-2 text-left">Sandbox</th>
                              <th className="px-4 py-2 text-left">Production</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="px-4 py-2">General API calls</td>
                              <td className="px-4 py-2">100/min</td>
                              <td className="px-4 py-2">1,000/min</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2">Fraud checks</td>
                              <td className="px-4 py-2">50/min</td>
                              <td className="px-4 py-2">500/min</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2">KYC verifications</td>
                              <td className="px-4 py-2">20/min</td>
                              <td className="px-4 py-2">100/min</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2">AML screenings</td>
                              <td className="px-4 py-2">30/min</td>
                              <td className="px-4 py-2">200/min</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Rate Limit Headers</h3>
                      <div className="bg-slate-900 rounded-lg p-4">
                        <pre className="text-sm text-green-400">
{`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 985
X-RateLimit-Reset: 1703001600`}
                        </pre>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Best Practices</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                          <span>Implement exponential backoff for 429 responses</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                          <span>Cache verification results to reduce duplicate calls</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                          <span>Use webhooks instead of polling for status updates</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                          <span>Batch operations where possible</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                          <span>Contact support for higher limits if needed</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeSection === "testing" && (
              <section className="space-y-6" data-testid="section-testing">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <Beaker className="h-5 w-5 text-[#27ae60]" />
                      Testing Guide
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      Test your integration in sandbox mode with simulated responses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <div className="space-y-4">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">Test Triggers</h3>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                        Use specific test values to trigger predetermined responses in sandbox mode:
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-100">
                            <tr>
                              <th className="px-4 py-2 text-left">Test Value</th>
                              <th className="px-4 py-2 text-left">Field</th>
                              <th className="px-4 py-2 text-left">Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">Approve</td>
                              <td className="px-4 py-2">last_name</td>
                              <td className="px-4 py-2"><Badge className="bg-green-500">Approved</Badge></td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">Reject</td>
                              <td className="px-4 py-2">last_name</td>
                              <td className="px-4 py-2"><Badge variant="destructive">Rejected</Badge></td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">Review</td>
                              <td className="px-4 py-2">last_name</td>
                              <td className="px-4 py-2"><Badge className="bg-yellow-500">Manual Review</Badge></td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">fraud@test.com</td>
                              <td className="px-4 py-2">email</td>
                              <td className="px-4 py-2">High fraud score (85+)</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-2 font-mono text-xs">sanctions@test.com</td>
                              <td className="px-4 py-2">email</td>
                              <td className="px-4 py-2">AML match found</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Test Documents</h3>
                      <p className="text-gray-700">
                        Download sample documents for testing document verification:
                      </p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4 text-center">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <p className="font-medium">UK Passport</p>
                          <Button variant="outline" size="sm" className="mt-2" data-testid="button-download-passport">Download</Button>
                        </div>
                        <div className="border rounded-lg p-4 text-center">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <p className="font-medium">Driving Licence</p>
                          <Button variant="outline" size="sm" className="mt-2" data-testid="button-download-licence">Download</Button>
                        </div>
                        <div className="border rounded-lg p-4 text-center">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                          <p className="font-medium">Utility Bill</p>
                          <Button variant="outline" size="sm" className="mt-2" data-testid="button-download-utility">Download</Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Webhook Testing</h3>
                      <p className="text-gray-700">
                        Use our webhook simulator to test your webhook endpoint:
                      </p>
                      <Link href="/webhooks">
                        <Button data-testid="button-webhook-tester">
                          <Bell className="h-4 w-4 mr-2" />
                          Open Webhook Tester
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeSection === "changelog" && (
              <section className="space-y-6" data-testid="section-changelog">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                      <FileText className="h-5 w-5 text-[#27ae60]" />
                      Changelog
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
                      API version history and breaking changes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 pt-4">
                    <div className="space-y-6">
                      <div className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-500">2025-12-01</Badge>
                          <Badge variant="outline">Latest</Badge>
                        </div>
                        <h4 className="font-semibold mb-2">Enhanced Identity Verification</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>- Added NFC passport chip reading support</li>
                          <li>- Improved liveness detection accuracy</li>
                          <li>- New webhook event: verification.document_uploaded</li>
                          <li>- Added metadata field to all resources</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-500">2025-09-01</Badge>
                        </div>
                        <h4 className="font-semibold mb-2">Fraud Detection 2.0</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>- Redesigned fraud check response structure</li>
                          <li>- Added behavioral analytics module</li>
                          <li>- New device fingerprinting SDK v2</li>
                          <li>- Deprecated: device_id field (use fingerprint)</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-gray-300 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">2025-06-01</Badge>
                        </div>
                        <h4 className="font-semibold mb-2">AML Screening Updates</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>- Added ongoing monitoring support</li>
                          <li>- New adverse media screening</li>
                          <li>- Expanded PEP database coverage</li>
                        </ul>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">API Versioning</h4>
                      <p className="text-sm text-blue-700">
                        We version our API with dated versions (YYYY-MM-DD). Include the version in 
                        your requests using the <code className="bg-blue-100 px-1 rounded">X-API-Version</code> header. 
                        If not specified, the latest version is used.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b] mb-1">Ready to start integrating?</h3>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Get your API keys and start building in minutes</p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/api-playground">
                      <Button 
                        variant="outline"
                        className="relative h-[45px] rounded-lg border-none before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-lg before:[background:linear-gradient(118deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] hover:bg-gray-50"
                        data-testid="button-try-playground"
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        <span className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] bg-clip-text text-transparent font-semibold text-sm">
                          Try Playground
                        </span>
                      </Button>
                    </Link>
                    <Link href="/developer-portal">
                      <Button 
                        className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
                        data-testid="button-get-started"
                      >
                        <span className="font-semibold text-white text-sm">Get Started</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
