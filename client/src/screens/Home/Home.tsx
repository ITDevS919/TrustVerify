import React from "react";
import { Badge } from "../../components/ui/badge";
import { BackgroundSubsection } from "./sections/BackgroundSubsection";
import { BackgroundWrapperSubsection } from "./sections/BackgroundWrapperSubsection";
import { DivSubsection } from "./sections/DivSubsection";
import { DivWrapperSubsection } from "./sections/DivWrapperSubsection";
import { Footer } from "../../components/Footer";
import { FormSubsection } from "./sections/FormSubsection";
import { Frame1Subsection } from "./sections/Frame1Subsection";
import { FrameSubsection } from "./sections/FrameSubsection";
import { FrameWrapperSubsection } from "./sections/FrameWrapperSubsection";
import { Header } from "../../components/Header";
import { HeroSliderSubsection } from "./sections/HeroSliderSubsection";
import { SectionComponentNodeSubsection } from "./sections/SectionComponentNodeSubsection";
import { SEO } from "../../components/SEO";
import { useQuery } from "@tanstack/react-query";

export const Home = (): JSX.Element => {
  // Fetch decorative images from API
  const { data: decorativeImages } = useQuery({
    queryKey: ['homepage-content', 'decorative_images'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/homepage-content?section=decorative_images');
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
      } catch (error) {
        console.error('Failed to fetch decorative images:', error);
        return [];
      }
    },
    staleTime: 0, // Always refetch when data is requested
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Always refetch on mount
  });

  // Get decorative image URLs with fallbacks
  const getDecorativeImage = (key: string, fallback: string) => {
    const image = decorativeImages?.find((img: any) => img.key === key && img.isActive);
    return image?.imageUrl || fallback;
  };

  return (
    <>
      <SEO
        title="TrustVerify - Secure Fraud Prevention & Identity Verification Platform"
        description="TrustVerify provides comprehensive fraud prevention, identity verification (KYC/AML), trust scoring, and secure escrow services. Protect your business with advanced cybersecurity solutions."
        keywords="fraud prevention, identity verification, KYC, AML, trust scoring, escrow services, cybersecurity, fintech, secure transactions, TrustVerify"
        canonicalUrl="https://www.trustverify.co.uk/"
      />
      <main className="bg-white overflow-hidden w-full relative">
        <img
          className="absolute top-[1177px] left-[-227px] w-[399px] h-[528px] z-10 pointer-events-none"
          alt="Nate shape"
          src={getDecorativeImage('decorative_nate_shape', '/nate-shape.svg')}
        />

        <img
          className="absolute top-[2044px] left-[100px] w-[30px] h-[30px] z-10 pointer-events-none"
          alt="Icon star"
          src={getDecorativeImage('decorative_star_1', '/icon-star.svg')}
        />

        <img
          className="absolute top-[1091px] right-[101px] w-[30px] h-[30px] z-10 pointer-events-none"
          alt="Icon star"
          src={getDecorativeImage('decorative_star_2', '/icon-star-3.svg')}
        />

        <img
          className="absolute top-[7089px] right-[120px] w-[30px] h-[30px] z-10 pointer-events-none"
          alt="Icon star"
          src={getDecorativeImage('decorative_star_3', '/icon-star.svg')}
        />

        <img
          className="absolute top-[7777px] left-[60px] w-8 h-8 z-10 pointer-events-none"
          alt="Icon star"
          src={getDecorativeImage('decorative_star_4', '/icon-star-1.svg')}
        />

        <Header />
        <HeroSliderSubsection />
        <FrameSubsection />
        <FrameWrapperSubsection />
        <Frame1Subsection />
        <BackgroundSubsection />
        <DivWrapperSubsection />
        <DivSubsection />
        <BackgroundWrapperSubsection />
        <FormSubsection />
        {/* <SectionComponentNodeSubsection /> */}
        <Footer />
      </main>
    </>
  );
};
