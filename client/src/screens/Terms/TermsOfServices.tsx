import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Card, CardContent } from "../../components/ui/card";
import React, { useState } from "react";

const metaData = [
  { label: "Effective Date:", value: "October 15, 2025" },
  { label: "Last Updated:", value: "October 15, 2025" },
];

const companyData = [
  {
    label: "Company:",
    value: "Magnificentech Solution Ltd trading as Trust Verify (Company No.: 16321180)",
  },
  { label: "Date of Incorporation:", value: "17 March 2025" },
  { label: "Registered Address:", value: "18 Barn Close Willow Farm, Choppington, Northumberland, NE62 5EU" },
  { label: "Governing Law:", value: "England and Wales" },
];

const servicesProvided = [
  "Identity Verification (KYC/AML): Provision of electronic Know Your Customer (KYC) and Anti-Money Laundering (AML) checks to verify the identity of Users and their representatives, in compliance with applicable laws and regulations.",
  "Trust Scoring: Generation of trust scores for Users and transactions based on available data, risk indicators, and proprietary algorithms, to assist in fraud prevention and risk assessment.",
  "Escrow Services: Provision of digital escrow facilities to hold funds in trust pending completion of specified conditions or milestones in a transaction, subject to the Supplier's escrow terms and conditions.",
  "API Access & Integration: Grant of access to the Supplier's application programming interfaces (APIs) for integration with the User's systems, subject to compliance with usage limitations, security protocols, and technical documentation provided by the Supplier.",
  "Compliance Monitoring: Ongoing monitoring of transactions and User activity for compliance with applicable laws, regulations, and the Supplier's policies, including detection and reporting of suspicious or unlawful activity.",
  "Customer Support: Provision of reasonable technical and customer support to assist Users with access, integration, and use of the platform, subject to the Supplier's standard support hours and response times.",
];

const tableOfContents = [
  { title: "Background", indent: false, id: "section-background" },
  { title: "1. Definitions and Interpretation", indent: false, id: "section-1" },
  { title: "2. Commencement and Duration", indent: false, id: "section-2" },
  { title: "3. Services Provided", indent: false, id: "section-3" },
  { title: "4. User Registration and Account Management", indent: false, id: "section-4" },
  { title: "5. Fees, Payment Terms, and Taxes", indent: false, id: "section-5" },
  { title: "6. Service Levels and Limitations", indent: false, id: "section-6" },
  { title: "7. User Obligations", indent: false, id: "section-7" },
  { title: "8. TrustVerify Obligations", indent: false, id: "section-8" },
  { title: "9. Intellectual Property Rights", indent: false, id: "section-9" },
  { title: "10. Data Protection and Security", indent: false, id: "section-10" },
  { title: "11. Confidentiality", indent: false, id: "section-11" },
  { title: "12. Warranties and Disclaimers", indent: false, id: "section-12" },
  { title: "13. Limitation of Liability and Indemnity", indent: false, id: "section-13" },
  { title: "14. Suspension of Services", indent: false, id: "section-14" },
  { title: "15. Termination", indent: false, id: "section-15" },
  { title: "16. Post-Termination Obligations and Transition Assistance", indent: false, id: "section-16" },
  { title: "17. Force Majeure", indent: false, id: "section-17" },
  { title: "18. Notices", indent: false, id: "section-18" },
  { title: "19. Assignment and Subcontracting", indent: false, id: "section-19" },
  { title: "20. Variation of Agreement", indent: false, id: "section-20" },
  { title: "21. Entire Agreement", indent: false, id: "section-21" },
  { title: "22. Third Party Rights", indent: false, id: "section-22" },
  { title: "23. Governing Law and Jurisdiction", indent: false, id: "section-23" },
  { title: "24. Dispute Resolution and Mediation", indent: false, id: "section-24" },
  { title: "25. Complaints Policy and Procedure", indent: false, id: "section-25" },
];

