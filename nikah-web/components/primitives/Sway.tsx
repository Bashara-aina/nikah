"use client";

/** Sway — rotate idle loop (florals / drapery). */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ease, move } from "@/lib/motionTokens";
import { useMotion } from "@/components/motion/MotionContext";
import { pickRange } from "@/lib/seed";
import { useOrganicRng, type PrimitiveBaseProps } from "./_internal";

export interface SwayProps extends PrimitiveBaseProps {
  pivot?: string;
}

export default function Sway({
  as: As = "div",
  className,
  children,
  seed = "sway",
  pivot = "50% 100%",
}: SwayProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { tier } = useMotion();
  const rng = useOrganicRng(seed);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    if (tier === "REDUCED" || tier === "LOW") return;

    const durS = pickRange(rng, 5, 9);
    const deg = pickRange(rng, 0.6, move.swayDeg);
    const phase = rng() * durS;

    el.style.willChange = "transform";
    el.style.transformOrigin = pivot;

    const tween = gsap.to(el, {
      rotation: deg,
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
  }, [tier, rng, pivot]);

  // @ts-expect-error -- dynamic ref typing
  return <As ref={ref} className={className}>{children}</As>;
}