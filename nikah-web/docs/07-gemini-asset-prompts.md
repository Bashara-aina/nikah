# 07 — Master Asset & Gemini Prompt Sheet

> **STATUS: generasi aset SUDAH SELESAI** dan semuanya sudah dirapikan. Lihat **`/README.md`** untuk lokasi final.
> Perubahan path sejak dokumen ini ditulis:
> - Output `hero/*` → sekarang **`assets/scenes/`** (`hero-main.webp` = referensi WhatsApp 4:5, `hero-tall.webp`, `hero-bg.webp`, `countdown-bg.webp`).
> - Foto sumber kucing (`assets/cats/Jiro.jpg`, dll) & `DSC*` → sekarang di **`assets/_source/cats-photos/`** dan **`assets/_source/prewedding/`**.
> - REFERENSI GAYA (`WhatsApp Image …`) sudah tidak ada di proyek; komposisi & gayanya kini terwakili oleh **`assets/scenes/hero-main.webp`** (= `main-page.png`). `assets/_source/reference/` berisi PDF konsep. Bila perlu generate ulang, pakai `hero-main.webp` sebagai jangkar gaya.
> - Gallery memakai **foto asli** (`assets/gallery/gallery-01..09.jpg`), bukan versi ilustrasi.
> Dokumen ini disimpan sebagai catatan prompt bila perlu generate ulang.

**Tujuan file ini:** daftar **lengkap & final** semua aset visual yang dibutuhkan website undangan, lengkap dengan **prompt siap-tempel (sudah lengkap, tidak perlu diisi manual)** dan **file mana yang harus dikirim ke Gemini**. Patokan gaya **wajib** untuk semua aset: `WhatsApp Image 2026-06-08 at 20.26.35.jpeg` (selanjutnya disebut **REFERENSI GAYA**).

> Setiap blok kode di bawah **sudah final** — tinggal **copy seluruhnya** → paste ke Gemini. Style & negative sudah ditempel di dalam tiap prompt.
> Aset yang **belum punya foto** → cukup paste promptnya (kolom *Kirim ke Gemini* = "Tidak ada — prompt only", tapi tetap **lampirkan REFERENSI GAYA**).
> Aset yang **punya foto** → kirim **2 gambar**: (1) REFERENSI GAYA + (2) foto subjek.

---

## 0. Cara pakai (baca dulu — ini kunci konsistensi)

**Model:** Google **Gemini 2.5 Flash Image ("Nano Banana")**. Pakai **satu model ini saja** dari awal sampai akhir. Jangan campur ChatGPT/Midjourney — itu sumber utama hasil tidak konsisten.

**Aturan emas:**
1. **Selalu lampirkan REFERENSI GAYA** di setiap generate sebagai jangkar gaya.
2. **Satu subjek per gambar**, background **transparan** (untuk kucing/floral/divider) kecuali hero & gallery.
3. **Urutan kerja yang benar:**
   - **Langkah 1 — kunci gaya:** generate **kucing dulu satu per satu** (mereka sudah ada di REFERENSI GAYA, jadi paling gampang konsisten).
   - **Langkah 2:** setelah dapat 1 hasil yang kamu suka, **simpan** dan pakai sebagai **jangkar kedua** (lampirkan REFERENSI GAYA + hasil bagus itu) untuk aset berikutnya.
   - **Langkah 3:** hero & couple → floral/divider → story/Japan → gallery → closing.
4. **HEIC tidak bisa diupload** ke Gemini. File `.HEIC` (Hoshi, Shiro, Simba, kimho) **sudah dikonversi** ke JPG di folder `.preview/`. Kirim versi JPG itu.
5. Ekspor **PNG transparan** untuk aset tempel; **WebP** untuk hero/gallery (ringan, mobile-first).

---

## 1. Palet & identitas (acuan, bukan aset)

