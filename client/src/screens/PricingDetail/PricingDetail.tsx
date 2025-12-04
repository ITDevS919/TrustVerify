import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { CheckCircle2Icon, XCircleIcon, StarIcon, Globe } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useState } from "react";
import { cn } from "../../lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import {
  currencyConfig,
  convertPrice,
  formatPrice,
  getBrowserLocale,
} from "../../lib/multilingual";

// Consumer Fraud Protection Plans
const consumerPlans = [
  {
    name: "Essential",
    description: "Essential fraud protection for individuals",
    price: {
      monthly: 7.99,
      annual: 79.99
    },
    features: [
      "Unlimited fraud checks (lightweight only)",
      "Dark web monitoring",
      "Scam message analysis",
      "Basic ID Vault",
      "Browser extension alerts",
      "Email support",
      "Monthly fraud reports"
    ],
    limitations: [
      "Single user only"
    ],
    apiCalls: "Unlimited (lightweight)",
    addOns: [
      "Additional family member: £4.99/month",
      "Enhanced insurance: £9.99/month",
      "Priority Dispute Resolution: £19.99/incident",
      "Business Account Protection: £49.99/month"
    ],
    transactionFee: "£0.30 per successful transaction",
    cta: "Start Essential",
    popular: false,
    cost: "Individuals"
  },
  {
    name: "Plus",
    description: "Advanced protection for families & professionals",
    price: {
      monthly: 12.99,
      annual: 129.99
    },
    features: [
      "Everything in Essential",
      "Credit bureau monitoring",
      "Identity theft insurance",
      "Open banking transaction alerts",
      "Advanced biometric ID Vault",
      "Priority email + phone support",
      "Dispute letter automation",
      "Family sharing (up to 2 members)"
    ],
    limitations: [],
    apiCalls: "Unlimited (lightweight)",
    identityAllowance: "Credit monitoring included (no KYC/KYB)",
    addOns: [
      "Extra family member: £4.99/month",
      "Enhanced insurance: £9.99/month",
      "Priority Dispute Resolution: £19.99/incident",
      "Business Account Protection: £49.99/month"
    ],
    transactionFee: "£0.30 per successful transaction",
    cta: "Choose Plus",
    popular: true,
    cost: "Families & Professionals"
  },
  {
    name: "Elite",
    description: "Complete fraud resolution with concierge & business protection",
    price: {
      monthly: 18.99,
      annual: 189.99
    },
    features: [
      "Everything in Plus",
      "24/7 concierge support",
      "Business account protection (1 account included)",
      "Fraud insurance up to £5,000",
      "Family sharing (up to 4 members)",
      "Dedicated fraud specialist",
      "White-glove recovery service"
    ],
    limitations: [],
    apiCalls: "Unlimited (lightweight)",
    addOns: [
      "Extra family member: £4.99/month",
      "Enhanced insurance: £9.99/month",
      "Additional business accounts: £49.99/month",
      "Priority Dispute Resolution: £19.99/incident"
    ],
    transactionFee: "£0.30 per successful transaction",
    cta: "Go Elite",
    popular: false,
    cost: "Families & SMEs"
  }
];

// Business Fraud Protection Plans
const businessPlans = [
  {
    name: "Micro",
    description: "Essential API access for startups & small businesses",
    price: {
      monthly: 199,
      annual: 1999
    },
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
    limitations: [
      "Limited to 10,000 lightweight calls monthly",
      "Email support only",
      "No free KYC / KYB / AML checks"
    ],
    identityAddOns: [
      "KYC: £3.00 per check",
      "KYB: £7.00 per check",
      "AML/PEP: £0.60 per check"
    ],
    overage: "£0.0009 per extra lightweight call",
    cta: "Start Micro",
    popular: false,
    cost: "Startups"
  },
  {
    name: "Growth",
    description: "Scalable fraud protection for SMEs & fintech",
    price: {
      monthly: 499,
      annual: 4999
    },
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
    limitations: [
      "Limited to 50,000 lightweight calls monthly"
    ],
    identityAddOns: [
      "£50 identity verification credit per month",
      "(≈ 16 KYC checks or 8 KYB checks)",
      "KYC: £2.50 per check",
      "KYB: £6.00 per check",
      "AML/PEP: £0.50 per check"
    ],
    overage: "£0.0008 per extra lightweight call",
    cta: "Choose Growth",
    popular: false,
    cost: "SMEs & Fintech"
  },
  {
    name: "Professional",
    description: "Advanced fraud protection for established businesses",
    price: {
      monthly: 999,
      annual: 9999
    },
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
    limitations: [
      "Limited to 150,000 lightweight calls monthly"
    ],
    identityAddOns: [
      "KYC: £2.00 per check",
      "KYB: £5.00 per check",
      "AML/PEP: £0.40 per check"
    ],
    cta: "Choose Professional",
    popular: true,
    cost: "Established businesses"
  },
  {
    name: "Enterprise",
    description: "Custom solutions for banks & large platforms",
    price: {
      monthly: "Contact Sales",
      annual: "Custom"
    },
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
    limitations: [
      "Custom implementation required"
    ],
    identityAddOns: [
      "KYC: £1.00–£1.80 per check",
      "KYB: £3.00–£5.00 per check",
      "AML/PEP: £0.20–£0.35 per check",
      "Bulk KYC Packs: 10k–1M checks"
    ],
    cta: "Contact Sales",
    popular: false,
    cost: "Enterprise scale"
  }
];

