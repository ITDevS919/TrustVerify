import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Card, CardContent } from "../../components/ui/card";
import React, { useState } from "react";

const metaData = [
  { label: "Effective Date:", value: "October 15, 2025" },
  { label: "Last Updated:", value: "October 15, 2025" },
];

const jurisdictionData = [
  {
    label: "Data Controller:",
    value: "Magnificentech Solution Ltd trading as TrustVerify (Company No.: 16321180)",
  },
  { label: "Jurisdiction:", value: "United Kingdom" },
];

const cookieCategories = [
  "Strictly Necessary Cookies: Essential for platform operation, authentication, and security",
  "Performance/Analytics Cookies: Collect usage data to improve platform performance",
  "Functionality Cookies: Remember user preferences and enable enhanced features",
  "Targeting/Advertising Cookies: Deliver relevant advertisements and measure campaign effectiveness",
  "Third Party Cookies: Set by external service providers for analytics, advertising, or integration",
];

const strictlyNecessaryCookies = [
  {
    name: "Session ID Cookie",
    purpose: "User authentication, session management",
    thirdParty: "No",
    retention: "Session",
    consent: "Not required",
    appliesTo: "All users",
  },
  {
    name: "Security Token Cookie",
    purpose: "Prevent fraud, secure log-in",
    thirdParty: "No",
    retention: "Session/30 days",
    consent: "Not required",
    appliesTo: "All users",
  },
  {
    name: "Trust Scoring Cookie",
    purpose: "Calculate and display trust scores",
    thirdParty: "No",
    retention: "Session/30 days",
    consent: "Not required",
    appliesTo: "Registered users, API users",
  },
  {
    name: "API Usage Auth Cookie",
    purpose: "Authenticate API requests, prevent abuse",
    thirdParty: "No",
    retention: "Session/30 days",
    consent: "Not required",
    appliesTo: "API developers",
  },
];

const thirdPartyIntegrations = [
  {
    integration: "Google Analytics",
    purpose: "Usage analytics",
    dataShared: "IP address, usage data",
    legalBasis: "Legitimate interests",
    appliesTo: "All users",
  },
  {
    integration: "Sentry",
    purpose: "Error tracking",
    dataShared: "Error logs, device info",
    legalBasis: "Legitimate interests",
    appliesTo: "All users",
  },
  {
    integration: "Facebook Pixel/Google Ads",
    purpose: "Advertising/retargeting",
    dataShared: "Cookie ID, browsing data",
    legalBasis: "Consent (where required)",
    appliesTo: "All users",
  },
  {
    integration: "API Developer Portal",
    purpose: "API usage monitoring",
    dataShared: "API keys, usage logs",
    legalBasis: "Legitimate interests",
    appliesTo: "API developers",
  },
];

const contactData = [
  { label: "Dedicated privacy email:", value: "michael.omotayo@magnificentechsolution.co.uk" },
  { label: "Data Protection Officer:", value: "Michael Omotayo (registration reference: ZB962144)" },
  { label: "DPO job title:", value: "Director" },
];

const tableOfContents = [
  { title: "1. Purpose and Scope", indent: false, id: "section-1" },
  { title: "2. Definitions", indent: false, id: "section-2" },
  { title: "3. Types of Cookies Used", indent: false, id: "section-3" },
  { title: "4. Profiling, Fraud Detection, and Trust Scoring", indent: false, id: "section-4" },
  { title: "5. Platforms and Users Covered", indent: false, id: "section-5" },
  { title: "6. Legal Basis for Cookie Use", indent: false, id: "section-6" },
  { title: "7. Cookie Consent and User Preferences", indent: false, id: "section-7" },
  { title: "8. Categories of Cookies and Examples", indent: false, id: "section-8" },
  { title: "9. Cookie Retention Periods", indent: false, id: "section-9" },
  { title: "10. Managing Cookies and User Controls", indent: false, id: "section-10" },
  { title: "11. Third-Party Cookies", indent: false, id: "section-11" },
  { title: "12. Cookie Security and Breach Procedures", indent: false, id: "section-12" },
  { title: "13. User Rights and How to Exercise Them", indent: false, id: "section-13" },
  { title: "14. Roles and Responsibilities", indent: false, id: "section-14" },
  { title: "15. Policy Review and Updates", indent: false, id: "section-15" },
  { title: "16. Notification of Changes", indent: false, id: "section-16" },
  { title: "17. Contact Information", indent: false, id: "section-17" },
];

