"use client";

import * as React from "react";
import { motion, AnimatePresence, PanInfo, Transition } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SkeletonImg } from "@/components/ui/skeleton-img";

export type FocusRailItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc: string;
  href?: string;
  meta?: string;
  /** Embedded media support */
  mediaType?: "image" | "youtube" | "instagram" | "tiktok" | "video";
  videoEmbed?: string;
  embedUrl?: string;
  videoSrc?: string;
  aspectRatio?: "video" | "portrait";
};

interface FocusRailProps {
  items: FocusRailItem[];
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

const BASE_SPRING: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
};

const TAP_SPRING: Transition = {
  type: "spring",
  stiffness: 450,
  damping: 18,
  mass: 1,
};

// ---------------------------------------------------------------------------
// Media embed renderer
// ---------------------------------------------------------------------------

function MediaEmbed({ item }: { item: FocusRailItem }) {
  if (item.mediaType === "youtube" && item.videoEmbed) {
    const isPortrait = item.aspectRatio === "portrait";
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${item.videoEmbed}?autoplay=1&rel=0&modestbranding=1`}
        title={item.title}
        allow="autoplay; fullscreen; picture-in-picture"
        className={cn(
          "rounded-2xl bg-black pointer-events-auto shadow-xl border-t border-white/20",
          isPortrait 
            ? "h-full w-auto max-w-[85vw]" 
            : "w-[90vw] md:w-[60vw] max-w-[900px] h-auto max-h-full"
        )}
        style={{ aspectRatio: isPortrait ? "9/16" : "16/9" }}
      />
    );
  }

  if (
    (item.mediaType === "instagram" || item.mediaType === "tiktok") &&
    item.embedUrl
  ) {
    return (
      <iframe
        src={item.embedUrl}
        title={item.title}
        allow="autoplay; fullscreen; picture-in-picture"
        className="h-full w-auto max-w-[85vw] rounded-2xl bg-black pointer-events-auto shadow-xl border-t border-white/20"
        style={{ aspectRatio: "9/16" }}
      />
    );
  }

  if (item.mediaType === "video" && item.videoSrc) {
    return (
      <video
        src={item.videoSrc}
        controls
        playsInline
        autoPlay
        className="w-[90vw] md:w-[60vw] max-w-[900px] h-auto max-h-full rounded-2xl bg-black object-contain pointer-events-auto shadow-xl border-t border-white/20"
        style={{ aspectRatio: "16/9" }}
      />
    );
  }

  return null;
}

function hasMedia(item: FocusRailItem) {
  return (
    item.mediaType &&
    item.mediaType !== "image" &&
    (item.videoEmbed || item.embedUrl || item.videoSrc)
  );
}

export function FocusRail({
  items,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  interval = 4000,
  className,
}: FocusRailProps) {
  const [active, setActive] = React.useState(initialIndex);
  const [isHovering, setIsHovering] = React.useState(false);
  const lastWheelTime = React.useRef<number>(0);

  React.useEffect(() => {
    setActive(initialIndex);
  }, [initialIndex]);

  const count = items.length;
  const activeIndex = count > 0 ? wrap(0, count, active) : 0;
  const activeItem = items[activeIndex];

  const handlePrev = React.useCallback(() => {
    if (!loop && active === 0) return;
    setActive((p) => p - 1);
  }, [loop, active]);

  const handleNext = React.useCallback(() => {
    if (!loop && active === count - 1) return;
    setActive((p) => p + 1);
  }, [loop, active, count]);

  const onWheel = React.useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < 400) return;

      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;

      if (Math.abs(delta) > 20) {
        if (delta > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        lastWheelTime.current = now;
      }
    },
    [handleNext, handlePrev]
  );

  React.useEffect(() => {
    if (!autoPlay || isHovering) return;
    const timer = setInterval(() => handleNext(), interval);
    return () => clearInterval(timer);
  }, [autoPlay, isHovering, handleNext, interval]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) =>
    Math.abs(offset) * velocity;

  const onDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo
  ) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      handleNext();
    } else if (swipe > swipeConfidenceThreshold) {
      handlePrev();
    }
  };

  const visibleIndices = [-2, -1, 0, 1, 2];

  if (!activeItem) {
    return null;
  }

  const mediaAvailable = hasMedia(activeItem);

  return (
    <div
      className={cn(
        "group relative flex h-full min-h-[500px] w-full flex-col overflow-hidden bg-neutral-950 text-white outline-none select-none overflow-x-hidden",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`bg-${activeItem.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <SkeletonImg
              src={activeItem.imageSrc}
              alt=""
              wrapperClassName="h-full w-full"
              className="h-full w-full object-cover blur-3xl saturate-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Stage */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-4 md:px-8">
        <motion.div
          className="relative mx-auto flex h-[65vh] min-h-[480px] md:min-h-0 md:h-[70vh] w-full max-w-6xl items-center justify-center [perspective:1200px] cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
        >
          {visibleIndices.map((offset) => {
            const absIndex = active + offset;
            const index = wrap(0, count, absIndex);
            const item = items[index];

            if (!loop && (absIndex < 0 || absIndex >= count)) return null;

            const isCenter = offset === 0;
            const dist = Math.abs(offset);

            const xOffset = offset * (typeof window !== "undefined" && window.innerWidth < 768 ? 200 : 320);
            const zOffset = -dist * 180;
            const scale = isCenter ? 1 : 0.85;
            const rotateY = offset * -20;
            const opacity = isCenter ? 1 : Math.max(0.1, 1 - dist * 0.5);
            const blur = isCenter ? 0 : dist * 6;
            const brightness = isCenter ? 1 : 0.5;

            return (
              <motion.div
                key={absIndex}
                className={cn(
                  "absolute h-full w-max flex items-center justify-center transition-shadow duration-300 rounded-2xl",
                  isCenter ? "z-20" : "z-10 pointer-events-none"
                )}
                initial={false}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  scale,
                  rotateY,
                  opacity,
                  filter: `blur(${blur}px) brightness(${brightness})`,
                }}
                transition={{
                  x: BASE_SPRING,
                  z: BASE_SPRING,
                  scale: TAP_SPRING,
                  rotateY: BASE_SPRING,
                  opacity: BASE_SPRING,
                  filter: BASE_SPRING,
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
                onClick={() => {
                  if (offset !== 0) {
                    setActive((p) => p + offset);
                  }
                }}
              >
                {isCenter && hasMedia(item) ? (
                  <div className="h-full w-max pointer-events-auto flex items-center justify-center">
                    <MediaEmbed item={item} />
                  </div>
                ) : (
                  <SkeletonImg
                    src={item.imageSrc}
                    alt={item.title}
                    wrapperClassName="h-full"
                    className={cn(
                      "h-full w-auto max-w-[85vw] md:max-w-[80vw] rounded-2xl object-contain border-t border-white/20 pointer-events-none transition-shadow",
                      isCenter && "shadow-2xl shadow-black/50"
                    )}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info & Controls */}
        <div className="mx-auto mt-8 md:mt-12 flex w-full max-w-4xl flex-col items-center justify-between gap-4 md:gap-6 md:flex-row pointer-events-auto">
          <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left min-h-[80px] md:h-32 justify-center px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {activeItem.meta && (
                  <span className="text-xs font-medium uppercase tracking-wider text-red-500">
                    {activeItem.meta}
                  </span>
                )}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                  {activeItem.title}
                </h2>
                {activeItem.description && (
                  <p className="max-w-md text-sm md:text-base text-neutral-400">
                    {activeItem.description}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-neutral-900/80 p-1 ring-1 ring-white/10 backdrop-blur-md">
              <button
                onClick={handlePrev}
                className="rounded-full p-2.5 md:p-3 text-neutral-400 transition hover:bg-white/10 hover:text-white active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="min-w-[40px] text-center text-xs font-mono text-neutral-500">
                {activeIndex + 1} / {count}
              </span>
              <button
                onClick={handleNext}
                className="rounded-full p-2.5 md:p-3 text-neutral-400 transition hover:bg-white/10 hover:text-white active:scale-95"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {activeItem.href && (
              <Link
                href={activeItem.href}
                className="group flex items-center gap-2 rounded-full bg-white px-4 md:px-5 py-2.5 md:py-3 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
              >
                Explore
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
