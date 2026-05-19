"use client";

import { AnimatedMarqueeHero } from "@/components/ui/hero-3";
import { HERO } from "@/data/content";

export function Hero() {
  const scrollToWork = () => {
    const target = document.getElementById("social-media");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const title = (
    <>
      Creative production for{" "}
      <span className="text-red-500">growing businesses.</span>
    </>
  );

  return (
    <AnimatedMarqueeHero
      tagline={HERO.name}
      title={title}
      description={HERO.description}
      ctaText={HERO.ctaText}
      onCtaClick={scrollToWork}
      images={HERO.images}
    />
  );
}
