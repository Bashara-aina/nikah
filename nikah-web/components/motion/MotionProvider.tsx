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
  useEffect,
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
  // The store is a stable mutable cell used by useSyncExternalStore. Reading
  // storeRef.current here is intentional — the ref is the entire storage
  // mechanism and is never re-assigned after the first render. The
  // react-hooks/refs rule disallows reading refs during render in general;
  // this pattern is the documented one for useSyncExternalStore and is safe
  // because the ref is never written to from render.
  const storeRef = useRef<Store | null>(null);
  if (storeRef.current === null) {
    storeRef.current = {
      tier: "MID",
      reduced: false,
      listeners: new Set(),
    };
  }
  // eslint-disable-next-line react-hooks/refs -- see comment on storeRef
  const store = storeRef.current;

  // Detect after hydration only. Mutating the store inside `subscribe` made the
  // first client snapshot diverge from the server snapshot ("MID") and threw a
  // hydration error in Loading (breathing class toggled by tier).
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = (reduced: boolean) => {
      store.reduced = reduced;
      store.tier = reduced ? "REDUCED" : detectTier();
      for (const l of store.listeners) l();
    };
    apply(mql.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [store]);

  const subscribe = useCallback(
    (cb: () => void) => {
      store.listeners.add(cb);
      return () => {
        store.listeners.delete(cb);
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