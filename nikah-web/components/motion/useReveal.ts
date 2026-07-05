"use client";

/**
 * `useReveal` — convenience hook that wires a single element to ScrollTrigger
 * with a reveal animation matching `motionTokens.ts`. Auto-staggers direct
 * children when `stagger` is true. No-op in REDUCED tier.
 */
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "./MotionProvider";
import { dur, stagger as staggerToken, cubicBezierString } from "@/lib/motionTokens";

gsap.registerPlugin(ScrollTrigger);

type RevealOpts = {
  /** When true, stagger direct children with `stagger.tight`. */
  stagger?: boolean;
  /** Reveal y amplitude in px (default `move.reveal`). */
  y?: number;
  /** ScrollTrigger start, default "top 80%". */
  start?: string;
};

export const useReveal = (
  ref: React.RefObject<HTMLElement | null>,
  opts: RevealOpts = {},
): void => {
  const { tier } = useMotion();
  const { stagger = false, y = 32, start = "top 80%" } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (tier === "REDUCED") return;

    const target = stagger ? el.children : [el];
    const ctx = gsap.context(() => {
      gsap.from(target, {
        opacity: 0,
        y,
        duration: dur.enter,
        ease: cubicBezierString("enter"),
        stagger: stagger ? staggerToken.base : 0,
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [tier, ref, stagger, y, start]);
};