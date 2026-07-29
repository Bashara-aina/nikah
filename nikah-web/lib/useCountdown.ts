"use client";

/**
 * `useCountdown` — live days/hours/minutes until the target ISO timestamp.
 * Ticks once per 30s (minute resolution is what the UI shows). Clamps at zero.
 */
import { useEffect, useState } from "react";

export type CountdownParts = { days: number; hours: number; minutes: number; done: boolean };

const partsFor = (targetMs: number): CountdownParts => {
  const diff = Math.max(0, targetMs - Date.now());
  const minutes = Math.floor(diff / 60_000);
  return {
    days: Math.floor(minutes / (60 * 24)),
    hours: Math.floor((minutes / 60) % 24),
    minutes: minutes % 60,
    done: diff === 0,
  };
};

export const useCountdown = (targetIso: string): CountdownParts => {
  const targetMs = new Date(targetIso).getTime();
  // SSR-safe deterministic first paint; real value arrives on mount.
  const [parts, setParts] = useState<CountdownParts>({
    days: 0,
    hours: 0,
    minutes: 0,
    done: false,
  });

  useEffect(() => {
    const update = () => setParts(partsFor(targetMs));
    // First paint update lands via rAF so the effect body stays side-effect-only.
    const raf = window.requestAnimationFrame(update);
    const id = window.setInterval(update, 30_000);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, [targetMs]);

  return parts;
};
