import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Card, CardContent } from "../../components/ui/card";
import { CheckCircle2Icon } from "lucide-react";
import { SectionComponentNodeSubsection } from "../Home/sections/SectionComponentNodeSubsection";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
const intelligenceData = [
  {
    icon: "/accuracy.png",
    title: "99.9% Accuracy",
    description: "Industry-leading fraud detection rates",
  },
  {
    icon: "/processing.png",
    title: "Real-time Processing",
    description: "Instant verification and response",
  },
  {
    icon: "/coverage.png",
    title: "Global Coverage",
    description: "Worldwide fraud intelligence network",
  },
];

const solutionCards = [
  {
    icon: "/background-21.png",
    title: "Commerceguard",
    description:
      "E-commerce fraud prevention & transaction monitoring for retailers and e-commerce platforms",
    features: [
      "Real-time transaction scoring",
      "Chargeback prevention",
      "Risk transaction forensic analysis",
      "Compliance evidence monitoring",
    ],
    stats: [
      { value: "99.2%", label: "Fraud Reduction" },
      { value: "0.7%", label: "False Positives" },
    ],
    buttonIcon: "/image.svg",
  },
  {
    icon: "/background-22.png",
    title: "Finsecure",
    description:
      "Real-time KYC monitoring & AML compliance for financial institutions",
    features: [
      "Enhanced due diligence",
      "AML compliance monitoring",
      "Transaction risk scoring",
      "Anti-transaction forensic analysis",
    ],
    stats: [
      { value: "99.2%", label: "Fraud Reduction" },
      { value: "0.7%", label: "False Positives" },
    ],
    buttonIcon: "/image.svg",
  },
  {
    icon: "/background-23.png",
    title: "Marketsafe",
    description:
      "Marketplace fraud risk for marketplaces with buyer & seller protection",
    features: [
      "Seller verification",
      "Buyer protection",
      "Post-order dispute",
      "User verification",
    ],
    stats: null,
    buttonIcon: "/image.svg",
  },
  {
    icon: "/background-21.png",
    title: "Cryptoshield",
    description:
      "Blockchain & digital asset monitoring for cryptocurrency exchanges and digital asset platforms",
    features: [
      "Wallet monitoring",
      "Transaction tracking",
      "Risk assessment",
      "Compliance reporting",
    ],
    stats: null,
    buttonIcon: "/image.svg",
  },
  {
    icon: "/background-22.png",
    title: "Enterprise+",
    description:
      "Custom enterprise solutions with dedicated support and advanced features",
    features: [
      "Dedicated support",
      "White-label options",
      "SLA guarantees",
      "Custom integrations",
    ],
    stats: null,
    buttonIcon: "/image.svg",
  },
];

