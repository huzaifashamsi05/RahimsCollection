"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/constants";
import { getWhatsAppLink } from "@/lib/whatsapp";

/* ============================================================
   ProductCard — Rahim's Collection

   • 3:4 portrait image with desktop hover crossfade to image[1]
   • Badge stack: New Arrival (gold) | stock type | Sold Out
   • Colour swatches (max 4 + "+N") and piece count
   • Always-visible WhatsApp CTA — no Add-to-Cart
   ============================================================ */

import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

/* ── Badge components ────────────────────────────────────────── */
function NewArrivalBadge() {
  return (
    <span className="inline-block font-sans text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-wide bg-gold text-charcoal leading-none">
      New Arrival
    </span>
  );
}

function StockBadge({ stockType }: { stockType: "ready" | "made-to-order" }) {
  const isReady = stockType === "ready";
  return (
    <span
      className={[
        "inline-block font-sans text-[11px] font-medium px-2.5 py-1 rounded-full tracking-wide backdrop-blur-sm leading-none border",
        isReady
          ? "border-gold/70 text-gold bg-charcoal/65"
          : "border-cream/35 text-cream/80 bg-charcoal/65",
      ].join(" ")}
    >
      {isReady ? "Ready to Ship" : "Made to Order — 15 Days"}
    </span>
  );
}

function SoldOutBadge() {
  return (
    <span className="inline-block font-sans text-[11px] font-medium px-2.5 py-1 rounded-full tracking-wide bg-charcoal/75 text-cream backdrop-blur-sm leading-none">
      Sold Out
    </span>
  );
}

/* ── Constants ───────────────────────────────────────────────── */
const MAX_SWATCHES = 4;

/* ── Props ───────────────────────────────────────────────────── */
interface ProductCardProps {
  product: Product;
  /** Pass true for the first few cards to prioritise LCP images */
  priority?: boolean;
  /** Pass true to hide pricing (useful for reseller/wholesale displays) */
  hidePrice?: boolean;
}

