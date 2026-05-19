"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FocusRail, type FocusRailItem } from "@/components/ui/focus-rail";
import type { WorkItem } from "./GallerySection";

interface WorkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: WorkItem[];
  initialIndex: number;
}

export function WorkModal({
  open,
  onOpenChange,
  items,
  initialIndex,
}: WorkModalProps) {
  const focusRailItems: FocusRailItem[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    description:
      item.thought ||
      item.role ||
      undefined,
    imageSrc: item.imageSrc,
    meta: [item.year, item.client].filter(Boolean).join(" · ") || undefined,
    // Pass through media fields
    mediaType: item.mediaType,
    videoEmbed: item.videoEmbed,
    embedUrl: item.embedUrl,
    videoSrc: item.videoSrc,
    aspectRatio: item.aspectRatio,
  }));

  const activeTitle =
    items[initialIndex]?.title ?? "Work item";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[100vw] w-full h-[100dvh] border-0 bg-neutral-950 p-0 sm:rounded-none flex flex-col"
        hideCloseButton={false}
      >
        <DialogTitle className="sr-only">{activeTitle}</DialogTitle>
        {focusRailItems.length > 0 && (
          <FocusRail
            items={focusRailItems}
            initialIndex={initialIndex}
            loop
            autoPlay={false}
            className="flex-1"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
