import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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

import Script from "next/script";

/* ── Site Metadata ────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rahimscollection.vercel.app'),
  title: "Rahim's Collection — Luxury Pakistani Ethnic Wear",
  description:
    "Discover Rahim's Collection — a curated selection of premium raw silk, chiffon, and organza unstitched suits. Experience true luxury.",
  keywords: ["Rahim's Collection", "premium suits", "Pakistani fashion", "raw silk", "chiffon", "luxury ethnic wear"],
  openGraph: {
    title: "Rahim's Collection",
    description: "Curated luxury ethnic wear. Discover our latest collections.",
    url: "https://rahimscollection.com",
    siteName: "Rahim's Collection",
    images: [
      {
        url: "/images/hero/hero-1.jpg", // our newly generated premium image
        width: 1200,
        height: 630,
        alt: "Rahim's Collection - Luxury Fashion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/images/favicon.png', type: 'image/png', sizes: '192x192' }
    ],
    apple: '/images/favicon.png'
  }
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
      <head>
        {/* Google Analytics Placeholder */}
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>

        {/* Facebook Pixel Placeholder */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'XXXXXXXXXXXXXXXX');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