- **Palet:** ivory `#FBF7F0`, cream `#F3E9DC`, blush `#F3D9D6`, dusty pink `#D9A7A0`, soft peach `#F4C9A8`, sage `#A9B89A`, sky `#CFE0E8`. **Dilarang:** pink terang/fuchsia, warna bold/neon.
- **Pasangan:**
  - **Hanifah (mempelai wanita):** wanita muda Indonesia, wajah lembut & ramah, senyum hangat, **hijab taupe/greige** menjuntai ke satu bahu, **blus krem/putih lengan puff + celana putih longgar**, kalung emas tipis berlapis.
  - **Bashara (mempelai pria):** pria muda Indonesia, rambut hitam sedikit acak, senyum lebar hangat, **kemeja hitam/charcoal lengan dilipat**, celana hitam, jam tangan.
- **Hashtag:** `#BASHicallyHANI's` (aksen kecil, opsional).
- **7 kucing:** Jiro, Meng, Moju, Shiro, Simba, Hoshi, Kimho. *(Catatan: 6 kucing sudah tampil di REFERENSI GAYA; hanya **Moju** yang belum — andalkan fotonya sendiri.)*

---

## 2. KUCING — aset transparan (kerjakan PALING DULU)

Semua: **PNG transparan**, satu kucing per file, full-body, gaya REFERENSI GAYA. Buat **2 pose** per kucing bila perlu.

| Aset | Kirim ke Gemini |
| :-- | :-- |
| `cats/cat-jiro.png` | REFERENSI GAYA + `assets/cats/Jiro.jpg` |
| `cats/cat-meng.png` | REFERENSI GAYA + `assets/cats/Meng.jpg` |
| `cats/cat-moju.png` | REFERENSI GAYA + `assets/cats/Moju.PNG` |
| `cats/cat-shiro.png` | REFERENSI GAYA + `.preview/Shiro.jpg` |
| `cats/cat-simba.png` | REFERENSI GAYA + `.preview/Simba.jpg` |
| `cats/cat-hoshi.png` | REFERENSI GAYA + `.preview/Hoshi.jpg` |
| `cats/cat-kimho.png` | REFERENSI GAYA + `.preview/kimho.jpg` |

### cat-jiro.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the cat in the second photo as a storybook character, keeping its exact markings and identity.
Subject: a medium-long-haired tuxedo cat — black head and back, white muzzle and chin with a soft white blaze, white chest bib and white paws, warm amber-gold eyes, pink nose, wearing a thin red collar with a small silver name tag. Fluffy cheeks, sweet gentle expression.
Composition: full body, sitting upright, facing viewer, centered.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### cat-meng.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the cat in the second photo as a storybook character, keeping its identity. The source photo is black-and-white — render it as a classic black-and-white tuxedo cat.
Subject: a short-haired tuxedo cat — mostly black face and head with a small white chin and muzzle, white chest and white paws, pale yellow-green eyes, pink-and-black nose. Alert, curious, friendly expression.
Composition: full body, sitting, head slightly tilted, facing viewer.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### cat-moju.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the cat in the second photo as a storybook character, keeping its exact markings and identity.
Subject: a fluffy long-haired seal-point ragdoll cat — cream and white body, dark seal-brown face mask and ears, dark brown around the eyes, white muzzle with a black nose, bright blue eyes, a big fluffy ruff and tail, white chest and paws. Soft slightly-grumpy-but-cute expression.
Composition: full body, lying down in a relaxed loaf, facing viewer.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### cat-shiro.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the cat in the second photo as a storybook character, keeping its identity.
Subject: a pure white fluffy kitten — soft white fur, pink inner ears, pink nose, dark blue-grey eyes, small and round, very cute and delicate.
Composition: full body, sitting, looking slightly to the side, gentle pose.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### cat-simba.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the cat in the second photo as a storybook character, keeping its exact markings and identity. Rotate the source upright if needed.
Subject: an orange ginger tabby-and-white cat — ginger tabby stripes on head and back, white chest, belly and paws, warm amber-gold eyes, pink nose, wearing a collar with a small round tag. Friendly, content expression.
Composition: full body, lying down comfortably, facing viewer.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### cat-hoshi.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the cat in the second photo as a storybook character, keeping its exact markings and identity.
Subject: a brown-grey mackerel tabby cat — classic tabby 'M' stripe on the forehead, big round amber-green eyes, expressive curious face, pink-grey nose, mostly tabby with little to no white.
Composition: full body, sitting upright, big-eyed curious look at viewer.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### cat-kimho.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the cat in the second photo as a storybook character, keeping its exact markings and identity. Rotate the source upright if needed.
Subject: a brown-grey tabby-and-white cat — mackerel/spotted tabby coat, white chin and chest patch, green eyes, pink nose, wearing a collar with a small round tag. Calm, sweet expression.
Composition: full body, sitting, facing viewer.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### cat-peek.png (opsional, untuk closing/easter feel)
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: one of the couple's cats (the white fluffy kitten or a black-and-white tuxedo cat) peeking playfully from behind an edge, only head and two front paws visible.
Composition: peeking from the bottom-left corner.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

