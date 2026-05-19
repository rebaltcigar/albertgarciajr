"use client";

import { motion } from "framer-motion";
import { ABOUT_CONTENT } from "@/data/content";

export function About() {
  return (
    <section
      id="about"
      className="py-16 md:py-24 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className=""
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
          {ABOUT_CONTENT.heading}
        </h2>
        <div className="space-y-5 text-foreground/90 leading-relaxed">
          {ABOUT_CONTENT.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
