# Changelog

*Append-only, newest first. Never edit old entries.*

---

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
