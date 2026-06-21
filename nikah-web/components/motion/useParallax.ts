"use client";

/**
 * `useParallax` — single RAF loop that combines scroll position + gyro tilt
 * and returns a stable map of `transform: translate3d(x, y, 0)` strings keyed
 * by depth tier. `HIGH | MID` only; `LOW | REDUCED` returns zero translation
 * per layer so components render statically.
 */
import { useEffect, useState } from "react";
import { useMotion } from "./MotionProvider";
import { useGyro } from "./useGyro";
import { parallaxForTier, type DepthTier } from "@/lib/motionAdapter";

export type ParallaxMap = Record<DepthTier, string>;

const ZERO_MAP: ParallaxMap = {
  0: "translate3d(0px,0px,0)",
  1: "translate3d(0px,0px,0)",
  2: "translate3d(0px,0px,0)",
  3: "translate3d(0px,0px,0)",
  4: "translate3d(0px,0px,0)",
  5: "translate3d(0px,0px,0)",
};

const TIERS: readonly DepthTier[] = [0, 1, 2, 3, 4, 5];

export const useParallax = (): ParallaxMap => {
  const { tier } = useMotion();
  const gyro = useGyro();
  const [scrollDelta, setScrollDelta] = useState<number>(0);

  useEffect(() => {
    if (tier === "LOW" || tier === "REDUCED") return;

    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const next = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      setScrollDelta((prev) => Math.max(-200, Math.min(200, prev + next)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [tier]);

  if (tier === "LOW" || tier === "REDUCED") return ZERO_MAP;

  const tiltX = gyro.x;
  const tiltY = gyro.y;
  const map = {} as ParallaxMap;
  for (const t of TIERS) {
    const max = parallaxForTier(t);
    const x = (tiltX * max * parallaxForTier(0)) / max;
    const y = scrollDelta * 0.05 * (max / 8) + tiltY * max * 0.3;
    map[t] = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
  }
  return map;
};