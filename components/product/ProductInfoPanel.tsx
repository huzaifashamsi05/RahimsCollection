"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/constants";
import { getWhatsAppLink } from "@/lib/whatsapp";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

/* ── Icons ───────────────────────────────────────────────────────────── */

function TruckIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="6" width="12" height="12" rx="2" />
      <path d="M15 9h4a2 2 0 0 1 2 2v5h-6" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function AlertIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ── Component ───────────────────────────────────────────────────────── */

interface ProductInfoPanelProps {
  product: Product;
  selectedColorName: string;
  onColorChange: (color: string) => void;
}

export default function ProductInfoPanel({ product, selectedColorName, onColorChange }: ProductInfoPanelProps) {
  const selectedColor = selectedColorName;
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  
  const ctaRef = useRef<HTMLAnchorElement & HTMLDivElement>(null);
  // Detect if the main CTA is in viewport (for mobile sticky bar toggling)
  const isCtaInView = useInView(ctaRef, { margin: "0px 0px -100px 0px" });

  const isReady = product.stockType === "ready";
  const { isSoldOut, isNewArrival, restockable } = product;

  const orderUrl = getWhatsAppLink(`Hi, I'd like to order:
${product.name}
Color: ${selectedColor}
Size: ${selectedSize}
Quantity: ${quantity}
Price: Rs. ${product.price.toLocaleString("en-IN")} each
Is this available?`);
  
  const customStitchingUrl = getWhatsAppLink(`Hi, I need custom stitching for ${product.name}. Could you share the details and charges?`);

  return (
    <div className="flex flex-col gap-8 h-full">
      
      {/* ── 1. Title, Price, Badges ── */}
      <div className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal leading-tight">
          {product.name}
        </h1>
        {product.salePrice ? (
          <p className="font-serif text-2xl tracking-wide flex items-baseline gap-3">
            <span className="text-gold">{formatPrice(product.salePrice)}</span>
            <span className="text-charcoal/40 line-through text-lg">{formatPrice(product.price)}</span>
          </p>
        ) : (
          <p className="font-serif text-2xl text-gold tracking-wide">
            {formatPrice(product.price)}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {isSoldOut ? (
            <span className="inline-block font-sans text-xs font-medium px-3 py-1.5 rounded-full tracking-wide bg-charcoal/75 text-cream leading-none">
              Sold Out
            </span>
          ) : (
            <>
              {product.salePrice && (
                <span className="inline-block font-sans text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide bg-[#800020] text-cream leading-none">
                  Sale
                </span>
              )}
              {isNewArrival && (
                <span className="inline-block font-sans text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide bg-gold text-charcoal leading-none">
                  New Arrival
                </span>
              )}
              <span
                className={[
                  "inline-block font-sans text-xs font-medium px-3 py-1.5 rounded-full tracking-wide leading-none border",
                  isReady ? "border-gold/70 text-gold bg-charcoal/5" : "border-charcoal/20 text-charcoal/80 bg-charcoal/5",
                ].join(" ")}
              >
                {isReady ? "Ready to Ship" : "Made to Order — 15 Days"}
              </span>
              {product.scarcityLabel && (
                <span className="inline-block font-sans text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide bg-red-50 text-red-600 border border-red-200 leading-none shadow-sm animate-pulse">
                  {product.scarcityLabel}
                </span>
              )}
            </>
          )}
        </div>
        
        <p className="font-sans text-sm text-charcoal/70">
          Suit Type: {product.pieceCount}-Piece (Shirt, Trouser{product.pieceCount === 3 && ", Dupatta"})
        </p>
      </div>

      <hr className="border-charcoal/10" />

      {/* ── 2. Color Selector ── */}
      {product.colors.length > 0 && (
        <div className="space-y-3">
          <p className="font-sans text-sm text-charcoal font-medium">
            Color: <span className="text-charcoal/60 ml-1">{selectedColor}</span>
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => onColorChange(color.name)}
                aria-label={`Select color ${color.name}`}
                aria-pressed={selectedColor === color.name}
                className={[
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
                  selectedColor === color.name ? "ring-2 ring-gold ring-offset-2 scale-110" : "ring-1 ring-charcoal/15 hover:scale-105"
                ].join(" ")}
              >
                <span className="w-8 h-8 rounded-full shadow-inner" style={{ backgroundColor: color.hex }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. Size Selector ── */}
      {product.sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-sans text-sm text-charcoal font-medium">Size</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
                className={[
                  "min-w-[3rem] px-4 py-2 rounded-md font-sans text-sm font-medium transition-all duration-150 border",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  selectedSize === size
                    ? "bg-charcoal text-cream border-charcoal"
                    : "bg-transparent text-charcoal border-charcoal/20 hover:border-charcoal/50"
                ].join(" ")}
              >
                {size}
              </button>
            ))}
          </div>
          <a
            href={customStitchingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1 font-sans text-xs text-gold hover:text-gold-light underline underline-offset-2 transition-colors duration-200"
          >
            Need custom stitching? Contact us
          </a>
        </div>
      )}

      {/* ── 4. Quantity Selector ── */}
      <div className="space-y-3">
        <p className="font-sans text-sm text-charcoal font-medium">Quantity</p>
        <div className="inline-flex items-center border border-charcoal/20 rounded-md">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="w-10 h-10 flex items-center justify-center text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <svg width="12" height="2" viewBox="0 0 12 2" fill="currentColor" aria-hidden="true"><path d="M0 0h12v2H0z"/></svg>
          </button>
          <span className="w-10 text-center font-sans text-sm font-medium text-charcoal">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            aria-label="Increase quantity"
            className="w-10 h-10 flex items-center justify-center text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M5 5V0h2v5h5v2H7v5H5V7H0V5h5z"/></svg>
          </button>
        </div>
      </div>

      {/* ── 5. Primary Action (CTA) ── */}
      <div className="pt-2">
        {isSoldOut ? (
          <div
            ref={ctaRef}
            className="flex items-center justify-center w-full min-h-[56px] rounded-luxury bg-charcoal/5 border border-charcoal/10 text-charcoal/50 font-sans text-base font-semibold tracking-wide cursor-not-allowed select-none"
            aria-disabled="true"
          >
            Sold Out
          </div>
        ) : (
          <a
            ref={ctaRef}
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              "flex items-center justify-center gap-3 w-full min-h-[56px] rounded-luxury",
              "bg-gold text-charcoal font-sans text-base font-semibold tracking-wide",
              "transition-all duration-200 ease-out",
              "hover:bg-gold-light hover:-translate-y-0.5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
              "shadow-[0_4px_14px_rgba(156,122,60,0.25)] hover:shadow-[0_6px_20px_rgba(156,122,60,0.35)]"
            ].join(" ")}
          >
            <WhatsAppIcon className="w-5 h-5" />
            Reserve Your Piece via WhatsApp
          </a>
        )}
      </div>

      {/* ── 6. Delivery Info Block & Location Note ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-start gap-3 p-4 bg-charcoal/5 border border-charcoal/10 rounded-lg">
          {isSoldOut ? (
            <>
              <AlertIcon className="w-5 h-5 shrink-0 text-charcoal/50 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-semibold text-charcoal">Currently unavailable</p>
                <p className="font-sans text-xs text-charcoal/60 mt-1 leading-relaxed">
                  {restockable 
                    ? "This item may be restocked soon. Contact us for updates." 
                    : "This is a limited batch and will not be restocked."}
                </p>
              </div>
            </>
          ) : isReady ? (
            <>
              <TruckIcon className="w-5 h-5 shrink-0 text-charcoal/70 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-semibold text-charcoal">Ready to Ship</p>
                <p className="font-sans text-xs text-charcoal/60 mt-1 leading-relaxed">
                  Delivered within 3 days.
                </p>
              </div>
            </>
          ) : (
            <>
              <ClockIcon className="w-5 h-5 shrink-0 text-charcoal/70 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-semibold text-charcoal">Made to Order</p>
                <p className="font-sans text-xs text-charcoal/60 mt-1 leading-relaxed">
                  Crafted after your order is placed. Delivered within 15 days.
                </p>
              </div>
            </>
          )}
        </div>
        <p className="font-sans text-[11px] text-charcoal/50 leading-relaxed px-1">
          Cash on Delivery discussed directly via WhatsApp for Karachi orders. Advance payment required for orders outside Karachi — details confirmed when you message us.
        </p>
      </div>

      <hr className="border-charcoal/10 my-2" />

      {/* ── 7. Description ── */}
      <div className="space-y-3 pb-8 md:pb-0">
        <h3 className="font-sans text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Details</h3>
        <p className="font-sans text-sm text-charcoal/75 leading-relaxed whitespace-pre-wrap">
          {product.description}
        </p>
      </div>

      {/* ── 8. Mobile Sticky Bar ── */}
      <AnimatePresence>
        {!isCtaInView && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-charcoal/10 p-4 pb-safe flex items-center justify-between gap-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
          >
            <div className="flex flex-col">
              <span className="font-sans text-[10px] text-charcoal/50 uppercase tracking-widest font-semibold mb-0.5">Total</span>
              <span className="font-serif text-lg text-gold font-medium leading-none">{formatPrice(product.price * quantity)}</span>
            </div>
            
            {isSoldOut ? (
              <div className="flex-1 flex items-center justify-center px-4 py-3 rounded-luxury bg-charcoal/10 text-charcoal/50 font-sans text-sm font-semibold tracking-wide">
                Sold Out
              </div>
            ) : (
              <a
                href={orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-luxury bg-gold text-charcoal font-sans text-sm font-semibold tracking-wide shadow-md active:scale-[0.98] transition-transform"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" />
                Reserve Your Piece
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
