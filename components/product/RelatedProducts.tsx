"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";

interface RelatedProductsProps {
  relatedProducts: Product[];
}

export default function RelatedProducts({ relatedProducts }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 300;
      scrollRef.current.scrollBy({ left: -(cardWidth + 16), behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 300;
      scrollRef.current.scrollBy({ left: cardWidth + 16, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 md:py-24 border-t border-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <span className="block font-sans text-xs font-bold text-gold uppercase tracking-[0.2em] mb-2">
              You May Also Like
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
              Related Products
            </h2>
          </div>
          
          {/* Desktop Arrows */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal hover:bg-charcoal/5 hover:border-charcoal/50 transition-colors"
              aria-label="Scroll left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal hover:bg-charcoal/5 hover:border-charcoal/50 transition-colors"
              aria-label="Scroll right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        {/* ── Scroll Strip ── */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 md:gap-6 pb-8"
          >
            {relatedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="snap-start shrink-0 w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[23%]"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
