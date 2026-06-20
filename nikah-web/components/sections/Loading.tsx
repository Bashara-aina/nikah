"use client";

/**
 * Loading — 1–2s pre-gate screen.
 * Wreath rotate + motif breathing. Cross-fades to Gate when ready.
 * Preloads hero layers (hero-bg, couple-cutout, all cat-*) + audio metadata.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ease } from "@/lib/motionTokens";
import { copy } from "@/lib/copy";
import { useMotion } from "@/components/motion/MotionContext";
import { config } from "@/lib/config";

const PRELOAD_SRCS = [
  "/assets/scene/hero-bg.webp",
  "/assets/scene/hero-main.webp",
  "/assets/couple/couple-cutout.png",
  ...config.cats.map((c) => `/assets/cats/${c}.png`),
];

function preload(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

const MIN_VISIBLE_MS = 900;
const MAX_VISIBLE_MS = 2000;

export default function Loading() {
  const { tier } = useMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wreathRef = useRef<HTMLDivElement | null>(null);
  const motifRef = useRef<HTMLDivElement | null>(null);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const startedAt = performance.now();
    let cancelled = false;

    // Preload all hero layers in parallel.
    void Promise.all(PRELOAD_SRCS.map(preload)).then(() => {
      if (cancelled) return;
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => setExiting(true), remaining);
    });

    // Safety timeout to never block more than MAX_VISIBLE_MS.
    const force = window.setTimeout(() => setExiting(true), MAX_VISIBLE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(force);
    };
  }, []);

  // Idle wobble + breathing
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (tier === "REDUCED") return;
    const wreath = wreathRef.current;
    const motif = motifRef.current;
    const tweens: gsap.core.Tween[] = [];
    if (wreath) {
      tweens.push(
        gsap.to(wreath, {
          rotation: 6,
          duration: 3,
          ease: ease.float,
          yoyo: true,
          repeat: -1,
          transformOrigin: "50% 50%",
        }),
      );
    }
    if (motif) {
      tweens.push(
        gsap.to(motif, {
          scale: 1.04,
          duration: 2.4,
          ease: ease.float,
          yoyo: true,
          repeat: -1,
        }),
      );
    }
    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [tier]);

  // Cross-fade out + remove from DOM
  useEffect(() => {
    if (!exiting) return;
    if (typeof window === "undefined") return;
    const el = containerRef.current;
    if (!el) return;
    gsap.to(el, {
      opacity: 0,
      duration: 0.4,
      ease: ease.soft,
      onComplete: () => setDone(true),
    });
  }, [exiting]);

  if (done) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Memuat undangan"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "var(--ivory)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 1,
        transition: "opacity 200ms",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          ref={wreathRef}
          style={{
            position: "relative",
            width: 200,
            height: 200,
            margin: "0 auto 24px",
          }}
        >
          <div ref={motifRef} style={{ width: 200, height: 200 }}>
            <Image
              src="/assets/scene/loading-motif.png"
              alt=""
              width={200}
              height={200}
              priority
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>
        <div
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "1rem",
            letterSpacing: "0.04em",
            color: "var(--ink-soft)",
          }}
        >
          {copy.loading.hashtag}
        </div>
      </div>
    </div>
  );
}