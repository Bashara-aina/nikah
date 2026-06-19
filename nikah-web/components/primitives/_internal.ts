"use client";

/**
 * Internal shared helpers for primitives — exported to avoid repetition.
 * Not part of the public primitive API.
 */

import { useMemo } from "react";
import { hashString, mulberry32 } from "@/lib/seed";
import type { ReactNode } from "react";

export function useOrganicRng(seed: string | number | undefined): () => number {
  return useMemo(() => {
    const s =
      typeof seed === "string"
        ? hashString(seed)
        : typeof seed === "number"
          ? seed
          : 1;
    return mulberry32(s);
  }, [seed]);
}

type IntrinsicTag = keyof React.JSX.IntrinsicElements;

export interface PrimitiveBaseProps {
  as?: IntrinsicTag;
  className?: string;
  children?: ReactNode;
  seed?: string | number;
  style?: React.CSSProperties;
}