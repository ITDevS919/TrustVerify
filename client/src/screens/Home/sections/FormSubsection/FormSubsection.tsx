import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const FormSubsection = (): JSX.Element => {
  return (
    <div className="z-10 px-6 md:px-10">
    <Card className="w-full bg-app-primary rounded-lg md:rounded-xl lg:rounded-2xl xl:rounded-[20px] shadow-[0px_4px_10px_#003d2b1a] border-0 max-w-[1370px] mx-auto mt-24">
      <CardContent className="flex items-center gap-0 sm:gap-4 md:gap-9 lg:gap-14 py-4 sm:py-5 md:py-6 lg:py-7 px-5 sm:px-7 md:px-10 lg:px-14">
        <div className="flex w-full mt-0 sm:mt-2 md:mt-4 lg:mt-7 flex-col items-start gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          <div className="flex flex-col items-start gap-1 sm:gap-2 md:gap-4 lg:gap-6 w-full">
            <p className="mt-[-1.00px] text-white text-base md:text-xl lg:text-3xl xl:text-[40px] tracking-tighter sm:tracking-[-0.50px] leading-6 sm:leading-8 md:leading-10 lg:leading-[50px] xl:leading-[67px] flex items-center justify-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
              Ready To Protect Your Business?
            </p>

            <p className="flex items-center justify-center [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-[8px] md:text-[12px] lg:text-lg xl:text-[22px] tracking-[0]  leading-[10px] sm:leading-[15px] md:leading-[21px] lg:leading-[30px]">
              Join thousands of companies trust TrustVerify to secure their transactions and prevent fraud.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
            <Button 
              size="none"
              className="bg-white rounded-[4px] sm:rounded-[6px] md:rounded-[8px] lg:rounded-[10px] hover:bg-white/90 px-3 py-0 sm:px-6 sm:py-2 md:px-8 md:py-4  lg:px-10 lg:py-5">
              <p className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-app-primary text-[7px] sm:text-[10px] md:text-sm lg:text-lg text-center tracking-[-0.20px]">
                Start Free Trial
              </p>
            </Button>

            <Button
              variant="outline"
              size="none"
              className="rounded-[4px] sm:rounded-[6px] md:rounded-[8px] lg:rounded-[10px] border border-solid border-white bg-transparent hover:bg-white/10 text-white hover:text-white px-3 py-0 sm:px-6 sm:py-1.5 md:px-8 md:py-3 lg:px-10 lg:py-5"
            >
              <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[7px] sm:text-[10px] md:text-sm lg:text-lg text-center tracking-[-0.20px] leading-[18px]">
                View Documentation
              </span>
            </Button>
          </div>
        </div>

        <img
          className="w-[88px] h-[87px] sm:w-[120px] sm:h-[110px] md:h-[170px] md:w-[190px] lg:w-[293px] lg:h-[262px]"
          alt="Frame"
          src="/frame.svg"
        />
      </CardContent>
    </Card>
    </div>
  );
};
