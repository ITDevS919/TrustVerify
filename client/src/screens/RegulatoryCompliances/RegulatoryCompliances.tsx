import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

const contactMetaData = [
  { title: "Chief Compliance Officer", label: "Email:", value: "compliance@trustverify.co.uk" },
  { title: "AML/Financial Crime Officer", label: "Email:", value: "aml@trustverify.co.uk" },
  { title: "Data Protection Officer", label: "Email:", value: "dpo@trustverify.co.uk" },
  { title: "Regulatory Affairs", label: "Email:", value: "regulatory@trustverify.co.uk" },
];

export const RegulatoryCompliances = (): JSX.Element => {
  return (
    <main className="bg-white overflow-hidden w-full relative">
      <Header 
        content={{
          title: "Regulatory Compliance",
          description: "TrustVerify maintains a comprehensive regulatory and compliance framework designed to meet FCA requirements for firms operating in the UK financial ecosystem. This document outlines our AML/CTF, KYC/KYB, data protection, security, vendor governance and reporting practices.",
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
                  TrustVerify maintains a comprehensive regulatory and compliance framework designed to meet FCA requirements for firms operating in the UK financial ecosystem. This document outlines our AML/CTF, KYC/KYB, data protection, security, vendor governance and reporting practices. It is intended for FCA submission, partners, and internal governance documentation.              
                </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                1. Regulatory Alignment
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  TrustVerify operates under the following regulations and frameworks: <br />
                  - UK Money Laundering Regulations 2017 (as amended) <br />
                  - FCA Handbook (SYSC, COND, FEES, SUP, MLR) <br />
                  - FCA Consumer Duty <br />
                  - FATF Recommendations <br />
                  - GDPR / UK GDPR <br />
                  - CCPA principles (where applicable) <br />
                  - PCI DSS (via third-party providers payment infrastructure)
                </p>
                <div className="flex flex-col items-start gap-2.5 px-[31px] py-[27px] w-full bg-[#2885FF24] rounded-2xl">
                  <div className="flex flex-col items-start gap-2.5">
                    <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#2885FF] text-[22px] tracking-[-0.20px] leading-7 whitespace-nowrap">
                      Payment Processing
                    </p>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#2885FF] text-lg tracking-[-0.20px] leading-7">
                      TrustVerify currently uses third-party providers for payment processing. These third-party PSPs hold their own FCA/European regulatory approvals, and TrustVerify integrates their services without acting as a PSP or EMI at this stage.
                    </p>
                  </div>
                </div>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                2. AML/CTF Programme
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  TrustVerify maintains a full AML/CTF programme aligned with FCA, HMRC and FATF expectations. <br />
                  Key elements include: <br />
                  - Risk-based Customer Due Diligence (CDD) <br />
                  - Enhanced Due Diligence (EDD) for high-risk clients or jurisdictions <br />
                  - Ongoing monitoring and behavioural analytics <br />
                  - Comprehensive sanctions, PEP and adverse media screening <br />
                  - Dedicated MLRO and escalation workflow <br />
                  - SAR/STR submission procedure aligned to NCA <br />
                  - 5-year record-keeping requirements
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                3. KYC & KYB Verification
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  TrustVerify uses a multi-layered identity verification approach supported by leading third-party suppliers: <br />
                  - Third-party providers (IDV, liveness, KYB) <br />
                  - Third-party providers (Device intelligence) <br />
                  - Third-party providers (IP/geolocation/fraud intelligence) <br />
                  - Third-party providers (KYC on payment flows where applicable)
                </p>
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Verification Levels
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Level 1 – Basic: ID + liveness + address <br />
                  - Level 2 – Enhanced: SOF/SOW, additional documentation <br />
                  - Level 3 – High Risk: Manual review, in-depth due diligence
                </p>
              </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                4. Sanctions & Screening
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  TrustVerify conducts: <br />
                  - Real-time screening <br />
                  - Batch rescreening <br />
                  - Event-driven triggers (name change, device risk, unusual activity)
                </p>
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Sanctions Lists
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - OFAC <br />
                  - UN <br />
                  - EU <br />
                  - UK HMT
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  PEP screening and adverse media checks are performed via third-party providers + internal controls.
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                5. Data Protection & GDPR
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  TrustVerify complies with GDPR / UK GDPR including: <br />
                  - Data minimisation <br />
                  - Lawful processing <br />
                  - User rights (access, deletion, rectification) <br />
                  - DPIAs for all new high-risk processing <br />
                  - 72-hour breach reporting workflow <br />
                  - Secure encryption, pseudonymisation and access controls
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                6. Vendor Governance
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  TrustVerify performs due diligence and ongoing monitoring on all suppliers. <br />
                  Current suppliers include: <br />
                  - Third-party providers (KYC/KYB) <br />
                  - Third-party providers (Device risk intelligence) <br />
                  - Third-party providers (Fraud detection) <br />
                  - Third-party providers (Payment infrastructure, PCI DSS-compliant)
                </p>
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Vendor Review Includes
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - SLAs / DPAs <br />
                  - ISO27001 / SOC 2 reports <br />
                  - Penetration test summaries <br />
                  - Data processing diagrams <br />
                  - Breach notification obligations
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                7. Business-Wide Risk Assessment (BWRA)
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  The BWRA covers: <br />
                  - Customer risk <br />
                  - Product/service risk <br />
                  - Geographic risk <br />
                  - Delivery channel risk <br />
                  - Transaction risk
                </p>
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Methodology
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Likelihood × Impact scoring <br />
                  - Control mapping (manual/automated) <br />
                  - Residual risk rating <br />
                  - Annual MLRO sign-off
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                8. Security Framework
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  TrustVerify maintains: <br />
                  - ISO 27001-aligned ISMS <br />
                  - SOC 2-aligned security controls <br />
                  - Secure SDLC <br />
                  - Audit logging and monitoring <br />
                  - Access control and role-based permissions <br />
                  - Incident response & disaster recovery plans
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                9. Reporting & Governance
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Reporting
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Annual AML audit <br />
                  - Quarterly compliance review <br />
                  - SAR reporting to NCA <br />
                  - Transparency reports
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                10. Customer Protection & Disclosures
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  Customer protection includes: <br />
                  - FCA Consumer Duty alignment <br />
                  - Clear onboarding disclosures <br />
                  - Fraud prevention education <br />
                  - Vulnerable customer support <br />
                  - Transparent privacy and data policies
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                11. Contact Compliance Team
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
