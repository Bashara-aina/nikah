# 07 — Gemini Asset Prompts

> **PENTING — baca sebelum generate:**
> - **Style anchor wajib dilampirkan ke setiap Gemini session:** `scenes/hero-main.webp` (bukan WhatsApp Image — file itu sudah tidak ada di proyek).
> - **Foto sumber kucing:** `FOTO INVITATION/cat-*.jpg/png` — lampirkan bersama style anchor.
> - **Foto sumber couple:** `FOTO INVITATION/couple-*.jpg/jpeg` — lampirkan bersama style anchor.
> - **Output Gemini ini = static PNG / WebP untuk story illustrations dan gate.** Bukan untuk hero, bukan untuk cats/couple di hero — itu semua diproses fal.ai.
> - **Semua aset `correct/` sudah ada** dan menjadi input fal.ai (rmbg + video). Gemini hanya untuk story illustrations dan static decorations.
> - Ekspor **PNG transparan** untuk aset dekorasi/story; **WebP** untuk hero/gallery.

**Model:** Google **Gemini 2.5 Flash Image**. Pakai satu model ini saja dari awal sampai akhir.

**Aturan emas:**
1. **Selalu lampirkan `scenes/hero-main.webp`** di setiap session sebagai jangkar gaya.
2. **Satu subjek per gambar**, background transparan kecuali hero & countdown-bg.
3. Urutan: kucing (style lock) → hero & couple → dekorasi → story/Japan → gallery → closing.
4. Ekspor PNG transparan untuk aset tempel; WebP untuk hero/gallery.

---

## 1. Palet & Identitas (acuan, bukan aset)

- **Palet:** ivory `#FBF7F0`, cream `#F3E9DC`, blush `#F3D9D6`, dusty pink `#D9A7A0`, soft peach `#F4C9A8`, sage `#A9B89A`, sky `#CFE0E8`. **Dilarang:** pink terang/fuchsia, bold/neon.
- **Hanifah:** wanita muda Indonesia, hijab taupe/greige menjuntai ke satu bahu, blus krem puff-sleeve + celana putih longgar, kalung emas tipis berlapis, senyum hangat.
- **Bashara:** pria muda Indonesia, rambut hitam sedikit acak, kemeja hitam/charcoal lengan dilipat, celana hitam, jam tangan, senyum lebar hangat.
- **Hashtag:** `#BASHicallyHANI's`
- **7 kucing:** Jiro (tuxedo panjang), Meng (tuxedo pendek), Moju (ragdoll seal-point), Shiro (putih pink ears), Simba (orange tabby), Hoshi (brown-grey tabby), Kimho (brown tabby-white).

---

## 2. Kucing — PNG Transparan (kerjakan PALING DULU untuk mengunci gaya)

> **Lampirkan ke Gemini:** `scenes/hero-main.webp` + foto kucing dari `FOTO INVITATION/`

| Output | Source foto |
| :-- | :-- |
| `cats/cat-jiro.png` | `FOTO INVITATION/cat-black-white-pendant-name-jiro.jpg` |
| `cats/cat-meng.png` | `FOTO INVITATION/cat-black-white-lying-bw-name-meng.jpg` |
| `cats/cat-moju.png` | `FOTO INVITATION/cat-ragdoll-portrait-name-moju.png` |
| `cats/cat-shiro.png` | `FOTO INVITATION/cat-white-closeup-pink-ears-name-shiro.png` |
| `cats/cat-simba.png` | `FOTO INVITATION/cat-orange-white-on-couch-name-simba.png` |
| `cats/cat-hoshi.png` | `FOTO INVITATION/cat-gray-tabby-in-blankets-name-hoshi.png` |
| `cats/cat-kimho.png` | `FOTO INVITATION/cat-kimho-portrait.png` |

### cat-jiro.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration (scenes/hero-main.webp).
Redraw the cat in the second photo as a storybook character, keeping its exact markings and identity.
Subject: a medium-long-haired tuxedo cat — black head and back, white muzzle and chin with a soft white blaze, white chest bib and white paws, warm amber-gold eyes, pink nose, wearing a thin red collar with a small silver name tag. Fluffy cheeks, sweet gentle expression.
Composition: full body, sitting upright, facing viewer, centered.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo.
```

### cat-meng.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference (scenes/hero-main.webp).
Redraw the cat in the second photo as a storybook character. Source is black-and-white — render as classic tuxedo cat.
Subject: short-haired tuxedo cat — mostly black face/head, white chin, white chest and paws, pale yellow-green eyes, pink-and-black nose. Alert, curious, friendly.
Composition: full body, sitting, head slightly tilted, facing viewer.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hard shadows, anime cel-shading, busy background, text, watermark.
```

