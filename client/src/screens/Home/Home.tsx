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

export const Home = (): JSX.Element => {
  return (
    <main className="bg-white overflow-hidden w-full relative">
      <img
        className="absolute top-[1177px] left-[-227px] w-[399px] h-[528px] z-10 pointer-events-none"
        alt="Nate shape"
        src="/nate-shape.svg"
      />

      <img
        className="absolute top-[2044px] left-[100px] w-[30px] h-[30px] z-10 pointer-events-none"
        alt="Icon star"
        src="/icon-star.svg"
      />

      <img
        className="absolute top-[1091px] right-[101px] w-[30px] h-[30px] z-10 pointer-events-none"
        alt="Icon star"
        src="/icon-star-3.svg"
      />

      <img
        className="absolute top-[7089px] right-[120px] w-[30px] h-[30px] z-10 pointer-events-none"
        alt="Icon star"
        src="/icon-star.svg"
      />

      <img
        className="absolute top-[7777px] left-[60px] w-8 h-8 z-10 pointer-events-none"
        alt="Icon star"
        src="/icon-star-1.svg"
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
      <SectionComponentNodeSubsection />
      <Footer />
    </main>
  );
};
