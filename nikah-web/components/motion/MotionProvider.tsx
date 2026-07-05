"use client";

/**
 * MotionProvider — single React context exposing the smart-fallback tier
 * (`HIGH | MID | LOW | REDUCED`) to every descendant. The tier is detected
 * once on mount via `detectTier()`; subsequent updates fire only on
 * `prefers-reduced-motion` change. SSR-safe default = "MID".
 *
 * Implementation: the tier + reduced-motion values live in a `useRef`-backed
 * store. `useSyncExternalStore` subscribes React to changes; subscribers are
 * notified via the store's listener set. This keeps every state write outside
 * the render path so React 19's strict hooks linter does not flag the
 * provider for synchronous `setState` calls inside `useEffect`.
 */
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { detectTier } from "@/lib/tier";
import type { Tier } from "@/lib/motionTokens";

type MotionContextValue = {
  tier: Tier;
  setTier: (t: Tier) => void;
  prefersReducedMotion: boolean;
};

const MotionContext = createContext<MotionContextValue | null>(null);

type Store = {
  tier: Tier;
  reduced: boolean;
  listeners: Set<() => void>;
};

export const MotionProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<Store | null>(null);
  if (storeRef.current === null) {
    storeRef.current = {
      tier: "MID",
      reduced: false,
      listeners: new Set(),
    };
  }
  const store = storeRef.current;

  const subscribe = useCallback(
    (cb: () => void) => {
      store.listeners.add(cb);
      let teardown: (() => void) | undefined;
      if (typeof window !== "undefined") {
        const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
        // Initial sync (runs on first mount via the snapshot path).
        store.reduced = mql.matches;
        store.tier = mql.matches ? "REDUCED" : detectTier();
        const handler = (e: MediaQueryListEvent) => {
          store.reduced = e.matches;
          store.tier = e.matches ? "REDUCED" : detectTier();
          for (const l of store.listeners) l();
        };
        mql.addEventListener("change", handler);
        teardown = () => mql.removeEventListener("change", handler);
      }
      return () => {
        store.listeners.delete(cb);
        teardown?.();
      };
    },
    [store],
  );

  const tier = useSyncExternalStore(
    subscribe,
    () => store.tier,
    () => "MID" as Tier,
  );

  const prefersReducedMotion = useSyncExternalStore(
    subscribe,
    () => store.reduced,
    () => false,
  );

  const setTier = useCallback(
    (t: Tier) => {
      store.tier = t;
      for (const l of store.listeners) l();
    },
    [store],
  );

  const value: MotionContextValue = { tier, setTier, prefersReducedMotion };
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
};

export const useMotion = (): MotionContextValue => {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error("useMotion must be called within <MotionProvider>");
  return ctx;
};