### cat-moju.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style of scenes/hero-main.webp.
Redraw the cat in the second photo as a storybook character.
Subject: fluffy long-haired seal-point ragdoll — cream/white body, dark seal-brown face mask and ears, bright blue eyes, big fluffy ruff and tail, white chest and paws. Soft slightly-grumpy-but-cute expression.
Composition: full body, lying down in a relaxed loaf, facing viewer.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, hard shadows, anime, text, watermark.
```

### cat-shiro.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette: ivory, cream, blush pink, sage green, soft sky blue. Tender, whimsical, cozy. Exactly match the art style of scenes/hero-main.webp.
Redraw the cat in the second photo as a storybook character.
Subject: pure white fluffy kitten — soft white fur, pink inner ears, pink nose, dark blue-grey eyes, small and round, very cute and delicate.
Composition: full body, sitting, looking slightly to the side.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold colors, neon, hard shadows, anime, text, watermark.
```

### cat-simba.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette: ivory, cream, blush pink, soft peach, sage green. Tender, whimsical, cozy. Exactly match the art style of scenes/hero-main.webp.
Redraw the cat in the second photo as a storybook character, keeping exact markings.
Subject: orange ginger tabby-and-white cat — ginger tabby stripes on head/back, white chest/belly/paws, warm amber-gold eyes, pink nose, collar with small round tag. Friendly, content.
Composition: full body, lying down comfortably, facing viewer.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold colors, neon, hard shadows, anime, text, watermark.
```

### cat-hoshi.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette: ivory, cream, blush pink, sage green, soft sky blue. Tender, whimsical, cozy. Exactly match the art style of scenes/hero-main.webp.
Redraw the cat in the second photo as a storybook character.
Subject: brown-grey mackerel tabby — classic tabby 'M' stripe on forehead, big round amber-green eyes, expressive curious face, pink-grey nose.
Composition: full body, sitting upright, big-eyed curious look at viewer.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold colors, neon, hard shadows, anime, text, watermark.
```

### cat-kimho.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette: ivory, cream, blush pink, sage green. Tender, whimsical, cozy. Exactly match the art style of scenes/hero-main.webp.
Redraw the cat in the second photo as a storybook character.
Subject: brown-grey tabby-and-white cat — mackerel/spotted tabby coat, white chin and chest patch, green eyes, pink nose, collar with small round tag. Calm, sweet.
Composition: full body, sitting, facing viewer.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold colors, neon, hard shadows, anime, text, watermark.
```

---

## 3. Hero & Pasangan

> **`scenes/hero-main.webp` sudah ada dan siap dipakai sebagai komposisi hero.** Ini adalah hasil akhir dari proses Gemini yang sudah dilakukan. Gunakan sebagai input `minimax/video-01-live` untuk membuat `hero-bg-loop.mp4`.
>
> Jika perlu regenerate (misalnya karena ingin Moju ada di scene): gunakan prompt di bawah. Lampirkan `scenes/hero-main.webp` + foto couple dari `FOTO INVITATION/couple-standing-smiling.jpg`.

### hero-main (jika perlu regenerate)
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style of the attached reference (scenes/hero-main.webp).
Subject: a young Indonesian couple standing together in a soft flower meadow at early morning, surrounded by their seven pet cats. The woman wears a taupe/greige hijab draped over one shoulder, a cream puff-sleeve blouse and white wide-leg pants, with a warm gentle smile. The man wears a dark charcoal button shirt with rolled sleeves and dark trousers, tousled black hair, warm big smile. Match their faces to the attached couple photo.
Cats: a white fluffy kitten, two black-and-white tuxedo cats, a fluffy seal-point ragdoll with blue eyes, an orange ginger-and-white cat, and two brown tabby cats — some held in arms, some sitting in the grass.
Composition: vertical portrait, full scene fills a tall mobile screen, couple centered, soft wildflowers foreground, gentle blue sky with two soft white doves and a couple of pink butterflies.
Background: full painted meadow scene (not transparent).
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy look, anime, text, watermark.
```

### couple/couple-cutout.png
> Lampirkan: `scenes/hero-main.webp` + `FOTO INVITATION/couple-standing-smiling.jpg`
```
Soft hand-painted children's-storybook illustration, gouache and watercolor. Muted pastel palette. Exactly match the art style of scenes/hero-main.webp.
Subject: the same young Indonesian couple (taupe hijab + cream blouse + white pants; charcoal shirt + dark trousers), standing holding hands, both smiling warmly. Match faces to the attached photo.
Composition: full body, front-facing, standing side by side.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold colors, neon, hard shadows, anime, text, watermark.
```

---

## 4. Dekorasi — Floral, Drapery, Arch (PNG Transparan)

> Lampirkan `scenes/hero-main.webp` sebagai jangkar gaya untuk semua dekorasi.

