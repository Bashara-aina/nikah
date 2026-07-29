# GUIDE 01 — APPENDIX: fal.ai MODEL & BUDGET DECISION SHEET

> **Budget: $10 of fal.ai credits, total, for every image and video.** This sheet tells Cursor exactly which model to use for which asset, the settings, the estimated cost, and the order to spend in. It is companion to [GUIDE 01](GUIDE-01-FAL-ASSET-ENGINE.md).
> **Key fact:** because the hero is the **master animated cohesively** (one video from `scenes/hero-main.webp`, GUIDE 02 §B.0), you do **not** need expensive per-character video loops. The whole pipeline lands around **$3**, leaving ~$7 of headroom to generate *variants and pick the best*. You are not budget-constrained — you are quality-constrained, so use the room.

---

## ⚠️ Prices are estimates — verify once, then trust the dashboard
fal.ai prices change and vary by resolution/steps. Before any bulk run:
1. Open `https://fal.ai/models/<id>` for each model and read its **Pricing** tab.
2. **Generate exactly ONE test** of each *video* model (the only pricey ones), eyeball quality + read the real charge in the fal dashboard.
3. Then batch. The generator is **idempotent** (skips existing outputs) and you set a **$10 hard cap** in the dashboard — so a runaway is impossible. If a video model costs ~2× my estimate, you are still far under $10.

---

## THE DECISION TABLE — asset → model → settings → cost

### 1. Sprites + decorative → **REGENERATE** (`flux/dev/image-to-image`) → then **rmbg** (`fal-ai/bria/rmbg`)
**rmbg-alone is forbidden** (GUIDE 01 §"REGENERATE"): the `correct/` refs have baked-in flowers/edges/off-palette, so first regenerate each into a clean on-brand image (img2img, strength ~0.65), then run rmbg on that clean output for transparency. Two calls per asset.

| Output group | Count | img2img | rmbg | Subtotal |
| :-- | :-: | :-: | :-: | :-: |
| Cats (`jiro/meng/moju/shiro/simba/hoshi`), `cat-peek`, `couple-cutout` | 8 | ~$0.03 | ~$0.02 | ~$0.40 |
| Decorative (`floral-corner-tl/br`, `floral-sprig`, `drapery-divider`, `accent-doves`, `petals-anim`) | 6 | ~$0.03 | ~$0.02 | ~$0.30 |
| **Combine** several refs → cohesive group asset(s) (`flux-pro/kontext`, preferred) | ~2 | ~$0.05 | — | ~$0.10 |

> 🔀 **If fur/petal edges still show a halo after rmbg**, switch the finishing pass to `fal-ai/birefnet/v2` (~$0.03–0.05, better on fur). And **prefer composing** cats/scene into one asset over many lone cutouts — it looks more cohesive *and* avoids per-cutout edge problems.

