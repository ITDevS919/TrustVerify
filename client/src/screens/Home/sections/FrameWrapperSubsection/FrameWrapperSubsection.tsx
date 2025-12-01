import { TrendingUp } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { useNavigate } from "react-router-dom";
const features = [
  {
    icon: "/background.svg",
    title: "Threat Detection",
    description: "Watch how suspicious patterns are identified instantly",
  },
  {
    icon: "/background-16.svg",
    title: "Real-time Response",
    description: "See transactions blocked in under 50 milliseconds",
  },
  {
    icon: "/background-5.svg",
    title: "Dashboard Overview",
    description: "Explore the intuitive monitoring interface",
  },
];

export const FrameWrapperSubsection = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <section className="w-full flex flex-col xl:flex-row items-center justify-center max-w-[1406px] mx-auto gap-[50px] py-32 px-6 md:px-10">
      <div className="flex flex-col w-full xl:w-1/2 items-start gap-9">
        <div className="z-10 flex flex-col items-start gap-[30px] w-full">
          <div className="flex flex-col items-start gap-[19px] w-full">
            <div className="flex flex-col items-start gap-5 w-full">
              <Badge className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] h-[30px] px-4 rounded-[800px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                SEE IT IN ACTION
              </Badge>

              <h2 className="text-[54px] tracking-[-0.50px] leading-[67px] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
                <span className="text-[#003d2b] tracking-[-0.27px]">
                  Watch Our{" "}
                </span>
                <span className="text-[#0b3a78] tracking-[-0.27px]">
                  Security
                </span>
                <span className="text-[#003d2b] tracking-[-0.27px]">
                  {" "}
                  Platform Protect Your
                  {" "}
                </span>
                <span className="text-[#27ae60] tracking-[-0.27px]">
                  Business
                </span>
              </h2>
            </div>

            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg tracking-[-0.20px] leading-7">
              Experience how our advanced fraud detection system identifies
              threats in real-time, protecting millions of transactions with
              unmatched precision and speed.
            </p>
          </div>

          <div className="flex flex-col w-full max-w-[514px] items-start gap-9">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-[13px] w-full">
                <img
                  className="w-[50px] h-[50px] flex-shrink-0"
                  alt={feature.title}
                  src={feature.icon}
                />
                <div className="flex flex-col items-start gap-[5px] flex-1">
                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#040303] text-base leading-6">
                    {feature.title}
                  </h3>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base leading-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <Button 
            onClick={() => navigate("/dashboard")}
            className="px-6 h-14 bg-app-primary hover:bg-app-primary/90 rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-white text-sm sm:text-lg tracking-[-0.20px]">
              Start Free Trial
            <TrendingUp className="ml-1 sm:ml-2 w-[20px] h-[20px] sm:w-[30px] sm:h-[30px]" />
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/live-demo")}
            className="px-6 h-14 border-[#27ae60] text-app-secondary hover:bg-[#27ae60]/10 rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-sm sm:text-lg tracking-[-0.20px]"
          >
            Schedule Demo
          </Button>
        </div>
      </div>

      <div className="z-10 w-full xl:w-1/2 flex-shrink-0">
        <img className="w-full h-full object-cover" alt="Container" src="/container.png" />
      </div>
    </section>
  );
};
