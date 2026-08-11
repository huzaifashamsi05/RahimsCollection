"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* ============================================================
   CategoriesSection — Rahim's Collection
   
   6-card fabric category grid with:
   • Portrait 3:4 image cards with dark gradient overlay
   • Desktop hover: scale(1.05) image + gradient intensifies
   • Mobile: no hover, full card is tappable link
   • whileInView staggered entrance (header → cards 60ms apart)
   • Velvet gets "Seasonal" badge (top-right)
   ============================================================ */

/* ── Constants ───────────────────────────────────────────────── */
const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as const;

/* ── Category data ───────────────────────────────────────────── */
const CATEGORIES = [
  {
    name:     "Raw Silk",
    slug:     "raw-silk",
    image:    "/images/categories/raw-silk.jpg",
    seasonal: false,
  },
  {
    name:     "Chiffon",
    slug:     "chiffon",
    image:    "/images/categories/chiffon.jpg",
    seasonal: false,
  },
  {
    name:     "Organza",
    slug:     "organza",
    image:    "/images/categories/organza.jpg",
    seasonal: false,
  },
  {
    name:     "Georgette",
    slug:     "georgette",
    image:    "/images/categories/georgette.jpg",
    seasonal: false,
  },
  {
    name:     "Net",
    slug:     "net",
    image:    "/images/categories/net.jpg",
    seasonal: false,
  },
  {
    name:     "Velvet",
    slug:     "velvet",
    image:    "/images/categories/velvet.jpg",
    seasonal: true,
  },
] as const;

/* ── Component ───────────────────────────────────────────────── */
export default function CategoriesSection({ categoryCounts, settings }: { categoryCounts?: Record<string, number>, settings?: Record<string, string> }) {
  // Only display categories that have at least one active product
  const activeCategories = categoryCounts 
    ? CATEGORIES.filter(cat => (categoryCounts[cat.slug] || 0) > 0)
    : CATEGORIES;

  if (activeCategories.length === 0) return null;

  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="bg-charcoal py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-charcoal-light"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Section header ───────────────────────────────── */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="font-sans text-[11px] font-bold text-gold tracking-[0.35em] uppercase"
          >
            Shop by Fabric
          </motion.p>

          <motion.h2
            id="categories-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.07 }}
            className="font-serif text-4xl sm:text-5xl text-cream"
          >
            Explore Our Collections
          </motion.h2>
        </div>

        {/* ── Category grid: 2-col mobile / 3-col tablet + desktop ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {activeCategories.map((category, i) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{
                duration: 0.6,
                ease:     EASE_OUT,
                delay:    0.14 + i * 0.06,
              }}
            >
              {/*
                Full card is a link.
                Desktop: hover triggers image scale + gradient intensification.
                Mobile: CSS hover won't fire on touch, so full tap = link.
              */}
              <Link
                href={`/shop?category=${category.slug}`}
                aria-label={`Shop ${category.name} fabric collection`}
                id={`cat-${category.slug}`}
                className={[
                  "group relative block aspect-[3/4] overflow-hidden rounded-luxury",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
                ].join(" ")}
              >
                {/* Category image */}
                <Image
                  src={settings?.[`category_image_url_${category.slug}`] || category.image}
                  alt={`${category.name} fabric`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 28vw"
                  className={[
                    "object-cover",
                    /* Scale up on desktop hover only; mobile touch → no hover */
                    "transition-transform duration-[300ms] ease-out",
                    "md:group-hover:scale-[1.05]",
                  ].join(" ")}
                />

                {/* Base gradient overlay — bottom half, always present */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-charcoal/90 via-charcoal/55 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Hover gradient intensifier — fades in on desktop hover,
                    extends slightly higher than base for a deeper feel */}
                <div
                  className={[
                    "absolute inset-x-0 bottom-0 h-3/5",
                    "bg-gradient-to-t from-charcoal/50 to-transparent",
                    "pointer-events-none",
                    "opacity-0 transition-opacity duration-[300ms] ease-out",
                    "md:group-hover:opacity-100",
                  ].join(" ")}
                  aria-hidden="true"
                />

                {/* "Seasonal" badge — Velvet only, top-right */}
                {category.seasonal && (
                  <div className="absolute top-3 right-3 z-10">
                    <span
                      className={[
                        "font-sans text-[10px] font-semibold tracking-wide",
                        "px-2 py-1 rounded-full",
                        "bg-gold text-charcoal",
                      ].join(" ")}
                    >
                      Seasonal
                    </span>
                  </div>
                )}

                {/* Category name — one clean label, bottom-left */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 pointer-events-none">
                  <p className="font-serif text-lg sm:text-xl lg:text-2xl text-cream leading-tight">
                    {category.name}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
