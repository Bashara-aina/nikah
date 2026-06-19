"use client";

/**
 * useParallax — combines scroll progress + gyro tilt into per-layer
 * `translate3d` transforms. Tier-aware: no-op at REDUCED.
 *
 * SPEC 06 §4, docs/08 §4, docs/08 §5.
 */

import { useEffect, type RefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { depth, move } from "@/lib/motionTokens";
import { useMotion } from "./MotionContext";
import { hashString, mulberry32 } from "@/lib/seed";

export interface ParallaxLayer {
  ref: RefObject<HTMLElement | null>;
  /** depth tier — used to pick factorX/factorY from `depth` map. */
  factorX?: number;
  factorY?: number;
  /** optional name to seed organic offset. */
  name?: string;
}

export function useParallax(
  trigger: RefObject<HTMLElement | null>,
  layers: ParallaxLayer[],
): void {
  const { tier, gyro, gyroEnabled, reduced } = useMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = trigger.current;
    if (!root) return;

    const enabled = tier !== "REDUCED";
    if (!enabled) return;

    // Per-layer setup: will-change + transform baseline.
    const setters = layers
      .map((layer) => {
        const el = layer.ref.current;
        if (!el) return null;
        const rng = mulberry32(hashString(layer.name ?? "p"));
        const ox = (rng() - 0.5) * 0.5;
        el.style.willChange = "transform";
        return { el, fx: layer.factorX ?? 0.2, fy: layer.factorY ?? 0.2, ox };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    let raf = 0;
    let lastScroll = 0;
    let scrollProgress = 0;

    const render = (): void => {
      // blend scroll + tilt (tilt = 0.6 * scroll factor, docs/08 §5)
      const tx = -scrollProgress * move.parallaxMax + gyro.x * move.parallaxMax * 0.6;
      const ty = lastScroll * 0 + gyro.y * move.parallaxMax * 0.6;
      for (const s of setters) {
        s.el.style.transform = `translate3d(${tx * s.fx * (1 + s.ox)}px, ${ty * s.fy * (1 + s.ox)}px, 0)`;
      }
      void depth; // depth token reserved for tier-specific config
      raf = 0;
    };

    const schedule = (): void => {
      if (raf === 0) raf = requestAnimationFrame(render);
    };

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        scrollProgress = self.progress * 2 - 1; // -1..1 around root
        lastScroll = self.getVelocity();
        schedule();
      },
    });

    // Re-render whenever gyro updates (state-driven).
    schedule();

    return () => {
      st.kill();
      if (raf !== 0) cancelAnimationFrame(raf);
      for (const s of setters) {
        s.el.style.willChange = "";
        s.el.style.transform = "";
      }
    };
  }, [trigger, tier, gyro.x, gyro.y, gyroEnabled, reduced, layers]);
}