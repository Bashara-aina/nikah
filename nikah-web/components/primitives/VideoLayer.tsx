"use client";

/**
 * `VideoLayer` — fal.ai video loop primitive. Pauses off-screen via
 * `useVideoLayer`. Honors tier (LOW/REDUCED → never play, show poster).
 * Spec: `docs/11` §6.
 */
import { useRef } from "react";
import { useVideoLayer } from "@/components/motion/useVideoLayer";
import type { CSSProperties } from "react";

export type VideoLayerProps = {
  src: string;
  poster: string;
  className?: string;
  style?: CSSProperties;
  /** Depth tier 0..5 — drives parallax in the Hero. */
  depth?: 0 | 1 | 2 | 3 | 4 | 5;
  preload?: "none" | "metadata" | "auto";
};

export const VideoLayer = ({
  src,
  poster,
  className,
  style,
  depth,
  preload = "none",
}: VideoLayerProps) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  useVideoLayer(ref);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      preload={preload}
      data-depth={depth}
      style={style}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};