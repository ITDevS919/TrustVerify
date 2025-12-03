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

const personalDataTypes = [
  "Names, including first name, last name, and, where applicable, previous names",
  "Contact details, such as postal address, email address, telephone number, and other communication details",
  "Identification data, including date of birth, national identification numbers, passport or driving licence details, and other government-issued identifiers",
  "Technical data, such as IP address, device identifiers, browser type and version, operating system, and other technology on the devices used to access TrustVerify's services",
  "Usage data, including information about how individuals interact with TrustVerify's website, applications, and services, such as access logs, activity records, and user preferences",
  "Financial data, such as bank account details, payment card information, transaction records, and other financial information necessary for the provision of services or employment",
  "Employment data, including job titles, employment history, qualifications, references, and other information relevant to employment or engagement with TrustVerify",
  "Special category data, where necessary and permitted by law, such as information relating to health, biometric data, racial or ethnic origin, or criminal convictions, processed in accordance with applicable legal justifications",
];

const lawfulBasisItems = [
  {
    label: "Consent:",
    value: "Where required, we obtain the clear and informed consent of individuals before processing their personal data for specific purposes. Individuals have the right to withdraw their consent at any time.",
  },
  {
    label: "Contract:",
    value: "Processing is necessary for the performance of a contract to which the individual is a party, or to take steps at the request of the individual prior to entering into a contract.",
  },
  {
    label: "Legal Obligation:",
    value: "Processing is necessary for compliance with a legal obligation to which TrustVerify is subject, including obligations under anti-money laundering, fraud prevention, employment, tax, and regulatory laws.",
  },
  {
    label: "Legitimate Interests:",
    value: "Processing is necessary for the purposes of the legitimate interests pursued by TrustVerify or a third party, such as ensuring the security of our systems, preventing fraud, supporting business operations, and improving our services.",
  },
  {
    label: "Vital Interests:",
    value: "Processing is necessary to protect the vital interests of the individual or another person, such as in emergency situations where health or safety is at risk.",
  },
  {
    label: "Public Task:",
    value: "Processing is necessary for the performance of a task carried out in the public interest or in the exercise of official authority vested in TrustVerify, where applicable.",
  },
];

const processingPurposes = [
  "Service Provision: To deliver, manage, and improve our fintech and cybersecurity SaaS solutions, including fraud prevention and compliance tools, to clients and users",
  "Communication: To communicate with clients, users, employees, and third parties regarding service updates, account management, technical support, and other relevant matters",
  "Marketing: To inform individuals about new products, services, features, or events, subject to applicable consent requirements and opt-out mechanisms",
  "Analytics: To analyse usage patterns, system performance, and user engagement to enhance our services, ensure system integrity, and support business development",
  "Legal Compliance: To comply with legal and regulatory obligations, including anti-money laundering (AML), counter-terrorist financing (CTF), and other statutory requirements relevant to our business activities",
  "Customer Support: To provide assistance, resolve queries, and address complaints or technical issues raised by clients, users, or other stakeholders",
  "Fraud Prevention and Detection: To identify, investigate, and prevent fraudulent activities, unauthorised access, and other security threats, using advanced monitoring and detection tools",
  "Employee Administration: To manage employment relationships, including recruitment, payroll, performance management, training, and compliance with employment laws",
  "Automated Decision-Making and Profiling: To the extent permitted by law and only where necessary, to support service delivery and risk management, ensuring that no automated decisions with legal or similarly significant effects are made without appropriate safeguards",
];

const dataSharingCategories = [
  "Professional advisers, such as legal, regulatory, or financial consultants, where required for compliance, legal claims, or business operations",
  "Service providers and suppliers who process data on our behalf under written contracts that require them to implement appropriate security measures and act only on our instructions",
  "Regulatory authorities, law enforcement agencies, or other public bodies where required by law, regulation, or to protect the rights, property, or safety of TrustVerify, its clients, or others",
  "Other third parties where disclosure is necessary to fulfil contractual obligations, with the individual's consent, or as otherwise permitted by law",
  "Technology partners, analytics providers, and fraud prevention networks for the purposes of service delivery, fraud detection, and analytics",
  "Developer and API users, where integration or data exchange is required for service functionality, subject to contractual and security obligations",
];

