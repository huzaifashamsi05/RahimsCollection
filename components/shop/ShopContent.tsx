"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import FilterPanel from "@/components/shop/FilterPanel";
import { Product } from "@/types/product";
import {
  FilterState,
  DEFAULT_FILTERS,
  PRICE_MIN,
  PRICE_MAX,
} from "@/types/filters";

/* ============================================================
   ShopContent — Rahim's Collection

   Desktop : horizontal filter pill-bar with dropdown popovers
             → full-width product grid (2 / 3 / 4 cols)
   Mobile  : "Filters" button → bottom-sheet overlay (unchanged)
   ============================================================ */

const PAGE_SIZE = 8;
const EASE_OUT  = [0.0, 0.0, 0.2, 1.0] as const;

/* ── Static filter option lists ──────────────────────────────── */

const FILTER_CATEGORIES = [
  { slug: "raw-silk",  label: "Raw Silk"  },
  { slug: "chiffon",   label: "Chiffon"   },
  { slug: "organza",   label: "Organza"   },
  { slug: "georgette", label: "Georgette" },
  { slug: "net",       label: "Net"       },
  { slug: "velvet",    label: "Velvet"    },
] as const;

const FILTER_STOCK_TYPES = [
  { value: "ready"         as const, label: "Ready to Ship" },
  { value: "made-to-order" as const, label: "Made to Order" },
] as const;

const FILTER_PIECE_COUNTS = [
  { value: 2 as const, label: "2-Piece" },
  { value: 3 as const, label: "3-Piece" },
] as const;

/* ── Helpers ─────────────────────────────────────────────────── */

function titleCase(slug: string) {
  return slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

function filterProducts(products: Product[], f: FilterState): Product[] {
  return products.filter((p) => {
    if (f.categories.length  > 0 && !f.categories.includes(p.category))                            return false;
    if (p.price < f.priceMin || p.price > f.priceMax)                                               return false;
    if (f.stockTypes.length  > 0 && !f.stockTypes.includes(p.stockType as "ready"|"made-to-order")) return false;
    if (f.pieceCounts.length > 0 && !f.pieceCounts.includes(p.pieceCount as 2|3))                  return false;
    return true;
  });
}

function hasNonDefaultFilters(f: FilterState): boolean {
  return (
    f.categories.length  > 0 ||
    f.priceMin > PRICE_MIN   ||
    f.priceMax < PRICE_MAX   ||
    f.stockTypes.length  > 0 ||
    f.pieceCounts.length > 0
  );
}

/* ── Icons ───────────────────────────────────────────────────── */

function FilterIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 5h14M6 10h8M9 15h2" />
    </svg>
  );
}
function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}
function XSmallIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 10 10" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M2 2l6 6M8 2L2 8" />
    </svg>
  );
}

/* ── Empty state ─────────────────────────────────────────────── */

function EmptyState({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center text-center py-24 px-4 gap-6">
      <div className="w-20 h-20 rounded-full bg-charcoal/8 flex items-center justify-center" aria-hidden="true">
        <svg className="w-9 h-9 text-charcoal/30" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="font-serif text-2xl text-charcoal">No products found</h3>
        <p className="font-sans text-sm text-charcoal/50">Try adjusting your filters to see more results.</p>
      </div>
      {onClearFilters && (
        <Button variant="ghost" size="md" onClick={onClearFilters}
          id="shop-clear-filters" aria-label="Clear all active filters">
          Clear Filters
        </Button>
      )}
    </div>
  );
}

/* ── Active filter chip ──────────────────────────────────────── */

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.18, ease: EASE_OUT }}
      className="inline-flex items-center gap-1.5 font-sans text-xs font-medium
        tracking-wide bg-charcoal text-cream px-3 py-1.5 rounded-full shrink-0"
    >
      <span>{label}</span>
      <button type="button" onClick={onRemove} aria-label={`Remove ${label} filter`}
        className="hover:opacity-70 transition-opacity duration-100 focus-visible:outline-none">
        <XSmallIcon className="w-2.5 h-2.5" />
      </button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP HORIZONTAL FILTER BAR — sub-components
   ═══════════════════════════════════════════════════════════════ */

