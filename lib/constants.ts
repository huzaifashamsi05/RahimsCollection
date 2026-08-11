/* ============================================================
   Shared constants
   ============================================================ */

/**
 * Formats a PKR price integer as a display string.
 * e.g. 6500 → "Rs. 6,500"
 */
export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString("en-IN")}`;
}
