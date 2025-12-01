import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../components/ui/navigation-menu";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { CheckCircle2Icon } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { HeaderDemo } from "../../components/HeaderDemo";

const topNavigationItems = [
  { label: "Demo", isActive: true },
  { label: "Business", isActive: false },
  { label: "Developers", isActive: false },
  { label: "Pricing", isActive: false },
  { label: "Support", isActive: false },
];

const sideNavigationItems = [
  {
    icon: "/fi-1150592.svg",
    label: "Overview",
    active: true,
  },
  {
    icon: "/fi-11681345.svg",
    label: "API Reference",
    active: false,
  },
  {
    icon: "/fi-5243404.svg",
    label: "SDKs",
    active: false,
  },
  {
    icon: "/fi-17405319.svg",
    label: "Webhooks",
    active: false,
  },
  {
    icon: "/fi-4375025.svg",
    label: "Testing",
    active: false,
  },
  {
    icon: "/fi-16549660.svg",
    label: "Examples",
    active: false,
  },
];

const apiEndpoints = [
  {
    method: "POST",
    methodColor: "bg-[#436cc833] text-[#436cc8]",
    endpoint: "/api/v1/transactions/create",
    description: "Create a new secure transaction",
    parameters: "amount, currency, recipient, description",
    response: "Transaction object with escrow details",
  },
  {
    method: "GET",
    methodColor: "bg-[#27ae6033] text-[#27ae60]",
    endpoint: "/api/v1/transactions/{id}",
    description: "Get transaction details",
    parameters: "id",
    response: "Complete transaction information",
  },
  {
    method: "POST",
    methodColor: "bg-[#436cc833] text-[#436cc8]",
    endpoint: "/api/v1/fraud/check",
    description: "Perform fraud analysis on transaction data",
    parameters: "transaction_data, user_profile",
    response: "Fraud risk assessment and recommendations",
  },
  {
    method: "POST",
    methodColor: "bg-[#436cc833] text-[#436cc8]",
    endpoint: "/api/v1/kyc/verify",
    description: "Initiate KYC verification process",
    parameters: "user_id, document_type, document_data",
    response: "Verification status and trust score",
  },
  {
    method: "POST",
    methodColor: "bg-[#436cc833] text-[#436cc8]",
    endpoint: "/api/v1/trust-score/{user_id}",
    description: "Get user trust score and factors",
    parameters: "user_id",
    response: "Trust score breakdown and history",
  },
];

const integrationExamples = [
  {
    title: "E-commerce Integration",
    description: "Complete checkout flow with fraud protection",
    icon: "/fi-709612.svg",
    buttonText: "View Example",
  },
  {
    title: "Marketplace Platform",
    description: "Escrow services for buyer-seller transactions",
    icon: "/fi-709612.svg",
    buttonText: "View Example",
  },
  {
    title: "Crypto Exchange",
    description: "KYC verification and transaction monitoring",
    icon: "/fi-709612.svg",
    buttonText: "View Example",
  },
];

const setupSteps = [
  "Create Your Developer Account",
  "Generate Api Keys From Dashboard",
  "Install Sdk For Your Preferred Language",
  "Make Your First Api Call",
  "Configure Webhooks For Real-time Updates",
];

const coreFeatures = [
  {
    icon: "/p-2-rounded-lg-bg-accent-10-1-1.svg",
    title: "Fraud Detection",
    description: "AI-powered real-time analysis",
  },
  {
    icon: "/p-2-rounded-lg-bg-accent-10-2-1.svg",
    title: "Instant Verification",
    description: "Sub-second response times",
  },
  {
    icon: "/p-2-rounded-lg-bg-accent-10-3-1.svg",
    title: "Global Coverage",
    description: "195+ countries supported",
  },
  {
    icon: "/p-2-rounded-lg-bg-accent-10-4-1.svg",
    title: "Escrow Services",
    description: "Secure payment holding",
  },
];

const rateLimits = [
  {
    label: "API Calls",
    value: "1000/hour",
  },
  {
    label: "Fraud Checks",
    value: "500/hour",
  },
  {
    label: "KYC Verifications",
    value: "100/hour",
  },
];