### 2. The hero living loop → `fal-ai/minimax/video-01-live`  *(the one splurge)*
This is the signature asset: `scenes/hero-main.webp` brought to life. Input: `{ image_url: <master>, prompt: PROMPTS.scene, duration: 6 }` (duration may be fixed by the model — that's fine; keep `[Static shot]` in the prompt for a steady camera).

| Output | Variants to generate | Est. unit | Subtotal |
| :-- | :-: | :-: | :-: |
| `hero-bg-loop.mp4` (from the master) | **3** (pick the best loop) | ~$0.50 | ~$1.50 |
| `hero-tall-loop.mp4` (9:16, optional) from `hero-tall.webp` | 1 | ~$0.50 | ~$0.50 |

> 🔀 **Cheaper alternative if you want to conserve:** `fal-ai/kling-video/v1.6/standard/image-to-video` (~$0.25/5s) preserves illustration style well. Generate one test on each of minimax vs kling, compare the loop, keep the better one for the hero. The hero deserves the best — spend here.

### 3. Story illustrations → `fal-ai/flux/dev`  *(text-to-image)*
The 5 missing chapters (`story-motor/jakarta/ldr/keio/married`). Input: `{ prompt: <chapter> + STYLE, image_size: "portrait_4_3", num_inference_steps: 30 }`. Anchor them to the master's palette/style; for cross-image consistency, optionally feed `illustrations/story-meeting.png` as an img2img style reference at low strength.

| Output | Attempts (regens included) | Est. unit | Subtotal |
| :-- | :-: | :-: | :-: |
| 5 story illustrations | ~10 (2 each, keep best) | ~$0.03 | ~$0.30 |

> 🔀 **For higher fidelity** use `fal-ai/flux-pro/v1.1` (~$0.04–0.05). Affordable here — fine to use it for the 5 illustrations if `flux/dev` drifts from the master's look.

### 4. Gallery harmonize → `fal-ai/flux/dev/image-to-image`  *(real photos, faces sacred)*
Photos from `FOTO INVITATION/`. Input: `{ image_url, prompt: PROMPTS.harmonize, strength: 0.30, num_inference_steps: 28 }`. **Review every output for face fidelity; drop to strength 0.20 and rerun any that drift.**

| Output | Count | Est. unit | Subtotal |
| :-- | :-: | :-: | :-: |
| `gallery-01..0n.webp` | ~6 | ~$0.03 | ~$0.18 |

### 5. Floral video loops → `fal-ai/kling-video/v1.6/standard/image-to-video`  *(optional)*
`floral-garland-loop.mp4`, `floral-swag-loop.mp4`. Input: `{ image_url, prompt, duration: "5", aspect_ratio: "9:16" }`.

| Output | Count | Est. unit | Subtotal |
| :-- | :-: | :-: | :-: |
| 2 floral loops | 2 | ~$0.25 | ~$0.50 |

> 🔀 **Skip these to save $0.50** and instead CSS-sway the `floral-garland`/`floral-swag` PNG (run them through bria/rmbg in step 1 instead). The site looks great either way — `docs/12` already treats corner florals as CSS. Generate the loops only if you want the section-header florals to truly drift.

### 6. Character idle loops → **SKIP by default**
In the cohesive hero, the couple and cats are already alive inside `hero-bg-loop.mp4`, and the Closing reuses that same world. So Phase 2 (`wan` / per-character i2v, the old ~$1.80 line item) is **not needed**. Only generate `couple-idle.mp4` / `cats-hero-group-idle.mp4` if you deliberately chose the reconstructed layer-stack hero (GUIDE 02 §B.1) — and if so, use `fal-ai/kling-video/v1.6/standard/image-to-video` (~$0.25 each), not a pricier model.

---

## THE BUDGET LEDGER

| Phase | Model | Est. cost |
| :-- | :-- | :-: |
| 0. regen ×14 (img2img) + rmbg finish | `flux/dev/image-to-image` + `bria/rmbg` | ~$0.70 |
| 0b. combine ×~2 (cohesive groups) | `flux-pro/kontext` | ~$0.10 |
| 1. hero loop ×3 variants (+1 tall) | `minimax/video-01-live` | ~$2.00 |
| 2. story illustrations ×~10 | `flux/dev` | ~$0.30 |
| 3. gallery harmonize ×6 | `flux/dev/image-to-image` | ~$0.18 |
| 4. floral loops ×2 (optional) | `kling 1.6 std i2v` | ~$0.50 |
| **TOTAL (recommended, with variants)** | | **≈ $3.80** |
| **LEAN (1 hero, no floral loops)** | | **≈ $1.60** |
| **Your cap** | | **$10.00** |

You have **~$6–8 of headroom.** Spend it on *quality, not quantity*: generate 3–4 hero variants and keep the most seamless loop; do 2 attempts per story illustration; try both minimax and kling on the hero. Do **not** spend it on per-character videos you don't need.

---

## SPEND ORDER (cheapest → confirm → splurge)
1. **`gen:0` (regenerate→rmbg, ~$0.70) + `gen:0b` (combine, ~$0.10)** — cheap, unblocks everything. Verify each output is a *clean, on-brand* asset (not a halo'd cutout) and matches the master.
2. **One hero test** (`minimax` *and* `kling`, ~$0.75 total) — compare loops on the master, choose the model. **This is the only real quality decision.**
3. **`gen:6` story illustrations + `gen:4` gallery (~$0.50)** — cheap images; review faces + style.
4. **Hero final variants (~$1.00–1.50)** on the chosen model; keep the best loop.
5. **Floral loops** only if you decided to use them.
6. After each step, glance at the dashboard balance. Stop and tell the user if anything is >2× its estimate.

## Hard rules (unchanged)
- $10 cap set in the fal dashboard before step 1.
- Idempotent script: re-running never double-charges; `--force` to redo one asset.
- Compress every video (<2 MB, ≤1080px) + export a WebP poster (GUIDE 01 §6) — this is free (ffmpeg, local) and protects the perf budget.
- Real photos: harmonize only, strength ≤0.35, never video.
- Record the final model choices at the top of `docs/13-fal-generation-plan.md`.
