"use client";

/** Stagger — staggered reveal on viewport entry. */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dur, ease, move } from "@/lib/motionTokens";
import { useMotion } from "@/components/motion/MotionContext";
import { pickRange } from "@/lib/seed";
import { useOrganicRng, type PrimitiveBaseProps } from "./_internal";

export interface StaggerProps extends PrimitiveBaseProps {
  childSelector?: string;
  gap?: number;
}

export default function Stagger({
  as: As = "div",
  className,
  children,
  childSelector = ":scope > *",
  gap = 0.08,
  seed = "stagger",
}: StaggerProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { reduced } = useMotion();
  const rng = useOrganicRng(seed);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const kids = Array.from(el.querySelectorAll<HTMLElement>(childSelector));
    if (kids.length === 0) return;

    const y = reduced ? 0 : move.reveal;
    const stagger = pickRange(rng, gap, gap * 1.6);

    gsap.set(kids, { opacity: 0, y, willChange: "transform, opacity" });

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(kids, {
          opacity: 1,
          y: 0,
          duration: reduced ? dur.base : dur.enter,
          ease: reduced ? ease.soft : ease.enter,
          stagger,
          onComplete: () => {
            if (!reduced) gsap.set(kids, { clearProps: "willChange" });
          },
        });
      },
    });

    return () => {
      st.kill();
      gsap.killTweensOf(kids);
    };
  }, [reduced, childSelector, gap, rng]);

  // @ts-expect-error -- dynamic ref typing
  return <As ref={ref} className={className}>{children}</As>;
}