#!/usr/bin/env node
/**
 * Plan 02 remediation: promote keepers from relevant/ into nikah-web/assets/,
 * compressing dense scenes, renaming the couple cutout, cropping floral-corner-br,
 * and harmonizing gallery photos. Never touches public/assets (copy-assets mirrors).
 *
 * Idempotent — safe to re-run; overwrites destinations.
 */
import { existsSync } from "node:fs";
import { copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const REL = path.resolve(here, "..", "..", "relevant");
const OUT = path.resolve(here, "..", "assets");

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

const ensure = async (p) => mkdir(path.dirname(p), { recursive: true });

const copy = async (src, dest) => {
  await ensure(dest);
  await copyFile(src, dest);
  const s = await stat(dest);
  console.log(`copy     ${path.relative(OUT, dest).padEnd(46)} ${kb(s.size)}`);
};

/**
 * Re-encode WebP with a byte ceiling: walk quality down (and width once) until
 * the file fits targetKB. Never upscales; preserves alpha when present.
 */
const compress = async (src, dest, { width, targetKB, quality = 80 }) => {
  await ensure(dest);
  const meta = await sharp(src).metadata();
  const w = Math.min(width ?? meta.width, meta.width);
  let q = quality;
  let buf;
  for (let attempt = 0; attempt < 5; attempt++) {
    buf = await sharp(src)
      .rotate() // respect EXIF orientation
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: q, effort: 5 })
      .toBuffer();
    if (buf.length / 1024 <= targetKB) break;
    q -= 7;
    if (q < 45) break;
  }
  await sharp(buf).toFile(dest);
  console.log(`compress ${path.relative(OUT, dest).padEnd(46)} ${kb(buf.length)} (q${q}, ${w}w)`);
};

/** Gallery photos: downscale, gentle warm harmonize (≤0.35 per plan), WebP. */
const gallery = async (src, dest) => {
  await ensure(dest);
  const buf = await sharp(src)
    .rotate()
    .resize({ width: 1080, withoutEnlargement: true })
    .modulate({ brightness: 1.02, saturation: 0.92 })
    .tint({ r: 255, g: 246, b: 234 }) // soft ivory warmth; tint blends at low strength
    .webp({ quality: 74, effort: 5 })
    .toBuffer();
  await sharp(buf).toFile(dest);
  console.log(`gallery  ${path.relative(OUT, dest).padEnd(46)} ${kb(buf.length)}`);
};

