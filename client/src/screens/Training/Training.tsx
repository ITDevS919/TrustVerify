import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { CheckCircle2Icon } from "lucide-react";

const statsData = [
  {
    icon: "/access.png",
    title: "150+",
    subtitle: "Early Access Students",
  },
  {
    icon: "/module.png",
    title: "20",
    subtitle: "Course Module",
  },
  {
    icon: "/beta.png",
    title: "89%",
    subtitle: "Beta Completion Rate",
  },
  {
    icon: "/preview.png",
    title: "4.8",
    subtitle: "Preview Rating",
  },
];

const pricingPlans = [
  {
    level: "Foundation Level",
    price: "49",
    description: "Essential Fraud Awareness For Everyone",
    duration: "4-6 Hours",
    modules: "5 Modules",
    features: [
      "Introduction To Fraud Types And Psychology",
      "Basic Prevention Strategies",
      "Personal Security Fundamentals",
      "Digital Safety Basics",
      "Recognition Techniques",
    ],
    ribbonLabel: "ESSENTIAL",
    ribbonColor: "bg-app-secondary",
  },
  {
    level: "Intermediate Level",
    price: "99",
    description: "Advanced Protection Strategies And Detection Methods",
    duration: "6-8 Hours",
    modules: "8 Modules",
    features: [
      "Advanced Scam Detection Methods",
      "Social Engineering Defense",
      "Investment Fraud Protection",
      "Business Email Compromise Prevention",
      "Advanced Digital Security",
    ],
    ribbonLabel: "POPULAR",
    ribbonColor: "bg-app-primary",
  },
  {
    level: "Advanced Level",
    price: "149",
    description: "Professional-grade Fraud Investigation Skills",
    duration: "8-10 Hours",
    modules: "11 Modules",
    features: [
      "Professional Investigation Techniques",
      "Legal Frameworks And Ai",
      "Advanced Threat Intelligence",
      "Forensic Analysis Methods",
      "Case Study Analysis",
    ],
    ribbonLabel: "PROFESSIONAL",
    ribbonColor:
      "bg-[linear-gradient(90deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)]",
  },
  {
    level: "Expert Level",
    price: "199",
    description: "Master-level Expertise With Certification",
    duration: "10-12 Hours",
    modules: "15 Modules",
    features: [
      "Enterprise Fraud Management",
      "Advanced Analytics And Ai",
      "Strategic Risk Assessment",
      "Team Leadership In Security",
      "Industry-specific Expertise",
    ],
    ribbonLabel: "MASTER",
    ribbonColor: "bg-[#d32030]",
  },
];


const pricingTrainingPlans = [
  {
    name: "Bronze Business",
    price: "499",
    period: "/per Month",
    employees: "Up To 10 Employees",
    features: [
      "Foundation + Intermediate Access",
      "Basic Team Dashboard",
      "Progress Tracking",
      "Email Support",
    ],
    buttonText: "Get Started",
    buttonTextColor: "text-white",
    buttonVariant: "default" as const,
    isPopular: false,
    cardBg: "bg-white",
    textColor: "text-[#040303]",
    priceColor: "text-[#27ae60]",
    featureColor: "text-[#808080]",
    buttonBg: "bg-app-secondary",
    checkColor: "text-app-secondary",
  },
  {
    name: "Silver Business",
    price: "2,500",
    period: "/per Month",
    employees: "Up To 50 Employees",
    features: [
      "All Course Levels",
      "Advanced Analytics",
      "Custom Training Paths",
      "Priority Support",
      "Quarterly Reviews",
    ],
    buttonText: "Get Started",
    buttonTextColor: "text-[#004050]",
    buttonVariant: "secondary" as const,
    isPopular: true,
    cardBg: "bg-app-primary",
    textColor: "text-white",
    priceColor: "text-white",
    featureColor: "text-white",
    buttonBg: "bg-white",
    checkColor: "text-white",
  },
  {
    name: "Gold Business",
    price: "9,999",
    period: "/per Month",
    employees: "Unlimited Employees",
    features: [
      "Complete Platform Access",
      "Custom Content Creation",
      "Dedicated Account Manager",
      "On-site Training Options",
      "24/7 Support",
    ],
    buttonText: "Contact Sales",
    buttonTextColor: "text-white",
    buttonVariant: "default" as const,
    isPopular: false,
    cardBg: "bg-white",
    textColor: "text-[#040303]",
    priceColor: "text-[#27ae60]",
    featureColor: "text-[#808080]",
    buttonBg: "bg-app-secondary",
    checkColor: "text-app-secondary",
  },
];

