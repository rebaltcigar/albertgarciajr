# Embedding Media in the Portfolio Carousel

This guide explains how to embed YouTube videos, YouTube Shorts, Instagram posts, and Instagram Reels into the portfolio's drag carousel and focus-rail modal.

---

## How It Works

Each item in `site-content.json` can include optional media fields. When present, a ▶ play icon appears on the thumbnail in the carousel. Clicking the center card in the modal opens the embedded player.

### Media Fields

| Field        | Type     | Purpose                                           |
| ------------ | -------- | ------------------------------------------------- |
| `mediaType`  | `string` | `"youtube"`, `"instagram"`, `"tiktok"`, or `"video"` |
| `videoEmbed` | `string` | YouTube video ID only (the part after `v=` or after `/shorts/`) |
| `embedUrl`   | `string` | Full embed URL for Instagram or TikTok             |
| `videoSrc`   | `string` | Direct `.mp4` / `.webm` URL for self-hosted video  |

> [!NOTE]
> `imageSrc` is still required even for media items — it's used as the thumbnail in the carousel and the background ambience in the modal.

---

## YouTube Video (Long-Form)

Use `mediaType: "youtube"` and put **only the video ID** in `videoEmbed`.

```json
{
  "id": "vl-holy-week",
  "title": "Holy Week Mini-Documentary",
  "year": "2021",
  "client": "Personal",
  "role": "Wrote, narrated, edited",
  "thought": "A labor of love about my hometown's Holy Week traditions.",
  "imageSrc": "https://picsum.photos/seed/vl-holyweek/900/900",
  "mediaType": "youtube",
  "videoEmbed": "dQw4w9WgXcQ",
  "copyTier": "full"
}
```

### Finding the Video ID

| URL format                                          | Video ID      |
| --------------------------------------------------- | ------------- |
| `https://www.youtube.com/watch?v=dQw4w9WgXcQ`      | `dQw4w9WgXcQ` |
| `https://youtu.be/dQw4w9WgXcQ`                     | `dQw4w9WgXcQ` |

Renders as a **16:9 iframe** via `https://www.youtube.com/embed/{id}`.

---

## YouTube Short

YouTube Shorts are just regular YouTube videos with a different URL. Use the **exact same approach**:

```json
{
  "id": "vs-short-1",
  "title": "Quick Behind-the-Scenes",
  "year": "2024",
  "imageSrc": "https://picsum.photos/seed/vs-short-1/900/900",
  "mediaType": "youtube",
  "videoEmbed": "abc123XYZ",
  "copyTier": "light"
}
```

### Finding the Video ID

| URL format                                         | Video ID     |
| -------------------------------------------------- | ------------ |
| `https://www.youtube.com/shorts/abc123XYZ`         | `abc123XYZ`  |

> [!TIP]
> Shorts are vertical (9:16) but currently render in 16:9. If you want native vertical rendering, the `MediaEmbed` component in `focus-rail.tsx` can be updated to detect Shorts and switch to `aspect-[9/16]`.

---

## Instagram Post

Use `mediaType: "instagram"` and put the **full embed URL** in `embedUrl`.

```json
{
  "id": "gd-ig-post",
  "title": "Instagram — Brand Post",
  "year": "2024",
  "client": "HAUM Studios",
  "imageSrc": "https://picsum.photos/seed/ig-post/900/900",
  "mediaType": "instagram",
  "embedUrl": "https://www.instagram.com/p/C1234abcXYZ/embed",
  "copyTier": "light"
}
```

### Building the Embed URL

1. Go to the Instagram post
2. Copy the URL — it looks like `https://www.instagram.com/p/C1234abcXYZ/`
3. Append `/embed` → `https://www.instagram.com/p/C1234abcXYZ/embed`

Renders in a **9:16 portrait iframe** capped at `max-h-[70vh]`.

---

## Instagram Reel

Same pattern as a post — Reels just use the `/reel/` URL path:

```json
{
  "id": "vs-ig-reel",
  "title": "Yoga Studio — Mood Reel",
  "year": "2023",
  "client": "Danni Pomplun",
  "imageSrc": "https://picsum.photos/seed/vs-yoga-1/900/900",
  "mediaType": "instagram",
  "embedUrl": "https://www.instagram.com/reel/DAbc123xyz/embed",
  "copyTier": "light"
}
```

### Building the Embed URL

1. Reel URL: `https://www.instagram.com/reel/DAbc123xyz/`
2. Append `/embed` → `https://www.instagram.com/reel/DAbc123xyz/embed`

---

## Self-Hosted Video

For `.mp4` or `.webm` files stored locally or on a CDN:

```json
{
  "id": "vs-local-clip",
  "title": "Studio B-Roll",
  "imageSrc": "https://picsum.photos/seed/vs-local/900/900",
  "mediaType": "video",
  "videoSrc": "/videos/studio-broll.mp4",
  "copyTier": "light"
}
```

Renders a native `<video>` element with controls in 16:9.

---

## Quick Reference

| Platform         | `mediaType`   | Key Field     | Example Value                                          |
| ---------------- | ------------- | ------------- | ------------------------------------------------------ |
| YouTube video    | `"youtube"`   | `videoEmbed`  | `"dQw4w9WgXcQ"`                                       |
| YouTube Short    | `"youtube"`   | `videoEmbed`  | `"abc123XYZ"`                                          |
| Instagram post   | `"instagram"` | `embedUrl`    | `"https://www.instagram.com/p/POST_ID/embed"`          |
| Instagram reel   | `"instagram"` | `embedUrl`    | `"https://www.instagram.com/reel/REEL_ID/embed"`       |
| TikTok           | `"tiktok"`    | `embedUrl`    | `"https://www.tiktok.com/embed/v2/VIDEO_ID"`           |
| Self-hosted      | `"video"`     | `videoSrc`    | `"/videos/clip.mp4"`                                   |

---

## Architecture Notes

- **Carousel thumbnails** — handled by `GallerySection.tsx`. The `hasMedia()` helper checks if an item has media and renders a ▶ play overlay.
- **Modal player** — handled by `WorkModal.tsx` → `FocusRail` (in `ui/focus-rail.tsx`). The `MediaEmbed` component renders the appropriate iframe or `<video>` element based on `mediaType`.
- **Data source** — all items live in `src/data/site-content.json`. No code changes needed to add new embeds — just add the fields to the JSON.
