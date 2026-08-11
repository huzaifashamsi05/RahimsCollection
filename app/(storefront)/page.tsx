/**
 * Rahim's Collection — Homepage
 *
 * Structure:
 *  1. Hero               — full-viewport animated entrance
 *  2. NewArrivalsShowcase — scroll-driven cinematic showcase (5 products)
 *  3. Categories, About, etc. (future steps)
 *
 * Navbar + Footer rendered by app/layout.tsx.
 * Navbar starts transparent over hero; compacts on scroll (Step 3 logic).
 */

import Hero from "@/components/sections/Hero";
import NewArrivalsShowcase from "@/components/home/NewArrivalsShowcase";
import CategoriesSection from "@/components/home/CategoriesSection";
import { getFeaturedNewArrivals, getCategoryCounts } from "@/lib/queries/products";
import { getSettings } from "@/lib/queries/settings";

export default async function HomePage() {
  const [featuredProducts, categoryCounts, settings] = await Promise.all([
    getFeaturedNewArrivals(),
    getCategoryCounts(),
    getSettings()
  ]);

  return (
    <main id="main-content">

      {/* ── 1. Hero ─────────────────────────────────────── */}
      <Hero 
        headline={settings['hero_headline']} 
        subtext={settings['hero_subtext']} 
        sliderImages={[
          settings['hero_slider_1'],
          settings['hero_slider_2'],
          settings['hero_slider_3'],
          settings['hero_slider_4'],
        ].filter(Boolean)}
      />

      {/* ── 2. New Arrivals scrollytelling showcase ──────
            id="new-arrivals" is the Hero CTA scroll target.
            Data: 5 curated products from Supabase.
      */}
      <NewArrivalsShowcase products={featuredProducts} />

      {/* ── 3. Categories grid ───────────────────────────
            6 fabric categories: Raw Silk, Chiffon, Organza,
            Georgette, Net, Velvet (seasonal).
            Links to /shop?category=X — filtering built later.
      */}
      <CategoriesSection categoryCounts={categoryCounts} settings={settings} />

    </main>
  );
}
