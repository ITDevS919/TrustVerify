import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Card, CardContent } from "../../components/ui/card";
import React from "react";

const metaData = [
  { label: "Effective Date:", value: "Janurary 1, 2025" },
  { label: "Last Updated:", value: "March 2024" },
];

const jurisdictionData = [
  {
    label: "Data Controller:",
    value: "TrustVerify Inc. London, United Kingdom",
  },
  { label: "Jurisdiction:", value: "United Kingdom" },
];

const personalInfoItems = [
  "Identity verification documents (driver's license, ID cards)",
  "Contact information (name, email, phone number, address)",
  "Financial information (bank details, payment history)",
  "Biometric data (facial recognition for verification purposes)",
  "Device and usage information (IP address, browser type, operating system)",
];

const autoCollectedItems = [
  "Transaction amounts, dates, and descriptions",
  "App usage patterns and preferences",
  "Location data (with your explicit consent)",
  "Device information and communication records",
  "Network records and resolution outcomes",
];

const legalBasisItems = [
  {
    label: "Contractual Necessity:",
    value: "Processing required to provide our financial services",
  },
  {
    label: "Legal Obligation:",
    value: "Compliance with AML and financial regulation requirements",
  },
  {
    label: "Legitimate Interest:",
    value: "Fraud prevention, risk assessment, and platform security",
  },
  {
    label: "Consent:",
    value: "Marketing communications and optional features",
  },
];

const primaryUsesItems = [
  "Identity verification and KYC compliance",
  "Processing transactions and payments",
  "Transaction monitoring and fraud detection",
  "Service operation and management",
  "Customer support and communication",
];

const secondaryUsesItems = [
  "Platform improvements and analytics",
  "Customer support and service delivery",
  "Security monitoring and threat detection",
  "Regulatory compliance and reporting",
  "Marketing (with your consent)",
];

const authorizedThirdParties = [
  {
    label: "KYC/AML Providers:",
    value: "Onfido, Jumio for identity verification",
  },
  {
    label: "Payment Processors:",
    value: "Stripe, PayPal for transaction processing",
  },
  {
    label: "Cloud Services:",
    value: "AWS, Google Cloud for secure data storage and processing",
  },
  {
    label: "Regulatory Bodies:",
    value: "As required by law for compliance reporting",
  },
];

const internationalTransferItems = [
  "Standard Contractual Clauses (SCCs) approved by the European Commission",
  "Adequacy decisions for countries with equivalent data protection",
  "Certification schemes and binding corporate rules",
  "Additional safeguards for high-risk transfers",
];

const retentionPeriods = [
  {
    label: "KYC DATA:",
    value: "7 years after account closure (regulatory requirement)",
  },
  { label: "Transaction Records:", value: "7 years for AML Compliance" },
  { label: "Dispute Records:", value: "10 years for legal protection" },
  { label: "Marketing Data:", value: "Until consistent is withdrawn" },
  { label: "Session Date:", value: "90 days for security monitoring" },
];

const individualRights = [
  { label: "Right to access:", value: "copies of your personal data" },
  {
    label: "Right to rectification:",
    value: "Correct inaccurate or incomplete data",
  },
  { label: "Right to erasure:", value: "Request deletion of your data" },
  {
    label: "Right to restrict processing:",
    value: "based on legitimate interests",
  },
  {
    label: "Right to data portability:",
    value: "Receive your data in a portable format",
  },
  {
    label: "Right to object:",
    value: "Object to processing based on legitimate interests",
  },
  { label: "Right to withdraw:", value: "consent at any time" },
  {
    label: "Right to lodge a complaint:",
    value: "with supervisory authorities",
  },
];

const technicalSafeguards = [
  "End-to-end encryption for data in transit and at rest",
  "Multi-factor authentication and access controls",
  "Regular security audits and penetration testing",
  "SOC 2 Type II certification and compliance monitoring",
  "Incident response and breach notification procedures",
];

const organizationalMeasures = [
  "Privacy by design principles",
  "Regular staff training on data protection",
  "Vendor inspection and due diligence procedures",
  "Data minimization and retention policies",
  "Regular compliance audits and monitoring",
];

const ccpaRights = [
  "Right to know what personal information is collected",
  "Right to delete personal information",
  "Right to opt-out of the sale of personal information",
  "Right to non-discrimination for exercising CCPA rights",
];

const contactDPO = [
  { label: "Email:", value: "dpo@trustworthy.co.uk" },
  { label: "Phone:", value: "+44 20 7946 0958" },
];

