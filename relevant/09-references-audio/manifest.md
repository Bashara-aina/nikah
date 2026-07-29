# Agent 09 — Cat Reference Photos + Audio

All visual claims below are from reading the exact file paths this turn. Audio metadata via `ffprobe`.

## Cat reference photos (archived reference set — NOT shipped directly)

Raw photographs. Per project rules, raw photos are never placed on the site directly; they were the source references for the illustrated cat cutouts. Kept as a clearly-labeled `cat-reference/` archive so cats can be re-illustrated/regenerated if needed. All 7 identities confirmed against named traits.

| file | type | identity/quality confirmed | verdict | reason |
| --- | --- | --- | --- | --- |
| cat-white-closeup-pink-ears-name-shiro.png | photo (ref) | Yes — white kitten, translucent pink ears, blue eyes. Matches "Shiro". Sharp close-up, good quality. | KEEP-reference | Confirmed identity; high-quality reference for regeneration. |
| cat-ragdoll-portrait-name-moju.png | photo (ref) | Yes — ragdoll, seal-point mask, blue eyes; collar tag reads "MOJU". Matches "Moju". Good quality. | KEEP-reference | Identity confirmed by tag + traits; strong reference. |
| cat-orange-white-on-couch-name-simba.png | photo (ref) | Yes — ginger-and-white tabby, white chest/paws, on couch. Matches "Simba". Good quality. | KEEP-reference | Confirmed identity; clear well-lit reference. |
| cat-black-white-lying-bw-name-meng.jpg | photo (ref) | Yes — tuxedo (black/white) with white blaze up the nose; image is black-and-white filtered. Matches "Meng (tuxedo blaze)". Sharp but small file (76 KB) + desaturated. | KEEP-reference | Identity confirmed. Lowest-fidelity of the set (B&W, tiny); usable as reference, colorway must come from elsewhere. |
| cat-black-white-pendant-name-jiro.jpg | photo (ref) | Yes — tuxedo, amber/gold eyes, red collar with pendant. Matches "Jiro (tuxedo amber+red collar)". Good quality. | KEEP-reference | Confirmed identity; distinguishes Jiro from Meng via amber eyes + red collar. |
| cat-kimho-portrait.png | photo (ref) | Yes — brown/warm tabby, green eyes, white chest, seated on table. Matches "Kimho (brown tabby)". High quality. | KEEP-reference | Confirmed identity; high-res reference. |
| cat-gray-tabby-in-blankets-name-hoshi.png | photo (ref) | Yes — grey tabby nestled in blankets, large green-gold eyes. Matches "Hoshi (grey tabby)". High quality. | KEEP-reference | Confirmed identity; distinct from Kimho (greyer, in bedding). |

## Audio (dedupe — keep one shipping copy)

Both files are the same track, identical duration 105.511 s.

| file | type | identity/quality confirmed | verdict | reason |
| --- | --- | --- | --- | --- |
| la-vie-en-rose.mp3 | audio | Yes — MP3, 105.511 s, 143.7 kbps, mono, 44.1 kHz, 1.90 MB (embedded PNG cover). | USE-ship | Already-compressed, smaller copy. Mono @ ~144 kbps is ample for a soft looping ambient background; 2.5× smaller download. Chosen shipping copy. |
| Daniela Andrade - La Vie En Rose (SPOTISAVER).mp3 | audio | Yes — MP3, 105.511 s, 358.4 kbps, stereo, 44.1 kHz, 4.73 MB (mjpeg cover). Raw original. | SKIP | Duplicate of the same track. Higher bitrate/stereo not worth 4.73 MB for a background loop. |

## Notes / mismatches

- No identity mismatches. All 7 filenames match the cat pictured.
- Meng's photo is black-and-white (desaturated) and by far the smallest (76 KB) — flagged so anyone regenerating the illustration knows the true fur colorway isn't derivable from this photo alone.
- Kimho and Hoshi are both tabbies but clearly distinct (Kimho = warmer brown, green eyes, on a table; Hoshi = greyer, in blankets).
- Audio: kept the compressed mono copy; if mastering later wants stereo, the SPOTISAVER original still lives in `nikah-web/content/`.
