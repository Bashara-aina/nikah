"use client";

/**
 * Petals / pollen particle canvas. Single `<canvas>`, single RAF (per
 * `docs/08` §9). Particle count scales by tier via `tierBudget()`.
 */
import { useEffect, useRef } from "react";
import { useMotion } from "./MotionProvider";
import { tierBudget } from "@/lib/motionAdapter";

type Petal = { x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number };

const COLORS = ["#f5d6c6", "#f1c1b1", "#e8a497", "#d4897a", "#fde7d7"];

export const Particles = () => {
  const { tier } = useMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const budget = tierBudget(tier);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const petals: Petal[] = Array.from({ length: budget.petals }).map(() => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      vx: -0.4 + Math.random() * 0.8,
      vy: 0.4 + Math.random() * 1.0,
      r: 2 + Math.random() * 3,
      rot: Math.random() * Math.PI * 2,
      vr: -0.02 + Math.random() * 0.04,
    }));

    let raf = 0;
    let running = true;
    const draw = () => {
      if (!running) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        p.x += p.vx + Math.sin(p.y * 0.01) * 0.4;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > h + 8) {
          p.y = -8;
          p.x = Math.random() * w;
        }
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = COLORS[Math.floor(Math.random() * COLORS.length)] ?? COLORS[0]!;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r * 1.4, p.r * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      raf = window.requestAnimationFrame(draw);
    };
    if (petals.length > 0) raf = window.requestAnimationFrame(draw);

    return () => {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [tier]);

  if (tier === "LOW" || tier === "REDUCED") return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
};