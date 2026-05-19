# Albert Garcia, Jr. — Portfolio Site Build Spec

> Handoff doc for Claude Code. Build a single-page portfolio with the structure, components, and copy below.

---

## TABLE OF CONTENTS

1. Project Overview
2. Tech Stack & Setup
3. Design System
4. Component Installation (3 from 21st.dev)
5. Theme Customizations
6. Page Structure
7. Hero — Full Spec
8. Gallery Sections — Full Spec
9. Modal/Lightbox — Full Spec
10. Section-by-Section Copy
11. About + Contact
12. Animation & Polish
13. Performance + SEO
14. Assets/Info Needed From Albert
15. Deployment

---

## 1. PROJECT OVERVIEW

A single-page personal portfolio for Albert Garcia, Jr. — a creative producer who does graphic design, video editing, photography, and videography, and also does marketing, web, and AI workflow work on the operations side.

**Audience:** Hiring managers reviewing him for creative production roles.
**Vibe:** Minimalist. Dark. Red accents. Fast. Cool animations. Not braggy, just confident.
**Voice in copy:** Warm, casual, plain English, parentheticals as asides, "wanna"/"gonna" contractions, no em dashes anywhere, slightly self-deprecating, comfortable being personal.

---

## 2. TECH STACK & SETUP

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Component system:** shadcn/ui
- **Animation:** `motion` (formerly framer-motion) + `class-variance-authority`
- **Icons:** `lucide-react`
- **Smooth scroll:** `lenis`
- **Video embeds:** `react-lite-youtube-embed`
- **Deployment:** Vercel

### Setup commands

```bash
# Initial project
pnpm create next-app@latest portfolio --typescript --tailwind --app --src-dir
cd portfolio

# shadcn
pnpm dlx shadcn@latest init
# When prompted: Default style, Slate base color (we'll override), CSS variables YES

# shadcn primitives we need
pnpm dlx shadcn@latest add dialog button badge

# Component deps (from the three 21st.dev components)
pnpm add motion framer-motion lucide-react class-variance-authority clsx tailwind-merge

# Smooth scroll + video
pnpm add lenis react-lite-youtube-embed
```

> Note: the 21st.dev components reference both `motion` and `framer-motion`. Install both to be safe.

---

## 3. DESIGN SYSTEM

### Colors (HSL for shadcn CSS variables)

Override the default shadcn theme in `src/app/globals.css`. Single dark theme, no light mode toggle.

```css
@layer base {
  :root {
    --background: 0 0% 4%;          /* #0a0a0a near-black */
    --foreground: 0 0% 96%;         /* #f5f5f5 near-white */
    --card: 0 0% 8%;
    --card-foreground: 0 0% 96%;
    --popover: 0 0% 6%;
    --popover-foreground: 0 0% 96%;
    --primary: 0 84% 60%;           /* red #ef4444 */
    --primary-foreground: 0 0% 100%;
    --secondary: 0 0% 12%;
    --secondary-foreground: 0 0% 96%;
    --muted: 0 0% 12%;
    --muted-foreground: 0 0% 53%;
    --accent: 0 84% 60%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 0 0% 12%;
    --input: 0 0% 12%;
    --ring: 0 84% 60%;
    --radius: 0.75rem;
  }

  html, body {
    background: hsl(var(--background));
    color: hsl(var(--foreground));
  }
}
```

### Typography

- **Headings:** Inter (or Geist Sans), weights 600-800, tight tracking (`-0.02em`)
- **Body:** Inter, weight 400, line-height 1.6
- **Mono (years, labels):** JetBrains Mono (or Geist Mono)

```tsx
// src/app/fonts.ts
import { Inter, JetBrains_Mono } from "next/font/google";

export const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
export const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
```

Apply on `<html>`: `className={`${sans.variable} ${mono.variable}`}`.

### Spacing

- Max content width: `max-w-[1400px]`
- Section padding: `py-24 md:py-32`
- Container padding: `px-6 md:px-12 lg:px-20`

### Animation

