import manifest from "@/data/image-manifest.json";

type Dim = { w: number; h: number };
const meta = manifest as Record<string, Dim>;

const FALLBACK: Dim = { w: 1080, h: 1080 };

export function getImageMeta(src: string): Dim {
  return meta[src] ?? FALLBACK;
}
