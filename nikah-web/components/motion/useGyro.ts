"use client";

/**
 * `useGyro` — DeviceOrientation hook with iOS 13+ permission + lerp smoothing.
 * Returns `{ x, y, available }` reflecting normalized tilt, smoothed at
 * `parallax.smoothing` (0.08). No-op when tier is LOW or REDUCED, or when
 * the user has denied permission.
 *
 * Implementation note: all writes to React state happen inside the RAF
 * callback (i.e. on the next frame), never synchronously inside the effect.
 */
import { useEffect, useRef, useState } from "react";
import { useMotion } from "./MotionProvider";
import { parallax } from "@/lib/motionTokens";

type GyroValue = { x: number; y: number; available: boolean };

const ZERO: GyroValue = { x: 0, y: 0, available: false };

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

type DeviceOrientationPermissionAPI = {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export const useGyro = (): GyroValue => {
  const { tier } = useMotion();
  const [value, setValue] = useState<GyroValue>(ZERO);
  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const enabledRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    enabledRef.current = tier !== "LOW" && tier !== "REDUCED";
    if (!enabledRef.current) return;

    const handler = (event: DeviceOrientationEvent) => {
      // gamma: left-right (-90..90), beta: front-back (-180..180)
      const gamma = event.gamma ?? 0;
      const beta = event.beta ?? 0;
      targetRef.current = {
        x: Math.max(-1, Math.min(1, gamma / 30)),
        y: Math.max(-1, Math.min(1, (beta - 30) / 45)),
      };
    };

    const start = () => {
      window.addEventListener("deviceorientation", handler, { passive: true });
      const loop = () => {
        if (!enabledRef.current) return;
        const t = parallax.smoothing;
        currentRef.current = {
          x: lerp(currentRef.current.x, targetRef.current.x, t),
          y: lerp(currentRef.current.y, targetRef.current.y, t),
        };
        const next: GyroValue = {
          x: currentRef.current.x,
          y: currentRef.current.y,
          available: true,
        };
        setValue((prev) =>
          Math.abs(prev.x - next.x) < 0.001 && Math.abs(prev.y - next.y) < 0.001
            ? prev
            : next,
        );
        rafRef.current = window.requestAnimationFrame(loop);
      };
      rafRef.current = window.requestAnimationFrame(loop);
    };

    const api = (DeviceOrientationEvent as unknown as DeviceOrientationPermissionAPI)
      .requestPermission;
    if (typeof api === "function") {
      // iOS — wait for explicit permission gesture; `requestPermission` must be
      // called from a tap handler upstream (the Gate tap). Here we just listen.
      api()
        .then((res) => {
          if (res === "granted") start();
          else enabledRef.current = false;
        })
        .catch(() => {
          enabledRef.current = false;
        });
    } else {
      start();
    }

    return () => {
      enabledRef.current = false;
      window.removeEventListener("deviceorientation", handler);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [tier]);

  return value;
};