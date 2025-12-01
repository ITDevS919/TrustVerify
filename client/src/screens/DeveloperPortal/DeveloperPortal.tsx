import { useState } from "react";
import React from "react";
import { X, Clock, Copy, Eye, Trash2, ChevronDown } from "lucide-react";
import { HeaderDemo } from "../../components/HeaderDemo";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { PlayIcon } from "lucide-react";
import { CalculatorIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const scoreBreakdown = [
  { label: "Account Age:", points: "+25 points" },
  { label: "Transaction History:", points: "+20 Points" },
  { label: "KYC Verification:", points: "+30 Points" },
  { label: "Clean Record:", points: "+12 Points" },
];

const recommendations = [
  "Allow high-value transactions",
  "Minimal verification required",
  "Suitable for premium features",
];

const navigationItems = [
  { label: "Demo", isActive: true },
  { label: "Business", isActive: false },
  { label: "Developers", isActive: false },
  { label: "Pricing", isActive: false },
  { label: "Support", isActive: false },
];

const metricCards = [
  {
    icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-10.svg",
    label: "API Calls Today",
    value: "2,847",
    trend: "+12%",
    trendText: "From yesterday",
    trendColor: "text-[#436cc8]",
    iconSrc: "/fi-55925180.svg",
  },
  {
    icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-20.svg",
    label: "Success Rate",
    value: "99.8%",
    badge: "Excellent Performance",
    badgeColor: "bg-app-secondary",
  },
  {
    icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-30.svg",
    label: "Avg Response",
    value: "42ms",
    badge: "Lightning Fast",
    badgeColor: "bg-[#d094dd]",
    badgeIcon: "/vector0.svg",
  },
];

const sidebarNavigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "/icon0.svg",
    active: true,
  },
  {
    id: "api-keys",
    label: "API Keys",
    icon: "/fi-8750790.svg",
    active: false,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "/fi-15489140.svg",
    active: false,
  },
  {
    id: "documentation",
    label: "Documentation",
    icon: "/fi-29911060.svg",
    active: false,
  },
  {
    id: "api-sandbox",
    label: "API Sandbox",
    icon: "/fi-18896210.svg",
    active: false,
  },
  {
    id: "trust-simulator",
    label: "Trust Simulator",
    icon: "/fi-14895910.svg",
    active: false,
  },
  {
    id: "support",
    label: "Support",
    icon: "/fi-16601650.svg",
    active: false,
  },
];

const dashboardMetricCards = [
  {
    icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-10.svg",
    label: "API Calls Today",
    value: "2,847",
    badge: {
      icon: "/fi-55925180.svg",
      text: "+12%",
      textColor: "text-[#436cc8]",
      subtext: " From yesterday",
    },
  },
  {
    icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-20.svg",
    label: "Success Rate",
    value: "99.8%",
    badge: {
      dot: true,
      text: "Excellent Performance",
      textColor: "text-app-secondary",
    },
  },
  {
    icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-30.svg",
    label: "Avg Response",
    value: "42ms",
    badge: {
      icon: "/vector0.svg",
      text: "Lightning Fast",
      textColor: "text-[#d094dd]",
    },
  },
  {
    icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar0.svg",
    label: "Active Users",
    value: "156",
    badge: {
      icon: "/fi-7473760.svg",
      text: "+8 New today",
      textColor:
        "bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]",
    },
  },
];

const systemStatusRows = [
  {
    label: "Account Status",
    value: "Processing",
    badge: true,
    badgeVariant: "warning",
  },
  {
    label: "Api Keys",
    value: "3 Active",
    badge: false,
  },
  {
    label: "Monthly Quota",
    value: "2,847 / 10,000",
    badge: false,
  },
];

const quickActions = [
  {
    icon: "/fi-20990580.svg",
    label: "Manage API Keys",
  },
  {
    icon: "/fi-82494880.svg",
    label: "View Documentation",
  },
  {
    icon: "/fi-8750730.svg",
    label: "Test API Endpoints",
  },
  {
    icon: "/fi-5286180.svg",
    label: "View Analytics",
  },
];

const recentActivities = [
  {
    title: "Fraud Analysis Completed",
    time: "2 Mins Ago",
  },
  {
    title: "Trust Score Calculated",
    time: "5 Mins Ago",
  },
  {
    title: "Risk Assessment Processed",
    time: "8 Mins Ago",
  },
];

const systemAlerts = [
  {
    icon: "/fi-2723400.svg",
    title: "Account Verification Pending",
    description: "Complete Verification To Unlock Full Features",
    borderColor: "border-yellow-500",
  },
  {
    icon: "/fi-65772550.svg",
    title: "New Api Version Available",
    description: "V2.1.0 Includes Performance Improvements",
    borderColor: "border-[#312fb5]",
  },
  {
    icon: "/fi-1026490.svg",
    title: "Security Scan Completed",
    description: "No Vulnerabilities Detected",
    borderColor: "border-[#27ae60]",
  },
];

const documentationResources = [
  { icon: "/fi-7871158.svg", label: "API References" },
  { icon: "/fi-3573187.svg", label: "SDK Documentation" },
  { icon: "/fi-4618560.svg", label: "Integration Examples" },
  { icon: "/fi-9374883.svg", label: "Contact Support" },
];

const apiEndpoints = [
  {
    method: "POST",
    endpoint: "/api/fraud/analyze",
    badgeColor: "bg-[#3f4ef833] text-[#3f4ef8]",
  },
  {
    method: "POST",
    endpoint: "/api/kyc/submit",
    badgeColor: "bg-[#27ae6033] text-[#27ae60]",
  },
  {
    method: "POST",
    endpoint: "/api/transactions/create",
    badgeColor: "bg-[#a308f733] text-[#a308f7]",
  },
];

