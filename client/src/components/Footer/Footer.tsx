import React from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
const companyLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Our Mission", path: "/our-mission" },
  { label: "Press & Media", path: "/press-media" },
];

const fraudDetectionLinks = [
  { label: "Identity Verification", path: "/id-verification" },
  { label: "Escrow Services", path: "/secure-escrow" },
  { label: "API Documentation", path: "/api-references" },
];

const supportLinks = [
  { label: "Help Center", path: "/help" },
  { label: "Contact Us", path: "/contact" },
  { label: "Training", path: "/training" },
];

const legalLinks = [
  { label: "Privacy Policies", path: "/policies" },
  { label: "Legal Disclaimer", path: "/legal" },
  { label: "Terms of Service", path: "/terms" },
  { label: "Cookie Policy", path: "/cookie-policy" },
  { label: "Regulatory Compliances", path: "/compliances" },
];

const socialLinks = [
  { label: "Linkedin" },
  { label: "Facebook" },
  { label: "Instagram" },
  { label: "Twitter" },
];

export const Footer = (): JSX.Element => {
  return (
    <footer className="relative w-full bg-app-primary">
      <img
        className="absolute top-0 left-0 w-full h-full object-cover"
        alt="Footer bg svg fill"
        src="/footer-bg-svg-fill.svg"
      />

      <div className="flex flex-col relative max-w-[1300px] mx-auto pt-12 sm:pt-16 md:pt-20 lg:pt-[100px] px-4 sm:px-6 2xl:px-0">
        <div className="flex flex-col xl:flex-row xl:justify-between gap-8 xl:gap-0">
          <div className="pb-8 lg:pb-[60px] w-full lg:w-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] leading-tight sm:leading-[36px] lg:leading-[40.8px] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white mb-6 sm:mb-8 lg:mb-[40px]">
              Don't missed subscribed!
            </h2>

            <div className="flex w-full lg:max-w-[500px]">
              <Input
                placeholder="Enter Your Email"
                className="flex-1 h-12 sm:h-14 lg:h-[59px] rounded-r-none border-[#ffffff33] bg-transparent text-white placeholder:text-white placeholder:opacity-80 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm sm:text-base opacity-80"
              />
              <img className="w-16 sm:w-20 lg:w-[72px] h-12 sm:h-14 lg:h-[59px] object-cover" alt="Button" src="/button.svg" />
            </div>
          </div>

          <div className="grid grid-rows-2 grid-cols-2 xl:grid-rows-1 xl:grid-cols-4 gap-6 xl:gap-2 pb-8 xl:pb-[60px] w-full xl:w-auto">
            <nav className="flex flex-col gap-4 sm:gap-5 lg:gap-[25px]">
              <h3 className="text-lg sm:text-xl leading-6 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white">
                Fraud Detection
              </h3>
              <ul className="flex flex-col gap-2 sm:gap-[10px]">
                {fraudDetectionLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-sm sm:text-base leading-[27.2px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white opacity-80 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav className="flex flex-col gap-4 sm:gap-5 lg:gap-[25px]">
              <h3 className="text-lg sm:text-xl leading-6 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white">
                Company
              </h3>
              <ul className="flex flex-col gap-2 sm:gap-[10px]">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-sm sm:text-base leading-[27.2px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white opacity-80 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav className="flex flex-col gap-4 sm:gap-5 lg:gap-[25px]">
              <h3 className="text-lg sm:text-xl leading-6 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white">
                Support
              </h3>
              <ul className="flex flex-col gap-2 sm:gap-[10px]">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-sm sm:text-base leading-[27.2px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white opacity-80 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav className="flex flex-col gap-4 sm:gap-5 lg:gap-[25px]">
              <h3 className="text-lg sm:text-xl leading-6 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white">
                Legal
              </h3>
              <ul className="flex flex-col gap-2 sm:gap-[10px]">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-sm sm:text-base leading-[27.2px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white opacity-80 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <Card className="bg-[#ffffff1a] border-none rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] mb-6 sm:mb-8 lg:mb-[40px]">
          <CardContent className="p-4 sm:p-6 lg:p-[39px] flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 lg:gap-[47px]">
            <img className="h-10 sm:h-12 lg:h-[54px] w-auto" alt="Group" src="/footer_logo.png" />

            <div className="flex-1 w-full sm:w-auto flex flex-row items-start sm:items-center justify-start sm:justify-end gap-10">
              <div className="w-full sm:w-auto">
                <p className="text-sm sm:text-base leading-[27.2px] [font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-white opacity-80 mb-2 sm:mb-[10px]">
                  Need help!
                </p>
                <p className="text-lg sm:text-xl leading-6 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white break-all sm:break-normal">
                  +1 809 120 705
                </p>
              </div>
              <div className="w-px h-[61px] bg-[#ffffff1a]" />
              <div className="w-full sm:w-auto border-[#ffffff1a] sm:border-t-0">
                <p className="text-sm sm:text-base leading-[27.2px] [font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-white opacity-80 mb-2 sm:mb-[10px]">
                  E-mail now
                </p>
                <p className="text-lg sm:text-xl leading-6 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white break-all sm:break-normal">
                  info@trustverify.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row items-center justify-between gap-5 mt-2 md:gap-0 mb-6 sm:mb-8">
          <p className="text-sm md:text-base leading-[27.2px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white opacity-80 text-center md:text-left">
            Copyright © 2025 All Rights Reserved.
          </p>
 
          <nav className="flex items-center flex-wrap justify-center gap-3 sm:gap-4 lg:gap-[27.3px]">
            {socialLinks.map((link, index) => (
              <React.Fragment key={index}>
                <a
                  href="#"
                  className="text-sm sm:text-base [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white opacity-80 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </a>
                {index < socialLinks.length - 1 && (
                  <div className="w-1.5 h-1.5 bg-[#ffffff1a] rounded-[3px]" />
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
