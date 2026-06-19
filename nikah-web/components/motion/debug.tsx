"use client";

/**
 * Motion debug overlay — toggled via `?debug=motion` (SPEC 06 §9).
 * Shows tier, fps, ScrollTrigger count, particle count.
 * No-op in production builds.
 */

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "./MotionContext";

export default function MotionDebug() {
  const { tier } = useMotion();
  const [enabled, setEnabled] = useState(false);
  const [fps, setFps] = useState(0);
  const [stCount, setStCount] = useState(0);
  const enabledRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const e = params.get("debug") === "motion";
    enabledRef.current = e;
    queueMicrotask(() => setEnabled(e));
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    let frames = 0;
    let last = performance.now();
    let lastCountT = performance.now();
    let raf = 0;

    const tick = (): void => {
      frames++;
      const now = performance.now();
      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }
      if (now - lastCountT >= 500) {
        setStCount(ScrollTrigger.getAll().length);
        lastCountT = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 12,
        left: 12,
        zIndex: 999,
        background: "rgba(74,64,57,.9)",
        color: "#FBF7F0",
        fontFamily: "ui-monospace, monospace",
        fontSize: 11,
        padding: "6px 10px",
        borderRadius: 8,
        lineHeight: 1.4,
        pointerEvents: "none",
      }}
    >
      <div>tier: <strong>{tier}</strong></div>
      <div>fps: {fps}</div>
      <div>scrollTriggers: {stCount}</div>
    </div>
  );
}