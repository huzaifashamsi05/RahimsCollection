/**
 * Rahim's Collection — Step 1 Verification Page
 *
 * A static verification block that confirms the design foundation
 * is wired correctly: colors, fonts, and border-radius tokens.
 * This page is NOT final UI — it will be replaced in a later step.
 */

export default function VerificationPage() {
  const swatches = [
    { name: "charcoal-light", bg: "bg-charcoal-light", label: "Charcoal Light\n#2A2A2A" },
    { name: "gold",           bg: "bg-gold",           label: "Gold\n#9C7A3C" },
    { name: "cream",          bg: "bg-cream",          label: "Cream\n#F5F0E8" },
    { name: "ivory",          bg: "bg-ivory",          label: "Ivory\n#FFFFFF" },
  ];

  return (
    <main
      id="verification-root"
      className="min-h-screen bg-charcoal flex flex-col items-center justify-center gap-10 px-6 py-16"
    >
      {/* ── Heading ─────────────────────────────────── */}
      <div className="text-center space-y-3">
        <h1
          id="brand-heading"
          className="font-serif text-5xl sm:text-6xl lg:text-7xl text-gold tracking-wide"
        >
          Rahim&apos;s Collection
        </h1>
        <p
          id="verification-subtext"
          className="font-sans text-base sm:text-lg text-text-muted tracking-widest uppercase"
        >
          Design Foundation — Step 1 Verified
        </p>
      </div>

      {/* ── Colour Swatches ──────────────────────────── */}
      <div
        id="swatch-grid"
        className="flex flex-wrap items-center justify-center gap-5"
      >
        {swatches.map((swatch) => (
          <div
            key={swatch.name}
            id={`swatch-${swatch.name}`}
            className={`
              ${swatch.bg}
              rounded-luxury
              w-24 h-24
              border border-gold
              flex items-center justify-center
              shadow-md
            `}
          >
            {/* Swatch label — visible on hover via sibling trick */}
            <span className="font-sans text-[10px] text-center leading-tight text-text-muted px-1 whitespace-pre-line">
              {swatch.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Token Confirmation Strip ─────────────────── */}
      <p className="font-sans text-xs text-text-muted tracking-wider text-center max-w-xs">
        Playfair Display · Inter · Charcoal · Gold · Cream · Ivory ·{" "}
        <code className="text-gold-light">rounded-luxury</code>
      </p>
    </main>
  );
}
