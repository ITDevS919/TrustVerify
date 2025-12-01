import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { CheckCircle2Icon, XCircleIcon, StarIcon } from "lucide-react";
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

const starterFeatures = [
  "Up To 50 Transactions/month",
  "Basic Identity Verification",
  "Standard Escrow Protection",
  "Email Support",
  "7-day Settlement",
  "Basic Fraud Detection",
  "Mobile App Access",
  "Transaction History",
];

const starterLimitations = [
  "Limited Api Access",
  "No Priority Support",
  "Basic Reporting Only",
];

const professionalFeatures = [
  "Up To 500 Transactions/month",
  "Advanced Kyc Verification",
  "Premium Source Protection",
  "Priority Email & Chat Support",
  "Same-day Settlement",
  "Ai-powered Fraud Detection",
  "Full Api Access",
  "Advanced Reporting",
  "Team Management (up To 10 Users)",
  "Custom Transaction Categories",
  "Dispute Resolution Assistance",
  "White-label Options",
];

const professionalLimitations = ["No Phone Support", "Standard Sla"];

const enterpriseFeatures = [
  "Unlimited Transactions",
  "Enterprise Kyc & Compliance",
  "Maximum Escrow Protection",
  "24/7 Phone & Priority Support",
  "Dedicated Account Manager",
  "Instant Settlement Options",
  "Custom Fraud Detection Rules",
  "Dedicated Api Endpoints",
  "Advanced Security Features",
  "Unlimited Team Members",
  "Custom Integrations",
  "Dedicated Account Manager",
  "Advanced Security Features",
  "Compliance Reporting",
  "Custom Workflows",
  "Volume-based Pricing",
  "Tailored Compliance Packages",
  "White-label Solutions",
];


const pricingTiers = [
  {
    percentage: "2.9%",
    title: "Starter",
    description: "+ $0.30 per transaction",
  },
  {
    percentage: "2.4%",
    title: "Professional",
    description: "+ $0.30 per transaction",
  },
  {
    percentage: "1.9%",
    title: "Enterprise",
    description: "+ $0.30 per transaction",
  },
];

const addOns = [
  {
    title: "Enhanced Verification",
    description: "Additional document verification and biometric checks",
    price: "$19.05",
    unit: "/per verification",
  },
  {
    title: "Express Settlement",
    description: "Reduce settlement time to under 2 hours",
    price: "$31.75",
    unit: "/per transaction",
  },
  {
    title: "Compliance Plus",
    description: "Advanced AML and sanctions screening",
    price: "$379.73",
    unit: "/per month",
  },
  {
    title: "Custom Integration",
    description: "Dedicated development for platform integration",
    price: "$3,175",
    unit: "one-time setup",
  },
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
    question: "What services do you offer?",
    answer: null,
  },
  {
    id: "item-2",
    question: "How do I know if I need a financial consultant?",
    answer:
      "If you're uncertain about managing investments, planning for retirement, or structuring your finances, consulting a financial professional can help. Our team assists in clarifying your goals, optimizing your strategies.",
  },
  {
    id: "item-3",
    question: "What can I expect from an initial consultation?",
    answer: null,
  },
  {
    id: "item-4",
    question: "Are my consultations confidential?",
    answer: null,
  },
  {
    id: "item-5",
    question: "What kind of clients do you work with?",
    answer: null,
  },
];

