"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/constants";
import { getWhatsAppLink } from "@/lib/whatsapp";

/* ============================================================
   NewArrivalsShowcase — Rahim's Collection

   Cinematic scroll-driven showcase: one full-viewport moment
   per featured product.

   Technique: sticky-image / scrolling-text
   ─ Desktop: image column (55%) is sticky; text (45%) scrolls
   ─ Mobile:  image stacked on top (no sticky), text below
   ─ Parallax: useScroll per section → useTransform ±45 px y
   ─ Image:   animate opacity in/out via useInView (both ways)
   ─ Text:    whileInView fade-up with 60–360 ms stagger (once)
   ─ prefers-reduced-motion: parallax disabled, opacity-only
   ─ Lazy loading: first 2 products eager, rest lazy
   ============================================================ */

/* ── Shared easing ───────────────────────────────────────────── */
const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as const;

/* ── Icons ───────────────────────────────────────────────────── */
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

/* ── Badge (showcase variant — no backdrop blur needed) ──────── */
function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "gold" | "stock-ready" | "stock-mto";
}) {
  const cls: Record<typeof variant, string> = {
    "gold":       "bg-gold text-charcoal font-semibold",
    "stock-ready":"border border-gold/65 text-gold",
    "stock-mto":  "border border-cream/35 text-cream/80",
  };
  return (
    <span
      className={[
        "inline-block font-sans text-[11px] font-medium px-2.5 py-1 rounded-full tracking-wide leading-none",
        cls[variant],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

/* ============================================================
   ProgressIndicator
   Fixed right-edge dots (desktop only) — hidden while
   showcase section is not in the viewport.
   ============================================================ */
function ProgressIndicator({
  total,
  activeIndex,
  sectionIds,
  visible,
}: {
  total: number;
  activeIndex: number;
  sectionIds: string[];
  visible: boolean;
}) {
  function scrollTo(i: number) {
    document.getElementById(sectionIds[i])?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav
      aria-label="New Arrivals showcase navigation"
      className={[
        /* Desktop only */
        "fixed right-5 top-1/2 -translate-y-1/2 z-40",
        "hidden md:flex flex-col items-center gap-3.5",
        /* Fade in/out with showcase visibility */
        "transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => scrollTo(i)}
          aria-label={`Scroll to product ${i + 1} of ${total}`}
          aria-current={activeIndex === i ? "step" : undefined}
          className={[
            "w-2 h-2 rounded-full",
            "transition-all duration-300 ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
            activeIndex === i
              ? "bg-gold scale-[1.65] shadow-[0_0_8px_rgba(156,122,60,0.65)]"
              : "bg-cream/22 hover:bg-cream/50",
          ].join(" ")}
        />
      ))}
      <Link 
        href="/shop"
        className="absolute top-full mt-6 right-0 whitespace-nowrap text-[11px] font-sans uppercase tracking-widest text-cream/40 hover:text-gold transition-colors duration-300"
      >
        Skip to Shop &rarr;
      </Link>
    </nav>
  );
}

/* ============================================================
   MobileSkipHint
   Floating top-right pill (mobile only) — hidden while
   showcase section is not in the viewport.
   ============================================================ */
function MobileSkipHint({ visible }: { visible: boolean }) {
  return (
    <Link
      href="/shop"
      className={[
        "fixed top-[88px] right-4 z-40 md:hidden",
        "bg-charcoal/80 backdrop-blur-md border border-cream/10",
        "px-3 py-1.5 rounded-full shadow-lg",
        "font-sans text-[10px] uppercase tracking-widest text-cream/70",
        "transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      ].join(" ")}
    >
      Skip to Shop &rarr;
    </Link>
  );
}

/* ============================================================
   ProductShowcaseItem — per-product sub-section
   ============================================================ */
function ProductShowcaseItem({
  product,
  index,
  total,
  onActiveChange,
}: {
  product: Product;
  index: number;
  total: number;
  onActiveChange: (index: number) => void;
}) {
  const sectionRef  = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion() ?? false;

  /* ── Section visibility (drives progress dot + image opacity) ── */
  const isInView = useInView(sectionRef, {
    amount:  0.45,   // 45% of section in view → this section is "active"
    margin:  "0px",
  });

  useEffect(() => {
    if (isInView) onActiveChange(index);
  }, [isInView, index, onActiveChange]);

  /* ── Parallax: per-section scroll progress ───────────────── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* GPU-accelerated Y transform only — no layout-triggering props */
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [-45, 45]   // ±45 px subtle depth
  );

  /* ── Auto-cycle images logic ─────────────────────────────── */
  const images = product.colors.find(c => c.isDefault)?.images || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!isInView || reducedMotion || images.length <= 1) {
      if (!isInView) setCurrentImageIndex(0); // Reset when scrolled out
      return;
    }

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isInView, reducedMotion, images.length]);
  const isImageLeft = index % 2 === 0; // alternate left / right
  const waUrl       = getWhatsAppLink(`Hi, I'm interested in ${product.name} — Rs. ${product.price.toLocaleString("en-IN")}. Is this available?`);
  const shownColors = product.colors.slice(0, 4);
  const extraColors = Math.max(0, product.colors.length - 4);
  const indexLabel  = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  /* ── Per-element whileInView animation helper ────────────── */
  function fadeUp(delay: number) {
    return {
      initial:      { opacity: 0, y: reducedMotion ? 0 : 24 },
      whileInView:  { opacity: 1, y: 0 },
      viewport:     { once: true, margin: "-5%" } as const,
      transition:   { duration: 0.62, ease: EASE_OUT, delay },
    } as const;
  }

  return (
    <section
      ref={sectionRef}
      id={`showcase-${index}`}
      aria-label={`Featured product: ${product.name}`}
      className="relative min-h-screen bg-charcoal pt-16 pb-20 md:py-0"
    >
      {/* Thin gold-tinted divider between products (not before first) */}
      {index > 0 && (
        <div
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
          aria-hidden="true"
        />
      )}

      {/* ── Two-column row: alternates image-left / image-right ── */}
      <div
        className={[
          "flex flex-col md:min-h-screen",
          isImageLeft ? "md:flex-row" : "md:flex-row-reverse",
        ].join(" ")}
      >

        {/* ════════════════════════════════════════════════════
            IMAGE COLUMN
            Desktop: sticky, 55% width, full viewport height
            Mobile:  full-width, ~72vw tall (≈ 3:4 ratio), static
           ════════════════════════════════════════════════════ */}
        <motion.div
          className={[
            /* Size */
            "group relative w-full h-[72vw]",
            "md:w-[55%] md:h-[calc(100vh-5rem)]",
            /* Clip parallax overflow */
            "overflow-hidden",
            /* Sticky — desktop only */
            "md:sticky md:top-20 md:self-start",
          ].join(" ")}
          /* Image opacity — animates BOTH in AND out (no once:true) */
          animate={{
            opacity: isInView ? 1 : 0,
          }}
          transition={{ duration: 0.52, ease: EASE_OUT }}
        >
          {/* Parallax wrapper — extends ±48px to prevent blank edges */}
          <motion.div
            style={{ y: parallaxY }}
            className="absolute inset-x-0 -top-12 -bottom-12"
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={images[currentImageIndex]}
                  alt={`${product.name} - View ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0 && currentImageIndex === 0}
                  loading={index < 2 && currentImageIndex === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, 55vw"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Subtle dot indicators for auto-cycling */}
            {images.length > 1 && (
              <div className="absolute bottom-16 inset-x-0 flex justify-center gap-2 z-20 pointer-events-none">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={[
                      "w-1.5 h-1.5 rounded-full transition-all duration-300",
                      currentImageIndex === i ? "bg-gold scale-125" : "bg-cream/40"
                    ].join(" ")}
                  />
                ))}
              </div>
            )}

            {/* Gradient bridge toward text column */}
            <div
              className={[
                "absolute inset-y-0 w-28 pointer-events-none z-10",
                isImageLeft
                  ? "right-0 bg-gradient-to-l"
                  : "left-0 bg-gradient-to-r",
                "from-charcoal/35 to-transparent",
              ].join(" ")}
              aria-hidden="true"
            />
          </motion.div>
        </motion.div>

        {/* ════════════════════════════════════════════════════
            TEXT COLUMN
            Normal flow, vertically centred, staggered fade-up
           ════════════════════════════════════════════════════ */}
        <div className="w-full md:w-[45%] flex flex-col justify-center px-8 md:px-12 lg:px-16 py-14 md:py-24">

          {/* Index label  "01 / 05" */}
          <motion.p
            {...fadeUp(0)}
            className="font-sans text-xs text-text-muted tracking-[0.25em] mb-4 select-none"
          >
            {indexLabel}
          </motion.p>

          {/* Eyebrow */}
          <motion.p
            {...fadeUp(0.07)}
            className="font-sans text-[11px] font-bold text-gold tracking-[0.35em] uppercase mb-5"
          >
            New This Week
          </motion.p>

          {/* Product name */}
          <motion.h2
            {...fadeUp(0.14)}
            className="font-serif text-4xl sm:text-5xl text-cream leading-[1.08] mb-6"
          >
            {product.name}
          </motion.h2>

          {/* Price + stock badges */}
          <motion.div
            {...fadeUp(0.2)}
            className="flex flex-wrap items-center gap-2.5 mb-6"
          >
            <span className="font-serif text-2xl text-gold mr-1.5">
              {formatPrice(product.price)}
            </span>

            {product.isNewArrival && (
              <Badge variant="gold">New Arrival</Badge>
            )}

            {!product.isSoldOut && (
              <Badge variant={product.stockType === "ready" ? "stock-ready" : "stock-mto"}>
                {product.stockType === "ready"
                  ? "Ready to Ship"
                  : "Made to Order — 15 Days"}
              </Badge>
            )}
          </motion.div>

          {/* Colour swatches */}
          {product.colors.length > 0 && (
            <motion.div
              {...fadeUp(0.25)}
              className="flex items-center gap-2 mb-7"
            >
              <span className="font-sans text-xs text-text-muted tracking-wide">
                Available in:
              </span>
              <div className="flex items-center gap-1.5">
                {shownColors.map((c) => (
                  <span
                    key={c.name}
                    className="w-5 h-5 rounded-full ring-1 ring-white/15 shrink-0"
                    style={{ backgroundColor: c.hex }}
                    role="img"
                    aria-label={c.name}
                    title={c.name}
                  />
                ))}
                {extraColors > 0 && (
                  <span className="font-sans text-xs text-text-muted ml-0.5">
                    +{extraColors} more
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Description */}
          {product.description && (
            <motion.p
              {...fadeUp(0.3)}
              className="font-sans text-sm sm:text-base text-text-muted leading-relaxed mb-10 max-w-[360px]"
            >
              {product.description}
            </motion.p>
          )}

          {/* WhatsApp CTA — disabled state for sold-out (shouldn't appear
              in showcase, but safe-guarded) */}
          <motion.div {...fadeUp(0.37)}>
            {product.isSoldOut ? (
              <div
                className="inline-flex items-center gap-3 font-sans font-medium text-base tracking-wide text-text-muted border border-charcoal-light rounded-luxury px-8 py-3.5 min-h-[48px] opacity-50 cursor-not-allowed select-none"
                role="button"
                aria-disabled="true"
              >
                Currently Unavailable
              </div>
            ) : (
              <a
                href={getWhatsAppLink(`Hi, I'm interested in ${product.name} — Rs. ${product.price.toLocaleString("en-IN")}. Is this available?`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Order "${product.name}" via WhatsApp`}
                className={[
                  "inline-flex items-center gap-3",
                  "font-sans font-semibold text-[15px] tracking-wide",
                  "bg-gold text-charcoal rounded-luxury",
                  "px-8 py-3.5 min-h-[48px]",
                  /* Only GPU-composited props in transition */
                  "transition-[background-color,transform,box-shadow] duration-200 ease-out",
                  "hover:bg-gold-light hover:-translate-y-px",
                  "hover:shadow-[0_6px_24px_rgba(156,122,60,0.4)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
                ].join(" ")}
              >
                <WhatsAppIcon className="w-5 h-5 shrink-0" />
                <span>Order via WhatsApp</span>
              </a>
            )}
          </motion.div>

          {/* Piece count note */}
          <motion.p
            {...fadeUp(0.4)}
            className="mt-4 font-sans text-xs text-text-muted"
          >
            {product.pieceCount}-Piece Unstitched Suit
          </motion.p>

        </div>
      </div>
    </section>
  );
}

