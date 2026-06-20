"use client";

/**
 * Divider — soft section transition.
 * Uses the clean floral-sprig.png (delicate greenery + blossoms). The drapery
 * asset shipped with a baked checkerboard background, so it is not used here.
 * Native aspect ratio 906×266 ≈ 3.4:1.
 */

import Image from "next/image";

export default function Divider() {
  return (
    <div
      className="relative mx-auto"
      style={{
        width: "min(72%, 320px)",
        padding: "10px 0",
        opacity: 0.9,
      }}
      aria-hidden="true"
    >
      <Image
        src="/assets/cutout/floral-sprig.png"
        alt=""
        width={906}
        height={266}
        sizes="(max-width: 360px) 72vw, 320px"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}