const retentionSchedule = [
  { category: "Trust scoring/profiling data", period: "5 years from last activity" },
  { category: "API credentials", period: "12 months after account closure" },
  { category: "Fraud detection logs", period: "7 years" },
  { category: "Customer account data", period: "6 years after closure" },
  { category: "Regulatory correspondence", period: "As required by law" },
];

const individualRights = [
  { label: "Right of Access:", value: "Individuals have the right to request confirmation as to whether their personal data is being processed, and, where that is the case, to access such personal data and receive information regarding its processing." },
  { label: "Right to Rectification:", value: "Individuals may request the correction of inaccurate or incomplete personal data held by TrustVerify." },
  { label: "Right to Erasure:", value: "Also known as the 'right to be forgotten', individuals may request the deletion of their personal data where there is no lawful basis for its continued processing." },
  { label: "Right to Restrict Processing:", value: "Individuals may request the restriction or suspension of processing of their personal data in certain circumstances, such as where the accuracy of the data is contested or the processing is unlawful." },
  { label: "Right to Data Portability:", value: "Where processing is based on consent or contract and carried out by automated means, individuals may request to receive their personal data in a structured, commonly used, and machine-readable format, and to have that data transmitted to another controller where technically feasible." },
  { label: "Right to Object:", value: "Individuals may object to the processing of their personal data where processing is based on legitimate interests or for direct marketing purposes." },
  { label: "Right to Withdraw Consent:", value: "Where processing is based on consent, individuals have the right to withdraw their consent at any time, without affecting the lawfulness of processing carried out prior to withdrawal." },
];

const securityMeasures = [
  "All personal data is encrypted both in transit and at rest using industry-standard encryption protocols to prevent unauthorised access or disclosure",
  "Access to personal data is strictly controlled through robust access controls, including role-based permissions and multi-factor authentication, ensuring that only authorised personnel can access sensitive information",
  "Regular staff training is conducted to ensure all employees and contractors are aware of their data protection responsibilities and are equipped to identify and respond to potential security threats",
  "Comprehensive physical security measures are in place at all locations where personal data is processed or stored, including secure entry systems, surveillance, and restricted access to sensitive areas",
  "Regular security audits and vulnerability assessments are carried out to identify, assess, and address potential risks to data security, with findings reported to senior management and actioned promptly",
  "All systems and applications used for processing personal data are subject to ongoing monitoring, patch management, and security updates to mitigate emerging threats and vulnerabilities",
  "Incident response procedures are established to ensure prompt detection, investigation, and mitigation of any actual or suspected data breaches, including notification to affected individuals and relevant authorities where required by law",
  "Data minimisation principles are applied to ensure that only the minimum necessary personal data is collected, processed, and retained, reducing the risk of unauthorised access or loss",
  "Secure disposal procedures are implemented for all personal data that is no longer required, including secure deletion of electronic records and destruction of physical documents, in accordance with applicable legal and regulatory requirements",
  "All third-party service providers and partners with access to personal data are subject to rigorous due diligence and contractual obligations to maintain equivalent data security standards",
];

const contactDPO = [
  { label: "Name:", value: "Michael Omotayo (registration reference: ZB962144)" },
  { label: "Role:", value: "Director" },
  { label: "Email:", value: "michael.omotayo@magnificentechsolution.co.uk" },
];

const relatedPolicies = [
  "Data Protection Policy – Outlines the company's overarching approach to compliance with the UK GDPR, Data Protection Act 2018, and other applicable data protection laws",
  "Information Security Policy – Details the technical and organisational measures implemented to safeguard personal data, including encryption, access controls, and incident response protocols",
  "Employee Confidentiality Policy – Sets out the obligations of employees and contractors regarding the handling, protection, and non-disclosure of confidential and personal information",
  "Data Retention and Disposal Policy – Specifies the criteria and procedures for retaining, securely deleting, anonymising, or destroying personal data in accordance with legal and regulatory requirements",
  "Subject Access Request (SAR) Procedure – Provides guidance for individuals and staff on how to submit, process, and respond to requests for access to personal data",
  "Breach Notification Policy – Describes the process for identifying, reporting, investigating, and notifying relevant authorities and affected individuals in the event of a personal data breach",
  "Cookie Policy – Explains the use of cookies and similar technologies on TrustVerify's digital platforms, including user choices and consent mechanisms",
  "IT Acceptable Use Policy – Sets out the standards for the appropriate use of company IT systems, devices, and networks to protect data integrity and security",
  "Training and Awareness Policy – Details the mandatory data protection and cybersecurity training requirements for all staff, including frequency and content",
];