- Easing: `[0.16, 1, 0.3, 1]`
- Standard duration: 0.4-0.6s
- Hero entrance: ~1s with staggered children
- Respect `prefers-reduced-motion`

---

## 4. COMPONENT INSTALLATION

Install these three components from 21st.dev into `src/components/ui/`. Albert has the source code in the prompts paired with this doc.

| Component | File path | Purpose |
|-----------|-----------|---------|
| `AnimatedMarqueeHero` | `src/components/ui/hero-3.tsx` | Hero section |
| `FocusRail` | `src/components/ui/focus-rail.tsx` | Modal carousel for work items |
| `ScrollXCarousel` + helpers | `src/components/ui/scroll-x-carousel.tsx` | Horizontal scroll galleries |
| `CardHoverReveal` + helpers | `src/components/ui/reveal-on-hover.tsx` | Hover-reveal cards inside carousel |

Plus shadcn:
- `src/components/ui/dialog.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`

### Required `cn` utility

```ts
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 5. THEME CUSTOMIZATIONS TO THE COMPONENTS

The components ship with some colors that don't match our theme. Update these on install:

### `focus-rail.tsx`
- Find: `text-emerald-400` → Replace: `text-red-500` (the meta label color)
- Keep everything else as-is — `bg-neutral-950` and white text already match our look

### `scroll-x-carousel` usage
- In our usage, replace any `bg-indigo-500` references with `bg-red-500/90`
- Progress bar fill: use `bg-red-500/70` instead of `bg-indigo-500/70`

### `hero-3.tsx`
- The `ActionButton` already uses `bg-red-500` ✓
- Already uses theme variables (`bg-background`, `text-foreground`, etc.) ✓ — picks up our overrides automatically

---

## 6. PAGE STRUCTURE

Single page. Sticky nav appears after hero. Smooth-scroll between sections.

```
1. Hero (AnimatedMarqueeHero)
2. Sticky nav (appears after hero scrolls out)
3. Featured Work (ScrollXCarousel)
4. Graphic Design (ScrollXCarousel)
5. Video — Long Form (ScrollXCarousel with YouTube thumbnails)
6. Video — Short Form (ScrollXCarousel)
7. Photography (ScrollXCarousel)
8. Art Dump (ScrollXCarousel)
9. Sports Fan Art (ScrollXCarousel)
10. Tech + Marketing (clean list, NOT a carousel)
11. About
12. Contact / Footer
```

---

## 7. HERO — FULL SPEC

Use `AnimatedMarqueeHero` from `hero-3.tsx`.

```tsx
// src/components/Hero.tsx
import { AnimatedMarqueeHero } from "@/components/ui/hero-3";

const HERO_IMAGES = [
  // 12-16 of Albert's strongest images, in /public/hero/
  "/hero/01.jpg",
  "/hero/02.jpg",
  // ...etc
];

export function Hero() {
  return (
    <AnimatedMarqueeHero
      tagline="Available for creative work"
      title={
        <>
          Creative production
          <br />
          for growing businesses.
        </>
      }
      description="Graphic design. Video editing. Photography. Videography. AI-powered workflows."
      ctaText="See the work"
      images={HERO_IMAGES}
    />
  );
}
```

### Adjustments

- Wire the CTA `ActionButton` to smooth-scroll to `#featured-work`
- Tagline pill is optional — "Available for creative work" is a good signal for hiring managers; remove if too much
- Title line break stays as shown

---

## 8. GALLERY SECTIONS — FULL SPEC

Build a reusable `GallerySection` that wraps `ScrollXCarousel`.

### Reusable section component

