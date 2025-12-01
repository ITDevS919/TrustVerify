import { CheckCircle2Icon } from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";


const verificationItems = [
  "Identity Verified",
  "No Fraud Reports",
  "Payments Protected",
];

const riskItems = [
  {
    label: "Payment Fraud",
    risk: "High Risk",
    bgColor: "bg-[#ef444433]",
    textColor: "text-red-500",
  },
  {
    label: "Digital Transaction Scams",
    risk: "Medium Risk",
    bgColor: "bg-[#ffd50033]",
    textColor: "text-[#ffd500]",
  },
  {
    label: "Social Engineering",
    risk: "High Risk",
    bgColor: "bg-[#ef444433]",
    textColor: "text-red-500",
  },
];

const integrationItems = [
  { icon: "/skill-icons-wordpress.svg", label: "Wordpress Plugin" },
  { icon: "/logos-shopify.svg", label: "Shopify Integration" },
  { icon: null, label: "Simple API Setup", prefix: "<>" },
];

export const BackgroundSubsection = (): JSX.Element => {
  return (
    <section className="relative w-full bg-[#f3f3f3] xl:max-h-[1345px] py-20">
      <div className="container mx-auto max-w-[1406px]  px-6 md:px-10">
        <div className="flex flex-col gap-10">
          <div className="z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-[125px]">
            <div className="flex flex-col gap-[15px] w-full lg:w-[660px]">
              <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] h-[30px] rounded-[800px] px-[10px]">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                  WHO WE ARE?
                </span>
              </Badge>

              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] leading-[67px] tracking-[-0.27px]">
                <span className="text-[#003d2b]">Beyond </span>
                <span className="text-[#0b3a78]">Detection:</span>
                <span className="text-[#003d2b]"> Complete Resolution</span>
              </h2>
            </div>

            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg leading-7 tracking-[-0.20px] w-full lg:w-[541px]">
              While most solutions stop at simply detecting fraud, TrustVerify
              goes far beyond by managing the entire resolution process from
              start to finish. With its built-in dispute settlement
              capabilities.
            </p>
          </div>

          <div className="z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 xl:gap-24">
            <div className="w-full lg:w-1/2 flex justify-center">
              <img className="object-contain" alt="Group" src="/subsection-image.png" />
            </div>
            <div className="w-full lg:w-1/2 flex justify-center">
              <img className="object-contain" alt="Group" src="/subsection-right-image.png" />
            </div>
        
          </div>
        </div>

        <div className="flex flex-col items-center gap-[60px] mt-[130px] ">
          <div className="flex flex-col items-center gap-[19px] max-w-[1129px]">
            <Badge className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] h-[30px] rounded-[800px] px-[10px]">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                TRUST PAGES
              </span>
            </Badge>

            <div className="flex flex-col items-center gap-5">
              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] leading-[67px] tracking-[-0.27px] text-center">
                <span className="text-[#003d2b]">Public Trust Pages For </span>
                <span className="text-[#0b3a78]">Every Business</span>
              </h2>

              <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg leading-7 tracking-[-0.20px] text-center">
                Build a stronger reputation by showcasing verified trust badges
                and promoting public transparency. With visible proof of
                authenticity and accountability, your business not only gains
                credibility but also reassures customers, strengthens long-term
                relationships, and differentiates itself as a trusted leader in
                the market.
              </p>
            </div>
          </div>

          <div className="z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[37px] w-full">
            <Card className="rounded-[20px] shadow-[0px_8px_20px_#00000024] bg-white border-0">
              <CardContent className="p-10">
                <div className="flex flex-col gap-[21px]">
                  <div className="flex flex-col gap-[15px]">
                    <div className="flex items-center gap-5">
                      <img
                        className="w-[50px] h-[50px]"
                        alt="Background"
                        src="/background-11.svg"
                      />

                      <div className="flex flex-col gap-[5px]">
                        <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl leading-6">
                          Verified Business
                        </h3>

                        <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-normal text-base">
                          <span className="font-medium text-[#808080]">
                            Trust Score:{" "}
                          </span>
                          <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#1e357e]">
                            98 / 100
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {verificationItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-[5px]"
                        >
                          <CheckCircle2Icon className="w-5 h-5 text-[#00cc61]" />
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-base leading-[27.2px]">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Badge className="w-fit bg-[#00cc6133] text-[#00cc61] hover:bg-[#00cc6133] h-6 rounded-[800px] px-4">
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs">
                      Trusted Seller
                    </span>
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[20px] shadow-[0px_8px_20px_#00000024] bg-white border-[#f3f3f3]">
              <CardContent className="p-10">
                <div className="flex flex-col gap-[19px]">
                  <div className="flex flex-col gap-[15px]">
                    <div className="flex items-center gap-5">
                      <img
                        className="w-[50px] h-[50px]"
                        alt="Background"
                        src="/background-15.svg"
                      />

                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl leading-6">
                        Global Intelligence
                      </h3>
                    </div>

                    <div className="flex flex-col gap-[9px]">
                      {riskItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-base leading-[27.2px]">
                            {item.label}
                          </span>

                          <Badge
                            className={`${item.bgColor} ${item.textColor} hover:${item.bgColor} h-6 rounded-[800px] px-3`}
                          >
                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs whitespace-nowrap">
                              {item.risk}
                            </span>
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">
                    Live threat intelligence for global markets
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[20px] shadow-[0px_8px_20px_#00000024] bg-white border-[#f3f3f3]">
              <CardContent className="p-10">
                <div className="flex flex-col gap-[15px]">
                  <div className="flex items-center gap-5">
                    <img
                      className="w-[50px] h-[50px]"
                      alt="Background"
                      src="/background-10.svg"
                    />

                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl leading-6">
                      2-click Integration
                    </h3>
                  </div>

                  <div className="flex flex-col gap-[17px]">
                    <div className="flex flex-col gap-2.5">
                      {integrationItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {item.prefix && (
                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-base leading-[27.2px]">
                              {item.prefix}
                            </span>
                          )}
                          {item.icon && (
                            <img
                              className="w-5 h-5"
                              alt={item.label}
                              src={item.icon}
                            />
                          )}
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-base leading-[27.2px]">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">
                      Ready for SMEs with minimal technical setup.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <img
        className="absolute bottom-0 right-0 w-[153px] h-[153px] md:w-[200px] md:h-[200px] xl:w-[307px] xl:h-[310px]"
        alt="Pattern"
        src="/pattern.svg"
      />

      <img
        className="absolute bottom-0 left-0 w-[153px] h-[153px] md:w-[200px] md:h-[200px] xl:w-[307px] xl:h-[310px]"
        alt="Pattern"
        src="/pattern-1.svg"
      />

      <img
        className="absolute top-[156px] right-[-200px] w-[399px] h-[528px]"
        alt="Nate shape"
        src="/nate-shape-1.svg"
      />
    </section>
  );
};
