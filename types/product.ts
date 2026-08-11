/* ============================================================
   Product — Shared TypeScript types
   ============================================================ */

export interface ProductColor {
  name: string;
  hex: string;
  isDefault: boolean; // exactly one color per product should be true
  images: string[];   // 1 or more image URLs
}

export type StockType = "ready" | "made-to-order";
export type PieceCount = 2 | 3;

export interface Product {
  /** Unique identifier */
  id: string;
  /** URL slug for the product detail page  e.g. "raw-silk-zari-cream" */
  slug: string;
  /** Display name shown on card and detail page */
  name: string;
  /** Price in PKR (integer, e.g. 6500 → displayed as "Rs. 6,500") */
  price: number;
  /** Optional sale price in PKR. If set, product is on sale */
  salePrice?: number;
  /** Available colour options, rendered as circular swatches. Includes images per color. */
  colors: ProductColor[];
  /** "ready" = Ready to Ship | "made-to-order" = 15-day lead time */
  stockType: StockType;
  /** Shows "New Arrival" gold pill badge */
  isNewArrival: boolean;
  /** Overrides stock badge; dims image; disables WhatsApp CTA */
  isSoldOut: boolean;
  /** Category slug e.g. "raw-silk" | "chiffon" | "organza" */
  category: string;
  /** Number of pieces in the unstitched suit set */
  pieceCount: PieceCount;
  /** 2-3 sentence product description shown on detail page */
  description: string;
  /**
   * Stitching sizes available. Shown as selectable buttons on detail page.
   * e.g. ["XS","S","M","L","XL","XXL"] — empty array = free size / unstitched
   */
  sizes: string[];
  /**
   * Marks this product as part of the curated homepage New Arrivals
   * scrollytelling showcase (separate from the general isNewArrival flag).
   * Editable later via Admin — not auto-derived from isNewArrival.
   */
  isFeaturedNewArrival?: boolean;
  /** Optional scarcity label e.g., "Only 2 Left" */
  scarcityLabel?: string;
  /** Whether a sold-out item might be restocked. Defaults to false if omitted. */
  restockable?: boolean;
}
