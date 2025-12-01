import { useRef, useState } from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";

const personalFeatures = [
  {
    icon: "/fi-7266696.svg",
    title: "Identity Monitoring",
    description: "24/7 Dark Serveilance",
  },
  {
    icon: "/fi-16778983.svg",
    title: "Credit Protection",
    description: "Real time credit monitoring",
  },
  {
    icon: "/fi-4431856.svg",
    title: "Mobile Security",
    description: "Scan Call & SMS protection",
  },
];

const businessFeatures = [
  {
    icon: "/fi-102649.svg",
    title: "Escrow Protection",
    description: "Secure Transaction Processing",
  },
  {
    icon: "/fi-5785584.svg",
    title: "KYC Verification",
    description: "Advanced Identity Verification",
  },
  {
    icon: "/fi-16034834.svg",
    title: "Dispute Resolution",
    description: "72-Hour Settlement Process",
  },
];

export const Frame1Subsection = (): JSX.Element => {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [isPlaying2, setIsPlaying2] = useState(false);

  const handlePlayPause1 = () => {
    if (videoRef1.current) {
      if (isPlaying1) {
        videoRef1.current.pause();
      } else {
        videoRef1.current.play();
      }
    }
  };

  const handlePlayPause2 = () => {
    if (videoRef2.current) {
      if (isPlaying2) {
        videoRef2.current.pause();
      } else {
        videoRef2.current.play();
      }
    }
  };
  return (
    <section className="flex flex-col w-full items-center gap-[60px] py-12">
      <div className="flex flex-col items-center gap-[60px] w-full max-w-[1319px] px-4">
        <div className="flex flex-col items-center gap-[19px] w-full max-w-[1129px]">
          <Badge
            variant="secondary"
            className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-[800px] h-[30px] px-4"
          >
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
              HOW WE PROTECT
            </span>
          </Badge>

          <div className="flex flex-col items-center gap-5 w-full">
            <h2 className="text-center text-[54px] tracking-[-0.92px] leading-[60px] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
              <span className="text-[#003d2b] tracking-[-0.50px]">
                Experience{" "}
              </span>
              <span className="text-[#0b3a78] tracking-[-0.50px]">Trust</span>
              <span className="text-[#27ae60] tracking-[-0.50px]">Verify</span>
              <span className="text-[#003d2b] tracking-[-0.50px]">
                {" "}
                In Action
              </span>
            </h2>

            <p className="text-center [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg tracking-[-0.20px] leading-7 max-w-full">
              Try our comprehensive fraud detection and prevention system with
              interactive demos tailored for your needs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          <Card className="rounded-[22.1px] border-[1.1px] border-[#e4e4e4] bg-white overflow-hidden">
            <CardContent className="p-[45px_35px]">
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-[11.05px]">
                  <img
                    className="w-[55.24px] h-[55.24px] flex-shrink-0"
                    alt="Background"
                    src="/background-13.svg"
                  />

                  <div className="flex flex-col gap-[5.52px] flex-1">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-[19.9px] tracking-[0] leading-[26.5px]">
                      Personal Protection Demo
                    </h3>

                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[17.7px] tracking-[0] leading-[25.4px]">
                      Safeguard your personal information and finances.
                    </p>
                  </div>
                </div>

                <div className="relative w-full h-[474px] rounded-2xl overflow-hidden group">
                  <video
                    ref={videoRef1}
                    className="w-full h-full object-cover"
                    src="/demo1.mp4"
                    onPlay={() => setIsPlaying1(true)}
                    onPause={() => setIsPlaying1(false)}
                    onEnded={() => setIsPlaying1(false)}
                  />
                  
                  {/* Custom Play Button Overlay */}
                  {!isPlaying1 && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer transition-opacity duration-300 hover:bg-opacity-40"
                      onClick={handlePlayPause1}
                    >
                      <img
                       className="w-24 h-24 rounded-full border-gray-800 border-2"
                       src="/play_button.png"
                      />
                    </div>
                  )}
                  
                  {/* Play/Pause Button (visible when playing) */}
                  {isPlaying1 && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      onClick={handlePlayPause1}
                    >
                      <img
                       className="w-24 h-24 rounded-full border-gray-800 border-2"
                       src="/play_button.png"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-6">
                  <div className="grid gird-cols-1 sm:grid-cols-2 gap-[43px]">
                    {personalFeatures.slice(0, 2).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3.5">
                        <img
                          className="w-8 h-8 flex-shrink-0"
                          alt="Fi"
                          src={feature.icon}
                        />

                        <div className="flex flex-col gap-1 flex-1">
                          <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg tracking-[0] leading-7">
                            {feature.title}
                          </div>

                          <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[15px] tracking-[0] leading-[23px]">
                            {feature.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3.5">
                    <img
                      className="w-8 h-8 flex-shrink-0"
                      alt="Fi"
                      src={personalFeatures[2].icon}
                    />

                    <div className="flex flex-col gap-1 flex-1">
                      <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg tracking-[0] leading-7">
                        {personalFeatures[2].title}
                      </div>

                      <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[15px] tracking-[0] leading-[23px]">
                        {personalFeatures[2].description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[22.13px] border-[1.11px] border-[#e4e4e4] bg-white overflow-hidden">
            <CardContent className="p-[45px_35px]">
              <div className="flex flex-col gap-[33px]">
                <div className="flex items-start gap-[11.07px]">
                  <img
                    className="w-[55.33px] h-[55.33px] flex-shrink-0"
                    alt="Background"
                    src="/background-9.svg"
                  />

                  <div className="flex flex-col gap-[5.53px] flex-1">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-[19.9px] tracking-[0] leading-[26.6px]">
                      Business Fraud Prevention
                    </h3>

                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[17.7px] tracking-[0] leading-[25.5px]">
                      Protect transactions and secure business operations
                    </p>
                  </div>
                </div>
                <div className="relative w-full h-[474px] rounded-2xl overflow-hidden group">
                  <video
                    ref={videoRef2}
                    className="w-full h-full object-cover"
                    src="/demo2.mp4"
                    onPlay={() => setIsPlaying2(true)}
                    onPause={() => setIsPlaying2(false)}
                    onEnded={() => setIsPlaying2(false)}
                  />
                  
                  {/* Custom Play Button Overlay */}
                  {!isPlaying2 && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer transition-opacity duration-300 hover:bg-opacity-40"
                      onClick={handlePlayPause2}
                    >
                      <img
                       className="w-24 h-24 rounded-full border-gray-500 border-2"
                       src="/play_button.png"
                      />
                    </div>
                  )}
                  
                  {/* Play/Pause Button (visible when playing) */}
                  {isPlaying2 && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      onClick={handlePlayPause2}
                    >
                       <img
                       className="w-24 h-24 rounded-full border-gray-500 border-2"
                       src="/play_button.png"
                      />

                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-6">
                <div className="grid gird-cols-1 sm:grid-cols-2 gap-[43px]">
                {businessFeatures.slice(0, 2).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3.5">
                        <img
                          className="w-8 h-8 flex-shrink-0"
                          alt="Fi"
                          src={feature.icon}
                        />

                        <div className="flex flex-col gap-1 flex-1">
                          <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg tracking-[0] leading-7">
                            {feature.title}
                          </div>

                          <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[15px] tracking-[0] leading-[23px] whitespace-nowrap">
                            {feature.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3.5">
                    <img
                      className="w-8 h-8 flex-shrink-0"
                      alt="Fi"
                      src={businessFeatures[2].icon}
                    />

                    <div className="flex flex-col gap-1 flex-1">
                      <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg tracking-[0] leading-7">
                        {businessFeatures[2].title}
                      </div>

                      <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[15px] tracking-[0] leading-[23px]">
                        {businessFeatures[2].description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
