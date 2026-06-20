"use client";

/**
 * Butterflies — wing-flutter idle + bezier drift near the florals.
 * Tier-aware. docs/09 §3, docs/12.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ease } from "@/lib/motionTokens";
import { useMotion } from "@/components/motion/MotionContext";
import { mulberry32 } from "@/lib/seed";

const PATHS = [
  "M 10 80 C 30 60, 50 90, 70 70 S 90 60, 90 50",
  "M 80 80 C 60 60, 40 90, 30 70 S 10 50, 10 30",
];

export default function Butterflies() {
  const { tier } = useMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (tier === "REDUCED" || tier === "LOW") return;
    const container = containerRef.current;
    if (!container) return;

    const rng = mulberry32(91011);
    tweensRef.current.forEach((t) => t.kill());
    tweensRef.current = [];

    const els = Array.from(container.querySelectorAll<HTMLElement>("[data-bf]"));

    els.forEach((el, i) => {
      const durLoop = 6 + rng() * 4;
      el.style.willChange = "transform";
      const tween = gsap.to(el, {
        duration: durLoop,
        ease: ease.float,
        motionPath: {
          path: PATHS[i % PATHS.length],
          align: container,
          alignOrigin: [0.5, 0.5],
        },
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.4 + rng(),
        delay: i * 0.6,
      });
      tweensRef.current.push(tween);
    });

    // Wing flutter on each — quick scaleX oscillate.
    const flutters: gsap.core.Tween[] = els.map((el) =>
      gsap.to(el, {
        scaleX: 0.82,
        duration: 0.18,
        ease: ease.soft,
        yoyo: true,
        repeat: -1,
        transformOrigin: "50% 50%",
      }),
    );
    tweensRef.current.push(...flutters);

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

    return () => {
      st.kill();
      tweensRef.current.forEach((t) => t.kill());
      tweensRef.current = [];
      els.forEach((el) => (el.style.willChange = ""));
    };
  }, [tier]);

  if (tier === "REDUCED" || tier === "LOW") return null;

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
      {Array.from({ length: tier === "HIGH" ? 3 : 2 }).map((_, i) => (
        <div
          key={i}
          data-bf
          style={{
            position: "absolute",
            width: 36,
            height: 36,
            top: 0,
            left: 0,
          }}
        >
          <Image
            src="/assets/cutout/accent-butterflies.png"
            alt=""
            width={72}
            height={72}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      ))}
    </div>
  );
}