### florals/floral-corner-tl.png & floral-corner-br.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor. Muted pastel palette: ivory, cream, blush pink, dusty pink, soft peach, sage green. Match the art style of scenes/hero-main.webp.
Subject: a delicate asymmetrical corner cluster of soft wildflowers and greenery — pink cosmos, small white daisies, pale yellow blooms, tiny purple sprigs, sage-green leaves, loosely arranged like the florals in the reference.
Composition: arranged to sit in the TOP-LEFT corner (make a mirrored version for BOTTOM-RIGHT).
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, anime, text, watermark.
```

### florals/floral-sprig.png
```
Soft hand-painted storybook illustration, gouache and watercolor. Muted pastels. Match scenes/hero-main.webp style.
Subject: a small slim horizontal sprig of sage greenery with two or three tiny blush blossoms — gentle section divider.
Composition: thin and horizontal, centered.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

### florals/floral-border-full.png
```
Soft hand-painted storybook illustration, gouache and watercolor. Muted pastels. Match scenes/hero-main.webp style.
Subject: soft full-page floral frame border (oval/arch-leaning) of pastel wildflowers and sage greenery, empty space in the center for guest name.
Composition: vertical, frames the edges, center kept clear.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

### florals/drapery-divider.png
```
Soft hand-painted storybook illustration, gouache and watercolor. Muted pastels. Match scenes/hero-main.webp style.
Subject: softly flowing length of sheer white/ivory drapery fabric, gently folded, translucent — used as horizontal divider between sections.
Composition: wide and horizontal, fabric flowing left to right.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

### florals/arch-frame.png
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: soft arch (doorway-shaped) frame of ivory drapery and asymmetrical pastel florals climbing one side, empty inside.
Composition: vertical arch, hollow center.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

### florals/accent-doves.png
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: two small soft white doves in gentle flight.
Composition: tiny floating accents.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

### florals/accent-butterflies.png
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: two or three small pastel pink butterflies.
Composition: tiny floating accents.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

---

## 5. Section Illustrations

> Lampirkan `scenes/hero-main.webp` sebagai jangkar gaya untuk semua ilustrasi ini.

### loading/loading-motif.png
```
Soft hand-painted storybook illustration, gouache and watercolor. Muted pastels. Match scenes/hero-main.webp style.
Subject: a single cozy motif — a small sleeping cat curled inside a soft wreath of pastel florals.
Composition: small, centered, lots of breathing room.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

### gate/gate-illustration.png (TANPA kucing)
```
Soft hand-painted storybook illustration, gouache and watercolor. Muted pastels. Match scenes/hero-main.webp style.
Subject: a gentle storybook-page opening illustration — a softly draped arch with pastel florals, calm and inviting, with a clear empty area in the center for the guest's name. No cats.
Composition: vertical, center kept clear for text.
Background: soft ivory paper texture (not transparent).
Avoid: photorealism, bold colors, neon, hard shadows, cats, text, watermark.
```

### welcome/welcome-accent.png
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: a small tender vignette — a pair of soft white doves above a loose sprig of pastel florals.
Composition: small centered accent above a text block.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

### countdown/countdown-bg.webp
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: a soft horizontal band of blurred pastel florals and faint flowing drapery — lots of soft empty space in the middle for countdown numbers.
Composition: wide horizontal banner.
Background: soft painted (not transparent).
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

### story/story-meeting.png
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: a whimsical small scene symbolizing meeting online through a university organization — two soft laptops/phone screens connected by a gentle dotted line and a tiny heart, small florals around. Subtle and sweet.
Composition: small horizontal vignette.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark, logos.
```

### story/story-growing.png
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: the same couple walking together happily with two or three of their cats trailing behind.
Composition: small horizontal vignette, side view.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

### story/story-motor.png
> Lampirkan: `scenes/hero-main.webp` + `FOTO INVITATION/couple-standing-smiling.jpg`
```
Soft hand-painted storybook illustration, gouache and watercolor. Warm golden late-afternoon light. Muted pastels. Match scenes/hero-main.webp style.
Subject: a small cute Indonesian motor bebek/scooter (dusty-pink-and-cream) parked near a kosan gate. The same couple — the man (charcoal shirt, dark trousers) hands the woman (taupe hijab, cream blouse) her small backpack as she steps off. Warm late-afternoon light. Match faces to the attached photo.
Composition: small horizontal vignette, three-quarter side view.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, sport-motorcycle, brand names, text, watermark.
```

### story/japan-motif.png
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: soft symbolic Japan scene — gentle sakura blossoms, a calm university campus gate, a small train, a tiny silhouette of the couple walking together. Dreamy, not busy.
Composition: small horizontal vignette.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark, logos.
```

### story/story-jakarta.png
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: two laptops side by side on a wooden desk, a steaming mug of kopi, a tiny potted plant, a small Jakarta Monas silhouette in the back window. Two overlapping notebooks in a heart shape.
Composition: small horizontal vignette, desk-eye angle.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark, logos.
```

