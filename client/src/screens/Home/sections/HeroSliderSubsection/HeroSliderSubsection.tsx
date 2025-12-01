import { ArrowUpRight } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    badge: {
      icon: "/background-17.svg",
      text: "PROTECTING EVERY TRANSACTION, EVERYWHERE",
    },
    title: "/heading-1---insurance-plans-for-life-s-journey.svg",
    backgroundImage: "/Hero1.png", // Add background image
    description:
      "Our advanced security network spans across 195+ countries, monitoring billions of transactions in real-time to ensure your financial operations remain secure no matter where business takes you.",
    features: [
      {
        icon: "/fi-18890334.svg",
        text: "Evidence-Driven",
      },
      {
        icon: "/fi-2311992.svg",
        text: "Privacy-First",
      },
      {
        icon: "/fi-4086231.svg",
        text: "Community-Backed",
      },
    ],
  },
  {
    badge: {
      icon: "/background-1.svg",
      text: "INTELLIGENCE THAT NEVER SLEEP",
    },
    title: "/heading-1---insurance-plans-for-life-s-journey-1.svg",
    backgroundImage: "/Hero2.png", // Add background image
    description:
      "Machine learning algorithms analyze transaction patterns, behavioral biometrics, and risk indicators to identify and prevent fraud before it happens, with 99.7% accuracy.",
    features: [
      {
        icon: "/fi-18890334.svg",
        text: "Evidence-Driven",
      },
      {
        icon: "/fi-2311992.svg",
        text: "Privacy-First",
      },
      {
        icon: "/fi-4086231.svg",
        text: "Community-Backed",
      },
    ],
  },
  {
    badge: {
      icon: "/background-4.svg",
      text: "YOUR TRUST, OUR FOUNDATION",
    },
    title: "/heading-1---insurance-plans-for-life-s-journey-2.svg",
    backgroundImage: "/Hero3.png", // Add background image
    description:
      "Bank-grade encryption, multi-layered authentication, and continuous monitoring create an impenetrable shield around your financial data and transactions.",
    features: [
      {
        icon: "/fi-18890334.svg",
        text: "Evidence-Driven",
      },
      {
        icon: "/fi-2311992.svg",
        text: "Privacy-First",
      },
      {
        icon: "/fi-4086231.svg",
        text: "Community-Backed",
      },
    ],
  },
];

export const HeroSliderSubsection = (): JSX.Element => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const navigate = useNavigate();

  const handleSlideChange = (index: number) => {
    if (index === currentSlide) return;
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full h-full flex flex-col gap-2.5 sm:gap-3 md:gap-4 lg:gap-5 bg-cover bg-center px-4 sm:px-6 md:px-12 lg:px-[110px] pt-0 sm:pt-24 md:pt-32 lg:pt-[220px] pb-20 sm:pb-24 md:pb-32 lg:pb-[220px] relative justify-center"
            style={{ 
              backgroundImage: `url(${slide.backgroundImage})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transition: isTransitioning ? 'background-size 0.5s ease-in-out' : 'none',
            }}
          >
            <div className="relative">
              {/* Pagination dots positioned just above badge */}
              {index === currentSlide && (
                <div className="absolute -top-[15px] sm:-top-[25px] md:-top-[25px] lg:-top-[25px] left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 inline-flex items-center gap-2 sm:gap-2.5 lg:gap-2.5">
                  {slides.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={() => handleSlideChange(dotIndex)}
                      className={`h-1 sm:h-1.5 lg:h-1.5 rounded-[50px] transition-all ${
                        dotIndex === currentSlide
                          ? "w-8 sm:w-10 lg:w-10 bg-app-secondary"
                          : "w-4 sm:w-5 lg:w-5 bg-[#7d7d7d] hover:bg-[#9d9d9d]"
                      }`}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-nowrap items-center justify-center sm:justify-start gap-2 sm:gap-3 md:gap-4 lg:gap-5 max-w-full lg:w-[471px] lg:h-[50px] h-auto mx-auto sm:mx-0">
                <img
                  className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[50px] lg:h-[50px] flex-shrink-0"
                  alt="Background"
                  src={slide.badge.icon}
                />
                <div className="[font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-white text-[9px] sm:text-sm md:text-base lg:text-base tracking-[0.32px] leading-[12px] sm:leading-5 md:leading-6 lg:leading-6 whitespace-nowrap">
                  {slide.badge.text}
                </div>
              </div>
            </div>
            <div className="max-w-full lg:max-w-none">
              <img
                alt="heading"
                src={slide.title}
                className="w-full max-w-full h-auto object-contain lg:w-auto lg:h-auto lg:max-w-none"
              />
            </div>
            <div className="flex flex-col items-start gap-4 sm:gap-6 md:gap-8 lg:gap-[50px] w-full max-w-full lg:w-[685px] lg:max-w-none">
              <div className="flex flex-col items-start gap-3 sm:gap-4 md:gap-5 lg:gap-[30px] w-full">
                <div className="flex flex-col items-start gap-2.5 sm:gap-3 md:gap-4 lg:gap-4 w-full">
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-neutral-300 text-xs sm:text-sm md:text-base lg:text-xl tracking-[0] leading-[18px] sm:leading-5 md:leading-6 lg:leading-8 max-w-full lg:max-w-none">
                    {slide.description}
                  </p>
                </div>

                <div className="flex flex-wrap lg:flex-nowrap items-center justify-center sm:justify-start gap-3 sm:gap-4 md:gap-6 lg:gap-16 w-full">
                  {slide.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="inline-flex items-center gap-2 sm:gap-2.5 lg:gap-2.5"
                    >
                      <img
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 flex-shrink-0"
                        alt="Feature icon"
                        src={feature.icon}
                      />
                      <div className="[font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-white text-xs sm:text-sm md:text-base lg:text-lg leading-[14px] sm:leading-4 md:leading-5 lg:leading-[22px] tracking-[0] whitespace-nowrap">
                        {feature.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-row items-center justify-center sm:justify-start gap-2.5 sm:gap-3 md:gap-4 lg:gap-5 w-full sm:w-auto lg:w-auto pb-2 sm:pb-0">
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 sm:flex-none sm:w-[180px] md:w-[200px] lg:w-[223px] h-10 sm:h-11 md:h-12 lg:h-14 bg-app-secondary hover:bg-app-secondary/90 rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-white text-xs sm:text-sm md:text-base lg:text-lg tracking-[-0.20px] leading-[14px] sm:leading-[16px] md:leading-[17px] lg:leading-[18px]"
                >
                  Get Started Free
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-[30px] lg:h-[30px] ml-1.5 sm:ml-2 lg:ml-2 flex-shrink-0" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/live-demo")}
                  className="flex-1 sm:flex-none sm:w-[160px] md:w-[180px] lg:w-[198px] h-10 sm:h-11 md:h-12 lg:h-14 border-app-secondary text-app-secondary bg-transparent hover:bg-app-secondary/10 rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-xs sm:text-sm md:text-base lg:text-lg tracking-[-0.20px] leading-[14px] sm:leading-[16px] md:leading-[17px] lg:leading-[18px]"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
