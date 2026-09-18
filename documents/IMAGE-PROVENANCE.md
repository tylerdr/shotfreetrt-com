# Image Provenance

**Last updated:** 2026-09-17 (batch3 replaces batch2, same session)

## Source

- Generator: WEB (image generation), per `outputs/shotfreetrt-brand-brief.md`.
- Masters: `outputs/shotfreetrt-assets/batch3/sft-web-batch3-{01..10}.png` (kept outside this repository; not committed).
- Format: 1536×1024 PNG, RGBA (real alpha — transparent background outside a flat etched editorial subject with a soft light vignette).
- Used in this repo: `01, 02, 03, 04, 06, 07, 08, 09, 10`. **Not used:** `05` (botanical cards/shell — not TRT-relevant, per instruction).
- Superseded: batch2 (`outputs/shotfreetrt-assets/batch2/`). Its 7 webp derivatives were deleted from `public/media/`; `scripts/optimize-batch2-images.mjs` is left in place as a historical record but nothing references its output anymore.

## Processing

- Script: `scripts/optimize-batch3-images.mjs` (uses `sharp`, already a transitive dependency of Next.js).
- Operation: resize to 960×640 (`fit: cover`, same aspect ratio as the 1536×1024 source) and re-encode as WebP (`quality: 80`, `alphaQuality: 100`). **No cropping, background removal, or other image editing was performed** — resize/format-conversion only, and the real alpha channel is preserved rather than flattened onto a color.
- Output: `public/media/sft-web-batch3-{id}.webp`, 62-120KB each.
- Reproduce with: `node scripts/optimize-batch3-images.mjs` (requires the masters at the path above, sibling to this repo checkout).

## Placement

| Asset | Page | Component/location |
|---|---|---|
| `01` | Home (`/`) | Hero card banner, `src/app/(main)/page.tsx` |
| `02` | `/start-here` | Below the medical disclosure notice |
| `03` | `/about` | Below the intro paragraph |
| `04` | `/decision-guide` | Below the intro section |
| `06` | `/blog/trt-and-sleep-apnea` | Article hero, via `src/data/articleHeroImages.ts` |
| `07` | `/resources` | Below the disclosure notice |
| `08` | `/blog/testosterone-boosting-foods` | Article hero, via `src/data/articleHeroImages.ts` |
| `09` | `/guides/longevity-blueprint` | Below the download CTA |
| `10` | `/pricing` | Below the primary CTA |

## Mounting surface (new this pass)

Batch3 subjects are cut out on a transparent background but carry a soft light vignette. Placed directly on the site's dark background, that vignette read as a stark white glow rather than mounted artwork. Every placement now wraps the image in `src/components/EditorialImageFrame.tsx`, a warm-bone surface (`--editorial-frame: #E9E5DA`, a real CSS variable in `globals.css`, not a hardcoded hex in a component) that the image sits on. This is a CSS background behind the image, not a change to the image file — the WebP output still has its original alpha.

## Accessibility and honesty

- All nine are marked `alt=""` — they are purely decorative, not clinical diagrams, per the brand brief's own rule ("mark purely decorative cutouts alt=''").
- Captions are content-specific (e.g. "Understanding what a testosterone test actually reports") rather than describing the art's own production. The previous "decorative, not a clinical diagram" caption text — which exposed generation/production framing to site visitors — has been removed everywhere.
- Not claimed to have clean background removal in the sense of a finished clinical-diagram system — these remain decorative editorial illustrations for a dark, non-clinical site.

## Known follow-up

Browser visual QA of the mounted-surface treatment has not been performed in this session (no reliable browser access here); root owns final visual sign-off. Structural correctness (real alpha preserved, correct file sizes/dimensions, no unused generated assets) was verified with `sharp` metadata inspection during processing.