const contactPrivacy = [
  { label: "Email:", value: "privacy@trustworthy.co.uk" },
  { label: "Location:", value: "123 Privacy Street, London, UK" },
];

const policyChangesNotifications = [
  "- Email notification to your registered email address",
  "- Prominent notice on our website and mobile application",
  "- In-app notifications for significant changes",
];

const tableOfContents = [
  { title: "1. Data Protection & Privacy Notice", indent: false },
  { title: "2. Information We Collect", indent: false },
  { title: "2.1 Personal Information", indent: true },
  { title: "2.2 Automatically Collected Data", indent: true },
  { title: "3. Legal Basis For Processing", indent: false },
  { title: "4. How We Use Your Information", indent: false },
  { title: "4.1 Primary Users", indent: true },
  { title: "4.2 Secondary Users", indent: true },
  { title: "5. Data Sharing And Third Parties", indent: false },
  { title: "6. International Data Transfers", indent: false },
  { title: "7. Data Retention", indent: false },
  { title: "8. Your Rights", indent: false },
  { title: "9. Security Measures", indent: false },
  { title: "9.1 Technical Safeguards", indent: true },
  { title: "9.2 Organization Measures", indent: true },
  { title: "10. Ccpa Rights", indent: false },
  { title: "11. Contact Information", indent: false },
  { title: "12. Changes To The Policy", indent: false },
];



