"use client";

/**
 * Butterflies — small GSAP bezier flutter loops. Spec: docs/08 §7.4.
 * Shorter paths than doves; wing-flutter scaleX simulates wingbeat.
 */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useMotion } from "@/components/motion/MotionProvider";
import { tierBudget } from "@/lib/motionAdapter";

gsap.registerPlugin(MotionPathPlugin);

const FLUTTER_PATHS = [
  "M 0,50 C 20,30 40,70 60,40 S 90,20 100,50",
  "M 10,30 C 30,60 50,20 70,50 S 90,70 100,30",
];

export const Butterflies = () => {
  const { tier } = useMotion();
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const butterflies = svg.querySelectorAll<SVGGElement>(".butterfly");

    const ctx = gsap.context(() => {
      butterflies.forEach((el, i) => {
        const path = FLUTTER_PATHS[i % FLUTTER_PATHS.length] ?? FLUTTER_PATHS[0]!;
        gsap.set(el, { x: 0, y: 30 + Math.random() * 30, opacity: 0 });
        gsap.to(el, {
          opacity: 1,
          duration: 0.6,
          delay: 1.25 + i * 0.2,
        });
        gsap.to(el, {
          motionPath: { path, autoRotate: true },
          duration: 6 + Math.random() * 3,
          repeat: -1,
          delay: 1.25 + i * 0.2,
          ease: "sine.inOut",
        });
        // Wing flutter — independent scaleX oscillation
        gsap.to(el, {
          scaleX: -1,
          duration: 0.18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.25 + i * 0.2,
        });
      });
    }, svg);

    return () => ctx.revert();
  }, [tier]);

  if (tierBudget(tier).butterflies === 0) return null;

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {Array.from({ length: tierBudget(tier).butterflies }).map((_, i) => (
        <g key={i} className="butterfly" transform="translate(0,0)">
          <path d="M 0,0 q -4,-3 -6,0 q 2,2 6,1 q 4,1 6,-1 q -2,-3 -6,0 z" fill="#f1c1b1" />
        </g>
      ))}
      {/* Unused — referenced by gsap.querySelectorAll above. */}
      <g style={{ display: "none" }} aria-hidden>
        <g className="butterfly" />
      </g>
    </svg>
  );
};