```tsx
// src/components/GallerySection.tsx
"use client";

import {
  ScrollXCarousel,
  ScrollXCarouselContainer,
  ScrollXCarouselProgress,
  ScrollXCarouselWrap,
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
  videoEmbed?: string;
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

export function GallerySection({ id, title, intro, items, onItemClick }: GallerySectionProps) {
  return (
    <section id={id} className="py-24 md:py-32">
      <div className="px-6 md:px-12 lg:px-20 mb-12 max-w-[1400px] mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">{title}</h2>
        <p className="text-muted-foreground max-w-xl">{intro}</p>
      </div>

      <ScrollXCarousel className="h-[150vh]">
        <ScrollXCarouselContainer className="h-dvh place-content-center flex flex-col gap-8 py-12">
          <div className="pointer-events-none w-[12vw] h-[103%] absolute inset-[0_auto_0_0] z-10 bg-[linear-gradient(90deg,_hsl(var(--background))_35%,_transparent)]" />
          <div className="pointer-events-none bg-[linear-gradient(270deg,_hsl(var(--background))_35%,_transparent)] w-[15vw] h-[103%] absolute inset-[0_0_0_auto] z-10" />

          <ScrollXCarouselWrap className="flex-4/5 flex space-x-8 [&>*:first-child]:ml-8">
            {items.map((item) => (
              <CardHoverReveal
                key={item.id}
                className="min-w-[70vw] md:min-w-[38vw] xl:min-w-[30vw] rounded-xl border border-border cursor-pointer"
                onClick={() => onItemClick(item, items)}
              >
                <CardHoverRevealMain>
                  <img alt={item.title} src={item.imageSrc} className="size-full aspect-square object-cover" />
                </CardHoverRevealMain>
                {item.copyTier !== "none" && (
                  <CardHoverRevealContent className="space-y-3 rounded-2xl bg-black/60 backdrop-blur-xl p-5">
                    {(item.client || item.year) && (
                      <div className="flex flex-wrap gap-2">
                        {item.client && <Badge className="rounded-full bg-red-500/90 hover:bg-red-500">{item.client}</Badge>}
                        {item.year && <Badge variant="secondary" className="rounded-full">{item.year}</Badge>}
                      </div>
                    )}
                    <div className="space-y-1">
                      <h3 className="text-white font-medium">{item.title}</h3>
                      {item.role && <p className="text-white/70 text-sm">{item.role}</p>}
                    </div>
                  </CardHoverRevealContent>
                )}
              </CardHoverReveal>
            ))}
          </ScrollXCarouselWrap>

          <ScrollXCarouselProgress
            className="bg-secondary mx-8 h-1 rounded-full overflow-hidden"
            progressStyle="size-full bg-red-500/70 rounded-full"
          />
        </ScrollXCarouselContainer>
      </ScrollXCarousel>
    </section>
  );
}
```

### Section heights

- Default carousel section: `h-[150vh]`
- Sections with <5 items: drop to `h-[100vh]` so it doesn't feel sluggish

---

## 9. MODAL / LIGHTBOX — FULL SPEC

Wrap `FocusRail` inside shadcn `Dialog`.

```tsx
// src/components/WorkModal.tsx
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FocusRail, type FocusRailItem } from "@/components/ui/focus-rail";
import type { WorkItem } from "./GallerySection";

interface WorkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: WorkItem[];
  initialIndex: number;
}

export function WorkModal({ open, onOpenChange, items, initialIndex }: WorkModalProps) {
  const focusRailItems: FocusRailItem[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.thought || item.role,
    imageSrc: item.imageSrc,
    meta: [item.year, item.client].filter(Boolean).join(" · ") || undefined,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] w-full h-screen border-0 bg-neutral-950 p-0 sm:rounded-none">
        <FocusRail items={focusRailItems} initialIndex={initialIndex} loop autoPlay={false} />
      </DialogContent>
    </Dialog>
  );
}
```

### Wiring it up in `page.tsx`

