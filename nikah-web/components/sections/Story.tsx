"use client";

/**
 * Story — narasi kronologis per chapter (docs/03 §5).
 * Tiap chapter: judul, body 1–3 baris, ilustrasi di sisi kiri/kanan (bergantian).
 * Animasi: slide-from-side + settle (ilustrasi), fade-up (judul & body), idle breathing.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copy } from "@/lib/copy";
import { dur, ease, move, stagger as staggerToken } from "@/lib/motionTokens";
import { useMotion } from "@/components/motion/MotionContext";
import Breathing from "@/components/primitives/Breathing";

interface ChapterProps {
  chapterTitle: string;
  lines: readonly string[];
  side: "left" | "right";
  illustrationSrc: string;
  illustrationAlt: string;
  seed: string;
  illustrationSeed: string;
}

function Chapter({
  chapterTitle,
  lines,
  side,
  illustrationSrc,
  illustrationAlt,
  seed,
  illustrationSeed,
}: ChapterProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { reduced } = useMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = ref.current;
    if (!root) return;
    const illus = root.querySelector<HTMLElement>("[data-illus]");
    const titleEl = root.querySelector<HTMLElement>("[data-chapter-title]");
    const bodyEls = root.querySelectorAll<HTMLElement>("[data-line]");
    if (!illus || !titleEl || bodyEls.length === 0) return;

    const dx = side === "left" ? -move.reveal * 1.2 : move.reveal * 1.2;
    if (reduced) {
      gsap.set([illus, titleEl, ...bodyEls], { autoAlpha: 0 });
    } else {
      gsap.set(illus, { x: dx, autoAlpha: 0 });
      gsap.set(titleEl, { y: move.reveal * 0.6, autoAlpha: 0 });
      gsap.set(bodyEls, { y: move.reveal, autoAlpha: 0 });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 80%",
        once: true,
      },
    });
    if (reduced) {
      tl.to([illus, titleEl, ...bodyEls], {
        autoAlpha: 1,
        duration: dur.base,
        ease: ease.soft,
      });
    } else {
      tl.to(illus, { x: 0, autoAlpha: 1, duration: dur.enter, ease: ease.enter })
        .to(
          titleEl,
          { y: 0, autoAlpha: 1, duration: dur.base, ease: ease.enter },
          `-=${dur.base * 0.5}`,
        )
        .to(
          bodyEls,
          {
            y: 0,
            autoAlpha: 1,
            duration: dur.base,
            ease: ease.enter,
            stagger: staggerToken.tight,
          },
          `-=${dur.base * 0.4}`,
        );
    }
    return () => {
      tl.kill();
    };
  }, [side, reduced]);

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 16,
        marginBlock: 36,
        alignItems: "center",
      }}
      data-seed={seed}
    >
      <Breathing seed={illustrationSeed} as="div">
        <div
          data-illus
          style={{
            order: side === "left" ? 0 : 1,
            width: "min(80%, 280px)",
            margin: "0 auto",
          }}
        >
          <Image
            src={illustrationSrc}
            alt={illustrationAlt}
            width={320}
            height={200}
            loading="lazy"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </Breathing>
      <div style={{ order: side === "left" ? 1 : 0 }}>
        <h3
          data-chapter-title
          className="t-h3"
          style={{
            color: "var(--ink)",
            textAlign: "center",
            marginBottom: 8,
            fontStyle: "italic",
          }}
        >
          {chapterTitle}
        </h3>
        {lines.map((line, idx) => (
          <p
            key={idx}
            data-line
            className="t-body"
            style={{
              color: "var(--ink-soft)",
              lineHeight: 1.7,
              margin: 0,
              textAlign: "center",
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function Story() {
  const titleRef = useRef<HTMLDivElement | null>(null);
  const { reduced } = useMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = titleRef.current;
    if (!root) return;
    const children = root.querySelectorAll<HTMLElement>("[data-story-title]");
    if (children.length === 0) return;
    const tl = gsap.from(children, {
      autoAlpha: 0,
      y: move.reveal,
      duration: dur.enter,
      ease: ease.enter,
      stagger: staggerToken.base,
    });
    return () => {
      tl.kill();
      ScrollTrigger.getAll()
        .filter((s) => s.trigger === root)
        .forEach((s) => s.kill());
    };
  }, [reduced]);

  return (
    <section
      id="story"
      className="section cv-auto"
      aria-label="Kisah kami"
    >
      <div className="container-narrow">
        <div ref={titleRef} style={{ textAlign: "center" }}>
          <h2
            data-story-title
            className="t-h1"
            style={{ color: "var(--ink)" }}
          >
            {copy.story.title}
          </h2>
        </div>

        {copy.story.chapters.map((chapter, i) => {
          const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
          return (
            <Chapter
              key={chapter.key}
              chapterTitle={chapter.title}
              lines={chapter.body}
              side={side}
              illustrationSrc={chapter.illustration}
              illustrationAlt={chapter.illustrationAlt}
              seed={`story-${chapter.key}`}
              illustrationSeed={`story-illus-${chapter.key}`}
            />
          );
        })}
      </div>
    </section>
  );
}
