# Image Provenance

**Last updated:** 2026-09-17

## Source

- Generator: ChatGPT WEB (image generation), per `outputs/shotfreetrt-brand-brief.md`.
- Masters: `outputs/shotfreetrt-assets/batch2/sft-web-batch2-{01..10}.png` (kept outside this repository; not committed).
- Format: 1536×1024 PNG, RGBA (transparent outside a soft artistic vignette).
- Used in this repo: `01, 02, 04, 05, 06, 08, 09`. **Not used:** `03, 07, 10` (explicitly excluded by instruction).

## Processing

- Script: `scripts/optimize-batch2-images.mjs` (uses `sharp`, already a transitive dependency of Next.js).
- Operation: resize to 960×640 (`fit: cover`) and re-encode as WebP, quality 75. **No cropping, background removal, or other image editing was performed** — resize/format-conversion only, per instruction.
- Output: `public/media/sft-web-batch2-{id}.webp`, 25-83KB each (404KB total across all 7).
- Reproduce with: `node scripts/optimize-batch2-images.mjs` (requires the masters at the path above, sibling to this repo checkout).

## Placement

| Asset | Page | Component/location |
|---|---|---|
| `01` | Home (`/`) | Hero card banner, `src/app/page.tsx` |
| `04` | `/decision-guide` | Below the intro section |
| `02` | `/resources` | Below the disclosure notice |
| `05` | `/pricing` | Below the primary CTA |
| `06` | `/blog/trt-and-sleep-apnea` | Article hero, via `src/data/articleHeroImages.ts` |
| `08` | `/blog/testosterone-boosting-foods` | Article hero, via `src/data/articleHeroImages.ts` |
| `09` | `/guides/longevity-blueprint` | Below the download CTA |

## Accessibility and honesty

- All seven are marked `alt=""` — they are purely decorative vignettes, not clinical diagrams, per the brand brief's own rule ("mark purely decorative cutouts alt=''").
- Each placement carries a visible caption stating it is a "decorative illustration ... not a clinical diagram." No caption implies clinical accuracy, an endorsement, or a diagnostic relationship.
- These are **not** claimed to have clean background removal — batch2 has a visible soft glow/vignette, which is expected and accepted for decorative use on the site's existing dark backgrounds, not presented as a finished clinical-diagram illustration system.

## Known follow-up

Root/orchestrator has a new, cleaner image batch in progress and will swap these in when ready. **Treat this integration as provisional.** Do not treat the presence of an alpha channel as proof of a good visual result on its own — visual QA in a browser has not been performed in this session (no browser access here).