```tsx
"use client";

import { useState } from "react";
import { GallerySection, type WorkItem } from "@/components/GallerySection";
import { WorkModal } from "@/components/WorkModal";
import { Hero } from "@/components/Hero";
import { StickyNav } from "@/components/StickyNav";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { TechMarketing } from "@/components/TechMarketing";

import { FEATURED } from "@/data/featured";
import { GRAPHIC_DESIGN } from "@/data/graphic-design";
import { VIDEO_LONG } from "@/data/video-long";
import { VIDEO_SHORT } from "@/data/video-short";
import { PHOTOGRAPHY } from "@/data/photography";
import { ART_DUMP } from "@/data/art-dump";
import { SPORTS } from "@/data/sports";

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
    <main>
      <Hero />
      <StickyNav />
      <GallerySection id="featured-work" title="Featured Work" intro="A few favorites to start with." items={FEATURED} onItemClick={handleItemClick} />
      <GallerySection id="graphic-design" title="Graphic Design" intro="Design work for clients, my own businesses, and pro bono projects from way back. Logos, social media, print, the usual suspects." items={GRAPHIC_DESIGN} onItemClick={handleItemClick} />
      <GallerySection id="video-long" title="Video — Long Form" intro="Videos I've written, shot, edited, and sometimes narrated. The Holy Week mini-doc and the tech reviews are the favorites." items={VIDEO_LONG} onItemClick={handleItemClick} />
      <GallerySection id="video-short" title="Video — Short Form" intro="Shorter cuts. Mostly social media stuff, mix of client and personal." items={VIDEO_SHORT} onItemClick={handleItemClick} />
      <GallerySection id="photography" title="Photography" intro="Pitik. I've loved taking pictures for as long as I can remember." items={PHOTOGRAPHY} onItemClick={handleItemClick} />
      <GallerySection id="art-dump" title="Art Dump" intro="@rblt.dmp on Instagram. A personal project I started in 2021 after seeing Beeple's first 5000 days NFT. Random stuff made in spare time. (Kinda sad NFTs are basically worthless now.)" items={ART_DUMP} onItemClick={handleItemClick} />
      <GallerySection id="sports" title="Sports Fan Art" intro="Basketball fan. Fan art happens." items={SPORTS} onItemClick={handleItemClick} />
      <TechMarketing />
      <About />
      <Contact />
      <WorkModal open={modalOpen} onOpenChange={setModalOpen} items={modalItems} initialIndex={modalIndex} />
    </main>
  );
}
```

### Modal notes

- `FocusRail` already handles arrow keys, wheel scroll, swipe/drag, and prev/next buttons ✓
- shadcn `Dialog` adds ESC and click-outside-to-close ✓
- Add a small close X top-right inside DialogContent for mobile clarity

---

## 10. SECTION-BY-SECTION COPY

Already wired into the `page.tsx` above. Reference for data files:

### Modal copy tiers

| Section | Tier |
|---------|------|
| Featured Work | full |
| Graphic Design (client work) | full |
| Graphic Design (logos) | light |
| Graphic Design (personal) | none |
| Video — Long Form | full |
| Video — Short Form | light |
| Photography | none |
| Art Dump | none |
| Sports Fan Art | none |

### Long-form video modal copy (examples for the data file)

```
Holy Week Mini-Documentary
2021 · Personal project · Wrote, narrated, edited
A labor of love about my hometown's Holy Week traditions. Probably the project I'm proudest of (and the one that took the longest to finish).

Tech Review [title]
[Year] · Personal · Wrote, shot, edited
My favorite from the tech review days. Full one-person production.

Client Instructional Video
[Year] · Client work · Edited
Part of a user manual series I managed for one of my clients.

Hometown Vlog
[Year] · Personal · Shot, edited
Summer vacation with the family.
```

### Tech + Marketing section