const sdkData = [
  {
    name: "Node.js",
    version: "v2.1.0",
    status: "Stable",
    statusColor: "bg-[#27ae60]",
    installCommand: "npm install @trustverify/node-sdk",
    buttonDisabled: false,
    buttonBg: "border-[#27ae60]",
    buttonText: "text-app-secondary",
  },
  {
    name: "Python",
    version: "v2.0.5",
    status: "Stable",
    statusColor: "bg-[#27ae60]",
    installCommand: "pip install trustverify-python",
    buttonDisabled: false,
    buttonBg: "border-[#27ae60]",
    buttonText: "text-app-secondary",
  },
  {
    name: "PHP",
    version: "v1.8.2",
    status: "Stable",
    statusColor: "bg-[#27ae60]",
    installCommand: "npm install @trustverify/node-sdk",
    buttonDisabled: false,
    buttonBg: "border-[#27ae60]",
    buttonText: "text-app-secondary",
  },
  {
    name: "Java",
    version: "v1.5.0-beta",
    status: "Beta",
    statusColor: "bg-app-primary",
    installCommand: "maven: com.trustverify:java-sdk:1.5.0-beta",
    buttonDisabled: false,
    buttonBg: "border-[#27ae60]",
    buttonText: "text-app-secondary",
  },
  {
    name: "Go",
    version: "TBA",
    status: "Coming Soon",
    statusColor: "bg-[#f6f6f6] border border-solid border-[#d8d8d8]",
    statusTextColor: "text-[#003d2b]",
    installCommand: "Coming Q2 2025",
    buttonDisabled: true,
    buttonBg: "bg-[#f6f6f6]",
    buttonText: "text-[#b4b4b4]",
  },
  {
    name: "Ruby",
    version: "TBA",
    status: "Coming Soon",
    statusColor: "bg-[#f6f6f6] border border-solid border-[#d8d8d8]",
    statusTextColor: "text-[#003d2b]",
    installCommand: "Coming Q3 2025",
    buttonDisabled: true,
    buttonBg: "bg-[#f6f6f6]",
    buttonText: "text-[#b4b4b4]",
  },
];

const downloadResources = [
  {
    title: "Postman Collection",
    description: "Ready-to-use API request collection",
    icon: "/fi-3502477.svg",
    buttonText: "Download",
  },
  {
    title: "OpenAPI Specification",
    description: "Complete API specification file",
    icon: "/fi-3502477.svg",
    buttonText: "Download",
  },
  {
    title: "Integration Guide PDF",
    description: "Comprehensive setup documentation",
    icon: "/fi-3502477.svg",
    buttonText: "Download",
  },
];

const codeExample = `const TrustVerify = require('@trustverify/node-sdk');
const client = new TrustVerify({
  apiKey: 'your_api_key_here',
  environment: 'sandbox' // or 'production'
});
// Create a secure transaction
const transaction = await client.transactions.create({
  amount: 1000.00,
  currency: 'USD',
  recipient: 'user@example.com',
  description: 'Service payment',
  escrow: true
});
console.log('Transaction created:', transaction.id);`;

const codeExampleTabs = [
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "curl", label: "cURL" },
];

const webhookEvents = [
  "Transaction.created- New Transaction Initiated",
  "Transaction.completed- Transaction Successfully Completed",
  "Fraud.detected- Suspicious Activity Identified",
  "Kyc.verified- Kyc Verification Completed",
  "Dispute.raised- New Dispute Created",
];

const sandboxFeatures = [
  "Full Api Functionality Without Real Money",
  "Test Fraud Detection Scenarios",
  "Simulate Kyc Verification Workflows",
  "Practice Webhook Integration",
  "No Rate Limits During Testing",
];


