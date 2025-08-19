"use client";

import BannerSection from "./sections/banner/page";
import HeroSection from "./sections/hero/page";
import LegacySection from "./sections/legacy/page";
import MissionSection from "./sections/mission/page";
import PhilosophySection from "./sections/philosophy/page";
import GallerySection from "./sections/gallery/page";
import CraftsmanshipSection from "./sections/craftsmanship/page";
import PackagingSection from "./sections/packaging/page";
import CTASection from "./sections/cta/page";

export default function AboutPage() {
  return (
    <div className="bg-white scroll-smooth">
      <BannerSection />
      <HeroSection />
      <LegacySection />
      <MissionSection />
      <PhilosophySection />
      <GallerySection />
      <CraftsmanshipSection />
      <PackagingSection />
      <CTASection />
    </div>
  );
}