const main = async () => {
  // ---- 01 hero / scenes / video -------------------------------------------
  await copy(`${REL}/01-hero-scenes-video/hero-main.webp`, `${OUT}/scenes/hero-main.webp`);
  await copy(`${REL}/01-hero-scenes-video/hero-bg-loop.mp4`, `${OUT}/video/hero-bg-loop.mp4`);
  await copy(`${REL}/01-hero-scenes-video/hero-bg-loop-poster.jpg`, `${OUT}/video/hero-bg-loop-poster.jpg`);
  await copy(`${REL}/01-hero-scenes-video/countdown-bg.webp`, `${OUT}/scenes/countdown-bg.webp`);
  await compress(`${REL}/01-hero-scenes-video/hero-bg.webp`, `${OUT}/scenes/meadow-bg.webp`, {
    width: 1600,
    targetKB: 400,
  });

  // ---- 02 cats -------------------------------------------------------------
  for (const cat of ["shiro", "moju", "simba", "meng", "jiro", "kimho", "hoshi"]) {
    await copy(`${REL}/02-cats/cat-${cat}.png`, `${OUT}/cats/cat-${cat}.png`);
  }

  // ---- 03 couple (rename + gallery) ---------------------------------------
  await copy(`${REL}/03-couple/couple-cutoutt.png`, `${OUT}/couple/couple-cutout.png`);
  await gallery(`${REL}/03-couple/couple-standing-smiling.jpg`, `${OUT}/gallery/couple-standing-smiling.webp`);
  await gallery(`${REL}/03-couple/couple-overhead-romantic-pose.jpeg`, `${OUT}/gallery/couple-overhead-romantic.webp`);
  await gallery(`${REL}/03-couple/couple-overhead-bride-bouquet.jpeg`, `${OUT}/gallery/couple-overhead-bouquet.webp`);
  await gallery(`${REL}/03-couple/couple-overhead-groom-above.jpeg`, `${OUT}/gallery/couple-overhead-playful.webp`);

  // ---- 04 story ------------------------------------------------------------
  await compress(`${REL}/04-story/story-ch01-meeting.webp`, `${OUT}/illustrations/story/story-ch01-meeting.webp`, {
    width: 1600,
    targetKB: 350,
  });
  for (const [file, target] of [
    ["story-ch02-rides", 350],
    ["story-ch03-jakarta", 350],
    ["story-ch05-keio", 350],
    ["story-ch06-married", 350],
  ]) {
    await compress(`${REL}/04-story/${file}.webp`, `${OUT}/illustrations/story/${file}.webp`, {
      targetKB: target,
    });
  }
  // Prefer gpt-image-2 edit (v2: Tokyo Tower + sakura) when present; else original.
  {
    const v2 = `${REL}/04-story/story-ch04-ldr-tokyo-v2.webp`;
    const v1 = `${REL}/04-story/story-ch04-ldr-tokyo.webp`;
    const ch04Src = existsSync(v2) ? v2 : v1;
    await compress(ch04Src, `${OUT}/illustrations/story/story-ch04-ldr-tokyo.webp`, {
      targetKB: 350,
    });
    console.log(`ch04 source → ${ch04Src.includes("-v2") ? "v2 (edited)" : "v1 (original)"}`);
  }

  // ---- 05 gate / loading / welcome ----------------------------------------
  await compress(`${REL}/05-gate-loading-welcome/loading-sleeping-cat.webp`, `${OUT}/illustrations/loading-sleeping-cat.webp`, {
    width: 1000,
    targetKB: 250,
  });
  await copy(`${REL}/05-gate-loading-welcome/gate-floral-border.webp`, `${OUT}/illustrations/gate-floral-border.webp`);
  await compress(`${REL}/05-gate-loading-welcome/gate-monogram-frame.webp`, `${OUT}/illustrations/gate-monogram-frame.webp`, {
    width: 1000,
    targetKB: 250,
  });
  await compress(`${REL}/05-gate-loading-welcome/welcome-dove-floral.webp`, `${OUT}/illustrations/welcome-dove-floral.webp`, {
    width: 1200,
    targetKB: 250,
  });

  // ---- 06 countdown / japan / event ---------------------------------------
  await copy(`${REL}/06-countdown-japan-event/countdown-floral-band.webp`, `${OUT}/illustrations/countdown-floral-band.webp`);
  await compress(`${REL}/06-countdown-japan-event/japan-sakura-campus.webp`, `${OUT}/illustrations/japan-sakura-campus.webp`, {
    targetKB: 350,
  });
  await copy(`${REL}/06-countdown-japan-event/japan-petal-accent.webp`, `${OUT}/florals/japan-petal-accent.webp`);
  await copy(`${REL}/06-countdown-japan-event/event-arch-frame.webp`, `${OUT}/illustrations/event-arch-frame.webp`);
  await compress(`${REL}/06-countdown-japan-event/event-venue-icon.webp`, `${OUT}/illustrations/event-venue-icon.webp`, {
    width: 256,
    targetKB: 40,
  });

  // ---- 07 rsvp / wishes / gift / closing ----------------------------------
  await copy(`${REL}/07-rsvp-wishes-gift-closing/rsvp-card-corner.webp`, `${OUT}/florals/rsvp-card-corner.webp`);
  await copy(`${REL}/07-rsvp-wishes-gift-closing/wishes-washi-tape.webp`, `${OUT}/florals/wishes-washi-tape.webp`);
  await compress(`${REL}/07-rsvp-wishes-gift-closing/gift-envelope-icon.webp`, `${OUT}/illustrations/gift-envelope-icon.webp`, {
    width: 512,
    targetKB: 80,
  });
  await compress(`${REL}/07-rsvp-wishes-gift-closing/closing-couple-and-cats.webp`, `${OUT}/scenes/closing-couple-and-cats.webp`, {
    targetKB: 400,
  });
  await copy(`${REL}/07-rsvp-wishes-gift-closing/closing-echo.webp`, `${OUT}/scenes/closing-echo.webp`);
  await copy(`${REL}/07-rsvp-wishes-gift-closing/closing-hoshi-peek.webp`, `${OUT}/illustrations/closing-hoshi-peek.webp`);

  // ---- 08 dividers / florals / accents ------------------------------------
  for (const f of [
    "drapery-divider",
    "floral-corner-tl",
    "floral-sprig",
    "accent-doves",
    "accent-butterflies",
    "accent-petals-scatter",
  ]) {
    await copy(`${REL}/08-dividers-florals-accents/${f}.webp`, `${OUT}/florals/${f}.webp`);
  }

  // floral-corner-br: source is a two-corner diagonal frame — extract the
  // bottom-right cluster only so it mirrors floral-corner-tl.
  {
    const src = `${REL}/08-dividers-florals-accents/floral-corner-br.webp`;
    const dest = `${OUT}/florals/floral-corner-br.webp`;
    await ensure(dest);
    const meta = await sharp(src).metadata();
    const left = Math.round(meta.width * 0.36);
    const top = Math.round(meta.height * 0.36);
    const cropped = await sharp(src)
      .extract({ left, top, width: meta.width - left, height: meta.height - top })
      .png()
      .toBuffer();
    const buf = await sharp(cropped)
      .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 12 })
      .webp({ quality: 82, effort: 5 })
      .toBuffer();
    await sharp(buf).toFile(dest);
    const m2 = await sharp(buf).metadata();
    console.log(`crop     florals/floral-corner-br.webp`.padEnd(55) + ` ${kb(buf.length)} (${m2.width}x${m2.height})`);
  }

  // Music icons intentionally NOT promoted — opaque tiles; the site uses an
  // inline SVG note icon instead (documented delta in plans/DELTA.md).

  // ---- 09 audio ------------------------------------------------------------
  await copy(`${REL}/09-references-audio/audio/la-vie-en-rose.mp3`, `${OUT}/audio/la-vie-en-rose.mp3`);

  console.log("\nDone. Now run: npm run copy-assets");
};

main().catch((err) => {
  console.error("[remediate-assets] failed:", err);
  process.exitCode = 1;
});