/* ============================================================
   NewArrivalsShowcase — root export
   ============================================================ */
export default function NewArrivalsShowcase({
  products,
}: {
  products: Product[];
}) {
  const [activeIndex,    setActiveIndex]    = useState(0);
  const [showcaseVisible, setShowcaseVisible] = useState(false);

  /* Parent ref — controls progress indicator visibility */
  const showcaseRef = useRef<HTMLDivElement>(null);
  const isShowcaseInView = useInView(showcaseRef, { amount: 0 }); // any part

  useEffect(() => {
    setShowcaseVisible(isShowcaseInView);
  }, [isShowcaseInView]);

  const handleActiveChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const sectionIds = products.map((_, i) => `showcase-${i}`);

  if (products.length === 0) return null;

  return (
    <div id="new-arrivals" ref={showcaseRef} className="relative bg-charcoal">

      {/* Fixed progress dots — desktop only, fades with showcase */}
      <ProgressIndicator
        total={products.length}
        activeIndex={activeIndex}
        sectionIds={sectionIds}
        visible={showcaseVisible}
      />

      {/* Floating skip pill — mobile only, fades with showcase */}
      <MobileSkipHint visible={showcaseVisible} />

      {/* ── Product sub-sections ──────────────────────────── */}
      {products.map((product, i) => (
        <ProductShowcaseItem
          key={product.id}
          product={product}
          index={i}
          total={products.length}
          onActiveChange={handleActiveChange}
        />
      ))}

      {/* ── End-of-showcase: View All CTA ─────────────────── */}
      <div className="relative py-28 px-6 flex flex-col items-center text-center border-t border-charcoal-light bg-charcoal">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.65, ease: EASE_OUT }}
          className="flex flex-col items-center gap-5 max-w-md"
        >
          <p className="font-sans text-xs text-text-muted tracking-[0.3em] uppercase">
            The Collection
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-cream">
            There&apos;s More to Discover
          </h2>
          <p className="font-sans text-sm text-text-muted leading-relaxed">
            Browse the full New Arrivals collection and find your perfect suit.
          </p>
          <Link
            href="/shop?filter=new-arrivals"
            aria-label="View all new arrivals in the shop"
            className={[
              "inline-flex items-center justify-center gap-2 mt-2",
              "font-sans font-medium text-base tracking-wide",
              "bg-transparent text-gold border border-gold rounded-luxury",
              "px-10 py-3.5 min-h-[52px]",
              "transition-[border-color,color,background-color,transform] duration-200 ease-out",
              "hover:border-gold-light hover:text-gold-light hover:bg-gold/5 hover:-translate-y-px",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
              "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
            ].join(" ")}
          >
            View All New Arrivals
          </Link>
        </motion.div>
      </div>

    </div>
  );
}
