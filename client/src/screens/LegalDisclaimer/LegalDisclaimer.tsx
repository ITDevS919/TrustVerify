import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";



export const LegalDisclaimer = (): JSX.Element => {
  return (
    <main className="bg-white overflow-hidden w-full relative">
      <Header 
        content={{
          title: "Legal Disclaimer",
          description: "Important legal information regarding the use of TrustVerify services",
        }}
      />
      <section className="relative w-full flex justify-center pt-20 pb-32">
        <div className="w-full flex flex-col max-w-[1210px] px-6 md:px-10 items-start gap-[60px]">
          <div className="flex flex-col items-start gap-2.5 px-[31px] py-[27px] w-full bg-[#EAB30824] border border-[#EAB308] rounded-2xl">
            <div className="flex flex-col items-start gap-2.5">
              <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#EAB308] text-[22px] tracking-[-0.20px] leading-7">
                PLEASE READ THIS DISCLAIMER CAREFULLY BEFORE USING TRUSTVERIFY SERVICES.              
              </p>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#EAB308] text-lg tracking-[-0.20px] leading-7">
                TrustVerify provides fraud prevention, identity verification, and escrow services as a technology platform. We act as an intermediary and facilitator, not as a guarantor, insurer, or party to any transactions conducted through our platform.              
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                1. No Warranty or Guarantee
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xl sm:text-2xl tracking-[-0.20px] leading-8">
                  TrustVerify makes no warranties, representations, or guarantees about:              
                </p>
                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  <p>
                    - The authenticity, quality, safety, or legality of items or services traded <br />
                    - The accuracy or completeness of user-provided information <br />
                    - The reliability or trustworthiness of platform users <br />
                    - The success or completion of any transactions <br />
                    - The continuous availability or error-free operation of our services <br />
                    - The prevention of all fraudulent activities or security breaches 
                  </p>
                </div>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
            <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
             2. User Responsibility
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  You are solely responsible for
                </p>
                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  <p>
                    - Conducting your own due diligence before entering into any transaction <br />
                    - Verifying the identity, credentials, and legitimacy of other users <br />
                    - Ensuring compliance with applicable laws and regulations <br />
                    - Assessing the risks associated with any transaction or service <br />
                    - Maintaining the security of your account and personal information <br />
                    - Any losses, damages, or disputes arising from your use of the platform
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
              <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                To the maximum extent permitted law, TrustVerify shall not be liable for:
                </p>
                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  <p>
                    - Any direct, indirect, incidental, special, or consequential damages <br />
                    - Loss of profits, revenue, business opportunities, or goodwill <br />
                    - Personal injury or property damage arising from platform use <br />
                    - Fraudulent activities or misconduct by platform users <br />
                    - Technical failures, interruptions, or data loss <br />
                    - Third-party actions, omissions, or content
                  </p>
                </div>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl leading-8">
                  OUR TOTAL LIABILITY SHALL NOT EXCEED THE FEES PAID BY YOU TO TRUSTVERIFY IN THE 12 MONTHS PRECEDING THE CLAIM.                
                </p>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                4. Risk Acknowledgment
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[-0.20px] leading-7">
                  By using TrustVerify, you acknowledge and accept the following risks:
                </p>
                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  <p>
                    - Online transactions carry inherent risks including fraud and identity theft <br />
                    - Technology systems may experience failures or security vulnerabilities <br />
                    - Regulatory changes may affect service availability or functionality <br />
                    - Third-party service providers may cause service disruptions <br />
                    - Users may provide false or misleading information <br />
                    - Dispute resolution processes may not result in satisfactory outcomes <br />
                  </p>
                </div>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                5. Investment and Financial Advice
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xl sm:text-2xl tracking-[-0.20px] leading-8">
                  TrustVerify does not provide investment, financial, legal, or tax advice. Any information provided on our platform is for informational purposes only and should not be construed as professional advice.              
                </p>
                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  <p>
                    You should consult with qualified professionals before making any financial or legal decisions.
                  </p>
                </div>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                6. Regulatory Compliance
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xl sm:text-2xl tracking-[-0.20px] leading-8">
                  While TrustVerify strives to comply with applicable regulations, you are responsible for ensuring your use of our services complies with all laws and regulations in your jurisdiction.                </p>
                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                  <p>
                    Some services may not be available in certain jurisdictions due to regulatory restrictions.                  
                  </p>
                </div>
              </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e4]"></div>
          <div className="flex flex-col items-start gap-[30px] w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[-0.50px] leading-[49px] sm:leading-[67px]">
                7. Updates to This Disclaimer
              </p>
              <div className="flex flex-col items-start gap-5 w-full">
                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-xl sm:text-2xl tracking-[-0.20px] leading-8">
                We reserve the right to update this disclaimer at any time without prior notice. Changes will be effective immediately upon posting. Your continued use of our services after changes constitutes acceptance of the updated disclaimer.                </p>
              </div>
          </div>
          <div className="flex flex-col items-start gap-2.5 px-[31px] py-[27px] w-full bg-[#d3203024] border border-[#d32030] rounded-2xl">
            <div className="flex flex-col items-start gap-2.5">
              <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#d32030] text-[22px] tracking-[-0.20px] leading-7">
                IF YOU DO NOT AGREE WITH ANY PART OF THIS DISCLAIMER, DO NOT USE TRUSTVERIFY SERVICES.
              </p>

              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#d32030] text-lg tracking-[-0.20px] leading-7">
              For questions about this disclaimer, contact our legal department <strong>at legal@trustverify.com.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
};