export const PrivacyPolicy = (): JSX.Element => {
  return (
    <main className="bg-white overflow-hidden w-full relative">
      <Header 
        backgroundImage = '/Header_Policies.png'
        content={{
          badge: {
            text: "POLICIES",
            variant: "secondary"
          },
          title: "Privacy Policy",
          description: "We are committed to protecting your privacy and ensuring transparency about how we collect, use, and safeguard your personal information. This policy explains our practices in clear, understandable terms.",
        }}
      />
      <section className="flex flex-col xl:flex-row items-center xl:items-start gap-[73px] w-full max-w-[1654px] mx-auto justify-center px-6 md:px-10 pt-20 pb-28">
        <Card className="block xl:hidden bg-white rounded-[20px] border border-solid border-[#e4e4e4]">
          <CardContent className="p-0">
            <div className="flex flex-col items-start gap-5 p-[31px]">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl tracking-[0] leading-6">
                Table Of Contents
              </p>

              <div className="w-full h-px bg-[#e4e4e4]"></div>
            </div>

            <div className="flex flex-col items-start gap-4 px-[30px] pb-[31px]">
              {tableOfContents.map((item, index) => (
                <div
                  key={index}
                  className={`[font-family:'DM_Sans_18pt-Regular',Helvetica] text-base tracking-[0] ${
                    item.indent ? "leading-8 text-[#808080]" : "leading-[27.2px]"
                  } ${
                    index === 0
                      ? "[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]"
                      : "font-normal text-[#808080]"
                  }`}
                >
                  {item.indent && "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
                  {item.title}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="w-full flex flex-col items-start gap-[59px]">
          <div className="flex flex-col items-start gap-[30px] w-full">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              1. Data Protection &amp; Privacy Notice
            </p>

            <div className="flex flex-col items-start gap-5 w-full">
              <div className="flex items-start justify-between w-full gap-4 flex-wrap">
                <div className="flex flex-col w-[300px] items-start gap-4">
                  {metaData.map((item, index) => (
                    <div
                      key={index}
                      className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[-0.20px] leading-7"
                    >
                      <span className="font-semibold text-[#003d2b] tracking-[-0.04px]">
                        {item.label}
                      </span>
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] tracking-[-0.04px]">
                        {" "}
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col w-[627px] items-start gap-4">
                  {jurisdictionData.map((item, index) => (
                    <div
                      key={index}
                      className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[-0.20px] leading-7 whitespace-nowrap"
                    >
                      <span className="font-semibold text-[#003d2b] tracking-[-0.04px]">
                        {item.label}
                      </span>
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] tracking-[-0.04px]">
                        {" "}
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                This privacy policy explains how we collect, use, and protect your
                personal information in compliance with UK GDPR, CCPA, and GDPR
                regulations.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>
          
          <div className="flex flex-col items-start gap-[30px] w-full">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              2. Information We Collect
            </p>

            <div className="flex flex-col items-start gap-[34px] w-full">
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  2.1 Personal Information
                </p>

                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  {personalInfoItems.map((item, index) => (
                    <React.Fragment key={index}>
                      {item}
                      {index < personalInfoItems.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  2.2 Automatically Collected Data
                </p>

                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  {autoCollectedItems.map((item, index) => (
                    <React.Fragment key={index}>
                      {item}
                      {index < autoCollectedItems.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div className="flex flex-col items-start gap-[30px] w-full">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              3. Legal Basis for Processing
            </p>

            <div className="flex flex-col items-start gap-6 w-full">
              <div className="w-full bg-[#2885ff24] rounded-2xl p-7">
                <div className="flex flex-col items-start gap-2.5">
                  <div className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#2785ff] text-xl sm:text-[22px] tracking-[-0.20px] leading-7">
                    UK GDPR Compliance
                  </div>

                  <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#2785ff] text-base sm:text-lg tracking-[-0.20px] leading-7">
                    We process data under the following legal bases
                  </div>
                </div>
              </div>

              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                {legalBasisItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <span className="font-semibold text-[#003d2b]">
                      {item.label}
                    </span>
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      {" "}
                      {item.value}
                    </span>
                    {index < legalBasisItems.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div className="flex flex-col items-start gap-[30px] w-full">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              4. How We Use Your Information
            </p>

            <div className="flex flex-col items-start gap-[34px] w-full">
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  4.1 Primary Uses
                </p>

                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  {primaryUsesItems.map((item, index) => (
                    <React.Fragment key={index}>
                      {item}
                      {index < primaryUsesItems.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  4.2 Secondary Uses
                </p>

                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  {secondaryUsesItems.map((item, index) => (
                    <React.Fragment key={index}>
                      {item}
                      {index < secondaryUsesItems.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div className="flex flex-col items-start gap-[30px] w-full">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              5. Data Sharing and Third Parties
            </p>

            <div className="flex flex-col items-start gap-6 w-full">
              <div className="w-full bg-[#2885ff24] rounded-2xl p-7">
                <div className="flex flex-col items-start gap-2.5">
                  <div className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#2785ff] text-xl sm:text-[22px] tracking-[-0.20px] leading-7">
                    Important Notice
                  </div>

                  <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#2785ff] text-base sm:text-lg tracking-[-0.20px] leading-7">
                    We do not sell or rent your personal information to third
                    parties for their marketing purposes.
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Authorized Third Parties
                </p>

                <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                  {authorizedThirdParties.map((item, index) => (
                    <React.Fragment key={index}>
                      <span className="font-semibold text-[#003d2b]">
                        {item.label}
                      </span>
                      <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                        {" "}
                        {item.value}
                      </span>
                      {index < authorizedThirdParties.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div className="flex flex-col items-start gap-[30px] w-full">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              6. International Data Transfers
            </p>

            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xl sm:text-2xl tracking-[-0.20px] leading-8">
                Your data may be transferred outside the UK/EU to provide service.
                We ensure adequate protection through:
              </p>

              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                {internationalTransferItems.map((item, index) => (
                  <React.Fragment key={index}>
                    {item}
                    {index < internationalTransferItems.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div className="flex flex-col items-start gap-[30px] w-full">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              7. Data Retention
            </p>

            <div className="flex flex-col items-start gap-6 w-full">
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Retention Periods
                </p>

                <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                  {retentionPeriods.map((item, index) => (
                    <React.Fragment key={index}>
                      <span className="font-semibold text-[#003d2b]">
                        {item.label}
                      </span>
                      <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                        {" "}
                        {item.value}
                      </span>
                      {index < retentionPeriods.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="w-full bg-[#f3f3f3] rounded-2xl p-7">
                <div className="flex flex-col items-start gap-2.5">
                  <div className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#003d2b] text-[22px] tracking-[-0.20px] leading-7">
                    Automatic Detection
                  </div>

                  <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg tracking-[-0.20px] leading-7">
                    Data is automatically deleted after retention periods expire,
                    unless legal hold requirements apply.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
            8. Your Rights (UK GDPR)
          </p>

          <div className="flex flex-col items-start gap-6 w-full">
            <div className="flex flex-col items-start gap-5 w-full">
            <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
            Individual Rights
              </p>

              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                {individualRights.map((item, index) => (
                  <React.Fragment key={index}>
                    <span className="font-semibold text-[#003d2b]">
                      {item.label}
                    </span>
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      {" "}
                      {item.value}
                    </span>
                    {index < individualRights.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="w-full bg-[#f3f3f3] rounded-2xl p-7">
              <div className="flex flex-col items-start gap-2.5">
                <div className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#003d2b] text-[22px] tracking-[-0.20px] leading-7">
                  How to Exercise Your Rights
                </div>

                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-lg tracking-[-0.20px] leading-7">
                  <span className="text-[#808080] tracking-[-0.04px]">
                    To exercise any of these rights, please contact our Data
                    Protection Officer at:{" "}
                  </span>
                  <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#003d2b] tracking-[-0.04px]">
                    dpo@trustworthy.co.uk
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div className="flex flex-col items-start gap-[30px] w-full">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              9. Security Measures
            </p>

            <div className="flex flex-col items-start gap-[34px] w-full">
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  9.1 Technical Safeguards
                </p>

                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  {technicalSafeguards.map((item, index) => (
                    <React.Fragment key={index}>
                      {item}
                      {index < technicalSafeguards.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  9.2 Organizational Measures
                </p>

                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  {organizationalMeasures.map((item, index) => (
                    <React.Fragment key={index}>
                      {item}
                      {index < organizationalMeasures.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div className="flex flex-col items-start gap-[30px] w-full">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              10. CCPA Rights (California Residents)
            </p>

            <div className="flex flex-col items-start gap-6 w-full">
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xl sm:text-2xl tracking-[-0.20px] leading-7">
                  California residents have additional rights under the California
                  Consumer Privacy Act (CCPA):
                </p>

                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  {ccpaRights.map((item, index) => (
                    <React.Fragment key={index}>
                      {item}
                      {index < ccpaRights.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start gap-2.5 px-[31px] py-[27px] w-full bg-[#d3203024] rounded-2xl">
                <div className="flex items-start gap-2.5">
                  <div className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#d32030] text-[22px] tracking-[-0.20px] leading-7 whitespace-nowrap">
                    Note:
                  </div>

                  <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#d32030] text-lg tracking-[-0.20px] leading-7">
                    TrustVerify does not sell personal information to third
                    parties.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div className="flex flex-col items-start gap-[30px] w-full">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              11. Contact Information
            </p>

            <div className="flex flex-col items-start gap-5 w-full">
              <div className="flex items-start justify-between w-full gap-8 sm:gap-4 flex-wrap">
                <div className="flex flex-col w-[330px] items-start gap-7">
                  <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                    Data Protection Officer
                  </p>

                  <div className="flex flex-col items-start gap-4">
                    {contactDPO.map((item, index) => (
                      <div
                        key={index}
                        className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[-0.20px] leading-7"
                      >
                        <span className="font-semibold text-[#003d2b] tracking-[-0.04px]">
                          {item.label}
                        </span>
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] tracking-[-0.04px]">
                          {" "}
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col w-[368px] items-start gap-7">
                  <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                    Privacy Team
                  </p>

                  <div className="flex flex-col items-start gap-4 w-full">
                    {contactPrivacy.map((item, index) => (
                      <div
                        key={index}
                        className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[-0.20px] leading-7"
                      >
                        <span className="font-semibold text-[#003d2b] tracking-[-0.04px]">
                          {item.label}
                        </span>
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] tracking-[-0.04px]">
                          {" "}
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-[#e4e4e4]"></div>

              <div className="flex flex-col items-start gap-2.5 w-full">
                <div className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#003d2b] text-[22px] tracking-[-0.20px] leading-7">
                  Regulatory Complaints
                </div>

                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  If you believe we have not adequately addressed your privacy
                  concerns, you may file a complaint with
                </p>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div className="flex flex-col items-start gap-[30px] w-full">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              12. Changes to This Policy
            </p>

            <div className="flex flex-col items-start gap-6 w-full">
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xl sm:text-2xl tracking-[-0.20px] leading-8">
                  We may update this Privacy Policy to reflect changes in our
                  practices, applicable laws, or regulatory requirements. We will
                  notify you of any material changes through:
                </p>

                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  {policyChangesNotifications.map((item, index) => (
                    <React.Fragment key={index}>
                      {item}
                      {index < policyChangesNotifications.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="hidden xl:block min-w-[326px] bg-white rounded-[20px] border border-solid border-[#e4e4e4]">
          <CardContent className="p-0">
            <div className="flex flex-col items-start gap-5 p-[31px]">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl tracking-[0] leading-6">
                Table Of Contents
              </p>

              <div className="w-full h-px bg-[#e4e4e4]"></div>
            </div>

            <div className="flex flex-col items-start gap-4 px-[30px] pb-[31px]">
              {tableOfContents.map((item, index) => (
                <div
                  key={index}
                  className={`[font-family:'DM_Sans_18pt-Regular',Helvetica] text-base tracking-[0] ${
                    item.indent ? "leading-8 text-[#808080]" : "leading-[27.2px]"
                  } ${
                    index === 0
                      ? "[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]"
                      : "font-normal text-[#808080]"
                  }`}
                >
                  {item.indent && "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
                  {item.title}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer/>
    </main>
  );
};
