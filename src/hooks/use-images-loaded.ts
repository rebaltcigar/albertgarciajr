"use client";

import { useEffect, useState } from "react";

export function useImagesLoaded(sources: string[]): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (sources.length === 0) {
      setReady(true);
      return;
    }

    let cancelled = false;
    setReady(false);

    const load = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
        if (img.decode) {
          img.decode().then(() => resolve()).catch(() => resolve());
        }
      });

    Promise.all(sources.map(load)).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [sources.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  return ready;
}
