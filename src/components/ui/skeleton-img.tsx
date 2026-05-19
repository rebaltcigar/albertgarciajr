"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SkeletonImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export function SkeletonImg({ wrapperClassName, className, onLoad, ...props }: SkeletonImgProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Already loaded from cache before React had a chance to attach onLoad
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className={cn("relative", wrapperClassName)}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse rounded-xl bg-neutral-800" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        {...props}
        className={cn(className, !loaded && "opacity-0")}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </div>
  );
}
