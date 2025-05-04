import Hero from "@/components/sections/hero";
import BentoGrid from "@/components/sections/bento-grid";
// import FeaturesTabs from "@/components/sections/features-tabs";
import Pricing from "@/components/sections/pricing";
import HowItWorks from "@/components/sections/how-it-works";
import Problem from "@/components/sections/problem";
// import TrustedBy from "@/components/sections/trusted-by";
// import WallOfLove from "@/components/sections/wall-of-love";
import Carousel from "@/components/sections/carousel";
import FAQ from "@/components/sections/faq";
// import CTA from "@/components/sections/cta";
import Contact from "@/components/sections/contact";
// import Features from "@/components/sections/features";
import Stats from "@/components/sections/stats";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <TrustedBy /> */}
      <Problem />
      <HowItWorks />
      <BentoGrid />
      <Carousel />
      {/* <FeaturesTabs /> */}
      {/* <Features /> */}
      <Stats />
      {/* <WallOfLove /> */}
      <Pricing />
      <FAQ />
      <Contact />
      {/* <CTA /> */}
    </>
  );
}
