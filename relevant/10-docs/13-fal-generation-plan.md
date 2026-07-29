# 13 — fal.ai Generation Plan

Dokumen master pipeline fal.ai. Cursor membaca ini untuk menjalankan batch generation script. **Jangan mulai build site sebelum semua Phase 0–3 selesai.**

---

## Setup

```bash
# Install
npm install @fal-ai/client

# .env (jangan commit)
FAL_KEY=your_fal_api_key_here
FAL_SPEND_CAP=25   # USD — set manual di fal.ai dashboard juga
```

---

## Script: `scripts/generate-assets.mjs`

Cursor harus generate script ini dan jalankan per phase. Script membaca manifest di bawah.

```javascript
import { fal } from '@fal-ai/client'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'

fal.config({ credentials: process.env.FAL_KEY })

// Utility: fetch image as base64 dari GitHub raw URL
async function fetchAsBase64(url) {
  const res = await fetch(url)
  const buf = await res.arrayBuffer()
  return Buffer.from(buf).toString('base64')
}

// Utility: download output video/image ke path
async function downloadOutput(url, outputPath) {
  const res = await fetch(url)
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, Buffer.from(await res.arrayBuffer()))
  console.log(`✅ Saved: ${outputPath}`)
}
```

---

## Phase 0 — Background Removal (`fal-ai/bria/rmbg`)

**Estimasi biaya:** ~$0.02–0.05 per image = ~$0.40 total 8 aset

```javascript
// Phase 0 manifest
const RMBG_MANIFEST = [
  {
    input: 'https://raw.githubusercontent.com/Bashara-aina/nikah/main/nikah-web/correct/most%20correct/cat-jiro-in-flowers.png',
    output: 'nikah-web/assets/cats/cat-jiro-transparent.png'
  },
  {
    input: 'https://raw.githubusercontent.com/Bashara-aina/nikah/main/nikah-web/correct/most%20correct/cat-meng-with-flowers.png',
    output: 'nikah-web/assets/cats/cat-meng-transparent.png'
  },
  {
    input: 'https://raw.githubusercontent.com/Bashara-aina/nikah/main/nikah-web/correct/most%20correct/cat-moju-sleeping-flowers.png',
    output: 'nikah-web/assets/cats/cat-moju-transparent.png'
  },
  {
    input: 'https://raw.githubusercontent.com/Bashara-aina/nikah/main/nikah-web/correct/most%20correct/cat-shiro-butterfly.png',
    output: 'nikah-web/assets/cats/cat-shiro-transparent.png'
  },
  {
    input: 'https://raw.githubusercontent.com/Bashara-aina/nikah/main/nikah-web/correct/most%20correct/cat-simba-with-dove.png',
    output: 'nikah-web/assets/cats/cat-simba-transparent.png'
  },
  {
    input: 'https://raw.githubusercontent.com/Bashara-aina/nikah/main/nikah-web/correct/most%20correct/cat-hoshi-kimho-playing.png',
    output: 'nikah-web/assets/cats/cat-hoshi-transparent.png'
  },
  {
    input: 'https://raw.githubusercontent.com/Bashara-aina/nikah/main/nikah-web/correct/most%20correct/cats-white-tuxedo-arch-frame.png',
    output: 'nikah-web/assets/cats/cats-hero-group-transparent.png'
  },
  {
    input: 'https://raw.githubusercontent.com/Bashara-aina/nikah/main/nikah-web/correct/most%20correct/couple-scooter-vespa-wedding.png',
    output: 'nikah-web/assets/couple/couple-cutout.png'
  }
]

for (const item of RMBG_MANIFEST) {
  console.log(`Processing rmbg: ${item.output}`)
  const result = await fal.subscribe('fal-ai/bria/rmbg', {
    input: { image_url: item.input }
  })
  await downloadOutput(result.data.image.url, item.output)
  // Jaga pace — 1 per 2 detik
  await new Promise(r => setTimeout(r, 2000))
}
```

---

## Phase 1 — Hero Scene Video Loops (`fal-ai/minimax/video-01-live`)

**Estimasi biaya:** ~$0.30–0.50 per video = ~$1.20 total 3 video

