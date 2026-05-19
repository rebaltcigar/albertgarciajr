"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import {
  DragCarousel,
  DragCarouselContainer,
  DragCarouselProgress,
  DragCarouselWrap,
} from "@/components/ui/scroll-x-carousel";
import {
  CardHoverReveal,
  CardHoverRevealContent,
  CardHoverRevealMain,
} from "@/components/ui/reveal-on-hover";
import { Badge } from "@/components/ui/badge";

export type WorkItem = {
  id: string;
  title: string;
  year?: string;
  client?: string;
  role?: string;
  thought?: string;
  imageSrc: string;
  /** "youtube" | "instagram" | "tiktok" | "video" — leave blank for images */
  mediaType?: "image" | "youtube" | "instagram" | "tiktok" | "video";
  /** YouTube video ID (e.g. "dQw4w9WgXcQ") */
  videoEmbed?: string;
  /** Full embed URL for Instagram/TikTok */
  embedUrl?: string;
  /** Direct mp4/webm video URL */
  videoSrc?: string;
  /** Aspect ratio override for embeds (e.g. portrait for Shorts) */
  aspectRatio?: "video" | "portrait";
  tools?: string[];
  copyTier: "full" | "light" | "none";
};

interface GallerySectionProps {
  id: string;
  title: string;
  intro: string;
  items: WorkItem[];
  onItemClick: (item: WorkItem, items: WorkItem[]) => void;
}

function hasMedia(item: WorkItem) {
  return (
    item.mediaType &&
    item.mediaType !== "image" &&
    (item.videoEmbed || item.embedUrl || item.videoSrc)
  );
}

export function GallerySection({
  id,
  title,
  intro,
  items,
  onItemClick,
}: GallerySectionProps) {
  return (
    <section id={id} className="py-16 md:py-24 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
          {title}
        </h2>
        <p className="text-muted-foreground max-w-xl">{intro}</p>
      </motion.div>

      <DragCarousel>
        <DragCarouselContainer>
          {/* Right-side fade only */}
          <div className="pointer-events-none bg-[linear-gradient(270deg,_hsl(var(--background))_35%,_transparent)] w-[10vw] h-full absolute inset-[0_0_0_auto] z-10" />

          <DragCarouselWrap className="gap-6 py-4">
            {items.map((item) => (
              <CardHoverReveal
                key={item.id}
                className="h-[240px] sm:h-[280px] md:h-[320px] lg:h-[360px] w-max rounded-xl border border-border cursor-pointer group snap-start flex-shrink-0 bg-neutral-900 overflow-hidden"
                onClick={() => onItemClick(item, items)}
              >
                <CardHoverRevealMain>
                  <div className="relative h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={item.title}
                      src={item.imageSrc}
                      loading="lazy"
                      className="h-full w-auto object-contain"
                    />
                    {/* Play icon overlay for media items */}
                    {hasMedia(item) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-black/50 backdrop-blur-sm p-3 ring-1 ring-white/20">
                          <Play className="h-6 w-6 text-white fill-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardHoverRevealMain>
                {item.copyTier !== "none" && (
                  <CardHoverRevealContent className="space-y-3 rounded-2xl bg-black/60 backdrop-blur-xl p-5">
                    {(item.client || item.year) && (
                      <div className="flex flex-wrap gap-2">
                        {item.client && (
                          <Badge className="rounded-full bg-red-500/90 hover:bg-red-500">
                            {item.client}
                          </Badge>
                        )}
                        {item.year && (
                          <Badge
                            variant="secondary"
                            className="rounded-full font-mono"
                          >
                            {item.year}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="space-y-1">
                      <h3 className="text-white font-medium">{item.title}</h3>
                      {item.role && (
                        <p className="text-white/70 text-sm">{item.role}</p>
                      )}
                    </div>
                  </CardHoverRevealContent>
                )}
              </CardHoverReveal>
            ))}
          </DragCarouselWrap>

          <DragCarouselProgress
            className="bg-secondary mt-6 h-1 rounded-full overflow-hidden"
            progressStyle="size-full bg-red-500/70 rounded-full"
          />
        </DragCarouselContainer>
      </DragCarousel>
    </section>
  );
}
