# Changelog

*Append-only, newest first. Never edit old entries.*

---

## 2026-09-18 — Release closeout archive (Codex orchestrator)

**Branch:** `chore/shotfreetrt-release-closeout-20260917` from merged production `main` at `9c0b6ad7717ca231930cafc62bbd806672f99f20`

**Recorded receipt:** PRs 8 and 9 are merged; production deployment `dpl_5xKdoezKjmnsp5fewm4rZryQkXGg` is READY. The merged release passed 48/48 tests, TypeScript, lint, and build. Local production-build browser proof against the identical source passed mobile, desktop, full six-question quiz, network/privacy, quote-planner, and PDF flows. Live smoke checks passed for homepage/media/mobile, quiz entry and progression with no analytics scripts, HTTP PDF/redirect, GSC, and sitemap; Search Console ownership is verified and the sitemap contains 170 pages.

**Archived:** the ShotFreeTRT brand brief and image prompts are now under `documents/brand/`. Nine release asset masters from Batch3 (01, 02, 03, 04, 06, 07, 08, 09, 10) are under `design/source/`; seven visible placements were confirmed, and earlier drafts, logs, secrets, and generated caches were excluded.

**Remaining gates:** revenue, email, and payment activation remain disabled pending an approved and verified commercial path. Medical/editorial review of the legacy article corpus remains open.

---

## 2026-09-18 — Second correction pass: mobile gutters, hero fold, CTA contrast, Link prefetch, print/save copy (Claude Code)

**Branch:** feat/shotfreetrt-trust-conversion-20260917 (same draft PR #9; not merged)

**Context:** five confirmed release issues found by browser/independent review of the prior correction pass (`7e1122e`).

**Shipped:**
- Mobile gutters: `main { padding: 36px 0 72px; }` in `globals.css` was unlayered, so its implicit `0` for left/right beat Tailwind's `px-4`/`sm:px-6` on the actual `<main>` element — copy/buttons sat flush against the viewport edge at 390px width. Changed to longhand `padding-top`/`padding-bottom` only, so it no longer declares (and can't conflict on) the horizontal axis; print media query untouched.
- Homepage hero: `grid items-center` vertically centered the copy column against a taller benefits panel, pushing the primary quiz CTA below the fold at 1280×720. Changed to `items-start`.
- CTA contrast: white text on the primary button's `#3B82F6` background is ~3.68:1, below WCAG AA's 4.5:1. Added a new `--action: #2E5FA7` token (white-on-`--action` is ~6.3:1) used only by `Button`'s default variant, so ordinary `text-primary` links/labels and other `bg-primary` UI (progress, checkboxes) — not flagged, not touched — keep the original blue.
- Quiz result screen's reading-path and primary/secondary action `<Link>`s have hrefs that depend on quiz answers (e.g. a fertility article only renders if fertility priority was answered high/some). Added `prefetch={false}` to all three so Next.js doesn't automatically request those answer-dependent URLs before a deliberate click.
- Quiz privacy copy said answers are "never sent to a server, saved to a file, or included in analytics" while also offering a "Print or save as PDF" button — contradictory. Qualified to "never automatically sent/saved/analyzed," with an explicit note that printing/saving is available if the user chooses it.

**Verification:** `tsc --noEmit` clean; `eslint .` 0 errors (1 pre-existing unrelated warning); `npm test` 48/48 pass (43 preserved + 5 new, one per fix above); `next build` succeeds, 179/179 pages. Verified in the compiled output (not just source): `main{padding-top:36px;padding-bottom:72px}` with no horizontal declaration; `--action:#2e5fa7` and `bg-action` rules present; prerendered homepage HTML shows `grid items-start gap-8` and the hero CTA using `bg-action`. A separate scoped agent restored branded global 404 handling with `experimental.globalNotFound` in `next.config.mjs` and `src/app/global-not-found.tsx`; these were agent-authored changes, included in this build and independently reviewed. 

**Follow-up:** none of this pass's fixes are visually confirmed in a real browser (still no browser access here); root/controller owns that verification.

## 2026-09-17 — Correction pass: route-isolated privacy, batch3 images, button-contrast fix, corrected Blueprint PDF (Claude Code)

