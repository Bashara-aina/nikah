"use client";

/**
 * AudioProvider — owns the single site `<audio>` element (La Vie en Rose).
 *
 * Contract (plan 05 §2):
 * - Playback may only start from an intentional user gesture (`unlock()` is
 *   called inside the Gate tap handler — AudioContext autoplay rule).
 * - Fade 0 → fadeTarget over `fadeInMs` via GSAP (tokens: easing "enter").
 * - Mute preference persists in localStorage; a muted guest who re-opens the
 *   invitation stays muted until they toggle.
 * - GSAP owns the volume tween (motion ownership: audio fade = GSAP).
 */
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { siteConfig } from "@/lib/config";
import { gsapEase } from "@/lib/motionAdapter";

const MUTE_KEY = "nikah:audio-muted";

type AudioContextValue = {
  /** True once `unlock()` ran (gate tapped or session restored) — controls toggle visibility. */
  unlocked: boolean;
  muted: boolean;
  /** True while the track is actually playing (autoplay may be blocked). */
  playing: boolean;
  unlock: () => void;
  toggleMute: () => void;
};

const SiteAudioContext = createContext<AudioContextValue | null>(null);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [playing, setPlaying] = useState(false);
  // Lazy read of the stored preference. `muted` is never rendered into SSR
  // markup (the toggle appears only after the gate tap), so the server/client
  // initial-value difference cannot cause a hydration mismatch.
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(MUTE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const fadeTo = useCallback((volume: number, onDone?: () => void) => {
    const el = audioRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.to(el, {
      volume,
      duration: siteConfig.audio.fadeInMs / 1000,
      ease: gsapEase("enter"),
      onComplete: onDone,
    });
  }, []);

  const unlock = useCallback(() => {
    setUnlocked(true);
    const el = audioRef.current;
    if (!el || muted) return;
    el.volume = 0;
    void el
      .play()
      .then(() => fadeTo(siteConfig.audio.fadeTarget))
      .catch(() => {
        /* blocked — guest can use the music toggle later */
      });
  }, [fadeTo, muted]);

  const toggleMute = useCallback(() => {
    const el = audioRef.current;
    // Resume counts as "unmute": a blocked autoplay leaves the track paused
    // even when the preference is unmuted, so act on the audible state.
    const audible = el ? !el.paused : false;
    const next = audible;
    try {
      window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (el) {
      if (next) {
        fadeTo(0, () => el.pause());
      } else {
        if (el.paused) {
          el.volume = 0;
          void el.play().catch(() => {});
        }
        fadeTo(siteConfig.audio.fadeTarget);
      }
    }
    setMuted(next);
  }, [fadeTo]);

  return (
    <SiteAudioContext.Provider value={{ unlocked, muted, playing, unlock, toggleMute }}>
      {children}
      <audio
        ref={audioRef}
        src={siteConfig.audio.src}
        preload="none"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </SiteAudioContext.Provider>
  );
};

export const useSiteAudio = (): AudioContextValue => {
  const ctx = useContext(SiteAudioContext);
  if (!ctx) throw new Error("useSiteAudio must be called within <AudioProvider>");
  return ctx;
};