---

## 3. HERO & PASANGAN

### hero/hero-main.webp — ilustrasi utama (couple + kucing)
REFERENSI GAYA sebenarnya **sudah** = adegan hero. Dua opsi:
- **Opsi A (tercepat):** pakai REFERENSI GAYA langsung sebagai `hero-main` (crop ke portrait mobile).
- **Opsi B (regenerate, disarankan agar wajah mirip & ada Moju):** pakai prompt di bawah.

| Aset | Kirim ke Gemini |
| :-- | :-- |
| `hero/hero-main.webp` | REFERENSI GAYA + `assets/DSC05175.jpg` |

```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a young Indonesian couple standing together in a soft flower meadow at early morning, surrounded by their seven pet cats. The woman wears a taupe/greige hijab draped over one shoulder, a cream puff-sleeve blouse and white wide-leg pants, with a warm gentle smile. The man wears a dark charcoal button shirt with rolled sleeves and dark trousers, tousled black hair, warm big smile. Match their faces to the attached couple photo.
Cats: a white fluffy kitten, two black-and-white tuxedo cats, a fluffy seal-point ragdoll with blue eyes, an orange ginger-and-white cat, and two brown tabby cats — some held in their arms, some sitting in the grass around their feet.
Composition: vertical portrait, full scene fills a tall mobile screen, couple centered, soft asymmetrical wildflowers (pink cosmos, white daisies, yellow blooms, purple sprigs) in the foreground, gentle blue sky with two soft white doves and a couple of pink butterflies.
Background: full painted meadow scene (not transparent).
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### hero/hero-bg.webp — layer background terpisah (opsional)
*Kirim ke Gemini: REFERENSI GAYA saja (prompt only)*
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: an empty soft flower-meadow and sky background, no people, no cats — gentle blue morning sky with soft clouds, two faint white doves, a few pink butterflies, asymmetrical wildflowers along the bottom edge.
Composition: vertical portrait, lots of calm empty space in the upper-middle for text overlay.
Background: full painted scene.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### couple/couple-cutout.png — pasangan transparan (dipakai ulang)
| Aset | Kirim ke Gemini |
| :-- | :-- |
| `couple/couple-cutout.png` | REFERENSI GAYA + `assets/DSC05175.jpg` |
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: the same young Indonesian couple (taupe hijab + cream blouse + white pants; charcoal shirt + dark trousers), standing holding hands, both smiling warmly. Match faces to the attached photo.
Composition: full body, front-facing, standing side by side.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

---

## 4. DEKORASI — floral, drapery, arch, accents (PNG transparan)

*Semua: lampirkan REFERENSI GAYA sebagai jangkar gaya.*

### florals/floral-corner-tl.png  &  floral-corner-br.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a delicate asymmetrical corner cluster of soft wildflowers and greenery — pink cosmos, small white daisies, pale yellow blooms, tiny purple sprigs, sage-green leaves, loosely arranged like the florals in the reference.
Composition: arranged to sit in the TOP-LEFT corner (make a mirrored version for BOTTOM-RIGHT).
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### florals/floral-sprig.png — pemisah greenery kecil
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a small slim horizontal sprig of sage greenery with two or three tiny blush blossoms, used as a gentle section divider.
Composition: thin and horizontal, centered.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### florals/floral-border-full.png — bingkai bunga untuk Opening Gate
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a soft full-page floral frame border (oval/arch-leaning) of pastel wildflowers and sage greenery, with empty space in the center for a guest name.
Composition: vertical, frames the edges, center kept clear.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### florals/drapery-divider.png — pembatas kain putih
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a softly flowing length of sheer white/ivory drapery fabric, gently folded and translucent, like the wedding-backdrop drapery — used as a horizontal divider between sections.
Composition: wide and horizontal, fabric flowing left to right.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### florals/arch-frame.png — frame lengkung
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a soft arch (doorway-shaped) frame made of ivory drapery and asymmetrical pastel florals climbing one side, empty inside for cropping a photo or card.
Composition: vertical arch, hollow center.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### florals/accent-doves.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: two small soft white doves in flight, gentle and delicate.
Composition: tiny floating accents.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### florals/accent-butterflies.png
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: two or three small pastel pink butterflies.
Composition: tiny floating accents.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

---

## 5. SECTION ILLUSTRATIONS

*Semua: lampirkan REFERENSI GAYA sebagai jangkar gaya.*

### loading/loading-motif.png — layar loading 1–2 detik
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a single cozy motif — a small sleeping cat curled inside a soft wreath of pastel florals.
Composition: small, centered, lots of breathing room.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### gate/gate-illustration.png — Opening Gate (storybook page, TANPA kucing)
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a gentle storybook-page opening illustration — an open soft-paper book or a softly draped arch with pastel florals, calm and inviting, with a clear empty area in the center for the guest's name. No cats in this scene.
Composition: vertical, center kept clear for text.
Background: soft ivory paper texture (not transparent).
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### welcome/welcome-accent.png — pembuka pesan sambutan
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a small tender vignette — a pair of soft white doves above a loose sprig of pastel florals.
Composition: small centered accent above a text block.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### countdown/countdown-bg.webp — latar countdown
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a soft horizontal band of blurred pastel florals and faint flowing drapery, very calm, lots of soft empty space in the middle for countdown numbers.
Composition: wide horizontal banner.
Background: soft painted (not transparent).
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### story/story-meeting.png — pertemuan online (kampus)
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a whimsical small scene symbolizing meeting online through a university organization — two soft laptops/phone screens connected by a gentle dotted line and a tiny heart, with small florals around. Subtle and sweet, not literal.
Composition: small horizontal vignette.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### story/story-growing.png — tumbuh bersama
*Bisa pakai `couple/couple-cutout.png`, atau:*
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: the same couple walking together happily with two or three of their cats trailing behind, small and storybook-like.
Composition: small horizontal vignette, side view.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### story/story-motor.png — antar pulang ke kosan dengan motor (dipakai di chapter "Antar Pulang, Hati Semakin Dekat")
*Kirim ke Gemini: REFERENSI GAYA + `assets/DSC05175.jpg` (referensi wajah couple)*
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm golden late-afternoon light, soft diffused, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a small cute Indonesian motorcycle (motor bebek / scooter, dusty-pink-and-cream) parked by the side of a quiet street near a small kosan gate, with the same young Indonesian couple standing beside it — the man (charcoal shirt, dark trousers, tousled black hair) hands the woman (taupe hijab, cream blouse, white pants) her small backpack as she steps off. Warm late-afternoon light, a small wisp of wind in her hijab. Match faces to the attached couple photo. Subtle and sweet, not literal — a soft snapshot of an everyday ritual that became something more.
Composition: small horizontal vignette, three-quarter side view.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces, modern sport-motorcycle, helmet logos, brand names.
```