export const DeveloperCenter = (): JSX.Element => {
  const [activeNav, setActiveNav] = useState("Overview");
  const [activeTab, setActiveTab] = useState("nodejs");
  const navigate = useNavigate();

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full min-w-full lg:min-w-[1920px] flex flex-col">
      <HeaderDemo />
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-20">
        <header className="flex flex-col items-start gap-2.5 w-full">
          <h1 className="flex items-center justify-start w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl tracking-[0] leading-[normal] text-center">
            Developer Center
          </h1>
          <p className="flex items-center justify-start w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl tracking-[0] leading-8 text-center">
            Build secure transaction systems with our comprehensive API and
            developer tools
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
          <nav className="w-full lg:w-[330px]">
            <Card className="bg-white rounded-[14px] border-neutral-200 shadow-[0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_1px_3px_#0000001a,0px_1px_2px_-1px_#0000001a] border-[0.8px]">
              <CardContent className="flex flex-col items-start gap-2.5 p-4 sm:p-6">
                {sideNavigationItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveNav(item.label)}
                    className={`flex items-center gap-2.5 w-full h-fit min-h-[48px] rounded-[10px] px-[15px] py-3 transition-colors ${activeNav === item.label ? "bg-app-secondary" : "hover:bg-gray-50"
                      }`}
                  >
                    <img className="w-6 h-6" alt={item.label} src={item.icon} />
                    <span
                      className={`[font-family:'DM_Sans_18pt-${activeNav === item.label ? "SemiBold" : "Regular"
                        }',Helvetica] ${activeNav === item.label
                          ? "font-semibold text-white"
                          : "font-normal text-[#808080]"
                        } text-base tracking-[0] leading-5 whitespace-nowrap`}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </nav>

          <div className="flex flex-col lg:flex-row items-start gap-6 flex-1 w-full">
            {activeNav === "Overview" && (
              <>
                <div className="flex flex-col w-full items-start gap-6 lg:flex-row lg:items-start">
                  {/* LEFT COLUMN */}
                  <div className="flex flex-col items-start gap-6 flex-1 w-full">
                    {/* Getting Started */}
                    <Card className="w-full bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                      <CardContent className="flex flex-col items-start gap-6 p-6">
                        <div className="flex flex-col items-start gap-4 w-full">
                          <div className="flex items-center gap-2.5">
                            <img
                              className="w-[46px] h-[46px]"
                              alt="Getting Started"
                              src="/p-2-rounded-lg-bg-accent-10-7.svg"
                            />
                            <h2 className="font-semibold text-[#003d2b] text-xl leading-6">
                              Getting Started
                            </h2>
                          </div>
                          <p className="text-[#808080] text-base leading-6">
                            TrustVerify API Provides Enterprise-Grade Transaction Security,
                            Fraud Detection, And KYC Verification Services. Get Started In
                            Minutes With Our Comprehensive SDK And Documentation.
                          </p>
                        </div>

                        {/* Setup Steps */}
                        <div className="flex flex-col items-start gap-4 w-full">
                          <h3 className="font-medium text-[#003d2b] text-base leading-5">
                            Quick Setup Steps:
                          </h3>
                          <div className="flex flex-col items-start gap-3 w-full">
                            {setupSteps.map((step, index) => (
                              <div key={index} className="flex items-center gap-2.5 w-full">
                                <div className="flex items-center justify-center w-[25px] h-6 bg-app-secondary rounded-full">
                                  <span className="text-white text-sm">{index + 1}</span>
                                </div>
                                <span className="text-[#808080] text-base leading-6">
                                  {step}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full justify-end">
                          <Button className="w-full sm:w-[143px] h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90">
                            <span className="font-semibold text-white text-sm text-center leading-[18px]">
                              Get Started
                            </span>
                          </Button>

                          <Button
                            variant="outline"
                            className="relative w-full sm:w-[174px] h-[45px] rounded-lg border-none before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-lg before:[background:linear-gradient(118deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] hover:bg-gray-50"
                            onClick={() => navigate("/api-documentation")}
                          >
                            <span className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] bg-clip-text text-transparent font-semibold text-sm text-center leading-[18px]">
                              View Documentation
                            </span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Core Features */}
                    <Card className="w-full bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                      <CardContent className="flex flex-col items-start gap-6 p-6">
                        <h2 className="font-semibold text-[#003d2b] text-xl leading-6">
                          Core Features
                        </h2>

                        <div className="grid w-full gap-5 sm:grid-cols-2">
                          {coreFeatures.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-[15px] w-full"
                            >
                              <img
                                className="w-[46px] h-[46px]"
                                alt={feature.title}
                                src={feature.icon}
                              />
                              <div className="flex flex-col items-start">
                                <h3 className="font-semibold text-[#003d2b] text-base leading-6">
                                  {feature.title}
                                </h3>
                                <p className="text-[#808080] text-sm leading-6">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="flex flex-col w-full lg:w-[443px] items-start gap-6">
                    {/* Quick Test */}
                    <Card className="w-full bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                      <CardContent className="flex flex-col items-start gap-6 p-6">
                        <div className="flex items-center gap-2.5">
                          <img
                            className="w-[18px] h-[18px]"
                            alt="Quick Test"
                            src="/fi-9073187.svg"
                          />
                          <h2 className="font-semibold text-[#003d2b] text-xl leading-4">
                            Quick Test
                          </h2>
                        </div>

                        <div className="w-full bg-[#121728] rounded-[10px] px-4 py-6 overflow-x-auto">
                          <pre className="text-white text-sm leading-6 font-normal w-full">
                            {`# curl -X GET \\
            https://api.trustverify.io/v1/status \\
            -H "Authorization: Bearer YOUR_KEY"
            # Response:
            { "status": "operational" }`}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Rate Limits */}
                    <Card className="w-full bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                      <CardContent className="flex flex-col items-start gap-6 p-6">
                        <h2 className="font-semibold text-[#003d2b] text-xl leading-4">
                          Rate Limits
                        </h2>

                        <div className="flex flex-col items-start gap-[11px] w-full">
                          {rateLimits.map((limit, index) => (
                            <div
                              key={index}
                              className="flex h-7 items-center justify-between w-full"
                            >
                              <span className="text-[#808080] text-base">
                                {limit.label}
                              </span>
                              <span className="text-[#003d2b] font-medium text-base">
                                {limit.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        <p className="text-app-secondary text-xs leading-5">
                          Contact us for higher limits
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}

            {activeNav === "API Reference" && (
              <>
                <div className="flex flex-col gap-8 w-full">
                  {/* API Endpoints Section */}
                  <Card className="w-full bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col gap-8">
                        {/* Section Header */}
                        <div className="flex items-center gap-3">
                          <img
                            className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px]"
                            alt="API Endpoints icon"
                            src="/p-2-rounded-lg-bg-accent-12-1.svg"
                          />
                          <h2 className="font-semibold text-[#003d2b] text-lg sm:text-xl leading-6">
                            API Endpoints
                          </h2>
                        </div>

                        {/* Endpoint Cards */}
                        <div className="flex flex-col gap-5">
                          {apiEndpoints.map((endpoint, index) => (
                            <Card
                              key={index}
                              className="w-full rounded-[18px] border border-[#e3e8f4] bg-white shadow-[0px_24px_45px_-28px_rgba(30,64,175,0.35)] hover:shadow-[0px_32px_65px_-28px_rgba(30,64,175,0.45)] transition-all duration-300"
                            >
                              <CardContent className="p-5 sm:p-7 flex flex-col gap-5 sm:gap-6">
                                {/* Header row */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                  <div className="flex flex-wrap items-center gap-3">
                                    <Badge
                                      className={`${endpoint.methodColor} rounded-full px-3 py-[5px] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em]`}
                                    >
                                      {endpoint.method}
                                    </Badge>
                                    <span className="font-medium text-[#003d2b] text-[16px] sm:text-[18px] leading-6 break-all">
                                      {endpoint.endpoint}
                                    </span>
                                  </div>
                                  <div className="flex justify-end sm:justify-start">

                                    <img
                                      className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]"
                                      alt="Copy endpoint"
                                      src="/fi-5859289.svg"
                                    />
                                  </div>
                                </div>

                                {/* Description */}
                                <p className="text-[#4d5a70] text-[14px] sm:text-[15px] leading-6">
                                  {endpoint.description}
                                </p>

                                <div className="flex flex-col items-start gap-[4px] w-full">
                                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[14px] sm:text-[15px] tracking-[0] leading-6">
                                    <span className="text-[#003d2b] font-medium">
                                      Parameters:
                                    </span>
                                    <span className="text-[#808080]">
                                      {" "}
                                      {endpoint.parameters}
                                    </span>
                                  </p>
                                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[14px] sm:text-[15px] tracking-[0] leading-6">
                                    <span className="text-[#003d2b] font-medium">
                                      Response:
                                    </span>
                                    <span className="text-[#808080]">
                                      {" "}
                                      {endpoint.response}
                                    </span>
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-start gap-4">
                        <div className="flex flex-col items-start gap-4">
                          <div className="inline-flex items-center gap-2.5">
                            <img
                              className="w-[46px] h-[46px]"
                              alt="Authentication icon"
                              src="/p-2-rounded-lg-bg-accent-19.svg"
                            />
                            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                              Authentication
                            </h2>
                          </div>

                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                            All Api Requests Require Authentication Using Bearer Tokens.
                            Include Your Api Key In The Authorization Header Of Every
                            Request.
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5 px-[23px] py-6 w-full bg-[#121728] rounded-[10px]">
                          <code className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-6">
                            Authorization: Bearer YOUR_API_KEY
                          </code>
                        </div>

                        <div className="flex flex-col items-start justify-center gap-2.5 px-6 py-[27px] w-full bg-[#eab30824] rounded-2xl">
                          <div className="inline-flex flex-col items-start justify-center gap-[5px]">
                            <h3 className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#d8a506] text-lg tracking-[-0.20px] leading-7 whitespace-nowrap">
                              Security Note:
                            </h3>
                            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-yellow-500 text-base tracking-[-0.20px] leading-7">
                              Never expose your API keys in client-side code. Always use
                              them server-side and implement proper key rotation.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeNav === "SDKs" && (
              <div className="flex flex-col flex-1 items-start gap-6 w-full">
                <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                  <CardContent className="flex flex-col items-start gap-[30px] p-4 sm:p-6">
                    <div className="inline-flex items-center gap-2.5">
                      <img
                        className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px]"
                        alt="Official SDKs icon"
                        src="/p-2-rounded-lg-bg-accent-10-6.svg"
                      />
                      <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-6">
                        Official SDKs
                      </h2>
                    </div>

                    <div className="flex flex-col items-start gap-5 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-[22px] w-full">
                        {sdkData.slice(0, 3).map((sdk, index) => (
                          <Card
                            key={index}
                            className="bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4]"
                          >
                            <CardContent className="flex flex-col items-start gap-2.5 p-4 sm:p-6">
                              <div className="flex items-center justify-between w-full gap-2">
                                <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm sm:text-base tracking-[0] leading-5 break-words">
                                  {sdk.name}
                                </h3>
                                <Badge
                                  className={`${sdk.statusColor} px-2.5 py-[7px] rounded-[5px] h-auto flex-shrink-0`}
                                >
                                  <span
                                    className={`[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium ${sdk.statusTextColor || "text-[#ffffff]"
                                      } text-xs text-center tracking-[0] leading-[9.2px] whitespace-nowrap`}
                                  >
                                    {sdk.status}
                                  </span>
                                </Badge>
                              </div>
                              <p className="flex items-center justify-start w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[14px] sm:text-[15px] tracking-[0] leading-6">
                                Version: {sdk.version}
                              </p>
                              <p className="flex items-center justify-start w-full min-h-6 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[13px] sm:text-[15px] tracking-[0.30px] leading-6 break-all mt-4">
                                {sdk.installCommand}
                              </p>
                              <Button
                                className={`w-full h-[45px] flex items-center justify-center rounded-lg ${sdk.buttonBg} ${sdk.buttonDisabled ? "" : "border border-solid"
                                  } h-auto`}
                                disabled={sdk.buttonDisabled}
                              >
                                <div className="inline-flex items-start gap-[5px]">
                                  <img
                                    className="w-[17px] h-[17px]"
                                    alt="Documentation icon"
                                    src="/fi-8249488.svg"
                                  />
                                  <span
                                    className={`[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium ${sdk.buttonText} text-sm text-center tracking-[-0.20px] leading-[18px] whitespace-nowrap`}
                                  >
                                    {sdk.buttonDisabled
                                      ? "Coming Soon"
                                      : "Documentation"}
                                  </span>
                                </div>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-[22px] w-full">
                        {sdkData.slice(3, 6).map((sdk, index) => (
                          <Card
                            key={index}
                            className="bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4]"
                          >
                            <CardContent className="flex flex-col items-start gap-2.5 p-4 sm:p-6">
                              <div className="flex items-center justify-between w-full gap-2">
                                <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm sm:text-base tracking-[0] leading-5 break-words">
                                  {sdk.name}
                                </h3>
                                <Badge
                                  className={`${sdk.statusColor} px-2.5 py-[7px] rounded-[5px] h-auto flex-shrink-0`}
                                >
                                  <span
                                    className={`[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium ${sdk.statusTextColor || "text-[#ffffff]"
                                      } text-xs text-center tracking-[0] leading-[9.2px] whitespace-nowrap`}
                                  >
                                    {sdk.status}
                                  </span>
                                </Badge>
                              </div>
                              <p className="flex items-center justify-start w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[14px] sm:text-[15px] tracking-[0] leading-6">
                                Version: {sdk.version}
                              </p>
                              <p className="flex items-center justify-start w-full min-h-6 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[13px] sm:text-[15px] tracking-[0.30px] leading-6 break-all mt-4">
                                {sdk.installCommand}
                              </p>
                              <Button
                                className={`w-full h-[45px] flex items-center justify-center rounded-lg ${sdk.buttonBg} ${sdk.buttonDisabled ? "" : "border border-solid"
                                  } h-auto`}
                                disabled={sdk.buttonDisabled}
                              >
                                <div className="inline-flex items-start gap-[5px]">
                                  <img
                                    className="w-[17px] h-[17px]"
                                    alt="Documentation icon"
                                    src="/fi-8249488.svg"
                                  />
                                  <span
                                    className={`[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium ${sdk.buttonText} text-sm text-center tracking-[-0.20px] leading-[18px] whitespace-nowrap`}
                                  >
                                    {sdk.buttonDisabled
                                      ? "Coming Soon"
                                      : "Documentation"}
                                  </span>
                                </div>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                  <CardContent className="flex flex-col items-start gap-[30px] p-4 sm:p-6">
                    <div className="inline-flex items-center gap-2.5">
                      <img
                        className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px]"
                        alt="Code Examples icon"
                        src="/p-2-rounded-lg-bg-accent-13.svg"
                      />
                      <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-6">
                        Code Examples
                      </h2>
                    </div>

                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="flex items-center gap-1.5 sm:gap-2.5 px-1.5 sm:px-2.5 py-0 w-1/4 bg-transparent h-auto overflow-x-auto">
                        {codeExampleTabs.map((tab) => (
                          <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className={`flex-1 min-w-fit rounded-[7.16px] px-2 sm:px-[9.54px] py-2 sm:py-[7.16px] data-[state=active]:border-b-2 data-[state=active]:border-[#27ae60] data-[state=active]:bg-transparent ${activeTab === tab.value
                              ? "[font-family:'Poppins',Helvetica] font-medium text-[#27ae60]"
                              : "[font-family:'Poppins',Helvetica] font-normal text-[#808080]"
                              } text-[12px] sm:text-[13px] text-center tracking-[0] leading-[21.5px] whitespace-nowrap`}
                          >
                            {tab.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      <TabsContent value="nodejs" className="mt-4 sm:mt-[25px]">
                        <div className="flex items-start gap-2.5 px-4 sm:px-[23px] py-4 sm:py-6 w-full min-h-[200px] sm:h-96 bg-[#121728] rounded-[10px] overflow-x-auto">
                          <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#ffffff] text-sm sm:text-base tracking-[0] leading-6 whitespace-pre-wrap">
                            {codeExample}
                          </pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="python" className="mt-4 sm:mt-[25px]">
                        <div className="flex items-start gap-2.5 px-4 sm:px-[23px] py-4 sm:py-6 w-full min-h-[200px] sm:h-96 bg-[#121728] rounded-[10px] overflow-x-auto">
                          <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#ffffff] text-sm sm:text-base tracking-[0] leading-6 whitespace-pre-wrap">
                            {codeExample}
                          </pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="curl" className="mt-4 sm:mt-[25px]">
                        <div className="flex items-start gap-2.5 px-4 sm:px-[23px] py-4 sm:py-6 w-full min-h-[200px] sm:h-96 bg-[#121728] rounded-[10px] overflow-x-auto">
                          <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#ffffff] text-sm sm:text-base tracking-[0] leading-6 whitespace-pre-wrap">
                            {codeExample}
                          </pre>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

            )}

            {activeNav === "Webhooks" && (
              <div className="flex flex-col flex-1 gap-6 w-full">
                <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4]">
                  <CardContent className="p-4 sm:p-6 flex flex-col gap-6 sm:gap-[30px]">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px]"
                              alt="Webhook Configuration"
                              src="/p-2-rounded-lg-bg-accent-11.svg"
                            />
                            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-lg sm:text-xl text-[#003d2b] tracking-[0] leading-6">
                              Webhook Configuration
                            </h2>
                          </div>
                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base tracking-[0] leading-6">
                            Webhooks Allow You To Receive Real-time Notifications
                            About Events In Your Trustverify Account. Configure
                            Endpoint Urls To Receive Http Post Requests When Specific
                            Events Occur.
                          </p>
                        </div>

                        <div className="bg-[#f7f7f7] rounded-[14px] p-4 sm:p-6">
                          <div className="flex flex-col gap-[15px]">
                            <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                              Available Webhook Events:
                            </h3>
                            <div className="flex gap-3">
                              <div className="flex flex-col gap-[26px] pt-1">
                                {webhookEvents.map((_, index) => (
                                  <div
                                    key={index}
                                    className="w-2 h-2 bg-app-primary rounded"
                                  />
                                ))}
                              </div>
                              <ul className="flex flex-col gap-2.5">
                                {webhookEvents.map((event, index) => (
                                  <li
                                    key={index}
                                    className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-app-primary text-xs sm:text-sm tracking-[0] leading-5 sm:leading-6 break-words"
                                  >
                                    {event}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                        <div className="flex flex-col flex-1 gap-2.5">
                          <Label
                            htmlFor="webhook-url"
                            className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6"
                          >
                            Webhook URL
                          </Label>
                          <Input
                            id="webhook-url"
                            defaultValue="https://your-domain.com/webhooks"
                            className="h-[50px] px-4 sm:px-5 py-[15px] bg-[#fcfcfc] rounded-[10px] border border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base"
                          />
                        </div>
                        <div className="flex flex-col flex-1 gap-2.5">
                          <Label
                            htmlFor="secret-key"
                            className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6"
                          >
                            Secret Key
                          </Label>
                          <Input
                            id="secret-key"
                            defaultValue="Auto generated for security"
                            disabled
                            className="h-[50px] px-4 sm:px-5 py-[15px] bg-[#f3f3f3] rounded-[10px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="w-full sm:w-[197px] h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm tracking-[-0.20px] leading-[18px]">
                        Configure Webhooks
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4]">
                  <CardContent className="p-4 sm:p-6 flex flex-col gap-6">
                    <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-6">
                      Webhook Payload Example
                    </h2>
                    <pre className="bg-[#121728] rounded-[10px] p-4 sm:p-6 overflow-x-auto">
                      <code className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-sm sm:text-base tracking-[0] leading-6">
                        {`{
      "event": "transaction.completed",
      "timestamp": "2025-01-19T08:00:00Z",
      "data": {
        "transaction_id": "txn_abc123",
        "amount": 1000.00,
        "currency": "USD",
        "status": "completed",
        "participants": {
          "sender": "user_123",
          "recipient": "user_456"
        }
      },,
      "signature": "sha256=..."
    }`}
                      </code>
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeNav === "Testing" && (
              <Card className="flex-1 bg-[#fcfcfc] rounded-2xl border border-[#e4e4e4] shadow-sm w-full">
                <CardContent className="p-4 sm:p-8 relative pb-20 sm:pb-8">
                  {/* Header */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-4">
                    <img
                      src="/p-2-rounded-lg-bg-accent-15.svg"
                      alt="Testing icon"
                      className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px]"
                    />
                    <div>
                      <h2 className="font-semibold text-[#003d2b] text-lg sm:text-xl leading-6">
                        Testing
                      </h2>
                      <p className="text-[#808080] text-sm sm:text-base leading-6 mt-2">
                        Use Our Sandbox Environment To Test Your Integration Without
                        Affecting Real Transactions Or Incurring Charges.
                      </p>
                    </div>
                  </div>

                  {/* Sandbox Features */}
                  <div className="bg-[#f7f7f7] rounded-xl p-4 sm:p-6 mb-6">
                    <h3 className="font-semibold text-[#003d2b] text-sm sm:text-base leading-6 mb-4">
                      Sandbox Features:
                    </h3>

                    <ul className="flex flex-col gap-3">
                      {sandboxFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start text-xs sm:text-sm text-[#0052cc] leading-5 sm:leading-6">
                          <CheckCircle2Icon className="w-4 h-4 text-[#00cc61] mr-2 mt-0.5 flex-shrink-0" />
                          <span className="break-words">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sandbox Base URL */}
                  <div className="mb-6 sm:mb-8">
                    <h3 className="font-medium text-[#003d2b] text-sm sm:text-base leading-6">
                      Sandbox Base URL:
                    </h3>
                    <p className="text-[#808080] text-sm sm:text-base leading-6 mt-1 break-all">
                      https://sandbox-api.trustverify.io/v1
                    </p>
                  </div>

                  {/* Access Button */}
                  <Button className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:right-6 sm:left-auto sm:w-[230px] h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white font-semibold text-sm tracking-[-0.2px] leading-[18px] hover:opacity-90 transition-opacity">
                    Access Sandbox Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeNav === "Examples" && (
              <div className="flex flex-col flex-1 items-start gap-6 w-full">
                <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4]">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col items-start gap-6 sm:gap-[30px]">
                      <div className="inline-flex items-center gap-2.5">
                        <img
                          className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px]"
                          alt="Integration Examples"
                          src="/p-2-rounded-lg-bg-accent-12.svg"
                        />
                        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-6">
                          Integration Examples
                        </h2>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-[22px] w-full">
                        {integrationExamples.map((example, index) => (
                          <Card
                            key={index}
                            className="flex-1 bg-[#fcfcfc] rounded-[10px] border border-[#e4e4e4] w-full"
                          >
                            <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
                              <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm sm:text-base tracking-[0] leading-5">
                                {example.title}
                              </h3>
                              <p className="flex items-center justify-start [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[14px] sm:text-[15px] tracking-[0] leading-6">
                                {example.description}
                              </p>
                              <Button
                                variant="outline"
                                className="w-full h-[45px] rounded-lg border border-[#27ae60] hover:bg-[#27ae60]/10"
                              >
                                <img
                                  className="w-[17px] h-[18px]"
                                  alt="View"
                                  src={example.icon}
                                />
                                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-app-secondary text-sm text-center tracking-[-0.20px] leading-[18px] whitespace-nowrap">
                                  {example.buttonText}
                                </span>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4]">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col items-start gap-6 sm:gap-[30px]">
                      <div className="inline-flex items-center gap-2.5">
                        <img
                          className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px]"
                          alt="Download Resources"
                          src="/p-2-rounded-lg-bg-accent-16-1.svg"
                        />
                        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-6">
                          Download Resources
                        </h2>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-[22px] w-full">
                        {downloadResources.map((resource, index) => (
                          <Card
                            key={index}
                            className="flex-1 bg-[#fcfcfc] rounded-[10px] border border-[#e4e4e4] w-full"
                          >
                            <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
                              <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm sm:text-base tracking-[0] leading-5">
                                {resource.title}
                              </h3>
                              <p className="flex items-center justify-start [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[14px] sm:text-[15px] tracking-[0] leading-6">
                                {resource.description}
                              </p>
                              <Button
                                variant="outline"
                                className="w-full h-[45px] rounded-lg border border-[#27ae60] hover:bg-[#27ae60]/10"
                              >
                                <img
                                  className="w-[17px] h-[18px]"
                                  alt="Download"
                                  src={resource.icon}
                                />
                                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-app-secondary text-sm text-center tracking-[-0.20px] leading-[18px] whitespace-nowrap">
                                  {resource.buttonText}
                                </span>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