/* ── Component ───────────────────────────────────────────────── */
export default function ProductCard({ product, priority = false, hidePrice = false }: ProductCardProps) {
  const {
    name,
    price,
    salePrice,
    colors,
    stockType,
    isNewArrival,
    isSoldOut,
    pieceCount,
    slug,
  } = product;

  const waUrl = getWhatsAppLink(`Hi, I'm interested in ${product.name} — Rs. ${product.price.toLocaleString("en-IN")}. Is this available?`);
  const priceDisplay = formatPrice(price);
  const defaultColor = colors.find(c => c.isDefault) || colors[0];
  const images = defaultColor.images || [];
  const hasHover     = images.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const newIndex = Math.round(el.scrollLeft / el.clientWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < images.length) {
      setActiveIndex(newIndex);
    }
  };

  const shownColors  = colors.slice(0, MAX_SWATCHES);
  const extraColors  = Math.max(0, colors.length - MAX_SWATCHES);

  return (
    <article
      className={[
        "group flex flex-col",
        "bg-charcoal-light rounded-luxury overflow-hidden",
        /* Card lift + subtle gold aura on hover */
        "transition-[box-shadow,transform] duration-[250ms] ease-out",
        "hover:-translate-y-0.5",
        "hover:shadow-[0_16px_48px_rgba(0,0,0,0.65),0_0_0_1px_rgba(156,122,60,0.12)]",
      ].join(" ")}
    >
      {/* ── Image area ──────────────────────────────────────── */}
      <div
        className="relative aspect-[3/4] overflow-hidden"
        /* Sold-out: dim to ~60% + partial greyscale on the whole image block */
        style={isSoldOut ? { opacity: 0.6, filter: "grayscale(0.45)" } : undefined}
      >
        {/* Desktop: Image 1 + Zoom/Fade */}
        <div className="hidden md:block w-full h-full relative">
          <Image
            src={images[0]}
            alt={name}
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            className={[
              "object-cover",
              "transition-all duration-[400ms] ease-in-out",
              hasHover ? "group-hover:opacity-0" : "group-hover:scale-105",
            ].join(" ")}
            priority={priority}
            draggable={false}
          />
          {hasHover && (
            <Image
              src={images[1]}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover opacity-0 scale-100 transition-all duration-[400ms] ease-in-out group-hover:opacity-100 group-hover:scale-[1.03]"
              priority={false}
              draggable={false}
            />
          )}
        </div>

        {/* Mobile: Swipeable images */}
        <div className="md:hidden flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide" onScroll={handleScroll}>
          {hasHover ? images.map((src, i) => (
            <div key={i} className="relative w-full h-full flex-none snap-center">
              <Image
                src={src}
                alt={`${name} image ${i+1}`}
                fill
                sizes="100vw"
                className="object-cover"
                priority={priority && i === 0}
              />
            </div>
          )) : (
            <div className="relative w-full h-full flex-none">
              <Image src={images[0]} alt={name} fill sizes="100vw" className="object-cover" priority={priority} />
            </div>
          )}
        </div>
        
        {/* Mobile Dots */}
        {hasHover && (
          <div className="md:hidden absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-10">
            {images.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-gold w-3' : 'bg-cream/50'}`} />
            ))}
          </div>
        )}

        {/* Badge stack — absolute top-left, above both images */}
        <div
          className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5"
          aria-label="Product badges"
        >
          {isSoldOut ? (
            /* Sold Out overrides all other badges */
            <SoldOutBadge />
          ) : (
            <>
              {salePrice && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#800020] text-cream">Sale</span>}
              {isNewArrival && <NewArrivalBadge />}
              <StockBadge stockType={stockType} />
            </>
          )}
        </div>
      </div>

      {/* ── Card body ───────────────────────────────────────── */}
      <div className="flex flex-col gap-3 p-4 flex-1">

        {/* Colour swatches row + piece count */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5" aria-label="Available colours">
            {shownColors.map((color) => (
              <span
                key={color.name}
                className="w-4 h-4 rounded-full ring-1 ring-white/15 shrink-0 inline-block"
                style={{ backgroundColor: color.hex }}
                role="img"
                aria-label={color.name}
                title={color.name}
              />
            ))}
            {extraColors > 0 && (
              <span
                className="font-sans text-[10px] text-text-muted leading-none"
                aria-label={`and ${extraColors} more colour${extraColors > 1 ? "s" : ""}`}
              >
                +{extraColors}
              </span>
            )}
          </div>
          <span className="font-sans text-xs text-text-muted shrink-0">
            {pieceCount}-Piece
          </span>
        </div>

        {/* Product name — links to detail page; truncates at 2 lines */}
        <Link
          href={`/shop/${slug}`}
          className={[
            "font-sans text-sm font-medium text-cream leading-snug line-clamp-2",
            "transition-colors duration-200 hover:text-ivory",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm",
          ].join(" ")}
        >
          {name}
        </Link>

        {/* Price */}
        {!hidePrice && (
          salePrice ? (
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg text-gold tracking-wide">{formatPrice(salePrice)}</span>
              <span className="font-serif text-sm text-text-muted line-through tracking-wide">{formatPrice(price)}</span>
            </div>
          ) : (
            <p className="font-serif text-lg text-gold tracking-wide">
              {priceDisplay}
            </p>
          )
        )}

        {/* ── WhatsApp CTA — always visible, full width ──────
            Disabled state when sold out: muted styling, no link. */}
        {isSoldOut ? (
          <div
            className={[
              "mt-auto inline-flex items-center justify-center gap-2 w-full",
              "rounded-luxury font-sans font-medium text-sm tracking-wide",
              "px-4 py-2 min-h-[36px]",
              "bg-transparent text-text-muted border border-charcoal-light",
              "cursor-not-allowed select-none opacity-60",
            ].join(" ")}
            role="button"
            aria-disabled="true"
            aria-label="Product is sold out"
          >
            <span>Currently Unavailable</span>
          </div>
        ) : (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Order "${name}" via WhatsApp`}
            className={[
              "mt-auto inline-flex items-center justify-center gap-2 w-full",
              "rounded-luxury font-sans font-medium text-sm tracking-wide",
              "px-4 py-2 min-h-[36px]",
              "bg-transparent text-gold border border-gold",
              "transition-all duration-200 ease-out",
              "hover:border-gold-light hover:text-gold-light hover:bg-gold/5 hover:-translate-y-px",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
              "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-light",
            ].join(" ")}
          >
            <WhatsAppIcon className="w-4 h-4 shrink-0" />
            <span>Order via WhatsApp</span>
          </a>
        )}

      </div>
    </article>
  );
}
