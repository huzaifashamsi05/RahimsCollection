import { Suspense } from "react";
import type { Metadata } from "next";
import ShopContent from "@/components/shop/ShopContent";

/* ============================================================
   Shop Page — Rahim's Collection  (/shop)

   Server Component: provides metadata + wraps the interactive
   ShopContent (Client Component) in Suspense as required by
   Next.js when useSearchParams() is used inside a client component
   that is server-rendered.

   Navbar renders solid/compact immediately here — handled by
   Navbar's usePathname logic (Step 9).
   ============================================================ */

export const metadata: Metadata = {
  title: "Shop All | Rahim's Collection",
  description:
    "Browse our full collection of premium women's unstitched suits — Raw Silk, Chiffon, Organza, Georgette, Net, and Velvet. Order directly via WhatsApp. Nationwide delivery.",
  openGraph: {
    title: "Shop All | Rahim's Collection",
    description:
      "Premium women's unstitched suits. Browse by fabric — Raw Silk, Chiffon, Organza, and more. Order via WhatsApp.",
  },
};

/* ── Loading skeleton (Suspense fallback) ────────────────────── */
function ShopSkeleton() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen pt-24 md:pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Breadcrumb placeholder */}
        <div className="h-3 w-24 bg-charcoal/10 rounded mb-5" />
        {/* Heading placeholder */}
        <div className="h-10 w-48 bg-charcoal/10 rounded mb-12" />
        {/* Grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] bg-charcoal/8 rounded-luxury" />
              <div className="h-3 w-3/4 bg-charcoal/8 rounded" />
              <div className="h-3 w-1/2 bg-charcoal/8 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
import { getAllProducts } from "@/lib/queries/products";

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <main id="main-content">
      <Suspense fallback={<ShopSkeleton />}>
        <ShopContent initialProducts={products} />
      </Suspense>
    </main>
  );
}
