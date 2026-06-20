"use client";

/**
 * Gallery — scrapbook wall of prewedding photos (docs/10 §9, docs/12 §Gallery).
 * - Entrance: opacity + rotate ±2–4° → 0 + y, stagger.loose (per docs/12)
 * - Hover/tap: lift + rotate kecil
 * - Tap → lightbox (deferred from LAUNCH §8 — implemented here for completeness)
 * - `gallery-frame.png` overlay: scale-in saat foto masuk
 * - Asymmetric floral corners (docs/01 §4)
 *
 * Asset map (docs/12):
 *   gallery-01..09.jpg   → photos
 *   gallery-frame.png    → soft scrapbook frame overlay
 *   floral-corner-tl/br  → asymmetric framing
 *
 * Honors prefers-reduced-motion: fade only, no rotate, no lightbox drag.
 */

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copy } from "@/lib/copy";
import { dur, ease, move } from "@/lib/motionTokens";
import { useMotion } from "@/components/motion/MotionContext";
import { hashString, mulberry32 } from "@/lib/seed";
import Reveal from "@/components/primitives/Reveal";
import Breathing from "@/components/primitives/Breathing";
import FloralCorner from "@/components/primitives/FloralCorner";

const PHOTOS: readonly { id: number; src: string; alt: string; span: 1 | 2 }[] = [
  { id: 1, src: "/assets/gallery/gallery-01.jpg", alt: "Bashara dan Hanifah berdua", span: 1 },
  { id: 2, src: "/assets/gallery/gallery-02.jpg", alt: "Senyum kami berdua", span: 1 },
  { id: 3, src: "/assets/gallery/gallery-03.jpg", alt: "Tawa candid kami", span: 2 },
  { id: 4, src: "/assets/gallery/gallery-04.jpg", alt: "Saling menatap", span: 1 },
  { id: 5, src: "/assets/gallery/gallery-05.jpg", alt: "Buket kecil Hanifah", span: 1 },
  { id: 6, src: "/assets/gallery/gallery-06.jpg", alt: "Momen Bashara memberi bunga", span: 1 },
  { id: 7, src: "/assets/gallery/gallery-07.jpg", alt: "Godaan kecil", span: 1 },
  { id: 8, src: "/assets/gallery/gallery-08.jpg", alt: "Tawa lepas kami", span: 2 },
  { id: 9, src: "/assets/gallery/gallery-09.jpg", alt: "Berdua, tenang", span: 1 },
];

const FRAME_PNG = "/assets/scene/gallery-frame.png";

interface TileProps {
  src: string;
  alt: string;
  span: 1 | 2;
  index: number;
  reduced: boolean;
  onOpen: () => void;
}

