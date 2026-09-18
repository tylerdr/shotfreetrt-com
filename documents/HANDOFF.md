# Session Handoff

**Session date:** 2026-09-17/18
**Branch:** `feat/shotfreetrt-trust-conversion-20260917`
**PR:** #9 (draft, https://github.com/tylerdr/shotfreetrt-com/pull/9) — updated by this pass, not merged, not deployed.
**Status:** build, typecheck, lint, and full test suite pass locally against this exact working tree.

## Second correction pass (this update): 5 confirmed issues from browser/independent review of `7e1122e`

1. **Mobile gutters (390px width):** `main { padding: 36px 0 72px; }` in `globals.css` was unlayered, so its implicit `0` for left/right beat Tailwind's `px-4`/`sm:px-6` on `<main>` — content sat flush against the viewport edge. Fixed to longhand `padding-top`/`padding-bottom` only (no horizontal declaration to conflict with); print rule untouched.
2. **Desktop hero fold (1280×720):** homepage hero `grid items-center` vertically centered the copy against a taller sibling panel, pushing the primary quiz CTA below the fold. Changed to `items-start`.
3. **CTA contrast:** white text on `#3B82F6` is ~3.68:1 (fails WCAG AA 4.5:1). Added `--action: #2E5FA7` (white-on-it is ~6.3:1), used only by `Button`'s default variant — ordinary blue links/labels and other `bg-primary` UI are untouched, per instruction not to darken those.
4. **Answer-dependent Link prefetch:** the quiz result screen's reading-path and action links have answer-dependent hrefs; added `prefetch={false}` to all three so Next.js doesn't auto-request them (and thus leak inferred answers) before a deliberate click.
5. **Privacy copy vs. Print/Save PDF:** "never sent to a server, saved to a file, or included in analytics" contradicted the offered print/save button. Qualified to "never automatically" + a note that user-initiated printing/saving is available.

Verified in compiled output, not just source: `main{padding-top:36px;padding-bottom:72px}` (no horizontal decl); `--action:#2e5fa7`/`bg-action` rules present; prerendered homepage HTML has `grid items-start gap-8` and the hero CTA using `bg-action`. A separate scoped agent restored branded global 404 handling with `experimental.globalNotFound` in `next.config.mjs` and `src/app/global-not-found.tsx`; these were agent-authored changes, included in this build and independently reviewed. Full detail: `documents/CHANGELOG.md`.

`tsc` clean · `eslint .` 0 errors (1 pre-existing) · `npm test` 48/48 (43 preserved + 5 new) · `next build` 179/179 pages. No browser QA performed (still no browser access here) — root/controller owns that.

## First correction pass

This was a bounded correction pass on top of commit `022ab08` (the quiz rebuild + trust/privacy session), driven by browser QA and an independent artifact review that found real gaps in that commit. Nothing from `022ab08` was discarded; this pass fixes specific, named defects in it. Root retains browser and deploy authority — no browser QA was performed here (see release gates below).

## Fixed this pass

### 1. Privacy: real route isolation, not a pathname check
`022ab08`'s GA/analytics exemption for `/quiz/*` and `/decision-guide` only skipped firing a `page_view` event by pathname — it did not stop GA's script from loading, did not stop GA's own automatic engagement pings once loaded, and could not "unload" GA if a user arrived via client-side navigation from a page where it had already loaded.

Fix: split the single root layout into two route groups, each with its own root layout:
- `src/app/(main)/layout.tsx` — every route except quiz/decision-guide. Renders `GoogleAnalytics` and the Supabase `AnalyticsProvider`.
- `src/app/(isolated)/layout.tsx` — `/quiz/*` and `/decision-guide`. Renders neither.

Because these are two distinct root layouts (each its own `<html>`/`<body>`), Next.js performs a full document navigation whenever a link crosses between them — this is documented Next.js behavior for multi-root-layout apps, not a workaround. Confirmed by rebuilding with a test `NEXT_PUBLIC_GA_MEASUREMENT_ID` and diffing the prerendered HTML: `googletagmanager` appears on `/` and `/pricing`, and is completely absent from `/quiz/healthspan` and `/decision-guide`. `isAnalyticsExemptPath()` in `src/lib/analytics.ts` is retained as a second, defensive layer (documented as such in comments), not the primary guarantee.

