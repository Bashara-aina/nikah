"use client";

/**
 * useReveal — ScrollTrigger entrance helper (SPEC 06 §4, docs/10 §0).
 *   - default: opacity 0→1 + y move.reveal→0, ease.enter, stagger.base
 *   - REDUCED: opacity-only fade
 *   - Pauses when section leaves viewport (auto via ScrollTrigger)
 *   - Cleanup kills instance on unmount
 */

import { useEffect } from "react";
import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dur, ease, move, stagger as staggerToken } from "@/lib/motionTokens";
import { useMotion } from "./MotionContext";

export interface RevealOpts {
  y?: number;
  delay?: number;
  stagger?: number;
  once?: boolean;
  childSelector?: string;
}

export function useReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  opts: RevealOpts = {},
): void {
  const { reduced } = useMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const target = ref.current;
    if (!target) return;

    const y = opts.y ?? move.reveal;
    const stagger = opts.stagger ?? staggerToken.base;
    const once = opts.once ?? true;
    const delay = opts.delay ?? 0;

    const children = opts.childSelector
      ? target.querySelectorAll<HTMLElement>(opts.childSelector)
      : null;

    const animTargets: HTMLElement[] = children ? Array.from(children) : [target];
    if (animTargets.length === 0) return;

    // Initial state
    gsap.set(animTargets, {
      opacity: 0,
      y: reduced ? 0 : y,
      willChange: "transform, opacity",
    });

    const tweenConfig = {
      opacity: 1,
      y: 0,
      duration: reduced ? dur.base : dur.enter,
      ease: reduced ? ease.soft : ease.enter,
      delay,
      stagger: children ? stagger : 0,
      onComplete: () => {
        if (!reduced) {
          gsap.set(animTargets, { clearProps: "willChange" });
        }
      },
    };

    const trigger = ScrollTrigger.create({
      trigger: target,
      start: "top 80%",
      once,
      onEnter: () => {
        gsap.to(animTargets, tweenConfig);
      },
    });

    return () => {
      trigger.kill();
      gsap.killTweensOf(animTargets);
    };
  }, [ref, reduced, opts.y, opts.delay, opts.stagger, opts.once, opts.childSelector]);
}