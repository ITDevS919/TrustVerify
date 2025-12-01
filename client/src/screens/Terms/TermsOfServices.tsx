import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

const contactMetaData = [
  { title: "Legal Department", label: "Email:", value: "legal@trustverify.com" },
  { title: "Data Protection Officer", label: "Email:", value: "dpo@trustverify.io" },
  { title: "Compliance", label: "Email:", value: "compliance@trustverify.io" },
  { title: "Address", label: "", value: "TrustVerify Ltd., London, United Kingdom" },
];

const importantLegalData = [
  { label: "Effective Date:", value: "January 1, 2025" },
  { label: "Governing Law:", value: "England and Wales" },
  { label: "Last Updated:", value: "July 15, 2025" },
];


export const TermsOfServices = (): JSX.Element => {
  return (
    <main className="bg-white overflow-hidden w-full relative">
      <Header 
        content={{
          title: "Terms of Service",
          description: "By using TrustVerify, you agree to these Terms and Conditions. These terms govern your access to and use of our platform, services, APIs, and tools.",
          maxWidth: "1075px"
        }}
      />
      <section className="relative w-full flex justify-center pt-20 pb-32">
        <div className="flex flex-col max-w-[1210px] px-6 md:px-10 items-start gap-[60px]">
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                Important Legal Notice              
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-2 items-start gap-4 w-full">
              {importantLegalData.map((item, index) => (
                <div 
                  key={index}
                  className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-xl tracking-[-0.20px] leading-7 whitespace-nowrap"
                >                      
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-semibold text-[#003d2b] tracking-[-0.04px]">
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
                If you do not agree, you must not use TrustVerify. These terms govern your access to and use of our platform, services, APIs, and tools.
              </p>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                1. Acceptance of Terms
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  By using TrustVerify ("we", "our", "us"), you agree to these Terms and Conditions. These terms govern your access to and use of our platform, services, APIs, and tools. If you do not agree, you must not use TrustVerify.                
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
          <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
          2. Nature of Services
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xl sm:text-2xl tracking-[-0.20px] leading-8">
                  TrustVerify provides a verification and scoring service, allowing users to: 
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Verify identity via third-party KYC/AML providers <br />  
                  - Calculate trust scores for transactional safety <br />
                  - Optionally process payments or route transactions through external, regulated partners                
                </p>
              </div>
              <div className="flex flex-col items-start gap-2.5 px-[31px] py-[27px] w-full bg-[#EAB30824] border border-[#EAB308] rounded-2xl">
                <div className="flex flex-col items-start gap-2.5">
                    <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#EAB308] text-[22px] tracking-[-0.20px] leading-7 whitespace-nowrap">
                      Important Disclaimer:               
                    </p>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#EAB308] text-lg tracking-[-0.20px] leading-7">
                      We do not act as a financial intermediary, payment processor, escrow agent, or marketplace. We provide APIs and tools to integrate with third-party services into external systems.                    
                    </p>
                </div>
              </div>
          </div>

          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                3. Limitation of Liability
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xl sm:text-2xl tracking-[-0.20px] leading-8">
                  TrustVerify does not endorse, verify, or certify any user or business listed or connected through our system.
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - <strong className="text-[#003d2b]">Critical Notice: </strong>Users engage with each other at their own risk <br />
                  - TrustVerify assumes no liability for loss, fraud, or disputes between transacting parties <br />
                  - TrustVerify's services are provided on an "as is" and "as available" basis <br />
                  - No warranties or guarantees are made
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                4. Dispute Resolution
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xl sm:text-2xl tracking-[-0.20px] leading-8">
                  In the event there is a dispute within the defined buffer period, TrustVerify will freeze the relevant logs if integrated with a payment/escrow provider.                
                </p>
                <div className="flex flex-col items-start gap-2.5 px-[31px] py-[27px] w-full bg-[#2885FF24] rounded-2xl">
                <div className="flex flex-col items-start gap-2.5">
                    <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#2885FF] text-[22px] tracking-[-0.20px] leading-7 whitespace-nowrap">
                      Important Notice:             
                    </p>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#2885FF] text-lg tracking-[-0.20px] leading-7">
                      TrustVerify is not a decision-maker in dispute outcomes. We may assist by collecting documentation and posting it to the appropriate financial or legal entities.                    
                    </p>
                </div>
              </div>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                5. User Responsibilities
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Mandatory Requirements 
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - All users must undergo identity verification (KYC) through supported third parties <br />  
                  - Users are prohibited from misusing the platform for illegal, abusive, or deceptive purposes <br />
                  - Any suspicious behavior may result in account restriction, reporting to authorities, or platform bans
                </p>
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  Verification Requirements                
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  All relationships between buyers and sellers must be verified by both parties. TrustVerify's provides tools for safest transactions through trusted relationships.              
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                6. Data Protection (UK GDPR / AML)
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - We process personal data according to the UK GDPR <br />  
                  - We only collect the minimum data required for compliance and fraud prevention <br />
                  - Data is processed via secure third parties (e.g., Onfido, Sumsub), with appropriate data processing agreements (DPAs) in place <br />
                  - Your data may be transferred outside the UK/EU with safeguards such as Standard Contractual Clauses (SCCs)
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                7. Global Sanctions Compliance
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xl sm:text-2xl tracking-[-0.20px] leading-8">
                  We reserve the right to terminate or suspend access without notice in case of:
                </p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  - Breach of terms <br />
                  - Fraudulent or illegal activity <br />
                  - Non-cooperation with investigations
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                8. Governing Law
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-2xl tracking-[-0.20px] leading-8">
                  These Terms are governed by the laws of England and Wales. Any disputes arising from these terms or your use of TrustVerify will be subject to the exclusive jurisdiction of the courts of England and Wales.
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                9. Contact Compliance Team
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-2 items-start gap-10 w-full">
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
