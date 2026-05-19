import type { WorkItem } from "@/components/GallerySection";
import siteContent from "./site-content.json";

// ---------------------------------------------------------------------------
// Types for non-WorkItem content
// ---------------------------------------------------------------------------

export type TechMarketingItem = {
  label: string;
  description: string;
  href?: string;
};

export type ContactLink = {
  label: string;
  text: string;
  href: string;
  external?: boolean;
  download?: boolean;
};

export type AboutContent = {
  heading: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
};

export type ContactContent = {
  heading: string;
  links: ContactLink[];
};

export type HeroContent = {
  name: string;
  title: string;
  description: string;
  ctaText: string;
  images: string[];
};

export type SectionMeta = {
  id: string;
  title: string;
  intro: string;
};

// ---------------------------------------------------------------------------
// Exports — same names the rest of the app already uses
// ---------------------------------------------------------------------------

export const HERO: HeroContent = siteContent.hero;
export const HERO_IMAGES: string[] = siteContent.hero.images;
export const SECTIONS: SectionMeta[] = siteContent.sections;

// Design sub-sections
export const SOCIAL_MEDIA: WorkItem[] = siteContent.socialMedia as WorkItem[];
export const BRANDING: WorkItem[] = siteContent.branding as WorkItem[];
export const SPORTS: WorkItem[] = siteContent.sports as WorkItem[];
export const ART_DUMP: WorkItem[] = siteContent.artDump as WorkItem[];

// Video & Photo
export const VIDEO_LONG: WorkItem[] = siteContent.videoLong as WorkItem[];
export const VIDEO_SHORT: WorkItem[] = siteContent.videoShort as WorkItem[];
export const PHOTOGRAPHY: WorkItem[] = siteContent.photography as WorkItem[];

export const TECH_MARKETING_ITEMS: TechMarketingItem[] = siteContent.techMarketing;
export const ABOUT_CONTENT: AboutContent = siteContent.about;
export const CONTACT_CONTENT: ContactContent = siteContent.contact;