```javascript
const HERO_VIDEO_MANIFEST = [
  {
    image_url: 'https://raw.githubusercontent.com/Bashara-aina/nikah/main/nikah-web/scenes/hero-main.webp',
    prompt: 'Soft meadow breathes gently, wildflowers sway in morning breeze, dappled sunlight shifts slowly, rose petals drift in air, storybook watercolor illustration style preserved, seamless ambient loop [Static shot]',
    output: 'nikah-web/assets/video/hero-bg-loop.mp4'
  },
  {
    image_url: 'https://raw.githubusercontent.com/Bashara-aina/nikah/main/nikah-web/correct/most%20correct/wildflower-meadow-full.png',
    prompt: 'Wildflower meadow sways in gentle morning breeze, pastel flowers bob softly, butterflies flutter briefly, warm golden light, storybook illustration style, seamless loop [Static shot]',
    output: 'nikah-web/assets/video/meadow-bottom-loop.mp4'
  },
  {
    image_url: 'https://raw.githubusercontent.com/Bashara-aina/nikah/main/nikah-web/correct/most%20correct/five-cats-golden-meadow-sunset.png',
    prompt: 'Five cats rest in golden meadow, soft grass sways, tails move gently, warm sunset light shimmers, storybook watercolor style, seamless ambient loop [Static shot]',
    output: 'nikah-web/assets/video/cats-meadow-loop.mp4'
  }
]

for (const item of HERO_VIDEO_MANIFEST) {
  console.log(`Generating hero video: ${item.output}`)
  const result = await fal.subscribe('fal-ai/minimax/video-01-live', {
    input: {
      image_url: item.image_url,
      prompt: item.prompt,
      duration: 6
    },
    logs: true
  })
  await downloadOutput(result.data.video.url, item.output)
  await new Promise(r => setTimeout(r, 3000))
}
```

---

## Phase 2 — Cat Idle Loops (`fal-ai/wan-2.6`)

**Estimasi biaya:** ~$0.20–0.35 per video = ~$1.80 total 8 video

```javascript
const CAT_IDLE_MANIFEST = [
  {
    // Jalankan SETELAH Phase 0 selesai
    // image_url = local file dari Phase 0, upload ke fal dulu
    name: 'jiro',
    local_source: 'nikah-web/assets/cats/cat-jiro-transparent.png',
    prompt: 'Cat breathes slowly and peacefully, ear twitches once, tail sways gently left and right, pastel storybook illustration style preserved, transparent background, seamless loop [Static shot]',
    output: 'nikah-web/assets/video/cat-jiro-idle.mp4'
  },
  {
    name: 'meng',
    local_source: 'nikah-web/assets/cats/cat-meng-transparent.png',
    prompt: 'Cat breathes softly, head tilts slightly, whiskers twitch, paws shift gently, watercolor illustration style, transparent background, seamless loop [Static shot]',
    output: 'nikah-web/assets/video/cat-meng-idle.mp4'
  },
  {
    name: 'moju',
    local_source: 'nikah-web/assets/cats/cat-moju-transparent.png',
    prompt: 'Sleeping cat breathes rhythmically, belly rises and falls, ear flicks once dreamily, soft watercolor storybook style, transparent background, seamless loop [Static shot]',
    output: 'nikah-web/assets/video/cat-moju-idle.mp4'
  },
  {
    name: 'shiro',
    local_source: 'nikah-web/assets/cats/cat-shiro-transparent.png',
    prompt: 'Cat watches butterfly curiously, head follows slightly, tail tip flicks, breathes gently, pastel watercolor style, transparent background, seamless loop [Static shot]',
    output: 'nikah-web/assets/video/cat-shiro-idle.mp4'
  },
  {
    name: 'simba',
    local_source: 'nikah-web/assets/cats/cat-simba-transparent.png',
    prompt: 'Cat breathes peacefully, eyes blink slowly once, tail sweeps gently, storybook watercolor style, transparent background, seamless loop [Static shot]',
    output: 'nikah-web/assets/video/cat-simba-idle.mp4'
  },
  {
    name: 'hoshi',
    local_source: 'nikah-web/assets/cats/cat-hoshi-transparent.png',
    prompt: 'Playful cat shifts weight, tail wags happily, ears perk up briefly, soft breathing, pastel watercolor style, transparent background, seamless loop [Static shot]',
    output: 'nikah-web/assets/video/cat-hoshi-idle.mp4'
  },
  {
    name: 'couple',
    local_source: 'nikah-web/assets/couple/couple-cutout.png',
    prompt: 'Wedding couple breathes warmly together, gentle hair movement in soft breeze, tender shared smile, baju pengantin Melayu, storybook watercolor illustration style preserved, transparent background, seamless loop [Static shot]',
    output: 'nikah-web/assets/video/couple-idle.mp4'
  },
  {
    name: 'cats-hero-group',
    local_source: 'nikah-web/assets/cats/cats-hero-group-transparent.png',
    prompt: 'Two cats under floral arch breathe gently together, tails sway in harmony, flowers around them bob softly, storybook watercolor illustration, transparent background, seamless loop [Static shot]',
    output: 'nikah-web/assets/video/cats-hero-group-idle.mp4'
  }
]

// Upload local file ke fal storage dulu, baru run model
for (const item of CAT_IDLE_MANIFEST) {
  console.log(`Generating idle: ${item.name}`)
  const fileBuffer = readFileSync(item.local_source)
  const uploaded = await fal.storage.upload(new Blob([fileBuffer]))
  
  const result = await fal.subscribe('fal-ai/wan/v2.2/image-to-video', {
    input: {
      image_url: uploaded,
      prompt: item.prompt,
      duration: '5',
      aspect_ratio: '9:16'
    },
    logs: true
  })
  await downloadOutput(result.data.video.url, item.output)
  await new Promise(r => setTimeout(r, 3000))
}
```