const features = [
  {
    icon: "/reduce.png",
    title: "Reduce Fraud Losses",
    description:
      "Proven results across industries with measurable impact on fraud reduction and business growth.",
  },
  {
    icon: "/team.png",
    title: "Increase Customer Trust",
    description:
      "Build confidence with transparent, reliable fraud detection that protects both you and your customers.",
  },
  {
    icon: "/tech.png",
    title: "Improve Conversion",
    description:
      "Smart detection reduces false positives, allowing more legitimate transactions to go through.",
  },
  {
    icon: "/reach.png",
    title: "Global Compliance",
    description:
      "Stay compliant with international regulations and industry standards across all markets.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "29.00",
    period: "/per Month",
    description: "Perfect For Individuals And Small Businesses",
    features: [
      "Up To 10 Transactions/month",
      "Basic Identity Verification",
      "Email Support",
      "Api Integration",
    ],
    buttonText: "Get Started",
    buttonVariant: "secondary" as const,
    featured: false,
    bgColor: "bg-white",
    textColor: "text-[#040303]",
    priceColor: "text-app-secondary",
    featureTextColor: "text-[#808080]",
    buttonBgColor: "bg-app-secondary",
    buttonTextColor: "text-white",
  },
  {
    name: "Professional",
    price: "89.00",
    period: "/per Month",
    description: "Ideal For Businesses And Teams",
    features: [
      "Up To 500 Transactions/month",
      "Advanced Kyc Verification",
      "Premium Source Protection",
      "Priority Email & Chat Support",
      "Same-day Settlement",
      "Ai-powered Fraud Scoring",
    ],
    buttonText: "Get Started",
    buttonVariant: "default" as const,
    featured: true,
    bgColor: "bg-app-primary",
    textColor: "text-white",
    priceColor: "text-white",
    featureTextColor: "text-white",
    buttonBgColor: "bg-white",
    buttonTextColor: "text-[#004050]",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For Large Organizations With Complex Needs",
    features: [
      "Enterprise Kyc & Compliance",
      "24/7 Phone & Priority Support",
      "Custom Settlement Options",
      "Custom Fraud Detection Rules",
      "Dedicated Account Manager",
      "White-label Solutions",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "secondary" as const,
    featured: false,
    bgColor: "bg-white",
    textColor: "text-[#040303]",
    priceColor: "text-app-secondary",
    featureTextColor: "text-[#808080]",
    buttonBgColor: "bg-app-secondary",
    buttonTextColor: "text-white",
  },
];

const leftCardFeatures = [
  {
    title: "Invoice & Payment Fraud",
    description:
      "Real-time detection of fake invoices and payment redirection across all amrkets",
    borderColor: "bg-red-400",
  },
  {
    title: "Enterprise Security",
    description:
      "Comprehensive protection for businesses of all sizes globally",
    borderColor: "bg-[#f7b57c]",
  },
  {
    title: "E-commerce Protection",
    description:
      "Advanced programs recognition for global online retail threats",
    borderColor: "bg-yellow-400",
  },
];

const rightCardFeatures = [
  {
    title: "Digital Payment Security",
    description:
      "Protection for all global payment methods and platforms worldwide",
    borderColor: "bg-red-400",
  },
  {
    title: "Cross-Border Protection",
    description: "Multi-currency and international transaction security",
    borderColor: "bg-[#f7b57c]",
  },
  {
    title: "Social Engineering Defense",
    description:
      "AI-powered detection of relationship-based and social engineering attacks",
    borderColor: "bg-yellow-400",
  },
];

export const IndustrySolutions = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <main className="bg-white overflow-hidden w-full relative">
      <Header 
        backgroundImage = '/Header_Industry.png'
        content={{
          badge: {
            text: "INDUSTRY-LEADING FRAUD PREVENTION",
            variant: "secondary"
          },
          title: "Advanced Trust Verification for Every Business",
          description: "Protect your business with AI-powered fraud detection and trust verification solutions. Reduce losses, increase customer confidence, and scale with confidence.",
        }}
      />
      <section className="w-full relative overflow-hidden">
        <img
          className="absolute bottom-16 left-28 w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star.svg"
        />
        <img
          className="absolute top-28 right-28 w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star-1.svg"
        />
        <div className="flex flex-col xl:flex-row items-center justify-center gap-[50px] w-full max-w-[1401px] mx-auto px-6 md:px-10 pt-20 pb-24">
          {intelligenceData.map((item, index) => (
            <Card
              key={index}
              className="z-10 w-full md:w-1/2 lg:w-1/3 px-4 h-[121px] bg-[#f3f3f3] rounded-[20px] border-0 shadow-none"
            >
              <CardContent className="flex items-center justify-center h-full p-0">
                <div className="inline-flex items-center gap-[18px]">
                  <img
                    className="w-16 h-16 flex-shrink-0"
                    alt={item.title}
                    src={item.icon}
                  />

                  <div className="flex flex-col items-start gap-0.5">
                    <h3 className="self-stretch [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-7">
                      {item.title}
                    </h3>

                    <p className="self-stretch [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-[27px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="relative w-full bg-[#f3f3f3] py-20">
          <img
            className="absolute right-0 bottom-0 w-[153px] h-[153px] md:w-[200px] md:h-[200px] xl:w-[307px] xl:h-[310px]"
            alt="Pattern"
            src="/pattern.svg"
          />

          <img
            className="absolute left-0 bottom-0 w-[153px] h-[153px] md:w-[200px] md:h-[200px] xl:w-[307px] xl:h-[310px]"
            alt="Pattern"
            src="/pattern-1.svg"
          />

          <div className="container px-6 md:px-10 mx-auto max-w-[1404px]">
            <div className="flex flex-col items-center gap-14">
              <header className="flex flex-col items-center gap-[19px] max-w-[1129px]">
                <Badge className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] h-[30px] px-4 rounded-[800px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                  SOLUTIONS
                </Badge>

                <div className="flex flex-col items-center gap-5 w-full">
                  <h1 className="text-[54px] text-center leading-[67px] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold tracking-[-0.27px]">
                    <span className="text-[#003d2b]">Industry </span>
                    <span className="text-[#0b3a78]">Solutions</span>
                  </h1>

                  <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg text-center tracking-[-0.20px] leading-7">
                    Tailored fraud prevention and trust verification solutions for
                    every industry and business size
                  </p>
                </div>
              </header>

              <div className="flex flex-col items-center gap-9 w-full">
                <div className="grid gird-cols-1 lg:grid-cols-3 gap-9 w-full">
                  {solutionCards.slice(0, 3).map((card, index) => (
                    <Card
                      key={index}
                      className="z-10 bg-white rounded-[20px] border border-solid border-[#e4e4e4] overflow-hidden"
                    >
                      <CardContent className="p-9 flex flex-col gap-[22px] justify-between items-center h-full">
                        <div className="flex flex-col gap-5">
                          <div className="flex items-center gap-4">
                            <img
                              className="w-16 h-16"
                              alt={card.title}
                              src={card.icon}
                            />
                            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                              {card.title}
                            </p>
                          </div>

                          <div className="flex flex-col gap-5">
                            <p className="h-24 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg tracking-[0] leading-[27px]">
                              {card.description}
                            </p>

                            <div className="flex flex-col gap-2.5">
                              <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-app-primary text-lg tracking-[0] leading-[27px]">
                                Key Features:
                              </p>
                              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg leading-[30px] tracking-[0]">
                                {card.features.join("\n")}
                              </p>
                            </div>
                          </div>
                        </div>

                        {card.stats && (
                          <>
                            <div
                              className="w-full h-px object-cover bg-gray-300/50"
                            />

                            <div className="flex items-center justify-between w-full">
                              {card.stats.map((stat, statIndex) => (
                                <div
                                  key={statIndex}
                                  className="flex flex-col items-center"
                                >
                                  <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-app-primary text-xl text-center tracking-[0] leading-7">
                                    {stat.value}
                                  </div>
                                  <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base text-center tracking-[0] leading-[normal]">
                                    {stat.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <Button 
                          onClick={() => navigate("/contact")}
                          className="w-full h-14 bg-app-primary hover:bg-app-primary/90 rounded-xl [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-white text-lg tracking-[-0.20px] leading-[18px]">
                          <span className="flex items-center gap-2">
                            Learn More
                            <img
                              className="w-[30px] h-[30px]"
                              alt="Arrow"
                              src={card.buttonIcon}
                            />
                          </span>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid gird-cols-1 lg:grid-cols-2 gap-9 w-full max-w-[854px]">
                  {solutionCards.slice(3, 5).map((card, index) => (
                    <Card
                      key={index}
                      className="z-10 bg-white rounded-[20px] border border-solid border-[#e4e4e4] overflow-hidden"
                    >
                      <CardContent className="p-9 flex flex-col gap-[21px] h-full justify-between">
                        <div className="flex flex-col gap-[47px]">
                          <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-4">
                              <img
                                className="w-16 h-16"
                                alt={card.title}
                                src={card.icon}
                              />
                              <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                                {card.title}
                              </h3>
                            </div>

                            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg tracking-[0] leading-[27px]">
                              {card.description}
                            </p>
                          </div>

                          <div className="flex flex-col gap-[15px]">
                            <h4 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-app-primary text-lg tracking-[0] leading-[27px]">
                              Key Features:
                            </h4>
                            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg tracking-[0] leading-[30px]">
                              {card.features.join("\n")}
                            </p>
                          </div>
                        </div>

                        <Button 
                          onClick={() => navigate("/contact")}
                          className="w-full h-14 bg-app-primary hover:bg-app-primary/90 rounded-xl [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-white text-lg tracking-[-0.20px] leading-[18px]">
                          <span className="flex items-center gap-2">
                            Learn More
                            <img
                              className="w-[30px] h-[30px]"
                              alt="Arrow"
                              src={card.buttonIcon}
                            />
                          </span>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <img
            className="absolute bottom-[434px] left-[100px] w-[30px] h-[30px]"
            alt="Icon star"
            src="/icon-star.svg"
          />

          <img
            className="absolute top-[544px] right-[131px] w-[30px] h-[30px]"
            alt="Icon star"
            src="/icon-star-1.svg"
          />
        </div>

      </section>

      <section className="w-full relative">
        <img
          className="absolute top-[115px] left-[-227px] w-[399px] h-[528px] z-10 pointer-events-none"
          alt="Nate shape"
          src="/nate-shape.svg"
        />
        <div className="flex flex-col w-full items-center gap-[60px] px-6 md:px-10 pt-24 pb-36">
          <div className="flex flex-col max-w-[893px] items-center gap-5">
            <div className="z-10 flex flex-col items-center gap-5 w-full">
              <Badge
                variant="secondary"
                className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-[800px] px-4 py-1.5 h-[30px]"
              >
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                  WHY CHOOSE US
                </span>
              </Badge>

              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.27px] leading-[67px]">
                <span className="text-[#003d2b]">Why Businesses Choose </span>
                <span className="text-[#0b3a78]">Trust</span>
                <span className="text-[#27ae60]">Verify</span>
              </p>
            </div>

            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg text-center tracking-[-0.20px] leading-7">
              Proven results across industries with measurable impact on fraud
              reduction and business growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-[1232px] px-4">
            {features.map((feature, index) => (
              <Card key={index} className="z-10 border-0 shadow-none bg-transparent">
                <CardContent className="flex flex-col items-center gap-6 p-0">
                  <img
                    className="w-16 h-16"
                    alt={feature.title}
                    src={feature.icon}
                  />

                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-7 text-center">
                    {feature.title}
                  </h3>

                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base text-center tracking-[0] leading-[27px]">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full relative">
        <div className="relative w-full px-6 md:px-10 bg-[#f4f4f4] py-20">
          <div className="w-full mx-auto max-w-[1270px]">
            <div className="flex flex-col gap-[50px]">
              <header className="flex items-center justify-between gap-4">
                <div className="flex flex-col max-w-[558px] gap-5">
                  <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-2 h-[30px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                    PRICING PLAN
                  </Badge>

                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[46px] leading-[55.2px] tracking-[-0.92px]">
                    <span className="text-[#003d2b]">Business </span>
                    <span className="text-[#0b3a78]">Pricing</span>
                  </p>

                  <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg leading-[27.2px]">
                    Flexible pricing plans designed to scale with your business
                    growth
                  </p>
                </div>

                <Button 
                  onClick={() => navigate("/pricing")}
                  className="bg-app-primary hover:bg-app-primary/90 text-white rounded-[10px] h-14 px-8 [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-lg tracking-[-0.20px]">
                  View Complete Pricing
                  <img
                    className="w-[30px] h-[30px] ml-2"
                    alt="Arrow"
                    src="/image.svg"
                  />
                </Button>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
                {pricingPlans.map((plan, index) => (
                  <Card
                    key={index}
                    className={`${plan.bgColor} z-10 border-[#f3f3f3] rounded-[20px] overflow-hidden relative h-full`}
                  >
                    {plan.featured && (
                      <div className="absolute top-9 -right-11 w-[190px] h-[35px] bg-white rotate-45 flex items-center justify-center">
                        <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#004050] text-base text-center">
                          FEATURED
                        </span>
                      </div>
                    )}

                    <CardContent className="p-[31px] flex flex-col h-full">
                      <div className="flex flex-col gap-5 mb-auto">
                        <h3
                          className={`[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl ${plan.textColor}`}
                        >
                          {plan.name}
                        </h3>

                        <div className="flex flex-col gap-[18px]">
                          <div className="flex flex-col gap-[13px]">
                            <div className="flex items-baseline gap-1">
                              {plan.price !== "Custom" && (
                                <span
                                  className={`[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-3xl ${plan.priceColor}`}
                                >
                                  £
                                </span>
                              )}
                              <span
                                className={`[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[46px] leading-[55.2px] ${plan.priceColor}`}
                              >
                                {plan.price}
                              </span>
                              {plan.period && (
                                <span
                                  className={`[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-base ${
                                    plan.featured ? "text-white" : "text-[#808080]"
                                  }`}
                                >
                                  {plan.period}
                                </span>
                              )}
                            </div>

                            <p
                              className={`[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-base leading-[27.2px] ${
                                plan.featured ? "text-white" : "text-[#808080]"
                              }`}
                            >
                              {plan.description}
                            </p>
                          </div>

                          <div className="w-full h-px object-cover bg-gray-300/30">
                          </div>
                        </div>

                        <div className="flex flex-col gap-5 mt-5">
                          <p
                            className={`[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-xl ${plan.textColor}`}
                          >
                            What's Included?
                          </p>

                          <div className="flex flex-col gap-2.5">
                            {plan.features.map((feature, featureIndex) => (
                              <div
                                key={featureIndex}
                                className="flex items-start gap-2.5"
                              >
                                <CheckCircle2Icon
                                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                    plan.featured
                                      ? "text-white"
                                      : "text-app-secondary"
                                  }`}
                                />
                                <span
                                  className={`[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-base leading-[27.2px] ${plan.featureTextColor}`}
                                >
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          if (plan.buttonText === "Contact Sales" || plan.name === "Enterprise") {
                            navigate("/contact");
                          } else {
                            navigate("/pricing");
                          }
                        }}
                        className={`${plan.buttonBgColor} ${plan.buttonTextColor} hover:opacity-90 rounded-[14px] h-[54px] w-full mt-5 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-lg`}
                      >
                        {plan.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <img
            className="absolute right-0 bottom-0 w-[169px] h-[173px]"
            alt="Shape decoration"
            src="/shape-nate-30-svg-fill.svg"
          />
        </div>
      </section>
      <section className="w-full relative">
        <img
          className="absolute top-[109px] -left-[222px] w-[439px] h-[653px]"
          alt="shape"
          src="/shape_nate_32.png"
        />
        <SectionComponentNodeSubsection/>
      </section>
      <section className="w-full relative">
        <img
            className="absolute top-[53px] right-[-200px] w-[399px] h-[528px]"
            alt="Nate shape"
            src="/nate-shape-1.svg"
        />
        <div className="flex flex-col w-full items-center gap-[74px] px-6 md:px-10">
          <div className="z-10 flex flex-col max-w-[982px] items-center gap-5">
            <div className="flex flex-col items-center gap-5 w-full">
              <Badge
                variant="secondary"
                className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-6 py-2 h-[30px]"
              >
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm leading-[14px] tracking-[0]">
                  FRAUD INTELLIGENCE
                </span>
              </Badge>

              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.27px] leading-[67px]">
                <span className="text-[#003d2b]">Global </span>
                <span className="text-[#27ae60]">Transaction</span>
                <span className="text-[#003d2b]"> &amp; </span>
                <span className="text-[#0b3a78]">Fraud</span>
                <span className="text-[#003d2b]"> Intelligence</span>
              </p>
            </div>

            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-lg text-center tracking-[-0.20px] leading-7 text-[#808080]">
              Comprehensive fraud intelligence and protection for worldwide
              operations
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-[37px] w-full max-w-[1291px] px-4">
            <Card className="z-10 flex-1 min-w-0 bg-white border border-[#e4e4e4] shadow-[0px_8px_20px_#00000024] rounded-[20px]">
              <CardContent className="p-10">
                <div className="flex flex-col items-start gap-[30px]">
                  <div className="flex items-start gap-5">
                    <img
                      className="w-[50px] h-[50px] flex-shrink-0"
                      alt="Global Intelligence Icon"
                      src="/background-24.png"
                    />

                    <div className="flex flex-col items-start gap-[7px]">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                        Global Intelligence
                      </h3>

                      <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-base tracking-[0] leading-[normal]">
                        Worldwide threat protection
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-4 w-full">
                    {leftCardFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-[15px] w-full"
                      >
                        <div
                          className={`w-[5px] h-[81px] flex-shrink-0 ${feature.borderColor}`}
                        />

                        <div className="flex flex-col items-start gap-2.5 flex-1 min-w-0">
                          <h4 className="[font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-[#003d2b] text-[17.4px] tracking-[0] leading-[22px]">
                            {feature.title}
                          </h4>

                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-[normal]">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 min-w-0 bg-white border border-[#e4e4e4] shadow-[0px_8px_20px_#00000024] rounded-[20px]">
              <CardContent className="p-10">
                <div className="flex flex-col items-start gap-[30px]">
                  <div className="flex items-start gap-5">
                    <img
                      className="w-[50px] h-[50px] flex-shrink-0"
                      alt="Multi-platform Security Icon"
                      src="/background-25.png"
                    />

                    <div className="flex flex-col items-start gap-2">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                        Multi-platform Security
                      </h3>

                      <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-base tracking-[0] leading-[normal]">
                        Universal fraud prevention
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-4 w-full">
                    {rightCardFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-[15px] w-full"
                      >
                        <div
                          className={`w-[5px] h-[81px] flex-shrink-0 ${feature.borderColor}`}
                        />

                        <div className="flex flex-col items-start gap-2.5 flex-1 min-w-0">
                          <h4 className="[font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-[#003d2b] text-[17.4px] tracking-[0] leading-[22px]">
                            {feature.title}
                          </h4>

                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-[normal]">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </section>
      <section className="w-full relative">
        <div className="w-full flex items-center justify-center px-6 md:px-10 py-28">
        <Card className="w-full max-w-[1290px] bg-app-primary rounded-[6px] md:rounded-[12px] lg:rounded-[20px] shadow-[0px_4px_10px_#003d2b1a] border-0">
          <CardContent className="px-3 py-4 sm:p-8">
            <div className="flex items-center justify-between gap-2 md:gap-6 lg:gap-[35px]">
              <div className="flex flex-col w-full max-w-[825px] items-start gap-2 md:gap-4 lg:gap-8">
                <div className="flex flex-col items-start gap-2.5 w-full">
                  <p className="text-white text-lg md:text-[29px] xl:text-[40px] text-start leading-5 md:leading-9 xl:leading-[54px] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold tracking-[-0.50px]">
                    Global Transaction Security &amp; Fraud Intelligence
                  </p>

                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-[10px] md:text-base xl:text-[22px] tracking-[0] leading-4 md:leading-5 xl:leading-7 ">
                    Advanced fraud detection and prevention with global
                    intelligence networks. AI-powered fraud intelligence for
                    maximum protection across all business sectors.
                  </p>
                </div>

                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="w-20 h-5 md:w-36 md:h-9 xl:h-14 xl:w-56 bg-white hover:bg-white/90 rounded-sm md:rounded-[6px] xl:rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-app-primary text-[7px] md:text-sm xl:text-lg tracking-[-0.20px]">
                  Access Dashboard
                </Button>
              </div>

              <img
                className="w-[102px] h-24 md:w-52 md:h-48 xl:w-[323.55px] xl:h-[308.76px] flex-shrink-0"
                alt="Group"
                src="/group-2.png"
              />
            </div>
          </CardContent>
        </Card>
        </div>
      </section>
      <Footer/>
    </main>
  );
};
