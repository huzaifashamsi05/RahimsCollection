"use client";

import { usePathname } from "next/navigation";
import { getWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  
  // Hide on Product Detail page ONLY for mobile since it has a sticky bar there.
  // We can't know viewport size purely on server, but we can hide it conditionally with Tailwind.
  // Product detail pages are at /shop/[slug]
  const isProductPage = pathname?.startsWith("/shop/") && pathname.length > "/shop/".length;

  const WA_HREF = getWhatsAppLink("Hi, I'd like to know more about your collection.");

  return (
    <a
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={[
        "fixed bottom-6 right-4 md:bottom-8 md:right-8 z-[60]",
        "flex items-center justify-center w-14 h-14 md:w-16 md:h-16",
        "bg-gold text-charcoal rounded-full shadow-lg",
        "transition-all duration-300 ease-out",
        "hover:bg-gold-light hover:scale-110 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
        // If on product page, hide on mobile (because of sticky bottom bar) but show on desktop
        isProductPage ? "hidden md:flex" : "flex",
      ].join(" ")}
    >
      <WhatsAppIcon className="w-7 h-7 md:w-8 md:h-8" />
    </a>
  );
}
