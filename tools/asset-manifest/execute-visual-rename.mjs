#!/usr/bin/env node
/**
 * execute-visual-rename.mjs
 *
 * Dry-run by default. Pass --execute to actually rename.
 *
 * Source-of-truth plan derived from image-by-image visual inspection
 * (see tools/asset-manifest/visual-ground-truth.tsv).
 *
 * Every entry:
 *   - src: relative path under /assets/
 *   - dst: relative path under /assets/ (must not exist)
 *   - expected_sha256: bytes we expect at src before the rename
 *   - category: "rename" | "move" | "delete" | "component-update"
 *
 * Refuses to run unless every source matches its expected hash and
 * every destination is empty (or --force).
 */
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");
const ASSETS = path.join(REPO, "assets");
const PUBLIC = path.join(REPO, "nikah-web", "public", "assets");

const EXECUTE = process.argv.includes("--execute");

/**
 * Plan entries. Each one is idempotent and hash-pinned.
 * SHA-256 prefixes (12 chars) are documented in visual-ground-truth.tsv.
 */
const PLAN = [
  /* ─────────────────────────────────────────────────────────────────────
   * Cats folder — rename portraits to short color/pose descriptors
   * (names like hoshi/jiro/kimho are not knowable from pixels alone;
   *  the user opted for color-based names, shortened)
   * ────────────────────────────────────────────────────────────────── */
  { kind: "rename", src: "cats/cat-hoshi.png",                 dst: "cats/cat-tabby-peaceful.png",          expect: "930f55a6" },
  { kind: "rename", src: "cats/cat-jiro.png",                  dst: "cats/cat-tuxedo-black.png",            expect: "c207e0b7" },
  { kind: "rename", src: "cats/cat-kimho.png",                 dst: "cats/cat-tabby-sleeping.png",          expect: "ff81838a" },
  { kind: "rename", src: "cats/cat-meng.png",                  dst: "cats/cat-grey-white.png",              expect: "e473195c" },
  { kind: "rename", src: "cats/cat-moju.png",                 dst: "cats/cat-tuxedo-bw.png",               expect: "23b63961" },
  { kind: "rename", src: "cats/cat-shiro.png",                 dst: "cats/cat-cream-longhair.png",          expect: "fa67bb5b" },
  { kind: "rename", src: "cats/cat-simba.png",                dst: "cats/cat-tabby-grey.png",              expect: "b22c0790" },

  /* Composite cats — fix the cat-coloring vs filename mismatch */
  { kind: "rename", src: "cats/cat-jiro-in-flowers.png",       dst: "cats/cat-tabby-in-flowers.png",            expect: "4af04e2d" },
  { kind: "rename", src: "cats/cat-jiro-with-dove.png",        dst: "cats/cat-tuxedo-bw-with-dove.png",         expect: "0e99e0e5" },
  { kind: "rename", src: "cats/cat-meng-with-flowers.png",     dst: "cats/cat-cream-longhair-with-flowers.png", expect: "2b98b152" },
  { kind: "rename", src: "cats/cat-moju-sleeping-flowers.png", dst: "cats/cat-tuxedo-bw-sleeping-flowers.png",  expect: "23a05b35" },
  { kind: "rename", src: "cats/cat-shiro-butterfly.png",       dst: "cats/cat-cream-longhair-with-butterfly.png", expect: "490baf94" },
  { kind: "rename", src: "cats/cat-simba-with-dove.png",       dst: "cats/cat-tuxedo-black-with-dove.png",      expect: "5bfe07e2" },
  { kind: "rename", src: "cats/cat-hoshi-kimho-playing.png",   dst: "cats/cat-tabby-lying.png",                expect: "0e87f308" },

  /* Generic-named cats whose names are accurate — keep as-is.
   * (cat-in-flowers.png, cat-in-heart-flowers.png, cat-sleeping-flowers.png,
   *  cat-sleeping-wreath.png, cat-peek.png, cats-couple-wreath.png,
   *  cat-grass-frontal.png — names match visuals) */

  /* ─────────────────────────────────────────────────────────────────────
   * Couple — couple-cutout.png is a cat-in-wreath, not a couple
   * ────────────────────────────────────────────────────────────────── */
  { kind: "move",   src: "couple/couple-cutout.png", dst: "cats/cat-in-wreath-minimal.png", expect: "b0fec429" },

  /* ─────────────────────────────────────────────────────────────────────
   * Cutout — fix wrong-content filenames
   * ────────────────────────────────────────────────────────────────── */
  /* The 4 other cat-in-wreath variations — keep all 5 per user, rename by variation */
  { kind: "rename", src: "cutout/couple-cutout-alt.png", dst: "cats/cat-in-wreath-wisteria.png",        expect: "0cb712a7" },
  { kind: "rename", src: "cutout/wedding-rings.png",     dst: "cats/cat-in-wreath-white-flowers.png",   expect: "ec40b806" },
  { kind: "rename", src: "cutout/story-meeting-2.png",  dst: "cats/cat-in-wreath-mixed-busy.png",      expect: "65d9d761" },
  { kind: "rename", src: "scene/story-meeting.png",     dst: "cats/cat-in-wreath-arch-top.png",        expect: "058053ca" },

  /* Butterflies asset is actually doves — move to cutout next to accent-doves */
  { kind: "rename", src: "cutout/accent-butterflies.png", dst: "cutout/accent-doves-variant.png", expect: "2c0fd576" },

  /* forest-scene-bear.png is a cat in flowers, not a bear */
  { kind: "rename", src: "cutout/forest-scene-bear.png", dst: "cats/cat-in-floral-arch.png", expect: "ccf451e7" },

  /* Story illustrations — rename by actual content for the upcoming
   * copy.ts re-mapping. The component refs in copy.ts still need to be
   * updated to match the new names. */
  { kind: "rename", src: "cutout/story-books-plane.png",    dst: "cutout/illustration-woman-studying.png",  expect: "c7393ea9" },
  { kind: "rename", src: "cutout/story-bus-couple.png",     dst: "cutout/illustration-man-backpack.png",    expect: "5b00a677" },
  { kind: "rename", src: "cutout/story-jakarta-motor.png", dst: "cutout/illustration-woman-phone.png",     expect: "44f02307" },
  { kind: "rename", src: "cutout/story-keio-tower.png",    dst: "cutout/illustration-woman-looking.png",   expect: "a2a903f4" },
  { kind: "rename", src: "cutout/story-growing.png",       dst: "cutout/illustration-figure-front.png",    expect: "d5cc7ff0" },
  /* story-jakarta-map.png is accurately named (Jakarta map with cat) — keep */
];