function Tile({ src, alt, span, index, reduced, onOpen }: TileProps) {
  const tileRef = useRef<HTMLButtonElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  // Per-tile seeded random for entrance rotation (anti-sinkron).
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const tile = tileRef.current;
    const frame = frameRef.current;
    if (!tile || !frame) return;

    const rng = mulberry32(hashString(`gallery-tile-${index}`));
    const baseRot = pickRange(rng, reduced ? 0 : -3.5, reduced ? 0 : 3.5);

    // Initial state.
    gsap.set(tile, {
      autoAlpha: 0,
      y: move.reveal * 1.2,
      rotation: baseRot,
      scale: 0.95,
    });
    gsap.set(frame, { scale: 0.92, autoAlpha: 0 });

    const st = ScrollTrigger.create({
      trigger: tile,
      start: "top 88%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: ease.settle } });
        tl.to(tile, {
          autoAlpha: 1,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: reduced ? dur.base : dur.enter,
        });
        tl.to(
          frame,
          {
            autoAlpha: 1,
            scale: 1,
            duration: reduced ? dur.base : dur.enter,
            ease: ease.soft,
          },
          "-=0.45",
        );
      },
    });

    return () => {
      st.kill();
      gsap.killTweensOf([tile, frame]);
    };
  }, [index, reduced]);

  const onHover = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (reduced) return;
    gsap.to(e.currentTarget, {
      y: -4,
      rotation: e.currentTarget.dataset.side === "l" ? -1.4 : 1.4,
      duration: 0.35,
      ease: ease.soft,
    });
  };
  const onLeave = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (reduced) return;
    gsap.to(e.currentTarget, {
      y: 0,
      rotation: 0,
      duration: 0.45,
      ease: ease.float,
    });
  };

  return (
    <button
      ref={tileRef}
      type="button"
      onClick={onOpen}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      data-side={index % 2 === 0 ? "l" : "r"}
      aria-label={`Buka foto ${alt}`}
      style={{
        position: "relative",
        gridColumn: span === 2 ? "span 2" : "auto",
        aspectRatio: span === 2 ? "16 / 9" : "3 / 4",
        background: "var(--cream)",
        border: 0,
        padding: 0,
        borderRadius: 10,
        overflow: "hidden",
        cursor: "zoom-in",
        boxShadow: "var(--shadow-sm)",
        willChange: "transform",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={
          span === 2
            ? "(max-width: 480px) 100vw, 480px"
            : "(max-width: 480px) 50vw, 240px"
        }
        loading="lazy"
        style={{ objectFit: "cover" }}
      />
      {/* Soft scrapbook frame overlay (docs/12 §illustrations: scale-in,
       *  diam setelahnya — foto di dalamnya yang hidup). */}
      <div
        ref={frameRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <Image
          src={FRAME_PNG}
          alt=""
          width={400}
          height={400}
          sizes="240px"
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </button>
  );
}

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

function Lightbox({ src, alt, onClose }: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const { reduced } = useMotion();
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      lastFocusRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const overlay = overlayRef.current;
    const image = imageRef.current;
    if (!overlay || !image) return;
    gsap.fromTo(
      overlay,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: reduced ? dur.base : dur.enter, ease: ease.soft },
    );
    gsap.fromTo(
      image,
      { autoAlpha: 0, scale: 0.96 },
      { autoAlpha: 1, scale: 1, duration: reduced ? dur.base : dur.enter, ease: ease.settle },
    );
  }, [reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Foto: ${alt}`}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(74, 64, 57, 0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 44,
          height: 44,
          borderRadius: 999,
          background: "rgba(251, 247, 240, 0.9)",
          color: "var(--ink)",
          border: 0,
          fontSize: 22,
          lineHeight: 1,
          cursor: "pointer",
        }}
      >
        ×
      </button>
      <div
        ref={imageRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(100%, 720px)",
          maxHeight: "90vh",
          aspectRatio: "3 / 4",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 720px) 100vw, 720px"
          style={{ objectFit: "contain", background: "var(--ivory)" }}
          priority
        />
      </div>
    </div>
  );
}

export default function Gallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { reduced } = useMotion();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const open = useCallback((i: number) => setActiveIdx(i), []);
  const close = useCallback(() => setActiveIdx(null), []);

  // Stagger the tile entrance in concert with the section-level ScrollTrigger
  // so the "scatter-in" feels coordinated across the wall.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = sectionRef.current;
    if (!root) return;
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top 80%",
      once: true,
    });
    return () => {
      st.kill();
    };
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="section cv-auto"
      aria-label="Galeri kenangan"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <FloralCorner side="tl" size={150} seed="gallery" />
      <FloralCorner side="br" size={150} seed="gallery" />

      <div
        className="container-narrow"
        style={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        <Reveal as="h2" className="t-h1" seed="gallery-title">
          <Breathing seed="gallery-title" as="span" style={{ display: "inline-block" }}>
            <span style={{ color: "var(--ink)" }}>{copy.gallery.title}</span>
          </Breathing>
        </Reveal>
        <Reveal as="p" className="t-body" seed="gallery-body">
          <span
            style={{
              display: "block",
              margin: "8px auto 24px",
              maxWidth: 360,
              color: "var(--ink-soft)",
              lineHeight: 1.7,
            }}
          >
            {copy.gallery.body}
          </span>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(8px, 2vw, 14px)",
            margin: "0 auto",
            maxWidth: 520,
          }}
        >
          {PHOTOS.map((p, i) => (
            <Tile
              key={p.id}
              src={p.src}
              alt={p.alt}
              span={p.span}
              index={i}
              reduced={reduced}
              onOpen={() => open(i)}
            />
          ))}
        </div>
      </div>

      {activeIdx !== null ? (
        <Lightbox
          src={PHOTOS[activeIdx].src}
          alt={PHOTOS[activeIdx].alt}
          onClose={close}
        />
      ) : null}
    </section>
  );
}

function pickRange(
  rng: () => number,
  min: number,
  max: number,
): number {
  return min + rng() * (max - min);
}
