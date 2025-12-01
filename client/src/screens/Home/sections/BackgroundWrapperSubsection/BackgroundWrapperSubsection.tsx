import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

const features = [
  {
    icon: "/background-3.svg",
    title: "Enterprise Security",
    description: "Bank-grade security with custom compliance requirements.",
  },
  {
    icon: "/background-2.svg",
    title: "Dedicated Support",
    description: "24/7 dedicated account management and technical support.",
  },
  {
    icon: "/background-14.svg",
    title: "Custom Integration",
    description: "Tailored API integration with your existing systems.",
  },
];

export const BackgroundWrapperSubsection = (): JSX.Element => {
  return (
    <section className="relative w-full bg-[#f3f3f3] py-20">
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex flex-col xl:flex-row items-center justify-center gap-[71px] max-w-[1324px] mx-auto">
          <div className="relative w-full rounded-[20px]">
              <img
                className="w-full h-full object-cover"
                alt="Enterprise solutions"
                src="/sub-image5.png"
              />
            {/* <Card className="absolute bottom-0 left-[245px] w-[409px] bg-[#1e357e] border-0 rounded-[14px]">
              <CardContent className="p-6">
                <img
                  className="absolute top-0 left-0 w-96 h-[186px] pointer-events-none"
                  alt="Card decoration"
                  src="/div--absolute-.svg"
                />

                <div className="relative z-10 flex flex-col gap-4">
                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white text-lg leading-7 text-center">
                    Ready to discuss Enterprise needs?
                  </h3>

                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-neutral-300 text-sm leading-5 text-center">
                    Get a custom quote and implementation plan for your
                    organization
                  </p>

                  <div className="flex justify-center">
                    <Button className="bg-white text-[#003d2b] hover:bg-white/90 [font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-sm h-[46px] px-4 rounded-lg">
                      Contact Enterprise Sales
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>

          <div className="z-10 flex flex-col w-full max-w-[600px] gap-[50px]">
            <div className="flex flex-col gap-5">
              <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm px-4 py-1.5 rounded-[800px]">
                ENTERPRISE
              </Badge>

              <div className="flex flex-col gap-4">
                <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[46px] leading-[55.2px] tracking-[-0.92px]">
                  <span className="text-[#1e357e]">Enterprise</span>
                  <span className="text-[#040303]"> </span>
                  <span className="text-[#003d2b]">Solutions</span>
                </h2>

                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg leading-[27.2px]">
                  Custom fraud prevention solutions designed specifically for
                  large organizations, ensuring robust protection and seamless
                  security at scale.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-[50px]">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-[13px]">
                  <img
                    className="w-[50px] h-[50px] flex-shrink-0"
                    alt={feature.title}
                    src={feature.icon}
                  />

                  <div className="flex flex-col gap-[5px]">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#040303] text-base leading-6">
                      {feature.title}
                    </h3>

                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base leading-normal">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <img
        className="absolute bottom-0 right-0 w-[213px] h-[199px]"
        alt="Decorative shape"
        src="/shape-nate-30-svg-fill.svg"
      />
    </section>
  );
};
