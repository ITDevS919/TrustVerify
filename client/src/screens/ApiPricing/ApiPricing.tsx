import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Network, Activity, FileText, Briefcase, Globe, Zap, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ApiPricing() {
  const modules = [
    {
      id: "cybertrust",
      name: "CyberTrust Index",
      icon: Shield,
      description: "0-100 cyber risk scoring with real-time threat intelligence",
      color: "from-[#0A3778] to-[#1DBF73]",
      competitors: "SecurityScorecard (£16-21k/yr), BitSight (£20k+/yr)",
      marketLeaderPrice: "£20,000/year",
      ourPrice: "£11,988/year (40% savings)",
      tiers: [
        {
          name: "Starter",
          price: "149",
          annualPrice: "1,788",
          calls: "2,500",
          perCall: "£0.06",
          features: ["Basic cyber risk scoring", "SSL/TLS analysis", "Vulnerability scanning", "Email & chat support", "99.5% uptime SLA", "15% discount on annual prepay"]
        },
        {
          name: "Professional",
          price: "449",
          annualPrice: "5,388",
          calls: "10,000",
          perCall: "£0.045",
          features: ["Advanced threat intelligence", "Breach monitoring", "DNS security analysis", "Priority support", "99.9% uptime SLA", "Custom risk thresholds", "15% discount on annual prepay"],
          popular: true
        },
        {
          name: "Enterprise",
          price: "999",
          annualPrice: "11,988",
          calls: "50,000",
          perCall: "£0.02",
          features: ["Full threat feed integration", "Dedicated account manager", "Custom SLA", "99.99% uptime", "White-label reports", "API rate limit: 100 req/s", "15% discount on annual prepay", "Dedicated onboarding"]
        }
      ]
    },
    {
      id: "trustgraph",
      name: "TrustGraph",
      icon: Network,
      description: "Relationship intelligence & network visualization for entity analysis",
      color: "from-purple-600 to-[#1DBF73]",
      competitors: "Linkurious (£990-25k/yr), Sayari (£40-200k/yr)",
      marketLeaderPrice: "£25,000/year",
      ourPrice: "£15,588/year (38% savings)",
      tiers: [
        {
          name: "Starter",
          price: "199",
          annualPrice: "2,388",
          calls: "500",
          perCall: "£0.40",
          features: ["Basic relationship mapping", "Entity discovery", "Network visualization", "Standard support", "99.5% uptime SLA", "15% discount on annual prepay"]
        },
        {
          name: "Professional",
          price: "599",
          annualPrice: "7,188",
          calls: "2,500",
          perCall: "£0.24",
          features: ["Advanced graph analytics", "Cross-entity relationships", "Interactive dashboards", "Priority support", "99.9% uptime SLA", "Export capabilities", "15% discount on annual prepay"],
          popular: true
        },
        {
          name: "Enterprise",
          price: "1,299",
          annualPrice: "15,588",
          calls: "15,000",
          perCall: "£0.087",
          features: ["Unlimited relationship depth", "Custom graph algorithms", "Dedicated support", "99.99% uptime", "White-label integration", "API rate limit: 50 req/s", "15% discount on annual prepay", "Dedicated onboarding"]
        }
      ]
    },
    {
      id: "transaction-integrity",
      name: "Transaction Integrity",
      icon: Activity,
      description: "Real-time fraud monitoring, payment protection & arbitration intelligence",
      color: "from-blue-600 to-[#1DBF73]",
      competitors: "Ravelin (£12.5k/yr), Sift (£160k+/yr)",
      marketLeaderPrice: "£12,500/year",
      ourPrice: "£7,188/year (43% savings)",
      tiers: [
        {
          name: "Starter",
          price: "79",
          annualPrice: "948",
          calls: "5,000",
          perCall: "£0.016",
          features: ["Basic fraud detection", "Payment integrity checks", "Transaction monitoring", "Standard support", "99.5% uptime SLA", "15% discount on annual prepay"]
        },
        {
          name: "Professional",
          price: "249",
          annualPrice: "2,988",
          calls: "25,000",
          perCall: "£0.01",
          features: ["Advanced fraud patterns", "Arbitration tracking", "Dispute management", "Priority support", "99.9% uptime SLA", "Chargeback protection", "15% discount on annual prepay"],
          popular: true
        },
        {
          name: "Enterprise",
          price: "599",
          annualPrice: "7,188",
          calls: "150,000",
          perCall: "£0.004",
          features: ["ML-powered detection", "Custom fraud rules", "Dedicated analyst", "99.99% uptime", "Real-time alerts", "API rate limit: 200 req/s", "15% discount on annual prepay", "Dedicated onboarding"]
        }
      ]
    },
    {
      id: "regulatory-pulse",
      name: "Regulatory Pulse",
      icon: FileText,
      description: "Sanctions screening, compliance monitoring & regulatory intelligence",
      color: "from-orange-600 to-[#1DBF73]",
      competitors: "Refinitiv (£15k/yr), ComplyAdvantage (£12k/yr)",
      marketLeaderPrice: "£15,000/year",
      ourPrice: "£7,788/year (48% savings)",
      tiers: [
        {
          name: "Starter",
          price: "199",
          annualPrice: "2,388",
          calls: "200",
          perCall: "£0.50",
          features: ["OFAC sanctions screening", "PEP checks", "Basic watchlist monitoring", "Email support", "99.5% uptime SLA", "15% discount on annual prepay"]
        },
        {
          name: "Professional",
          price: "299",
          annualPrice: "3,588",
          calls: "1,000",
          perCall: "£0.30",
          features: ["Global sanctions lists", "Adverse media screening", "Regulatory alerts", "Priority support", "99.9% uptime SLA", "Ongoing monitoring", "15% discount on annual prepay"],
          popular: true
        },
        {
          name: "Enterprise",
          price: "649",
          annualPrice: "7,788",
          calls: "10,000",
          perCall: "£0.065",
          features: ["300+ sanctions programs", "Custom compliance rules", "Dedicated compliance team", "99.99% uptime", "Audit trails", "API rate limit: 50 req/s", "15% discount on annual prepay", "Dedicated onboarding"]
        }
      ]
    },
    {
      id: "vendor-diligence",
      name: "Vendor Diligence",
      icon: Briefcase,
      description: "Vendor risk assessment, financial metrics & portfolio management",
      color: "from-emerald-600 to-[#1DBF73]",
      competitors: "Prevalent (£24-78k/yr), SecurityScorecard (£16-21k/yr)",
      marketLeaderPrice: "£24,000/year",
      ourPrice: "£14,388/year (40% savings)",
      tiers: [
        {
          name: "Starter",
          price: "199",
          annualPrice: "2,388",
          calls: "100",
          perCall: "£1.99",
          features: ["Basic vendor assessments", "Financial health checks", "Compliance verification", "Standard support", "99.5% uptime SLA", "15% discount on annual prepay"]
        },
        {
          name: "Professional",
          price: "549",
          annualPrice: "6,588",
          calls: "500",
          perCall: "£1.10",
          features: ["Advanced risk scoring", "Performance tracking", "SLA monitoring", "Priority support", "99.9% uptime SLA", "Portfolio analytics", "15% discount on annual prepay"],
          popular: true
        },
        {
          name: "Enterprise",
          price: "1,199",
          annualPrice: "14,388",
          calls: "3,000",
          perCall: "£0.40",
          features: ["8-dimension risk analysis", "Custom assessment templates", "Dedicated analyst", "99.99% uptime", "Automated workflows", "API rate limit: 30 req/s", "15% discount on annual prepay", "Dedicated onboarding"]
        }
      ]
    },
    {
      id: "global-risk",
      name: "Global Risk Intelligence",
      icon: Globe,
      description: "Unified composite scoring across all 5 intelligence modules",
      color: "from-[#1DBF73] to-[#0A3778]",
      competitors: "Unique composite offering (no direct competitors)",
      marketLeaderPrice: "Premium tier",
      ourPrice: "£23,988/year (enterprise intelligence)",
      tiers: [
        {
          name: "Starter",
          price: "299",
          annualPrice: "3,588",
          calls: "1,000",
          perCall: "£0.30",
          features: ["Composite risk scoring", "Cross-module analytics", "Country risk profiles", "Standard support", "99.5% uptime SLA", "15% discount on annual prepay"]
        },
        {
          name: "Professional",
          price: "899",
          annualPrice: "10,788",
          calls: "5,000",
          perCall: "£0.18",
          features: ["Advanced composite metrics", "Industry benchmarks", "Risk alerts", "Priority support", "99.9% uptime SLA", "Custom thresholds", "15% discount on annual prepay"],
          popular: true
        },
        {
          name: "Enterprise",
          price: "1,999",
          annualPrice: "23,988",
          calls: "30,000",
          perCall: "£0.08",
          features: ["Full intelligence network", "Real-time aggregation", "Dedicated strategist", "99.99% uptime", "White-label reports", "API rate limit: 100 req/s", "15% discount on annual prepay", "Dedicated onboarding"]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-[#003d2b0d] blur-3xl" />
          <div className="absolute right-[-120px] top-6 h-80 w-80 rounded-full bg-[#0b3a7815] blur-3xl" />
          <div className="absolute left-1/3 bottom-[-140px] h-72 w-72 rounded-full bg-[#1DBF7315] blur-3xl" />
        </div>

        <div className="relative max-w-[1270px] mx-auto flex flex-col items-center gap-8 text-center">
          <Badge className="h-[30px] bg-[#003d2b1a] hover:bg-[#003d2b1a] rounded-[800px] px-4 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm leading-[14px] tracking-[0]">
              API PRICING
            </span>
          </Badge>

          <div className="space-y-4 max-w-4xl">
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px] px-4">
              Transparent Intelligence API Pricing
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg sm:text-xl leading-[27px] px-4">
              Usage-based plans benchmarked against market leaders. Scale from startup to global enterprise with predictable pricing, fast response times, and bundled discounts across modules.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="min-h-[46px] bg-app-secondary hover:bg-app-secondary/90 text-white px-6 rounded-[10px] shadow-md"
            >
              <Link to="/contact">Talk to Sales</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="min-h-[46px] border-[#0b3a78] text-[#0b3a78] hover:bg-[#0b3a780d] px-6 rounded-[10px]"
            >
              <Link to="/developers">View Docs</Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Card className="p-4 border border-[#e4e4e4] rounded-[14px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-app-secondary" />
                <div className="text-left">
                  <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Competitive Pricing</div>
                  <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg text-[#003d2b]">30-50% below market leaders</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 border border-[#e4e4e4] rounded-[14px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-[#0b3a78]" />
                <div className="text-left">
                  <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Response Time</div>
                  <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg text-[#003d2b]">&lt;200ms average</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="p-20 px-6 bg-[#f4f4f4]">
        <div className="max-w-[1270px] mx-auto space-y-16">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <div key={module.id} id={module.id} className="bg-white rounded-[20px] shadow-[0_14px_50px_rgba(0,0,0,0.05)] border border-[#e4e4e4] p-6 sm:p-8">
                {/* Module Header */}
                <div className="mb-8 text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${module.color}`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl sm:text-3xl text-[#003d2b]">
                    {module.name}
                  </h2>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-base sm:text-lg text-[#555] max-w-3xl mx-auto">
                    {module.description}
                  </p>
                  <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-sm text-[#0b3a78]">
                    Competing with: <span className="text-[#003d2b]">{module.competitors}</span>
                  </p>
                </div>

                {/* Pricing Tiers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {module.tiers.map((tier) => (
                    <Card
                      key={tier.name}
                      className={`relative overflow-hidden rounded-[18px] border ${
                        tier.popular
                          ? "border-none bg-[#0A3778] text-white shadow-xl shadow-[#1DBF73]/20"
                          : "border-[#e4e4e4] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
                      }`}
                    >
                      {tier.popular && (
                        <div className="absolute top-3 right-3 bg-white/15 text-white px-3 py-1 text-xs font-semibold rounded-full border border-white/30">
                          Most Popular
                        </div>
                      )}
                      <CardHeader className="pb-4">
                        <CardTitle className={`${tier.popular ? "text-white" : "text-[#003d2b]"} [font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl`}>
                          {tier.name}
                        </CardTitle>
                        <div className="mt-3 space-y-1">
                          <div className="flex items-baseline">
                            <span className={`${tier.popular ? "text-white" : "text-[#0b3a78]"} text-4xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica]`}>
                              £{tier.price}
                            </span>
                            <span className={`${tier.popular ? "text-white/80" : "text-[#808080]"} ml-2 text-sm`}>/month</span>
                          </div>
                          <div className={`${tier.popular ? "text-white/80" : "text-[#808080]"} text-sm`}>
                            {tier.calls} API calls included
                          </div>
                          <div className={`${tier.popular ? "text-white/70" : "text-[#9b9b9b]"} text-xs`}>
                            Overage: {tier.perCall} per call
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <ul className="space-y-3">
                          {tier.features.map((feature, featureIdx) => (
                            <li key={featureIdx} className="flex items-start gap-3">
                              <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${tier.popular ? "text-white" : "text-app-secondary"}`} />
                              <span className={`${tier.popular ? "text-white" : "text-[#4b4b4b]"} text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]`}>
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={`w-full min-h-[44px] rounded-[10px] ${
                            tier.popular
                              ? "bg-white text-[#0A3778] hover:bg-white/90"
                              : "bg-app-secondary text-white hover:bg-app-secondary/90"
                          }`}
                          asChild
                          data-testid={`button-subscribe-${module.id}-${tier.name.toLowerCase()}`}
                        >
                          <Link to="/contact">
                            Get Started
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Overage & Annual Contracts */}
      <section className="p-20 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-[34px] sm:text-[40px] text-center text-[#003d2b] leading-[110%]">
            Overage pricing & annual contracts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)] rounded-[16px]">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3 text-[#003d2b]">
                  <Zap className="h-6 w-6 text-app-secondary" />
                  Overage pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[#4b4b4b] [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                <p>When you exceed your monthly API call limit, you'll be charged at the per-call rate shown for your tier.</p>
                <ul className="space-y-2 ml-4 list-disc marker:text-app-secondary">
                  <li><strong>Transparent billing:</strong> Only pay for what you use beyond your quota</li>
                  <li><strong>No surprise charges:</strong> Set usage alerts at 75%, 90%, and 100% of quota</li>
                  <li><strong>Automatic tier upgrade:</strong> We suggest upgrades if overages become frequent</li>
                  <li><strong>Pooled usage:</strong> Multi-module bundles pool API calls across all modules</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)] rounded-[16px]">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3 text-[#003d2b]">
                  <Clock className="h-6 w-6 text-[#0b3a78]" />
                  Annual contracts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[#4b4b4b] [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                <p>Prepay annually and save 15% on all plans. Enterprise customers enjoy additional benefits:</p>
                <ul className="space-y-2 ml-4 list-disc marker:text-[#0b3a78]">
                  <li><strong>15% annual discount:</strong> Save automatically on 12-month prepay</li>
                  <li><strong>Predictable budgeting:</strong> Lock in rates with multi-year contracts</li>
                  <li><strong>Dedicated onboarding:</strong> Enterprise tier includes integration support</li>
                  <li><strong>Custom SLAs:</strong> Negotiate uptime guarantees and response times</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bundle Pricing */}
      <section className="py-16 px-6 bg-[#f4f4f4]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-[#003d2b]">
            Need Multiple Modules? Save with Bundles
          </h2>
          <p className="text-base sm:text-lg mb-8 opacity-90">
            Combine 3+ intelligence modules and unlock aggressive bundle discounts. Enterprise bundles include dedicated support, custom SLAs, and pooled usage across all modules.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold mb-2">3 Modules</div>
                <div className="text-lg opacity-90">Save 35%</div>
                <div className="text-sm opacity-75 mt-1">+ Pooled usage</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold mb-2">5 Modules</div>
                <div className="text-lg opacity-90">Save 45%</div>
                <div className="text-sm opacity-75 mt-1">+ Dedicated analyst</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold mb-2">All 6 Modules</div>
                <div className="text-lg opacity-90">Save 55%</div>
                <div className="text-sm opacity-75 mt-1">+ White-label ready</div>
              </CardContent>
            </Card>
          </div>
          <Button
            size="lg"
            className="bg-white text-[#0A3778] hover:bg-gray-100 min-h-[44px] px-8"
            asChild
            data-testid="button-contact-bundle"
          >
            <Link to="/contact">
              Contact Sales for Bundle Pricing
            </Link>
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="p-10"> 
        <div className="max-w-4xl mx-auto">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-[32px] sm:text-[36px] text-center text-[#003d2b] mb-6z ">
            Pricing FAQ
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="item-1" className="border border-[#e4e4e4] rounded-[12px] bg-[#f9f9f9] px-4">
              <AccordionTrigger className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] text-base">
                How is pricing calculated?
              </AccordionTrigger>
              <AccordionContent className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#4b4b4b] pb-4">
                Monthly subscription includes a set number of API calls. Overages are billed at the per-call rate shown for each tier. All prices in £ GBP.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border border-[#e4e4e4] rounded-[12px] bg-[#f9f9f9] px-4">
              <AccordionTrigger className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] text-base">
                Can I upgrade mid-month?
              </AccordionTrigger>
              <AccordionContent className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#4b4b4b] pb-4">
                Yes! Upgrade anytime and only pay the prorated difference. Your unused call quota carries over to the new tier.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border border-[#e4e4e4] rounded-[12px] bg-[#f9f9f9] px-4">
              <AccordionTrigger className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] text-base">
                What payment methods are accepted?
              </AccordionTrigger>
              <AccordionContent className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#4b4b4b] pb-4">
                Credit/debit cards, PayPal, wire transfer (Enterprise only), and direct debit for UK accounts. Major currencies supported with automatic conversion.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border border-[#e4e4e4] rounded-[12px] bg-[#f9f9f9] px-4">
              <AccordionTrigger className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] text-base">
                Are there setup fees?
              </AccordionTrigger>
              <AccordionContent className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#4b4b4b] pb-4">
                No setup fees for Starter and Professional tiers. Enterprise tier includes onboarding and integration support.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
}
