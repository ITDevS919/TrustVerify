import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import { Label } from "@radix-ui/react-label";

const companyLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Our Mission", path: "/our-mission" },
  { label: "Press & Media", path: "/media" },
];

const fraudDetectionLinks = [
  { label: "Identity Verification", path: "/kyc-verification" },
  { label: "Escrow Services", path: "/secure-escrow" },
  { label: "KYB Services", path: "/solutions/kyb" },
];

const supportLinks = [
  { label: "Help Center", path: "/help" },
  { label: "Contact Us", path: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policies", path: "/policies" },
  { label: "Legal Disclaimer", path: "/legal" },
  { label: "Terms of Service", path: "/terms" },
  { label: "Cookie Policy", path: "/cookie-policy" },
  { label: "Regulatory Compliances", path: "/regulatory-compliance" },
];

const socialLinks = [
  { 
    label: "LinkedIn", 
    url: "https://www.linkedin.com/company/trustverify",
    icon: "linkedin"
  },
  { 
    label: "Facebook", 
    url: "https://www.facebook.com/trustverify",
    icon: "facebook"
  },
  { 
    label: "Instagram", 
    url: "https://www.instagram.com/trustverify",
    icon: "instagram"
  },
  { 
    label: "Twitter", 
    url: "https://twitter.com/trustverify",
    icon: "twitter"
  },
];

export const Footer = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setSubmitStatus("idle");
    setErrorMessage("");
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubmitStatus("error");
      setErrorMessage("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitStatus("error");
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      // Check if we got a response
      if (!response) {
        throw new Error("No response from server. Please check your connection.");
      }

      // Check if response has content before parsing JSON
      const contentType = response.headers.get("content-type");
      const hasJsonContent = contentType && contentType.includes("application/json");
      
      let data: any = {};
      
      // Only try to parse JSON if we have content
      if (hasJsonContent) {
        try {
          const text = await response.text();
          if (text && text.trim()) {
            data = JSON.parse(text);
          }
        } catch (parseError) {
          console.error("Failed to parse JSON response:", parseError);
          // If response is OK but JSON parsing fails, still treat as success
          if (response.ok) {
            setSubmitStatus("success");
            setEmail("");
            setTimeout(() => {
              setSubmitStatus("idle");
            }, 3000);
            return;
          }
          throw new Error("Invalid response from server");
        }
      }

      if (!response.ok) {
        const errorMsg = data?.error || data?.message || `Failed to subscribe (${response.status})`;
        throw new Error(errorMsg);
      }

      setSubmitStatus("success");
      setEmail("");
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      setSubmitStatus("error");
      // Provide more specific error messages
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        setErrorMessage("Network error. Please check your connection and try again.");
      } else {
        setErrorMessage(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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

            <form onSubmit={handleSubscribe} className="w-full lg:max-w-[500px]">
              <div className="flex w-full">
                <Input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter Your Email"
                  disabled={isSubmitting}
                  className="flex-1 h-12 sm:h-14 lg:h-[59px] rounded-r-none border-[#ffffff33] bg-transparent text-white placeholder:text-white placeholder:opacity-80 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm sm:text-base opacity-80 disabled:opacity-50"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-16 sm:w-20 lg:w-[72px] h-12 sm:h-14 lg:h-[59px] flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Subscribe" 
                    src="/button.svg" 
                  />
                </button>
              </div>
              {submitStatus === "success" && (
                <p className="mt-2 text-sm text-green-300 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal">
                  Successfully subscribed! Thank you.
                </p>
              )}
              {submitStatus === "error" && errorMessage && (
                <p className="mt-2 text-sm text-red-300 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal">
                  {errorMessage}
                </p>
              )}
            </form>
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
                      +44 02 0454 2723
                </p>
              </div>
              <div className="w-px h-[61px] bg-[#ffffff1a]" />
              <div className="w-full sm:w-auto border-[#ffffff1a] sm:border-t-0">
                <p className="text-sm sm:text-base leading-[27.2px] [font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-white opacity-80 mb-2 sm:mb-[10px]">
                  E-mail now
                </p>
                <p className="text-lg sm:text-xl leading-6 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white break-all sm:break-normal">
                    Info@trustverify.co.uk
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
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
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
