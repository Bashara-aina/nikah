"use client";

/**
 * Doves — GSAP MotionPath bezier loops through the Hero. Spec: docs/09 §3
 * + docs/08 §7.4. Each dove follows a different bezier with randomized
 * duration per pass.
 */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useMotion } from "@/components/motion/MotionProvider";
import { tierBudget } from "@/lib/motionAdapter";

gsap.registerPlugin(MotionPathPlugin);

const DOVE_PATHS = [
  "M 0,40 C 20,10 60,60 100,30",
  "M 0,20 C 30,60 70,5 100,50",
  "M 0,60 C 25,20 75,80 100,15",
];

export const Doves = () => {
  const { tier } = useMotion();
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const doves = svg.querySelectorAll<SVGGElement>(".dove");
    const ctx = gsap.context(() => {
      doves.forEach((el, i) => {
        const path = DOVE_PATHS[i % DOVE_PATHS.length] ?? DOVE_PATHS[0]!;
        const duration = 12 + Math.random() * 4;
        gsap.set(el, { x: -50, y: 30 + Math.random() * 40, opacity: 0 });
        gsap.to(el, {
          opacity: 0.85,
          duration: 1,
          delay: 1.2,
        });
        gsap.to(el, {
          motionPath: { path, autoRotate: false },
          duration,
          repeat: -1,
          delay: 1.2,
          ease: "sine.inOut",
          yoyo: false,
        });
      });
    }, svg);

    return () => ctx.revert();
  }, [tier]);

  if (tierBudget(tier).doves === 0) return null;

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {Array.from({ length: tierBudget(tier).doves }).map((_, i) => (
        <g key={i} className="dove" transform="translate(0,0)">
          <path
            d="M 0,0 q 3,-3 6,0 q -3,1 -6,0 z"
            fill="white"
            opacity="0.85"
          />
        </g>
      ))}
    </svg>
  );
};