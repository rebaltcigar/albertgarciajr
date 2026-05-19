import type { Metadata } from "next";
import { sans, heading, mono } from "./fonts";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ParticleBackground } from "@/components/ParticleBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "Albert Garcia, Jr. — Creative Production",
  description:
    "Creative production for growing businesses. Graphic design, video editing, photography, videography, AI-powered workflows.",
  metadataBase: new URL("https://albertgarciajr.com"),
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

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Albert Garcia, Jr.",
  url: "https://albertgarciajr.com",
  email: "mailto:albertrgarciajr@gmail.com",
  jobTitle: "Creative Producer",
  description:
    "Creative production for growing businesses: graphic design, video editing, photography, videography, AI-powered workflows.",
  sameAs: ["https://behance.net/albertjrgarcia"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${heading.variable} ${mono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <ParticleBackground />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
