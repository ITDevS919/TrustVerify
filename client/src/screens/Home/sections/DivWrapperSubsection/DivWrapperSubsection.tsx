import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { ScrollArea } from "../../../../components/ui/scroll-area";

const industrySolutions = [
  {
    id: "01",
    icon: "/fi-12311778.svg",
    title: "Ecommerce Protection",
    description:
      "Protect online transaction, prevent chargebacks, and secure customer data with AI-powered fraud detection.",
    badges: [
      { label: "AI-Powered", color: "bg-[#a57eff33] text-[#a57eff]" },
      { label: "Real Time", color: "bg-[#00cc6133] text-[#00cc61]" },
    ],
  },
  {
    id: "02",
    icon: "/fi-8912559.svg",
    title: "Banking & Financial",
    description:
      "Advanced KYC/AML compliance regulatory reporting, and real-time transaction monitoring for financial institutions.",
    badges: [
      { label: "Enterprise Grade", color: "bg-[#3365cd33] text-[#3365cd]" },
      { label: "SOC 2 Ready", color: "bg-[#009cde33] text-[#009cde]" },
    ],
  },
  {
    id: "03",
    icon: "/fi-18137623.svg",
    title: "Marketplace Security",
    description:
      "Secure peer-to-peer transactions with automated escrow, smaller verification, and dispute resolution.",
    badges: [
      { label: "Coming Soon", color: "bg-[#f7c41b33] text-[#f7c31b]" },
      { label: "24/7 Monitoring", color: "bg-[#f29f5c33] text-[#f29f5c]" },
    ],
  },
  {
    id: "04",
    icon: "/fi-2891526.svg",
    title: "Enterprise Solutions",
    description:
      "Custom fraud prevention for large organizations with dedicated support and tailored integrations.",
    features: [
      { icon: "/fi-13648582.svg", label: "Dedicated Account Manager" },
      { icon: "/fi-4272432.svg", label: "Custom integration" },
      { icon: "/fi-4718418.svg", label: "SLA Gurantees" },
    ],
    badges: [
      { label: "Enterprise Ready", color: "bg-[#7648bc33] text-[#7648bc]" },
      { label: "Custom API", color: "bg-[#0013de33] text-[#0012de]" },
    ],
  },
  {
    id: "05",
    icon: "/fi-12453657.svg",
    title: "Digital Assets",
    description:
      "Blockchain transaction monitoring, cryptocurrency fraud detection, and digital wallet security.",
    features: [
      { icon: "/fi-8507044.svg", label: "Blockchain Analysis" },
      { icon: "/fi-3867588.svg", label: "Wallet Monitoring" },
      { icon: "/fi-3502515.svg", label: "Suspicious Pattern Detection" },
    ],
    badges: [
      { label: "Coming Soon", color: "bg-[#28739233] text-[#287392]" },
      { label: "24/7 Monitoring", color: "bg-[#60cdbc33] text-[#60ccbc]" },
    ],
  },
];

export const DivWrapperSubsection = (): JSX.Element => {
  return (
    <section className="w-full relative overflow-hidden pt-24 xl:pt-[265px]">
      <div className="flex flex-col lg:flex-row items-start gap-[50px] w-full max-w-[1326px] mx-auto px-6 md:px-10">
        <div className="flex flex-col w-full gap-[41px]">
          <header className="flex flex-col items-start gap-5 w-full">
              <Badge className="h-[30px] px-6 bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                  PREVENTION SOLUTIONS
                </span>
              </Badge>

              <h2 className="flex items-center justify-center w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[46px] tracking-[-0.92px] leading-[55.2px]">
                <span className="text-[#003d2b] tracking-[-0.42px]">Industry </span>
                <span className="text-[#0b3a78] tracking-[-0.42px]">Solutions</span>
              </h2>

              <p className="flex items-center justify-center w-full [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg tracking-[0] leading-[27.2px]">
                Tailored fraud prevention solutions designed for every industry,
                combining advanced technology with stunning visual protection to
                safeguard your business at every step.
              </p>
          </header>

          <div className="relative">
            <div className="relative w-full pl-4">
                <img
                  className="w-full h-full object-cover"
                  alt="Office workspace"
                  src="/subsection-image4.png"
                />            
            </div>

            <Card className="absolute left-0 bottom-[45px] w-[44.35%] h-[90px] bg-white rounded-[5px] border-l-2 border-[#1e357e] shadow-[0px_2px_14px_#00000024]">
              <CardContent className="flex items-center gap-[14px] sm:gap-[22.2px] p-0 h-full">
                <div className="ml-[12px] sm:ml-[17px] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#1e357e] text-[30px] sm:text-[46px] tracking-[-0.92px] leading-[normal] whitespace-nowrap">
                  19+
                </div>
                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[10px] sm:text-base tracking-[0] leading-5 sm:leading-[27.2px]">
                  Years of experience
                  <br />
                  in Industry
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <ScrollArea className="w-full h-[908px]">
          <div className="flex flex-col w-full items-start gap-[23px] pr-0 sm:pr-4">
            {industrySolutions.map((solution, index) => (
              <Card
                key={index}
                className="w-full bg-[#f6f6f6] rounded-[20px] border-0 overflow-hidden"
              >
                <CardContent className="relative p-0">
                  <div className="absolute -bottom-[35px] right-[27px] [-webkit-text-stroke:1px_#808080] opacity-15 [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-transparent text-[100px] tracking-[3.00px] leading-[120px] whitespace-nowrap">
                    {solution.id}
                  </div>
                  <div className="w-full flex flex-col max-w-[560px] items-start p-6 sm:p-8 gap-1">
                    <div className="flex items-center gap-6">
                      <img
                        className="w-[27px] h-[27px] sm:w-[43px] sm:h-[43px]"
                        alt={`${solution.title} icon`}
                        src={solution.icon}
                      />
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-6">
                        {solution.title}
                      </h3>
                    </div>

                    <div className="flex flex-col items-start justify-between gap-5 pl-[50px] sm:pl-16">
                      <p className="w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[12px] sm:text-base tracking-[0] leading-6">
                        {solution.description}
                      </p>

                      {solution.features && (
                        <div className="flex items-start gap-2 sm:gap-[15px] w-full">
                          {solution.features.map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="inline-flex items-start gap-[5px]"
                            >
                              <img
                                className="w-3 h-3 sm:w-5 sm:h-5"
                                alt={feature.label}
                                src={feature.icon}
                              />
                              <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[9px] sm:text-[13px] tracking-[0] leading-[normal]">
                                {feature.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="inline-flex items-center gap-2.5">
                        {solution.badges.map((badge, badgeIndex) => (
                          <Badge
                            key={badgeIndex}
                            className={`${badge.color} hover:${badge.color} rounded-[800px] px-4 py-2`}
                          >
                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[10px] sm:text-sm text-center tracking-[0] leading-[8px] sm:leading-[14px]">
                              {badge.label}
                            </span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
};
