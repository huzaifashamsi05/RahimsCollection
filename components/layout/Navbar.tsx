"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================================
   Navbar — Rahim's Collection
   
   • Desktop: Logo left | Nav links centre-left | WhatsApp right
   • Mobile:  Hamburger left | Logo centre | WhatsApp right
              Full-screen overlay with staggered links (Framer Motion)
   • Scroll:  Transparent at top → solid charcoal past 80px
   • No cart icon — WhatsApp-first contact model
   ============================================================ */

/* ── Constants ───────────────────────────────────────────────── */
const NAV_LINKS = [
  { href: "/#new-arrivals", label: "New Arrivals" },
  { href: "/shop",          label: "Shop"         },
  { href: "/about",         label: "About"        },
  { href: "/bulk-orders",   label: "Bulk Orders"  },
] as const;

/* TODO: Replace PHONE_NUMBER with the confirmed WhatsApp number
         in lib/constants.ts — that's the single source of truth. */
import { getWhatsAppLink } from "@/lib/whatsapp";
export const WA_HREF = getWhatsAppLink("Hi, I'd like to know more about your collection.");

/* ── Easing constants (typed for Framer Motion) ──────────────── */
const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as const;
const EASE_IN  = [0.4, 0.0, 1.0, 1.0] as const;

/* ── Icons ───────────────────────────────────────────────────── */
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

function HamburgerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="3"  y1="6"  x2="21" y2="6"  />
      <line x1="3"  y1="12" x2="21" y2="12" />
      <line x1="3"  y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  );
}

/* ── Desktop nav link — underline grows from center ─────────── */
function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "relative font-sans text-sm font-medium text-cream tracking-wide",
        "transition-colors duration-200 ease-out hover:text-ivory",
        /* grow-from-center underline via left/right inset shrink trick */
        "after:content-[''] after:absolute after:bottom-[-3px]",
        "after:left-1/2 after:right-1/2",
        "after:h-[1.5px] after:bg-gold",
        "after:transition-[left,right] after:duration-200 after:ease-out",
        "hover:after:left-0 hover:after:right-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal rounded-sm",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

/* ── WhatsApp link button (shared) ───────────────────────────── */
function WhatsAppButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={[
        "flex items-center justify-center w-10 h-10",
        "text-gold rounded-luxury shrink-0",
        "transition-all duration-200 hover:text-gold-light hover:scale-110",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
        className,
      ].join(" ")}
    >
      <WhatsAppIcon className="w-6 h-6" />
    </a>
  );
}

/* ── Component ───────────────────────────────────────────────── */
export default function Navbar() {
  const pathname   = usePathname();
  const isHomepage = pathname === "/";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  /*
   * Non-homepage pages: Navbar is always solid (no transparent hero).
   * Homepage: transparent at top, compacts past 80 px on scroll.
   */
  const [isScrolled, setIsScrolled] = useState(!isHomepage);

  /* Scroll listener — only active on the homepage */
  useEffect(() => {
    if (!isHomepage) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomepage]);

  /* Scroll-lock while mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const openMenu  = useCallback(() => setIsMenuOpen(true), []);

  return (
    <>
      {/* ── Header bar ───────────────────────────────────────── */}
      <header
        id="navbar"
        role="banner"
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300",
          isScrolled
            ? "bg-charcoal border-b border-charcoal-light shadow-[0_2px_24px_rgba(0,0,0,0.45)] py-3"
            : "bg-transparent py-5",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between">

            {/* ── Mobile: Hamburger ──── */}
            <button
              id="nav-hamburger"
              className={[
                "md:hidden flex items-center justify-center w-10 h-10 -ml-2",
                "text-cream rounded-luxury",
                "transition-colors duration-200 hover:text-gold",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
              ].join(" ")}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              onClick={openMenu}
            >
              <HamburgerIcon className="w-6 h-6" />
            </button>

            {/* ── Logo ──────────────────
                Desktop: static, left-aligned.
                Mobile:  absolute-centred between hamburger and WA icon. */}
            <Link
              href="/"
              id="nav-logo"
              aria-label="Rahim's Collection — Home"
              className={[
                "font-serif text-gold tracking-wide shrink-0",
                "transition-opacity duration-200 hover:opacity-80",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal rounded-sm",
                "text-xl md:text-2xl",
                /* Mobile-only: absolute centre */
                "absolute left-1/2 -translate-x-1/2",
                /* Desktop: reset to flow position */
                "md:static md:translate-x-0 md:mr-10",
              ].join(" ")}
            >
              <div className="bg-cream/95 p-1.5 md:p-2 rounded flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Rahim's Collection Logo"
                  width={140}
                  height={50}
                  className="w-auto h-8 md:h-10 object-contain"
                  priority
                />
              </div>
            </Link>

            {/* ── Desktop: Nav links ─── */}
            <nav
              id="desktop-nav"
              aria-label="Primary navigation"
              className="hidden md:flex items-center gap-8 flex-1"
            >
              {NAV_LINKS.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen overlay ───────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25, ease: EASE_OUT } }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE_IN } }}
            className="fixed inset-0 z-40 bg-charcoal flex flex-col"
          >
            {/* ── Overlay top bar ─── */}
            <motion.div
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.3, ease: EASE_OUT, delay: 0.05 } }}
              exit={{ y: -8, opacity: 0, transition: { duration: 0.2, ease: EASE_IN } }}
              className="relative flex items-center justify-between px-4 py-5 border-b border-charcoal-light shrink-0"
            >
              <button
                id="mobile-menu-close"
                onClick={closeMenu}
                aria-label="Close menu"
                className={[
                  "flex items-center justify-center w-10 h-10 -ml-2",
                  "text-cream rounded-luxury",
                  "transition-colors duration-200 hover:text-gold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
                ].join(" ")}
              >
                <CloseIcon className="w-6 h-6" />
              </button>

              <Link
                href="/"
                onClick={closeMenu}
                aria-label="Rahim's Collection — Home"
                className="absolute left-1/2 -translate-x-1/2 font-serif text-gold text-xl tracking-wide"
              >
                Rahim&apos;s Collection
              </Link>
            </motion.div>

            {/* ── Staggered nav links ─── */}
            <nav
              aria-label="Mobile navigation"
              className="flex-1 flex flex-col justify-center px-8 overflow-y-auto"
            >
              <ul className="space-y-1" role="list">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ x: -24, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      transition: { duration: 0.3, ease: EASE_OUT, delay: 0.1 + i * 0.07 },
                    }}
                    exit={{
                      x: -12,
                      opacity: 0,
                      transition: { duration: 0.15, delay: (NAV_LINKS.length - 1 - i) * 0.04 },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={[
                        "flex items-center min-h-[56px] w-full",
                        "font-serif text-3xl text-cream tracking-wide",
                        "border-b border-charcoal-light",
                        "transition-colors duration-200 hover:text-gold",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                        "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal rounded-sm",
                      ].join(" ")}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* ── WhatsApp CTA strip ─── */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.3, ease: EASE_OUT, delay: 0.35 } }}
              exit={{ y: 8, opacity: 0, transition: { duration: 0.2, ease: EASE_IN } }}
              className="px-8 pb-10 pt-6 border-t border-charcoal-light shrink-0"
            >
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className={[
                  "flex items-center justify-center gap-3 w-full min-h-[52px]",
                  "rounded-luxury bg-gold text-charcoal font-sans font-semibold tracking-wide",
                  "transition-all duration-200 hover:bg-gold-light",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
                ].join(" ")}
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
