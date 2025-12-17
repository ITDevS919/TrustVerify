import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Store, 
  CreditCard, 
  Banknote,
  Shield,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Users,
  Globe,
  Award,
  Phone,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Business() {
  const { user } = useAuth();

  const businessSolutions = [
    {
      id: 'enterprise-fraud-shield',
      name: 'TrustVerify Enterprise Fraud Shield',
      title: 'AI-Powered Fraud Detection for Large Enterprises',
      description: 'Enterprise-scale fraud detection with custom machine learning models and dedicated infrastructure.',
      icon: Building,
      color: 'blue',
      stats: [
        { label: 'AI-Powered', value: 'Detection' },
        { label: 'Low False', value: 'Positives' },
        { label: 'Processing Speed', value: '<50ms' },
        { label: 'High', value: 'Scalability' }
      ],
      features: [
        'Custom ML model training',
        'Dedicated cloud infrastructure',
        'Real-time API integration',
        '24/7 enterprise support',
        'Compliance reporting automation',
        'Multi-region deployment',
        'Advanced analytics dashboard'
      ],
      path: '/enterprise-contact'
    },
    {
      id: 'business-transaction-guard',
      name: 'TrustVerify Business Transaction Guard',
      title: 'Payment Security & Chargeback Protection for SMEs',
      description: 'Comprehensive payment protection designed for small to medium enterprises.',
      icon: CreditCard,
      color: 'green',
      features: [
        'Payment gateway integration',
        'Chargeback prevention system',
        'Risk-based authentication',
        'Transaction monitoring',
        'Dispute management portal',
        'Automated evidence collection',
        'Business analytics dashboard'
      ],
      path: '/fraud-prevention'
    },
    {
      id: 'corporate-identity-vault',
      name: 'TrustVerify Corporate Identity Vault',
      title: 'Business Identity Verification & KYB Compliance',
      description: 'Complete Know Your Business (KYB) solution with automated compliance workflows.',
      icon: Shield,
      color: 'purple',
      features: [
        'Automated KYB verification',
        'Business registry validation',
        'Ultimate Beneficial Owner (UBO) screening',
        'Sanctions & PEP checking',
        'Ongoing monitoring',
        'Compliance workflow automation',
        'Regulatory reporting'
      ],
      path: '/identity-verification'
    },
    {
      id: 'marketplace-trust-platform',
      name: 'TrustVerify Marketplace Trust Platform',
      title: 'End-to-End Trust & Escrow for Digital Marketplaces',
      description: 'Complete marketplace security with escrow services, seller verification, and dispute resolution.',
      icon: Store,
      color: 'yellow',
      features: [
        'Multi-party escrow services',
        'Seller identity verification',
        'Automated dispute resolution',
        'Trust score calculation',
        'Payment orchestration',
        'Fraud pattern detection',
        'Marketplace analytics'
      ],
      path: '/escrow-services'
    },
    {
      id: 'financial-compliance-suite',
      name: 'TrustVerify Financial Compliance Suite',
      title: 'AML/CTF Compliance & Risk Management for Financial Institutions',
      description: 'Comprehensive compliance solution for banks, fintechs, and financial service providers.',
      icon: Banknote,
      color: 'red',
      features: [
        'AML/CTF transaction monitoring',
        'Suspicious activity reporting (SAR)',
        'Customer due diligence (CDD)',
        'Enhanced due diligence (EDD)',
        'Regulatory reporting automation',
        'Risk scoring algorithms',
        'Audit trail management'
      ],
      path: '/regulatory-compliance'
    }
  ];


  const businessBenefits = [
    {
      title: "Reduce Fraud Losses",
      description: "Advanced AI-powered detection to prevent fraudulent transactions",
      icon: Shield,
      stat: "AI-Powered"
    },
    {
      title: "Increase Customer Trust",
      description: "Verified users and secure escrow services build confidence",
      icon: CheckCircle,
      stat: "Trust-First"
    },
    {
      title: "Improve Conversion",
      description: "Reduce false positives while maintaining security",
      icon: TrendingUp,
      stat: "Smart Detection"
    },
    {
      title: "Global Compliance",
      description: "Meet regulatory requirements with enterprise-grade security",
      icon: Globe,
      stat: "Enterprise-Ready"
    }
  ];

  const pricingPlans = [
    {
      name: "Micro",
      price: "£199",
      period: "month",
      yearlyPrice: "£1,999",
      description: "Essential API access for startups & small businesses",
      features: [
        "10,000 lightweight API calls per month",
        "Basic fraud scoring",
        "Device fingerprinting",
        "IP/Email/Phone risk detection",
        "Basic dashboard",
        "Email support",
        "3 team members",
        "Website integrity monitoring"
      ],
      identityAddOns: [
        "KYC: £3.00 per check",
        "KYB: £7.00 per check",
        "AML/PEP: £0.60 per check"
      ],
      overage: "£0.0009 per extra call",
      notIncluded: [
        "No free KYC / KYB / AML checks"
      ],
      popular: false
    },
    {
      name: "Growth",
      price: "£499",
      period: "month",
      yearlyPrice: "£4,999",
      description: "Scalable fraud protection for SMEs & fintech",
      features: [
        "50,000 lightweight API calls per month",
        "Real-time risk scoring APIs",
        "Email + phone support",
        "Advanced fraud intelligence",
        "Enhanced dashboard",
        "Webhooks",
        "Custom compliance automations",
        "10 team members",
        "White-label Lite"
      ],
      identityAddOns: [
        "£50 identity verification credit per month",
        "(≈ 16 KYC checks or 8 KYB checks)",
        "KYC: £2.50 per check",
        "KYB: £6.00 per check",
        "AML/PEP: £0.50 per check"
      ],
      overage: "£0.0008 per extra call",
      popular: false
    },
    {
      name: "Professional", 
      price: "£999",
      period: "month",
      yearlyPrice: "£9,999", 
      description: "Advanced fraud protection for established businesses",
      features: [
        "150,000 lightweight API calls per month",
        "Full API + webhooks",
        "24/7 priority support",
        "All advanced fraud intelligence",
        "Unlimited team members",
        "Custom integrations",
        "Dedicated sandbox environment",
        "SLA: 99.9% uptime",
        "200 free KYC checks per month"
      ],
      identityAddOns: [
        "KYC: £2.00 per check",
        "KYB: £5.00 per check",
        "AML/PEP: £0.40 per check"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Contact Sales",
      period: "", 
      yearlyPrice: "Custom",
      description: "Custom solutions for banks & large platforms",
      features: [
        "£2,000–£10,000 platform fee / month",
        "500,000+ lightweight API calls",
        "Custom infrastructure",
        "On-prem or private cloud options",
        "Dedicated account manager",
        "24/7 enterprise support",
        "Custom compliance + reporting",
        "Enterprise SLA: 99.99% uptime",
        "Multi-region redundancy",
        "Custom fraud models (AI/ML)"
      ],
      identityAddOns: [
        "KYC: £1.00–£1.80 per check",
        "KYB: £3.00–£5.00 per check",
        "AML/PEP: £0.20–£0.35 per check",
        "Bulk KYC Packs: 10k–1M checks"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-[1270px] mx-auto px-6 md:px-10 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="h-[30px] bg-[#003d2b1a] hover:bg-[#003d2b1a] rounded-[800px] px-4 mb-6 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm leading-[14px] tracking-[0]">
              ENTERPRISE SOLUTIONS
            </span>
          </Badge>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px] mb-6">
            Enterprise Security Solutions
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg sm:text-xl leading-[27px] max-w-3xl mx-auto mb-8">
            Advanced fraud prevention and enterprise security solutions launching Q4 2025. Comprehensive protection for businesses of all sizes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="h-[30px] bg-[#0b3a781a] text-[#0b3a78] rounded-[800px] px-4 border-0 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Launching Q4 2025</Badge>
            <Badge className="h-[30px] bg-[#1DBF731a] text-[#003d2b] rounded-[800px] px-4 border-0 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Enterprise-Grade Security</Badge>
            <Badge className="h-[30px] bg-[#003d2b1a] text-[#003d2b] rounded-[800px] px-4 border-0 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">AI-Powered Detection</Badge>
          </div>
        </div>

        {/* Business Solutions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {businessSolutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <Card key={solution.id} className="bg-white border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${solution.color === 'blue' ? 'from-[#0b3a78] to-[#1DBF73]' : solution.color === 'green' ? 'from-[#1DBF73] to-[#0b3a78]' : 'from-[#0A3778] to-[#1DBF73]'}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">{solution.name}</CardTitle>
                      <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">{solution.title}</CardDescription>
                    </div>
                  </div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">{solution.description}</p>
                </CardHeader>
                <CardContent>
                  {solution.stats && (
                    <div className="mb-6">
                      <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-3">Performance Metrics:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {solution.stats.map((stat, idx) => (
                          <div key={idx} className="text-center py-2">
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-app-secondary">{stat.value}</div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080]">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-app-secondary mr-2 flex-shrink-0" />
                          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to={solution.path}>
                    <Button className="w-full bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px] min-h-[44px]">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Business Benefits */}
        <section className="mb-16 bg-[#f4f4f4] py-16 px-6 rounded-[20px]">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[34px] sm:text-[40px] text-[#003d2b] mb-4">Why Businesses Choose TrustVerify</h2>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg max-w-2xl mx-auto">
              Proven results across industries with measurable impact on fraud reduction and business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="bg-white border border-[#e4e4e4] rounded-[18px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] text-center">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-[#0b3a78] to-[#1DBF73] rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">{benefit.title}</CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{benefit.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl font-semibold text-app-secondary">{benefit.stat}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Business Success Metrics */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[34px] sm:text-[40px] text-[#003d2b] mb-4">Proven Enterprise Performance</h2>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg max-w-2xl mx-auto">
              Industry-leading security metrics and performance benchmarks for enterprise deployments launching Q4 2025.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0b3a78] to-[#1DBF73] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl font-semibold text-[#003d2b]">AI-Powered</CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#0b3a78] font-medium">Fraud Detection</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center text-sm">
                  Advanced machine learning with minimal false positives for enterprise-scale operations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1DBF73] to-[#0b3a78] rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl font-semibold text-[#003d2b]">&lt;50ms</CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#0b3a78] font-medium">Real-time Processing</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center text-sm">
                  Ultra-fast transaction processing designed for high-volume enterprise environments.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0A3778] to-[#1DBF73] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl font-semibold text-[#003d2b]">High Volume</CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#0b3a78] font-medium">Transaction Processing</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center text-sm">
                  Scalable infrastructure built to handle massive enterprise transaction volumes.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="mb-16 bg-[#f4f4f4] py-16 px-6 rounded-[20px]">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[34px] sm:text-[40px] text-[#003d2b] mb-4">Business Pricing</h2>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg max-w-2xl mx-auto">
              Flexible pricing plans designed to scale with your business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`bg-white rounded-[18px] border ${plan.popular ? 'border-[#0b3a78] border-2 shadow-xl shadow-[#1DBF73]/20' : 'border-[#e4e4e4]'} shadow-[0_10px_30px_rgba(0,0,0,0.04)]`}>
                {plan.popular && (
                  <div className="absolute top-3 right-3 bg-[#0b3a78] text-white px-3 py-1 text-xs font-semibold rounded-full">
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Most Popular</span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b]">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#0b3a78]">{plan.price}</span>
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">/{plan.period}</span>
                    {plan.yearlyPrice && (
                      <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mt-1">
                        or {plan.yearlyPrice}/year
                      </div>
                    )}
                  </div>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* API Calls Highlight Box */}
                  <div className="mb-4 bg-[#f3f3f3] border border-[#e4e4e4] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">API Calls</h4>
                      <Badge className="bg-app-secondary text-white text-xs">Lightweight</Badge>
                    </div>
                    <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl font-semibold text-app-secondary">
                      {plan.name === 'Micro' && '10,000'}
                      {plan.name === 'Growth' && '50,000'}
                      {plan.name === 'Professional' && '150,000'}
                      {plan.name === 'Enterprise' && '500,000+'}
                    </p>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080] mt-1">per month</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm mb-2">Additional Features</h4>
                    <ul className="space-y-2">
                      {plan.features.filter(f => !f.toLowerCase().includes('api call')).map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-app-secondary mr-2 flex-shrink-0" />
                          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.notIncluded && plan.notIncluded.length > 0 && (
                    <div className="mb-4 bg-[#f3f3f3] border border-[#e4e4e4] rounded-lg p-3">
                      <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm mb-2">Not Included</h4>
                      <ul className="space-y-1">
                        {plan.notIncluded.map((item, idx) => (
                          <li key={idx} className="flex items-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                            <X className="h-3 w-3 mr-2 flex-shrink-0 text-[#FF4B26]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {plan.identityAddOns && plan.identityAddOns.length > 0 && (
                    <div className="mb-4 bg-[#f3f3f3] border border-[#e4e4e4] rounded-lg p-3">
                      <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm mb-2">Identity Verification</h4>
                      <ul className="space-y-1">
                        {plan.identityAddOns.map((addon, idx) => (
                          <li key={idx} className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080]">
                            • {addon}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {plan.overage && (
                    <div className="mb-4 bg-[#f3f3f3] border border-[#e4e4e4] rounded-lg p-3">
                      <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xs mb-1">Overage</h4>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080]">{plan.overage}</p>
                    </div>
                  )}

                  <Button 
                    className={`w-full rounded-[10px] min-h-[44px] ${plan.popular ? 'bg-app-secondary hover:bg-app-secondary/90' : 'bg-[#0b3a78] hover:bg-[#0b3a78]/90'} text-white`}
                    onClick={() => plan.name === 'Enterprise' ? window.location.href = '/contact' : window.location.href = '/login'}
                  >
                    <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">{plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="border-[#0b3a78] text-[#0b3a78] hover:bg-[#0b3a780d] rounded-[10px] min-h-[44px]">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">View Complete Pricing</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Enterprise Security Architecture */}
        <section className="bg-[#f4f4f4] rounded-[20px] p-12 mb-12">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[34px] sm:text-[40px] text-[#003d2b] mb-4">Enterprise Security Architecture</h2>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg max-w-3xl mx-auto">Advanced security infrastructure designed for large-scale business operations launching Q4 2025</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enterprise Infrastructure */}
            <div className="bg-white rounded-[20px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-[#e4e4e4]">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0b3a78] to-[#1DBF73] rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b]">Enterprise Infrastructure</h3>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Scalable security platform</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-[#0b3a78] pl-4">
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Multi-Region Deployment</h4>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Global infrastructure with local data residency compliance and sub-50ms latency</p>
                </div>
                <div className="border-l-4 border-app-secondary pl-4">
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Auto-Scaling Architecture</h4>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Dynamic scaling to handle peak loads with 99.99% uptime SLA guarantee</p>
                </div>
                <div className="border-l-4 border-[#0A3778] pl-4">
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">API-First Design</h4>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">RESTful and GraphQL APIs with comprehensive SDK support for seamless integration</p>
                </div>
              </div>
            </div>

            {/* Business Intelligence */}
            <div className="bg-white rounded-[20px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-[#e4e4e4]">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1DBF73] to-[#0b3a78] rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b]">Business Intelligence</h3>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Advanced analytics & reporting</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-[#0b3a78] pl-4">
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Real-Time Dashboards</h4>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Executive and operational dashboards with customizable KPI tracking</p>
                </div>
                <div className="border-l-4 border-app-secondary pl-4">
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Predictive Analytics</h4>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">ML-powered fraud trend prediction and business risk forecasting</p>
                </div>
                <div className="border-l-4 border-[#0A3778] pl-4">
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Compliance Reporting</h4>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Automated regulatory reporting with audit trail management and export capabilities</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-2 bg-[#003d2b1a] text-[#003d2b] px-4 py-2 rounded-[800px]">
              <Award className="h-4 w-4" />
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Enterprise-grade security launching Q4 2025</span>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#0A3778] to-[#1DBF73] rounded-[20px] p-12 text-center text-white">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[34px] sm:text-[40px] mb-4">
            Enterprise Security Solutions Coming Q4 2025
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-lg mb-8 opacity-90">
            Be among the first to experience next-generation enterprise fraud prevention and business security solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button 
                size="lg" 
                className="bg-white text-[#0A3778] hover:bg-gray-100 rounded-[10px] min-h-[46px]"
                onClick={() => window.location.href = '/dashboard'}
              >
                <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">Access Dashboard</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-white text-[#0A3778] hover:bg-gray-100 rounded-[10px] min-h-[46px]"
                  onClick={() => window.location.href = '/login'}
                >
                  <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">Get Started</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#0A3778] rounded-[10px] min-h-[46px]"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">Contact Sales</span>
                </Button>
              </>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}