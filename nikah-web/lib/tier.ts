/**
 * Tier detector — HIGH | MID | LOW | REDUCED.
 *
 * Spec: `docs/11-build-architecture.md` §3. Returns "REDUCED" for `prefers-reduced-motion`,
 * "LOW" for `saveData` or 2g/3g, "MID" for weak devices (<4 GB or ≤4 cores), else "HIGH".
 * Safe on SSR — returns "MID" if `navigator` is undefined.
 */
import type { Tier } from "./motionTokens";

export const detectTier = (): Tier => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "MID";
  }

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  if (reducedMotion) return "REDUCED";

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
  const conn = nav.connection;
  const saveData = conn?.saveData === true;
  const slowNetwork = ["slow-2g", "2g", "3g"].includes(conn?.effectiveType ?? "");
  if (saveData || slowNetwork) return "LOW";

  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const weakDevice = memory < 4 || cores <= 4;
  if (weakDevice) return "MID";

  return "HIGH";
};