export const TermsOfServices = (): JSX.Element => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleTocClick = (itemId: string) => {
    setSelectedItem(itemId);
    setTimeout(() => {
      const element = document.getElementById(itemId);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 10);
  };

  return (
    <main className="bg-white overflow-hidden w-full relative">
      <Header 
        backgroundImage = '/Header_Policies.png'
        content={{
          badge: {
            text: "POLICIES",
            variant: "secondary"
          },
          title: "Terms of Service",
          description: "These Terms of Service govern your use of the TrustVerify platform, APIs, and related services provided by Magnificentech Solution Ltd trading as Trust Verify.",
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
              {tableOfContents.map((item, index) => {
                const isSelected = selectedItem === item.id;
                const shouldHighlight = isSelected || (index === 0 && selectedItem === null);
                return (
                  <a
                    key={index}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleTocClick(item.id);
                    }}
                    className={`[font-family:'DM_Sans_18pt-Regular',Helvetica] text-base tracking-[0] cursor-pointer hover:text-[#003d2b] transition-colors no-underline ${
                      item.indent ? "leading-8 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium" : "leading-[27.2px]"
                    } ${
                      shouldHighlight 
                        ? "text-[#003d2b]" 
                        : "text-[#808080]"
                    } ${
                      index === 0 && shouldHighlight
                        ? "[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium"
                        : ""
                    }`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    {item.indent && "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
                    {item.title}
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="w-full flex flex-col items-start gap-[59px]">
          <div id="section-background" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              Background
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
                  {companyData.map((item, index) => (
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
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                A. TrustVerify is a fintech and cybersecurity SaaS platform operated by Magnificentech Solution Ltd, providing fraud prevention and compliance tools, including identity verification (KYC/AML), trust scoring, and escrow services, via an online API-based platform.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                B. The Supplier acts solely as a facilitator and is not a party to any transaction between users of the platform. TrustVerify does not endorse, certify, or guarantee any users, transactions, or platforms.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                C. All users of the platform act at their own risk. The Supplier is not responsible for the actions or disputes between users.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                D. The Supplier's liability is strictly limited to the fees paid by the Client in the three months preceding any incident giving rise to a claim.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-1" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              1. Definitions and Interpretation
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                1.1 In this Agreement, unless the context otherwise requires, the following expressions shall have the following meanings:
              </p>
              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                <span className="font-semibold text-[#003d2b]">Supplier</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]"> means Magnificentech Solution Ltd trading as Trust Verify Company No.: 16321180, the provider of the Platform and Services as described in this Agreement.</span>
              </div>
              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                <span className="font-semibold text-[#003d2b]">User</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]"> means any individual, company, sole trader, partnership, or other legal entity that registers for, accesses, or uses the Platform or Services, whether as a business client or consumer.</span>
              </div>
              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                <span className="font-semibold text-[#003d2b]">Platform</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]"> means the online API-based software-as-a-service solution operated by the Supplier, including all related websites, applications, and technology infrastructure, through which the Services are provided.</span>
              </div>
              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                <span className="font-semibold text-[#003d2b]">Services</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]"> means the services provided by the Supplier via the Platform, including but not limited to Identity Verification (KYC/AML), Trust Scoring, Escrow Services, API Access & Integration, Compliance Monitoring, and Customer Support.</span>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-2" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              2. Commencement and Duration
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                2.1 This Agreement between Magnificentech Solution Ltd trading as Trust Verify Company No.: 16321180 Date of Incorporation: 17 March 2025 (the "Supplier") and each user of the Platform (the "User") shall commence upon the date the User completes registration for access to the Platform and expressly accepts these Terms of Business, whether by electronic acceptance, click-through, or other means as specified on the Platform.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                2.2 The Agreement shall continue in full force and effect on an ongoing basis unless and until terminated in accordance with the provisions of these Terms of Business.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                2.3 Either party may terminate this Agreement at any time, subject to the notice requirements and procedures set out in Clause 15 (Termination).
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-3" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              3. Services Provided
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                3.1 Magnificentech Solution Ltd trading as Trust Verify (the "Supplier") shall provide access to its online platform and associated services to users (the "User") in accordance with the terms of this Agreement. The Supplier's platform is a fintech and cybersecurity Software-as-a-Service (SaaS) solution focused on fraud prevention and compliance tools.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                3.2 The Supplier acts solely as a facilitator of digital transactions and does not become a party to any transaction between Users. The Supplier does not endorse, certify, or guarantee any User, transaction, or platform, and all Users engage with the platform and its services at their own risk.
              </p>
              <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                Core Services:
              </p>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                {servicesProvided.map((item, index) => (
                  <React.Fragment key={index}>
                    • {item}
                    {index < servicesProvided.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex flex-col items-start gap-2.5 px-[31px] py-[27px] w-full bg-[#EAB30824] border border-[#EAB308] rounded-2xl">
                <div className="flex flex-col items-start gap-2.5">
                  <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#EAB308] text-[22px] tracking-[-0.20px] leading-7">
                    Important Disclaimer:
                  </p>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#EAB308] text-lg tracking-[-0.20px] leading-7">
                    The Supplier does not guarantee the accuracy, completeness, or timeliness of any identity verification, trust score, or compliance result provided through the platform. All services are provided on an "as is" and "as available" basis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-4" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              4. User Registration and Account Management
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                4.1 In order to access and utilise the services provided by Magnificentech Solution Ltd trading as Trust Verify (the "Provider"), each user (the "User") must complete the registration process as specified on the Platform. Registration is a prerequisite for the creation of a User account and the subsequent use of any services.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                4.2 The User represents and warrants that all information provided during the registration process, and at any time thereafter, shall be accurate, complete, and up to date. The User undertakes to promptly update any information that becomes inaccurate or incomplete, and acknowledges that failure to do so may result in suspension or termination of the User's account in accordance with these Terms.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                4.3 The User is solely responsible for maintaining the confidentiality and security of all login credentials, passwords, and authentication methods associated with their account. The User must immediately notify the Provider of any unauthorised access, suspected breach, or compromise of account security.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-5" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              5. Fees, Payment Terms, and Taxes
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                5.1 The fees payable for the use of the services provided by Magnificentech Solution Ltd trading as Trust Verify (the "Supplier") shall comprise subscription fees, pay-per-use fees, and one-time setup fees, as set out in the applicable order form, service schedule, or as otherwise notified to the user (the "User") from time to time. All fees are stated in pounds sterling (£ GBP) and are exclusive of applicable taxes unless expressly stated otherwise.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                5.2 The User shall pay all fees in accordance with the payment terms specified in the relevant invoice or as otherwise agreed in writing. Accepted payment methods include bank transfer, debit or credit card, direct debit, and other digital wallets as notified by the Supplier. Payment shall be made in full, without set-off, counterclaim, or deduction, except as required by law.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                5.3 If the User fails to make any payment due under this agreement by the due date for payment, then, without limiting the Supplier's other rights and remedies, the Supplier may charge interest on the overdue amount at the rate of four percent (4%) per annum above the base rate of the Bank of England from time to time, accruing on a daily basis from the due date until the date of actual payment.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-6" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              6. Service Levels and Limitations
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                6.1 Magnificentech Solution Ltd trading as Trust Verify (the "Supplier") shall provide access to the Platform and Services to all users (the "User") in accordance with the terms of this Agreement, subject to the limitations and exclusions set out herein. The Supplier shall use reasonable endeavours to ensure that the Platform is available and operational, except during scheduled maintenance windows or in the event of Force Majeure.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                6.2 The Supplier shall use commercially reasonable efforts to maintain an uptime availability target of 99.5% per calendar month, excluding scheduled maintenance, emergency maintenance, downtime caused by third-party service providers, and Force Majeure Events.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                6.3 The Supplier's total aggregate liability to the User for any claim or series of related claims arising out of or in connection with this Agreement, whether in contract, tort (including negligence), breach of statutory duty, or otherwise, shall be limited to the total fees paid by the User to the Supplier in the three (3) months immediately preceding the event giving rise to the claim.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-7" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              7. User Obligations
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                7.1 All users of the TrustVerify platform, including business clients, individual users, companies, and sole traders (each a "User"), shall comply with all terms and conditions set out in this Agreement, as well as any applicable laws, regulations, and industry standards relevant to their use of the services provided by Magnificentech Solution Ltd trading as Trust Verify (the "Provider").
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                7.2 Users shall ensure that all information provided to the Provider, whether during registration or in the course of using the platform, is accurate, complete, and up to date. Users must promptly update any information that becomes inaccurate or incomplete.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                7.3 Users are responsible for maintaining the confidentiality and security of their account credentials, including usernames, passwords, API keys, and any other authentication details. Users must not share their account credentials with any third party and shall be liable for all activities conducted through their account, whether authorised or unauthorised.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-8" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              8. TrustVerify Obligations
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                8.1 Magnificentech Solution Ltd trading as Trust Verify (the "Supplier") shall provide the Service(s) to the User in accordance with the terms of this Agreement, exercising reasonable skill, care, and diligence as would be expected of a professional provider of fintech and cybersecurity SaaS solutions. The Supplier shall act as a facilitator of digital transactions and shall not be a party to any transaction between Users.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                8.2 The Supplier shall use reasonable endeavours to ensure that the Platform is available and operational at all times, subject to scheduled maintenance, emergency maintenance, and circumstances beyond the Supplier's reasonable control, including Force Majeure Events as defined in this Agreement.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                8.3 The Supplier shall implement and maintain appropriate technical and organisational measures to ensure the security, confidentiality, and integrity of User Data, including compliance with the UK Data Protection Act 2018, the General Data Protection Regulation (GDPR), and any other applicable data protection laws.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-9" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              9. Intellectual Property Rights
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                9.1 Magnificentech Solution Ltd trading as Trust Verify (the "Company") retains sole and exclusive ownership of all intellectual property rights, including but not limited to all patents, copyrights, database rights, design rights, trademarks, trade secrets, know-how, and all other proprietary rights, whether registered or unregistered, in and to the TrustVerify platform, its underlying software, source code, algorithms, user interfaces, documentation, APIs, and all related materials.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                9.2 No provision of this Agreement shall operate to transfer, assign, or otherwise convey any right, title, or interest in the Platform IP to any user, client, or third party. All rights not expressly granted to the user under this Agreement are reserved by the Company.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                9.3 Subject to the user's full compliance with the terms of this Agreement, the Company grants to each user a limited, non-exclusive, non-transferable, non-sublicensable, revocable licence to access and use the Platform and its services solely for the user's internal business purposes or personal use, as applicable, and strictly in accordance with this Agreement and any applicable documentation or usage guidelines provided by the Company.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-10" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              10. Data Protection and Security
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                10.1 Magnificentech Solution Ltd trading as Trust Verify Company No.: 16321180 (the "Supplier") and each user of the Platform (the "User") shall comply with all applicable data protection and privacy laws, including but not limited to the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and any other relevant legislation or regulatory requirements in force from time to time.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                10.2 All data uploaded, submitted, or otherwise provided by the User to the Platform ("User Data") remains the exclusive property of the User. The Supplier shall have a limited, non-exclusive licence to process User Data solely for the purpose of providing the Services and fulfilling its obligations under this Agreement.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                10.3 The Supplier shall implement and maintain appropriate technical and organisational measures to ensure the security, integrity, and confidentiality of all personal data processed in connection with the provision of the Services. Such measures shall include, but are not limited to, data encryption (both in transit and at rest), access controls, regular security assessments, and staff training on data protection obligations.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-11" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              11. Confidentiality
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                11.1 Each party undertakes that it shall, at all times during the term of this Agreement and thereafter, keep confidential and shall not disclose to any third party any Confidential Information (as defined below) of the other party, except as expressly permitted by this Clause 11 or as may be required by law, regulation, or order of a competent authority.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                11.2 For the purposes of this Agreement, Confidential Information means all information, whether written, oral, electronic, or in any other form, that is disclosed by one party to the other in connection with this Agreement, which is either marked as confidential or which ought reasonably to be considered confidential given the nature of the information and the circumstances of disclosure.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                11.3 The obligations of confidentiality set out in this Clause 11 shall not apply to any information which is or becomes generally available to the public other than as a result of a breach of this Agreement by the receiving party, was lawfully in the possession of the receiving party prior to disclosure, is lawfully obtained from a third party, or is independently developed by the receiving party without use of or reference to the Confidential Information.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-12" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              12. Warranties and Disclaimers
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                12.1 Magnificentech Solution Ltd trading as Trust Verify Company No.: 16321180 (the "Supplier") warrants that it shall provide the Service(s) with reasonable skill and care, in accordance with applicable laws and regulations of England & Wales, and in substantial conformity with the description of the Service(s) as set out in this Agreement. The Supplier does not warrant that the Service(s) will be uninterrupted, error-free, or free from vulnerabilities.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                12.2 The User acknowledges and agrees that the Supplier acts solely as a facilitator of the Platform and is not a party to any transaction, agreement, or arrangement between Users. The Supplier does not endorse, certify, or guarantee any User, transaction, or platform, and expressly disclaims any responsibility or liability for the acts, omissions, or representations of any User or third party.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                12.3 Except as expressly set out in this Agreement, the Service(s) are provided on an "as is" and "as available" basis. To the fullest extent permitted by law, all warranties, conditions, representations, and other terms implied by statute, common law, or otherwise are excluded, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-13" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              13. Limitation of Liability and Indemnity
            </p>
            <div className="flex flex-col items-start gap-6 w-full">
              <div className="w-full bg-[#2885ff24] rounded-2xl p-7">
                <div className="flex flex-col items-start gap-2.5">
                  <div className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#2785ff] text-xl sm:text-[22px] tracking-[-0.20px] leading-7">
                    Important Notice
                  </div>
                  <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#2785ff] text-base sm:text-lg tracking-[-0.20px] leading-7">
                    The Supplier's total aggregate liability is limited to the fees paid in the three months preceding any claim.
                  </div>
                </div>
              </div>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                13.1 The parties acknowledge and agree that Magnificentech Solution Ltd trading as Trust Verify (the Provider) is a facilitator of the Platform and related Services, and is not a party to any transaction, arrangement, or agreement between Users. The Provider does not endorse, certify, or guarantee any Users, transactions, or platforms accessed or utilised through the Platform. All Users engage with the Platform and Services at their own risk.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                13.2 To the fullest extent permitted by law, the Provider and its Affiliates shall not be liable to any User or any third party for any indirect, incidental, special, exemplary, punitive, or consequential loss or damage, including but not limited to loss of profits, loss of business, loss of opportunity, loss of data, or loss of goodwill.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                13.3 The total aggregate liability of the Provider and its Affiliates to any User for any and all claims, losses, damages, costs, or expenses arising out of or in connection with this Agreement, the Platform, or the Services, whether in contract, tort (including negligence), breach of statutory duty, or otherwise, shall in no circumstances exceed the total Fees actually paid by the relevant User to the Provider in the three (3) months immediately preceding the event giving rise to the claim.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-14" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              14. Suspension of Services
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                14.1 Magnificentech Solution Ltd trading as Trust Verify (the "Supplier") reserves the right to suspend, restrict, or disable access to any or all of the Services provided via the Platform, either temporarily or permanently, at its sole discretion, in the event that the User is in breach of these Terms of Business, or where such action is necessary to protect the integrity, security, or lawful operation of the Platform, the Services, or any third party.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                14.2 The Supplier may suspend the Services immediately and without prior notice in the following circumstances: where the Supplier reasonably suspects that the User has engaged in, or is likely to engage in, any fraudulent, unlawful, or unauthorised activity; where the User is in material or persistent breach of any provision of these Terms of Business; where suspension is required by law, regulation, court order, or at the request of any governmental or regulatory authority; or where the Supplier reasonably determines that continued provision of the Services would pose a security threat or risk.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-15" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              15. Termination
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                15.1 Either Magnificentech Solution Ltd trading as Trust Verify (the "Supplier") or any user of the Platform (the "User") may terminate this Agreement for convenience by providing not less than 30 days' prior written notice to the other party. Such notice shall be delivered in accordance with the notice provisions set out in this Agreement.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                15.2 The Supplier may terminate this Agreement or suspend the User's access to the Platform and Services immediately, without notice, in the event of: the User commits a material breach of any provision of this Agreement; the Supplier reasonably suspects that the User is engaged in fraudulent, unlawful, or unauthorised activity; the User fails to pay any fees or charges due within 7 days of the due date; it is required to do so by law, regulation, or order of a competent authority; or the Supplier determines, acting reasonably, that continued provision of the Services would pose a security threat or risk.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                15.3 Upon termination of this Agreement for any reason: the User shall immediately cease all use of the Platform and Services; all outstanding fees, charges, and other amounts due to the Supplier shall become immediately payable; the User shall, at the Supplier's option, return or permanently delete all Confidential Information and any materials provided by the Supplier; and the Supplier shall provide the User with limited data export and technical support for data migration for a period of 30 days following termination.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-16" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              16. Post-Termination Obligations and Transition Assistance
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                16.1 Upon termination or expiry of this Agreement, regardless of the reason for such termination or expiry, each party shall promptly fulfil all outstanding obligations accrued up to the effective date of termination, including but not limited to the payment of any outstanding fees due to Magnificentech Solution Ltd trading as Trust Verify Company No.: 16321180 (the "Supplier").
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                16.2 Within thirty (30) days following the effective date of termination, the user shall, at its own cost, return or, at the written direction of the Supplier, securely destroy all Confidential Information (as defined in this Agreement) belonging to the Supplier, including all copies, extracts, and summaries thereof, except to the extent that retention is required by applicable law or regulation.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                16.3 The Supplier shall, upon written request from the user received within thirty (30) days of termination, provide limited transition assistance to facilitate the orderly migration of the user's data from the Platform, including provision of a one-time data export in a standard, machine-readable format and technical support for data migration.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-17" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              17. Force Majeure
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                17.1 Neither Magnificentech Solution Ltd trading as Trust Verify (the "Supplier") nor any User (the "User") shall be liable for any failure or delay in performing any of its obligations under this Agreement, or for any loss or damage suffered by the other party, to the extent that such failure, delay, loss, or damage results from a Force Majeure Event.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                17.2 For the purposes of this Agreement, a Force Majeure Event means any event or circumstance beyond the reasonable control of the affected party, including but not limited to acts of God (such as natural disasters), war or terrorism, government action or regulation, pandemic or epidemic, labour disputes or strikes, or failure of third-party systems.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                17.3 If the Force Majeure Event continues for a period exceeding thirty (30) consecutive days, either party may, by written notice to the other, terminate this Agreement with immediate effect, without liability for such termination, save for any accrued rights or liabilities as at the date of termination.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-18" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              18. Notices
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                18.1 All notices, demands, or other formal communications required or permitted to be given under this Agreement shall be in writing and shall be delivered by one or more of the following methods: (a) by email; (b) by recorded or registered post; or (c) by in-platform notification, in each case in accordance with the provisions of this Clause 18.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                18.2 Any notice or other communication to be given to Magnificentech Solution Ltd trading as Trust Verify Company No.: 16321180 (the "Supplier") under this Agreement shall be deemed to have been duly given if sent to: By post: 18 Barn Close Willow Farm, Choppington, Northumberland, NE62 5EU. By email: legal@trustverify.online. By in-platform notification: via the user's account dashboard or designated notification centre within the Platform.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-19" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              19. Assignment and Subcontracting
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                19.1 Except as expressly permitted in this Clause 19, no user of the Platform (the "User") shall assign, transfer, charge, sub-contract, or otherwise dispose of any of its rights or obligations under this Agreement, in whole or in part, without the prior written consent of Magnificentech Solution Ltd trading as Trust Verify Company No.: 16321180 Date of Incorporation: 17 March 2025 (the "Provider").
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                19.2 The Provider may assign, transfer, charge, sub-contract, or otherwise dispose of any of its rights or obligations under this Agreement, in whole or in part, at any time and without the need for consent from the User. The Provider may engage any third party, affiliate, or subcontractor to perform any of its obligations under this Agreement, provided that the Provider shall remain responsible for the performance of such obligations.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-20" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              20. Variation of Agreement
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                20.1 Magnificentech Solution Ltd trading as Trust Verify Company No.: 16321180 (the "Supplier") reserves the right to amend, modify, or otherwise vary the terms of this Agreement at any time, subject to the procedures and limitations set out in this Clause 20. Any such variation shall be made in accordance with applicable law and best practice, and shall be notified to the user in accordance with Clause 18 (Notices).
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                20.2 The Supplier may unilaterally amend this Agreement, including but not limited to changes in service features, fees, payment terms, or legal compliance requirements, by providing not less than thirty (30) days' written notice to the user via the user's registered email address, in-platform notification, or other agreed method of communication.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                20.3 If the user does not accept any material variation to this Agreement, the user shall have the right to terminate this Agreement by providing written notice to the Supplier within thirty (30) days of receipt of the notice of variation.
              </p>
            </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-21" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              21. Entire Agreement
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                21.1 This Agreement, together with any documents expressly incorporated by reference, constitutes the entire agreement and understanding between Magnificentech Solution Ltd trading as Trust Verify Company No.: 16321180 Date of Incorporation: 17 March 2025 (the "Supplier") and each user of the Platform (the "User") in relation to the subject matter hereof, and supersedes and extinguishes all prior agreements, representations, warranties, arrangements, and understandings, whether written or oral, relating to such subject matter.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                21.2 Each party acknowledges and agrees that, in entering into this Agreement, it does not rely on, and shall have no remedy in respect of, any statement, representation, warranty, or understanding (whether negligently or innocently made) of any person (whether a party to this Agreement or not) other than as expressly set out in this Agreement.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                21.3 Nothing in this clause shall operate to limit or exclude any liability for fraud or fraudulent misrepresentation.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-22" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              22. Third Party Rights
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                22.1 For the avoidance of doubt, this Agreement is entered into solely between Magnificentech Solution Ltd trading as Trust Verify (the "Supplier") and the user of the Platform (the "User"), whether such User is an individual, company, sole trader, partnership, or other legal entity. No person or entity who is not a party to this Agreement shall have any right to enforce any term of this Agreement, whether under the Contracts (Rights of Third Parties) Act 1999 or otherwise.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                22.2 The parties expressly agree that, except as expressly provided in this Agreement, a person who is not a party to this Agreement shall not have any rights to enforce any of its terms. This exclusion applies regardless of whether such person or entity is identified by name, as a member of a class, or as answering a particular description.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-23" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              23. Governing Law and Jurisdiction
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                23.1 This Agreement, and any dispute or claim (including non-contractual disputes or claims) arising out of or in connection with it or its subject matter or formation, shall be governed by and construed in accordance with the laws of England and Wales. The parties agree that the choice of law is made to ensure certainty, predictability, and the application of a well-established legal framework suitable for international and domestic commercial transactions involving fintech and cybersecurity services.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                23.2 Subject to the provisions of Clause 23.3 and Clause 23.4, the parties irrevocably agree that the courts of England and Wales shall have exclusive jurisdiction to settle any dispute or claim (including non-contractual disputes or claims) arising out of or in connection with this Agreement, its subject matter, or formation.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                23.3 Prior to the commencement of any legal proceedings, the parties shall use all reasonable endeavours to resolve any dispute, controversy, or claim arising out of or in connection with this Agreement through good faith negotiations. In the event that such negotiations do not result in a resolution within fourteen (14) days of written notice of the dispute, the matter shall be escalated to senior management of each party for further discussion and attempted resolution within a further fourteen (14) days.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-24" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              24. Dispute Resolution and Mediation
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                24.1 In the event of any dispute, controversy, or claim arising out of or in connection with this Agreement, including any question regarding its existence, validity, or termination (a "Dispute"), the parties shall seek to resolve such Dispute promptly and in good faith in accordance with the procedures set out in this Clause 24.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                24.2 Either party may initiate the dispute resolution process by providing written notice of the Dispute to the other party, setting out reasonable details of the nature of the Dispute and the relief sought. Upon receipt of such notice, the parties shall use all reasonable endeavours to resolve the Dispute amicably through direct negotiation between their respective senior management representatives.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                24.3 If the Dispute is not resolved within fourteen (14) days of the date of the written notice referred to in Clause 24.2, either party may refer the Dispute to mediation in accordance with the Centre for Effective Dispute Resolution (CEDR) Model Mediation Procedure, or such other mediation procedure as may be agreed in writing between the parties.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-25" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              25. Complaints Policy and Procedure
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                25.1 Magnificentech Solution Ltd trading as Trust Verify (the "Supplier") is committed to maintaining the highest standards of service and transparency. This clause sets out the comprehensive policy and procedure for the handling, investigation, and resolution of complaints raised by any user of the Supplier's Platform (the "User").
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                25.2 The Supplier shall ensure that all complaints are addressed promptly, fairly, and in accordance with applicable laws and regulatory requirements. The Supplier's complaints procedure is designed to provide Users with a clear, accessible, and effective process for raising concerns regarding any aspect of the services provided under this Agreement.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                25.3 Users may submit complaints in writing via email to legal@trustverify.online or through any other communication channel expressly designated by the Supplier for this purpose. The complaint must include sufficient details to enable the Supplier to identify the User, the nature of the complaint, and any relevant supporting documentation.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                25.4 Upon receipt of a complaint, the Supplier shall acknowledge receipt within two (2) Business Days, confirming that the complaint has been received and providing an outline of the next steps in the process.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                25.5 The Supplier shall conduct a thorough and impartial investigation of the complaint, taking into account all relevant information and evidence provided by the User and any other parties involved. The Supplier shall endeavour to provide a substantive written response to the User within ten (10) Business Days of acknowledging receipt of the complaint.
              </p>
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
              {tableOfContents.map((item, index) => {
                const isSelected = selectedItem === item.id;
                const shouldHighlight = isSelected || (index === 0 && selectedItem === null);
                return (
                  <a
                    key={index}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleTocClick(item.id);
                    }}
                    className={`[font-family:'DM_Sans_18pt-Regular',Helvetica] text-base tracking-[0] cursor-pointer hover:text-[#003d2b] transition-colors no-underline ${
                      item.indent ? "leading-8 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium" : "leading-[27.2px]"
                    } ${
                      shouldHighlight 
                        ? "text-[#003d2b]" 
                        : "text-[#808080]"
                    } ${
                      index === 0 && shouldHighlight
                        ? "[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium"
                        : ""
                    }`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    {item.indent && "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
                    {item.title}
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
      <Footer/>
    </main>
  );
};