### story/story-ldr.png
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: a small open laptop on a Japanese-style low desk showing a video-call window with a tiny silhouette of a woman in hijab, chopsticks and a bowl of ramen beside it, a soft paper plane drifting toward a faint heart. Cozy, melancholic but hopeful.
Composition: small horizontal vignette.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

### story/story-keio.png
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: a pastel acceptance letter (with a tiny gold seal) half-open, cherry-blossom petals drifting around it, small silhouette of Keio Hiyoshi campus gate in the background. Joyful, hopeful.
Composition: small horizontal vignette.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark, logos.
```

### story/story-married.png
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: two slender hands resting side by side, one with a delicate gold ring slipped on the ring finger, the other hand gently holding it; cherry-blossom petals drifting around, small ivory drapery ribbon tied loosely in the background. Modest, sincere.
Composition: small horizontal vignette, close-up on hands.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, religious symbols, text, watermark.
```

### story/story-together.png
> Lampirkan: `scenes/hero-main.webp` + `FOTO INVITATION/couple-standing-smiling.jpg`
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: the same couple walking hand-in-hand toward a soft horizon of sakura trees and a small Mt. Fuji silhouette, two small suitcases behind them. Both smiling, looking forward. Match faces to the attached photo.
Composition: small horizontal vignette, three-quarter back view.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

### event/event-accent.png
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: a soft ivory drapery arch with a small asymmetrical pastel floral cluster on one side, framing space for date and venue text. Subtle nod to a Bandung garden-restaurant setting.
Composition: vertical, center clear for text.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

### event/map-pin.png
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: a cute soft map pin shaped like a little house with a blush roof and a tiny floral sprig.
Composition: small icon, centered.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

### gift/gift-accent.png
```
Soft hand-painted storybook illustration. Muted pastels. Match scenes/hero-main.webp style.
Subject: a gentle vignette of a soft pastel gift box tied with a sage ribbon beside a small envelope and a sprig of florals. Warm and modest, not flashy.
Composition: small centered accent.
Background: fully transparent.
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

### closing/closing-illustration.webp
> Lampirkan: `scenes/hero-main.webp` + `FOTO INVITATION/couple-standing-smiling.jpg`
```
Soft hand-painted storybook illustration, gouache and watercolor. Muted pastels. Match scenes/hero-main.webp style.
Subject: the same couple and their cats in the same flower meadow as the hero, now in a calm warm closing light (soft golden early-evening), waving gently or sitting together with the cats. Emotional symmetry with hero. Match faces to the attached photo.
Composition: vertical portrait, couple centered, cats around them, soft florals foreground.
Background: full painted meadow scene (not transparent).
Avoid: photorealism, bold colors, neon, hard shadows, text, watermark.
```

---

## 6. Gallery — Foto Asli (FOTO INVITATION/) + Style Harmonize via fal.ai

> Gallery photos **tidak di-Gemini**. Mereka diproses via **fal.ai `flux/dev/image-to-image`** strength 0.25–0.35 dari `FOTO INVITATION/`. Faces preserved.
> Full manifest & prompts → `docs/04-asset-list.md` section 3.

---

## 7. Audio

| Aset | Sumber |
| :-- | :-- |
| `audio/la-vie-en-rose.mp3` | Instrumental lembut. Mono, 96–128kbps, loop halus. Mulai saat buka undangan. Bukan dari Gemini. |

---

## 8. Checklist Generate

**A. Kucing (kunci gaya dulu)**
- [ ] cat-jiro · cat-meng · cat-moju · cat-shiro · cat-simba · cat-hoshi · cat-kimho

**B. Hero & Pasangan**
- [ ] Verify `scenes/hero-main.webp` → input ke fal.ai minimax
- [ ] couple-cutout (jika belum ada di `correct/`)

**C. Dekorasi transparan**
- [ ] floral-corner-tl/br · floral-sprig · floral-border-full · drapery-divider · arch-frame · accent-doves · accent-butterflies

**D. Section illustrations**
- [ ] loading-motif · gate-illustration · welcome-accent · countdown-bg
- [ ] story-meeting · story-growing · story-motor · story-jakarta · story-ldr · story-keio · story-married · story-together · japan-motif
- [ ] event-accent · map-pin · gift-accent · closing-illustration

**E. Gallery (via fal.ai, bukan Gemini)**
- [ ] gallery-couple-01 … gallery-couple-09
- [ ] gallery-cat-jiro … gallery-cat-kimho

**F. Audio**
- [ ] la-vie-en-rose.mp3
