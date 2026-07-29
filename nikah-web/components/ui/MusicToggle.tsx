"use client";

/**
 * Persistent music toggle (top-right of the paper column so it never collides
 * with the sticky RSVP pill). Inline SVG note — the generated music-icon
 * keepers are opaque tiles (plan 05 §7 SVG fallback).
 */
import { useSiteAudio } from "@/components/AudioProvider";
import { copy } from "@/lib/copy";

export const MusicToggle = () => {
  const { unlocked, playing, toggleMute } = useSiteAudio();
  if (!unlocked) return null;
  const silent = !playing;

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={silent ? copy.a11y.musicOn : copy.a11y.musicOff}
      aria-pressed={!silent}
      className="fixed top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,calc(50vw-230px))] z-sticky flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/90 text-ink shadow-card backdrop-blur-sm transition-colors hover:bg-blush/30 active:scale-[0.97]"
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={silent ? "opacity-50" : "animate-[breathing_3s_ease-in-out_infinite]"}
      >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
        {silent ? <line x1="2" y1="2" x2="22" y2="22" /> : null}
      </svg>
    </button>
  );
};
