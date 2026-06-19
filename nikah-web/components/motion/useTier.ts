"use client";

/**
 * Motion tier detector — runs once on the client.
 * Honors prefers-reduced-motion, network hints (saveData/effectiveType),
 * deviceMemory, hardwareConcurrency (SPEC 06 §3, docs/11 §3, docs/08 §7).
 */

import { useEffect, useState } from "react";
import type { Tier } from "@/lib/motionTokens";

export interface TierState {
  tier: Tier;
  reduced: boolean;
  ready: boolean;
}

const initial: TierState = { tier: "MID", reduced: false, ready: false };

function detect(): TierState {
  if (typeof window === "undefined") return initial;

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = mq.matches;

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  const conn = nav.connection;

  const saveData = conn?.saveData === true;
  const slowNetwork = ["slow-2g", "2g", "3g"].includes(
    conn?.effectiveType ?? "",
  );
  const deviceMemory: number | undefined = nav.deviceMemory;
  const cores: number | undefined = navigator.hardwareConcurrency;

  const weak = (deviceMemory ?? 8) < 4 || (cores ?? 8) <= 4;

  const tier: Tier = reduced
    ? "REDUCED"
    : saveData || slowNetwork
      ? "LOW"
      : weak
        ? "MID"
        : "HIGH";

  return { tier, reduced, ready: true };
}

export function useTier(): TierState {
  const [state, setState] = useState<TierState>(initial);

  useEffect(() => {
    // Detect synchronously and schedule the state update via a microtask
    // so React doesn't flag it as a cascading effect-set.
    const next = detect();
    queueMicrotask(() => setState(next));
  }, []);

  return state;
}