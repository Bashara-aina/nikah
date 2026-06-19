"use client";

/**
 * useGyro — DeviceOrientation + iOS permission + lerp smoothing.
 * Attached to gate tap (SPEC 06 §4, docs/08 §5).
 * Output {x,y} normalized to -1..1; lerped to avoid jitter.
 */

import { useEffect, useRef, useState } from "react";

interface OrientationEvent extends Event {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

interface DeviceOrientationPermission {
  requestPermission?: () => Promise<"granted" | "denied">;
}

const MAX_TILT = 20;
const LERP = 0.08;

export interface GyroState {
  x: number;
  y: number;
  enabled: boolean;
}

export function useGyro() {
  const [enabled, setEnabled] = useState(false);
  const [gyro, setGyro] = useState({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const tickingRef = useRef(false);

  // RAF loop kept as a stable callback-free implementation.
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const tick = (): void => {
    const t = targetRef.current;
    const c = currentRef.current;
    c.x += (t.x - c.x) * LERP;
    c.y += (t.y - c.y) * LERP;
    setGyro({ x: c.x, y: c.y });
    rafRef.current = requestAnimationFrame(tick);
  };

  const enable = async (): Promise<void> => {
    if (typeof window === "undefined") return;
    const reqFn = (
      DeviceOrientationEvent as unknown as DeviceOrientationPermission
    ).requestPermission;
    if (typeof reqFn === "function") {
      try {
        const res = await reqFn();
        if (res !== "granted") return;
      } catch {
        return;
      }
    }
    const handler = (e: Event): void => {
      const ev = e as OrientationEvent;
      const gamma = clamp(ev.gamma ?? 0, -MAX_TILT, MAX_TILT) / MAX_TILT;
      const beta = clamp(ev.beta ?? 0, -MAX_TILT, MAX_TILT) / MAX_TILT;
      targetRef.current = { x: gamma, y: beta * 0.6 };
    };
    window.addEventListener("deviceorientation", handler, { passive: true });
    setEnabled(true);
    if (!tickingRef.current) {
      tickingRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  return { gyro, enabled, enable } as const;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}