export const CookiePolicy = (): JSX.Element => {
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
          title: "Cookie Policy",
          description: "This Cookie Policy sets out the principles, obligations, and procedures adopted by TrustVerify regarding the use of cookies and similar technologies on its digital platforms.",
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
          <div id="section-1" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              1. Purpose and Scope
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
                1.1 This Cookie Policy sets out the principles, obligations, and procedures adopted by Magnificentech Solution Ltd trading as TrustVerify (Company No.: 16321180) regarding the use of cookies and similar technologies on its digital platforms, including the main website (trustverify.online), web application, mobile application (iOS/Android), and API platform/developer portal.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                1.2 The purpose of this Policy is to provide clear, transparent information to all users—including website visitors, registered customers and clients, developers and API users, mobile app users, and employees about how cookies are used, the types of cookies deployed, the purposes for which they are set, and the choices available to users regarding cookie management and consent.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                1.3 TrustVerify is a fintech and cybersecurity SaaS provider focused on fraud prevention and compliance tools. As part of its commitment to data protection and privacy, TrustVerify ensures that the use of cookies is compliant with the UK General Data Protection Regulation (UK GDPR), the Privacy and Electronic Communications Regulations (PECR), and other applicable laws and regulatory guidance.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-2" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              2. Definitions
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                2.1 For the purposes of this Cookie Policy, the following definitions apply:
              </p>
              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                <span className="font-semibold text-[#003d2b]">Cookie</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]"> means a small text file that is placed on a user's device by a website, application, or online service, enabling the platform to recognise the device, store preferences, and collect information about user interactions.</span>
              </div>
              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                <span className="font-semibold text-[#003d2b]">Strictly Necessary Cookies</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]"> means cookies that are essential for the operation of the platform, enabling core functions such as security, network management, and accessibility. These cookies cannot be disabled through user preferences.</span>
              </div>
              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                <span className="font-semibold text-[#003d2b]">Performance/Analytics Cookies</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]"> means cookies used to collect information about how users interact with the platform, including pages visited, time spent, and error messages. These cookies help improve the performance and functionality of the platform.</span>
              </div>
              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                <span className="font-semibold text-[#003d2b]">Functionality Cookies</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]"> means cookies that enable the platform to remember user choices and preferences, such as language, region, or customised settings, to provide enhanced and personalised features.</span>
              </div>
              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                <span className="font-semibold text-[#003d2b]">Targeting/Advertising Cookies</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]"> means cookies used to deliver relevant advertisements to users, track the effectiveness of advertising campaigns, and build user profiles based on browsing behaviour across websites and applications.</span>
              </div>
              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                <span className="font-semibold text-[#003d2b]">Third Party Cookies</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]"> means cookies set by domains other than TrustVerify's own domain, typically by external service providers, partners, or advertisers, to enable additional functionality or analytics.</span>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-3" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              3. Types of Cookies Used
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                3.1 TrustVerify uses a variety of cookies and similar technologies across its digital platforms, including the main website, web application, mobile application, and API/developer portal. The following categories of cookies may be deployed, each serving distinct purposes to ensure the secure, efficient, and user-friendly operation of our services.
              </p>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                {cookieCategories.map((item, index) => (
                  <React.Fragment key={index}>
                    {item}
                    {index < cookieCategories.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                3.2 Strictly Necessary Cookies are essential for the operation of our platforms. These cookies enable core functionalities such as user authentication, secure log-in, session management, fraud prevention, and access to protected areas. Without these cookies, our services cannot function properly. They are typically set in response to actions made by users, such as logging in or completing forms, and do not require user consent under applicable law.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-4" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              4. Profiling, Fraud Detection, and Trust Scoring
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                4.1 TrustVerify uses certain cookies and similar technologies to perform profiling for the purposes of fraud detection and trust score generation. Profiling involves the automated processing of personal data (such as behavioural, transactional, and device data) to assess the likelihood of fraudulent activity and to generate a trust score for users. This process is essential for the security and integrity of the platform and is based on TrustVerify's legitimate interests (UK GDPR Article 6(1)(f)).
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                4.2 The data processed may include login patterns, device identifiers, transaction history, and usage analytics. The outcome of this profiling may affect access to certain services or trigger additional verification steps. Users have the right to object to profiling and automated decision-making under GDPR Articles 21 and 22, as detailed in the "User Rights and How to Exercise Them" section of this Policy.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-5" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              5. Platforms and Users Covered
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                5.1 This Cookie Policy applies to all digital platforms operated by Magnificentech Solution Ltd trading as TrustVerify, including the main website (trustverify.online), web application (user dashboards and SaaS portal), mobile application (iOS/Android), and the API platform or developer portal. The Policy governs the use of cookies and similar technologies across these platforms, regardless of the device or method of access.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                5.2 The Policy covers all categories of users who may interact with TrustVerify's digital platforms, including:
              </p>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                • Website visitors accessing public or informational pages.<br />
                • Registered customers and clients using the web application, SaaS portal, or mobile app for identity verification, trust scoring, escrow, or related services.<br />
                • Developers and API users accessing the developer portal, API documentation, or integrating with TrustVerify's services.<br />
                • Mobile app users engaging with TrustVerify's services via iOS or Android applications.<br />
                • Employees and staff who access internal or restricted areas of the platforms for operational, administrative, or support purposes.
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-6" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              6. Legal Basis for Cookie Use
            </p>
            <div className="flex flex-col items-start gap-6 w-full">
              <div className="w-full bg-[#2885ff24] rounded-2xl p-7">
                <div className="flex flex-col items-start gap-2.5">
                  <div className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#2785ff] text-xl sm:text-[22px] tracking-[-0.20px] leading-7">
                    UK GDPR Compliance
                  </div>
                  <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#2785ff] text-base sm:text-lg tracking-[-0.20px] leading-7">
                    We process data under legitimate interests for cookie use
                  </div>
                </div>
              </div>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                6.1 The use of cookies and similar technologies on the digital platforms of Magnificentech Solution Ltd trading as TrustVerify is governed by applicable data protection and privacy laws, including the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and the Privacy and Electronic Communications Regulations (PECR).
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                6.2 TrustVerify processes personal data collected via cookies on the basis of legitimate interests, as permitted under Article 6(1)(f) of the UK GDPR, except where consent is required by law. The company's legitimate interests include ensuring the security and functionality of its platforms, improving user experience, monitoring performance, and supporting business operations such as fraud prevention and compliance monitoring.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-7" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              7. Cookie Consent and User Preferences
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                7.1 This section sets out the principles, procedures, and user rights relating to the use of cookies and similar technologies on the digital platforms operated by Magnificentech Solution Ltd trading as TrustVerify (Company No.: 16321180) ("TrustVerify"). The purpose is to ensure transparency, user choice, and compliance with applicable UK data protection and privacy laws, including the UK General Data Protection Regulation (UK GDPR) and the Privacy and Electronic Communications Regulations (PECR).
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                7.2 Users are notified of cookie use via a cookie notice in the website footer, a link to the Cookie Policy in the navigation menu, and a cookie settings or preferences panel. By continuing to use TrustVerify's platforms, users provide implied consent to the use of cookies, except where explicit consent is required by law.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                7.3 Users can manage or change their cookie preferences at any time via the cookie settings panel, except for strictly necessary cookies which are required for platform functionality. Options are provided to enable or disable Performance/Analytics, Functionality, Targeting/Advertising, and Third Party Cookies.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-8" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              8. Categories of Cookies and Examples
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                8.1 TrustVerify uses a range of cookies and similar technologies across its digital platforms, including the main website, web application, mobile application, and API developer portal. These cookies are categorised according to their function, source, and duration, and are used to support the secure, efficient, and user-friendly operation of our services.
              </p>
              <div className="w-full bg-[#f3f3f3] rounded-2xl p-7">
                <div className="flex flex-col items-start gap-4">
                  <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#003d2b] text-[22px] tracking-[-0.20px] leading-7">
                    Strictly Necessary Cookies
                  </p>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-[#e4e4e4]">
                          <th className="text-left p-2 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">Cookie Name/Type</th>
                          <th className="text-left p-2 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">Purpose</th>
                          <th className="text-left p-2 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">Third Party</th>
                          <th className="text-left p-2 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">Retention</th>
                          <th className="text-left p-2 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">Applies To</th>
                        </tr>
                      </thead>
                      <tbody>
                        {strictlyNecessaryCookies.map((cookie, index) => (
                          <tr key={index} className="border-b border-[#e4e4e4]">
                            <td className="p-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm">{cookie.name}</td>
                            <td className="p-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">{cookie.purpose}</td>
                            <td className="p-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">{cookie.thirdParty}</td>
                            <td className="p-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">{cookie.retention}</td>
                            <td className="p-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">{cookie.appliesTo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-9" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              9. Cookie Retention Periods
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                9.1 TrustVerify is committed to ensuring that all cookies set on its digital platforms are retained only for as long as necessary to fulfil their intended purposes, in accordance with applicable data protection laws, including the UK General Data Protection Regulation (UK GDPR) and the Privacy and Electronic Communications Regulations (PECR).
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                9.2 The following principles apply to cookie retention:
              </p>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                a. Strictly Necessary Cookies are typically session-based and expire automatically when the user closes their browser or logs out. In some cases, persistent strictly necessary cookies may be retained for up to 30 days to support essential security or authentication functions.<br />
                b. Performance/Analytics Cookies, such as those used for website analytics (e.g., Google Analytics), are retained for a maximum of 30 days unless a shorter period is required for specific analytics or error tracking purposes.<br />
                c. Functionality Cookies, which store user preferences or enhance platform features (e.g., language selection, chatbots, feedback widgets), are retained for up to 30 days unless the user deletes them sooner or changes their preferences via the cookie settings panel.<br />
                d. Targeting/Advertising Cookies, including those set by third-party providers (e.g., Facebook Pixel, Google Ads), are retained for a maximum of 30 days.<br />
                e. Third Party Cookies, set by external domains integrated with TrustVerify's platforms, are subject to the retention periods specified by the respective third parties. TrustVerify endeavours to ensure that such cookies do not exceed a 30-day retention period.
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-10" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              10. Managing Cookies and User Controls
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                10.1 TrustVerify is committed to ensuring transparency and user control in relation to the use of cookies and similar technologies across all digital platforms, including the main website (trustverify.online), web application, mobile application, and API/developer portal. This section sets out the procedures, user rights, and technical measures in place for managing cookies in accordance with the UK General Data Protection Regulation (UK GDPR), the Privacy and Electronic Communications Regulations (PECR), and other applicable laws.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                10.2 Users may manage or change their cookie preferences for all non-essential cookie categories (performance/analytics, functionality, targeting/advertising, and third-party cookies) via the cookie settings panel. Strictly necessary cookies are required for the operation of the platforms and cannot be disabled.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-11" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              11. Third-Party Cookies
            </p>
            <div className="flex flex-col items-start gap-6 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                11.1 Third-Party Cookies are cookies set by domains other than TrustVerify's own digital platforms. These cookies are placed by external service providers and partners to enable additional functionality, analytics, advertising, or integration with third-party services. TrustVerify uses third-party cookies on its Main Website, Web Application, Mobile Application, and API Platform/Developer Portal to support the delivery and enhancement of its fintech and cybersecurity SaaS services.
              </p>
              <div className="w-full bg-[#f3f3f3] rounded-2xl p-7">
                <div className="flex flex-col items-start gap-4">
                  <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#003d2b] text-[22px] tracking-[-0.20px] leading-7">
                    Third-Party Integrations
                  </p>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-[#e4e4e4]">
                          <th className="text-left p-2 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">Integration/Third Party</th>
                          <th className="text-left p-2 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">Purpose</th>
                          <th className="text-left p-2 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">Data Shared</th>
                          <th className="text-left p-2 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">Legal Basis</th>
                          <th className="text-left p-2 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">Applies To</th>
                        </tr>
                      </thead>
                      <tbody>
                        {thirdPartyIntegrations.map((integration, index) => (
                          <tr key={index} className="border-b border-[#e4e4e4]">
                            <td className="p-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm">{integration.integration}</td>
                            <td className="p-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">{integration.purpose}</td>
                            <td className="p-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">{integration.dataShared}</td>
                            <td className="p-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">{integration.legalBasis}</td>
                            <td className="p-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">{integration.appliesTo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-12" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              12. Cookie Security and Breach Procedures
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                12.1 We, Magnificentech Solution Ltd trading as TrustVerify, are committed to maintaining the security and integrity of all cookies and similar technologies used across our digital platforms, including the main website, web application, mobile application, and API platform. This section sets out the procedures and controls in place to safeguard cookies, detect and respond to cookie-related security incidents, and ensure compliance with applicable data protection laws.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                12.2 All cookies, whether strictly necessary, performance, functionality, targeting/advertising, or third-party, are subject to robust technical and organisational security measures. These include encryption of cookie data in transit and, where applicable, at rest, implementation of secure cookie attributes (e.g., HttpOnly, Secure, SameSite), regular review and minimisation of cookie lifespans, and access controls and authentication requirements for any systems or personnel managing cookie settings.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-13" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              13. User Rights and How to Exercise Them
            </p>
            <div className="flex flex-col items-start gap-6 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                13.1 Individuals whose personal data is processed through the use of cookies on TrustVerify's digital platforms are entitled to exercise a range of rights under the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and the Privacy and Electronic Communications Regulations (PECR). These rights apply to all users, including website visitors, registered customers, developers, mobile app users, and employees.
              </p>
              <div className="w-full bg-[#f3f3f3] rounded-2xl p-7">
                <div className="flex flex-col items-start gap-2.5">
                  <div className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#003d2b] text-[22px] tracking-[-0.20px] leading-7">
                    Available Rights
                  </div>
                  <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg tracking-[-0.20px] leading-7">
                    Users have the right to: access, rectify, erase, restrict processing, object to processing, withdraw consent, data portability, and lodge complaints with supervisory authorities. Users also have the right to object to profiling and automated decision-making under GDPR Articles 21 and 22.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-14" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              14. Roles and Responsibilities
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                14.1 The following roles and responsibilities apply to the management, implementation, and oversight of the TrustVerify Cookie Policy across all digital platforms, including the main website, web application, mobile application, and API platform.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                14.2 The Data Protection Officer (DPO) is responsible for overseeing compliance with all applicable data protection and privacy laws relating to the use of cookies, including the UK GDPR and PECR, reviewing and approving the Cookie Policy, responding to user queries and requests, and coordinating internal investigations in the event of a cookie-related security or compliance breach.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                14.3 The Marketing/Communications team is responsible for ensuring that all cookie notices, banners, and preference panels are clear, accessible, and compliant with the Cookie Policy and applicable law.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                14.4 Senior Management is responsible for approving the Cookie Policy and ensuring that adequate resources are allocated for its effective implementation and review.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-15" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              15. Policy Review and Updates
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                15.1 This Cookie Policy is subject to regular review to ensure ongoing compliance with applicable data protection laws, regulatory requirements, and industry best practices relevant to the operations of Magnificentech Solution Ltd trading as TrustVerify.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                15.2 The policy shall be reviewed at least annually by the Data Protection Officer (DPO), Marketing/Communications, and Senior Management, or more frequently if required by changes in law, regulatory guidance, business operations, or identified risks.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-16" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              16. Notification of Changes
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                16.1 We, Magnificentech Solution Ltd trading as TrustVerify, are committed to maintaining transparency and compliance in relation to the use of cookies and similar technologies on all our digital platforms. This section sets out our procedures and obligations for notifying users of any changes to this Cookie Policy or our cookie practices.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                16.2 Where material changes are made to the Cookie Policy or our use of cookies, we will provide clear and timely notification to users through one or more of the following methods: direct email notification to registered users, in-app notifications on the web application, mobile application, or developer portal, a prominent website banner or notification, and the update date will be clearly displayed at the top of the Cookie Policy page.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-17" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              17. Contact Information
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                17.1 For all queries, requests, or concerns relating to the use of cookies on the digital platforms operated by Magnificentech Solution Ltd trading as TrustVerify, individuals are encouraged to contact the company's designated privacy contact or Data Protection Officer (DPO). The contact details for cookie-related matters are as follows:
              </p>
              <div className="flex flex-col items-start gap-4 w-full">
                {contactData.map((item, index) => (
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
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                17.2 All cookie-related enquiries will be acknowledged within five (5) working days. A substantive response will be provided within one (1) month of receipt, or the individual will be informed if additional time is required due to the complexity of the request.
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

