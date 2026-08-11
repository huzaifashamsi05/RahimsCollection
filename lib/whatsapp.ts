/**
 * Central utility for generating WhatsApp URLs.
 * Reads the base number from NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local
 */

export function getWhatsAppLink(message: string): string {
  // Use a fallback in case the env var isn't loaded on the client or during build
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923212702083";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
