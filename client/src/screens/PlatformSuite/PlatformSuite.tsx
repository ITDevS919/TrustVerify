import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { FormSubsection } from "../Home/sections/FormSubsection";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { TrendingUp } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import React from "react";

const platformFeatures = [
  {
    icon: "/background-shield.png",
    title: "Trustverify Shield",
    subtitle: "Active Fraud Detection Engine",
    description:
      "Advanced AI-powered algorithms designed to block suspicious activities in real-time.",
    features: [
      "Real-time threat detection",
      "AI-powered risk scoring",
      "Behavioral pattern analysis",
      "Multi-layer protection",
    ],
    buttonText: "Explore Shield",
    buttonIcon: "/image.svg",
  },
  {
    icon: "/background-id.png",
    title: "Trustverify Id",
    subtitle: "Advanced Identity Verification",
    description:
      "Next-gen KYC & AML compliance for seamless onboarding and fraud prevention.",
    features: [
      "Document verification",
      "Biometric authentication",
      "AML compliance checks",
      "Global database screening",
    ],
    buttonText: "Explore ID",
    buttonIcon: "/image.svg",
  },
  {
    icon: "/background-escrow.png",
    title: "Trustverify Escrow",
    subtitle: "Secure Transaction Holding",
    description:
      "Automated escrow services ensuring funds are only released after successful completion.",
    features: [
      "Automated fund holding",
      "Smart release conditions",
      "Dispute resolution",
      "Multi-currency support",
    ],
    buttonText: "Explore Escrow",
    buttonIcon: "/image.svg",
  },
  {
    icon: "/background-riskintel.png",
    title: "Trustverify Riskintel",
    subtitle: "Global Threat & Risk Intelligence",
    description:
      "Global fraud and risk intelligence platform for proactive defense worldwide.",
    features: [
      "Global threat database",
      "Risk intelligence feeds",
      "Proactive threat alerts",
      "Country-specific insights",
    ],
    buttonText: "Explore RiskIntel",
    buttonIcon: "/image.svg",
  },
  {
    icon: "/background-score.png",
    title: "Trustverify Score",
    subtitle: "AI-Powered Trust Scoring",
    description:
      "Instantly assess the credibility of users, domains, and businesses.",
    features: [
      "Real-time trust scoring",
      "Domain reputation analysis",
      "User credibility assessment",
      "Business verification",
    ],
    buttonText: "Explore Score",
    buttonIcon: "/image.svg",
  },
  {
    icon: "/background-watchtower.png",
    title: "Trustverify Watchtower",
    subtitle: "Continuous Transaction",
    description: "Always-on pattern recognition and anomaly alerts.",
    features: [
      "Continuous monitoring",
      "Pattern recognition",
      "Anomaly detection",
      "Real-time alerts",
    ],
    buttonText: "Explore Watchtower",
    buttonIcon: "/image.svg",
  },
];


const features = [
  {
    icon: "/icon-detect.png",
    title: "Threat Detected",
    description: "AI identifies suspicious behavior instantly",
  },
  {
    icon: "/icon-shield.png",
    title: "Shield Activated",
    description: "Multi-layer protection stops fraudulent attempts",
  },
  {
    icon: "/icon-secured.png",
    title: "Transaction Secured",
    description: "Payment or data transfer is safely completed",
  },
];

export const PlatformSuite = (): JSX.Element => {
  return (
    <main className="bg-white overflow-hidden w-full relative">
      <Header 
        backgroundImage = '/Header_Platform.png'
        content={{
          title: "TrustVerify Platform Suite",
          description: "Comprehensive fraud prevention and trust verification tools designed for enterprise-grade security and global scale.",
          tags: ["SOC 2 CERTIFIED", "256-BIT ENCRYPTION", "99.99% UPTIME"],
          maxWidth: "880px"
        }}
      />
      <section className="relative w-full flex flex-col items-center gap-9 py-24">
        <img
          className="absolute top-[145px] right-[100px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star-1.svg"
        />

        <img
          className="absolute bottom-[149px] left-[100px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star.svg"
        />

        <img
          className="absolute top-[74px] left-[-227px] w-[399px] h-[528px] z-10 pointer-events-none"
          alt="Nate shape"
          src="/nate-shape.svg"
        />

        <img
          className="absolute bottom-[88px] -right-[222px] w-[439px] h-[653px] z-10 pointer-events-none"
          alt="shape"
          src="/shape_nate_31.png"
        />



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 w-full max-w-[1324px] px-4">
          {platformFeatures.map((feature, index) => (
            <Card
              key={index}
              className="z-10 bg-white rounded-[20px] border border-[#e4e4e4] overflow-hidden flex flex-col h-[511px]"
            >
              <CardContent className="flex flex-col h-full p-9 gap-5">
                <div className="flex flex-col gap-5 flex-1">
                  <div className="flex items-center gap-4">
                    <img
                      className="w-16 h-16"
                      alt={feature.title}
                      src={feature.icon}
                    />
                    <div className="flex flex-col gap-[5px] flex-1">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl leading-6">
                        {feature.title}
                      </h3>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg leading-[27px]">
                        {feature.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg leading-[27px]">
                    {feature.description}
                  </p>

                  <div className="flex flex-col gap-2.5">
                    <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-app-primary text-lg leading-[27px]">
                      Key Features:
                    </p>
                    <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg leading-[30px]">
                      {feature.features.map((item, idx) => (
                        <React.Fragment key={idx}>
                          {item}
                          {idx < feature.features.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                <Button className="w-full h-14 bg-app-primary hover:bg-app-primary/90 rounded-xl text-white [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-lg tracking-[-0.20px] leading-[18px]">
                  <span>{feature.buttonText}</span>
                  <img
                    className="w-[30px] h-[30px] ml-2"
                    alt="Arrow"
                    src={feature.buttonIcon}
                  />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative w-full bg-[#f4f4f4] py-[72px]">
        <img
          className="absolute right-0 bottom-0 w-[191px] h-[173px]"
          alt="Shape nate"
          src="/shape-nate-30-svg-fill.svg"
        />
        <div className="flex flex-col w-full max-w-[1195px] mx-auto px-6 md:px-10 items-center gap-[60px]">
          <div className="flex flex-col w-full max-w-[893px] items-center gap-5">
            <div className="flex flex-col items-center gap-5 w-full">
              <Badge className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-[800px] px-4 py-1.5 h-auto">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                  HOW IT WORKS
                </span>
              </Badge>

              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.27px] leading-[67px]">
                <span className="text-[#003d2b]">How </span>
                <span className="text-[#0b3a78]">Trust</span>
                <span className="text-[#27ae60]">Verify</span>
                <span className="text-[#003d2b]"> Works</span>
              </h2>
            </div>

            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg text-center tracking-[-0.20px] leading-7">
              Our intelligent platform provides seamless protection through
              advanced AI and real-time monitoring.
            </p>
          </div>

          <div className="flex flex-col items-center gap-[47px] w-full">
            <img
              className="hidden md:block w-full max-w-[852px] h-[11px]"
              alt="Group"
              src="/group-63.png"
            />
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-36 w-full">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="z-10 flex flex-col w-[275px] items-center gap-[50px]"
                >
                  <img
                    className="w-[90px] h-[90px]"
                    alt="Icon"
                    src={feature.icon}
                  />

                  <div className="flex flex-col items-center gap-2.5 w-full">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-[22px] text-center tracking-[0] leading-[normal]">
                      {feature.title}
                    </h3>

                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base text-center tracking-[0] leading-[27px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full pb-28">
        <FormSubsection />
      </section>
      <Footer/>
    </main>
  );
};