Shared chrome (header/nav/footer) extracted to `src/components/SiteChrome.tsx`; fonts to `src/app/fonts.ts`; shared metadata (favicon, GSC verification token, metadataBase) to `src/app/site-metadata.ts` — both layouts import these so nothing drifts between them.

### 2. Conversion/accessibility-critical CSS bug (blue-on-blue button text)
`src/app/globals.css` had an unlayered `a { color: #60A5FA }` rule. Cascade layers ignore selector specificity and source order — an unlayered rule always beats a layered one — so this rule was beating Tailwind's `@layer utilities` `text-primary-foreground` class on every `Button asChild` anchor (e.g. the homepage's primary quiz CTA), rendering the button text in link-blue instead of its variant's intended color. Fixed by moving the rule into `@layer base`. Verified in the compiled CSS (`.next/static/chunks/*.css`) that `a{color:...}` now sits in the `base` layer and `.text-primary-foreground` sits in `utilities`, which is declared later/higher-priority.

### 3. Quiz logic corrections
- `isQuizComplete()` was a truthy check (`Boolean(answers[id])`); it now validates the answer is one of that question's real option ids.
- Two prioritized-question reasons didn't match their trigger answer: "tested but unsure of results" no longer claims "no confirmed diagnosis yet" (separate, accurate reason); "already paying" no longer claims "no cost picture yet" (now: confirm nothing was left out of the existing quote).
- Added focus management: the question/result heading receives focus on every transition (`src/components/quiz/DecisionQuizEngine.tsx`), so keyboard and screen-reader users get an announcement on Back/Next/result.

### 4. Quiz privacy copy corrected twice
- First: replaced "No symptoms, lab values, or health details are collected" (false — the quiz asks about symptoms/testing/fertility) with accurate wording that distinguishes collection (happens, in memory) from transmission (never happens).
- Second (independent review, after the first fix): removed an absolute "...or leave the page" claim, since browser back/forward cache can preserve an already-rendered document — leaving a page does not guarantee destruction. The promise is now scoped to what's actually true: never sent to a server/storage/analytics, and refreshing clears it.

### 5. Restored `/guides/longevity-blueprint/success` redirect
`022ab08` deleted this page along with the removed purchase flow, which would 404 old inbound links (some carrying a stale `?session_id=`). Restored as a compatibility redirect to `/guides/longevity-blueprint` — no "purchase verified" claim, just a redirect.

### 6. Homepage OpenGraph image
The homepage's own `openGraph` metadata object overrode the root layout's entirely (Next.js does not deep-merge metadata objects across levels), silently dropping the 1024×1024 OG image on `/`. Added it explicitly to the homepage's own `openGraph.images`.

### 7. AliveLongevity / PeakedLabs framing corrected
Both are the user's own sister sites, not unaffiliated third parties. `022ab08` had added copy explicitly claiming "not a ShotFreeTRT recommendation or affiliated service" for AliveLongevity and framed PeakedLabs as an "independent look" — both false. Copy on `/about`, `/start-here`, `/resources` now says "another site in our network" without implying clinical endorsement.

### 8. Batch3 images replace all batch2 placements
Ten new WEB-generated originals at `outputs/shotfreetrt-assets/batch3/` (flat etched editorial style, soft light vignette, real alpha). Used 9 of 10 (05 omitted — botanical/shell, not TRT-relevant) per the verified mapping:

| Asset | Placement |
|---|---|
| 01 | Home hero |
| 02 | `/start-here` |
| 03 | `/about` |
| 04 | `/decision-guide` |
| 06 | `/blog/trt-and-sleep-apnea` |
| 07 | `/resources` |
| 08 | `/blog/testosterone-boosting-foods` |
| 09 | `/guides/longevity-blueprint` |
| 10 | `/pricing` |

`scripts/optimize-batch3-images.mjs` (sharp, resize-only to 960×640, alpha preserved via WebP — no flattening, no background removal, no additional generation). Built `src/components/EditorialImageFrame.tsx`, which mounts each image on a warm-bone surface (`--editorial-frame: #E9E5DA`, added as a real CSS variable per the theming convention, not a hardcoded hex in a component) instead of letting the vignette float directly on the dark site background. All "decorative, not a clinical diagram" production-process captions replaced with content-specific ones (or omitted); `alt=""` retained since the art is purely decorative. Deleted the now-unreferenced batch2 webp files from `public/media/`.

