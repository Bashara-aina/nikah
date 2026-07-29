import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { LenisProvider } from "@/components/motion/Lenis";
import { AudioProvider } from "@/components/AudioProvider";
import { siteConfig } from "@/lib/config";
import "./globals.css";

/* Weight 600 dropped from both families — no `.type-*` role or component used
 * it, and this is a mobile-first invite on Indonesian 3G/4G. 9 font files → 6.
 * Explicit fallbacks are metric-adjacent so the swap doesn't reflow the page. */
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
  fallback: ["Iowan Old Style", "Palatino", "Georgia", "serif"],
  variable: "--font-serif-stack",
});

/* Humanist sans per design law (§4 brand voice — no Inter/Roboto/Arial). */
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: true,
  fallback: ["Avenir Next", "Segoe UI", "system-ui", "sans-serif"],
  variable: "--font-sans-stack",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.couple.short} — ${siteConfig.event.dateLabel}`,
    template: `%s — ${siteConfig.couple.short}`,
  },
  description: `Undangan pernikahan ${siteConfig.couple.bride} & ${siteConfig.couple.groom}, ${siteConfig.event.dateLabel}.`,
  openGraph: {
    type: "website",
    url: siteConfig.siteUrl,
    title: `${siteConfig.couple.short} — ${siteConfig.event.dateLabel}`,
    description: `Undangan pernikahan ${siteConfig.couple.bride} & ${siteConfig.couple.groom}.`,
    locale: "id_ID",
    images: [{ url: "/assets/scenes/hero-main.webp", width: 1080, height: 1350 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.couple.short} — ${siteConfig.event.dateLabel}`,
    description: `Undangan pernikahan ${siteConfig.couple.bride} & ${siteConfig.couple.groom}.`,
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FBF7F0",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-paper text-ink antialiased">
        <MotionProvider>
          <AudioProvider>
            <LenisProvider>{children}</LenisProvider>
          </AudioProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
