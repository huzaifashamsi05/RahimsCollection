"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

/* ============================================================
   Hero — Rahim's Collection
   
   • Full-viewport height, Navbar overlays transparently on load
     (Navbar's own scroll-listener switches to solid charcoal
     past 80 px — zero extra wiring needed here)
   • Background: placeholder image + radial gold glow overlay
     TODO: replace image with real hero photography or a subtle
     looping fabric-motion video from the client
   • Staggered Framer Motion fade-up entrance
   • Single CTA: smooth-scroll into the New Arrivals showcase
   • Pulsing scroll-cue chevron at bottom
   ============================================================ */

/* ── Easing (typed cubic-bezier for Framer Motion) ───────────── */
const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as const;

/* ── Shared fade-up animation helper ────────────────────────── */
function fadeUp(delay: number) {
  return {
    initial:    { opacity: 0, y: 28 },
    animate:    { opacity: 1, y: 0  },
    transition: { duration: 0.58, ease: EASE_OUT, delay },
  } as const;
}

/* ── Scroll chevron icon ─────────────────────────────────────── */
function ChevronDown() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 8l7 7 7-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Component ───────────────────────────────────────────────── */
interface HeroProps {
  headline?: string;
  subtext?: string;
  sliderImages?: string[];
}

export default function Hero({ headline, subtext, sliderImages }: HeroProps) {
  function scrollToNewArrivals() {
    document
      .getElementById("new-arrivals")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  const finalHeadline = headline || "This Season's Finest Suits";
  const finalSubtext = subtext || "Elevate your wardrobe with Rahim's Collection.";
  
  // Use admin provided images if available, otherwise use defaults
  const fallbackSlider = sliderImages && sliderImages.length > 0 
    ? sliderImages 
    : [
        "/images/hero/hero-1.jpg",
        "/images/hero/hero-2-new.jpg",
        "/images/hero/hero-3.jpg",
        "/images/hero/hero-4.jpg",
      ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % fallbackSlider.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [fallbackSlider.length]);

  return (
    <section
      id="hero"
      aria-label="Hero — Rahim's Collection"
      className="relative flex items-center justify-center overflow-hidden bg-charcoal min-h-[85vh] md:min-h-screen"
    >
      {/* ── Background layer ─────────────────────────────────── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 opacity-[0.32]"
          >
            <Image
              src={fallbackSlider[currentSlide]}
              alt={`Hero background ${currentSlide + 1}`}
              fill
              priority={currentSlide === 0}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Warm radial gold glow — centers the eye on the content */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(156,122,60,0.11) 0%, transparent 68%)",
          }}
        />

        {/* Bottom fade — grades into the section below */}
        <div
          className="absolute inset-x-0 bottom-0 h-48"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(26,26,26,0.85) 100%)",
          }}
        />

        {/* Dark scrim — ensures text legibility at all viewport sizes */}
        <div className="absolute inset-0 bg-charcoal/45" />
      </div>

      {/* ── Hero content ─────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-28 pb-24 max-w-3xl mx-auto w-full">

        {/* Eyebrow */}
        <motion.p
          {...fadeUp(0)}
          className="font-sans text-[11px] font-bold text-gold tracking-[0.38em] uppercase mb-6"
        >
          Premium Women&apos;s Suits
        </motion.p>

        {/* Headline — TODO: confirm final copy with client */}
        <motion.h1
          {...fadeUp(0.1)}
          className="font-serif text-5xl sm:text-6xl lg:text-[5rem] text-cream leading-[1.06] mb-7 tracking-tight"
        >
          {finalHeadline}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          {...fadeUp(0.2)}
          className="font-sans text-base sm:text-lg text-text-muted leading-relaxed max-w-[520px] mb-11 whitespace-pre-wrap"
        >
          {finalSubtext}
        </motion.p>

        {/* Single CTA — scrolls into New Arrivals showcase */}
        <motion.div {...fadeUp(0.3)}>
          <Button
            id="hero-cta"
            variant="primary"
            size="lg"
            onClick={scrollToNewArrivals}
            aria-label="Scroll to New Arrivals showcase"
          >
            See New Arrivals
          </Button>
        </motion.div>

      </div>

      {/* ── Scroll-cue chevron ───────────────────────────────── */}
      <motion.button
        onClick={scrollToNewArrivals}
        aria-label="Scroll to New Arrivals"
        className={[
          "absolute bottom-7 left-1/2 -translate-x-1/2 z-10",
          "flex flex-col items-center gap-0.5 text-gold",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal rounded-sm",
          "cursor-pointer",
        ].join(" ")}
        animate={{
          y:       [0, 7, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.9,
          repeat:   Infinity,
          ease:     "easeInOut",
        }}
      >
        {/* Double chevron for extra emphasis */}
        <ChevronDown />
        <ChevronDown />
      </motion.button>

    </section>
  );
}
