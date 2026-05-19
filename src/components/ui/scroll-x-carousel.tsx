"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface DragCarouselContextValue {
  progress: number;
}

const DragCarouselContext =
  React.createContext<DragCarouselContextValue | null>(null);

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export function DragCarousel({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = React.useState(0);

  const updateProgress = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  // Attach scroll listener to the inner scrollable element
  React.useEffect(() => {
    // We need to find the scrollable child after mount
    const findScrollable = () => {
      const el = document.querySelector(
        `[data-drag-carousel-wrap]`
      ) as HTMLDivElement | null;
      if (el) {
        scrollRef.current = el;
        el.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();
      }
    };
    // Small delay to allow children to mount
    const timer = setTimeout(findScrollable, 50);
    return () => {
      clearTimeout(timer);
      scrollRef.current?.removeEventListener("scroll", updateProgress);
    };
  }, [updateProgress]);

  return (
    <DragCarouselContext.Provider value={{ progress }}>
      <div className={cn("relative w-full", className)} {...props}>
        {children}
      </div>
    </DragCarouselContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Container — provides the sticky/flex layout
// ---------------------------------------------------------------------------

export function DragCarouselContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative overflow-hidden w-full flex flex-col gap-6", className)}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Wrap — the actual scrollable horizontal container
// ---------------------------------------------------------------------------

export function DragCarouselWrap({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const wrapRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = wrapRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(":scope > *")?.clientWidth ?? 300;
    const amount = cardWidth + 32; // card width + gap
    el.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/carousel">
      {/* Prev button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/60 backdrop-blur-md p-2.5 text-white/80 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 shadow-lg border border-white/10"
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Next button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/60 backdrop-blur-md p-2.5 text-white/80 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 shadow-lg border border-white/10"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={wrapRef}
        data-drag-carousel-wrap
        className={cn(
          "flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth",
          "[&>*:first-child]:ml-6 [&>*:last-child]:mr-6 md:[&>*:first-child]:ml-12 md:[&>*:last-child]:mr-12 lg:[&>*:first-child]:ml-20 lg:[&>*:last-child]:mr-20",
          className
        )}
        style={{ scrollPaddingInline: "1.5rem" }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

export function DragCarouselProgress({
  className,
  progressStyle,
}: {
  className?: string;
  progressStyle?: string;
}) {
  const context = React.useContext(DragCarouselContext);
  const progress = context?.progress ?? 0;

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className={cn("origin-left transition-transform duration-150", progressStyle)}
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
