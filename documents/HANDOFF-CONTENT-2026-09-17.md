# PR #10 content workstream handoff

**Branch:** `feature/evidence-guides-roadmap-20260917`  
**PR:** https://github.com/tylerdr/shotfreetrt-com/pull/10  
**Base:** merged main `9c0b6ad7717ca231930cafc62bbd806672f99f20` (PR #9)  
**Code commit:** `281dd8cdf38ec2290ff1ec43b32f0f86cb5291e6`  
**Status:** draft follow-up; no merge or production promotion by this workstream.

This file supplements rather than overwrites `HANDOFF.md`, which records the upstream launch. PR #9 was merged while this work was in progress; the new tree was rebuilt on its final main commit, preserving the last gutter, CTA, prefetch, quiz and 404 corrections. The code build checks the inherited protections.

## Read these documents

- [Value roadmap and acceptance gates](ROADMAP-VALUE-2026-09-17.md)
- [Primary-source research and correction ledger](RESEARCH-LEDGER-2026-09-17.md)
- [Earlier commercial research](GROWTH-PLAN-2026-09-17.md), with the important qualification that the proposed clinic offer remains unvalidated and is not enabled by this PR.

## Delivered in code

Three existing article URLs now resolve through a shared catalog to source-refreshed content: `enclomiphene-vs-trt`, `oral-testosterone`, `trt-cost-2026`. Original slugs and publication dates are preserved; bodies, FAQs, metadata, related links and sitemap use the same updated representation. The large legacy registry is deliberately not rewritten in place. All non-targeted articles continue through the legacy definitions.

The guides include approximately 1,000 words each, source-linked evidence and limitations, anchored contents, comparison tables/cards, three FAQs each and the existing quiz/worksheet handoff. No clinician review, medical outcome or conversion improvement is claimed.

`generate-evidence-visuals.mjs` builds six accessible SVGs: desktop/mobile variants for mechanisms versus outcomes, oral-product monitoring windows and billing periods. Numeric diagrams derive from typed facts. The generator runs before dev, tests and builds. Generated SVGs are ignored by Git; the script is the versioned asset source. Existing brand artwork is preserved.

The blog listing receives summaries instead of full article HTML, sections and FAQ bodies. No measured percentage improvement or real-user speed score is claimed.

## Verification evidence

Inspected Vercel preview for code commit `281dd8c`:
- Deployment ID: `dpl_J4rbDnGAtQhNJQRhE51Yk6Hijyfp`.
- Immutable preview: https://shotfreetrt-oa2ez8m5h-tai-durden-ai.vercel.app
- Status: READY; target is preview, not production.
- **78/78 tests pass, zero failures:** 48 inherited tests plus 30 new source/content/diagram tests.
- Next.js 16.1.6 compiles successfully; the logs explicitly show **Running TypeScript**, not skipped type validation.
- **179/179 static/SSG pages generated**.
- The build generates the SVGs before running tests. No new dependencies, GitHub Actions or billing settings were added.

Local checks:
- 30/30 new tests pass on Node 22.16.
- Strict isolated TypeScript check of the content module passes.
- Nine authored article-body browser fixtures (three articles × 360, 390, 1440 widths) pass page-overflow, correct image variant, source/TOC anchor, page-error and print-CTA checks. Representative desktop and mobile figures were visually inspected.

These fixtures are **not a full Next.js application or hosted browser regression**. Full integrated page/quiz/worksheet navigation, inherited CSS interactions, actual hosted image loading, network privacy behavior and complete printed pages still require exact-head QA. A separate full lint run for this follow-up is not claimed. The upstream release's successful lint/browser report must not be presented as a run against this new head.

Documentation-only commits follow the named code commit. Before release, check the exact PR head and deployment again, even when code is unchanged.

## Next actions and release gates

1. Review the claim-correction ledger with the appropriate clinical/editorial reviewer. Record actual approval; do not manufacture a credential or approval date.
2. Complete integrated preview checks for the three article routes, `/blog`, `/quiz/healthspan` and `/decision-guide`; include keyboard, mobile, print, anchors and cross-root network behavior.
3. Check generated assets, source links, original URL preservation, canonical/FAQ consistency and dates on the approved deployment.
4. Release only through the authorized merge/deploy workflow. Then run the five-participant utility test before expanding article volume.
5. Continue the roadmap's fertility/bloodwork audit and typed source/price-ledger work. Legacy clinical article content outside these three replacements remains unreviewed by this PR.

No payment or email service was enabled, no outreach sent, no clinical service provided and no customer or revenue claimed. The quiz and calculator remain the real free product; the clinic proposal is a separate commercial hypothesis.
