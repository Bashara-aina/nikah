"use client";

/**
 * Hero — signature moment.
 * COHESIVE, FRAMED approach: the blended artwork (hero-main.webp = the main
 * composition) is shown WHOLE as a soft card so every element stays perfectly
 * arranged and grounded — never torn into separate floating cutouts. Names sit
 * above the card and the date below it (on ivory), so text never covers the art.
 * Life: gentle reveal, slow Ken-Burns inside the card, floating doves/butterflies/
 * petals over the whole scene, and a light tilt/scroll parallax. docs/09 (revised).
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ease, stagger } from "@/lib/motionTokens";
import { copy } from "@/lib/copy";
import { useMotion } from "@/components/motion/MotionContext";
import Particles from "@/components/motion/Particles";
import Doves from "@/components/hero/Doves";
import Butterflies from "@/components/hero/Butterflies";

export default function Hero() {
  const { tier, gyro } = useMotion();
  const gyroRef = useRef(gyro);
  useEffect(() => {
    gyroRef.current = gyro;
  }, [gyro]);

  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null); // tilt/scroll translate
  const kenburnsRef = useRef<HTMLDivElement | null>(null); // slow scale/breathe
  const ambientRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const botRef = useRef<HTMLDivElement | null>(null);

  // ENTRANCE + IDLE
  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    const card = cardRef.current;
    const kb = kenburnsRef.current;
    if (!section || !card || !kb) return;

    const lines: HTMLElement[] = [
      ...(topRef.current
        ? Array.from(topRef.current.querySelectorAll<HTMLElement>("[data-hero-line]"))
        : []),
      ...(botRef.current
        ? Array.from(botRef.current.querySelectorAll<HTMLElement>("[data-hero-line]"))
        : []),
    ];

    const ctx = gsap.context(() => {
      if (tier === "REDUCED") {
        gsap.fromTo(
          [card, ...lines],
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.7, ease: ease.soft, stagger: 0.06 },
        );
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: ease.enter },
        onComplete: () => startIdle(),
      });
      tl.fromTo(
        card,
        { autoAlpha: 0, y: 26, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.0, ease: ease.settle },
        0,
      ).fromTo(
        kb,
        { scale: 1.1 },
        { scale: 1, duration: 1.3, ease: ease.soft },
        0,
      );
      if (lines.length) {
        tl.fromTo(
          lines,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: stagger.base },
          "-=0.6",
        );
      }

      function startIdle(): void {
        if (tier === "LOW") return;
        gsap.to(kb, {
          scale: 1.05,
          duration: 20,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }, section);

    return () => ctx.revert();
  }, [tier]);

  // TILT + SCROLL PARALLAX — gentle on the card, a touch more on the ambient layer.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (tier === "REDUCED" || tier === "LOW") return;
    const section = sectionRef.current;
    const card = cardRef.current;
    const ambient = ambientRef.current;
    if (!section || !card) return;

    let raf = 0;
    let prog = 0;
    let active = true;

    const render = (): void => {
      const g = gyroRef.current;
      card.style.transform = `translate3d(${g.x * 6}px, ${prog * 12 + g.y * 6}px, 0)`;
      if (ambient) {
        ambient.style.transform = `translate3d(${g.x * 16}px, ${prog * 24 + g.y * 16}px, 0)`;
      }
      raf = active ? requestAnimationFrame(render) : 0;
    };

    card.style.willChange = "transform";
    if (ambient) ambient.style.willChange = "transform";
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        prog = self.progress * 2 - 1;
      },
      onToggle: (self) => {
        active = self.isActive;
        if (active && raf === 0) raf = requestAnimationFrame(render);
      },
    });
    raf = requestAnimationFrame(render);

    return () => {
      active = false;
      st.kill();
      if (raf) cancelAnimationFrame(raf);
      card.style.transform = "";
      card.style.willChange = "";
      if (ambient) {
        ambient.style.transform = "";
        ambient.style.willChange = "";
      }
    };
  }, [tier]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Hero: Bashara dan Hanifah"
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        background: "var(--ivory)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(14px, 3vh, 26px)",
        padding: "max(4vh, 24px) 16px",
      }}
    >
      {/* Ambient floaters over the whole hero (margins + card) — these are meant to float */}
      <div
        ref={ambientRef}
        aria-hidden
        style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
      >
        <Particles />
        <Doves />
        <Butterflies />
      </div>

      {/* Names — above the art */}
      <div ref={topRef} style={{ position: "relative", zIndex: 3, textAlign: "center" }}>
        <div
          data-hero-line
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.78rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink-soft)",
            marginBottom: 8,
          }}
        >
          {copy.hero.eyebrow}
        </div>
        <h1
          data-hero-line
          className="t-display"
          style={{ margin: 0, color: "var(--ink)", lineHeight: 1.08, fontWeight: 500 }}
        >
          {copy.hero.groom}
          <span
            style={{
              display: "block",
              fontSize: "0.5em",
              color: "var(--dusty)",
              margin: "2px 0",
            }}
          >
            {copy.hero.ampersand}
          </span>
          {copy.hero.bride}
        </h1>
      </div>

      {/* The blended artwork, shown WHOLE as a soft card */}
      <div
        ref={cardRef}
        style={{
          position: "relative",
          zIndex: 2,
          width: "min(86%, 380px)",
          aspectRatio: "4 / 5",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 16px 40px rgba(120,90,70,.16)",
        }}
      >
        <div
          ref={kenburnsRef}
          style={{ position: "absolute", inset: 0, transformOrigin: "center 45%" }}
        >
          <Image
            src="/assets/scene/hero-main.webp"
            alt="Ilustrasi Bashara dan Hanifah bersama kucing-kucing mereka di padang bunga"
            fill
            sizes="(max-width: 420px) 86vw, 380px"
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Date + hashtag — below the art */}
      <div ref={botRef} style={{ position: "relative", zIndex: 3, textAlign: "center" }}>
        <div
          data-hero-line
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.05rem",
            letterSpacing: "0.16em",
            color: "var(--ink)",
          }}
        >
          {copy.hero.dateLine}
        </div>
        <div
          data-hero-line
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.78rem",
            letterSpacing: "0.06em",
            color: "var(--dusty)",
            marginTop: 8,
          }}
        >
          {copy.hero.hashtag}
        </div>
      </div>
    </section>
  );
}
