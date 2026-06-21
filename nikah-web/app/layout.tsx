import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { LenisProvider } from "@/components/motion/Lenis";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif-stack",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans-stack",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.couple.short} — ${siteConfig.event.dateLabel}`,
    template: `%s — ${siteConfig.couple.short}`,
  },
  description: `Undangan pernikahan ${siteConfig.couple.groom} & ${siteConfig.couple.bride}, ${siteConfig.event.dateLabel}.`,
  openGraph: {
    type: "website",
    url: siteConfig.siteUrl,
    title: `${siteConfig.couple.short} — ${siteConfig.event.dateLabel}`,
    description: `Undangan pernikahan ${siteConfig.couple.groom} & ${siteConfig.couple.bride}.`,
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.couple.short} — ${siteConfig.event.dateLabel}`,
    description: `Undangan pernikahan ${siteConfig.couple.groom} & ${siteConfig.couple.bride}.`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f1e9",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-paper text-ink antialiased">
        <MotionProvider>
          <LenisProvider>{children}</LenisProvider>
        </MotionProvider>
      </body>
    </html>
  );
}