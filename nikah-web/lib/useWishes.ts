"use client";

/**
 * useWishes — fetch + cache list of approved wishes.
 * Used by the Wishes section; provides skeleton/empty/loaded states.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { Wish } from "./types";

export interface UseWishesState {
  items: Wish[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CACHE_MS = 30_000;

export function useWishes(limit = 50): UseWishesState {
  const [items, setItems] = useState<Wish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedRef = useRef<number>(0);

  const fetchNow = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/wishes?limit=${limit}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        if (res.status === 503) {
          setError("backend_not_configured");
        } else if (res.status === 429) {
          setError("rate_limited");
        } else {
          setError("upstream");
        }
        setItems([]);
        return;
      }
      const json = (await res.json()) as
        | { ok: true; items: Wish[] }
        | { ok: false; error: string };
      if (json.ok) {
        setItems(json.items);
        lastFetchedRef.current = Date.now();
      } else {
        setError(json.error);
        setItems([]);
      }
    } catch {
      setError("network");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const now = Date.now();
    if (now - lastFetchedRef.current > CACHE_MS || items.length === 0) {
      void fetchNow();
    } else {
      setLoading(false);
    }
  }, [fetchNow, items.length]);

  return { items, loading, error, refetch: fetchNow };
}
