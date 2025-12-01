import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";

const protectionFeatures = [
  {
    number: "01",
    title: "Escrow Protection",
    image: "/sub-image1.png",
    description:
      "Secure transactions with automated escrow services that hold funds until completion.",
    icon: "/background-6.svg",
    numberLeft: "left-[203px]",
  },
  {
    number: "02",
    title: "Identity Verification",
    image: "/sub-image2.png",
    description:
      "Advanced KYC processes ensuring you transact with verified, trusted individuals.",
    icon: "/background-12.svg",
    numberLeft: "left-[179px]",
  },
  {
    number: "03",
    title: "Real-time Fraud Detection",
    image: "/sub-image3.png",
    description:
      "AI-Powered algorithms detect suspicious activities instantly, preventing losses.",
    icon: "/background-7.svg",
    numberLeft: "left-[182px]",
  },
  {
    number: "04",
    title: "Global Risk Intelligence",
    image: "/sub-image4.png",
    description:
      "Comprehensive global threat intelligence to protect your business worldwide,",
    icon: "/background-8.svg",
    numberLeft: "left-[180px]",
  },
];

export const DivSubsection = (): JSX.Element => {
  return (
    <section className="flex flex-col w-full items-center gap-[60px] py-[130px] px-6 md:px-10">
      <div className="flex flex-col w-full max-w-[1129px] items-center gap-[19px]">
        <Badge className="h-[30px] bg-[#003d2b1a] hover:bg-[#003d2b1a] rounded-[800px] px-[9px]">
          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm tracking-[0] leading-[14px]">
            HOW WE PROTECT
          </span>
        </Badge>

        <div className="flex flex-col items-center gap-5 w-full">
          <h2 className="text-[54px] text-center leading-[54px] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
            <span className="text-[#003d2b] tracking-[-0.50px] leading-[60px]">
              Complete{" "}
            </span>
            <span className="text-[#1e357e] tracking-[-0.50px] leading-[60px]">
              Fraud
            </span>
            <span className="text-[#003d2b] tracking-[-0.50px] leading-[60px]">
              {" "}
              Prevention Suite
            </span>
          </h2>

          <p className="flex items-center justify-center w-full [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg text-center tracking-[-0.20px] leading-7">
            Protect your business with our comprehensive platform that
            seamlessly combines advanced technology with human expertise,
            delivering robust protection across all industries. From proactive
            monitoring to tailored risk management, we ensure that every aspect
            of your operations is safeguarded with precision, efficiency, and
            trust.
          </p>
        </div>
      </div>

      <div className="grid gird-cols-1 sm:grid-cols-2 xl:grid-cols-4 items-center justify-items-center gap-6 w-full max-w-[1328px]">
        {protectionFeatures.map((feature, index) => (
          <Card
            key={index}
            className="w-[314px] h-[370px] bg-white rounded-[20px] overflow-hidden border border-solid border-[#e4e4e4]"
          >
            <CardContent className="p-4 relative h-full">
              <div
                className={`${feature.numberLeft} w-[110px] absolute top-[301px] h-[120px] flex items-center justify-center [-webkit-text-stroke:1px_#f5f5f5] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-transparent text-[100px] tracking-[3.00px] leading-[120px] whitespace-nowrap`}
              >
                {feature.number}
              </div>

              <div className="flex flex-col w-[274px] items-center gap-2.5 absolute top-[241px] left-5">
                <h3 className="flex items-center justify-center w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl text-center tracking-[0] leading-6">
                  {feature.title}
                </h3>

                <p className="flex items-center justify-center w-full h-[75px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base text-center tracking-[0] leading-[26px]">
                  {feature.description}
                </p>
              </div>

              <img
                className="absolute top-5 left-1/2 -translate-x-1/2 object-cover"
                alt="Rectangle"
                src={feature.image}
              />

              <img
                className="absolute top-9 left-[35px] w-[50px] h-[50px]"
                alt="Background"
                src={feature.icon}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