### story/japan-motif.png — mimpi studi di Jepang (Keio Hiyoshi + SIT Tokyo)
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a soft symbolic Japan scene for the couple's dream to study together after marriage — gentle sakura cherry blossoms, a calm university campus gate, a small train window, and a tiny silhouette of the same couple walking. Pastel and dreamy, not busy.
Composition: small horizontal vignette.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### story/story-jakarta.png — bekerja bersama di Jakarta
*Kirim ke Gemini: REFERENSI GAYA saja (prompt only, subjek sudah di deskripsi)*
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a soft symbolic Jakarta office/coworking vignette — two small laptops side by side on a wooden desk, a steaming mug of kopi, a tiny potted plant, and a small Jakarta skyline silhouette (Monas tip) in the far back window. Two small coffee-stained notebooks overlapping like a heart shape. Subtle and warm, not literal.
Composition: small horizontal vignette, desk-eye angle.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### story/story-ldr.png — LDR, Bashara di Tokyo
*Kirim ke Gemini: REFERENSI GAYA saja (prompt only)*
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a tender long-distance vignette — a small open laptop on a Japanese-style low desk showing a soft video-call window with a tiny silhouette of a woman in hijab, a pair of chopsticks and a small bowl of ramen on a tray beside it, a soft paper plane drifting toward a faint heart. Cozy, melancholic but hopeful.
Composition: small horizontal vignette.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### story/story-keio.png — Hanifah diterima di Keio, Hiyoshi
*Kirim ke Gemini: REFERENSI GAYA saja (prompt only)*
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a soft celebratory vignette — a pastel acceptance letter (with a tiny gold seal) half-open, soft cherry-blossom petals drifting around it, and a small silhouette of Keio University's Hiyoshi campus gate in Yokohama in the background, with a small soft sparkle. Joyful, hopeful, not busy.
Composition: small horizontal vignette, slightly elevated angle.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### story/story-together.png — melangkah bersama, studi di Jepang
*Kirim ke Gemini: REFERENSI GAYA + `assets/DSC05175.jpg`*
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a soft closing vignette of the same young Indonesian couple (taupe hijab + cream blouse + white pants; charcoal shirt + dark trousers) walking together hand-in-hand toward a soft horizon of sakura trees and a small Mt. Fuji silhouette in the far distance, two small suitcases behind them. Both smiling warmly, looking forward. Match faces to the attached couple photo.
Composition: small horizontal vignette, three-quarter back view.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### story/story-married.png — keputusan untuk menikah (dipakai di chapter "Memutuskan Menikah")
*Kirim ke Gemini: REFERENSI GAYA saja (prompt only)*
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a soft symbolic wedding vignette — two slender hands resting side by side, one with a delicate gold ring slipped on the ring finger, the other hand gently holding it; a few soft cherry-blossom petals drifting around, and a small ivory drapery ribbon tied loosely in the background. Modest, sincere, hopeful — not flashy.
Composition: small horizontal vignette, close-up on hands, centered.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces, realistic wedding photos, religious symbols.
```

### event/event-accent.png — aksen section acara
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a soft ivory drapery arch with a small asymmetrical pastel floral cluster on one side, framing space for date and venue text. A faint, gentle nod to a Bandung garden-restaurant setting.
Composition: vertical, center clear for text.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### event/map-pin.png — penanda peta custom (opsional)
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a cute soft map pin shaped like a little house with a blush roof and a tiny floral sprig.
Composition: small icon, centered.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### gift/gift-accent.png — aksen Tanda Kasih
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a gentle vignette of a soft pastel gift box tied with a sage ribbon beside a small envelope and a sprig of florals. Warm and modest, not flashy.
Composition: small centered accent.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### closing/closing-illustration.webp — penutup (gema hero)
| Aset | Kirim ke Gemini |
| :-- | :-- |
| `closing/closing-illustration.webp` | REFERENSI GAYA + `assets/DSC05175.jpg` |
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: the same couple and their cats in the same flower meadow as the hero, now in a calm warm closing light (soft golden early-evening), waving gently or sitting together with the cats. Emotional symmetry with the opening hero. Match faces to the attached photo.
Composition: vertical portrait, couple centered, cats around them, soft florals foreground.
Background: full painted meadow scene (not transparent).
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

---

## 6. GALLERY — foto prewedding (scrapbook)

Kamu punya **9 foto unik**. Karena seluruh situs bergaya ilustrasi, **disarankan stylize tiap foto** ke gaya REFERENSI GAYA agar konsisten. Kirim **REFERENSI GAYA + foto ybs** tiap kali. Tiap blok di bawah sudah lengkap.

### gallery/gallery-01.webp — `assets/DSC05175.jpg`
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the attached photo of the same couple as a soft storybook illustration, keeping their faces, outfits, and pose. They stand holding hands, both smiling broadly, on a clean white background.
Composition: keep the original framing.
Background: clean soft white.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### gallery/gallery-02.webp — `assets/DSC05174.jpg`
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the attached photo of the same couple as a soft storybook illustration, keeping their faces, outfits, and pose. They stand holding hands with calm, gentle expressions, on a clean white background.
Composition: keep the original framing.
Background: clean soft white.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### gallery/gallery-03.webp — `assets/DSC05178.jpeg` *(putar agar tegak)*
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the attached photo of the same couple as a soft storybook illustration, keeping their faces, outfits, and pose. Rotate upright if needed. They laugh together candidly on a clean white background.
Composition: keep the original framing.
Background: clean soft white.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### gallery/gallery-04.webp — `assets/DSC05186.jpeg` *(putar agar tegak)*
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the attached photo of the same couple as a soft storybook illustration, keeping their faces, outfits, and pose. Rotate upright if needed. They stand side by side glancing at each other on a clean white background.
Composition: keep the original framing.
Background: clean soft white.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### gallery/gallery-05.webp — `assets/DSC05191.jpeg`
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the attached photo of the same couple as a soft storybook illustration, keeping their faces, outfits, and pose. The woman holds a small pastel flower bouquet; the two of them stand together inside a soft round spotlight glow.
Composition: keep the original framing, couple inside a gentle circular pool of light.
Background: soft dark surround with a glowing circle of light behind the couple.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### gallery/gallery-06.webp — `assets/DSC05197.jpeg`
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the attached photo of the same couple as a soft storybook illustration, keeping their faces, outfits, and pose. The man leans down to offer a flower into the woman's hand, a tender romantic moment inside a soft round spotlight glow.
Composition: keep the original framing, couple inside a gentle circular pool of light.
Background: soft dark surround with a glowing circle of light behind the couple.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### gallery/gallery-07.webp — `assets/DSC05211.jpeg`
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the attached photo of the same couple as a soft storybook illustration, keeping their faces, outfits, and pose. A playful soft moment with a hand near the forehead, both relaxed, inside a soft round spotlight glow.
Composition: keep the original framing, couple inside a gentle circular pool of light.
Background: soft dark surround with a glowing circle of light behind the couple.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### gallery/gallery-08.webp — `assets/DSC05212.jpeg`
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the attached photo of the same couple as a soft storybook illustration, keeping their faces, outfits, and pose. Both laughing happily together inside a soft round spotlight glow.
Composition: keep the original framing, couple inside a gentle circular pool of light.
Background: soft dark surround with a glowing circle of light behind the couple.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

### gallery/gallery-09.webp — `assets/DSC05223.jpeg`
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Redraw the attached photo of the same couple as a soft storybook illustration, keeping their faces, outfits, and pose. Standing close together, calm and elegant, inside a soft round spotlight glow.
Composition: keep the original framing, couple inside a gentle circular pool of light.
Background: soft dark surround with a glowing circle of light behind the couple.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

**Catatan duplikat (jangan dipakai dobel):**
- `assets/DSC05175(1).jpg` = **identik** dengan `assets/DSC05175.jpg` → abaikan.
- `assets/DSC05191.jpg` ≠ `assets/DSC05191.jpeg` (versi berbeda) → cukup pakai `.jpeg`.

### gallery/gallery-frame.png — frame scrapbook (opsional, PNG transparan)
```
Soft hand-painted children's-storybook illustration, gouache and watercolor with subtle colored-pencil texture and gentle paper grain. Warm early-morning sunshine, soft diffused light, no harsh shadows. Muted pastel palette only: ivory, cream, blush pink, dusty pink, soft peach, sage green, soft sky blue. Tender, whimsical, cozy, wholesome mood. Delicate linework, soft rounded shapes. Exactly match the art style, color grading, brushwork, and softness of the attached reference illustration.
Subject: a soft scrapbook/polaroid photo frame with rounded corners, a hint of washi tape at one corner and a tiny floral sprig. Empty center to place a photo behind it.
Composition: square-ish frame, hollow center.
Background: fully transparent.
Avoid: photorealism, 3D render, CGI, harsh outlines, bold saturated colors, neon, fuchsia, hot pink, hard shadows, glossy plastic look, anime cel-shading, busy background, text, watermark, logo, extra fingers, deformed faces.
```

---

## 7. AUDIO (bukan generate gambar)

| Aset | Sumber |
| :-- | :-- |
| `audio/la-vie-en-rose.mp3` | **La Vie en Rose** — versi instrumental lembut. Kompres untuk mobile (mono / ~96–128kbps), volume rendah, loop halus. **Bukan dari Gemini.** |

---

## 8. CHECKLIST GENERATE (urut)

**A. Kunci gaya — kucing (7 + opsional peek)**
- [ ] cat-jiro · cat-meng · cat-moju · cat-shiro · cat-simba · cat-hoshi · cat-kimho · (cat-peek)

**B. Hero & pasangan**
- [ ] hero-main · hero-bg · couple-cutout

**C. Dekorasi transparan**
- [ ] floral-corner-tl/br · floral-sprig · floral-border-full · drapery-divider · arch-frame · accent-doves · accent-butterflies

**D. Section illustrations**
- [ ] loading-motif · gate-illustration · welcome-accent · countdown-bg · story-meeting · story-growing · story-motor · story-jakarta · story-ldr · story-keio · story-together · story-married · japan-motif · event-accent · map-pin · gift-accent · closing-illustration

**E. Gallery (9 foto stylized)**
- [ ] gallery-01 … gallery-09 · (gallery-frame)

**F. Audio**
- [ ] la-vie-en-rose.mp3 (terkompresi)

---

### Lampiran — file sumber yang sudah siap kirim
- Kucing JPG (asli): `assets/cats/Jiro.jpg`, `assets/cats/Meng.jpg`, `assets/cats/Moju.PNG`
- Kucing dari HEIC (sudah dikonversi): `.preview/Shiro.jpg`, `.preview/Simba.jpg`, `.preview/Hoshi.jpg`, `.preview/kimho.jpg`
- Prewedding: `assets/DSC05174.jpg`, `DSC05175.jpg`, `DSC05178.jpeg`, `DSC05186.jpeg`, `DSC05191.jpeg`, `DSC05197.jpeg`, `DSC05211.jpeg`, `DSC05212.jpeg`, `DSC05223.jpeg`
- Referensi gaya (lampirkan SELALU): `WhatsApp Image 2026-06-08 at 20.26.35.jpeg`