---

## Phase 3 — Floral Video Loops (`fal-ai/minimax/video-01-live`)

**Estimasi biaya:** ~$0.30–0.50 per video = ~$1.00 total 2 video

```javascript
const FLORAL_VIDEO_MANIFEST = [
  {
    image_url: 'https://raw.githubusercontent.com/Bashara-aina/nikah/main/nikah-web/correct/most%20correct/floral-garland-full-swag.png',
    prompt: 'Floral garland sways gently in soft breeze, pastel roses and ivory blossoms bob gracefully, petals shimmer, warm light filters through, seamless loop [Static shot]',
    output: 'nikah-web/assets/video/floral-garland-loop.mp4'
  },
  {
    image_url: 'https://raw.githubusercontent.com/Bashara-aina/nikah/main/nikah-web/correct/most%20correct/floral-swag-full.png',
    prompt: 'Floral swag breathes and sways softly, cream and blush flowers move gently, leaves flutter slightly, storybook watercolor style, seamless loop [Static shot]',
    output: 'nikah-web/assets/video/floral-swag-loop.mp4'
  }
]
```

---

## Phase 4 — Gallery Photo Style-Harmonize (`fal-ai/flux/dev/image-to-image`)

**Estimasi biaya:** ~$0.04–0.08 per image = ~$0.40 total

```javascript
// Setiap foto dari FOTO INVITATION/ di-upload manual dulu
// Strength 0.25–0.35 (rendah) — WAJIB jaga wajah
const GALLERY_PROMPT = 'Harmonize photo into soft watercolor storybook illustration aesthetic, ivory cream blush dusty pink palette, preserve faces expressions and identity completely, airy early-morning golden light, do not change people or composition'

// Untuk setiap foto:
const result = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
  input: {
    image_url: uploadedPhotoUrl,
    prompt: GALLERY_PROMPT,
    strength: 0.30,
    num_inference_steps: 28
  }
})
```

> ⚠️ **Review manual setiap output gallery sebelum commit.** Pastikan wajah Bashara dan pasangan masih dikenali. Jika drift terlalu jauh, turunkan strength ke 0.20.

---

## Estimasi Biaya Total

| Phase | Model | Jumlah | Est. Biaya |
| :-- | :-- | :-- | :-- |
| 0 rmbg | bria/rmbg | 8 PNG | ~$0.40 |
| 1 hero video | minimax/video-01-live | 3 video | ~$1.20 |
| 2 cat idle | wan-2.6 | 8 video | ~$1.80 |
| 3 floral video | minimax/video-01-live | 2 video | ~$0.80 |
| 4 gallery | flux img2img | 5 img | ~$0.40 |
| **TOTAL** | | | **~$4.60** |

> Set `$10 spend cap` di fal.ai dashboard sebelum mulai. Lebih dari cukup dengan buffer.

---

## Urutan Eksekusi

```
1. node scripts/generate-assets.mjs --phase=0   # rmbg dulu
2. node scripts/generate-assets.mjs --phase=1   # hero videos
3. node scripts/generate-assets.mjs --phase=2   # cat idle (butuh Phase 0)
4. node scripts/generate-assets.mjs --phase=3   # floral videos
5. Manual: gallery style-harmonize + review
6. Manual: story illustrations via Gemini
7. npm run copy-assets && npm run dev → verifikasi semua aset
8. Cursor build site (06-build-notes.md Phase build)
```

---

## Catatan Model API fal.ai (2026)

| Model ID | Digunakan untuk | Catatan |
| :-- | :-- | :-- |
| `fal-ai/bria/rmbg` | Background removal | Fast, high quality |
| `fal-ai/minimax/video-01-live` | Hero + floral video loops | Best for scene/environment |
| `fal-ai/wan/v2.2/image-to-video` | Cat + couple idle | Best for character illustration |
| `fal-ai/flux/dev/image-to-image` | Gallery style harmonize | Strength 0.25–0.35 |

> Cek `fal.ai/models` bila ada model baru yang lebih sesuai. Model IDs bisa berubah — validasi dulu sebelum run.
