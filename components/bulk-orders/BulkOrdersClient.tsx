"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { Product } from "@/types/product";
import { submitBulkInquiry } from "@/lib/actions/inquiries";
import ProductCard from "@/components/product/ProductCard";

/* ============================================================
   Wholesale / Bulk Orders Client Component
   ============================================================ */

export default function BulkOrdersClient({ popularResellerProducts }: { popularResellerProducts: Product[] }) {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWhatsAppClick = () => {
    const waUrl = getWhatsAppLink("Hi, I'm interested in bulk/reseller orders for Rahim's Collection. Can we discuss pricing and available designs?");
    window.open(waUrl, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");
    
    const formData = new FormData(e.currentTarget);
    const result = await submitBulkInquiry(formData);
    
    if (result.error) {
      setFormState("error");
      setErrorMessage(result.error);
    } else {
      setFormState("success");
    }
  };

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
    <main className="min-h-screen bg-charcoal text-cream pt-28 pb-20 md:pt-36 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 1. Header ── */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="block font-sans text-xs font-bold text-gold uppercase tracking-[0.2em] mb-4">
            Wholesale & International
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
            Bulk & Reseller Orders
          </h1>
          <p className="text-cream/70 text-lg leading-relaxed max-w-2xl mx-auto">
            We work with resellers across the Middle East, India, Bangladesh, and beyond. 
            Full sets only, pricing discussed directly — reach out and let's talk.
          </p>
        </div>

        {/* ── 2. Trust Info Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {[
            {
              title: "Full Sets Only",
              desc: "No minimum quantity required — we simply ask that orders are placed as full sets, not individual pieces.",
              icon: (
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              )
            },
            {
              title: "International Shipping",
              desc: "Fast, reliable global delivery via DHL, FedEx, and Aramex directly to your boutique.",
              icon: (
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            {
              title: "Direct Negotiation",
              desc: "Pricing is kept completely private and discussed personally via WhatsApp to protect your margins.",
              icon: (
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-cream/5 border border-cream/10 rounded-luxury p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-charcoal-light flex items-center justify-center mb-4 border border-cream/5">
                {item.icon}
              </div>
              <h3 className="font-serif text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-cream/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── 3. Primary CTA (WhatsApp) ── */}
        <div className="flex justify-center mb-20">
          <Button
            onClick={handleWhatsAppClick}
            variant="primary"
            size="lg"
            icon={<WhatsAppIcon className="w-6 h-6" />}
            className="w-full sm:w-auto px-12 py-5 text-lg shadow-[0_0_40px_rgba(156,122,60,0.3)] hover:shadow-[0_0_60px_rgba(156,122,60,0.5)]"
          >
            Chat With Us on WhatsApp
          </Button>
        </div>

        {/* ── 4. Secondary Form ── */}
        <div className="max-w-2xl mx-auto bg-charcoal-light rounded-luxury p-6 md:p-10 border border-cream/5 mb-24">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl mb-2">Prefer to send an email?</h2>
            <p className="text-cream/60 text-sm">Drop your details below and our wholesale team will reach out to you.</p>
          </div>
          
          {formState === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gold/10 border border-gold/30 rounded-lg p-6 text-center text-gold"
            >
              <p className="font-medium">Thank you for your inquiry.</p>
              <p className="text-sm opacity-80 mt-1">Our wholesale team will review your details and contact you shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-cream/50 mb-2">Name / Business Name *</label>
                  <input name="name" required type="text" className="w-full bg-charcoal border border-cream/10 rounded px-4 py-3 text-cream focus:outline-none focus:border-gold transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-cream/50 mb-2">Country *</label>
                  <input name="country" required type="text" className="w-full bg-charcoal border border-cream/10 rounded px-4 py-3 text-cream focus:outline-none focus:border-gold transition-colors" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-cream/50 mb-2">Email Address *</label>
                  <input name="contact" required type="email" className="w-full bg-charcoal border border-cream/10 rounded px-4 py-3 text-cream focus:outline-none focus:border-gold transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-cream/50 mb-2">Approximate Quantity</label>
                  <input name="quantity" required type="number" min="1" placeholder="e.g. 100" className="w-full bg-charcoal border border-cream/10 rounded px-4 py-3 text-cream focus:outline-none focus:border-gold transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-cream/50 mb-2">Message (Optional)</label>
                <textarea name="message" rows={4} className="w-full bg-charcoal border border-cream/10 rounded px-4 py-3 text-cream focus:outline-none focus:border-gold transition-colors resize-none" placeholder="Tell us about your store or any specific requirements..."></textarea>
              </div>

              {formState === "error" && (
                <div className="text-red-400 text-sm">{errorMessage}</div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full bg-charcoal border-cream/20 hover:bg-cream/10 py-3"
                  disabled={formState === "submitting"}
                >
                  {formState === "submitting" ? "Sending..." : "Send Inquiry"}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* ── 5. Optional Featured Strip ── */}
        <div className="pt-16 border-t border-cream/10">
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <span className="block font-sans text-xs font-bold text-gold uppercase tracking-[0.2em] mb-2">
                Showcase
              </span>
              <h2 className="font-serif text-3xl md:text-4xl">
                Popular With Resellers
              </h2>
            </div>
            
            {/* Desktop Arrows */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={scrollLeft}
                className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center text-cream hover:bg-cream/5 hover:border-cream/50 transition-colors"
                aria-label="Scroll left"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button
                onClick={scrollRight}
                className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center text-cream hover:bg-cream/5 hover:border-cream/50 transition-colors"
                aria-label="Scroll right"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          {/* Scroll Strip */}
          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 md:gap-6 pb-8"
            >
              {popularResellerProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  className="snap-start shrink-0 w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[23%]"
                >
                  <ProductCard product={product} hidePrice />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