**Branch:** feat/shotfreetrt-trust-conversion-20260917 (continuation of the same draft PR #9; not merged)

**Context:** bounded correction pass on top of commit `022ab08`, driven by browser QA and an independent artifact review found after that commit.

**Shipped:**
- **Real route isolation for privacy, not just a pathname check.** Split `src/app/layout.tsx` into two root layouts via route groups: `(main)` (everything else — keeps `GoogleAnalytics` and the Supabase `AnalyticsProvider`) and `(isolated)` (`/quiz/*`, `/decision-guide` — renders neither). Distinct root layouts force Next.js to do a full document navigation whenever a link crosses between them, so GA's script/dataLayer genuinely never loads on the isolated routes — confirmed by rebuilding with a test GA id and diffing the prerendered HTML (`googletagmanager` present on `/`, `/pricing`; absent on `/quiz/healthspan`, `/decision-guide`). Previously the same component tree rendered everywhere and only skipped firing a `page_view` event by pathname, which doesn't stop GA's script from having already loaded via client-side navigation, or stop its own automatic engagement pings.
- **Fixed a conversion/accessibility-critical CSS bug:** an unlayered `a { color: #60A5FA }` rule in `globals.css` was beating Tailwind's `@layer utilities` `text-primary-foreground` on every `Button asChild` anchor (cascade layers ignore selector specificity/order — unlayered always wins), rendering primary CTA button text as link-blue on a blue background. Moved the rule into `@layer base`; verified in the compiled CSS that the rule now sits below `@layer utilities` in layer priority.
- **Quiz logic corrections:** `isQuizComplete` now validates that each answer is one of that question's real option ids (was a truthy check, so any non-empty string passed). Fixed two prioritized-question reasons that didn't match their trigger: "tested but unsure of results" no longer claims "no confirmed diagnosis" (gets its own accurate reason), and "already paying" no longer claims "no cost picture yet" (now: confirm nothing was left out of the existing quote). Added focus management (question and result headings receive focus on transition) for keyboard/screen-reader users.
- **Quiz privacy copy corrected twice:** first pass replaced the false "no symptoms/health details are collected" claim (the quiz asks about symptoms/testing/fertility — it doesn't transmit or store them, but it does collect them in memory) with accurate wording. A second correction removed an absolute "disappear the moment you...leave the page" claim, since bfcache can preserve an already-rendered document; the promise is now scoped to what's actually true (never sent to a server, refreshing clears it).
- **Restored the `/guides/longevity-blueprint/success` redirect** (deleted in `022ab08` along with the purchase flow) as a compatibility redirect to the real guide page, so old links with a stale `session_id` don't 404 or imply a verified purchase.
- **Fixed homepage OpenGraph image loss:** the homepage's own `openGraph` metadata object was overriding the root layout's (Next.js doesn't deep-merge metadata objects across levels), silently dropping the 1024×1024 OG image on `/`. Added it explicitly.
- **Corrected AliveLongevity/PeakedLabs framing:** both are the user's own sister sites, not independent/unaffiliated third parties as previously (incorrectly) stated. Copy on `/about`, `/start-here`, and `/resources` now labels them as "another site in our network" instead of claiming no affiliation or false independence.
- **Batch3 images replace all batch2 placements**, using the verified asset mapping (01 home, 02 start-here, 03 about, 04 decision-guide, 06 sleep article, 07 resources, 08 foods article, 09 Blueprint guide, 10 pricing; 05 omitted as not TRT-relevant). Built `scripts/optimize-batch3-images.mjs` (sharp, resize-only, alpha preserved — no flattening or background removal) and a shared `EditorialImageFrame` component that mounts each image on a warm-bone (`--editorial-frame: #E9E5DA`, CSS variable per the theming convention) surface instead of letting their light vignette float directly on the dark site background. Captions rewritten to be content-specific instead of describing the art's own production ("decorative, not a clinical diagram" removed everywhere). Deleted the now-unreferenced batch2 webp files.
- **Regenerated the Longevity Blueprint PDF** (previously stale: `$24` price on a page now presented as free, no ShotFreeTRT branding/links, a localhost-leaking metadata title, and unqualified outcome claims like "most adults can generate major improvements" with bare 2-4/8-12 week timelines). Corrected the Markdown source (`guides/longevity-blueprint.md`) and built `scripts/generate-longevity-blueprint-pdf.py` (ReportLab Platypus) to render it with clean metadata, a branded header/footer with real page numbers, and branding/CTA content on both the first and last page. All three served copies (`guides/`, `public/`, `public/guides/`) are now generated once and byte-copied, so they can't drift. QA'd with `pdfinfo`/`pdftotext`/`pdftoppm`.

**Verification:** `tsc --noEmit` clean; `eslint .` 0 errors (1 pre-existing unrelated warning); `npm test` 43/43 pass (was 39 — added tests for route isolation, the restored redirect, the corrected PDF source, and the quiz privacy-copy wording); `next build` succeeds, 179/179 pages (was 178; `+1` for the restored `success` redirect page).

**Follow-up (unchanged or newly deferred):** browser/mobile/print QA of this exact head still needs a real browser (root retains that); clinical/editorial triage of the legacy article corpus remains open; commerce/infrastructure audit (Stripe/email) remains open — this pass does not activate any payment or email path.

## 2026-09-17 — Deterministic decision quiz, trust/privacy fixes, batch2 images, baseline gate repair (Claude Code)

**Branch:** feat/shotfreetrt-trust-conversion-20260917 (draft PR against main; not merged)

**Shipped:**
- Rebuilt the TRT decision quiz from scratch as a deterministic, non-clinical funnel: 6 questions (intent, testing stage, fertility priority, route preference, cost clarity, timing), an in-memory-only `DecisionQuizEngine`, and a `DecisionBrief` result (situation summary, prioritized checklist with reasons, reading paths, print/save-as-PDF). Retired the old heuristic scorer (numeric "TRT candidacy score," "Roast Me" mode, lab-input "advanced" quiz) — deleted the API route, engine components, and lib modules that produced it. `/quiz`, `/quiz/healthspan/advanced`, and `/quiz/healthspan/result/[shareId]` all still resolve (redirect into the real quiz); `/quiz/healthspan` now renders it.
- Made the homepage quiz-first (primary CTA) with the free decision guide as secondary; wired contextual quiz links into the blog template, blog listing, resources, and start-here pages.
- Made the "local-only" privacy promise on `/quiz/*` and `/decision-guide` actually true: both the custom Supabase pageview tracker and Google Analytics now skip those paths entirely, including the automatic first-load GA pageview.
- Newsletter capture now fails closed: `/api/newsletter` no longer writes to disk and no longer fakes a success response; it always returns 503 with a link to the real free guide. Removed the dead `<form action="#">` newsletter component in favor of a real CTA link.
- Removed the misleading "$19" purchase framing for the Longevity Blueprint guide, whose PDF was already public with no real payment gate; deleted the unused BuyButton/checkout/Stripe code path rather than leaving it half-wired.
- Corrected `/about`, `/start-here`, and `/resources` from a generic "healthspan"/"7-day natural T quickstart" scope to the actual decision-first product, and added one verified contextual reference each to PeakedLabs and AliveLongevity per the brand brief's cross-site linking policy.
- Integrated the 7 approved batch2 illustrations (resize/format only, via `sharp`; masters kept outside the repo) into the home hero, decision-guide, resources, pricing, and two blog articles — provisional pending root's cleaner replacement batch.
- Repaired the real baseline: removed `next.config.mjs`'s `ignoreBuildErrors`, fixed the single typo (`readingTime`→`readTime`) that was cascading into ~80 spurious type errors across `src/data/articles.ts`, replaced the no-longer-existent `next lint` with a working `eslint` setup, corrected the OG image's declared dimensions to match the real file, and added a print stylesheet. `tsc --noEmit`, `eslint .`, and `next build` all pass clean; 39/39 tests pass (19 pre-existing + 20 new).

**Verification:** see `documents/HANDOFF.md` for exact commands and output.

**Follow-up:** browser/mobile/print QA (no browser access in this session), root's cleaner image batch swap, root's commerce/infrastructure audit before any email/payment provider is re-enabled.

## 2026-09-17 — Google Search Console verification metadata (Codex orchestrator)

**Branch:** fix/gsc-site-verification-20260917 (scoped PR; not merged)

**Prepared:**
- Added the requested Google Search Console verification token through Next metadata in `src/app/layout.tsx`.
- Preserved the canonical dirty August commerce and analytics worktree by creating the change from `origin/main` in an isolated worktree.

**Verification:** `npm ci --ignore-scripts`, `npm run build`, generated head inspection, and `git diff --check` passed. The existing `next lint` script fails before linting, and full typecheck retains pre-existing article data shape errors.

**Follow-up:** independently review the PR, merge and deploy through the parent gate, then verify the live head and complete the GSC property action.

## 2026-03-31 — testosterone-and-anemia article shipped (Codex session)

**Branch:** feature/design-overhaul-light-theme -> deployed locally to production alias
**Tyler's prompt:** "Wire a new article into the shotfreetrt.com production site and deploy it."

**Shipped:**
- `src/data/testosteroneAndAnemia.ts` — new testosterone/anemia diagnostic article with required tables, FAQ, and internal links
- `src/data/articles.ts` — registered the new article in route generation and lookup helpers
- `documents/PLAN-testosterone-and-anemia-2026-03-31.md` — saved execution plan for this ship

**Verification:**
- `npm run build` passed locally
- Vercel deployment ready: `https://shotfreetrt-dinlkwvqb-tai-durden-ai.vercel.app`
- Production alias confirmed: `https://shotfreetrt.com`
- Live route check: `https://shotfreetrt.com/blog/testosterone-and-anemia` -> HTTP 200

**Decisions:** none
**Follow-up / tech debt created:** none

---

## YYYY-MM-DD — [Brief description] (Claude Code / Codex session)

**Branch:** feature/name → merged to main (PR #N)
**Tyler's prompt:** "[verbatim or close paraphrase of the instruction that kicked this off]"

**Shipped:**
- `path/to/file.ts` — [what it does]
- `path/to/other.ts` — [what it does]

**Decisions:** ADR-001
**Follow-up / tech debt created:** [Any items added to BACKLOG.md]

---
