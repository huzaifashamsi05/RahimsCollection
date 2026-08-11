"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

/* ============================================================
   About Page — Rahim's Collection  (/about)

   Navbar renders in its solid/compact state immediately here
   (homepage-only transparent behaviour handled in Navbar.tsx
   via usePathname — no extra wiring needed on this page).
   ============================================================ */

/* ── Easing ─────────────────────────────────────────────────── */
const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as const;

/* ── Trust indicator icons ───────────────────────────────────── */
function ReturnIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9h13a5 5 0 010 10H3" />
      <polyline points="7 5 3 9 7 13" />
    </svg>
  );
}
function CashIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 5v4h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

/* ── Trust indicators data ───────────────────────────────────── */
const TRUST_INDICATORS = [
  {
    icon:  <ReturnIcon />,
    label: "7-Day Returns",
    note:  "Hassle-free return policy",
  },
  {
    icon:  <CashIcon />,
    label: "COD in Karachi",
    note:  "Cash on delivery, no trust issues",
  },
  {
    icon:  <TruckIcon />,
    label: "Nationwide Delivery",
    note:  "Delivered to your doorstep",
  },
] as const;

/* ── Component ────────────────────────────────────────────────────── */
export default function AboutContent({ settings }: { settings?: Record<string, string> }) {
  const heading = settings?.['about_heading'] || "About Rahim's Collection";
  const bodyText = settings?.['about_body'] || `Discover the artistry and heritage woven into every piece. Rahim's Collection is a tribute to timeless elegance, bringing you the finest unstitched fabrics crafted with uncompromising quality.
  
  For over a decade, we have partnered with master artisans to source premium raw silk, pure chiffon, and delicate organza. Each collection is thoughtfully curated to empower you to create ensembles that reflect your unique style.
  
  We believe that true luxury lies in the details. From the initial thread to the final weave, our commitment to excellence ensures that you don't just wear a fabric — you wear a legacy.`;
  const imageUrl = settings?.['about_image_url'] || "/images/about-brand-photography.jpg";
  const bodyParagraphs = bodyText.split('\n').filter((p: string) => p.trim() !== '');

  return (
    <>
      {/* ── 1. Page header — cream bg, charcoal text ─────────── */}
      <div className="bg-[#FAF7F2] pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E8E0D4]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
            className="font-sans text-[11px] font-bold text-gold tracking-[0.38em] uppercase mb-4"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.08 }}
            className="font-serif text-5xl sm:text-6xl text-charcoal leading-tight"
          >
            {heading}
          </motion.h1>
        </div>
      </div>

      {/* ── 2. Main content block — cream bg ─────────────────── */}
      <section
        aria-label="Brand story"
        className="bg-[#FAF7F2] py-20 md:py-28 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">

          {/* Two-column: image left, text right — stacked on mobile */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-20 items-start">

            {/* ── Image column ──────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="w-full md:w-[45%] lg:w-[42%] shrink-0"
            >
              <div className="relative aspect-[4/3] rounded-luxury overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
                <Image
                  src={imageUrl}
                  alt="Rahim's Collection — our boutique and fabric selection"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
            </motion.div>

            {/* ── Text column ───────────────────────────────── */}
            <div className="flex-1 flex flex-col gap-7">

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.1 }}
                className="font-serif text-3xl sm:text-4xl text-charcoal leading-tight"
              >
                {heading}
              </motion.h2>

              <div className="space-y-6 text-charcoal-light/90 font-sans text-base sm:text-lg leading-relaxed">
                {bodyParagraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      ease: EASE_OUT,
                      delay: 0.15 + index * 0.08,
                    }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.24 }}
                className="grid grid-cols-3 gap-4 pt-4"
                aria-label="Trust indicators"
              >
                {TRUST_INDICATORS.map(({ icon, label, note }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center text-center gap-2.5 p-4 rounded-luxury bg-white/60 border border-[#E8E0D4]"
                  >
                    <span className="text-gold">{icon}</span>
                    <p className="font-sans text-sm font-semibold text-charcoal leading-tight">
                      {label}
                    </p>
                    <p className="font-sans text-xs text-charcoal/55 leading-tight hidden sm:block">
                      {note}
                    </p>
                  </div>
                ))}
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Closing CTA — charcoal bg ──────────────────────── */}
      <section
        aria-label="Contact us"
        className="bg-charcoal py-20 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-charcoal-light"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="max-w-xl mx-auto text-center flex flex-col items-center gap-5"
        >
          <p className="font-sans text-xs text-text-muted tracking-[0.3em] uppercase">
            We&apos;re Always Here
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-cream">
            Have questions? Chat with us.
          </h2>
          <p className="font-sans text-sm text-text-muted leading-relaxed max-w-sm">
            Whether you need help choosing a fabric, want to confirm availability,
            or have a question about delivery — just drop us a message.
          </p>

          <a
            href={getWhatsAppLink("Hi, I'd like to know more about your collection.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Rahim's Collection on WhatsApp"
            id="about-whatsapp-cta"
            className={[
              "inline-flex items-center gap-3 mt-2",
              "font-sans font-semibold text-[15px] tracking-wide",
              "bg-gold text-charcoal rounded-luxury",
              "px-8 py-3.5 min-h-[52px]",
              "transition-[background-color,transform,box-shadow] duration-200 ease-out",
              "hover:bg-gold-light hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(156,122,60,0.4)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
              "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
            ].join(" ")}
          >
            <WhatsAppIcon className="w-5 h-5 shrink-0" />
            <span>Chat on WhatsApp</span>
          </a>
        </motion.div>
      </section>
    </>
  );
}