```tsx
// src/components/TechMarketing.tsx
const ITEMS = [
  { label: "printplay.net", description: "Hardcoded site built with the help of AI tools.", href: "https://printplay.net" },
  { label: "haumstudios.com", description: "Major overhaul while I was Marketing Operations Manager for the brand.", href: "https://haumstudios.com" },
  { label: "dannipomplun.com", description: "Ongoing Divi maintenance for a yoga teacher brand.", href: "https://dannipomplun.com" },
  { label: "Sales campaigns + email sequences", description: "$100K+ generated per campaign for client work, designed end-to-end including newsletters, automated sequences, and ManyChat flows." },
  { label: "AI workflow design", description: "Setting up AI tools and prompts that actually save time on creative and ops work (and figuring out where they don't)." },
];

export function TechMarketing() {
  return (
    <section id="tech-marketing" className="py-24 md:py-32 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Tech + Marketing</h2>
      <p className="text-muted-foreground max-w-xl mb-12">
        I also help businesses on the operations side: web development, marketing campaigns, automation, and AI-powered workflows. A few examples:
      </p>
      <ul className="divide-y divide-border">
        {ITEMS.map((item) => (
          <li key={item.label} className="py-5 group">
            {item.href ? (
              <a href={item.href} target="_blank" rel="noreferrer" className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 hover:text-red-500 transition-colors">
                <span className="font-medium md:w-72 flex items-center gap-2">
                  {item.label}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </span>
                <span className="text-muted-foreground">{item.description}</span>
              </a>
            ) : (
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                <span className="font-medium md:w-72">{item.label}</span>
                <span className="text-muted-foreground">{item.description}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

---

## 11. ABOUT + CONTACT

### About

```tsx
// src/components/About.tsx
export function About() {
  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">About</h2>
          <div className="space-y-5 text-foreground/90 leading-relaxed max-w-[55ch]">
            <p>Hey! I'm Albert (rebalt on the internet, though no one actually calls me that).</p>
            <p>I help businesses with their creative production. Graphic design, video editing, photography, videography. I've been making this kind of stuff for as long as I can remember, mostly self-taught, because these are the things I've genuinely been interested in and passionate about since I was a kid.</p>
            <p>I also run a few small businesses, which is how I ended up picking up marketing, automation, web development, and AI workflows along the way. I love figuring out where AI actually saves time on a creative job vs. where it just feels cool but wastes it.</p>
            <p>Turns out the creative work and the operations work feed each other (designing a sales funnel is basically storyboarding with extra steps).</p>
            <p>If you wanna chat, contact info's right below.</p>
            <p>Cheers!</p>
          </div>
        </div>
        <div className="aspect-[4/5] bg-card rounded-2xl overflow-hidden">
          <img src="/about-photo.jpg" alt="Albert Garcia, Jr." className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}
```

### Contact / Footer

```tsx
// src/components/Contact.tsx
export function Contact() {
  return (
    <footer id="contact" className="py-24 md:py-32 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto border-t border-border">
      <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">Let's work together.</h2>
      <dl className="grid sm:grid-cols-2 gap-y-4 gap-x-12 font-mono text-sm">
        <div className="flex gap-6 items-baseline">
          <dt className="text-muted-foreground w-24">email</dt>
          <dd><a href="mailto:albertrgarciajr@gmail.com" className="hover:text-red-500 transition-colors">albertrgarciajr@gmail.com</a></dd>
        </div>
        <div className="flex gap-6 items-baseline">
          <dt className="text-muted-foreground w-24">instagram</dt>
          <dd><a href="https://instagram.com/[HANDLE]" target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors">@[HANDLE]</a></dd>
        </div>
        <div className="flex gap-6 items-baseline">
          <dt className="text-muted-foreground w-24">behance</dt>
          <dd><a href="https://behance.net/albertjrgarcia" target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors">/albertjrgarcia</a></dd>
        </div>
        <div className="flex gap-6 items-baseline">
          <dt className="text-muted-foreground w-24">resume</dt>
          <dd><a href="/resume.pdf" download className="hover:text-red-500 transition-colors">Download PDF ↓</a></dd>
        </div>
      </dl>
      <p className="mt-24 text-xs text-muted-foreground font-mono">© Albert Garcia, Jr.</p>
    </footer>
  );
}
```

---

## 12. ANIMATION & POLISH

### Sticky nav

```tsx
// src/components/StickyNav.tsx
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "featured-work", label: "Featured" },
  { id: "graphic-design", label: "Design" },
  { id: "video-long", label: "Video" },
  { id: "photography", label: "Photo" },
  { id: "tech-marketing", label: "Tech + Marketing" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function StickyNav() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-2 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-border text-xs font-mono"
        >
          <ul className="flex gap-1">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors block">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
```

### Lenis smooth scroll

```tsx
// src/components/SmoothScroll.tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
  return null;
}
```

Mount once in `layout.tsx`. **IMPORTANT:** Lenis can conflict with the `ScrollXCarousel` (which depends on native scroll progress). Test carefully. If issues arise, disable Lenis on `<main>` and only enable it on hero/about/contact regions, OR skip Lenis entirely and rely on native smooth scroll.

### Section reveal on scroll

Wrap section headers with `motion.div` + `whileInView`:

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
  {/* content */}
</motion.div>
```