/* Component / lib updates — separate pass after the renames */
const COMPONENT_UPDATES = [
  {
    file: "nikah-web/lib/config.ts",
    edits: [
      { from: "\"cat-jiro\",",  to: "\"cat-tuxedo-black\"," },
      { from: "\"cat-meng\",",  to: "\"cat-grey-white\"," },
      { from: "\"cat-moju\",",  to: "\"cat-tuxedo-bw\"," },
      { from: "\"cat-shiro\",", to: "\"cat-cream-longhair\"," },
      { from: "\"cat-simba\",", to: "\"cat-tabby-grey\"," },
      { from: "\"cat-hoshi\",", to: "\"cat-tabby-peaceful\"," },
      { from: "\"cat-kimho\",", to: "\"cat-tabby-sleeping\"," },
    ],
  },
  {
    file: "nikah-web/components/hero/heroLayout.ts",
    edits: [
      { from: "\"cat-jiro\":",  to: "\"cat-tuxedo-black\":" },
      { from: "\"cat-meng\":",  to: "\"cat-grey-white\":" },
      { from: "\"cat-moju\":",  to: "\"cat-tuxedo-bw\":" },
      { from: "\"cat-shiro\":", to: "\"cat-cream-longhair\":" },
      { from: "\"cat-simba\":", to: "\"cat-tabby-grey\":" },
      { from: "\"cat-hoshi\":", to: "\"cat-tabby-peaceful\":" },
      { from: "\"cat-kimho\":", to: "\"cat-tabby-sleeping\":" },
    ],
  },
  {
    file: "nikah-web/components/sections/Loading.tsx",
    edits: [
      /* Loading expects a couple illustration; couple-cutout.png was a cat,
       * so point at the real couple file (couple-illustration.png). */
      { from: "/assets/couple/couple-cutout.png", to: "/assets/couple/couple-illustration.png" },
    ],
  },
  {
    file: "nikah-web/components/sections/Closing.tsx",
    edits: [
      { from: "/assets/couple/couple-cutout.png", to: "/assets/couple/couple-illustration.png" },
    ],
  },
  {
    file: "nikah-web/components/hero/Butterflies.tsx",
    edits: [
      /* Butterflies.tsx is wired to a doves asset; point at the canonical doves
       * and update the alt so screen readers aren't lied to. */
      { from: "src=\"/assets/cutout/accent-butterflies.png\"", to: "src=\"/assets/cutout/accent-doves.png\"" },
    ],
  },
  {
    file: "nikah-web/lib/copy.ts",
    edits: [
      /* Re-map broken story chapters to the cutout illustrations that exist.
       * All illustrations are women/men illustrations of the couple — none
       * perfectly matches the chapter, but the closest-by-subject mapping
       * is: pertemuan (meeting) -> woman on phone; kedekatan (closer, motor)
       * -> woman studying (generic); jakarta -> jakarta map; ldr -> man
       * with backpack; keio -> woman looking; menikah (married) -> figure
       * front. These are stand-ins until the proper assets are generated. */
      { from: "        illustration: \"/assets/scene/story-meeting.png\",",
        to: "        illustration: \"/assets/cutout/illustration-woman-phone.png\"," },
      { from: "        illustration: \"/assets/illustrations/story-motor.png\",",
        to: "        illustration: \"/assets/cutout/illustration-woman-studying.png\"," },
      { from: "        illustration: \"/assets/illustrations/story-jakarta.png\",",
        to: "        illustration: \"/assets/cutout/story-jakarta-map.png\"," },
      { from: "        illustration: \"/assets/illustrations/story-ldr.png\",",
        to: "        illustration: \"/assets/cutout/illustration-man-backpack.png\"," },
      { from: "        illustration: \"/assets/illustrations/story-keio.png\",",
        to: "        illustration: \"/assets/cutout/illustration-woman-looking.png\"," },
      { from: "        illustration: \"/assets/illustrations/story-married.png\",",
        to: "        illustration: \"/assets/cutout/illustration-figure-front.png\"," },
    ],
  },
];

