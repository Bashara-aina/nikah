"use client";

/**
 * Particles — single <canvas> ambient petals/pollen (docs/12).
 * Per-tier count (HIGH 13 / MID 6 / LOW 0 / REDUCED 0).
 * - Pauses on document.hidden & when scrolled off-screen
 * - One RAF (loop owned here; Lenis drives scroll updates, we drive draw)
 * - Sakura palette option for Japan section
 */

import { useEffect, useRef } from "react";
import { particleCount } from "@/lib/motionTokens";
import { useMotion } from "./MotionContext";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  swayPhase: number;
  swayAmp: number;
  hue: number;
  opacity: number;
  born: number;
}

interface ParticlesProps {
  /** Sakura palette for Japan section. */
  variant?: "default" | "sakura";
}

const PALETTE_DEFAULT = ["#F3D9D6", "#F3E9DC", "#F4C9A8", "#FBF7F0"];
const PALETTE_SAKURA = ["#F4C2D7", "#F8C8DC", "#FADADD", "#FFD9E0"];

export default function Particles({ variant = "default" }: ParticlesProps) {
  const { tier } = useMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const count = particleCount[tier];
    if (count === 0) return; // no particles for LOW/REDUCED

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const palette = variant === "sakura" ? PALETTE_SAKURA : PALETTE_DEFAULT;

    const resize = (): void => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const makeParticle = (initial = false): Particle => ({
      x: Math.random() * container.clientWidth,
      y: initial ? Math.random() * container.clientHeight : -10,
      vx: 0,
      vy: 8 + Math.random() * 12,
      size: 6 + Math.random() * 10,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.02,
      swayPhase: Math.random() * Math.PI * 2,
      swayAmp: 10 + Math.random() * 14,
      hue: Math.floor(Math.random() * palette.length),
      opacity: 0,
      born: performance.now(),
    });

    const particles: Particle[] = Array.from({ length: count }, () =>
      makeParticle(true),
    );

    let lastT = performance.now();
    const draw = (t: number): void => {
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;
      const w = container.clientWidth;
      const h = container.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.swayPhase += dt * 0.5;
        p.vy += dt * 4;
        p.x += Math.sin(p.swayPhase) * p.swayAmp * dt + p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vrot;

        const ageMs = t - p.born;
        const fadeIn = Math.min(1, ageMs / 800);
        const fadeOut = p.y > h * 0.7 ? Math.max(0, 1 - (p.y - h * 0.7) / (h * 0.3)) : 1;
        p.opacity = 0.55 * fadeIn * fadeOut;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = palette[p.hue];
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.y > h + 20) {
          Object.assign(p, makeParticle(false));
        }
      }

      if (visibleRef.current && !document.hidden) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        rafRef.current = null;
      }
    };

    const start = (): void => {
      if (rafRef.current === null) {
        lastT = performance.now();
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    const stop = (): void => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    start();

    const onVis = (): void => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVis);

    const onResize = (): void => resize();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [tier, variant]);

  if (particleCount[tier] === 0) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}