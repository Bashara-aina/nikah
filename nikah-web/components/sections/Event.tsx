"use client";

/**
 * Event — date, time, venue, etiquette, livestream (docs/10 §8).
 * Map link + Save to Calendar (.ics). dress code pastel. Lazy iframe embed.
 * Asymmetric floral framing (docs/01 §4): TR + BL (mirror of welcome so
 * the rhythm down the page is not symmetric).
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copy } from "@/lib/copy";
import { config } from "@/lib/config";
import { downloadWeddingIcs } from "@/lib/ics";
import { dur, ease, move, stagger as staggerToken } from "@/lib/motionTokens";
import { useMotion } from "@/components/motion/MotionContext";
import { useToast } from "@/lib/toastStore";
import Reveal from "@/components/primitives/Reveal";
import Stagger from "@/components/primitives/Stagger";
import Breathing from "@/components/primitives/Breathing";
import FloralCorner from "@/components/primitives/FloralCorner";

function livestreamLinks(): Array<{ label: string; href: string; key: string }> {
  const items: Array<{ label: string; href: string; key: string }> = [];
  if (config.livestream.youtube) {
    items.push({
      label: copy.event.livestreamLabels.youtube,
      href: config.livestream.youtube,
      key: "yt",
    });
  }
  if (config.livestream.zoom) {
    items.push({
      label: copy.event.livestreamLabels.zoom,
      href: config.livestream.zoom,
      key: "zoom",
    });
  }
  config.livestream.instagram
    .filter((s) => s.length > 0)
    .forEach((s, i) => {
      items.push({
        label: `${copy.event.livestreamLabels.instagram} ${i + 1}`,
        href: s,
        key: `ig-${i}`,
      });
    });
  config.livestream.facebook
    .filter((s) => s.length > 0)
    .forEach((s, i) => {
      items.push({
        label: `${copy.event.livestreamLabels.facebook} ${i + 1}`,
        href: s,
        key: `fb-${i}`,
      });
    });
  return items;
}

function buildMapsEmbedUrl(): string | null {
  // maps.app.goo.gl is a redirect; for embed we use search-based fallback.
  // Encode the venue name+address as a maps search embed.
  const q = encodeURIComponent(
    `${config.venue.name}, ${config.venue.address}`,
  );
  return `https://www.google.com/maps?q=${q}&output=embed`;
}

export default function Event() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [mapVisible, setMapVisible] = useState<boolean>(false);
  const liveItems = livestreamLinks();
  const { reduced } = useMotion();
  const { push } = useToast();

  // Lazy-mount iframe only when section nears the viewport.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const section = sectionRef.current;
    if (!section) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setMapVisible(true);
            io.disconnect();
            return;
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Initial reveal stagger for the date/venue cards.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = sectionRef.current;
    if (!root) return;
    const kids = root.querySelectorAll<HTMLElement>("[data-event-line]");
    if (kids.length === 0) return;
    const tween = gsap.from(kids, {
      autoAlpha: 0,
      y: move.reveal,
      duration: dur.enter,
      ease: ease.enter,
      stagger: staggerToken.base,
    });
    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((s) => s.trigger === root)
        .forEach((s) => s.kill());
    };
  }, [reduced]);

  const onSave = (): void => {
    try {
      downloadWeddingIcs();
      push("success", "Tersimpan ke kalender ✓");
    } catch {
      push("error", "Gagal membuat file kalender");
    }
  };

  return (
    <section
      id="event"
      ref={sectionRef}
      className="section cv-auto"
      aria-label="Detail acara"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <FloralCorner side="tr" size={150} seed="event" />
      <FloralCorner side="bl" size={150} seed="event" />

      <div
        className="container-narrow"
        style={{ textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <Reveal>
          <Breathing seed="event-accent" as="div">
            <Image
              src="/assets/scene/event-accent.png"
              alt="Bingkai lengkung dengan bunga sebagai aksen detail acara"
              width={280}
              height={140}
              loading="lazy"
              style={{ width: "min(100%, 280px)", height: "auto", margin: "0 auto" }}
            />
          </Breathing>
        </Reveal>

        <Reveal
          as="h2"
          className="t-h1"
          seed="event-title"
          style={{ color: "var(--ink)", marginTop: 16 }}
        >
          {copy.event.title}
        </Reveal>

        <div
          data-event-line
          style={{ marginTop: 16, color: "var(--ink-soft)", lineHeight: 1.6 }}
        >
          <p style={{ margin: "4px 0", fontWeight: 500, color: "var(--ink)" }}>
            {copy.event.date}
          </p>
          <p style={{ margin: "4px 0" }}>{copy.event.akadStart}</p>
          <p style={{ margin: "4px 0" }}>{copy.event.duration}</p>
        </div>

        <div
          data-event-line
          style={{ marginTop: 12, color: "var(--ink-soft)", lineHeight: 1.6 }}
        >
          <p
            style={{
              margin: "4px 0",
              fontFamily: "var(--font-serif), serif",
              color: "var(--ink)",
              fontSize: "1.1rem",
            }}
          >
            {copy.event.venueLabel} — {copy.event.venueFloor}
          </p>
          <p style={{ margin: "4px 0" }}>{copy.event.address}</p>
          <p style={{ margin: "4px 0", fontStyle: "italic" }}>
            {copy.event.landmark}
          </p>
        </div>

        <div
          data-event-line
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 20,
          }}
        >
          <a
            href={config.venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            aria-label="Buka lokasi di Google Maps (tab baru)"
          >
            <Image
              src="/assets/scene/map-pin.png"
              alt=""
              width={20}
              height={20}
              style={{ width: 20, height: 20, objectFit: "contain" }}
            />
            {copy.event.ctaMap}
          </a>
          <button
            type="button"
            onClick={onSave}
            className="btn-ghost"
            aria-label="Unduh file kalender"
          >
            {copy.event.ctaCalendar}
          </button>
        </div>

        {mapVisible ? (
          <div
            data-event-line
            style={{
              marginTop: 20,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
              aspectRatio: "16 / 10",
              background: "var(--cream)",
            }}
          >
            <iframe
              title="Peta lokasi acara"
              src={buildMapsEmbedUrl() ?? undefined}
              style={{ border: 0, width: "100%", height: "100%" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        ) : null}

        <div
          data-event-line
          style={{
            marginTop: 32,
            padding: "20px 18px",
            background: "var(--cream)",
            borderRadius: 18,
            boxShadow: "var(--shadow-sm)",
            textAlign: "left",
          }}
        >
          <h3
            className="t-h2"
            style={{ margin: "0 0 8px", color: "var(--ink)" }}
          >
            {copy.event.dressCodeTitle}
          </h3>
          <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.6 }}>
            {copy.event.dressCodeBody}
          </p>
        </div>

        <div data-event-line style={{ marginTop: 24, textAlign: "left" }}>
          <h3
            className="t-h2"
            style={{ margin: "0 0 12px", color: "var(--ink)" }}
          >
            {copy.event.etiquetteTitle}
          </h3>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              color: "var(--ink-soft)",
              lineHeight: 1.7,
            }}
          >
            {config.etiquette.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        {liveItems.length > 0 ? (
          <div data-event-line style={{ marginTop: 32, textAlign: "left" }}>
            <h3
              className="t-h2"
              style={{ margin: "0 0 4px", color: "var(--ink)" }}
            >
              {copy.event.livestreamTitle}
            </h3>
            <p
              style={{
                margin: "0 0 12px",
                color: "var(--ink-soft)",
                lineHeight: 1.6,
              }}
            >
              {copy.event.livestreamIntro}
            </p>
            <Stagger
              as="div"
              gap={0.06}
              seed="event-live"
              className="t-body"
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {liveItems.map((it) => (
                  <a
                    key={it.key}
                    href={it.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                  >
                    {it.label}
                  </a>
                ))}
              </div>
            </Stagger>
          </div>
        ) : null}
      </div>
    </section>
  );
}
