"use client";

import { useState } from "react";
import { GallerySection, type WorkItem } from "@/components/GallerySection";
import { WorkModal } from "@/components/WorkModal";
import { Hero } from "@/components/Hero";
import { StickyNav } from "@/components/StickyNav";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { TechMarketing } from "@/components/TechMarketing";

import {
  SECTIONS,
  SOCIAL_MEDIA,
  BRANDING,
  SPORTS,
  ART_DUMP,
  VIDEO_LONG,
  VIDEO_SHORT,
  PHOTOGRAPHY,
} from "@/data/content";

// Map section IDs to their work items
const SECTION_ITEMS: Record<string, WorkItem[]> = {
  "social-media": SOCIAL_MEDIA,
  "branding": BRANDING,
  sports: SPORTS,
  "art-dump": ART_DUMP,
  "video-long": VIDEO_LONG,
  "video-short": VIDEO_SHORT,
  photography: PHOTOGRAPHY,
};

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<WorkItem[]>([]);
  const [modalIndex, setModalIndex] = useState(0);

  const handleItemClick = (item: WorkItem, items: WorkItem[]) => {
    setModalItems(items);
    setModalIndex(items.findIndex((i) => i.id === item.id));
    setModalOpen(true);
  };

  return (
    <main className="relative z-10 overflow-x-hidden">
      <Hero />
      <StickyNav />
      {SECTIONS.map((section) => {
        const items = SECTION_ITEMS[section.id];
        if (!items) return null;
        return (
          <GallerySection
            key={section.id}
            id={section.id}
            title={section.title}
            intro={section.intro}
            items={items}
            onItemClick={handleItemClick}
          />
        );
      })}
      <TechMarketing />
      <About />
      <Contact />
      <WorkModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        items={modalItems}
        initialIndex={modalIndex}
      />
    </main>
  );
}
