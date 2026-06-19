# TODO — Aset yang belum di-generate

> 5 ilustrasi story direferensikan di `nikah-web/lib/copy.ts` (chapters 2–6) **tapi file-nya belum pernah di-generate**. Akan 404 di `/story` sampai ada. Prompt siap-pakai ada di `docs/07-gemini-asset-prompts.md`.

## Yang harus di-generate (5)

| File | Prompt di `07` | Sumber foto |
| :-- | :-- | :-- |
| `assets/illustrations/story-motor.png` | `07 §5 — story-motor` | REFERENSI GAYA + `assets/_source/prewedding/DSC05175.jpg` |
| `assets/illustrations/story-jakarta.png` | `07 §5 — story-jakarta` | REFERENSI GAYA saja |
| `assets/illustrations/story-ldr.png` | `07 §5 — story-ldr` | REFERENSI GAYA saja |
| `assets/illustrations/story-keio.png` | `07 §5 — story-keio` | REFERENSI GAYA saja |
| `assets/illustrations/story-married.png` | `07 §5 — story-married` | REFERENSI GAYA saja |

**REFERENSI GAYA** = `assets/scenes/hero-main.webp` (per README).

## Cara generate (urut)

1. Buka **Gemini 2.5 Flash Image** (`Nano Banana`).
2. Lampirkan `assets/scenes/hero-main.webp` + (jika ada) foto subjek di kolom upload.
3. Copy-paste prompt dari `docs/07 §5` blok yang relevan.
4. Background **transparan** (kecuali eksplisit disebut "not transparent").
5. Simpan ke `assets/illustrations/<nama-file>.png`.
6. Jalankan dari `nikah-web/`:

   ```bash
   npm run copy-assets    # mirror assets/ -> public/assets/
   ```

7. Verifikasi: `npm run dev` → scroll ke `/story` → 5 chapter ilustrasi tampil.

## Sementara: fallback aman

Situs **tetap jalan** tanpa 5 aset ini — `<Image>` Next.js akan render alt-text saja. Tapi Story section akan terlihat kosong untuk chapter 2–6. **Generate sebelum launch.**
