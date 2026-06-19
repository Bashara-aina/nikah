"use client";

/**
 * MotionPreview — Stage 2 verification harness.
 * Renders 5 dummy boxes each wrapped in a different primitive so we can
 * eyeball entrance + idle + reduced-motion behavior in dev.
 * Hidden by default; shown only when `?debug=motion` is set.
 */

import Breathing from "@/components/primitives/Breathing";
import Sway from "@/components/primitives/Sway";
import FloatLoop from "@/components/primitives/FloatLoop";
import Stagger from "@/components/primitives/Stagger";
import Reveal from "@/components/primitives/Reveal";

export default function MotionPreview() {
  if (typeof window === "undefined") return null;
  if (
    new URLSearchParams(window.location.search).get("debug") !== "motion"
  ) {
    return null;
  }

  const boxStyle: React.CSSProperties = {
    width: 80,
    height: 80,
    background: "var(--blush)",
    borderRadius: 12,
    margin: "12px auto",
  };

  return (
    <section
      style={{
        background: "var(--cream)",
        padding: "48px 16px",
        textAlign: "center",
      }}
    >
      <h2 className="t-h2" style={{ marginBottom: 24 }}>
        Motion Preview
      </h2>
      <Reveal>
        <div style={boxStyle}>reveal</div>
      </Reveal>
      <Breathing seed="bp">
        <div style={{ ...boxStyle, background: "var(--peach)" }}>breath</div>
      </Breathing>
      <Sway seed="sw">
        <div style={{ ...boxStyle, background: "var(--sage)" }}>sway</div>
      </Sway>
      <FloatLoop seed="fl">
        <div style={{ ...boxStyle, background: "var(--dusty)" }}>float</div>
      </FloatLoop>
      <Stagger gap={0.1}>
        <div style={{ ...boxStyle, background: "var(--sky)" }}>s1</div>
        <div style={{ ...boxStyle, background: "var(--sky)" }}>s2</div>
        <div style={{ ...boxStyle, background: "var(--sky)" }}>s3</div>
      </Stagger>
    </section>
  );
}