"use client";

/**
 * Japan — mimpi studi (docs/10 §7).
 * Keio Hiyoshi & SIT Tokyo + sakura petals (variant=sakura) active only here.
 * Reveal + idle breathing.
 */

import Image from "next/image";
import { copy } from "@/lib/copy";
import Reveal from "@/components/primitives/Reveal";
import Stagger from "@/components/primitives/Stagger";
import Breathing from "@/components/primitives/Breathing";
import Particles from "@/components/motion/Particles";

export default function Japan() {
  return (
    <section
      id="japan"
      className="section cv-auto"
      aria-label="Mimpi kami: studi di Jepang"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <Particles variant="sakura" />

      <div className="container-narrow" style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        <Reveal>
          <Breathing seed="japan-motif" as="div">
            <Image
              src="/assets/scene/japan-motif.png"
              alt="Motif sakura, kampus Keio, dan SIT Tokyo sebagai latar mimpi kami"
              width={320}
              height={200}
              loading="lazy"
              style={{ width: "min(100%, 320px)", height: "auto", margin: "0 auto" }}
            />
          </Breathing>
        </Reveal>

        <Reveal
          as="h2"
          className="t-h1"
          seed="japan-title"
          style={{
            color: "var(--ink)",
            margin: "24px 0 8px",
          }}
        >
          {copy.japan.title}
        </Reveal>

        <Stagger as="div" gap={0.1} seed="japan-body" className="t-body">
          {copy.japan.body.map((line, i) => (
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
      </div>
    </section>
  );
}