const tableOfContents = [
  { title: "1. Introduction", indent: false, id: "section-1" },
  { title: "2. Scope and Applicability", indent: false, id: "section-2" },
  { title: "3. Definitions", indent: false, id: "section-3" },
  { title: "4. Types of Personal Data Collected", indent: false, id: "section-4" },
  { title: "5. Methods of Data Collection", indent: false, id: "section-5" },
  { title: "6. Lawful Bases for Processing Personal Data", indent: false, id: "section-6" },
  { title: "7. Processing of Special Category Data", indent: false, id: "section-7" },
  { title: "8. Purposes of Data Processing", indent: false, id: "section-8" },
  { title: "9. Trust Scoring, Profiling, and Automated Decision-Making", indent: false, id: "section-9" },
  { title: "10. Data Sharing and Disclosure", indent: false, id: "section-10" },
  { title: "11. International Data Transfers", indent: false, id: "section-11" },
  { title: "12. Data Retention and Disposal", indent: false, id: "section-12" },
  { title: "13. Data Security Measures", indent: false, id: "section-13" },
  { title: "14. Individual Rights", indent: false, id: "section-14" },
  { title: "15. Exercising Data Protection Rights", indent: false, id: "section-15" },
  { title: "16. Data Protection Officer and Contact Details", indent: false, id: "section-16" },
  { title: "17. Complaints and Enquiries Procedure", indent: false, id: "section-17" },
  { title: "18. Policy Review and Updates", indent: false, id: "section-18" },
  { title: "19. Internal Monitoring and Audits", indent: false, id: "section-19" },
  { title: "20. Related Policies and References", indent: false, id: "section-20" },
  { title: "21. Additional Provisions", indent: false, id: "section-21" },
];

