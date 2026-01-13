import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Home, 
  Shield, 
  Users, 
  Briefcase, 
  Code, 
  CheckCircle,
  AlertTriangle,
  FileText,
  Lock,
  Phone,
  Globe,
  CreditCard,
  Webhook,
  UserPlus,
  Building2,
  BarChart3,
  UserCheck,
  Network,
  Activity,
  Zap,
  Award,
  UserCog,
  Landmark,
  ShoppingCart,
  Plane,
  Bitcoin,
  Workflow,
  TestTube,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Gamepad2,
  Truck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccessControl } from "@/hooks/use-access-control";
import { useState } from "react";

interface MenuItem {
  href: string;
  label: string;
  icon: any;
  description: string;
}

interface MenuSection {
  title: string;
  icon: any;
  items: MenuItem[];
  isOpen?: boolean;
}

function CollapsibleSection({ section, isOpen, onToggle }: { section: MenuSection; isOpen: boolean; onToggle: () => void }) {
  const SectionIcon = section.icon;
  
  return (
    <div className="border-b border-[#e4e4e4] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-[#f6f6f6] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#27ae6033]">
            <SectionIcon className="h-5 w-5 text-[#27ae60]" />
          </div>
          <span className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{section.title}</span>
        </div>
        <ChevronDown className={`h-5 w-5 text-[#808080] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="bg-[#f6f6f6] px-4 pb-4">
          <div className="space-y-2">
            {section.items.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Link key={item.href} to={item.href}>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-[#fcfcfc] hover:bg-[#e8f5e9] border border-[#e4e4e4] hover:border-[#27ae60] transition-colors cursor-pointer">
                    <div className="p-1.5 rounded-lg bg-[#27ae6033]">
                      <ItemIcon className="h-4 w-4 text-[#27ae60]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] text-sm">{item.label}</div>
                      <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{item.description}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#808080] mt-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  const { hasAccessToSensitiveSections } = useAccessControl();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Solutions": true
  });

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Main navigation sections matching desktop
  const mainNavSections: MenuSection[] = [
    {
      title: "Solutions",
      icon: Shield,
      items: [
        { href: "/solutions/kyc", label: "Identity Verification (KYC)", icon: UserCheck, description: "Verify identity with advanced KYC solutions" },
        { href: "/solutions/aml", label: "AML & Ongoing Monitoring", icon: AlertTriangle, description: "Comprehensive AML compliance and monitoring" },
        { href: "/solutions/fraud", label: "Fraud Prevention & Risk Scoring", icon: Shield, description: "Advanced fraud detection and risk assessment" },
        { href: "/solutions/kyb", label: "Business Verification (KYB)", icon: Building2, description: "Know Your Business verification solutions" },
      ]
    },
    {
      title: "Use Cases / Industries",
      icon: Briefcase,
      items: [
        { href: "/industries/institutional", label: "Investment Firms & Hedge Funds", icon: Building2, description: "Institutional compliance for VCs, hedge funds & SMEs" },
        { href: "/industries/fintech", label: "Fintech & Banking", icon: Landmark, description: "Solutions for financial services" },
        { href: "/industries/crypto", label: "Crypto & Digital Assets", icon: Bitcoin, description: "Web3 & blockchain protection" },
        { href: "/industries/ecommerce", label: "E-commerce & Marketplaces", icon: ShoppingCart, description: "Platform protection" },
        { href: "/industries/gaming", label: "iGaming & Online Gambling", icon: Gamepad2, description: "Player verification & compliance" },
        { href: "/industries/travel", label: "Travel & Hospitality", icon: Plane, description: "Booking fraud prevention" },
        { href: "/industries/insurance", label: "Insurance", icon: Shield, description: "Claims fraud prevention" },
        { href: "/industries/logistics", label: "Logistics & Supply Chain", icon: Truck, description: "Shipment verification" },
      ]
    },
    {
      title: "Developers",
      icon: Code,
      items: [
        { href: "/developers", label: "Quick Start", icon: Zap, description: "Get started in minutes" },
        { href: "/developers/api", label: "API Reference / SDKs", icon: Code, description: "Complete API documentation" },
        { href: "/developers/webhooks", label: "Webhooks & Events", icon: Webhook, description: "Real-time event notifications" },
        { href: "/developers/workflow", label: "Workflow / Orchestration", icon: Workflow, description: "Build custom verification workflows" },
        { href: "/developers/demo", label: "Sandbox / Demo", icon: TestTube, description: "Test in our sandbox environment" },
      ]
    },
    {
      title: "Enterprise",
      icon: Building2,
      items: [
        { href: "/enterprise/features", label: "Enterprise Features & Benefits", icon: Building2, description: "Powerful features for large organizations" },
        { href: "enterprise/compliance", label: "Compliance & Data Security", icon: Lock, description: "Enterprise-grade security and compliance" },
        { href: "/enterprise/integration", label: "Integration & Onboarding Support", icon: Workflow, description: "Dedicated support for seamless integration" },
        { href: "/enterprise/case-studies", label: "Case Studies / Testimonials", icon: BookOpen, description: "Success stories from our customers" },
        { href: "/contact", label: "Contact / Sales / Support", icon: Phone, description: "Get in touch with our team" },
      ]
    },
    {
      title: "Pricing & Plans",
      icon: CreditCard,
      items: [
        { href: "/pricing", label: "Plans for Small & Medium Businesses", icon: Users, description: "Self-serve pricing plans" },
        { href: "/business", label: "Volume / Enterprise", icon: Building2, description: "Custom pricing for high volume" },
        { href: "/api-pricing", label: "Add-ons & Optional Modules", icon: Zap, description: "Additional features and modules" },
      ]
    },
  ];

  // Global Risk Intelligence - Featured Section (6 modules)
  const riskIntelligenceSection = {
    title: "Global Risk Intelligence Dashboards",
    icon: Network,
    color: "bg-gradient-to-r from-[#1DBF73] to-[#0A3778]",
    items: [
      { href: "/cybertrust", label: "CyberTrust Index", icon: Shield, description: "0-100 cyber risk scoring with threat intelligence" },
      { href: "/trustgraph", label: "TrustGraph", icon: Network, description: "Relationship intelligence & network analysis" },
      { href: "/transaction-integrity", label: "Transaction Integrity", icon: Activity, description: "Real-time fraud monitoring & arbitration" },
      { href: "/regulatory-pulse", label: "Regulatory Pulse", icon: FileText, description: "Sanctions screening & compliance monitoring" },
      { href: "/vendor-diligence", label: "Vendor Diligence", icon: Briefcase, description: "Vendor risk assessment & portfolio management" },
      { href: "/global-risk", label: "Global Risk Intelligence", icon: Globe, description: "Unified composite scoring across all modules" },
    ]
  };

  // Other sections
  const otherSections = [
    {
      title: "Bank POC - Customer Onboarding",
      icon: UserCog,
      color: "bg-gradient-to-r from-blue-600 to-purple-600",
      items: [
        { href: "/bank-onboarding-demo", label: "Multi-Signal Verification", icon: Shield, description: "Live demo: KYC/AML + Device + IP Intelligence" },
        { href: "/bank-scoring-dashboard", label: "Risk Scoring Dashboard", icon: BarChart3, description: "Customer risk assessment with weighted signals" },
      ]
    },
    {
      title: "Fraud Check Demos",
      icon: Shield,
      color: "bg-[#1DBF73]",
      items: [
        { href: "/trustscore-demo", label: "TrustScore Intelligence", icon: Shield, description: "See how TrustScore works - Live demo" },
        { href: "/complete-demo", label: "Complete Fraud Demo", icon: CheckCircle, description: "Check websites, emails, phone numbers" },
        { href: "/trust-badge", label: "Trust Badge System", icon: Award, description: "Issue verified badges to credible businesses" },
      ]
    },
  ];

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-8">
        {/* Header */}
        <div className="text-center mb-8 w-full">
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl mb-2">
            Menu
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg">
            Navigate to all TrustVerify features and tools
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 mb-8 w-full">
          <Link to="/">
            <Button variant="outline" className="w-full h-14 rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6] flex items-center justify-center gap-2">
              <Home className="h-5 w-5 text-[#003d2b]" />
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Home</span>
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="w-full h-14 rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6] flex items-center justify-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#003d2b]" />
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Dashboard</span>
            </Button>
          </Link>
          <Link to="/bank-onboarding-demo">
            <Button className="w-full h-14 rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 flex items-center justify-center gap-2">
              <Landmark className="h-5 w-5 text-white" />
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Bank Onboarding</span>
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="w-full h-14 rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6] flex items-center justify-center gap-2">
              <UserPlus className="h-5 w-5 text-[#003d2b]" />
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Login</span>
            </Button>
          </Link>
        </div>

        {/* Main Navigation - Collapsible Sections */}
        <Card className="mb-8 overflow-hidden bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] w-full">
          <div className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white p-4">
            <h2 className="font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg text-white">Main Navigation</h2>
            <p className="text-white/80 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">Browse solutions, industries, and resources</p>
          </div>
          <CardContent className="p-0">
            {mainNavSections.map((section) => (
              <CollapsibleSection
                key={section.title}
                section={section}
                isOpen={openSections[section.title] || false}
                onToggle={() => toggleSection(section.title)}
              />
            ))}
          </CardContent>
        </Card>

        {/* Global Risk Intelligence - Featured */}
        <Card className="mb-8 overflow-hidden shadow-lg border-2 border-[#27ae60] bg-[#fcfcfc] rounded-[20px] w-full">
          <div className={`${riskIntelligenceSection.color} p-4 text-white`}>
            <div className="flex items-center gap-3 mb-1">
              <Network className="h-6 w-6" />
              <h2 className="font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg text-white">{riskIntelligenceSection.title}</h2>
            </div>
            <p className="text-white/80 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">World-class risk management and intelligence</p>
          </div>
          <CardContent className="p-4 bg-[#fcfcfc]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {riskIntelligenceSection.items.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link key={item.href} to={item.href}>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-[#fcfcfc] hover:bg-[#e8f5e9] border border-[#e4e4e4] hover:border-[#27ae60] transition-all cursor-pointer">
                      <div className="p-2 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] rounded-lg">
                        <ItemIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] text-sm">{item.label}</div>
                        <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{item.description}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Other Sections */}
        <div className="space-y-4 w-full">
          {otherSections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <Card key={section.title} className="overflow-hidden bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <div className={`${section.color} p-3 text-white`}>
                  <div className="flex items-center gap-2">
                    <SectionIcon className="h-5 w-5" />
                    <h3 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-white">{section.title}</h3>
                  </div>
                </div>
                <CardContent className="p-3 bg-[#fcfcfc]">
                  <div className="space-y-2">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <Link key={item.href} to={item.href}>
                          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#e8f5e9] transition-colors cursor-pointer">
                            <ItemIcon className="h-4 w-4 text-[#27ae60]" />
                            <div className="flex-1">
                              <div className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] text-sm">{item.label}</div>
                              <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{item.description}</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-[#808080]" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CRM & HR - Restricted */}
        {hasAccessToSensitiveSections && (
          <div className="mt-8 space-y-4 w-full">
            <h3 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#27ae60]" />
              Internal Systems
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/crm/dashboard">
                <Button variant="outline" className="w-full h-12 rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6] flex items-center justify-center gap-2">
                  <Users className="h-4 w-4 text-[#003d2b]" />
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">CRM</span>
                </Button>
              </Link>
              <Link to="/hr/dashboard">
                <Button variant="outline" className="w-full h-12 rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6] flex items-center justify-center gap-2">
                  <UserCheck className="h-4 w-4 text-[#003d2b]" />
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">HR</span>
                </Button>
              </Link>
            </div>
          </div>
        )}

      </section>
      <Footer />
    </main>
  );
}
