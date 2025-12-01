import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

const contactMetaData = [
  { title: "Chief Compliance Officer", label: "Email:", value: "compliance@trustverify.com" },
  { title: "AML Officer", label: "Email:", value: "aml@trustverify.io" },
  { title: "Data Protection Officer", label: "Email:", value: "dpo@trustverify.io" },
  { title: "Regulartory Affairs", label: "Email:", value: "regulatory@trustverify.io" },
];

export const RegulatoryCompliances = (): JSX.Element => {
  return (
    <main className="bg-white overflow-hidden w-full relative">
      <Header 
        content={{
          title: "Regulatory Compliance",
          description: "TrustVerify demonstrates comprehensive compliance with global financial regulations to ensure the highest standards of security and regulatory adherence.",
        }}
      />
      <section className="relative w-full flex justify-center pt-20 pb-32">
        <div className="flex flex-col max-w-[1210px] px-6 md:px-10 items-start gap-[60px]">
          <div className="flex flex-col items-start gap-2.5 px-[31px] py-[27px] w-full bg-[#27AE6024] border border-[#27AE60] rounded-2xl">
            <div className="flex flex-col items-start gap-2.5">
                <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#27AE60] text-[22px] tracking-[-0.20px] leading-7 whitespace-nowrap">
                  Compliance Framework              
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#27AE60] text-lg tracking-[-0.20px] leading-7">
                  TrustVerify demonstrates comprehensive compliance with global financial regulations to ensure the highest standards of security and regulatory adherence. Our framework covers anti-money laundering, data protection, financial services regulations, and international sanctions compliance.              
                </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                1. Anti-Money Laundering (AML) Compliance
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  AMLD5 Fifth Anti-Money Laundering Directive                
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                    - Enhanced customer due diligence procedures <br />
                    - Real-time transaction monitoring and reporting <br />
                    - Beneficial ownership identification and verification <br />
                    - Suspicious activity reporting and documentation
                </p>
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Transaction Monitoring
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Automated monitoring for global sanctions lists <br />
                  - Real-time fraud detection algorithms <br />
                  - Risk-based transaction limits and controls <br />
                  - Ongoing monitoring of customer relationships
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                2. Know Your Customer (KYC) Standards
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Identity Verification Levels                
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Basic Verification: Government-issued ID and proof of address <br />
                  - Enhanced Verification: Income verification and source of funds <br />
                  - Premium Verification: Full financial background checks
                </p>
              </div>
              <div className="flex flex-col items-start gap-2.5 px-[31px] py-[27px] w-full bg-[#2885FF24] rounded-2xl">
                <div className="flex flex-col items-start gap-2.5">
                    <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#2885FF] text-[22px] tracking-[-0.20px] leading-7 whitespace-nowrap">
                      Verification Partners              
                    </p>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#2885FF] text-lg tracking-[-0.20px] leading-7">
                      We partner with leading KYC providers including Onfido, Jumio, and Sumsub to ensure accurate and compliant identity verification processes.                    
                    </p>
                </div>
              </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                3. Data Protection Regulations
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  GDPR Compliance
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Lawful basis for all data processing activities <br />  
                  - Data minimization and purpose limitation principles <br />  
                  - Individual rights management and response procedures <br />  
                  - Data Protection Impact Assessments (DPIAs) <br />  
                  - Breach notification procedures (72-hour requirement)
                </p>
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                    CCPA Compliance
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Consumer rights transparency and response <br />
                  - Opt-out mechanisms for data sale (we don't sell data) <br />
                  - Non-discrimination policies for rights exercised
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                4. Financial Services Regulations
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  FCA Compliance (UK)
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Consumer Duty principles and fair treatment <br />
                  - Market conduct and integrity standards <br />
                  - Operational resilience requirements <br />
                  - Senior Managers and Certification Regime (SMCR)
                </p>
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  PCI DSS Compliance
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Secure cardholder data environment <br />
                  - Regular vulnerability assessments <br />  
                  - Access control and authorization measures <br />
                  - Network security monitoring
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                5. Security Certifications
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  SOC 2 Type II 
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Annual third-party audits of our security, availability, processing integrity, confidentiality, and privacy controls <br />
                  - Comprehensive security policies and procedures <br />
                  - Incident response and management procedures <br />
                  - Business continuity and system development lifecycle <br />
                  - Vendor management and due diligence
                </p>
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  ISO 27001
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                Information Security Management System certification ensuring systematic approach to managing sensitive company information                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                6. Reporting and Transparency
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Regulatory Reporting
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Quarterly reports to relevant Financial Intelligence Agency <br />
                  - Transaction reports to relevant financial intelligence units <br />
                  - Data breach notifications to supervisory authorities <br />
                  - Annual compliance attestations and filings
                </p>
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Transparency Reports
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Annual transparency reports on law enforcement requests <br />
                  - Compliance metrics and performance indicators <br />
                  - Security incident summaries and lessons learned <br />
                  - Third-party audit results and recommendations
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                7. Global Sanctions Compliance
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Sanctions Screening
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Real-time screening against OFAC, UN, EU and HMT sanctions lists <br />
                  - Enhanced due diligence for high-risk jurisdictions <br />
                  - Ongoing monitoring of existing customers against updated lists <br />
                  - Automated blocking and escalation procedures
                </p>
                <div className="flex flex-col items-start gap-2.5 px-[31px] py-[27px] w-full bg-[#d3203024] rounded-2xl">
                  <div className="flex flex-col items-start gap-2.5">
                    <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#d32030] text-[22px] tracking-[-0.20px] leading-7 whitespace-nowrap">
                      Zero Tolerance Policy
                    </p>

                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#d32030] text-lg tracking-[-0.20px] leading-7">
                      TrustVerify maintains a zero-tolerance policy towards sanctions evasion and prohibited transactions with sanctioned entities                    \
                    </p>
                  </div>
                </div>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                8. Contact Compliance Team
              </p>
              <div className="grid grid-cols-2 grid-rows-2 items-start gap-10 w-full">
              {contactMetaData.map((item, index) => (
                <div 
                  key={index}
                  className="flex flex-col gap-7"
                >
                  <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                    {item.title}
                  </p>
                  <div>                      
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-semibold text-[#003d2b] tracking-[-0.04px]">
                        {item.label}
                    </span>
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] tracking-[-0.04px]">
                        {" "}
                        {item.value}
                    </span>
                  </div>
                </div>
              ))}
              </div>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
};
