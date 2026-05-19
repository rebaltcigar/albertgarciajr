"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const SECTIONS = [
  { id: "social-media", label: "Design" },
  { id: "video-long", label: "Video" },
  { id: "photography", label: "Photo" },
  { id: "tech-marketing", label: "Tech + Marketing" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function StickyNav() {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* ── Desktop pill nav (md+) ── */}
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-40 px-1.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-border text-xs font-mono hidden md:block"
          >
            <ul className="flex gap-1">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => handleNavClick(e, s.id)}
                    className="px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors block whitespace-nowrap"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ── Mobile hamburger button ── */}
      <AnimatePresence>
        {visible && !mobileOpen && (
          <motion.button
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setMobileOpen(true)}
            className="fixed top-4 right-4 z-50 p-3 rounded-full bg-black/60 backdrop-blur-xl border border-border md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Mobile overlay menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col md:hidden"
          >
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-3 rounded-full bg-white/10 border border-white/10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-2">
              {SECTIONS.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => handleNavClick(e, s.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-2xl font-semibold text-white/80 hover:text-white transition-colors py-3 px-6 rounded-xl hover:bg-white/5"
                >
                  {s.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
