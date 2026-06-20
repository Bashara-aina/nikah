"use client";

/**
 * Countdown — Hari · Jam · Menit · Detik (docs/10 §5).
 * Target = config.date.countdownTargetIso (22 Agt 2026 10:00 WIB).
 * Per-second micro-roll (not snap) on each unit.
 * Opaque band `scenes/countdown-bg.webp` (docs/12 §scenes — breathing
 * scale 1→1.01 8s). Florals live in the band asset only — no corner PNGs
 * (avoids overlap with the timer card). Honors prefers-reduced-motion.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { copy } from "@/lib/copy";
import { diffParts, getCountdownTargetMs } from "@/lib/date";
import { dur, ease, move, stagger } from "@/lib/motionTokens";
import { useMotion } from "@/components/motion/MotionContext";
import Reveal from "@/components/primitives/Reveal";
import Breathing from "@/components/primitives/Breathing";

interface UnitProps {
  value: number;
  label: string;
  testId: string;
  reduced: boolean;
  unitId: string;
}

function Unit({ value, label, testId, reduced, unitId }: UnitProps) {
  const numRef = useRef<HTMLSpanElement | null>(null);
  const prevRef = useRef<number>(value);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    if (prevRef.current === value) return;
    if (reduced) {
      el.textContent = String(value).padStart(2, "0");
      prevRef.current = value;
      return;
    }
    // micro-roll: y only — opacity flash made seconds look permanently faded
    const tween = gsap.fromTo(
      el,
      { y: move.reveal * 0.2 },
      {
        y: 0,
        duration: dur.micro,
        ease: ease.soft,
      },
    );
    tween.eventCallback("onComplete", () => {
      prevRef.current = value;
    });
    return () => {
      tween.kill();
    };
  }, [value, reduced]);

  return (
    <div
      data-cd-unit={unitId}
      data-testid={testId}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 0,
        flex: "1 1 0",
      }}
    >
      <span
        ref={numRef}
        aria-live="off"
        style={{
          fontFamily: "var(--font-serif), serif",
          fontSize: "clamp(2rem, 8vw, 3rem)",
          fontWeight: 500,
          color: "var(--ink)",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          display: "block",
        }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        style={{
          marginTop: 8,
          fontFamily: "var(--font-sans)",
          fontSize: "0.8rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ink-soft)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// useSyncExternalStore-based mounted detector. On the server it returns
// `false` (placeholder state); on the client it returns `true` after the
// first commit. Using this hook avoids the "setState in effect" lint and
// is the canonical React 19 pattern for SSR-safe mounted checks.
function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

export default function Countdown() {
  const { reduced, tier } = useMotion();
  const target = getCountdownTargetMs();
  // SSR-safe initial state: defer to target so parts are 0/0/0/0 on the server.
  // The real time is only read after mount, eliminating Date.now() drift between
  // server render and client first paint.
  const mounted = useIsMounted();
  const [now, setNow] = useState<number>(target);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Start the per-second tick on first client commit.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    let id: number | null = null;
    const tick = (): void => {
      setNow(Date.now());
      id = window.setTimeout(tick, 1000);
    };
    id = window.setTimeout(tick, 0);
    const onVis = (): void => {
      if (document.hidden) {
        if (id !== null) {
          clearTimeout(id);
          id = null;
        }
      } else if (id === null) {
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (id !== null) clearTimeout(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const parts = diffParts(target, now);

  // Initial entrance stagger for the four units.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = sectionRef.current;
    if (!root) return;
    const units = root.querySelectorAll<HTMLElement>("[data-cd-unit]");
    if (units.length === 0) return;
    const tween = gsap.from(units, {
      autoAlpha: 0,
      y: move.reveal,
      duration: dur.enter,
      ease: ease.settle,
      stagger: stagger.base,
      delay: 0.05,
    });
    return () => {
      tween.kill();
    };
  }, [reduced]);

  // Placeholder values for SSR and pre-mount first paint. Stable strings so
  // server and client agree before hydration.
  const PLACEHOLDER = 0;
  const showDays = mounted ? parts.days : PLACEHOLDER;
  const showHours = mounted ? parts.hours : PLACEHOLDER;
  const showMinutes = mounted ? parts.minutes : PLACEHOLDER;
  const showSeconds = mounted ? parts.seconds : PLACEHOLDER;
  const showDone = mounted && parts.done;

  const timerAriaLabel = mounted
    ? `${parts.days} hari ${parts.hours} jam ${parts.minutes} menit ${parts.seconds} detik menuju hari pernikahan`
    : "Hitung mundur menuju hari pernikahan";

  return (
    <section
      id="countdown"
      ref={sectionRef}
      className="section cv-auto"
      aria-label="Hitung mundur menuju hari bahagia"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        className="container-narrow"
        style={{ textAlign: "center", position: "relative", zIndex: 1 }}
      >
        {/* Stage wraps eyebrow + date + timer so the band sits behind all three,
         *  not just the digits. Florals stay on section edges (TR/BL). */}
        <div
          style={{
            position: "relative",
            padding: "clamp(32px, 7vw, 48px) clamp(16px, 5vw, 24px)",
            marginInline: "auto",
            width: "min(100%, 520px)",
          }}
        >
          {/* Opaque band (docs/10 §5) — fills the full stage height/width.
           *  No vertical mask; image stays vivid behind eyebrow + date + timer. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 0,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <Breathing
              seed="countdown-bg"
              as="div"
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <Image
                src="/assets/scene/countdown-bg.webp"
                alt=""
                fill
                sizes="(max-width: 520px) 100vw, 520px"
                loading="lazy"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </Breathing>
            {/* Cream veil — keeps type legible without washing out the band */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(251, 247, 240, 0.22)",
                pointerEvents: "none",
              }}
            />
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <Reveal as="div" seed="countdown-eyebrow">
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--ink-soft)",
                  margin: 0,
                }}
              >
                {copy.countdown.eyebrow}
              </p>
            </Reveal>
            <Reveal
              as="h2"
              className="t-h1"
              seed="countdown-date"
              style={{
                color: "var(--ink)",
                margin: "8px 0 20px",
              }}
            >
              {copy.countdown.date}
            </Reveal>

            <div
              role="timer"
              aria-live="off"
              aria-atomic="true"
              aria-label={timerAriaLabel}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "clamp(12px, 3vw, 24px)",
                padding: "20px 16px 18px",
                background: "var(--cream)",
                border: "1px solid rgba(61, 43, 31, 0.08)",
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(61, 43, 31, 0.06)",
                opacity: tier === "LOW" ? 0.95 : 1,
              }}
            >
              <Unit
                value={showDays}
                label={copy.countdown.units.hari}
                testId="cd-days"
                reduced={reduced}
                unitId="days"
              />
              <Unit
                value={showHours}
                label={copy.countdown.units.jam}
                testId="cd-hours"
                reduced={reduced}
                unitId="hours"
              />
              <Unit
                value={showMinutes}
                label={copy.countdown.units.menit}
                testId="cd-minutes"
                reduced={reduced}
                unitId="minutes"
              />
              <Unit
                value={showSeconds}
                label={copy.countdown.units.detik}
                testId="cd-seconds"
                reduced={reduced}
                unitId="seconds"
              />
            </div>

            {showDone ? (
              <p
                role="status"
                aria-live="polite"
                style={{
                  marginTop: 16,
                  fontFamily: "var(--font-serif), serif",
                  color: "var(--ink)",
                }}
              >
                Hari ini adalah hari yang kami nantikan. 🤍
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
