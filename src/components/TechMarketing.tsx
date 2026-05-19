"use client";

import { motion } from "framer-motion";
import { TECH_MARKETING_ITEMS } from "@/data/content";

export function TechMarketing() {
  return (
    <section
      id="tech-marketing"
      className="py-16 md:py-24 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
          Tech + Marketing
        </h2>
        <p className="text-muted-foreground max-w-xl mb-12">
          I also help businesses on the operations side: web development, marketing
          campaigns, automation, and AI-powered workflows. A few examples:
        </p>
        <ul className="divide-y divide-border">
          {TECH_MARKETING_ITEMS.map((item) => (
            <li key={item.label} className="py-5 group">
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 hover:text-red-500 transition-colors"
                >
                  <span className="font-medium md:w-72 shrink-0 flex items-center gap-1.5">
                    <span className="underline underline-offset-4 decoration-muted-foreground group-hover:decoration-red-500 transition-colors">
                      {item.label}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                      ↗
                    </span>
                  </span>
                  <span className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {item.description}
                  </span>
                </a>
              ) : (
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                  <span className="font-medium md:w-72 shrink-0">{item.label}</span>
                  <span className="text-muted-foreground">{item.description}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