export const Training = (): JSX.Element => {
  return (
    <main className="bg-white overflow-hidden w-full relative">
      <Header 
        backgroundImage = '/Header_Training.png'
        content={{
          badge: {
            text: "PROFESSIONAL FRAUD TRAINING",
            variant: "secondary"
          },
          title: "TrustVerify Fraud Academy",
          description: "Master fraud prevention with our comprehensive training program. From basic awareness to expert-level investigation skills.",
        }}
      />
      <section className="w-full flex justify-center py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9 max-w-[1312px] px-6 md:px-10 w-full">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="bg-[#f3f3f3] border-0 rounded-[20px] shadow-none"
            >
              <CardContent className="p-[29px_21px]">
                <div className="flex items-center gap-[18px]">
                  <img
                    className="w-16 h-16 flex-shrink-0"
                    alt={stat.title}
                    src={stat.icon}
                  />
                  <div className="flex flex-col gap-0.5 flex-1">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-7">
                      {stat.title}
                    </h3>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-[normal]">
                      {stat.subtitle}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="relative w-full bg-[#f3f3f3] py-20">
        <div className="container mx-auto max-w-[1350px] px-6 md:px-10 mb-6">
          <div className="flex flex-col w-full items-center gap-5">
            <div className="flex flex-col items-center gap-5 w-full">
              <Badge className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] h-[30px] px-6 rounded-[800px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                LEARNING PATH
              </Badge>

              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.27px] leading-[67px]">
                <span className="text-[#003d2b]">Choose Your </span>
                <span className="text-[#0b3a78]">Learning Path </span>
              </h2>
            </div>

            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg text-center tracking-[-0.20px] leading-7">
              Progressive curriculum designed to take you from beginner to expert in fraud prevention          
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[18px] max-w-[1446px] px-6 md:px-10 mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className="z-10 relative bg-white rounded-[17.28px] overflow-hidden border-[0.86px] border-[#f3f3f3] flex flex-col h-[506px]"
              >
                <div
                  className={`absolute top-[27px] right-[-52px] w-[190px] h-[35px] flex items-center justify-center ${plan.ribbonColor} rotate-45`}
                >
                  <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-white text-base text-center leading-[27.2px]">
                    {plan.ribbonLabel}
                  </span>
                </div>

                <CardContent className="flex flex-col gap-4 p-[27px] flex-1">
                  <div className="flex flex-col gap-[17.28px]">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#040303] text-[17.3px] leading-[20.7px]">
                      {plan.level}
                    </h3>

                    <div className="flex flex-col gap-[15.56px]">
                      <div className="flex flex-col gap-[11.24px]">
                        <div className="flex items-baseline gap-1">
                          <span className="text-app-secondary text-[25.9px] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
                            £
                          </span>
                          <span className="text-app-secondary text-[39.8px] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold leading-[47.7px]">
                            {plan.price}
                          </span>
                          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[13.8px]">
                            /per Month
                          </span>
                        </div>

                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[13.8px] leading-[23.5px]">
                          {plan.description}
                        </p>
                      </div>

                      <div className="w-full h-px"></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 flex-1">
                    <div className="flex items-center gap-9">
                      <div className="flex items-center gap-[5px]">
                        <img
                          className="w-5 h-5"
                          alt="Mingcute book line"
                          src="/book_line.png"
                        />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs">
                          {plan.duration}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <img
                          className="w-5 h-5"
                          alt="Fluent people"
                          src="/people_module.png"
                        />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs">
                          {plan.modules}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-[8.64px]">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-2"
                        >
                          <CheckCircle2Icon className="w-[18px] h-[18px] text-app-secondary flex-shrink-0 mt-[3px]" />
                          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[13.8px] leading-[23.5px]">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full h-[47px] bg-app-secondary hover:bg-app-secondary/90 rounded-[12.1px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-white text-[15.6px]">
                    Signup To Enroll
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>

        <img
          className="absolute top-[35px] -left-[227px] w-[399px] h-[528px]"
          alt="Nate shape"
          src="/nate-shape.svg"
        />

        <img
          className="absolute top-[174px] right-[131px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star-1.svg"
        />

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
      </section>
      <section className="relative w-full flex flex-col items-center justify-center px-6 md:px-10 pt-24 pb-28 gap-24">
        <img
          className="absolute top-[228px] left-[144px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star-1.svg"
        />
        <img
          className="absolute bottom-[577px] left-[106px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star.svg"
        />
        <img
          className="absolute top-[527px] -right-[222px] w-[439px] h-[653px] z-10 pointer-events-none"
          alt="shape"
          src="/shape_nate_31.png"
        />

        <Card className="z-10 w-full max-w-[1101px] bg-app-primary rounded-lg md:rounded-xl lg:rounded-2xl xl:rounded-[20px]">
          <CardContent className="py-3 sm:py-4 md:py-5 lg:py-6 px-5 sm:px-7 md:px-10 lg:px-14">
            <div className="flex items-center justify-between gap-8 lg:gap-[123px]">
            <div className="flex items-start gap-1 sm:gap-2 md:gap-4 lg:gap-6 w-full">
                <img
                  className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] md:w-[60px] md:h-[60px] lg:w-[88px] lg:h-[88px] flex-shrink-0"
                  alt="Full Access Pass Icon"
                  src="/education.png"
                />

                <div className="flex flex-col items-start gap-2 sm:gap-4 md:gap-6 lg:gap-8">
                  <div className="flex flex-col items-start gap-1 sm:gap-2 md:gap-4 lg:gap-6 w-full">
                    <p className="mt-2 text-white text-base md:text-xl lg:text-3xl xl:text-[40px] tracking-tighter sm:tracking-[-0.50px] leading-2 sm:leading-4 md:leading-6 lg:leading-[30px] xl:leading-[47px] flex items-center justify-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
                      Full Access Pass
                    </p>

                    <p className="flex items-center justify-center [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-[8px] md:text-[12px] lg:text-lg xl:text-[22px] tracking-[0]  leading-[4px] sm:leading-[8px] md:leading-[16px] lg:leading-[30px]">
                      Get access to all courses for one year
                    </p>
                  </div>

                  <Button 
                    size="none"
                    className="bg-white rounded-[4px] sm:rounded-[6px] md:rounded-[8px] lg:rounded-[10px] hover:bg-white/90 px-3 py-0 sm:px-6 sm:py-2 md:px-8 md:py-4  lg:px-10 lg:py-5">
                    <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-app-primary text-[7px] sm:text-[10px] md:text-sm lg:text-lg text-center tracking-[-0.20px]">
                      Get Full Access
                    </p>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-[5px] w-full sm:w-auto sm:min-w-[321px]">
                <div className="flex flex-col items-center">
                  <div className="flex items-baseline gap-[5px]">
                    <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white text-[30px] sm:text-[40px] md:text-[50px] lg:text-[60.4px] tracking-[0] leading-[1]">
                      £
                    </span>

                    <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white text-[46px] sm:text-[60px] md:text-[76px] lg:text-[92.6px] tracking-[0] leading-[1]">
                      199
                    </span>

                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-[16px] sm:text-[20px] md:text-[26px] lg:text-[32px] tracking-[0] leading-[1.5]">
                      /year
                    </span>
                  </div>
                </div>

                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#d8d8d8] text-[6px] sm:text-[8px] md:text-[10px] lg:text-[13.8px] tracking-[0] leading-[23.5px] text-center max-w-[321px]">
                  Save Up To £300 Compared To Individual Courses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex w-full max-w-[1260px] items-center">
          <div className="z-10 flex flex-col max-w-[558px] items-start justify-center gap-5">
            <Badge className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] h-[30px] px-4 rounded-full">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                TRAINING PLANS
              </span>
            </Badge>

            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[46px] tracking-[-0.92px] leading-[55.2px]">
              <span className="text-[#003d2b]">Business </span>
              <span className="text-[#0b3a78]">Training Plans</span>
            </h2>

            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg leading-[27.2px]">
              Comprehensive fraud prevention training for your entire team
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-center gap-[30px] w-full max-w-[1270px]">
          {pricingTrainingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`${plan.cardBg} ${
                plan.isPopular ? "border-[#f3f3f3]" : "border-[#e4e4e4]"
              } z-10 w-full max-w-[403px] min-h-[560px] rounded-[20px] border relative overflow-hidden`}
            >
              {plan.isPopular && (
                <div className="absolute top-9 -right-11 w-[190px] h-[35px] flex items-center justify-center bg-white rotate-45 z-10">
                  <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#004050] text-base text-center">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <CardContent className="flex flex-col h-full p-[31px] gap-5">
                <div className="flex flex-col gap-5">
                  <p
                    className={`${plan.textColor} [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl`}
                  >
                    {plan.name}
                  </p>

                  <div className="flex flex-col gap-[18px]">
                    <div className="flex flex-col gap-[13px]">
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`${plan.priceColor} [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-3xl`}
                        >
                          £
                        </span>
                        <span
                          className={`${plan.priceColor} [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[46px] leading-[55.2px]`}
                        >
                          {plan.price}
                        </span>
                        <span
                          className={`${
                            plan.isPopular ? "text-white" : "text-[#808080]"
                          } [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-base`}
                        >
                          {plan.period}
                        </span>
                      </div>

                      <p
                        className={`${plan.featureColor} [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-base leading-[27.2px]`}
                      >
                        {plan.employees}
                      </p>
                    </div>

                    <div className="w-full h-px bg-slate-200 object-cover"></div>
                  </div>
                </div>

                <div className="flex flex-col gap-5 flex-1">
                  <h4
                    className={`${plan.textColor} [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-xl`}
                  >
                    What's Included?
                  </h4>

                  <div className="flex flex-col gap-2.5">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start gap-2.5"
                      >
                        <CheckCircle2Icon
                          className={`${plan.checkColor} w-5 h-5 flex-shrink-0 mt-0.5`}
                        />
                        <span
                          className={`${plan.featureColor} [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-base leading-[27.2px]`}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className={`${plan.buttonBg} ${plan.buttonTextColor} w-full h-[54px] rounded-[14px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-lg hover:opacity-90`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="z-10">
          <Card className="bg-app-primary rounded-lg md:rounded-xl lg:rounded-2xl xl:rounded-[20px] shadow-[0px_4px_10px_#003d2b1a] border-0 max-w-[1370px]">
            <CardContent className="flex items-center gap-0 sm:gap-4 md:gap-9 lg:gap-14 py-3 sm:py-4 md:py-5 lg:py-6 px-5 sm:px-7 md:px-10 lg:px-14">
              <div className="flex w-full mt-0 sm:mt-2 md:mt-4 lg:mt-7 flex-col items-start gap-2 sm:gap-4 md:gap-6 lg:gap-8">
                <div className="flex flex-col items-start gap-1 sm:gap-2 md:gap-4 lg:gap-6 w-full">
                  <p className="mt-[-1.00px] text-white text-base md:text-xl lg:text-3xl xl:text-[40px] tracking-tighter sm:tracking-[-0.50px] leading-6 sm:leading-8 md:leading-10 lg:leading-[50px] xl:leading-[67px] flex items-center justify-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
                    Ready to Become Fraud-Resilient?
                  </p>

                  <p className="flex items-center justify-center [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-[8px] md:text-[12px] lg:text-lg xl:text-[22px] tracking-[0]  leading-[10px] sm:leading-[15px] md:leading-[21px] lg:leading-[30px]">
                  Join thousands of professionals who trust TrustVerify for their
                  fraud prevention education
                  </p>
                </div>
                <Button 
                  size="none"
                  className="w-2/5 bg-white rounded-[4px] sm:rounded-[6px] md:rounded-[8px] lg:rounded-[10px] hover:bg-white/90 px-3 py-0 sm:px-6 sm:py-2 md:px-8 md:py-4  lg:px-10 lg:py-5">
                  <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-app-primary text-[7px] sm:text-[10px] md:text-sm lg:text-lg text-center tracking-[-0.20px]">
                    Contact Us
                  </p>
                </Button>
              </div>
              
              <img
                className="w-[111px] h-[88px] sm:w-[168px] sm:h-[132px] md:h-[224px] md:w-[176px] lg:w-[335px] lg:h-[264px] bg-blend-color-dodge flex-shrink-0"
                alt="Element illustration data"
                src="/group-5.png"
              />

            </CardContent>
          </Card>
        </div>

        
      </section>

      <Footer/>
    </main>
  );
};