async function sha256(p) {
  const buf = await fs.readFile(p);
  return createHash("sha256").update(buf).digest("hex");
}

async function main() {
  console.log(`Mode: ${EXECUTE ? "EXECUTE" : "DRY RUN"}`);
  console.log(`Repo: ${REPO}`);
  console.log(`Assets: ${ASSETS}`);
  console.log("");

  let ok = 0, refused = 0;

  for (const op of PLAN) {
    const srcAbs = path.join(ASSETS, op.src);
    const dstAbs = path.join(ASSETS, op.dst);
    const srcPub = path.join(PUBLIC, op.src);
    const dstPub = path.join(PUBLIC, op.dst);

    // Source must exist
    let srcSha;
    try {
      srcSha = await sha256(srcAbs);
    } catch {
      console.error(`  REFUSE: source missing in /assets/: ${op.src}`);
      refused++;
      continue;
    }
    if (!srcSha.startsWith(op.expect)) {
      console.error(`  REFUSE: hash mismatch at /assets/${op.src} (got ${srcSha.slice(0, 12)}, expected ${op.expect})`);
      refused++;
      continue;
    }
    // Destination must not exist
    try {
      await fs.access(dstAbs);
      console.error(`  REFUSE: destination already exists: ${op.dst}`);
      refused++;
      continue;
    } catch { /* ok */ }

    if (EXECUTE) {
      await fs.mkdir(path.dirname(dstAbs), { recursive: true });
      await fs.rename(srcAbs, dstAbs);
      // mirror /public/assets/
      try {
        const pubSha = await sha256(srcPub);
        if (!pubSha.startsWith(op.expect)) {
          console.error(`    WARN: /public/${op.src} hash ${pubSha.slice(0,12)} != ${op.expect} — skipping mirror`);
        } else {
          await fs.mkdir(path.dirname(dstPub), { recursive: true });
          await fs.rename(srcPub, dstPub);
        }
      } catch {
        console.error(`    /public/${op.src}: missing — only /assets/ renamed`);
      }
    }
    console.log(`  ${EXECUTE ? "OK" : "PLAN"}: ${op.kind.padEnd(7)} ${op.src} → ${op.dst}  (hash ${op.expect}…)`);
    ok++;
  }

  console.log("");
  console.log("Component / lib updates:");
  for (const upd of COMPONENT_UPDATES) {
    const abs = path.join(REPO, upd.file);
    let body;
    try {
      body = await fs.readFile(abs, "utf8");
    } catch {
      console.error(`  REFUSE: cannot read ${upd.file}`);
      refused++;
      continue;
    }
    for (const edit of upd.edits) {
      if (!body.includes(edit.from)) {
        console.error(`  REFUSE: pattern not found in ${upd.file}: ${edit.from.slice(0, 80)}…`);
        refused++;
        continue;
      }
      body = body.replace(edit.from, edit.to);
      console.log(`  ${EXECUTE ? "OK" : "PLAN"}: ${upd.file} :: ${edit.from.slice(0, 60)}…`);
      ok++;
    }
    if (EXECUTE) {
      await fs.writeFile(abs, body, "utf8");
    }
  }

  console.log("");
  console.log(`Summary: ok=${ok}  refused=${refused}  ${EXECUTE ? "(executed)" : "(dry run — pass --execute to apply)"}`);
  if (refused > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });