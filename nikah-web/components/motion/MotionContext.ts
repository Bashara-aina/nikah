"use client";

import { createContext, useContext } from "react";
import type { Tier } from "@/lib/motionTokens";

export interface MotionCtx {
  tier: Tier;
  reduced: boolean;
  gyro: { x: number; y: number };
  gyroEnabled: boolean;
  enableGyro: () => Promise<void>;
}

export const MotionContext = createContext<MotionCtx>({
  tier: "MID",
  reduced: false,
  gyro: { x: 0, y: 0 },
  gyroEnabled: false,
  enableGyro: async () => undefined,
});

export const useMotion = (): MotionCtx => useContext(MotionContext);