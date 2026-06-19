"use client";

/** Reveal — basic fade-up entrance for one element. */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dur, ease, move } from "@/lib/motionTokens";
import { useMotion } from "@/components/motion/MotionContext";
import { useOrganicRng, type PrimitiveBaseProps } from "./_internal";

export default function Reveal({
  as: As = "div",
  className,
  children,
  seed = "reveal",
  style,
}: PrimitiveBaseProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { reduced } = useMotion();
  const rng = useOrganicRng(seed);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const y = reduced ? 0 : move.reveal;
    const delay = rng() * 0.1;
    gsap.set(el, { opacity: 0, y, willChange: "transform, opacity" });
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: reduced ? dur.base : dur.enter,
          ease: reduced ? ease.soft : ease.enter,
          delay,
          onComplete: () => {
            if (!reduced) gsap.set(el, { clearProps: "willChange" });
          },
        });
      },
    });
    return () => {
      st.kill();
      gsap.killTweensOf(el);
    };
  }, [reduced, rng]);

  // @ts-expect-error -- dynamic ref typing
  return <As ref={ref} className={className} style={style}>{children}</As>;
}