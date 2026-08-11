"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FilterState,
  PRICE_MIN,
  PRICE_MAX,
} from "@/types/filters";

/* ============================================================
   FilterPanel — Rahim's Collection
   Pure controlled component: receives current filters + a single
   onChangeFilter(newState) callback. Works in both the desktop
   sidebar (real-time) and the mobile bottom-sheet (buffered).
   ============================================================ */

const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as const;

export const CATEGORIES = [
  { slug: "raw-silk",  label: "Raw Silk"  },
  { slug: "chiffon",   label: "Chiffon"   },
  { slug: "organza",   label: "Organza"   },
  { slug: "georgette", label: "Georgette" },
  { slug: "net",       label: "Net"       },
  { slug: "velvet",    label: "Velvet"    },
] as const;

const STOCK_TYPES = [
  { value: "ready"          as const, label: "Ready to Ship"  },
  { value: "made-to-order"  as const, label: "Made to Order"  },
] as const;

const PIECE_COUNTS = [
  { value: 2 as const, label: "2-Piece" },
  { value: 3 as const, label: "3-Piece" },
] as const;

/* ── Sub-components ──────────────────────────────────────────── */

/* Collapsible filter group */
function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-charcoal/10 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        className={[
          "flex items-center justify-between w-full py-2",
          "font-sans text-xs font-semibold text-charcoal/70 tracking-[0.08em] uppercase",
          "hover:text-gold transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm",
        ].join(" ")}
      >
        <span>{title}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="w-3.5 h-3.5 shrink-0 text-charcoal/35"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M3 6l5 5 5-5" />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="pb-2.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Styled checkbox row */
function CheckboxItem({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  id: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 py-1.5 cursor-pointer group"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      {/* Custom checkbox visual */}
      <span
        className={[
          "w-4 h-4 rounded shrink-0 border transition-all duration-150",
          "flex items-center justify-center",
          checked
            ? "bg-charcoal border-charcoal"
            : "bg-transparent border-charcoal/30 group-hover:border-charcoal/60",
        ].join(" ")}
        aria-hidden="true"
      >
        {checked && (
          <svg
            className="w-2.5 h-2.5 text-cream"
            viewBox="0 0 10 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 4l3 3 5-6" />
          </svg>
        )}
      </span>
      <span className="font-sans text-sm text-charcoal/75 group-hover:text-charcoal transition-colors duration-150 leading-none">
        {label}
      </span>
    </label>
  );
}

/* Circular color swatch */
function ColorSwatch({
  name,
  hex,
  selected,
  onToggle,
}: {
  name: string;
  hex: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={name}
      aria-label={`${selected ? "Remove" : "Add"} ${name} color filter`}
      aria-pressed={selected}
      className={[
        "w-6 h-6 rounded-full shrink-0 transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1",
        selected
          ? "ring-2 ring-gold ring-offset-2 scale-110"
          : "ring-1 ring-charcoal/15 hover:scale-110",
      ].join(" ")}
      style={{ backgroundColor: hex }}
    />
  );
}

/* Dual-thumb price range slider */
function PriceRangeSlider({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const step   = 500;
  const range  = PRICE_MAX - PRICE_MIN;
  const minPct = ((min - PRICE_MIN) / range) * 100;
  const maxPct = ((max - PRICE_MIN) / range) * 100;

  return (
    <div className="space-y-3 pt-1">
      {/* Track container */}
      <div className="relative h-6 flex items-center">
        {/* Track bg */}
        <div className="absolute inset-x-0 h-1.5 bg-charcoal/12 rounded-full pointer-events-none" />
        {/* Gold fill */}
        <div
          className="absolute h-1.5 bg-gold rounded-full pointer-events-none"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={step}
          value={min}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v < max - step) onChange(v, max);
          }}
          aria-label="Minimum price"
          className="price-range-thumb"
        />
        {/* Max thumb */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={step}
          value={max}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v > min + step) onChange(min, v);
          }}
          aria-label="Maximum price"
          className="price-range-thumb"
        />
      </div>
      {/* Labels */}
      <div className="flex justify-between font-sans text-xs text-charcoal/55">
        <span>Rs.&nbsp;{min.toLocaleString()}</span>
        <span>Rs.&nbsp;{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

/* ── FilterPanel main export ─────────────────────────────────── */
export interface FilterPanelProps {
  filters:        FilterState;
  onChangeFilter: (next: FilterState) => void;
}

export default function FilterPanel({
  filters,
  onChangeFilter,
}: FilterPanelProps) {

  /* ── Helpers that compute new state and call onChangeFilter ── */

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  function handleCategory(slug: string) {
    onChangeFilter({ ...filters, categories: toggle(filters.categories, slug) });
  }

  function handlePrice(min: number, max: number) {
    onChangeFilter({ ...filters, priceMin: min, priceMax: max });
  }

  function handleStockType(val: "ready" | "made-to-order") {
    onChangeFilter({ ...filters, stockTypes: toggle(filters.stockTypes, val) });
  }

  function handlePieceCount(val: 2 | 3) {
    onChangeFilter({ ...filters, pieceCounts: toggle(filters.pieceCounts, val) });
  }

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="space-y-0">

      {/* Category — expanded by default */}
      <FilterGroup title="Category" defaultOpen={true}>
        <div className="space-y-0.5">
          {CATEGORIES.map((cat) => (
            <CheckboxItem
              key={cat.slug}
              id={`filter-cat-${cat.slug}`}
              label={cat.label}
              checked={filters.categories.includes(cat.slug)}
              onChange={() => handleCategory(cat.slug)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Price Range — collapsed by default */}
      <FilterGroup title="Price Range" defaultOpen={false}>
        <PriceRangeSlider
          min={filters.priceMin}
          max={filters.priceMax}
          onChange={handlePrice}
        />
      </FilterGroup>

      {/* Availability — collapsed by default */}
      <FilterGroup title="Availability" defaultOpen={false}>
        <div className="space-y-0.5">
          {STOCK_TYPES.map(({ value, label }) => (
            <CheckboxItem
              key={value}
              id={`filter-stock-${value}`}
              label={label}
              checked={filters.stockTypes.includes(value)}
              onChange={() => handleStockType(value)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Suit Type — collapsed by default */}
      <FilterGroup title="Suit Type" defaultOpen={false}>
        <div className="space-y-0.5">
          {PIECE_COUNTS.map(({ value, label }) => (
            <CheckboxItem
              key={value}
              id={`filter-pc-${value}`}
              label={label}
              checked={filters.pieceCounts.includes(value)}
              onChange={() => handlePieceCount(value)}
            />
          ))}
        </div>
      </FilterGroup>

    </div>
  );
}