/* Checkbox + label row used inside popovers */
function OptionRow({
  checked, onChange, label,
}: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group select-none min-h-[36px]">
      <span className={[
        "w-4 h-4 border rounded shrink-0 flex items-center justify-center transition-all duration-100",
        checked
          ? "bg-charcoal border-charcoal"
          : "border-charcoal/30 group-hover:border-charcoal/60",
      ].join(" ")} aria-hidden="true">
        {checked && (
          <svg className="w-2 h-2 text-cream" viewBox="0 0 8 7" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 3.5l2 2.5 4-5" />
          </svg>
        )}
      </span>
      <span className="font-sans text-sm text-charcoal/75 group-hover:text-charcoal transition-colors duration-100 leading-tight">
        {label}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );
}

/* Dual-thumb price slider — reuses .price-range-thumb from globals.css */
function PricePanel({
  priceMin, priceMax, onChange,
}: { priceMin: number; priceMax: number; onChange: (min: number, max: number) => void }) {
  const range  = PRICE_MAX - PRICE_MIN;
  const minPct = ((priceMin - PRICE_MIN) / range) * 100;
  const maxPct = ((priceMax - PRICE_MIN) / range) * 100;
  return (
    <div className="space-y-3">
      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-1.5 bg-charcoal/12 rounded-full" />
        <div className="absolute h-1.5 bg-gold rounded-full pointer-events-none"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }} />
        <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={500} value={priceMin}
          onChange={(e) => { const v = +e.target.value; if (v < priceMax - 500) onChange(v, priceMax); }}
          aria-label="Minimum price" className="price-range-thumb" />
        <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={500} value={priceMax}
          onChange={(e) => { const v = +e.target.value; if (v > priceMin + 500) onChange(priceMin, v); }}
          aria-label="Maximum price" className="price-range-thumb" />
      </div>
      <div className="flex justify-between font-sans text-xs text-charcoal/55">
        <span>Rs.&nbsp;{priceMin.toLocaleString()}</span>
        <span>Rs.&nbsp;{priceMax.toLocaleString()}</span>
      </div>
    </div>
  );
}

