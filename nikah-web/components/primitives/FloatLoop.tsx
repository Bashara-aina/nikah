"use client";

/** FloatLoop — generic translateY idle (gentle hover). */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ease, move } from "@/lib/motionTokens";
import { useMotion } from "@/components/motion/MotionContext";
import { pickRange } from "@/lib/seed";
import { useOrganicRng, type PrimitiveBaseProps } from "./_internal";

export default function FloatLoop({
  as: As = "div",
  className,
  children,
  seed = "float",
}: PrimitiveBaseProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { tier } = useMotion();
  const rng = useOrganicRng(seed);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    if (tier === "REDUCED" || tier === "LOW") return;

    const durS = pickRange(rng, 5, 8);
    const ampY = pickRange(rng, move.float * 0.6, move.float * 1.4);
    const phase = rng() * durS;

    el.style.willChange = "transform";

    const tween = gsap.to(el, {
      y: `+=${ampY}`,
      duration: durS / 2,
      ease: ease.float,
      yoyo: true,
      repeat: -1,
      delay: -phase,
    });

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        if (self.isActive) tween.resume();
        else tween.pause();
      },
    });

    return () => {
      st.kill();
      tween.kill();
      el.style.willChange = "";
    };
  }, [tier, rng]);

  // @ts-expect-error -- dynamic ref typing
  return <As ref={ref} className={className}>{children}</As>;
}