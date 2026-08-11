"use client";

import { useState, useRef, MouseEvent, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback if no images provided
  if (!images || images.length === 0) return null;
  // Reset index when images array changes (e.g., when color is switched)
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  /* ── Hover Zoom Handlers (Desktop) ────────────────────────── */
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    // Reset to center smoothly when leaving
    setTimeout(() => setZoomPos({ x: 50, y: 50 }), 300);
  };

  /* ── Mobile Scroll Sync ───────────────────────────────────── */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    // Calculate which image is currently centered
    const scrollPosition = el.scrollLeft;
    const width = el.clientWidth;
    const newIndex = Math.round(scrollPosition / width);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Main Gallery Area ── */}
      <div className="relative">

        {/* 1) Desktop: Crossfade + Zoom (hidden on lg:hidden / sm:hidden if using different layouts, but let's just use CSS for device size) */}
        <div 
          className="hidden md:block relative aspect-[3/4] w-full rounded-luxury overflow-hidden bg-charcoal-light cursor-zoom-in"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentIndex]}
                alt={`${productName} - Image ${currentIndex + 1}`}
                fill
                priority={currentIndex === 0} // prioritize only the first load image
                sizes="(max-width: 1024px) 50vw, 40vw"
                className="object-cover"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? "scale(2)" : "scale(1)",
                  transition: isZoomed ? "transform 0.1s ease-out" : "transform 0.3s ease-out",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 2) Mobile: Swipeable Carousel */}
        <div 
          className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-luxury bg-charcoal-light"
          onScroll={handleScroll}
        >
          {images.map((src, i) => (
            <div 
              key={i} 
              className="relative aspect-[3/4] w-full flex-none snap-center"
            >
              <Image
                src={src}
                alt={`${productName} - Image ${i + 1}`}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Mobile Dot Indicators */}
        {images.length > 1 && (
          <div className="md:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-2 pointer-events-none">
          {images.map((_, i) => (
            <div
              key={i}
              className={[
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                i === currentIndex ? "bg-gold w-3" : "bg-cream/50"
              ].join(" ")}
            />
          ))}
          </div>
        )}
      </div>

      {/* ── Desktop Thumbnail Row ── */}
      {images.length > 1 && (
        <div className="hidden md:flex gap-3 overflow-x-auto scrollbar-hide py-1">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={[
              "relative aspect-[3/4] w-20 shrink-0 rounded-md overflow-hidden transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
              i === currentIndex ? "ring-2 ring-gold opacity-100" : "opacity-60 hover:opacity-100"
            ].join(" ")}
            aria-label={`View image ${i + 1}`}
            aria-current={i === currentIndex ? "true" : "false"}
          >
            <Image
              src={src}
              alt={`${productName} thumbnail ${i + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
        </div>
      )}
    </div>
  );
}
