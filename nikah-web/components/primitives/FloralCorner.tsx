"use client";

/**
 * FloralCorner — absolute-positioned floral cluster that sways.
 * Per docs/12 §florals: idle sway rotate ±1.2° pivot at corner, 7s phase.
 * Honor REDUCED/LOW → static.
 *
 * Uses floral-corner-tl/br PNGs; TR/BL mirror via inner wrapper so GSAP
 * rotation does not clobber CSS scale transforms.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ease } from "@/lib/motionTokens";
import { useMotion } from "@/components/motion/MotionContext";
import { hashString, mulberry32 } from "@/lib/seed";

export type CornerSide = "tl" | "tr" | "bl" | "br";

interface FloralCornerProps {
  side: CornerSide;
  /** Box size — px number or CSS length (e.g. clamp()). */
  size?: number | string;
  seed?: string;
  /** How far the cluster bleeds past the section edge (px). */
  bleed?: number;
  priority?: boolean;
  zIndex?: number;
}

const TRANSFORM_ORIGIN: Record<CornerSide, string> = {
  tl: "0% 0%",
  tr: "100% 0%",
  bl: "0% 100%",
  br: "100% 100%",
};

const MIRROR: Record<CornerSide, string | undefined> = {
  tl: undefined,
  tr: "scaleX(-1)",
  bl: "scaleY(-1)",
  br: "scale(-1, -1)",
};

export default function FloralCorner({
  side,
  size = "clamp(120px, 30vw, 180px)",
  seed = "floral-corner",
  bleed = 16,
  priority = false,
  zIndex = 2,
}: FloralCornerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { tier } = useMotion();
  const src =
    side === "tl" || side === "tr"
      ? "/assets/florals/floral-corner-tl.png"
      : "/assets/florals/floral-corner-br.png";

  const sizeCss = typeof size === "number" ? `${size}px` : size;
  const intrinsic = typeof size === "number" ? size : 360;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    if (tier === "REDUCED" || tier === "LOW") return;

    const rng = mulberry32(hashString(`${seed}-${side}`));
    const deg = rng() > 0.5 ? 1.2 : -1.2;

    const tween = gsap.to(el, {
      rotation: deg,
      duration: 7,
      ease: ease.float,
      yoyo: true,
      repeat: -1,
      transformOrigin: TRANSFORM_ORIGIN[side],
      delay: -rng() * 2,
    });
    return () => {
      tween.kill();
    };
  }, [tier, side, seed]);

  const anchor: React.CSSProperties = (() => {
    switch (side) {
      case "tl":
        return { top: -bleed, left: -bleed };
      case "tr":
        return { top: -bleed, right: -bleed };
      case "bl":
        return { bottom: -bleed, left: -bleed };
      case "br":
        return { bottom: -bleed, right: -bleed };
    }
  })();

  const mirror = MIRROR[side];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        width: sizeCss,
        height: sizeCss,
        pointerEvents: "none",
        zIndex,
        ...anchor,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: mirror,
        }}
      >
        <Image
          src={src}
          alt=""
          width={intrinsic}
          height={intrinsic}
          sizes={typeof size === "number" ? `${size}px` : "30vw"}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