---

## 13. PERFORMANCE + SEO

### Images
- Use `next/image` everywhere once real assets are in place (replace raw `<img>` in `GallerySection` and `Hero`)
- `priority` only on hero
- Define explicit width/height
- Next handles AVIF/WebP automatically

### Video
- Use `react-lite-youtube-embed` for video thumbnails (lazy-loads iframe only on click)

### Metadata

```tsx
// src/app/layout.tsx
export const metadata = {
  title: "Albert Garcia, Jr. — Creative Production",
  description: "Creative production for growing businesses. Graphic design, video editing, photography, videography, AI-powered workflows.",
  openGraph: {
    title: "Albert Garcia, Jr. — Creative Production",
    description: "Creative production for growing businesses.",
    images: ["/og.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Albert Garcia, Jr. — Creative Production",
    description: "Creative production for growing businesses.",
    images: ["/og.jpg"],
  },
};
```

### Other
- `app/sitemap.ts` and `app/robots.ts`
- Favicon + Apple touch icons in `/public`
- Person schema JSON-LD in `<head>`
- Lighthouse target: 95+ Performance, 100 Accessibility, 100 SEO

---

## 14. ASSETS / INFO NEEDED FROM ALBERT

- [ ] 12-16 hero marquee images (mix of strongest work, ~900px wide each, JPG)
- [ ] Featured Work picks (3-4 hero pieces with full metadata)
- [ ] Item data per section: image, title, year, client, role, thought
- [ ] About-section photo (4:5 aspect, casual but professional)
- [ ] Instagram handle for contact footer
- [ ] Resume PDF (`/public/resume.pdf`)
- [ ] OG image (1200x630, `/public/og.jpg`)
- [ ] Favicon set

Data file format:

```ts
// src/data/graphic-design.ts
import type { WorkItem } from "@/components/GallerySection";

export const GRAPHIC_DESIGN: WorkItem[] = [
  {
    id: "haum-launch",
    title: "HAUM Studios Launch Campaign",
    year: "2024",
    client: "HAUM Studios",
    role: "Designer + Marketing Lead",
    thought: "Multi-channel rollout for a new studio location.",
    imageSrc: "/work/graphic-design/haum-launch.jpg",
    copyTier: "full",
  },
  // ...etc
];
```

One file per section in `src/data/`.

---

## 15. DEPLOYMENT

1. Push to GitHub
2. Connect repo to Vercel → auto-deploy
3. Set production domain
4. Verify OG image renders in social previews via opengraph.xyz
5. Run Lighthouse audit, fix anything under 90

---

## OPEN QUESTIONS LEFT TO ALBERT

1. Keep "Available for creative work" tagline pill in hero, or remove?
2. About section: keep photo column, or text-only?
3. Custom domain?

---

## BUILD ORDER FOR CLAUDE CODE

1. Init Next.js + shadcn + dark theme overrides + fonts
2. Drop in the three 21st.dev components + `cn` utility + dependencies
3. Build `GallerySection`
4. Build `WorkModal` wrapping `FocusRail`
5. Build `Hero` with placeholder marquee images
6. Build `StickyNav`, `SmoothScroll` wrapper
7. Build `About`, `Contact`, `TechMarketing`
8. Wire everything in `page.tsx` with placeholder data files
9. Replace placeholders with real data as Albert provides
10. Performance pass + Lighthouse
11. Deploy to Vercel

---

End of spec. Ship it.
