import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { TopBanner } from "@/components/layout/TopBanner";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CapacitorInit } from "@/components/layout/CapacitorInit";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartProvider } from "@/lib/cart";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { organizationJsonLd, websiteJsonLd, SITE_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";
import { SpeedInsights } from "@vercel/speed-insights/next";

const outfit = Outfit({ subsets: ["latin"] });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',          // expands into notch/Dynamic Island
  themeColor: '#060d0a',
  interactiveWidget: 'resizes-content', // prevents layout jump when keyboard opens
}


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Nepal's most trusted marketplace for verified used iPhones, MacBooks, AirPods & gadgets. IMEI checked, graded A/B/C, 6-month warranty. Cash on delivery in Kathmandu & Pokhara.",
  keywords: [
    "buy iPhone Nepal",
    "used iPhone Nepal",
    "second hand iPhone Nepal",
    "iPhone price Nepal",
    "buy MacBook Nepal",
    "used gadgets Nepal",
    "verified second hand phone Nepal",
    "IMEI checked phone Nepal",
    "Inexa Nepal",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Nepal's most trusted marketplace for verified used iPhones, MacBooks, AirPods & gadgets. IMEI checked, graded A/B/C, 6-month warranty.",
    images: [
      {
        url: `${SITE_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Inexa Nepal — Verified Used iPhones & Gadgets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@inexanepal",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Nepal's most trusted marketplace for verified used iPhones, MacBooks, AirPods & gadgets.",
    images: [`${SITE_URL}/og-default.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* iOS PWA — full screen, no Safari chrome */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Inexa Nepal" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`min-h-full antialiased ${outfit.className}`}
        style={{ background: "#ffffff", color: "#060d0a" }}
      >
        <CartProvider>
          <AuthProvider>
            <CapacitorInit />
            <ServiceWorkerRegister />
            <TopBanner />
            <Nav />
            {children}
            <Footer />
            <MobileBottomNav />
            <CookieConsent />
            {/* Space for MobileBottomNav (62px) + safe area bottom */}
            <div className="md:hidden" style={{ height: 'calc(62px + env(safe-area-inset-bottom, 0px))' }} />
          </AuthProvider>
        </CartProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
