"use client";

/**
 * Welcome — opening greeting + Surat Yasin Ayat 36 (docs/10 §4).
 * Per-line stagger reveal; accent (doves+bunga) breathing.
 * Asymmetric floral framing (docs/01 §4): TL + BR.
 */

import Image from "next/image";
import { copy } from "@/lib/copy";
import Reveal from "@/components/primitives/Reveal";
import Stagger from "@/components/primitives/Stagger";
import Breathing from "@/components/primitives/Breathing";
import FloralCorner from "@/components/primitives/FloralCorner";

export default function Welcome() {
  return (
    <section
      id="welcome"
      className="section cv-auto"
      aria-label="Sambutan dan ayat"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <FloralCorner side="tl" size={160} seed="welcome" />
      <FloralCorner side="br" size={160} seed="welcome" />

      <div
        className="container-narrow"
        style={{ textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <Reveal>
          <Breathing seed="welcome-accent" as="div">
            <Image
              src="/assets/illustrations/welcome-accent.png"
              alt="Burung merpati dan bunga sebagai aksen sambutan"
              width={220}
              height={323}
              loading="lazy"
              style={{ width: "min(100%, 220px)", height: "auto", margin: "0 auto" }}
            />
          </Breathing>
        </Reveal>

        <Reveal as="h2" className="t-h1" seed="welcome-greeting">
          <span
            style={{
              fontFamily: "var(--font-serif), serif",
              fontStyle: "italic",
              color: "var(--ink)",
              marginTop: 24,
              display: "block",
            }}
          >
            {copy.welcome.greeting}
          </span>
        </Reveal>

        <Stagger
          as="div"
          gap={0.12}
          seed="welcome-body"
          className="t-body"
        >
          {copy.welcome.body.map((line, i) => (
            <p
              key={i}
              style={{
                color: "var(--ink-soft)",
                margin: "12px 0",
                lineHeight: 1.7,
              }}
            >
              {line}
            </p>
          ))}
        </Stagger>

        <Reveal as="div" seed="welcome-quran" className="t-body">
          <blockquote
            style={{
              margin: "32px 0 0",
              padding: "20px 16px",
              borderLeft: "2px solid var(--sage)",
              borderRadius: 4,
              background: "color-mix(in srgb, var(--cream) 70%, transparent)",
              color: "var(--ink)",
              fontStyle: "italic",
              textAlign: "left",
            }}
          >
            <p style={{ margin: 0, lineHeight: 1.7 }}>{copy.welcome.quran.text}</p>
            <footer
              style={{
                marginTop: 12,
                fontStyle: "normal",
                fontFamily: "var(--font-serif), serif",
                color: "var(--ink-soft)",
                fontSize: "0.9rem",
                letterSpacing: "0.04em",
              }}
            >
              {copy.welcome.quran.cite}
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
