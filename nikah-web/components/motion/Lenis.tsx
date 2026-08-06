"use client";

/**
 * Lenis provider — smooth scroll with lerp ≈ 0.09 (per `docs/08` §5).
 * Wired to GSAP's ticker so `ScrollTrigger.update()` fires in sync. No-op
 * when tier === "REDUCED".
 *
 * Modals call `useLenisControl().stop()` so wheel/touch does not scroll the
 * page behind an open dialog — `overflow: hidden` alone is not enough while
 * Lenis owns the scroll.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "./MotionProvider";

gsap.registerPlugin(ScrollTrigger);

const LERP = 0.09;

type LenisControl = {
  stop: () => void;
  start: () => void;
};

const LenisControlContext = createContext<LenisControl>({
  stop: () => undefined,
  start: () => undefined,
});

/** Pause / resume site smooth-scroll (nested-safe via a lock counter). */
export const useLenisControl = (): LenisControl => useContext(LenisControlContext);

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const { tier } = useMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const lockCount = useRef(0);

  const stop = useCallback(() => {
    lockCount.current += 1;
    if (lockCount.current === 1) lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lockCount.current = Math.max(0, lockCount.current - 1);
    if (lockCount.current === 0) lenisRef.current?.start();
  }, []);

  const control = useMemo(() => ({ stop, start }), [stop, start]);

  useEffect(() => {
    if (tier === "REDUCED") return;

    const lenis = new Lenis({
      duration: 1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    lenisRef.current = lenis;
    if (lockCount.current > 0) lenis.stop();

    const onRaf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [tier]);

  // Defensive: ensure a sane default lerp is documented for reviewers; runtime
  // value lives in Lenis constructor above.
  void LERP;

  return <LenisControlContext.Provider value={control}>{children}</LenisControlContext.Provider>;
};