// Education Plans for TrustVerify Fraud Academy
const educationPlans = [
  {
    name: "Fraud Awareness",
    description: "Foundation level fraud training for individuals",
    price: {
      monthly: "£49",
      annual: "£49"
    },
    features: [
      "Level 1 Foundation modules (5 modules)",
      "Understanding Fraud types & impact",
      "Online Safety for Individuals",
      "Business Fraud Basics",
      "Access Control & Authentication",
      "Reporting Fraud procedures",
      "Fraud risk checklists",
      "Top 10 scams videos (animated)",
      "Multiple choice quizzes",
      "6 months access"
    ],
    limitations: [
      "Foundation level only",
      "No certification available",
      "6 months access limit"
    ],
    cta: "Start Learning",
    popular: false,
    cost: "One-time payment"
  },
  {
    name: "Individual Track",
    description: "Complete personal fraud protection training",
    price: {
      monthly: 199,
      annual: 199
    },
    features: [
      "Everything in Fraud Awareness",
      "Level 2 Intermediate modules (5 modules)",
      "Segregation of Duties & Controls",
      "Vendor/Supplier Fraud Prevention",
      "Cyber Hygiene best practices",
      "Fraud Risk Assessment",
      "Data Protection & Privacy Laws",
      "Access control matrix templates",
      "Real-world case studies",
      "Scenario-based assignments",
      "12 months access",
      "Course completion certificate"
    ],
    limitations: [
      "No advanced/expert modules",
      "Individual use only"
    ],
    cta: "Get Full Training",
    popular: true,
    cost: "Annual subscription"
  },
  {
    name: "Bronze Business",
    description: "Foundation & Intermediate training for small teams",
    price: {
      monthly: 499,
      annual: 499
    },
    features: [
      "Level 1 & 2 modules for teams",
      "Up to 10 employee accounts",
      "Business fraud prevention focus",
      "Team progress tracking",
      "Compliance templates",
      "Group assignments",
      "Basic reporting dashboard",
      "12 months access",
      "Individual completion certificates"
    ],
    limitations: [
      "Limited to 10 employees",
      "No advanced modules",
      "Basic support only"
    ],
    cta: "Start Team Training",
    popular: false,
    cost: "Per company/year"
  },
  {
    name: "Silver Business",
    description: "Complete fraud training with professional certification",
    price: {
      monthly: 2500,
      annual: 2500
    },
    features: [
      "All 4 levels (20 modules total)",
      "Up to 50 employee accounts",
      "AML & KYC best practices",
      "Insider threat detection",
      "Incident response training",
      "Fraud analytics & detection tools",
      "Professional certification eligible",
      "Advanced reporting & analytics",
      "Priority support",
      "24 months access",
      "Branded certificates available"
    ],
    limitations: [
      "Limited to 50 employees",
      "Certification exam additional £99/person"
    ],
    cta: "Choose Silver",
    popular: true,
    cost: "Per company/year"
  },
  {
    name: "Gold Enterprise",
    description: "Premium training with unlimited access and custom workshops",
    price: {
      monthly: 9999,
      annual: 9999
    },
    features: [
      "Everything in Silver Business",
      "Unlimited employee accounts",
      "Dedicated live workshops",
      "Custom fraud policy templates",
      "Board-level reporting frameworks",
      "Live masterclass sessions",
      "Insurance integration guidance",
      "Branded certification program",
      "Dedicated account manager",
      "Priority certification processing",
      "White-label platform options",
      "Custom content development",
      "Ongoing consultation included",
      "Lifetime access"
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
    cost: "Enterprise solution"
  }
];


const consumerAddOns = [
  {
    title: "Additional Family Members",
    description: "Extend protection to extra family members",
    price: 4.99,
    unit: "per member/month"
  },
  {
    title: "Enhanced Insurance Coverage",
    description: "Increase fraud insurance up to £25,000",
    price: 9.99,
    unit: "per month"
  },
  {
    title: "Priority Dispute Resolution",
    description: "Fast-track dispute resolution within 24 hours",
    price: 19.99,
    unit: "per incident"
  },
  {
    title: "Business Account Protection",
    description: "Extend fraud protection to business accounts",
    price: 49.99,
    unit: "per month"
  }
];

const businessAddOns = [
  {
    title: "Trust Intelligence Suite",
    description: "Premium data analytics, fraud insights, and advanced reporting tools",
    price: 249,
    unit: "per month"
  },
  {
    title: "White-Label Dashboard",
    description: "Fully customizable branded dashboard for your platform",
    price: 499,
    unit: "per month"
  },
  {
    title: "API Overage",
    description: "Additional API calls beyond your plan limit",
    price: "0.02-0.04",
    unit: "per extra call"
  },
  {
    title: "Enhanced Verification",
    description: "Additional document verification and biometric checks",
    price: 25,
    unit: "per verification"
  },
  {
    title: "Custom Compliance Automation",
    description: "Tailored compliance workflows and automated reporting",
    price: 999,
    unit: "per month"
  },
  {
    title: "Custom Integration",
    description: "Dedicated development for platform integration",
    price: 4999,
    unit: "one-time setup"
  }
];

const educationAddOns = [
  {
    title: "Certification Exam",
    description: "Professional certification exam for TrustVerify Certified Fraud-Resilient Professional",
    price: 99,
    unit: "per attempt"
  },
  {
    title: "Additional Retake",
    description: "Extra exam retake if needed (unlimited retakes included in Gold)",
    price: 99,
    unit: "per additional attempt"
  },
  {
    title: "Fast-Track Certification",
    description: "Priority processing and 24-hour certificate delivery",
    price: 149,
    unit: "one-time"
  },
  {
    title: "Extended Access",
    description: "Extend course access by 12 additional months",
    price: 99,
    unit: "per extension"
  },
  {
    title: "1:1 Expert Consultation",
    description: "Personal fraud prevention consultation with certified expert",
    price: 299,
    unit: "per hour"
  },
  {
    title: "Custom Team Workshop",
    description: "On-site or virtual workshop customized for your organization",
    price: 2499,
    unit: "per workshop"
  }
];

const clientImages = [
  { src: "/client-image1.png", alt: "Client 1" },
  { src: "/client-image2.png", alt: "Client 2" },
  { src: "/client-image3.png", alt: "Client 3" },
  { src: "/client-image4.png", alt: "Client 4" },
  { src: "/client-image5.png", alt: "Client 5" },
];

const faqItems = [
  {
    id: "item-1",
    question: "What's included in the Essential/Plus/Elite plan?",
    answer: "Our consumer plans include unlimited lightweight fraud checks, dark web monitoring, scam message analysis, and various levels of identity protection. Plus and Elite plans add credit monitoring, identity theft insurance, and business account protection.",
  },
  {
    id: "item-2",
    question: "How does pricing scale with transaction volume?",
    answer: "Our business pricing is based on monthly API call limits. For higher volumes, Enterprise plans offer custom pricing with dedicated infrastructure and support. Consumer plans include unlimited lightweight fraud checks.",
  },
  {
    id: "item-3",
    question: "What are the transaction fees?",
    answer: "Transaction fees are £0.30 per successful transaction for all consumer plans. Business plans have no transaction fees - pricing is based on API usage and monthly subscriptions.",
  },
  {
    id: "item-4",
    question: "Can I change plans anytime?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle. For annual plans, we prorate the difference.",
  },
  {
    id: "item-5",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and bank transfers. Enterprise accounts can arrange custom payment terms including wire transfers and invoicing.",
  },
  {
    id: "item-6",
    question: "Is there a setup fee?",
    answer: "No setup fees for any of our standard plans. Enterprise plans may have custom setup fees depending on integration requirements, which will be discussed during the sales process.",
  },
];

export const PricingDetail = (): JSX.Element => {
  const [isMonthly, setIsMonthly] = useState(true);
  const [planType, setPlanType] = useState<'consumer' | 'business' | 'education'>('business');
  const [selectedLocale, setSelectedLocale] = useState<string>(getBrowserLocale());

  const basePlans = planType === 'consumer' ? consumerPlans : planType === 'business' ? businessPlans : educationPlans;
  const addOns = planType === 'consumer' ? consumerAddOns : planType === 'business' ? businessAddOns : educationAddOns;

  // Convert plans to localized pricing
  const plans = basePlans.map(plan => ({
    ...plan,
    localPrice: {
      monthly: typeof plan.price.monthly === 'string' ? plan.price.monthly : convertPrice(plan.price.monthly, currencyConfig[selectedLocale as keyof typeof currencyConfig]?.code || 'GBP'),
      annual: typeof plan.price.annual === 'string' ? plan.price.annual : convertPrice(plan.price.annual, currencyConfig[selectedLocale as keyof typeof currencyConfig]?.code || 'GBP')
    }
  }));

  const getPrice = (plan: typeof plans[0]) => {
    const price = isMonthly ? plan.localPrice.monthly : plan.localPrice.annual;
    const period = isMonthly ? "month" : "year";
    
    if (typeof price === 'string') {
      return { price, period, savings: 0 };
    }
    
    const savings = !isMonthly && typeof plan.localPrice.monthly === 'number' && typeof plan.localPrice.annual === 'number' 
      ? Math.round(((plan.localPrice.monthly * 12 - plan.localPrice.annual) / (plan.localPrice.monthly * 12)) * 100) 
      : 0;

    return { price, period, savings };
  };

  const getPlanTypeTitle = () => {
    if (planType === 'consumer') return 'Consumer Fraud Protection';
    if (planType === 'business') return 'Business Fraud Protection';
    return 'TrustVerify Fraud Academy';
  };

  const getPlanTypeDescription = () => {
    if (planType === 'consumer') return 'Choose the perfect plan for your personal and family needs. No hidden fees, no surprises. All plans include our core fraud prevention and identity protection.';
    if (planType === 'business') return 'Flexible pricing plans designed to scale with your business growth';
    return 'Professional fraud prevention training for individuals and businesses. Learn from industry experts and earn recognized certifications.';
  };

  return (
    <main className="bg-white overflow-hidden w-full relative">
      <Header 
        backgroundImage = '/Header_Pricing.png'
        content={{
          badge: {
            text: "PRICING",
            variant: "secondary"
          },
          title: "Simple, Transparent Pricing",
          description: "Choose the perfect plan for your business. No hidden fees, no surprises. All plans include our core fraud prevention and escrow protection.",
        }}
      />
      <section className="w-full relative">
        <img
            className="absolute top-[699px] right-[101px] w-[30px] h-[30px]"
            alt="Icon star"
            src="/icon-star-1.svg"
        />
        <img
          className="absolute bottom-[228px] left-[100px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star.svg"
        />
        <img
            className="absolute top-[115px] left-[-227px] w-[399px] h-[528px] z-10 pointer-events-none"
            alt="Nate shape"
            src="/nate-shape.svg"
        />
        <div className="flex flex-col items-center gap-9 relative mx-auto max-w-[1270px] px-6 md:px-10 py-24">
          <div className="z-10 flex flex-col items-center gap-6 relative">
            <div className="flex flex-col items-start justify-center gap-5 relative w-full">
              <Badge className="h-[30px] bg-[#003d2b1a] hover:bg-[#003d2b1a] rounded-[800px] px-4">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm leading-[14px] tracking-[0]">
                  PRICING PLAN
                </span>
              </Badge>

              <p className="relative w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[46px] tracking-[-0.92px] leading-[55.2px]">
                <span className="text-[#003d2b] tracking-[-0.42px]">{getPlanTypeTitle()}</span>
                <span className="text-[#0b3a78] tracking-[-0.42px]"> Plans</span>
              </p>

              <p className="relative flex items-center justify-center w-full [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg tracking-[0] leading-[27.2px]">
                {getPlanTypeDescription()}
              </p>
            </div>
           {/* Currency Selector */}
           <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-[#808080]" />
              <select 
                value={selectedLocale} 
                onChange={(e) => setSelectedLocale(e.target.value)}
                className="px-4 py-2 border border-[#e4e4e4] rounded-lg bg-white [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#003d2b] focus:outline-none focus:ring-2 focus:ring-app-secondary"
              >
                <optgroup label="English Speaking">
                  <option value="en-GB">🇬🇧 United Kingdom (£ GBP)</option>
                  <option value="en-US">🇺🇸 United States ($ USD)</option>
                  <option value="en-CA">🇨🇦 Canada (C$ CAD)</option>
                  <option value="en-AU">🇦🇺 Australia (A$ AUD)</option>
                </optgroup>
                <optgroup label="European Union">
                  <option value="de-DE">🇩🇪 Germany (€ EUR)</option>
                  <option value="fr-FR">🇫🇷 France (€ EUR)</option>
                  <option value="es-ES">🇪🇸 Spain (€ EUR)</option>
                  <option value="it-IT">🇮🇹 Italy (€ EUR)</option>
                </optgroup>
              </select>
            </div>

            {/* Plan Type Toggle */}
            <div className="flex items-center justify-center w-full mb-4">
              <div className="bg-white rounded-full p-1 shadow-md border border-[#e4e4e4]">
                <div className="flex">
                  <button
                    onClick={() => setPlanType('consumer')}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 [font-family:'DM_Sans_18pt-Medium',Helvetica]",
                      planType === 'consumer'
                        ? 'bg-app-secondary text-white shadow-sm'
                        : 'text-[#808080] hover:text-[#003d2b]'
                    )}
                  >
                    Consumer Plans
                  </button>
                  <button
                    onClick={() => setPlanType('business')}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 [font-family:'DM_Sans_18pt-Medium',Helvetica]",
                      planType === 'business'
                        ? 'bg-app-secondary text-white shadow-sm'
                        : 'text-[#808080] hover:text-[#003d2b]'
                    )}
                  >
                    Business Plans
                  </button>
                  <button
                    onClick={() => setPlanType('education')}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 [font-family:'DM_Sans_18pt-Medium',Helvetica]",
                      planType === 'education'
                        ? 'bg-app-secondary text-white shadow-sm'
                        : 'text-[#808080] hover:text-[#003d2b]'
                    )}
                  >
                    Education & Training
                  </button>
                </div>
              </div>
            </div>
            <div className="relative mx-auto w-[200px] h-[40px]">
              <div className="relative w-full h-full flex items-center justify-between bg-transparent border border-solid border-[#e4e4e4] rounded-[12px] p-2">
                {/* Background slider */}
                <div
                  className={cn(
                    "absolute top-1 h-[30px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] transition-all duration-300 ease-in-out",
                    isMonthly ? "left-[10px] w-[88px]" : "left-[102px] w-[88px]"
                  )}
                />
                
                {/* Monthly button */}
                <button
                  type="button"
                  onClick={() => setIsMonthly(true)}
                  className={cn(
                    "relative z-10 w-[174px] h-[30px] flex items-center justify-center rounded-lg transition-all duration-300 cursor-pointer",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-secondary"
                  )}
                  aria-pressed={isMonthly}
                  aria-label="Monthly pricing"
                >
                  <span
                    className={cn(
                      "[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[17.5px] text-center tracking-[0] leading-[30.0px] whitespace-nowrap transition-colors duration-300",
                      isMonthly ? "text-white" : "text-[#808080]"
                    )}
                  >
                    Monthly
                  </span>
                </button>

                {/* Annually button */}
                <button
                  type="button"
                  onClick={() => setIsMonthly(false)}
                  className={cn(
                    "relative z-10 w-[174px] h-[30px] flex items-center justify-center rounded-lg transition-all duration-300 cursor-pointer",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-secondary"
                  )}
                  aria-pressed={!isMonthly}
                  aria-label="Annually pricing"
                >
                  <span
                    className={cn(
                      "[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[17.5px] text-center tracking-[0] leading-[30.0px] whitespace-nowrap transition-colors duration-300",
                      !isMonthly ? "text-white font-bold" : "text-[#808080]"
                    )}
                  >
                    Annually
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-center xl:items-start gap-[30px] relative w-full max-w-[1621px] flex-wrap justify-center">
            {plans.map((plan) => {
              const pricing = getPrice(plan);
              const isPopular = plan.popular;
              const isFeatured = isPopular && planType === 'business';
              
              return (
                <Card 
                  key={plan.name}
                  className={cn(
                    "z-10 relative w-full max-w-[363px] rounded-[20px] border border-solid overflow-hidden",
                    isFeatured 
                      ? "bg-app-primary border-[#f3f3f3]" 
                      : "bg-white border-[#e4e4e4]"
                  )}
                >
                  {isPopular && (
                    <div className={cn(
                      "absolute top-9 -right-11 w-[190px] h-[35px] flex items-center justify-center rotate-45 z-20",
                      isFeatured ? "bg-white" : "bg-app-secondary"
                    )}>
                      <span className={cn(
                        "[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-base text-center tracking-[0] leading-[27.2px]",
                        isFeatured ? "text-[#004050]" : "text-white"
                      )}>
                        { isFeatured ? "FEATURED" : "POPULAR" }
                      </span>
                    </div>
                  )}

                  <CardContent className="p-[31px] flex flex-col gap-[30px]">
                    <div className="flex flex-col gap-[13px]">
                      <h3 className={cn(
                        "[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl tracking-[0] leading-6",
                        isFeatured ? "text-white" : "text-[#040303]"
                      )}>
                        {plan.name}
                      </h3>

                      <div className="flex flex-col gap-[13px]">
                        <div className="flex items-start gap-1">
                          {typeof pricing.price === 'string' ? (
                            <span className={cn(
                              "[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[46px] tracking-[0] leading-[55.2px]",
                              isFeatured ? "text-white" : "text-app-secondary"
                            )}>
                              {pricing.price}
                            </span>
                          ) : (
                            <>
                              <span className={cn(
                                "[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-3xl tracking-[0] leading-[55.2px]",
                                isFeatured ? "text-white" : "text-app-secondary"
                              )}>
                                {currencyConfig[selectedLocale as keyof typeof currencyConfig]?.symbol || '£'}
                              </span>
                              <span className={cn(
                                "[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[46px] tracking-[0] leading-[55.2px]",
                                isFeatured ? "text-white" : "text-app-secondary"
                              )}>
                                {typeof pricing.price === 'number' ? pricing.price.toFixed(2) : pricing.price}
                              </span>
                              <span className={cn(
                                "[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-base tracking-[0] leading-[55.2px] whitespace-nowrap",
                                isFeatured ? "text-white" : "text-[#808080]"
                              )}>
                                /per {pricing.period === 'month' ? 'Month' : 'Year'}
                              </span>
                            </>
                          )}
                        </div>

                        <p className={cn(
                          "[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-base tracking-[0] leading-[27.2px]",
                          isFeatured ? "text-white" : "text-[#808080]"
                        )}>
                          {plan.description}
                        </p>
                        {pricing.savings > 0 && (
                          <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-green-600 text-sm">
                            Save {pricing.savings}% annually
                          </p>
                        )}
                      </div>
                    </div>

                    <Button 
                      className={cn(
                        "w-full h-[54px] rounded-xl [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-lg tracking-[0] leading-[18px]",
                        isFeatured 
                          ? "bg-white hover:bg-white/90 text-[#004050]" 
                          : "bg-app-secondary hover:bg-app-secondary/90 text-white"
                      )}
                      onClick={() => {
                        if (plan.cta === "Contact Sales") {
                          window.location.href = '/auth?mode=contact';
                        } else {
                          window.location.href = '/auth';
                        }
                      }}
                    >
                      {plan.cta}
                    </Button>

                    <div className="w-full h-px bg-[#e4e4e4]"></div>

                    {/* API Calls Highlight (Business/Consumer) */}
                    {planType === 'business' && (
                      <div className="bg-[#f3f3f3] rounded-lg p-3 border border-[#e4e4e4]">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">API Calls</h4>
                          <Badge className="bg-app-secondary text-white text-xs">Lightweight</Badge>
                        </div>
                        <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-app-secondary text-xl">
                          {plan.name === 'Micro' && '10,000'}
                          {plan.name === 'Growth' && '50,000'}
                          {plan.name === 'Professional' && '150,000'}
                          {plan.name === 'Enterprise' && '500,000+'}
                        </p>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs">per month</p>
                      </div>
                    )}

                    {planType === 'consumer' && (plan as any).apiCalls && (
                      <div className="bg-[#f3f3f3] rounded-lg p-3 border border-[#e4e4e4]">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">Fraud Checks</h4>
                          <Badge className="bg-app-secondary text-white text-xs">Lightweight</Badge>
                        </div>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">{(plan as any).apiCalls}</p>
                      </div>
                    )}

                    <div className="flex flex-col gap-5">
                      <h4 className={cn(
                        "[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-xl tracking-[0] leading-6",
                        isFeatured ? "text-white" : "text-[#040303]"
                      )}>
                        Features Included:
                      </h4>

                      <div className="flex flex-col gap-2.5">
                        {plan.features.filter(f => planType === 'business' ? !f.toLowerCase().includes('api call') : true).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2Icon className={cn(
                              "w-5 h-5 flex-shrink-0 mt-0.5",
                              isFeatured ? "text-white" : "text-app-secondary"
                            )} />
                            <span className={cn(
                              "[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-base tracking-[0] leading-[27.2px]",
                              isFeatured ? "text-white" : "text-[#808080]"
                            )}>
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Identity Add-ons (Business) */}
                    {planType === 'business' && (plan as any).identityAddOns && (
                      <div className="bg-[#f3f3f3] rounded-lg p-3 border border-[#e4e4e4]">
                        <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm mb-2">Identity Verification</h4>
                        <ul className="space-y-1">
                          {(plan as any).identityAddOns.map((addon: string, idx: number) => (
                            <li key={idx} className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs">
                              • {addon}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Overage (Business) */}
                    {planType === 'business' && (plan as any).overage && (
                      <div className="bg-[#f3f3f3] rounded-lg p-3 border border-[#e4e4e4]">
                        <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xs mb-1">Overage</h4>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">{(plan as any).overage}</p>
                      </div>
                    )}

                    {/* Consumer-specific sections */}
                    {planType === 'consumer' && (plan as any).identityAllowance && (
                      <div className="bg-[#f3f3f3] rounded-lg p-3 border border-[#e4e4e4]">
                        <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm mb-1">Identity Verification</h4>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs">{(plan as any).identityAllowance}</p>
                      </div>
                    )}

                    {planType === 'consumer' && (plan as any).transactionFee && (
                      <div className="bg-[#f3f3f3] rounded-lg p-3 border border-[#e4e4e4]">
                        <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm mb-1">Transaction Fee</h4>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs">{(plan as any).transactionFee}</p>
                      </div>
                    )}

                    {plan.limitations && plan.limitations.length > 0 && (
                      <div className="flex flex-col gap-5">
                        <h4 className={cn(
                          "[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-xl tracking-[0] leading-6",
                          isFeatured ? "text-white" : "text-[#040303]"
                        )}>
                          Limitations:
                        </h4>

                        <div className="flex flex-col gap-2.5">
                          {plan.limitations.map((limitation, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                              <XCircleIcon className={cn(
                                "w-5 h-5 flex-shrink-0 mt-0.5",
                                isFeatured ? "text-white" : "text-[#FF4B26]"
                              )} />
                              <span className={cn(
                                "[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-base tracking-[0] leading-[27.2px]",
                                isFeatured ? "text-white" : "text-[#808080]"
                              )}>
                                {limitation}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative w-full flex justify-between bg-[#f4f4f4] py-[72px]">
        <img
              className="absolute bottom-0 right-0 w-[213px] h-[199px]"
              alt="Decorative shape"
              src="/shape-nate-30-svg-fill.svg"
            />
        <div className="flex w-full max-w-[1621px] mx-auto px-6 md:px-10 flex-col items-center gap-[50px]">
          <div className="flex flex-col items-center gap-[50px] w-full">
            <div className="flex flex-col items-center gap-[60px]">
              <div className="flex flex-col items-center gap-5">
                <div className="flex flex-col items-center gap-5">
                  <Badge className="h-[30px] bg-[#003d2b1a] hover:bg-[#003d2b1a] text-[#003d2b] rounded-[800px] px-4">
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                      FEES &amp; DETAILS
                    </span>
                  </Badge>

                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.50px] leading-[67px]">
                    <span className="text-[#003d2b] tracking-[-0.27px]">Transaction </span>
                    <span className="text-[#0b3a78] tracking-[-0.27px]">Fees</span>
                  </p>
                </div>
              </div>
            </div>

            {planType === 'business' && (
              <div className="flex items-center gap-[50px] w-full justify-center flex-wrap z-10">
                {plans.filter(p => ['Micro', 'Growth', 'Professional', 'Enterprise'].includes(p.name)).map((plan) => {
                  const percentage = plan.name === 'Micro' ? '2.9%' : plan.name === 'Growth' ? '2.4%' : plan.name === 'Professional' ? '1.9%' : '1.5%';
                  return (
                    <Card
                      key={plan.name}
                      className="flex items-center bg-white rounded-[20px] border-0 shadow-none"
                    >
                      <div className="px-5 py-8 w-full">
                        <div className="inline-flex items-center gap-5">
                          <div className="flex items-center justify-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-app-secondary text-[46px] tracking-[-0.92px] leading-[normal] whitespace-nowrap">
                            {percentage}
                          </div>

                          <div className="flex flex-col w-[175px] items-start gap-0.5">
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-7">
                              {plan.name}
                            </div>

                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-[27px]">
                              + {formatPrice(0.30, currencyConfig[selectedLocale as keyof typeof currencyConfig]?.code || 'GBP', selectedLocale)} per transaction
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <p className="flex items-start justify-center text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-base tracking-[0] leading-[27.2px] z-10">
            <span className="text-[#ff4b26]">Disclaimer:</span>
            <span className="text-[#003d2b]">
              {" "}
              No fees for failed transactions. Disputed transactions are protected
              at no additional cost.
            </span>
          </p>
        </div>
      </section>

      <section className="relative flex flex-col w-full items-center gap-[100px] py-24">
        <img
          className="absolute top-[124px] -left-[222px] w-[439px] h-[653px]"
          alt="shape"
          src="/shape_nate_32.png"
        />
        <div className="flex flex-col items-center gap-[60px] w-full max-w-[1117px] px-4">
          <header className="flex flex-col items-center gap-5 w-full max-w-[893px]">
            <div className="flex flex-col items-center gap-5 w-full">
              <Badge className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-[800px] px-5 py-1.5 h-[30px]">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                  OPTIONAL PRICING
                </span>
              </Badge>

              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.27px] leading-[67px] z-10">
                <span className="text-[#003d2b]">Optional </span>
                <span className="text-[#0b3a78]">Add-ons</span>
              </h2>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px] w-full z-10">
            {addOns.map((addOn, index) => (
              <Card
                key={index}
                className="bg-[#f3f3f3] border-0 rounded-[10px] h-[217px]"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-[17.4px] tracking-[0] leading-[22px] mb-4">
                    {addOn.title}
                  </h3>

                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6 mb-auto">
                    {addOn.description}
                  </p>

                  <div className="flex items-end gap-[5px] mt-4">
                    <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-app-secondary text-3xl tracking-[-0.92px] leading-[normal]">
                      {typeof addOn.price === 'string' 
                        ? `${currencyConfig[selectedLocale as keyof typeof currencyConfig]?.symbol || '£'}${addOn.price}` 
                        : formatPrice(addOn.price, currencyConfig[selectedLocale as keyof typeof currencyConfig]?.code || 'GBP', selectedLocale)}
                    </span>
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm tracking-[0] leading-6">
                      /{addOn.unit}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="z-10 px-6 md:px-10">
          <Card className="bg-app-primary rounded-lg md:rounded-xl lg:rounded-2xl xl:rounded-[20px] shadow-[0px_4px_10px_#003d2b1a] border-0 max-w-[1370px] mx-auto">
            <CardContent className="flex items-center gap-0 sm:gap-4 md:gap-9 lg:gap-14 py-3 sm:py-4 md:py-5 lg:py-6 px-5 sm:px-7 md:px-10 lg:px-14">
              <div className="flex w-full mt-0 sm:mt-2 md:mt-4 lg:mt-7 flex-col items-start gap-2 sm:gap-4 md:gap-6 lg:gap-8">
                <div className="flex flex-col items-start gap-1 sm:gap-2 md:gap-4 lg:gap-6 w-full">
                  <p className="mt-[-1.00px] text-white text-base md:text-xl lg:text-3xl xl:text-[40px] tracking-tighter sm:tracking-[-0.50px] leading-6 sm:leading-8 md:leading-10 lg:leading-[50px] xl:leading-[67px] flex items-center justify-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
                    Ready to Secure Your Transactions?
                  </p>

                  <p className="flex items-center justify-center [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-[8px] md:text-[12px] lg:text-lg xl:text-[22px] tracking-[0]  leading-[10px] sm:leading-[15px] md:leading-[21px] lg:leading-[30px]">
                    Join thousands of businesses protecting their transactions with TrustVerify.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                  <Button 
                    size="none"
                    className="bg-white rounded-[4px] sm:rounded-[6px] md:rounded-[8px] lg:rounded-[10px] hover:bg-white/90 px-3 py-0 sm:px-6 sm:py-2 md:px-8 md:py-4  lg:px-10 lg:py-5">
                    <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-app-primary text-[7px] sm:text-[10px] md:text-sm lg:text-lg text-center tracking-[-0.20px]">
                      Start Free Trial
                    </p>
                  </Button>

                  <Button
                    variant="outline"
                    size="none"
                    className="rounded-[4px] sm:rounded-[6px] md:rounded-[8px] lg:rounded-[10px] border border-solid border-white bg-transparent hover:bg-white/10 text-white hover:text-white px-3 py-0 sm:px-6 sm:py-1.5 md:px-8 md:py-3 lg:px-10 lg:py-5"
                  >
                    <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[7px] sm:text-[10px] md:text-sm lg:text-lg text-center tracking-[-0.20px] leading-[18px]">
                      Contact Sales
                    </span>
                  </Button>
                </div>
              </div>
              
              <img
                className="w-[105px] h-[82px] sm:w-[157px] sm:h-[123px] md:h-[210px] md:w-[164px] lg:w-[315px] lg:h-[247px] bg-blend-color-dodge flex-shrink-0"
                alt="Element"
                src="/group-4.png"
              />

            </CardContent>
          </Card>
        </div>
      </section>

      <section className="relative w-full pb-24">
        <img
          className="absolute -top-[162px] right-[-200px] w-[399px] h-[528px]"
          alt="Nate shape"
          src="/nate-shape-1.svg"
        />
        <div className="flex flex-col w-full items-center px-6 md:px-10 gap-[60px] py-12">
          <header className="flex flex-col max-w-[1129px] items-center gap-[19px]">
            <Badge
              variant="secondary"
              className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-[30px]"
            >
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                FAQS
              </span>
            </Badge>

            <div className="flex flex-col items-center gap-5 w-full z-10">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.27px] leading-[67px]">
                <span className="text-[#003d2b]">Your Most Frequently Asked </span>
                <span className="text-[#0b3a78]">Questions</span>
              </p>

              <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg text-center tracking-[-0.20px] leading-7">
                Find quick answers to common questions about TrustVerify.
              </p>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row items-center gap-[30px] w-full max-w-[1270px]">
            <div className="relative w-full lg:w-1/2 flex-shrink-0">
              <div className="w-11/12 h-[400px] sm:h-[586px] rounded-[20px] bg-[url(/faq_image.png)] bg-cover bg-center" />

              <div className="absolute right-0 bottom-10 w-[140px] lg:w-[210px] bg-app-primary rounded-[10px] p-5 flex flex-col gap-5">
                <div className="flex flex-col items-center">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm lg:text-base text-white tracking-[0] leading-[30.6px]">
                    100+ Client
                  </span>

                  <div className="flex items-center gap-0.5 lg:gap-1">
                    <StarIcon className="w-4 h-4 text-white fill-white" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-[10px] lg:text-base tracking-tighter leading-[20px] lg:leading-[30.6px] opacity-80">
                      5.0 (250 Reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  {clientImages.map((client, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full border border-[#004050] overflow-hidden flex items-center justify-center ${
                        index > 0 ? '-ml-2' : ''
                      }`}
                    >
                      <div
                        className="w-[30px] h-[30px] bg-cover bg-center"
                        style={{ backgroundImage: `url(${client.src})` }}
                      />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border border-[#004050] bg-white overflow-hidden flex items-center justify-center -ml-2">
                    <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#040303] text-xs tracking-[0] leading-[20.4px]">
                      17+
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full lg:w-1/2 flex-shrink-0">
              <Accordion
                type="single"
                collapsible
                defaultValue="item-2"
                className="flex flex-col gap-[30px]"
              >
                {faqItems.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="rounded-[10px] border border-[#e4e4e4] overflow-hidden data-[state=open]:border-app-primary"
                  >
                    <AccordionTrigger className="px-5 py-4 hover:no-underline data-[state=open]:bg-app-primary data-[state=open]:text-white data-[state=open]:border-b data-[state=open]:border-[#ffffff1a]">
                      <span className="[font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-xl tracking-[0] leading-6 text-left">
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    {item.answer && (
                      <AccordionContent className="px-5 py-5 bg-app-primary">
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[27.2px] opacity-80">
                          {item.answer}
                        </p>
                      </AccordionContent>
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
};
