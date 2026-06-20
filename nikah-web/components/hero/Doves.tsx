"use client";

/**
 * Doves — MotionPath flights across the hero sky. docs/09 §3, docs/12.
 * Pauses when off-screen. REDUCED: 1 static dove. No-op at LOW.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dur, ease } from "@/lib/motionTokens";
import { useMotion } from "@/components/motion/MotionContext";
import { mulberry32 } from "@/lib/seed";

const PATHS = [
  "M -10 12 Q 30 4, 60 12 T 110 10",
  "M -10 18 Q 30 24, 60 18 T 110 14",
];

export default function Doves() {
  const { tier } = useMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (tier === "REDUCED" || tier === "LOW") return;
    const container = containerRef.current;
    if (!container) return;

    const rng = mulberry32(31337);
    tweensRef.current.forEach((t) => t.kill());
    tweensRef.current = [];

    const els = Array.from(container.querySelectorAll<HTMLElement>("[data-dove]"));

    els.forEach((el, i) => {
      const durLoop = 12 + rng() * 4;
      el.style.willChange = "transform";
      el.style.opacity = "0";
      const startDelay = i * 1.2 + rng();
      const tween = gsap.to(el, {
        duration: durLoop,
        ease: ease.float,
        motionPath: {
          path: PATHS[i % PATHS.length],
          align: container,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        repeat: -1,
        repeatDelay: 0.5 + rng(),
        delay: startDelay,
        onStart: () => {
          gsap.to(el, { opacity: 1, duration: 0.6 });
        },
        onRepeat: () => {
          // Hide near right edge so it appears to leave frame
          gsap.to(el, { opacity: 0, duration: 0.4, delay: durLoop - 0.5 });
        },
      });
      tweensRef.current.push(tween);
    });

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        tweensRef.current.forEach((t) =>
          self.isActive ? t.resume() : t.pause(),
        );
      },
    });

    void dur;
    return () => {
      st.kill();
      tweensRef.current.forEach((t) => t.kill());
      tweensRef.current = [];
      els.forEach((el) => {
        el.style.willChange = "";
        el.style.opacity = "";
      });
    };
  }, [tier]);

  if (tier === "REDUCED" || tier === "LOW") {
    // show one static dove
    return (
      <div
        ref={containerRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "60%",
            width: 60,
            height: 40,
            opacity: 0.85,
          }}
        >
          <Image
            src="/assets/cutout/accent-doves.png"
            alt=""
            width={120}
            height={80}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: tier === "HIGH" ? 2 : 1 }).map((_, i) => (
        <div
          key={i}
          data-dove
          style={{
            position: "absolute",
            width: 60,
            height: 40,
            top: 0,
            left: 0,
          }}
        >
          <Image
            src="/assets/cutout/accent-doves.png"
            alt=""
            width={120}
            height={80}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      ))}
    </div>
  );
}