import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import MotionProvider from "@/components/motion/MotionProvider";
import LenisProvider from "@/components/motion/Lenis";
import MotionDebug from "@/components/motion/debug";
import AudioProvider from "@/components/audio/AudioProvider";
import { ToastProvider } from "@/lib/toastStore";
import { config } from "@/lib/config";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(config.site.url),
  title: config.site.title,
  description: config.site.description,
  openGraph: {
    title: config.couple.groom + " & " + config.couple.bride,
    description: "22 Agustus 2026 · Bandung",
    type: "website",
    locale: "id_ID",
    images: [{ url: config.site.ogImage, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: config.site.url },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FBF7F0",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${config.couple.groom} & ${config.couple.bride} — Wedding`,
    startDate: config.date.countdownTargetIso,
    endDate: "2026-08-22T13:00:00+07:00",
    eventAttendanceMode:
      "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: `${config.venue.name} ${config.venue.floor}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: config.venue.address,
        addressLocality: "Bandung",
        addressRegion: "Jawa Barat",
        addressCountry: "ID",
      },
    },
    description: config.site.description,
    image: `${config.site.url}${config.site.ogImage}`,
  };

  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${jakarta.variable} antialiased`}
    >
      <body>
        <a href="#top" className="skip-link">
          Lewati ke konten
        </a>
        <Script
          id="jsonld-event"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(jsonLd)}
        </Script>
        <MotionProvider>
          <LenisProvider>
            <AudioProvider>
              <ToastProvider>{children}</ToastProvider>
            </AudioProvider>
          </LenisProvider>
          <MotionDebug />
        </MotionProvider>
        <Script id="js-anim-flag" strategy="afterInteractive">
          {`document.documentElement.classList.add('js-anim');`}
        </Script>
      </body>
    </html>
  );
}