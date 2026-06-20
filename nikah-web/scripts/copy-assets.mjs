#!/usr/bin/env node
/**
 * Build /public/assets from the curated "correct" source art.
 *
 * Sources (the ONLY allowed art folders):
 *   - Recovered/scenes/                      → hero-main + world backdrops
 *   - Recovered/correct/most correct/        → numbered watercolour set
 *   - Recovered/correct/most correct/png asset website 2/  → cutouts subset
 *
 * Filenames in the source set are NOT semantically reliable, so every
 * mapping below was chosen by eye. Dest paths are the semantic names the
 * components import. Pure Node + a copy; no image processing needed
 * (next/image optimises at request time).
 */
import { promises as fs } from "node:fs";
import { existsSync } from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const pub = path.resolve(__dirname, "..", "public", "assets");

const SCN = path.join(repoRoot, "Recovered", "scenes");
const MC = path.join(repoRoot, "Recovered", "correct", "most correct");
const P = path.join(MC, "png asset website 2");

/** dest (under public/assets) → absolute source file. */
const MAP = {
  // ── Hero + world backdrops (opaque webp) ──────────────────────────
  "scene/hero-main.webp": `${SCN}/hero-main.webp`,
  "scene/hero-bg.webp": `${SCN}/hero-bg.webp`,
  "scene/section-bg-wash.webp": `${SCN}/section-bg-wash.webp`,
  "scene/section-wash.webp": `${SCN}/section-wash.webp`,
  "scene/countdown-bg.webp": `${SCN}/countdown-bg.webp`,

  // ── Section accents / icons ───────────────────────────────────────
  "scene/event-accent.png": `${P}/16.png`, // wedding arch
  "scene/gallery-frame.png": `${P}/1.png`, // polaroid frame
  "scene/gift-accent.png": `${P}/27.png`, // gift box
  "scene/japan-motif.png": `${P}/23.png`, // torii + sakura
  "scene/loading-motif.png": `${P}/18.png`, // cat in floral wreath
  "scene/map-pin.png": `${P}/25.png`, // house map pin

  "icons/cat-wreath-seal.png": `${P}/18.png`, // wax-seal motif (gate + submit)
  "icons/laptop-phone.png": `${P}/21.png`,
  "icons/gift.png": `${P}/27.png`,
  "icons/map-pin.png": `${P}/25.png`,

  // ── Couple ────────────────────────────────────────────────────────
  "couple/couple-illustration.png": `${P}/10.png`, // couple standing

  // ── Florals / dividers / cutouts ──────────────────────────────────
  "cutout/accent-doves.png": `${P}/15.png`, // doves flying
  "cutout/floral-corner-tl.png": `${P}/11.png`, // floral swag (corner)
  "cutout/floral-corner-br.png": `${P}/11.png`,
  "cutout/floral-sprig.png": `${P}/12.png`, // sage leaf sprig
  "cutout/welcome-accent.png": `${MC}/8.png`, // doves + heart

  "florals/garland-swag.png": `${MC}/7.png`,
  "florals/vine.png": `${MC}/6.png`,
  "florals/petal-scatter.png": `${MC}/19.png`,
  "florals/sakura.png": `${MC}/25.png`,
  "florals/leaf-sprig.png": `${P}/12.png`,
  "florals/garland-cat.png": `${MC}/34.png`, // sleeping cat in garland

  "dividers/drapery.png": `${MC}/18.png`,
  "dividers/dove-heart.png": `${MC}/8.png`,
  "dividers/paw.png": `${MC}/31.png`,
  "dividers/flower-line.png": `${MC}/10.png`,

  "frames/oval.png": `${P}/13.png`,
  "frames/arch.png": `${P}/16.png`,
  "frames/polaroid.png": `${P}/1.png`,

  "doves/flying.png": `${P}/15.png`,
  "doves/perched.png": `${P}/19.png`,
  "butterflies/pair.png": `${P}/17.png`,

  // ── Story illustrations (6 real chapters) ─────────────────────────
  "cutout/story-online.png": `${P}/21.png`, // laptop + phone + heart  (pertemuan)
  "cutout/story-motor.png": `${MC}/36.png`, // couple on vespa          (kedekatan)
  "cutout/story-together.png": `${P}/22.png`, // couple walking + cats  (jakarta)
  "cutout/story-ldr.png": `${MC}/cat-simba-with-dove.png`, // cat + dove (ldr)
  "cutout/story-keio.png": `${P}/10.png`, // couple standing           (keio)
  "cutout/story-menikah.png": `${P}/16.png`, // wedding arch            (menikah)

  // ── Cat lineup (Loading / Closing, config.cats order) ─────────────
  "cats/cat-peek.png": `${P}/8.png`, // tiny white kitten
  "cats/cat-tuxedo-black.png": `${MC}/cat-jiro-in-flowers.png`,
  "cats/cat-grey-white.png": `${MC}/cat-shiro-butterfly.png`,
  "cats/cat-tuxedo-bw.png": `${MC}/cat-meng-with-flowers.png`,
  "cats/cat-cream-longhair.png": `${MC}/cat-moju-sleeping-flowers.png`,
  "cats/cat-tabby-grey.png": `${MC}/cat-hoshi-kimho-playing.png`,
  "cats/cat-tabby-peaceful.png": `${MC}/cat-simba-with-dove.png`,
  "cats/cat-tabby-sleeping.png": `${MC}/34.png`,

  // ── Gallery (illustrated "memories", since no real photos allowed) ─
  "gallery/gallery-01.png": `${MC}/43.png`, // golden meadow cats
  "gallery/gallery-02.png": `${P}/22.png`, // couple walking
  "gallery/gallery-03.png": `${MC}/36.png`, // vespa
  "gallery/gallery-04.png": `${P}/23.png`, // japan
  "gallery/gallery-05.png": `${MC}/1.png`, // cats group
  "gallery/gallery-06.png": `${MC}/11.png`, // jiro in flowers
  "gallery/gallery-07.png": `${MC}/27.png`, // cats + doves
  "gallery/gallery-08.png": `${MC}/33.png`, // tabbies nose-touch
  "gallery/gallery-09.png": `${MC}/cat-moju-sleeping-flowers.png`,
};

async function main() {
  let ok = 0;
  const missing = [];
  for (const [dest, src] of Object.entries(MAP)) {
    if (!existsSync(src)) {
      missing.push(`${dest}  ←  ${path.relative(repoRoot, src)}`);
      continue;
    }
    const out = path.join(pub, dest);
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.copyFile(src, out);
    ok++;
  }
  console.log(`[copy-assets] ${ok}/${Object.keys(MAP).length} files -> public/assets`);
  if (missing.length) {
    console.warn(`[copy-assets] MISSING ${missing.length} source(s):`);
    missing.forEach((m) => console.warn("   " + m));
  }
}

main().catch((err) => {
  console.error("[copy-assets] failed:", err);
  process.exit(1);
});