/* Pill button + animated dropdown panel */
function FilterDropdown({
  id, label, count, isOpen, onToggle, onClose, children, panelWidth = "auto",
}: {
  id: string; label: string; count: number;
  isOpen: boolean; onToggle: () => void; onClose: () => void;
  children: React.ReactNode; panelWidth?: string;
}) {
  const active = isOpen || count > 0;
  return (
    <div className="relative">
      <button
        type="button"
        id={`filter-btn-${id}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        className={[
          "inline-flex items-center gap-1.5 select-none",
          "font-sans text-xs font-medium tracking-wide",
          "border rounded-full px-3.5 py-1.5 transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1",
          active
            ? "bg-charcoal border-charcoal text-cream"
            : "bg-transparent border-charcoal/25 text-charcoal hover:border-charcoal/55",
        ].join(" ")}
      >
        <span>{label}</span>
        {count > 0 && (
          <span className="bg-gold text-charcoal text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shrink-0">
            {count}
          </span>
        )}
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          className="w-3 h-3 shrink-0 opacity-55"
          viewBox="0 0 12 12" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"
        >
          <path d="M2 4l4 4 4-4" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={`panel-${id}`}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14, ease: EASE_OUT }}
            role="dialog"
            aria-label={`${label} filter options`}
            className="absolute top-full left-0 mt-2 z-30 bg-[#FAF7F2] border border-charcoal/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.11)] p-4"
            style={{ width: panelWidth }}
          >
            {children}
            {/* Done */}
            <div className="mt-3 pt-3 border-t border-charcoal/8">
              <button type="button" onClick={onClose}
                className="w-full font-sans text-xs font-semibold text-charcoal/40 hover:text-gold transition-colors duration-150 py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm">
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Horizontal bar — desktop only (hidden below lg) */
interface FilterBarProps {
  filters:        FilterState;
  onChangeFilter: (next: FilterState) => void;
}

function FilterBar({ filters, onChangeFilter }: FilterBarProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  /* Close on outside pointer-down */
  useEffect(() => {
    function handler(e: PointerEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  /* Close on Escape */
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpenGroup(null); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const tog   = (id: string) => setOpenGroup((p) => (p === id ? null : id));
  const close = () => setOpenGroup(null);

  const catCount   = filters.categories.length;
  const priceCount = filters.priceMin > PRICE_MIN || filters.priceMax < PRICE_MAX ? 1 : 0;
  const stockCount = filters.stockTypes.length;
  const pieceCount = filters.pieceCounts.length;

  return (
    <div ref={barRef} className="hidden lg:flex items-center gap-2 flex-wrap">

      {/* Category */}
      <FilterDropdown id="category" label="Category" count={catCount}
        isOpen={openGroup === "category"} onToggle={() => tog("category")} onClose={close}
        panelWidth="200px">
        <div>
          {FILTER_CATEGORIES.map((cat) => (
            <OptionRow key={cat.slug} label={cat.label}
              checked={filters.categories.includes(cat.slug)}
              onChange={() => onChangeFilter({ ...filters, categories: toggle(filters.categories, cat.slug) })} />
          ))}
        </div>
      </FilterDropdown>

      {/* Price */}
      <FilterDropdown id="price" label="Price" count={priceCount}
        isOpen={openGroup === "price"} onToggle={() => tog("price")} onClose={close}
        panelWidth="256px">
        <PricePanel priceMin={filters.priceMin} priceMax={filters.priceMax}
          onChange={(min, max) => onChangeFilter({ ...filters, priceMin: min, priceMax: max })} />
      </FilterDropdown>

      {/* Availability */}
      <FilterDropdown id="stock" label="Availability" count={stockCount}
        isOpen={openGroup === "stock"} onToggle={() => tog("stock")} onClose={close}
        panelWidth="192px">
        <div>
          {FILTER_STOCK_TYPES.map(({ value, label }) => (
            <OptionRow key={value} label={label}
              checked={filters.stockTypes.includes(value)}
              onChange={() => onChangeFilter({ ...filters, stockTypes: toggle(filters.stockTypes, value) })} />
          ))}
        </div>
      </FilterDropdown>

      {/* Suit Type */}
      <FilterDropdown id="suit" label="Suit Type" count={pieceCount}
        isOpen={openGroup === "suit"} onToggle={() => tog("suit")} onClose={close}
        panelWidth="168px">
        <div>
          {FILTER_PIECE_COUNTS.map(({ value, label }) => (
            <OptionRow key={value} label={label}
              checked={filters.pieceCounts.includes(value)}
              onChange={() => onChangeFilter({ ...filters, pieceCounts: toggle(filters.pieceCounts, value) })} />
          ))}
        </div>
      </FilterDropdown>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SHOP COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function ShopContent({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const searchParams = useSearchParams();
  const router       = useRouter();

  /* Initialise from ?category=X URL param (category-card deep-link) */
  const initCategory = searchParams.get("category");
  const initFilters: FilterState = {
    ...DEFAULT_FILTERS,
    categories: initCategory ? [initCategory] : [],
  };

  /* ── Filter state ────────────────────────────────────────── */
  const [filters,        setFilters]        = useState<FilterState>(initFilters);
  const [pendingFilters, setPendingFilters] = useState<FilterState>(initFilters);
  const [isMobileOpen,   setIsMobileOpen]   = useState(false);

  /* ── Pagination ──────────────────────────────────────────── */
  const [visibleCount,   setVisibleCount]   = useState(PAGE_SIZE);
  const [isLoadingMore,  setIsLoadingMore]  = useState(false);
  const [lastBatchStart, setLastBatchStart] = useState(0);

  /* ── Grid fade epoch (increments on every filter change) ─── */
  const [filterEpoch, setFilterEpoch] = useState(0);

  /* ── Derived ─────────────────────────────────────────────── */
  const filteredProducts = useMemo(() => filterProducts(initialProducts, filters), [initialProducts, filters]);
  const visibleProducts  = filteredProducts.slice(0, visibleCount);
  const hasMore          = visibleCount < filteredProducts.length;
  const allShown         = !hasMore && filteredProducts.length > 0;
  const activeFilters    = hasNonDefaultFilters(filters);

  const pendingCount = useMemo(
    () => filterProducts(initialProducts, pendingFilters).length,
    [initialProducts, pendingFilters]
  );

  /* ── Active chips ────────────────────────────────────────── */
  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; onRemove: () => void }[] = [];

    filters.categories.forEach((slug) =>
      chips.push({
        id:       `cat-${slug}`,
        label:    titleCase(slug),
        onRemove: () => applyDesktopFilter({ ...filters, categories: filters.categories.filter((c) => c !== slug) }),
      })
    );
    if (filters.priceMin > PRICE_MIN || filters.priceMax < PRICE_MAX) {
      chips.push({
        id:       "price",
        label:    `Rs. ${filters.priceMin.toLocaleString()}–${filters.priceMax.toLocaleString()}`,
        onRemove: () => applyDesktopFilter({ ...filters, priceMin: PRICE_MIN, priceMax: PRICE_MAX }),
      });
    }
    filters.stockTypes.forEach((t) =>
      chips.push({
        id:       `stock-${t}`,
        label:    t === "ready" ? "Ready to Ship" : "Made to Order",
        onRemove: () => applyDesktopFilter({ ...filters, stockTypes: filters.stockTypes.filter((s) => s !== t) }),
      })
    );
    filters.pieceCounts.forEach((pc) =>
      chips.push({
        id:       `pc-${pc}`,
        label:    `${pc}-Piece`,
        onRemove: () => applyDesktopFilter({ ...filters, pieceCounts: filters.pieceCounts.filter((c) => c !== pc) }),
      })
    );
    return chips;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  /* ── Handlers ────────────────────────────────────────────── */

  function resetPagination() {
    setVisibleCount(PAGE_SIZE);
    setLastBatchStart(0);
    setFilterEpoch((e) => e + 1);
  }

  /* Desktop: real-time (no Apply step) */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyDesktopFilter = useCallback((next: FilterState) => {
    setFilters(next);
    setPendingFilters(next);
    resetPagination();
  }, []);

  /* Mobile: open sheet and sync pending state */
  const openMobileFilter = useCallback(() => {
    setPendingFilters(filters);
    setIsMobileOpen(true);
  }, [filters]);

  /* Mobile: commit buffered pending filters */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyMobileFilters = useCallback(() => {
    setFilters(pendingFilters);
    resetPagination();
    setIsMobileOpen(false);
  }, [pendingFilters]);

  /* Clear all + remove URL query param */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPendingFilters(DEFAULT_FILTERS);
    resetPagination();
    router.push("/shop");
  }, [router]);

  /* Load More */
  const loadMore = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    const batchStart = visibleCount;
    setTimeout(() => {
      setLastBatchStart(batchStart);
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredProducts.length));
      setIsLoadingMore(false);
    }, 480);
  }, [isLoadingMore, visibleCount, filteredProducts.length]);

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ─────────────────────────────────────────────────────
          MOBILE FILTER BOTTOM-SHEET  (unchanged from Step 11)
          ───────────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 767px) {
          html, body {
            scroll-snap-type: y proximity;
          }
        }
      `}</style>
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div key="filter-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-charcoal/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileOpen(false)} aria-hidden="true" />

            {/* Sheet */}
            <motion.div key="filter-sheet"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              role="dialog" aria-modal="true" aria-label="Product filters"
              className="fixed bottom-0 inset-x-0 z-[70] bg-[#FAF7F2] rounded-t-2xl max-h-[85vh] flex flex-col lg:hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal/10 shrink-0">
                <h2 className="font-serif text-xl text-charcoal">Filters</h2>
                <button type="button" onClick={() => setIsMobileOpen(false)} aria-label="Close filters"
                  className="w-9 h-9 flex items-center justify-center rounded-luxury text-charcoal/50 hover:text-charcoal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable filter body — uses FilterPanel (Step 11) */}
              <div className="flex-1 overflow-y-auto px-5 py-3">
                <FilterPanel filters={pendingFilters} onChangeFilter={setPendingFilters} />
              </div>

              {/* Sticky "Show X Results" CTA */}
              <div className="px-5 pb-8 pt-4 border-t border-charcoal/10 shrink-0">
                <button type="button" onClick={applyMobileFilters}
                  className="w-full flex items-center justify-center font-sans font-semibold text-base tracking-wide bg-gold text-charcoal rounded-luxury py-3.5 min-h-[52px] transition-[background-color] duration-200 hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2">
                  Show {pendingCount} Result{pendingCount !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────
          MAIN PAGE  (full-width — no sidebar)
          ───────────────────────────────────────────────────── */}
      <div className="bg-[#FAF7F2] min-h-screen pt-24 md:pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* ── Page header ────────────────────────────────── */}
          <div className="mb-6">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-2 font-sans text-xs text-charcoal/40">
                <li>
                  <Link href="/"
                    className="hover:text-gold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">
                  <span className="text-charcoal/60">Shop</span>
                </li>
                {filters.categories.length === 1 && (
                  <>
                    <li aria-hidden="true">/</li>
                    <li>
                      <span className="text-charcoal/60">{titleCase(filters.categories[0])}</span>
                    </li>
                  </>
                )}
              </ol>
            </nav>

            {/* Heading + count + mobile filter button */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <h1 className="font-serif text-4xl sm:text-5xl text-charcoal leading-tight">
                Shop All
                {filters.categories.length === 1 && (
                  <span className="text-charcoal/45 ml-3">
                    —&nbsp;{titleCase(filters.categories[0])}
                  </span>
                )}
              </h1>

              <div className="flex items-center gap-3 shrink-0 pb-1">
                <p className="font-sans text-sm text-charcoal/45">
                  <span className="font-medium text-charcoal/65">{filteredProducts.length}</span>
                  {" "}{filteredProducts.length === 1 ? "product" : "products"}
                </p>

                {/* Mobile filter button — hidden on desktop */}
                <button
                  type="button"
                  id="shop-filter-trigger"
                  onClick={openMobileFilter}
                  aria-label="Open filters"
                  className={[
                    "lg:hidden inline-flex items-center gap-2",
                    "font-sans text-sm font-medium tracking-wide",
                    "border border-charcoal/25 text-charcoal rounded-luxury",
                    "px-4 py-2 min-h-[38px]",
                    "transition-[border-color,color] duration-150",
                    "hover:border-gold hover:text-gold",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                    activeFilters ? "border-gold text-gold" : "",
                  ].join(" ")}
                >
                  <FilterIcon className="w-4 h-4" />
                  Filters
                  {activeChips.length > 0 && (
                    <span className="ml-0.5 bg-gold text-charcoal text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {activeChips.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Desktop horizontal filter pill-bar ─────────── */}
          <FilterBar filters={filters} onChangeFilter={applyDesktopFilter} />

          {/* ── Active filter chips ──────────────────────── */}
          <AnimatePresence mode="popLayout">
            {activeChips.length > 0 && (
              <motion.div
                key="chips-row"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <AnimatePresence mode="popLayout">
                    {activeChips.map((chip) => (
                      <FilterChip key={chip.id} label={chip.label} onRemove={chip.onRemove} />
                    ))}
                  </AnimatePresence>
                  {activeChips.length >= 2 && (
                    <motion.div layout>
                      <button type="button" onClick={clearAllFilters}
                        className="font-sans text-xs text-charcoal/45 hover:text-gold transition-colors duration-150 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm">
                        Clear All
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Product grid — full width, 2/3/4 cols ──────── */}
          <motion.div
            key={filterEpoch}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="mt-8"
          >
            <div
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-5"
              aria-label="Product grid"
            >
              {visibleProducts.length === 0 ? (
                <EmptyState onClearFilters={activeFilters ? clearAllFilters : undefined} />
              ) : (
                visibleProducts.map((product, i) => {
                  const isNew   = lastBatchStart > 0 && i >= lastBatchStart;
                  const stagger = isNew ? (i - lastBatchStart) * 0.06 : 0;
                  return (
                    <motion.div
                      key={product.id}
                      initial={isNew ? { opacity: 0, y: 24 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={isNew ? { duration: 0.5, ease: EASE_OUT, delay: stagger } : {}}
                    >
                      <ProductCard product={product} priority={i < 4} />
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* ── Load More / End state ───────────────────────── */}
          {filteredProducts.length > 0 && (
            <div className="mt-12 md:mt-16 flex flex-col items-center gap-4">
              {hasMore ? (
                <Button
                  id="shop-load-more"
                  variant="secondary"
                  size="lg"
                  isLoading={isLoadingMore}
                  disabled={isLoadingMore}
                  onClick={loadMore}
                  aria-label="Load more products"
                >
                  {isLoadingMore ? "Loading…" : "Load More"}
                </Button>
              ) : allShown ? (
                <p className="font-sans text-sm text-charcoal/40 tracking-wide">
                  You&apos;ve seen it all — {filteredProducts.length} products
                </p>
              ) : null}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
