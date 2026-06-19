"use client";

/**
 * AudioProvider — backsound (La Vie en Rose) starts only after Gate tap.
 * - Fade-in volume 0 → config.audio.volume over 1.2s
 * - Loop forever
 * - Toggle persists to localStorage (mute)
 * - Hidden on tab inactive (SPEC 05 §5)
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { config } from "@/lib/config";

interface AudioCtx {
  playing: boolean;
  toggle: () => void;
  play: () => Promise<void>;
}

const AudioContext = createContext<AudioCtx>({
  playing: false,
  toggle: () => undefined,
  play: async () => undefined,
});

export const useAudio = (): AudioCtx => useContext(AudioContext);

const LS_KEY = "nikah-audio-muted";

export default function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  // Construct audio element once (client only)
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const a = new Audio(config.audio.src);
    a.loop = true;
    a.preload = "none";
    a.volume = 0;
    audioRef.current = a;

    // Resume on visibility
    const onVis = (): void => {
      if (document.hidden && !a.paused) a.pause();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      a.pause();
      audioRef.current = null;
    };
  }, []);

  const fadeTo = useCallback((target: number, ms: number) => {
    const a = audioRef.current;
    if (!a) return;
    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);
    const start = performance.now();
    const from = a.volume;
    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / ms);
      a.volume = from + (target - from) * t;
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(tick);
      } else {
        fadeRef.current = null;
      }
    };
    fadeRef.current = requestAnimationFrame(tick);
  }, []);

  const play = useCallback(async (): Promise<void> => {
    const a = audioRef.current;
    if (!a) return;
    try {
      const muted = localStorage.getItem(LS_KEY) === "true";
      if (muted) return;
      a.volume = 0;
      await a.play();
      fadeTo(config.audio.volume, 1200);
      setPlaying(true);
    } catch {
      // autoplay blocked or audio error
    }
  }, [fadeTo]);

  const toggle = useCallback((): void => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      void play();
      localStorage.setItem(LS_KEY, "false");
    } else {
      a.pause();
      fadeTo(0, 200);
      localStorage.setItem(LS_KEY, "true");
      setPlaying(false);
    }
  }, [play, fadeTo]);

  const value = useMemo<AudioCtx>(
    () => ({ playing, toggle, play }),
    [playing, toggle, play],
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}