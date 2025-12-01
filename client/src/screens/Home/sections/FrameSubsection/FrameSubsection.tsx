import React from "react";
import { Badge } from "../../../../components/ui/badge";

export const FrameSubsection = (): JSX.Element => {
  const logoItems = [
    { width: "w-[103px]", height: "h-6", image: "/client_logo_1.png" },
    { width: "w-[139px]", height: "h-[18px]", image: "/client_logo_2.png" },
    { width: "w-[94px]", height: "h-[22px]", image: "/client_logo_3.png" },
    { width: "w-[120px]", height: "h-6", image: "/client_logo_4.png" },
    { width: "w-[120px]", height: "h-[21px]", image: "/client_logo_5.png" },
    { width: "w-[121px]", height: "h-[37px]", image: "/client_logo_6.png" },
    { width: "w-[117px]", height: "h-6", image: "/client_logo_7.png" },
    { width: "w-[157px]", height: "h-8", image: "/client_logo_8.png" },
    { width: "w-[122px]", height: "h-[25px]", image: "/client_logo_9.png" },
    { width: "w-[88px]", height: "h-[26px]", image: "/client_logo_10.png" },
    { width: "w-[103px]", height: "h-6", image: "/client_logo_1.png" },
    { width: "w-[139px]", height: "h-[18px]", image: "/client_logo_2.png" },
    { width: "w-[94px]", height: "h-[22px]", image: "/client_logo_3.png" },
    { width: "w-[120px]", height: "h-6", image: "/client_logo_4.png" },
    { width: "w-[120px]", height: "h-[21px]", image: "/client_logo_5.png" },
    { width: "w-[121px]", height: "h-[37px]", image: "/client_logo_6.png" },
    { width: "w-[117px]", height: "h-6", image: "/client_logo_7.png" },
    { width: "w-[157px]", height: "h-8", image: "/client_logo_8.png" },
    { width: "w-[122px]", height: "h-[25px]", image: "/client_logo_9.png" },
    { width: "w-[88px]", height: "h-[26px]", image: "/client_logo_10.png" },
  ];

  return (
    <section className="flex flex-col w-full px-6 md:px-10 mx-auto items-center gap-[60px] pt-20 justify-center">
      <div className="z-10 flex flex-col w-full max-w-[1129px]  items-center gap-[19px]">
        <Badge
          variant="secondary"
          className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-[800px] h-[30px] px-4 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]"
        >
          OUR PARTNERS
        </Badge>

        <div className="flex flex-col items-center gap-5 w-full">
          <h2 className="text-[54px] text-center tracking-[-0.27px] leading-[67px] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
            <span className="text-[#003d2b]">Build </span>
            <span className="text-[#0b3a78]">Trust</span>
            <span className="text-[#003d2b]"> With Leading </span>
            <span className="text-[#0b3a78]">Companies</span>
          </h2>

          <p className="[font-family:'DM_Sans_18pt',Helvetica] font-medium text-[#808080] text-lg text-center tracking-[0.20px] max-w-full">
            TrustVerify Launched in 2025. We&apos;re actively onboarding our
            first Enterprise clients and will showcase their partnerships here
            as they join platforms.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1326px] h-[37px] overflow-hidden">
        <div 
          className="inline-flex items-end gap-[118px] animation-marquee-custom"
          style={{ '--gap': '118px' } as React.CSSProperties}
        >
          {/* First set of logos */}
          {logoItems.map((logo, index) => (
            <div
              key={`logo-${index}`}
              className={`${logo.width} ${logo.height} bg-cover bg-[50%_50%] flex-shrink-0`}
            >
              <img
                alt="logo"
                src={logo.image}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {logoItems.map((logo, index) => (
            <div
              key={`logo-duplicate-${index}`}
              className={`${logo.width} ${logo.height} bg-cover bg-[50%_50%] flex-shrink-0`}
            >
              <img
                alt="logo"
                src={logo.image}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
