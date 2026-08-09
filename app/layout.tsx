import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

/* ── Google Fonts ─────────────────────────────────────────── */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

/* ── Site Metadata ────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Rahim's Collection — Curated Elegance",
  description:
    "Discover Rahim's Collection — a curated selection of premium products. Order directly via WhatsApp for a seamless, personal shopping experience.",
  keywords: ["Rahim's Collection", "premium", "WhatsApp order", "curated"],
};

/* ── Root Layout ──────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
