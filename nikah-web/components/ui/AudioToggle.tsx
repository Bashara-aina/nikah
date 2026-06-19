"use client";

/**
 * AudioToggle — sticky audio control with mute icon swap.
 */

import { useAudio } from "@/components/audio/AudioProvider";

export default function AudioToggle() {
  const { playing, toggle } = useAudio();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Matikan backsound" : "Nyalakan backsound"}
      aria-pressed={playing}
      className="btn-ghost"
      style={{
        position: "fixed",
        left: 16,
        bottom: 76,
        zIndex: 50,
        padding: "10px 14px",
        minHeight: 44,
        minWidth: 44,
        borderRadius: "50%",
        fontSize: 18,
      }}
    >
      <span aria-hidden="true">{playing ? "♪" : "♪̸"}</span>
    </button>
  );
}