const supportOptions = [
  {
    icon: "/fi-6460943.svg",
    text: "Email Support (api-support@trustverify.com)",
  },
  {
    icon: "/fi-20109903.svg",
    text: "Join Developer Slack Community",
  },
  {
    icon: "/fi-109946493.svg",
    text: "Live Chat Support",
  },
];

const developerResources = [
  {
    icon: "/fi-7871158.svg",
    text: "API Reference Documentation",
  },
  {
    icon: "/fi-4618560.svg",
    text: "SDK Integration Guides",
  },
  {
    icon: "/fi-3573187.svg",
    text: "Code Samples & Examples",
  },
  {
    icon: "/fi-174963053.svg",
    text: "API Status & Uptime",
  },
];

const faqs = [
  {
    question: "How Do I Get Started With The Api?",
    answer:
      "First, Create Your Developer Account And Generate An Api Key. Then Check Out Our Quickstart Guide In The Documentation Tab.",
  },
  {
    question: "What Are The Rate Limits?",
    answer:
      "Free Tier: 1,000 Calls/month. Paid Plans Start At 10,000 Calls/month. Enterprise Plans Have Custom Limits.",
  },
  {
    question: "How Accurate Is The Fraud Detection?",
    answer:
      "Our Ai Models Achieve 99.8% Accuracy With Less Than 0.1% False Positive Rate Across All Transaction Types.",
  },
  {
    question: "Do You Offer Webhooks For Real-time Notifications?",
    answer:
      "Yes! We Support Webhooks For All Major Events. Check The Api Reference For Webhook Configuration Details.",
  },
];

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  isVisible: boolean;
}

