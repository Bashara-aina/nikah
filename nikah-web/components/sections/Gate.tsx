"use client";

/**
 * Gate — opening storybook page.
 * - Corner floral framing (TL + BR)
 * - Personalized greeting from ?to=
 * - "Buka Undangan" tap → enable gyro + start audio + reveal hero
 * - sessionStorage skip if already entered
 * - Cats NOT shown (saved for hero reveal)
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import FloralCorner from "@/components/primitives/FloralCorner";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dur, ease, move } from "@/lib/motionTokens";
import { copy } from "@/lib/copy";
import { readGuest, greeting } from "@/lib/guest";
import { useMotion } from "@/components/motion/MotionContext";
import { useAudio } from "@/components/audio/AudioProvider";
import { hashString, mulberry32 } from "@/lib/seed";

const LS_KEY = "nikah-entered";

export default function Gate() {
  const { tier, enableGyro } = useMotion();
  const audio = useAudio();
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const floralWrapRef = useRef<HTMLDivElement | null>(null);
  const greetingRef = useRef<HTMLHeadingElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);

  // Read ?to= and check skip-on-reload (sessionStorage).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const n = readGuest(new URLSearchParams(window.location.search));
    const already = window.sessionStorage.getItem(LS_KEY) === "true";
    queueMicrotask(() => {
      setName(greeting(n));
      if (already) {
        setExiting(true);
        // Remove gate from DOM after exit anim
        window.setTimeout(() => setVisible(false), dur.enter * 1000 + 200);
      }
    });
  }, []);

  // Idle motions: floral wrap sway + cta breathing.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (exiting) return;
    if (tier === "REDUCED" || tier === "LOW") return;

    const tweens: gsap.core.Tween[] = [];
    const rng = mulberry32(hashString("gate"));
    if (floralWrapRef.current) {
      tweens.push(
        gsap.to(floralWrapRef.current, {
          rotation: rng() > 0.5 ? 0.4 : -0.4,
          duration: 9,
          ease: ease.float,
          yoyo: true,
          repeat: -1,
          transformOrigin: "50% 50%",
        }),
      );
    }
    if (ctaRef.current) {
      tweens.push(
        gsap.to(ctaRef.current, {
          scale: 1.03,
          duration: 2.6,
          ease: ease.float,
          yoyo: true,
          repeat: -1,
          transformOrigin: "50% 50%",
        }),
      );
    }
    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [tier, exiting]);

  // Reveal entrance.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = containerRef.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>("[data-gate-reveal]");
    if (targets.length === 0) return;
    gsap.set(targets, { opacity: 0, y: move.reveal });
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: dur.enter,
      ease: ease.enter,
      stagger: 0.12,
    });
  }, [visible]);

  // Handle Buka Undangan tap.
  const onEnter = async (): Promise<void> => {
    if (exiting) return;
    const root = containerRef.current;
    setExiting(true);
    window.sessionStorage.setItem(LS_KEY, "true");

    // Ask gyro + start audio in parallel (both need user gesture).
    void enableGyro().catch(() => undefined);
    void audio.play();

    if (root) {
      gsap.to(root, {
        opacity: 0,
        scale: 1.04,
        duration: dur.enter,
        ease: ease.enter,
        onComplete: () => {
          setVisible(false);
          // Tell ScrollTrigger layout changed.
          ScrollTrigger.refresh();
        },
      });
    } else {
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background:
          "radial-gradient(120% 100% at 50% 0%, var(--cream) 0%, var(--ivory) 60%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        overflow: "hidden",
      }}
    >
      {/* Corner florals pinned to viewport — replaces floral-border-full + arch-frame stack. */}
      <div
        ref={floralWrapRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <FloralCorner
          side="tl"
          size="clamp(140px, 38vw, 220px)"
          seed="gate"
          bleed={20}
          priority
          zIndex={0}
        />
        <FloralCorner
          side="br"
          size="clamp(140px, 38vw, 220px)"
          seed="gate"
          bleed={20}
          priority
          zIndex={0}
        />
      </div>

      <div
        style={{
          position: "relative",
          width: "min(420px, calc(100vw - 40px))",
          minHeight: "min(560px, calc(100vh - 48px))",
          maxHeight: "calc(100vh - 48px)",
          padding: "clamp(24px, 5vw, 40px)",
          background: "rgba(251, 247, 240, 0.92)",
          border: "1px solid var(--cream)",
          borderRadius: 16,
          boxShadow: "var(--shadow-lg)",
          textAlign: "center",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "auto",
        }}
      >
        <div data-gate-reveal style={{ marginBottom: 8 }}>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
          >
            {copy.gate.title}
          </div>
        </div>
        <h1
          id="gate-title"
          data-gate-reveal
          className="t-display"
          style={{ color: "var(--ink)", margin: "8px 0 24px" }}
        >
          {copy.gate.couple}
        </h1>
        <div data-gate-reveal style={{ marginBottom: 6 }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              color: "var(--ink-soft)",
              fontSize: "1rem",
              margin: 0,
            }}
          >
            {copy.gate.lead}
          </p>
        </div>
        <h2
          ref={greetingRef}
          data-gate-reveal
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.4rem",
            color: "var(--ink)",
            margin: "8px 0 12px",
            fontWeight: 500,
          }}
        >
          {name}
        </h2>
        <div data-gate-reveal style={{ marginBottom: 28 }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              color: "var(--ink-soft)",
              fontSize: "1rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {copy.gate.body}
          </p>
        </div>
        <button
          ref={ctaRef}
          data-gate-reveal
          type="button"
          className="btn-primary"
          onClick={() => void onEnter()}
          disabled={exiting}
          aria-label="Buka undangan"
        >
          {copy.gate.cta}
        </button>
      </div>
    </div>
  );
}