### 9. Longevity Blueprint PDF regenerated (was stale and actively misleading)
Prior PDF had: a `$24` price on a page now presented as free, no ShotFreeTRT branding or links on the first/last page, a metadata title leaking a localhost URL, and unqualified outcome claims ("Most adults can generate major improvements..." with bare 2-4/8-12 week timelines). No PDF-rendering toolchain existed in this repo (`pandoc` is installed but has no PDF engine — `pdflatex`/`wkhtmltopdf`/etc. are all absent). The bundled Python runtime at `/Users/td/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3` has `reportlab`/`pypdf`; wrote `scripts/generate-longevity-blueprint-pdf.py` (ReportLab Platypus — parses the specific Markdown constructs this doc uses: headings, blockquotes, pipe tables, bullet/numbered/checkbox lists, inline bold/italic/links) to regenerate it. Corrected the Markdown source (`guides/longevity-blueprint.md`): price line → "Free" + a branding/CTA line linking to the quiz and decision guide; qualified the two outcome-guarantee passages; added an "About ShotFreeTRT" closing section with quiz/decision-guide links. Output has a clean title (`The Longevity Blueprint (2026 Edition) — ShotFreeTRT`), a branded footer with real page numbers on every page, and no stale price/claims. All three served copies (`guides/longevity-blueprint.pdf`, `public/longevity-blueprint.pdf`, `public/guides/longevity-blueprint.pdf`) are byte-identical (built once, copied). QA'd with `pdfinfo`, `pdftotext -layout`, and `pdftoppm` (rendered page 1 and the last page to PNG and visually inspected).

The guide's on-page CTA and `GuidePromoBanner.tsx` still link to the PDF (`/longevity-blueprint.pdf`, `/guides/longevity-blueprint.pdf`) — restored to the original behavior now that the PDF is actually correct.

## Verification evidence (this exact working tree)

- `npx tsc --noEmit -p tsconfig.json`: **clean, 0 errors** (ran after `rm -rf .next` to clear stale `.next/types`).
- `npm run lint` (`eslint .`): **0 errors**, 1 pre-existing warning (`commitlint.config.js`, unrelated, not touched).
- `npm test`: **43/43 pass** (was 39; added tests for route isolation, the restored success redirect, the corrected PDF source, and the corrected quiz privacy copy; updated all path assertions for the `(main)`/`(isolated)` route-group move).
- `npm run build` (`next build`, Turbopack): **success, 179/179 static/SSG pages** (was 178 — `+1` for the restored `/guides/longevity-blueprint/success` redirect page). Verified separately with a test GA id that GA's script is present in `/` and `/pricing`'s prerendered HTML and absent from `/quiz/healthspan` and `/decision-guide`'s, then rebuilt clean without the test env var.
- PDF QA: `pdfinfo` (clean title/metadata, 31 pages), `pdftotext -layout` (no `$24`, no `localhost`, no unqualified "major improvements" claim, branding present on page 1 and the last page, footer page numbers present on every page), `pdftoppm` rendering of page 1 and page 31 visually inspected.

## Release gates still open (unchanged unless noted)

1. **Browser/mobile/print QA of the exact PR head — still not performed.** No browser access in this environment; root owns this. In particular: visually confirm the button-contrast fix and the route-isolation full-page-reload behavior in an actual browser (structural/CSS-layer proof was done here; DOM-level confirmation was not).
2. Clinical/editorial triage of the legacy article corpus remains open (unchanged from prior handoffs).
3. Commerce/infrastructure audit (Stripe/email) remains open. Production has only a GA measurement ID configured — no Stripe, entitlement, or email secret. Nothing in this pass activates any payment or email path. The existing $19 product referenced anywhere is AliveLongevity's, not repurposed or activated here.
4. Tyler's commercial-path clarification (what, if anything, gets sold and how) is still pending.

## Files changed this pass

See `git diff --stat` / `git log` on this branch. Notable: `src/app/layout.tsx` deleted and replaced by `src/app/(main)/layout.tsx` + `src/app/(isolated)/layout.tsx` + `src/app/fonts.ts` + `src/app/site-metadata.ts` + `src/components/SiteChrome.tsx`; all non-quiz/decision-guide routes moved under `src/app/(main)/`; quiz/decision-guide moved under `src/app/(isolated)/`; new `src/components/EditorialImageFrame.tsx`; new `scripts/optimize-batch3-images.mjs` and `scripts/generate-longevity-blueprint-pdf.py`; `guides/longevity-blueprint.md` and all three PDF copies regenerated; batch2 webp assets deleted, batch3 added.
