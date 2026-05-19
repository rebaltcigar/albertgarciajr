"use client";

import { motion } from "framer-motion";
import { CONTACT_CONTENT } from "@/data/content";

export function Contact() {
  return (
    <footer
      id="contact"
      className="py-16 md:py-24 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto border-t border-border"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">
          {CONTACT_CONTENT.heading}
        </h2>
        <dl className="grid sm:grid-cols-2 gap-y-4 gap-x-12 font-mono text-sm">
          {CONTACT_CONTENT.links.map((link) => (
            <div key={link.label} className="flex gap-6 items-baseline">
              <dt className="text-muted-foreground w-24">{link.label}</dt>
              <dd>
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  {...(link.download ? { download: true } : {})}
                  className="hover:text-red-500 transition-colors"
                >
                  {link.text}
                </a>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-24 text-xs text-muted-foreground font-mono">
          © {new Date().getFullYear()} Albert Garcia, Jr.
        </p>
      </motion.div>
    </footer>
  );
}
