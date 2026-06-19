"use client";

/**
 * MotionProvider — context wrapper that wires:
 *  - useTier (HIGH/MID/LOW/REDUCED)
 *  - useGyro (lazy init via gate tap)
 *  - GSAP plugin registration (one-shot)
 *
 * SPEC 06 §3.
 */

import { useEffect, useMemo, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MotionContext, type MotionCtx } from "./MotionContext";
import { useTier } from "./useTier";
import { useGyro } from "./useGyro";

// Register GSAP plugins at module scope so they are available before any
// child component's useEffect runs (parent effects fire after child effects).
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

export default function MotionProvider({ children }: { children: ReactNode }) {
  const { tier, reduced } = useTier();
  const { gyro, enabled, enable } = useGyro();

  useEffect(() => {
    if (typeof window === "undefined") return;
    ScrollTrigger.config({ ignoreMobileResize: true });
  }, []);

  const value = useMemo<MotionCtx>(
    () => ({
      tier,
      reduced,
      gyro,
      gyroEnabled: enabled,
      enableGyro: enable,
    }),
    [tier, reduced, gyro, enabled, enable],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}