export const PricingDetail = (): JSX.Element => {
  const [isMonthly, setIsMonthly] = useState(true);

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
        <div className="flex flex-col items-start gap-9 relative mx-auto max-w-[1270px] px-6 md:px-10 py-24">
          <div className="z-10 flex flex-col items-start gap-6 relative">
            <div className="flex flex-col items-start justify-center gap-5 relative w-full">
              <Badge className="h-[30px] bg-[#003d2b1a] hover:bg-[#003d2b1a] rounded-[800px] px-4">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm leading-[14px] tracking-[0]">
                  PRICING PLAN
                </span>
              </Badge>

              <p className="relative w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[46px] tracking-[-0.92px] leading-[55.2px]">
                <span className="text-[#003d2b] tracking-[-0.42px]">Business</span>
                <span className="text-[#0b3a78] tracking-[-0.42px]"> Pricing</span>
              </p>

              <p className="relative flex items-center justify-center w-full [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg tracking-[0] leading-[27.2px]">
                Flexible pricing plans designed to scale with your business growth
              </p>
            </div>

            <div className="relative w-[365px] h-[70px]">
              <div className="relative w-full h-full flex items-center justify-between bg-transparent border border-solid border-[#e4e4e4] rounded-[20px] p-2">
                {/* Background slider */}
                <div
                  className={cn(
                    "absolute top-1.5 h-[54px] rounded-xl bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] transition-all duration-300 ease-in-out",
                    isMonthly ? "left-[8px] w-[174px]" : "left-[182px] w-[174px]"
                  )}
                />
                
                {/* Monthly button */}
                <button
                  type="button"
                  onClick={() => setIsMonthly(true)}
                  className={cn(
                    "relative z-10 w-[174px] h-[54px] flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer",
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
                    "relative z-10 w-[174px] h-[54px] flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer",
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

          <div className="flex flex-col xl:flex-row items-center xl:items-start gap-[30px] relative w-full">
            <Card className="z-10 relative w-full max-w-[403px] bg-white rounded-[20px] border border-solid border-[#e4e4e4]">
              <CardContent className="p-[31px] flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[13px]">
                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#040303] text-xl tracking-[0] leading-6">
                    Starter
                  </h3>

                  <div className="flex flex-col gap-[13px]">
                    <div className="flex items-start gap-1">
                      <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-app-secondary text-3xl tracking-[0] leading-[55.2px]">
                        £
                      </span>
                      <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-app-secondary text-[46px] tracking-[0] leading-[55.2px]">
                        159.68
                      </span>
                      <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-[55.2px] whitespace-nowrap">
                        /per Month
                      </span>
                    </div>

                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-[27.2px]">
                      Perfect For Individuals And Small Businesses
                    </p>
                  </div>
                </div>

                <Button className="w-full h-[54px] bg-app-secondary hover:bg-app-secondary/90 rounded-xl [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-white text-lg tracking-[0] leading-[18px]">
                  Start Free Trial
                </Button>

                <div
                  className="w-full h-px bg-[#e4e4e4]"
                ></div>

                <div className="flex flex-col gap-5">
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#040303] text-xl tracking-[0] leading-6">
                    Features Included:
                  </h4>

                  <div className="flex flex-col gap-2.5">
                    {starterFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2.5">
                        <CheckCircle2Icon className="w-5 h-5 text-app-secondary flex-shrink-0 mt-0.5" />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-[27.2px]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#040303] text-xl tracking-[0] leading-6">
                    Limitations:
                  </h4>

                  <div className="flex flex-col gap-2.5">
                    {starterLimitations.map((limitation, index) => (
                      <div key={index} className="flex items-start gap-2.5">
                        <XCircleIcon
                          className="w-5 h-5 text-[#FF4B26] flex-shrink-0 mt-0.5"
                        />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-[27.2px]">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative w-full max-w-[404px] bg-app-primary rounded-[20px] overflow-hidden border border-solid border-[#f3f3f3]">
              <div className="absolute top-9 -right-11 w-[190px] h-[35px] flex items-center justify-center bg-white rotate-45">
                <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#004050] text-base text-center tracking-[0] leading-[27.2px]">
                  FEATURED
                </span>
              </div>

              <CardContent className="p-[31px] flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[13px]">
                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white text-xl tracking-[0] leading-6">
                    Professional
                  </h3>

                  <div className="flex flex-col gap-[13px]">
                    <div className="flex items-start gap-1">
                      <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white text-3xl tracking-[0] leading-[55.2px]">
                        £
                      </span>
                      <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white text-[46px] tracking-[0] leading-[55.2px]">
                        643.55
                      </span>
                      <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[55.2px] whitespace-nowrap">
                        /per Month
                      </span>
                    </div>

                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[27.2px]">
                      Ideal For Businesses And Teams
                    </p>
                  </div>
                </div>

                <Button className="w-full h-[54px] bg-white hover:bg-white/90 rounded-xl [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#004050] text-lg tracking-[0] leading-[18px]">
                  Start Free Trial
                </Button>


                <div
                  className="w-full h-px bg-[#e4e4e4]"
                ></div>


                <div className="flex flex-col gap-5">
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-xl tracking-[0] leading-6">
                    Features Included:
                  </h4>

                  <div className="flex flex-col gap-2.5">
                    {professionalFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2.5">
                        <CheckCircle2Icon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[27.2px]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-xl tracking-[0] leading-6">
                    Limitations:
                  </h4>

                  <div className="flex flex-col gap-2.5">
                    {professionalLimitations.map((limitation, index) => (
                      <div key={index} className="flex items-start gap-2.5">
                        <XCircleIcon
                          className="w-5 h-5 text-white flex-shrink-0 mt-0.5"
                        />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[27.2px]">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative w-full max-w-[403px] bg-white rounded-[20px] border border-solid border-[#e4e4e4]">
              <CardContent className="p-[31px] flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[13px]">
                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#040303] text-xl tracking-[0] leading-6">
                    Enterprise
                  </h3>

                  <div className="flex flex-col gap-[13px]">
                    <div className="flex items-start">
                      <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-app-secondary text-[46px] tracking-[0] leading-[55.2px]">
                        Custom
                      </span>
                    </div>

                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-[27.2px]">
                      For Large Organizations With Complex Needs
                    </p>
                  </div>
                </div>

                <Button className="w-full h-[54px] bg-app-secondary hover:bg-app-secondary/90 rounded-xl [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-white text-lg tracking-[0] leading-[18px]">
                  Start Free Trial
                </Button>

                <div
                  className="w-full h-px bg-[#e4e4e4]"
                ></div>

                <div className="flex flex-col gap-5">
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#040303] text-xl tracking-[0] leading-6">
                    Features Included:
                  </h4>

                  <div className="flex flex-col gap-2.5">
                    {enterpriseFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2.5">
                        <CheckCircle2Icon className="w-5 h-5 text-app-secondary flex-shrink-0 mt-0.5" />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-[27.2px]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative w-full flex justify-between bg-[#f4f4f4] py-[72px]">
        <img
              className="absolute bottom-0 right-0 w-[213px] h-[199px]"
              alt="Decorative shape"
              src="/shape-nate-30-svg-fill.svg"
            />
        <div className="flex w-full max-w-[1321px] mx-auto px-6 md:px-10 flex-col items-center gap-[50px]">
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

            <div className="flex items-center gap-[50px] w-full justify-center flex-wrap z-10">
              {pricingTiers.map((tier, index) => (
                <Card
                  key={index}
                  className=" flex items-center bg-white rounded-[20px] border-0 shadow-none"
                >
                  <div className="px-5 py-8 w-full">
                    <div className="inline-flex items-center gap-5">
                      <div className="flex items-center justify-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-app-secondary text-[46px] tracking-[-0.92px] leading-[normal] whitespace-nowrap">
                        {tier.percentage}
                      </div>

                      <div className="flex flex-col w-[175px] items-start gap-0.5">
                        <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-7">
                          {tier.title}
                        </div>

                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-[27px]">
                          {tier.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
                      {addOn.price}
                    </span>
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm tracking-[0] leading-6">
                      {addOn.unit}
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
