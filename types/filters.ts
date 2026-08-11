/* ============================================================
   Filter types — Rahim's Collection Shop

   Shared between FilterPanel.tsx and ShopContent.tsx.
   ============================================================ */

export const PRICE_MIN = 2000;
export const PRICE_MAX = 10000;

export interface FilterState {
  categories:  string[];
  priceMin:    number;
  priceMax:    number;
  stockTypes:  ("ready" | "made-to-order")[];
  pieceCounts: (2 | 3)[];
}

export const DEFAULT_FILTERS: FilterState = {
  categories:  [],
  priceMin:    PRICE_MIN,
  priceMax:    PRICE_MAX,
  stockTypes:  [],
  pieceCounts: [],
};