export const DeveloperPortal = (): JSX.Element => {
  const [activeNavItem, setActiveNavItem] = useState<string>("dashboard");
  const [showCreateApiKeyModal, setShowCreateApiKeyModal] =
    useState<boolean>(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="bg-[#f6f6f6] w-full flex flex-col">
      <HeaderDemo />
      {/* Header Section with Title and Menu Button */}
      <section className="md:hidden flex flex-col items-start gap-2.5 w-full pb-4 md:px-8 md:py-6">
        <div className="flex items-center justify-start gap-2.5 md:justify-start w-full bg-white py-5 px-4 md:px-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2.5 transition-colors flex-shrink-0"
            aria-label="Toggle dashboard menu"
          >
            <img className="w-5 h-5" alt="Menu" src="/fi-9091429.png" />
          </button>

          <div className=" flex flex-col items-start md:items-start gap-2 flex-1">
            <h1 className="w-auto mt-[-1.00px] bg-[linear-gradient(90deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-transparent text-2xl md:text-3xl lg:text-[26px] tracking-[0] leading-[26px] whitespace-nowrap">
              Developer Portal
            </h1>

            <p className="w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base tracking-[0] leading-[normal] text-left md:text-left">
              API Management Hub
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-1 w-full relative">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <nav
          className={`hidden lg:flex flex-col items-start gap-2.5 rounded-[0px_0px_20px_0px] overflow-hidden border border-solid border-[#e4e4e4] shadow-[2px_0px_20px_#27ae6033] w-[330px] bg-white`}
        >
          <div className="min-w-[290px] bg-white h-full">
            <div className="flex flex-col items-start gap-2 px-9 pt-9 pb-6">
              <h1 className="self-stretch mt-[-1.00px] bg-[linear-gradient(90deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-transparent text-[26px] tracking-[0] leading-[26px] whitespace-nowrap">
                Developer Portal
              </h1>

              <p className="flex items-center justify-start self-stretch [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm tracking-[0] leading-[normal]">
                API Management Hub
              </p>
            </div>

            <Separator className="w-full h-px bg-[url(/separator0.svg)] bg-cover bg-[50%_50%]" />

            <div className="flex flex-col items-start gap-2.5 px-[23px] pt-[23px] pb-6">
              {sidebarNavigationItems.map((item) => {
                const isActive = activeNavItem === item.id;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => {
                      setActiveNavItem(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between w-full h-auto p-2.5 rounded-[10px] ${
                      isActive
                        ? "bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)]"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="inline-flex items-center gap-3">
                      <img
                        className="w-6 h-6"
                        alt={item.label}
                        src={item.icon}
                      />

                      <span
                        className={`mt-[-1.00px] text-sm md:text-base tracking-[-0.32px] leading-[30px] whitespace-nowrap ${
                          isActive
                            ? "[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white"
                            : "[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#c4c4c4]"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>

                    {isActive && (
                      <div className="w-1 h-[26px] bg-white rounded-[25px]" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </nav>

        {activeNavItem === "dashboard" && (
          <section className="flex flex-col items-start gap-[25px] w-full p-4 md:p-6 lg:p-8">
            <div className="flex flex-col items-start gap-[31px] w-full">
              <div className="flex flex-col items-start gap-2.5 w-full">
                <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl md:text-3xl lg:text-[40px] tracking-[0] leading-[normal]">
                  Dashboard
                </h1>

                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base lg:text-lg tracking-[0] leading-6 md:leading-8">
                  Monitor your API performance and security metrics in real-time
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-[33.68px] w-full">
                {dashboardMetricCards.map((card, index) => (
                  <Card
                    key={index}
                    className="bg-[#fcfcfc] rounded-[18.2px] border-[0.73px] border-solid border-[#e4e4e4]"
                  >
                    <CardContent className="p-4 md:p-6 lg:p-7">
                      <div className="flex items-start gap-3 md:gap-4 lg:gap-[18px]">
                        <img
                          className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0"
                          alt={card.label}
                          src={card.icon}
                        />

                        <div className="flex flex-col items-start gap-2 md:gap-3 lg:gap-[15px] flex-1 min-w-0">
                          <div className="flex flex-col items-start gap-1 md:gap-[4.55px] w-full">
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs md:text-sm lg:text-[16.4px] tracking-[0] leading-[normal]">
                              {card.label}
                            </div>

                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl md:text-2xl lg:text-[32.8px] tracking-[0] leading-tight md:leading-[35.2px]">
                              {card.value}
                            </div>
                          </div>

                          <div className="flex items-center gap-[7.28px] w-full">
                            {card.badge.dot && (
                              <div className="w-[6.37px] h-[6.37px] bg-app-secondary rounded-[3.19px]" />
                            )}
                            {card.badge.icon && (
                              <img
                                className="w-[20.02px] h-[19.11px]"
                                alt="Badge icon"
                                src={card.badge.icon}
                              />
                            )}

                            <div
                              className={`[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[12.7px] tracking-[0] leading-[normal] ${
                                card.badge.dot ? "text-center" : ""
                              }`}
                            >
                              <span className={card.badge.textColor}>
                                {card.badge.text}
                              </span>
                              {card.badge.subtext && (
                                <span className="text-[#808080]">
                                  {card.badge.subtext}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start gap-6 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_462px] gap-4 md:gap-6 w-full">
                <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2.5 mb-[30px]">
                      <img
                        className="w-[46px] h-[46px]"
                        alt="System Status"
                        src="/p-2-rounded-lg-bg-accent-100.svg"
                      />

                      <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm md:text-xl tracking-[0] leading-6 whitespace-nowrap">
                        System Status &amp; Account Overview
                      </h2>
                    </div>

                    <div className="flex flex-col gap-[15px]">
                      {systemStatusRows.map((row, index) => (
                        <div
                          key={index}
                          className="flex items-center h-[72px] bg-[#f6f6f6] rounded-[14px] px-6"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-lg tracking-[0] leading-6">
                              {row.label}
                            </div>

                            {row.badge ? (
                              <Badge className="bg-[#eab30833] text-yellow-500 hover:bg-[#eab30833] rounded-[528.3px] px-3 py-[9px] h-auto">
                                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[9.2px]">
                                  {row.value}
                                </span>
                              </Badge>
                            ) : (
                              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg tracking-[0] leading-7 whitespace-nowrap">
                                {row.value}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2.5 mb-[30px]">
                      <img
                        className="w-[46px] h-[46px]"
                        alt="Quick Actions"
                        src="/p-2-rounded-lg-bg-accent-10-1.svg"
                      />

                      <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6 whitespace-nowrap">
                        Quick Actions
                      </h2>
                    </div>

                    <div className="flex flex-col gap-[13px]">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          className="flex items-center gap-3 h-[60px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] px-4 hover:bg-[#f6f6f6] transition-colors cursor-pointer"
                        >
                          <img
                            className="w-6 h-6"
                            alt={action.label}
                            src={action.icon}
                          />

                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-5 whitespace-nowrap">
                            {action.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_462px] gap-4 md:gap-6 w-full">
                <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2.5 mb-[30px]">
                      <img
                        className="w-[46px] h-[46px]"
                        alt="Recent Activity"
                        src="/p-2-rounded-lg-bg-accent-10-10.svg"
                      />

                      <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6 whitespace-nowrap">
                        Recent API Activity
                      </h2>
                    </div>

                    <div className="flex flex-col gap-4">
                      {recentActivities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center h-20 bg-[#f6f6f6] rounded-[20px] px-[23px]"
                        >
                          <div className="w-[11px] h-[11px] bg-app-secondary rounded-[5.5px]" />

                          <div className="flex flex-col ml-3.5 flex-1">
                            <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base tracking-[0] leading-6">
                              {activity.title}
                            </div>

                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm tracking-[0] leading-6">
                              {activity.time}
                            </div>
                          </div>

                          <Badge className="bg-[#27ae6033] text-[#27ae60] hover:bg-[#27ae6033] rounded-[528.3px] px-3 py-[9px] h-auto">
                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[9.2px]">
                              Success
                            </span>
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2.5 mb-[30px]">
                      <img
                        className="w-[46px] h-[46px]"
                        alt="System Alerts"
                        src="/p-2-rounded-lg-bg-accent-10-30.svg"
                      />

                      <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6 whitespace-nowrap">
                        System Alerts
                      </h2>
                    </div>

                    <div className="flex flex-col gap-3">
                      {systemAlerts.map((alert, index) => (
                        <Card
                          key={index}
                          className={`bg-[#fcfcfc] rounded-[10px] border-[0.8px] border-solid ${alert.borderColor}`}
                        >
                          <CardContent className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <img
                                className="w-7 h-7"
                                alt={alert.title}
                                src={alert.icon}
                              />

                              <div className="flex flex-col flex-1">
                                <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-[15px] tracking-[0] leading-6">
                                  {alert.title}
                                </div>

                                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs tracking-[0] leading-6">
                                  {alert.description}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {activeNavItem === "api-keys" && (
          <main className="flex w-full relative flex-col items-start gap-[30px] p-4 md:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative self-stretch w-full flex-[0_0_auto] gap-4">
              <div className="flex flex-col flex-1 items-start gap-2.5 relative">
                <h2 className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl md:text-3xl lg:text-[40px] tracking-[0] leading-[normal]">
                  API Keys
                </h2>

                <p className="relative flex items-center justify-center w-fit [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base lg:text-lg tracking-[0] leading-6 md:leading-8">
                  Manage your API keys for secure authentication
                </p>
              </div>

              <Button
                onClick={() => setShowCreateApiKeyModal(true)}
                className="relative w-full sm:w-[223px] h-12 sm:h-14 rounded-[10px] overflow-hidden bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
              >
                <div className="relative w-[171px] h-6">
                  <div className="absolute top-[calc(50.00%_-_10px)] left-[calc(50.00%_-_52px)] w-[139px] h-[18px] flex items-center justify-center">
                    <span className="flex items-center justify-center h-[18px] -ml-0.5 w-[137px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-white text-lg text-center tracking-[-0.20px] leading-[18px] whitespace-nowrap">
                      Create New Key
                    </span>
                  </div>

                  <img
                    className="absolute top-[calc(50.00%_-_12px)] right-[147px] w-6 h-6"
                    alt="Fi"
                    src="/fi-12194587.svg"
                  />
                </div>
              </Button>
            </div>

            {apiKeys.length === 0 ? (
              <Card className="relative self-stretch w-full min-h-[497px] bg-[#fcfcfc] rounded-[20px] overflow-hidden border-[0.8px] border-solid border-[#e4e4e4]">
                <CardContent className="flex flex-col max-w-[391px] mx-auto items-center gap-[30px] relative top-[calc(50.00%_-_136px)] p-6 md:p-0">
                  <div className="flex flex-col items-center gap-[27px] relative self-stretch w-full flex-[0_0_auto]">
                    <img
                      className="relative w-16 h-16 md:w-20 md:h-20 lg:w-[85px] lg:h-[85px]"
                      alt="Fi"
                      src="/fi-25820267.svg"
                    />

                    <div className="flex flex-col min-h-[83px] items-center gap-2.5 relative self-stretch w-full">
                      <h3 className="relative flex items-center justify-center self-stretch mt-[-1.00px] [font-family:'DM_Sans_18pt-ExtraBold',Helvetica] font-extrabold text-[#003d2b] text-xl md:text-2xl text-center tracking-[0] leading-6">
                        No Api Keys
                      </h3>

                      <p className="relative flex items-center justify-center flex-1 self-stretch [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base text-center tracking-[0] leading-6 md:leading-[26px] px-4">
                        Create Your First Api Key To Start Using The Trustverify
                        Api.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowCreateApiKeyModal(true)}
                    className="relative w-full sm:w-[209px] h-12 bg-[#27ae60] rounded-[10px] overflow-hidden hover:bg-[#27ae60]/90"
                  >
                    <span className="flex items-center justify-center h-[18px] -ml-0.5 w-[157px] [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-base text-center tracking-[-0.20px] leading-[18px] whitespace-nowrap">
                      Create Your First Key
                    </span>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                {apiKeys.map((apiKey) => (
                  <Card
                    key={apiKey.id}
                    className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4]"
                  >
                    <CardContent className="p-4 md:p-6 lg:p-7">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 md:gap-[27px]">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="inline-flex items-start gap-3 md:gap-[13px]">
                              <img
                                className="w-10 h-10 md:w-12 md:h-12 lg:w-[54px] lg:h-[54px] flex-shrink-0"
                                alt="Div flex"
                                src="/p-2-rounded-lg-bg-accent-10.svg"
                              />
                              <div className="flex flex-col gap-1 md:gap-[5px] min-w-0 flex-1">
                                <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base md:text-lg lg:text-xl tracking-[0] leading-6 break-words">
                                  {apiKey.name}
                                </div>
                                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs md:text-sm tracking-[0] leading-6">
                                  Created On {apiKey.createdAt}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Badge className="bg-[#27ae6033] text-[#27ae60] hover:bg-[#27ae6033] px-2 md:px-3 py-2 md:py-2.5 rounded-[528.3px] h-auto">
                                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs md:text-sm tracking-[0] leading-[9.2px]">
                                  Active
                                </span>
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 md:w-9 md:h-9 p-0"
                                onClick={() => {
                                  setApiKeys(
                                    apiKeys.filter(
                                      (key) => key.id !== apiKey.id
                                    )
                                  );
                                }}
                              >
                                <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-[#808080]" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 md:gap-4">
                            <div className="flex flex-col flex-1 gap-2 md:gap-[11px] min-w-0">
                              <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm md:text-base tracking-[0] leading-[normal]">
                                API Key
                              </div>
                              <div className="flex items-center gap-2.5 px-3 md:px-5 py-2 md:py-[9px] bg-[#f0f0f0] rounded-lg min-h-[36px] md:h-9">
                                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs tracking-[0] leading-[normal] break-all">
                                  {apiKey.isVisible
                                    ? apiKey.key
                                    : `${apiKey.key.substring(
                                        0,
                                        12
                                      )}${"*".repeat(apiKey.key.length - 12)}`}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 md:w-9 md:h-9 p-0"
                                onClick={() => {
                                  navigator.clipboard.writeText(apiKey.key);
                                }}
                              >
                                <Copy className="w-4 h-4 md:w-5 md:h-5 text-[#808080]" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 md:w-9 md:h-9 p-0"
                                onClick={() => {
                                  setApiKeys(
                                    apiKeys.map((key) =>
                                      key.id === apiKey.id
                                        ? { ...key, isVisible: !key.isVisible }
                                        : key
                                    )
                                  );
                                }}
                              >
                                <Eye className="w-4 h-4 md:w-5 md:h-5 text-[#808080]" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-[5px]">
                          <Clock className="w-3.5 h-3.5 text-[#808080]" />
                          <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm tracking-[0] leading-[normal]">
                            Last Used: {apiKey.lastUsed}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {showCreateApiKeyModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="w-full max-w-[644px] bg-white rounded-[17.34px] p-4 md:p-6 relative my-4">
                  <button
                    onClick={() => setShowCreateApiKeyModal(false)}
                    className="absolute top-3 md:top-[19px] right-3 md:right-[20px] w-[30px] h-[30px] flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-[#808080]" />
                  </button>
                  <div className="flex flex-col gap-6 md:gap-9 pr-0 md:pr-12">
                    <div className="flex flex-col gap-5 md:gap-7">
                      <div className="flex flex-col gap-2.5 max-w-full md:max-w-[479px]">
                        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg md:text-xl leading-6">
                          Create New API Key
                        </h2>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base leading-normal">
                          Generate a new API key for secure access to
                          TrustVerify services
                        </p>
                      </div>
                      <div className="flex flex-col gap-2.5">
                        <div className="flex flex-col gap-2.5">
                          <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm md:text-base leading-6">
                            Key Name
                          </Label>
                          <Input
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            placeholder="e.g Production API Key, Development Key etc..."
                            className="h-[50px] px-4 md:px-5 py-[15px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base placeholder:text-[#808080]"
                          />
                        </div>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs leading-normal">
                          *Choose a descriptive name to help you identify this
                          key later.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 md:gap-4">
                      <Button
                        variant="ghost"
                        onClick={() => setShowCreateApiKeyModal(false)}
                        className="w-full sm:w-auto h-12 md:h-14 bg-[#f3f3f3] rounded-lg hover:bg-[#e8e8e8] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#adadad] text-sm md:text-base tracking-[-0.20px]"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          if (newKeyName.trim()) {
                            const newKey: ApiKey = {
                              id: Date.now().toString(),
                              name: newKeyName.trim(),
                              key: `tv_${Math.random()
                                .toString(36)
                                .substring(2, 15)}${Math.random()
                                .toString(36)
                                .substring(2, 15)}`,
                              createdAt: new Date().toLocaleDateString("en-GB"),
                              lastUsed: "Never",
                              isVisible: false,
                            };
                            setApiKeys([...apiKeys, newKey]);
                            setNewKeyName("");
                            setShowCreateApiKeyModal(false);
                          }
                        }}
                        className="w-full sm:w-auto sm:flex-1 h-12 md:h-14 bg-[#27ae60] rounded-lg hover:bg-[#229954] [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm md:text-base tracking-[-0.20px]"
                      >
                        Create API Key
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        )}

        {activeNavItem === "analytics" && (
          <section className="flex flex-col items-start gap-[30px] w-full p-4 md:p-6 lg:p-8">
            <header className="flex flex-col items-start gap-2.5">
              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl md:text-3xl lg:text-[40px] tracking-[0] leading-[normal]">
                Usage Analytics
              </h2>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base lg:text-lg tracking-[0] leading-6 md:leading-8">
                Track your API usage and performance metrics
              </p>
            </header>

            <div className="flex flex-col items-start gap-[25px] w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-[34px] w-full">
                {metricCards.map((card, index) => (
                  <Card
                    key={index}
                    className="w-full min-h-[141.07px] bg-[#fcfcfc] rounded-[18.2px] border-[0.73px] border-solid border-[#e4e4e4]"
                  >
                    <CardContent className="p-4 md:p-6 lg:p-7">
                      <div className="flex items-start gap-3 md:gap-4 lg:gap-[18px]">
                        <img
                          className="w-12 h-12 md:w-14 md:h-14 lg:w-[70.21px] lg:h-[70.21px] flex-shrink-0"
                          alt={card.label}
                          src={card.icon}
                        />
                        <div className="flex flex-col items-start gap-2 md:gap-3 lg:gap-[15px] flex-1 min-w-0">
                          <div className="flex flex-col items-start gap-1 md:gap-[4.55px]">
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs md:text-sm lg:text-[16.4px] tracking-[0] leading-[normal]">
                              {card.label}
                            </div>
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl md:text-2xl lg:text-[32.8px] tracking-[0] leading-tight md:leading-[35.2px]">
                              {card.value}
                            </div>
                          </div>
                          {card.trend && (
                            <div className="flex items-center gap-[7.28px]">
                              <img
                                className="w-[20.02px] h-[19.11px]"
                                alt="Trend"
                                src={card.iconSrc}
                              />
                              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[14.6px] tracking-[0] leading-[normal]">
                                <span className={card.trendColor}>
                                  {card.trend}
                                </span>
                                <span className="text-[#808080]">
                                  {" "}
                                  {card.trendText}
                                </span>
                              </div>
                            </div>
                          )}
                          {card.badge && (
                            <div className="flex items-center gap-[4.55px]">
                              {card.badgeIcon && (
                                <img
                                  className="w-[9.25px] h-[10.17px]"
                                  alt="Badge icon"
                                  src={card.badgeIcon}
                                />
                              )}
                              {!card.badgeIcon && (
                                <div
                                  className={`w-[6.37px] h-[6.37px] ${card.badgeColor} rounded-[3.19px]`}
                                />
                              )}
                              <div
                                className={`[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[12.7px] text-center tracking-[0] leading-[12.7px] ${
                                  card.badgeColor === "bg-app-secondary"
                                    ? "text-app-secondary"
                                    : "text-[#d094dd]"
                                }`}
                              >
                                {card.badge}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-6 w-full">
                <Card className="w-full lg:flex-1 min-w-0 h-auto lg:h-[356px] bg-[#fcfcfc] rounded-[20px] overflow-hidden border-[0.8px] border-solid border-[#e4e4e4]">
                  <CardContent className="p-4 md:p-6 lg:p-0 relative h-full min-h-[300px] lg:min-h-[356px]">
                    <div className="absolute top-4 md:top-6 lg:top-[29px] left-4 md:left-6 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base md:text-lg lg:text-xl tracking-[0] leading-6">
                      API Usage Over Time
                    </div>
                    <button className="absolute top-4 md:top-6 right-4 md:right-6 w-[91px] h-[33px] flex items-center justify-center bg-[#f2f2f2] rounded-md hover:bg-[#e8e8e8] transition-colors">
                      <div className="flex items-center justify-end gap-[9px] px-2">
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xs tracking-[-0.24px] leading-5">
                          Monthly
                        </span>
                        <ChevronDown className="w-[19px] h-[19px] text-[#808080]" />
                      </div>
                    </button>
                    <div className="absolute top-16 md:top-20 lg:top-[84px] left-1/2 -translate-x-1/2 lg:left-[calc(50.00%_-_354px)] lg:translate-x-0 w-[90%] md:w-[80%] lg:w-[711px] h-[200px] md:h-[220px] lg:h-[242px]">
                      <div className="absolute top-[204px] left-11 w-[576px] h-[38px] flex justify-between">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(
                          (month, index) => (
                            <div key={index} className="relative">
                              <div className="[-webkit-text-stroke:1px_#808080] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-transparent text-xs tracking-[0] leading-[normal]">
                                {month}
                              </div>
                              <img
                                className="absolute w-0 h-[7px] top-[-16px] left-1/2"
                                alt="Tick"
                                src="/vector.svg"
                              />
                            </div>
                          )
                        )}
                      </div>
                      <div className="absolute top-0 left-0 w-[45px] h-[211px] flex flex-col justify-between">
                        {["2000", "1000", "500", "100", "0"].map(
                          (value, index) => (
                            <div
                              key={index}
                              className="relative flex items-center justify-end"
                            >
                              <div className="[-webkit-text-stroke:1px_#808080] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-transparent text-xs text-right tracking-[0] leading-[normal]">
                                {value}
                              </div>
                              <img
                                className="absolute w-[6px] h-0 right-[-8px] object-cover"
                                alt="Tick"
                                src="/vector-1 2.svg"
                              />
                            </div>
                          )
                        )}
                      </div>
                      <img
                        className="absolute top-2 left-11 w-[667px] h-[197px]"
                        alt="Chart"
                        src="/group-1000004615.png"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-full lg:flex-1 min-w-0 h-auto lg:h-[356px] bg-[#fcfcfc] rounded-[20px] overflow-hidden border-[0.8px] border-solid border-[#e4e4e4]">
                  <CardContent className="p-4 md:p-6 lg:p-0 relative h-full min-h-[300px] lg:min-h-[356px]">
                    <div className="absolute top-4 md:top-6 lg:top-[29px] left-4 md:left-6 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base md:text-lg lg:text-xl tracking-[0] leading-6">
                      Response Time Trends
                    </div>
                    <button className="absolute top-4 md:top-6 right-4 md:right-6 w-[91px] h-[33px] flex items-center justify-center bg-[#f2f2f2] rounded-md hover:bg-[#e8e8e8] transition-colors">
                      <div className="flex items-center justify-end gap-[9px] px-2">
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xs tracking-[-0.24px] leading-5">
                          Monthly
                        </span>
                        <ChevronDown className="w-[19px] h-[19px] text-[#808080]" />
                      </div>
                    </button>
                    <div className="absolute top-16 md:top-20 lg:top-[78px] left-4 md:left-6 w-[90%] md:w-[80%] lg:w-[690px] h-[200px] md:h-[220px] lg:h-[248px]">
                      <div className="absolute w-full h-[87.90%] top-[12.10%] left-0">
                        <div className="absolute bottom-0 left-0 right-0 flex justify-around px-[10%]">
                          {[
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                          ].map((month, index) => (
                            <div
                              key={index}
                              className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xs text-center tracking-[0] leading-[9px]"
                            >
                              {month}
                            </div>
                          ))}
                        </div>
                        <img
                          className="absolute w-[85.99%] h-[81.65%] top-0 left-[10.57%]"
                          alt="Line chart"
                          src="/line.png"
                        />
                        <div className="absolute left-0 top-0 bottom-[50px] flex flex-col justify-between">
                          {["80%", "60%", "40%", "20%"].map((value, index) => (
                            <div
                              key={index}
                              className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xs tracking-[0] leading-[9px]"
                            >
                              {value}
                            </div>
                          ))}
                        </div>
                      </div>
                      <img
                        className="absolute top-5 left-[76px] w-[614px] h-[195px]"
                        alt="Grid"
                        src="/frame-57.svg"
                      />
                      <img
                        className="absolute top-0 left-[116px] w-[574px] h-[195px]"
                        alt="Grid overlay"
                        src="/frame-58.svg"
                      />
                      <img
                        className="absolute w-[86.81%] h-[81.85%] top-[5.65%] left-[10.58%]"
                        alt="Data points"
                        src="/point.png"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {activeNavItem === "documentation" && (
          <main className="flex-0 p-4 md:p-6 lg:p-8 w-full">
            <div className="flex flex-col gap-[30px] max-w-[1546px]">
              <div className="flex flex-col gap-2.5">
                <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl md:text-3xl lg:text-[40px] tracking-[0] leading-[normal]">
                  Help Center
                </h2>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base lg:text-lg tracking-[0] leading-6 md:leading-8">
                  Track your API usage and performance metrics
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] overflow-hidden">
                  <CardContent className="p-6 flex flex-col gap-[34px]">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                      Quick Start
                    </h3>
                    <div className="bg-[#121728] rounded-[10px] px-[23px] py-6">
                      <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#27ae60] text-base tracking-[0] leading-[27px]">
                        {`# Install the TrustVerify SDK
npm install @trustverify/sdk

# Initialize the client
const trustverify = new TrustVerify({
  apiKey: "your_api_key",
  environment: "production"
});`}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] overflow-hidden">
                  <CardContent className="p-6 flex flex-col gap-[30px]">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                      Documentation &amp; Resources
                    </h3>
                    <div className="flex flex-col gap-[13px]">
                      {documentationResources.map((resource, index) => (
                        <button
                          key={index}
                          className="flex items-center gap-3 h-[60px] px-4 bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4]"
                        >
                          <img
                            className="w-6 h-6"
                            alt={resource.label}
                            src={resource.icon}
                          />
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-5 whitespace-nowrap">
                            {resource.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        )}

        {activeNavItem === "api-sandbox" && (
          <section className="flex flex-col items-start gap-[30px] w-full p-4 md:p-6 lg:p-8">
            <div className="flex flex-col items-start gap-2.5">
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl md:text-3xl lg:text-[40px] tracking-[0] leading-[normal]">
                API Testing Sandbox
              </h1>

              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base lg:text-lg tracking-[0] leading-6 md:leading-8">
                Test your API calls in real-time with our interactive sandbox
                environment.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 md:gap-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-start gap-[30px]">
                      <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                        Documentation &amp; Resources
                      </h2>

                      <div className="flex flex-col items-start gap-[15px] w-full">
                        {apiEndpoints.map((item, index) => (
                          <div
                            key={index}
                            className="w-full bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] p-5 cursor-pointer hover:border-[#003d2b] transition-colors"
                          >
                            <div className="inline-flex items-center gap-2.5">
                              <Badge
                                className={`${item.badgeColor} px-2.5 py-[7px] rounded-[5px] h-auto`}
                              >
                                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs text-center tracking-[0] leading-[9.2px]">
                                  {item.method}
                                </span>
                              </Badge>

                              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0.48px] leading-5">
                                {item.endpoint}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-start gap-[34px]">
                      <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                        Request Builder
                      </h2>

                      <div className="flex flex-col items-start gap-4 w-full">
                        <div className="w-full bg-[#121728] rounded-[10px] px-[23px] py-6">
                          <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#27ae60] text-base tracking-[0] leading-6 whitespace-pre-wrap">
                            {`{
      "transactionId": "txn_test_123",
      "userAgent": "Mozilla/5.0...",
      "ipAddress": "192.168.1.1",
      "amount": 299.99,
      "currency": "USD",
      "deviceFingerprint": "test_device_123"
    }`}
                          </pre>
                        </div>

                        <Button className="w-full bg-neutral-900 hover:bg-neutral-800 rounded-md shadow-[0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_1px_2px_#0000000d] h-auto py-2.5">
                          <div className="inline-flex items-center gap-2.5">
                            <PlayIcon className="w-[15px] h-[15px]" />
                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-neutral-50 text-sm tracking-[0] leading-5">
                              Test API Call
                            </span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                <CardContent className="p-6">
                  <div className="flex flex-col items-start gap-[34px]">
                    <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                      Response
                    </h2>

                    <div className="w-full bg-[#121728] rounded-[10px] px-[23px] py-6">
                      <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-base tracking-[0] leading-6 whitespace-pre-wrap">
                        <span className="text-white">{"{\n"}</span>
                        <span className="text-[#27ae60]">
                          {`  "riskScore": 23,
      "riskLevel": "low",
      "fraudProbability": 0.08,
      "recommendations": [
    `}
                        </span>
                        <span className="text-[#edc23f]">
                          {`    "Allow transaction",
        "No additional verification required"
    `}
                        </span>
                        <span className="text-[#27ae60]">
                          {`  ],
      "timestamp": "2025-07-01T19:16:00Z"
    `}
                        </span>
                        <span className="text-white">{"}"}</span>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {activeNavItem === "trust-simulator" && (
          <section className="flex flex-col items-start gap-[30px] w-full p-4 md:p-6 lg:p-8">
            <div className="flex flex-col items-start gap-2.5">
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl md:text-3xl lg:text-[40px] tracking-[0] leading-[normal]">
                Trust Score Simulation
              </h1>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base lg:text-lg tracking-[0] leading-6 md:leading-8">
                Input user data and get real-time trust score calculations to
                understand our scoring algorithm.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-6 w-full">
              <Card className="w-full lg:flex-1 bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col items-start gap-9">
                    <div className="flex flex-col items-start gap-[30px] w-full">
                      <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                        User Data Input
                      </h2>

                      <div className="flex flex-col items-start gap-5 w-full">
                        <div className="flex flex-col items-start gap-5 w-full">
                          <div className="flex flex-col items-start gap-2.5 w-full">
                            <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                              Account Age (Days)
                            </Label>
                            <Input
                              placeholder="Enter Account Age"
                              className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                            />
                          </div>

                          <div className="flex flex-col items-start gap-2.5 w-full">
                            <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                              Transaction History
                            </Label>
                            <Input
                              placeholder="Enter Transaction History"
                              className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 md:gap-5 w-full">
                          <div className="flex flex-col items-start gap-2.5 flex-1 w-full sm:w-auto">
                            <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm md:text-base tracking-[0] leading-6">
                              KYC Verfication Level
                            </Label>
                            <Select>
                              <SelectTrigger className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base w-full">
                                <SelectValue placeholder="Select Level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="level1">Level 1</SelectItem>
                                <SelectItem value="level2">Level 2</SelectItem>
                                <SelectItem value="level3">Level 3</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex flex-col items-start gap-2.5 flex-1 w-full sm:w-auto">
                            <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm md:text-base tracking-[0] leading-6">
                              Dispute History
                            </Label>
                            <Input
                              placeholder="Enter Dispute History"
                              className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full h-[51px] bg-app-secondary hover:bg-app-secondary/90 rounded-[10px] [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-base">
                      <CalculatorIcon className="w-5 h-5 mr-[5px]" />
                      Calculate Test Score
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full lg:flex-1 bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col items-end gap-4 md:gap-[30px]">
                    <h2 className="w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg md:text-xl tracking-[0] leading-6">
                      Trust Score Result
                    </h2>

                    <div className="flex flex-col items-center gap-4 md:gap-6 w-full">
                      <div className="flex flex-col items-center gap-[5px]">
                        <div className="bg-[linear-gradient(90deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-transparent text-4xl md:text-5xl lg:text-[64px] text-center tracking-[0] leading-[normal]">
                          87
                        </div>
                        <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base md:text-lg tracking-[0] leading-[normal]">
                          Highly Trusted
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-4 w-full">
                        <div className="flex flex-col items-start gap-5 w-full">
                          <div className="flex flex-col items-start gap-1.5 w-full">
                            {scoreBreakdown.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between w-full"
                              >
                                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-5">
                                  {item.label}
                                </div>
                                <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-app-secondary text-base text-right tracking-[0] leading-7">
                                  {item.points}
                                </div>
                              </div>
                            ))}
                          </div>

                          <Separator className="w-full" />
                        </div>

                        <div className="flex flex-col items-start gap-4">
                          <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base tracking-[0] leading-6">
                            Recommendations
                          </h3>
                          <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                            {recommendations.map((rec, index) => (
                              <React.Fragment key={index}>
                                {rec}
                                {index < recommendations.length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {activeNavItem === "support" && (
          <section className="flex flex-col items-start gap-[30px] w-full p-4 md:p-6 lg:p-8">
            <div className="flex flex-col items-start gap-2.5">
              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl md:text-3xl lg:text-[40px] tracking-[0] leading-[normal]">
                Get Support
              </h2>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base lg:text-lg tracking-[0] leading-6 md:leading-8">
                Multiple ways to get help with your integration and development
                questions.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 md:gap-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                  <CardHeader className="p-4 md:p-6 pb-0">
                    <div className="flex items-center gap-2.5">
                      <img
                        className="w-8 h-8 md:w-10 md:h-10 lg:w-[46px] lg:h-[46px]"
                        alt="Get Support Icon"
                        src="/p-2-rounded-lg-bg-accent-10-13.svg"
                      />
                      <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg md:text-xl tracking-[0] leading-6">
                        Get Support
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-4 md:pt-[26px]">
                    <div className="flex flex-col gap-[13px]">
                      {supportOptions.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 h-[60px] px-4 bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] cursor-pointer hover:border-[#003d2b] transition-colors"
                        >
                          <img
                            className="w-6 h-6"
                            alt="Icon"
                            src={option.icon}
                          />
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-5">
                            {option.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                  <CardHeader className="p-4 md:p-6 pb-0">
                    <div className="flex items-start gap-2.5">
                      <img
                        className="w-8 h-8 md:w-10 md:h-10 lg:w-[46px] lg:h-[46px] flex-shrink-0"
                        alt="Developer Resources Icon"
                        src="/p-2-rounded-lg-bg-accent-10-23.svg"
                      />
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg md:text-xl tracking-[0] leading-6">
                          Developer Resources
                        </CardTitle>
                        <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs md:text-sm tracking-[0] leading-5 md:leading-6">
                          Documentation, Guides, And Tools To Accelerate Your
                          Development.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-4 md:pt-[30px]">
                    <div className="flex flex-col gap-[13px]">
                      {developerResources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 h-[60px] px-4 bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] cursor-pointer hover:border-[#003d2b] transition-colors"
                        >
                          <img
                            className="w-6 h-6"
                            alt="Icon"
                            src={resource.icon}
                          />
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-5">
                            {resource.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] w-full">
                <CardHeader className="p-4 md:p-6 pb-0">
                  <div className="flex items-center gap-2.5">
                    <img
                      className="w-8 h-8 md:w-10 md:h-10 lg:w-[46px] lg:h-[46px]"
                      alt="FAQ Icon"
                      src="/p-2-rounded-lg-bg-accent-103.svg"
                    />
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg md:text-xl tracking-[0] leading-6">
                      Frequently Asked Questions
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-4 md:pt-[26px]">
                  <div className="flex flex-col gap-5">
                    {faqs.map((faq, index) => (
                      <React.Fragment key={index}>
                        <div className="flex flex-col gap-[5px]">
                          <h3 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base tracking-[0] leading-6">
                            {faq.question}
                          </h3>
                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm tracking-[0] leading-6">
                            {faq.answer}
                          </p>
                        </div>
                        {index < faqs.length - 1 && (
                          <Separator className="bg-[#e4e4e4]" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </div>

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[320px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <Card className="h-full bg-white rounded-none border-0 shadow-none">
          <CardContent className="flex flex-col items-start gap-6 p-6 pt-20">
            <div className="flex items-center justify-between w-full mb-2">
              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                Developer Portal
              </h2>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-[#f8f8f8] hover:bg-[#e8e8e8] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-[#003d2b]" />
              </button>
            </div>

            <div className="flex flex-col items-start gap-4 w-full">
              <div className="flex flex-col items-start gap-2.5 w-full">
                {sidebarNavigationItems.map((item) => {
                  const isActive = activeNavItem === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveNavItem(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2.5 w-full h-[50px] px-[15px] rounded-[10px] transition-colors ${
                        isActive
                          ? "bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)]"
                          : "bg-[#f8f8f8]"
                      }`}
                    >
                      <img className="w-6 h-6" alt={item.label} src={item.icon} />
                      <span
                        className={`[font-family:'DM_Sans_18pt-${
                          isActive ? "SemiBold" : "Regular"
                        }',Helvetica] ${
                          isActive
                            ? "font-semibold text-white"
                            : "font-normal text-[#808080]"
                        } text-sm tracking-[0] leading-5 whitespace-nowrap`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
