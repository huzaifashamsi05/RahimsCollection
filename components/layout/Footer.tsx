import Link from "next/link";
import Image from "next/image";
import { WA_HREF } from "@/components/layout/Navbar";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

/* ============================================================
   Footer — Rahim's Collection

   Desktop : 4-column grid  →  Brand | Shop | Support | Connect
   Mobile  : single-column stacked, priority order:
             Brand → Connect → Shop → Support
             (WhatsApp contact rises to top on small screens)

   No cart, no checkout, no track-order, no payment badges.
   ============================================================ */

/* ── Icons ───────────────────────────────────────────────────── */
function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

/* ── Reusable footer link ────────────────────────────────────── */
function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const sharedClass = [
    "relative inline-block font-sans text-sm text-text-muted",
    "transition-colors duration-200 ease-out hover:text-cream",
    /* grow-from-center underline — consistent with Navbar */
    "after:content-[''] after:absolute after:bottom-[-2px]",
    "after:left-1/2 after:right-1/2",
    "after:h-px after:bg-gold",
    "after:transition-[left,right] after:duration-200 after:ease-out",
    "hover:after:left-0 hover:after:right-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal rounded-sm",
  ].join(" ");

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClass}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={sharedClass}>
      {children}
    </Link>
  );
}

/* ── Column heading ──────────────────────────────────────────── */
function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-sans text-xs font-semibold text-cream uppercase tracking-[0.2em] mb-5">
      {children}
    </h3>
  );
}

/* ── Social icon link ────────────────────────────────────────── */
function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "flex items-center justify-center w-9 h-9 rounded-luxury",
        "text-text-muted border border-charcoal-light",
        "transition-all duration-200 hover:text-gold hover:border-gold hover:scale-105",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
      ].join(" ")}
    >
      {children}
    </a>
  );
}

/* ── Trust pill ──────────────────────────────────────────────── */
function TrustPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-charcoal-light font-sans text-[11px] text-text-muted tracking-wide">
      {/* small gold dot */}
      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" aria-hidden="true" />
      {children}
    </span>
  );
}

/* ── Footer component ────────────────────────────────────────── */
export default function Footer({ settings }: { settings?: Record<string, string> }) {
  const currentYear = new Date().getFullYear();

  const FACEBOOK_URL  = settings?.['facebook_url'] || "";
  const INSTAGRAM_URL = settings?.['instagram_url'] || "";

  return (
    <footer
      id="site-footer"
      role="contentinfo"
      className={[
        "bg-charcoal",
        /* 1px top border, gold at ~20% opacity */
        "border-t border-gold/20",
        "mt-auto",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* ── Main grid ─────────────────────────────────────────
            Desktop:  [Brand] [Shop] [Support] [Connect]
            Mobile:   Brand → Connect → Shop → Support
                      (Connect/WhatsApp floats high on mobile)
           ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">

          {/* ── Col 1: Brand (first on both breakpoints) ──────── */}
          <div id="footer-brand" className="space-y-4 md:col-span-1">
            <Link
              href="/"
              aria-label="Rahim's Collection — Home"
              className={[
                "inline-block font-serif text-2xl text-gold tracking-wide",
                "transition-opacity duration-200 hover:opacity-80",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal rounded-sm",
              ].join(" ")}
            >
              <div className="bg-cream/95 p-2 rounded-md inline-flex items-center justify-center shadow-sm">
                <Image
                  src="/images/logo.png"
                  alt="Rahim's Collection Logo"
                  width={140}
                  height={50}
                  className="w-auto h-8 object-contain"
                />
              </div>
            </Link>
            <p className="font-sans text-sm text-text-muted leading-relaxed max-w-[22ch]">
              Premium fabrics, curated with care. Order directly via WhatsApp — personal, fast, and hassle-free.
            </p>
          </div>

          {/* ── Col 4: Connect — rendered 2nd on MOBILE so WhatsApp
                       rises near the top of the stacked layout.
                       Order class on desktop is handled by grid.     */}
          <div
            id="footer-connect"
            className="space-y-4 md:order-4 order-2"
          >
            <ColHeading>Connect</ColHeading>

            {/* WhatsApp CTA — plain anchor, no onClick needed; Footer is a Server Component */}
            <div>
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                id="footer-whatsapp-btn"
                aria-label="Chat on WhatsApp"
                className={[
                  "inline-flex items-center gap-2 rounded-luxury font-sans font-medium tracking-wide",
                  "text-sm px-4 py-2 min-h-[36px]",
                  "bg-transparent text-gold border border-gold",
                  "transition-all duration-200 ease-out",
                  "hover:border-gold-light hover:text-gold-light hover:bg-gold/5 hover:-translate-y-px",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
                ].join(" ")}
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {FACEBOOK_URL && (
                <SocialLink href={FACEBOOK_URL}  label="Visit our Facebook page">
                  <FacebookIcon  className="w-4 h-4" />
                </SocialLink>
              )}
              {INSTAGRAM_URL && (
                <SocialLink href={INSTAGRAM_URL} label="Visit our Instagram profile">
                  <InstagramIcon className="w-4 h-4" />
                </SocialLink>
              )}
              <SocialLink href={WA_HREF} label="Chat on WhatsApp">
                <WhatsAppIcon  className="w-4 h-4" />
              </SocialLink>
            </div>
          </div>

          {/* ── Col 2: Shop ─────────────────────────────── */}
          <div
            id="footer-shop"
            className="space-y-4 md:order-2 order-3"
          >
            <ColHeading>Shop</ColHeading>
            <nav aria-label="Shop links">
              <ul className="space-y-3">
                {[
                  { href: "/#new-arrivals",              label: "New Arrivals"  },
                  { href: "/shop?category=raw-silk",     label: "Raw Silk"      },
                  { href: "/shop?category=chiffon",      label: "Chiffon"       },
                  { href: "/shop?category=organza",      label: "Organza"       },
                  { href: "/shop",                       label: "All Products"  },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <FooterLink href={href}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Col 3: Support ─────────────────────────── */}
          <div
            id="footer-support"
            className="space-y-4 md:order-3 order-4"
          >
            <ColHeading>Support</ColHeading>
            <nav aria-label="Support links">
              <ul className="space-y-3">
                {[
                  { href: "/returns",       label: "Returns & Exchange",       external: false },
                  { href: "/bulk-orders",   label: "Bulk / International Orders", external: false },
                  { href: WA_HREF,          label: "Contact Us (WhatsApp)",    external: true  },
                ].map(({ href, label, external }) => (
                  <li key={label}>
                    <FooterLink href={href} external={external}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

        </div>

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div className="mt-14 pt-6 border-t border-charcoal-light flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="font-sans text-xs text-text-muted text-center sm:text-left">
            © {currentYear} Rahim&apos;s Collection. All rights reserved.
          </p>

          {/* Trust pills — no payment badges (no online checkout) */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <TrustPill>Reasonable Prices</TrustPill>
            <TrustPill>Quality Assured</TrustPill>
          </div>

        </div>
      </div>
    </footer>
  );
}
