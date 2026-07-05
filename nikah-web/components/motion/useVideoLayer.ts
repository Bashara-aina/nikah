"use client";

/**
 * `useVideoLayer` — pauses/resumes a `<video>` element based on viewport
 * visibility AND current tier. Verbatim from `docs/11` §4, with tier gating
 * extended so LOW tier also falls back to poster (no autoplay at all).
 */
import { useEffect, type RefObject } from "react";
import { useMotion } from "./MotionProvider";

export const useVideoLayer = (videoRef: RefObject<HTMLVideoElement | null>): void => {
  const { tier } = useMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (tier === "REDUCED" || tier === "LOW") {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!video) return;
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          void video.play().catch(() => {
            /* autoplay blocked by browser policy — poster still shown */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [tier, videoRef]);
};