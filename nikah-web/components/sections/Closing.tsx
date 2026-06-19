"use client";

/**
 * Closing — emotional symmetry with Hero (docs/10 §12).
 * Mini-assemble: couple-cutout + a few cats + cat-peek.
 * cat-peek peeks; doves fly up; audio continues.
 */

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copy } from "@/lib/copy";
import { config } from "@/lib/config";
import { dur, ease, stagger as staggerToken } from "@/lib/motionTokens";
import { useMotion } from "@/components/motion/MotionContext";
import { hashString, mulberry32 } from "@/lib/seed";
import Breathing from "@/components/primitives/Breathing";

const CLOSING_CATS: readonly string[] = ["cat-jiro", "cat-meng", "cat-shiro"];

export default function Closing() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const coupleRef = useRef<HTMLDivElement | null>(null);
  const peekRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const dovesRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const catRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { tier, reduced } = useMotion();

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    const frame = frameRef.current;
    const peek = peekRef.current;
    if (!section || !frame || !peek) return;

    const positionPeek = () => {
      const sectionRect = section.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();
      const left = frameRect.left - sectionRect.left;
      const bottom = sectionRect.bottom - frameRect.bottom;
      peek.style.left = `${left}px`;
      peek.style.bottom = `${bottom}px`;
    };

    positionPeek();
    const ro = new ResizeObserver(positionPeek);
    ro.observe(section);
    window.addEventListener("resize", positionPeek);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", positionPeek);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    const couple = coupleRef.current;
    const peek = peekRef.current;
    const text = textRef.current;
    const doves = dovesRef.current;
    const cats = CLOSING_CATS.map((c) => catRefs.current[c]).filter(
      Boolean,
    ) as HTMLElement[];

    const all = [couple, ...cats, peek, text, doves].filter(
      Boolean,
    ) as HTMLElement[];

    if (tier === "REDUCED") {
      gsap.set(all, { autoAlpha: 0 });
      gsap.to(all, {
        autoAlpha: 1,
        duration: dur.base,
        ease: ease.soft,
        stagger: 0.05,
      });
      return undefined;
    }

    const tl = gsap.timeline({
      defaults: { ease: ease.enter },
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        once: true,
      },
      onComplete: () => {
        if (couple) {
          gsap.to(couple, {
            y: "+=3",
            scale: 1.01,
            duration: 6,
            ease: ease.float,
            yoyo: true,
            repeat: -1,
          });
        }
        cats.forEach((catEl, i) => {
          const rng = mulberry32(hashString(`closing-${i}`));
          const durS = 4 + rng() * 3;
          gsap.to(catEl, {
            y: `+=${2 + rng() * 2}`,
            scale: 1.01,
            duration: durS,
            ease: ease.float,
            yoyo: true,
            repeat: -1,
            delay: -rng() * durS,
          });
        });
        if (peek) {
          // peek: slide in from bottom + occasionally peek
          const peekTl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
          peekTl
            .fromTo(
              peek,
              { y: 80, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.6, ease: ease.settle },
            )
            .to(peek, {
              y: -10,
              duration: 1.6,
              ease: ease.float,
              yoyo: true,
              repeat: 1,
            })
            .to(peek, { y: 80, autoAlpha: 0, duration: 0.6, ease: ease.soft }, "+=2");
        }
        if (doves) {
          gsap.to(doves, {
            y: -window.innerHeight * 0.9,
            autoAlpha: 0,
            duration: 8,
            ease: ease.soft,
            repeat: -1,
            repeatDelay: 0.4,
          });
        }
      },
    });

    if (couple) {
      tl.from(
        couple,
        { autoAlpha: 0, y: 30, scale: 0.96, duration: 0.9, ease: ease.settle },
        0,
      );
    }
    if (cats.length > 0) {
      tl.from(
        cats,
        {
          autoAlpha: 0,
          y: 20,
          scale: 0.92,
          duration: 0.7,
          ease: ease.settle,
          stagger: staggerToken.base,
        },
        "-=0.6",
      );
    }
    if (peek) {
      tl.from(
        peek,
        { autoAlpha: 0, y: 60, duration: 0.6, ease: ease.settle },
        "-=0.3",
      );
    }
    if (text) {
      const lines = text.querySelectorAll<HTMLElement>("[data-closing-line]");
      tl.from(
        lines,
        { autoAlpha: 0, y: 12, duration: 0.6, stagger: staggerToken.base },
        "-=0.4",
      );
    }
    if (doves) {
      tl.from(
        doves,
        { autoAlpha: 0, y: 30, duration: 0.6, ease: ease.enter },
        "-=0.4",
      );
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll()
        .filter((s) => s.trigger === section)
        .forEach((s) => s.kill());
      gsap.killTweensOf(all);
    };
  }, [tier, reduced]);

  return (
    <section
      id="closing"
      ref={sectionRef}
      className="section cv-auto"
      aria-label="Pesan penutup"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        style={{
          position: "relative",
          width: "min(100%, 360px)",
          margin: "0 auto",
        }}
      >
        <div ref={frameRef} style={{ position: "relative", aspectRatio: "4 / 5" }}>
          <div
            ref={coupleRef}
            style={{
              position: "absolute",
              left: "22%",
              top: "20%",
              width: "56%",
              zIndex: 2,
              willChange: "transform",
            }}
          >
            <Image
              src="/assets/couple/couple-cutout.png"
              alt="Bashara dan Hanifah"
              width={400}
              height={500}
              loading="lazy"
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          {CLOSING_CATS.map((c, i) => (
            <div
              key={c}
              ref={(el) => {
                catRefs.current[c] = el;
              }}
              style={{
                position: "absolute",
                left: `${15 + i * 24}%`,
                top: `${62 + (i % 2) * 8}%`,
                width: "18%",
                zIndex: 3,
                willChange: "transform",
              }}
            >
              <Breathing seed={`closing-${c}`} as="div">
                <Image
                  src={`/assets/cats/${c}.png`}
                  alt={c}
                  width={120}
                  height={120}
                  loading="lazy"
                  style={{ width: "100%", height: "auto" }}
                />
              </Breathing>
            </div>
          ))}

          <div
            ref={dovesRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "30%",
              top: "8%",
              width: "20%",
              zIndex: 5,
              willChange: "transform, opacity",
            }}
          >
            <Image
              src="/assets/florals/accent-doves.png"
              alt=""
              width={120}
              height={80}
              loading="lazy"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>

        <div
          ref={textRef}
          style={{
            position: "relative",
            zIndex: 6,
            padding: "0 16px",
            textAlign: "center",
            marginTop: 12,
            color: "var(--ink)",
          }}
        >
          <div
            data-closing-line
            style={{
              width: "min(70%, 220px)",
              margin: "0 auto 8px",
            }}
          >
            <Image
              src="/assets/illustrations/story-growing.png"
              alt="Bashara, Hanifah, dan kucing-kucing mereka"
              width={320}
              height={200}
              loading="lazy"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <p
            data-closing-line
            className="t-body"
            style={{ margin: 0, color: "var(--ink-soft)" }}
          >
            {copy.closing.title}
          </p>
          <p
            data-closing-line
            className="t-body"
            style={{ margin: "8px 0 16px", color: "var(--ink-soft)" }}
          >
            {copy.closing.body}
          </p>
          <p
            data-closing-line
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: "1.1rem",
              color: "var(--ink)",
              margin: "16px 0",
            }}
          >
            {copy.closing.bold}
          </p>
          <p
            data-closing-line
            className="t-display"
            style={{ margin: "16px 0 8px", color: "var(--ink)" }}
          >
            {copy.closing.couple}
          </p>
          <p
            data-closing-line
            style={{
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.12em",
              color: "var(--ink-soft)",
              margin: 0,
            }}
          >
            {copy.closing.hashtag}
          </p>
        </div>
      </div>
      <div
        style={{
          marginTop: 24,
          textAlign: "center",
          fontSize: "0.85rem",
          color: "var(--ink-soft)",
        }}
      >
        <span aria-hidden="true">— {config.couple.hashtag} —</span>
      </div>
      <div
        ref={peekRef}
        aria-hidden="true"
        className="closing-peek"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "14vw",
          maxWidth: "14%",
          aspectRatio: "331 / 397",
          zIndex: 4,
          willChange: "transform",
        }}
      >
        <Image
          src="/assets/cats/cat-peek.png"
          alt=""
          width={331}
          height={397}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "bottom",
            display: "block",
          }}
        />
      </div>
    </section>
  );
}
