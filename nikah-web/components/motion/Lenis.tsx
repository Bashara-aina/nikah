"use client";

/**
 * LenisProvider — smooth scroll with reduced-motion fallback (SPEC 11 §1).
 * Single RAF shared with ScrollTrigger.update.
 */

import { useEffect, type ReactNode } from "react";
import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "./MotionContext";

export default function LenisProvider({ children }: { children: ReactNode }) {
  const { tier, reduced } = useMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reduced-motion: native scroll, no Lenis.
    if (reduced) {
      return undefined;
    }

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchInertiaMultiplier: 28,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Expose for sticky/scrollTo helpers.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      // Mark tier on body for CSS hooks
      void tier;
    };
  }, [tier, reduced]);

  return <>{children}</>;
}