export const PrivacyPolicy = (): JSX.Element => {
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
          title: "Privacy Policy",
          description: "This Privacy Policy sets out the principles and procedures adopted by TrustVerify in relation to the collection, use, storage, sharing, and protection of personal data in accordance with UK GDPR and applicable data protection laws.",
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
              1. Introduction
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
                1.1 This Privacy Policy sets out the principles and procedures adopted by Magnificentech Solution Ltd trading as TrustVerify (Company No.: 16321180) in relation to the collection, use, storage, sharing, and protection of personal data. TrustVerify is a fintech and cybersecurity SaaS provider, committed to the highest standards of data protection and privacy compliance in accordance with applicable laws and regulations in the United Kingdom, the European Economic Area, and internationally.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                1.2 The purpose of this policy is to provide clear and transparent information to customers, clients, website visitors, employees, and third parties regarding how TrustVerify processes personal data, the rights of individuals, and the measures in place to safeguard such data.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                1.3 TrustVerify recognises the importance of privacy and is dedicated to ensuring that all personal data is handled lawfully, fairly, and transparently. This policy is designed to support compliance with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, the EU GDPR (where applicable), and other relevant data protection laws.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-2" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              2. Scope and Applicability
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                2.1 This Privacy Policy applies to all personal data processed by Magnificentech Solution Ltd trading as TrustVerify (Company No.: 16321180) in connection with its fintech and cybersecurity SaaS activities, including fraud prevention and compliance tools.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                2.2 The Policy covers the collection, use, storage, sharing, and disposal of personal data relating to the following categories of individuals:
              </p>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                • Customers and clients who use TrustVerify's services and products.<br />
                • Visitors to TrustVerify's websites, platforms, and digital services.<br />
                • Employees, workers, contractors, and job applicants.<br />
                • Third parties, including suppliers, partners, and service providers, where personal data is processed in the course of business operations.
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-3" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              3. Definitions
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                3.1 For the purposes of this Privacy Policy, the following terms shall have the meanings set out below:
              </p>
              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                <span className="font-semibold text-[#003d2b]">Personal Data</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]"> means any information relating to an identified or identifiable natural person, including but not limited to names, contact details, identification data, technical data, usage data, financial data, employment data, and special category data.</span>
              </div>
              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                <span className="font-semibold text-[#003d2b]">Special Category Data</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]"> means personal data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, trade union membership, genetic data, biometric data for the purpose of uniquely identifying a natural person, data concerning health, or data concerning a natural person's sex life or sexual orientation.</span>
              </div>
              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                <span className="font-semibold text-[#003d2b]">Processing</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]"> means any operation or set of operations performed on personal data, whether or not by automated means, such as collection, recording, organisation, structuring, storage, adaptation, alteration, retrieval, consultation, use, disclosure by transmission, dissemination, alignment, combination, restriction, erasure, or destruction.</span>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-4" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              4. Types of Personal Data Collected
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                4.1 In the course of its operations, Magnificentech Solution Ltd trading as TrustVerify collects and processes a range of personal data relating to individuals, including but not limited to customers, clients, website visitors, employees, and third parties. The categories of personal data collected are determined by the nature of the relationship with the individual and the specific services provided.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                4.2 The types of personal data collected may include the following:
              </p>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                {personalDataTypes.map((item, index) => (
                  <React.Fragment key={index}>
                    • {item}
                    {index < personalDataTypes.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-5" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              5. Methods of Data Collection
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                5.1 TrustVerify collects personal data through a variety of methods to ensure the effective delivery of its fintech and cybersecurity SaaS services, compliance with legal obligations, and the protection of individuals' rights.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                5.2 Cookies and similar technologies are used not only for website functionality and analytics, but also for security and fraud detection purposes (e.g., identifying suspicious activity, preventing unauthorised access). Where required by law, consent is obtained for the use of non-essential cookies, and users are informed of the specific purposes for which cookies are used.
              </p>
              <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                Direct Collection from Individuals:
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                Personal data is collected directly from individuals when they interact with TrustVerify, including but not limited to: completing online registration forms, account creation, or onboarding processes; submitting identification or verification documents as part of fraud prevention or compliance checks; communicating with TrustVerify via email, telephone, live chat, or other communication channels; participating in surveys, feedback requests, or customer support interactions.
              </p>
              <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                Automated Technologies and Interactions:
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                Data is automatically collected through the use of cookies, web beacons, tracking pixels, and similar technologies when individuals visit TrustVerify's websites, use its applications, or interact with its digital platforms. This includes collecting technical data such as IP addresses, browser types, device identifiers, operating systems, and access times; monitoring usage data, including navigation patterns, page views, and interaction logs to enhance security, detect fraud, and improve user experience; deploying analytics tools to gather statistical information for service optimisation and compliance monitoring.
              </p>
              <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                Third-Party Sources:
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                TrustVerify may obtain personal data from third-party sources, including business partners, financial institutions, or service providers involved in the delivery of TrustVerify's services; publicly available registers, databases, or social media platforms for verification and due diligence purposes; regulatory authorities, law enforcement agencies, or other entities as required for legal compliance, fraud prevention, or risk management.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-6" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              6. Lawful Bases for Processing Personal Data
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
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                6.1 Magnificentech Solution Ltd trading as TrustVerify processes personal data only where there is a valid legal basis under applicable data protection laws, including the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and, where relevant, the EU General Data Protection Regulation (EU GDPR).
              </p>
              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[0] leading-8">
                {lawfulBasisItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <span className="font-semibold text-[#003d2b]">
                      {item.label}
                    </span>
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      {" "}
                      {item.value}
                    </span>
                    {index < lawfulBasisItems.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-7" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              7. Processing of Special Category Data
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                7.1 Magnificentech Solution Ltd trading as TrustVerify recognises the heightened sensitivity and legal protections afforded to special category data under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. Special category data includes information revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, trade union membership, genetic data, biometric data for identification, health data, and data concerning a person's sex life or sexual orientation.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                7.2 The company processes special category data only where strictly necessary and in accordance with one or more of the lawful bases set out in Article 9 of the UK GDPR, including explicit consent, employment and social security law obligations, vital interests, legal claims, substantial public interest, medical diagnosis or provision of care, public health, and archiving or research purposes.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                7.3 Special category data is collected and processed for the following purposes: fulfilling employment, social security, and social protection obligations; managing health and safety obligations; preventing and detecting fraud, financial crime, and ensuring compliance with legal and regulatory requirements; responding to legal claims, defending the company's interests, and complying with court orders or regulatory investigations.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-8" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              8. Purposes of Data Processing
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                8.1 TrustVerify processes personal data strictly for specified, explicit, and legitimate purposes in accordance with applicable data protection laws, including the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and, where relevant, the EU GDPR.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                8.2 The main purposes for which personal data is processed by TrustVerify include:
              </p>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                {processingPurposes.map((item, index) => (
                  <React.Fragment key={index}>
                    • {item}
                    {index < processingPurposes.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-9" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              9. Trust Scoring, Profiling, and Automated Decision-Making
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                9.1 TrustVerify uses personal data to generate trust scores and conduct profiling for the purposes of fraud detection, risk assessment, and service optimisation. This involves automated analysis of identity, transaction, and behavioural data to assess the likelihood of fraudulent activity or to determine eligibility for certain services.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                9.2 Processing for trust scoring and profiling is based on our legitimate interests in fraud prevention and service security, compliance with legal obligations, and, where required, the performance of a contract.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                9.3 You have the right to object to profiling and automated decision-making under Articles 21 and 22 of the UK/EU GDPR. You may request human intervention, express your point of view, and contest decisions made solely by automated means that produce legal or similarly significant effects. To exercise these rights, contact our Data Protection Officer (see Contact section).
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-10" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              10. Data Sharing and Disclosure
            </p>
            <div className="flex flex-col items-start gap-6 w-full">
              <div className="w-full bg-[#2885ff24] rounded-2xl p-7">
                <div className="flex flex-col items-start gap-2.5">
                  <div className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#2785ff] text-xl sm:text-[22px] tracking-[-0.20px] leading-7">
                    Important Notice
                  </div>
                  <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#2785ff] text-base sm:text-lg tracking-[-0.20px] leading-7">
                    We do not sell or rent your personal information to third parties for their marketing purposes.
                  </div>
                </div>
              </div>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                10.1 We, Magnificentech Solution Ltd trading as TrustVerify, are committed to ensuring that personal data is only shared or disclosed in accordance with applicable data protection laws, including the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and, where relevant, the EU GDPR.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                10.2 Personal data may be shared internally within TrustVerify strictly on a need-to-know basis, limited to employees and departments whose roles require access for the purposes set out in this policy.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                10.3 External sharing of personal data is only undertaken where necessary and in accordance with legal requirements. This may include sharing with:
              </p>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                {dataSharingCategories.map((item, index) => (
                  <React.Fragment key={index}>
                    • {item}
                    {index < dataSharingCategories.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-11" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              11. International Data Transfers
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                11.1 TrustVerify does not currently transfer personal data outside the United Kingdom (UK) or the European Economic Area (EEA). All personal data collected, processed, and stored by Magnificentech Solution Ltd trading as TrustVerify is maintained within the UK or EEA, in accordance with applicable data protection laws, including the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                11.2 Should it become necessary in the future to transfer personal data internationally, TrustVerify will ensure that such transfers are conducted in full compliance with all relevant legal requirements. This includes, but is not limited to, implementing appropriate safeguards to protect the rights and freedoms of data subjects.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                11.3 In the event of any future international data transfers, TrustVerify will assess the adequacy of the destination country's data protection laws and, where required, implement one or more of the following safeguards: entering into standard contractual clauses (SCCs) or other approved data transfer agreements; relying on adequacy decisions issued by the UK government or the European Commission; implementing additional technical and organisational measures, such as encryption and access controls; obtaining explicit consent from data subjects, where required by law.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-12" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              12. Data Retention and Disposal
            </p>
            <div className="flex flex-col items-start gap-6 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                12.1 Magnificentech Solution Ltd trading as TrustVerify is committed to ensuring that all personal data is retained only for as long as necessary to fulfil the purposes for which it was collected, to comply with legal and regulatory obligations, and to meet legitimate business needs.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                12.2 The retention period for each category of personal data is determined based on the following criteria: the duration of the business relationship with the data subject; legal, regulatory, or contractual requirements mandating specific retention periods; the necessity of the data for ongoing business operations, fraud prevention, or compliance purposes; the nature and sensitivity of the personal data involved.
              </p>
              <div className="w-full bg-[#f3f3f3] rounded-2xl p-7">
                <div className="flex flex-col items-start gap-4">
                  <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#003d2b] text-[22px] tracking-[-0.20px] leading-7">
                    Data Retention Schedule
                  </p>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-[#e4e4e4]">
                          <th className="text-left p-2 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">Data Category</th>
                          <th className="text-left p-2 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm">Retention Period</th>
                        </tr>
                      </thead>
                      <tbody>
                        {retentionSchedule.map((item, index) => (
                          <tr key={index} className="border-b border-[#e4e4e4]">
                            <td className="p-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm">{item.category}</td>
                            <td className="p-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">{item.period}</td>
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

          <div id="section-13" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              13. Data Security Measures
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                13.1 Magnificentech Solution Ltd trading as TrustVerify is committed to maintaining the highest standards of data security to protect all personal data processed in connection with its fintech and cybersecurity SaaS operations. The following measures are implemented to ensure the confidentiality, integrity, and availability of personal data at all times.
              </p>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                {securityMeasures.map((item, index) => (
                  <React.Fragment key={index}>
                    • {item}
                    {index < securityMeasures.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-14" className="flex flex-col items-start gap-6 w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              14. Individual Rights
            </p>
            <div className="flex flex-col items-start gap-6 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                14.1 Individuals whose personal data is processed by Magnificentech Solution Ltd trading as TrustVerify are entitled to exercise a range of rights under applicable data protection laws, including the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and, where relevant, the EU GDPR.
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Available Rights
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
                      To exercise any of these rights, please contact our Data Protection Officer at:{" "}
                    </span>
                    <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#003d2b] tracking-[-0.04px]">
                      michael.omotayo@magnificentechsolution.co.uk
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-15" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              15. Exercising Data Protection Rights
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                15.1 Individuals whose personal data is processed by Magnificentech Solution Ltd trading as TrustVerify are entitled to exercise their data protection rights in accordance with applicable data protection laws, including the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and, where relevant, the EU General Data Protection Regulation (EU GDPR).
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                15.2 Requests to exercise any of these rights must be submitted in writing via the designated email address provided in this policy. Individuals may be required to provide sufficient information to verify their identity before any action is taken in response to their request.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                15.3 Upon receipt of a valid request, TrustVerify will acknowledge the request and respond within one month, in accordance with statutory timeframes. Where requests are complex or numerous, this period may be extended by a further two months, and the individual will be informed of any such extension and the reasons for it.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                15.4 TrustVerify will provide information or take the requested action free of charge. However, where requests are manifestly unfounded or excessive, particularly if repetitive, TrustVerify reserves the right to charge a reasonable fee or refuse to act on the request, in accordance with applicable law.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-16" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              16. Data Protection Officer and Contact Details
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                16.1 In accordance with applicable data protection laws, including the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018, Magnificentech Solution Ltd trading as TrustVerify has appointed a Data Protection Officer (DPO) to oversee the company's data protection strategy and ensure ongoing compliance with statutory obligations.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                16.2 The DPO is responsible for monitoring TrustVerify's compliance with data protection laws, internal policies, and procedures; advising and informing management, employees, and contractors of their obligations under data protection legislation; acting as the primary point of contact for data subjects regarding the exercise of their rights; and liaising with the Information Commissioner's Office (ICO) and other relevant supervisory authorities as required.
              </p>
              <div className="flex flex-col items-start gap-4 w-full">
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
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                16.3 All data protection enquiries and complaints should be directed to the DPO using the contact details above. The DPO will acknowledge receipt of all requests within the statutory timeframe and provide a substantive response in accordance with legal requirements.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-17" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              17. Complaints and Enquiries Procedure
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                17.1 Magnificentech Solution Ltd trading as TrustVerify is committed to upholding the highest standards of data protection and privacy. We recognise the importance of addressing any concerns, complaints, or enquiries regarding the processing of personal data in a timely, transparent, and effective manner.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                17.2 Individuals may submit complaints or enquiries relating to data protection, privacy practices, or the handling of their personal data by contacting our dedicated email address: michael.omotayo@magnificentechsolution.co.uk. All submissions must include sufficient information to enable us to identify the individual and the nature of the concern.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                17.3 Upon receipt of a complaint or enquiry, we will acknowledge receipt within five (5) working days, verify the identity of the individual making the request where necessary, conduct an internal investigation into the matter, and provide a substantive response within one (1) month of receipt, or inform the individual if additional time is required due to the complexity of the issue.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                17.4 Where a complaint remains unresolved, individuals have the right to refer their complaint to the Information Commissioner's Office (ICO) or the relevant supervisory authority in their jurisdiction. Details for contacting the ICO are available at www.ico.org.uk.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-18" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              18. Policy Review and Updates
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                18.1 This Privacy Policy is subject to regular review to ensure ongoing compliance with applicable data protection laws, regulatory requirements, and industry best practices relevant to the operations of Magnificentech Solution Ltd trading as TrustVerify.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                18.2 The policy shall be reviewed at least annually by Senior Management, or more frequently if required by changes in law, regulatory guidance, business operations, or identified risks.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                18.3 The review process will include assessment of the effectiveness of current privacy practices and controls, evaluation of any changes in applicable data protection legislation, consideration of feedback from data subjects, employees, clients, and other stakeholders, review of internal audit findings and compliance monitoring results, and identification of any new or emerging risks, technologies, or business processes that may impact data privacy.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-19" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              19. Internal Monitoring and Audits
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                19.1 TrustVerify is committed to maintaining the highest standards of data protection and privacy compliance. To ensure ongoing adherence to applicable data protection laws, regulatory requirements, and internal policies, we implement a robust programme of internal monitoring and audits.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                19.2 Internal monitoring and audits are conducted bi-annually and may be supplemented by ad hoc reviews in response to significant changes in law, business operations, or identified risks.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                19.3 The objectives of internal monitoring and audits include assessing compliance with the UK GDPR and Data Protection Act 2018, evaluating the effectiveness of technical and organisational measures, reviewing data processing activities to ensure alignment with this Privacy Policy and legal requirements, identifying and addressing potential vulnerabilities or non-compliance issues, and verifying that data subject rights requests are handled promptly and in accordance with established procedures.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-20" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              20. Related Policies and References
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                20.1 This Privacy Policy forms part of the wider data protection and information governance framework of Magnificentech Solution Ltd trading as TrustVerify. To ensure comprehensive compliance and robust data management, the following related policies and documents should be read in conjunction with this Privacy Policy:
              </p>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                {relatedPolicies.map((item, index) => (
                  <React.Fragment key={index}>
                    • {item}
                    {index < relatedPolicies.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>

          <div id="section-21" className="flex flex-col items-start gap-[30px] w-full scroll-mt-20">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
              21. Additional Provisions
            </p>
            <div className="flex flex-col items-start gap-5 w-full">
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                21.1 This section sets out supplementary terms and conditions that apply to the processing of personal data by Magnificentech Solution Ltd trading as TrustVerify, in addition to the main provisions of this Privacy Policy.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                21.2 Severability: If any provision of this Privacy Policy is found to be invalid, unlawful, or unenforceable by a competent authority, such provision shall be deemed severed from the remainder of the policy, which shall remain in full force and effect.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                21.3 Governing Law and Jurisdiction: This Privacy Policy and any dispute or claim arising out of or in connection with it shall be governed by and construed in accordance with the laws of England and Wales. The courts of England and Wales shall have exclusive jurisdiction to settle any such dispute or claim.
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                21.4 For any questions, concerns, or requests relating to this Privacy Policy or the processing of personal data, individuals may contact the Data Protection Officer using the details provided in Section 16.
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
                