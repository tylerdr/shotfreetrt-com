# Backlog

The detailed, acceptance-criteria-backed growth backlog is in **[GROWTH-PLAN-2026-09-17.md](GROWTH-PLAN-2026-09-17.md), section 10**. Release evidence and explicit limitations are in **[HANDOFF.md](HANDOFF.md)**. “Implemented” below means on draft PR #8, not merged or production-ready.

## Immediate release and revenue priorities

- [x] G001: Implement decision-first homepage, free appointment checklist, local quote calculator and sourced pricing snapshots on the PR branch. Nineteen focused tests pass; preview production build passed with type validation skipped.
- [x] G002: Add the full ICP, buyer psychology, competitive research, proposed offer, source-backed prospect seeds, agent distribution design, September revenue scenarios and SEO/AEO/GEO backlog to the repository.
- [x] G003a / P0-01 (partial, 2026-09-17): Full-project `tsc --noEmit`, `eslint .`, and `next build` now pass clean with no `ignoreBuildErrors` escape hatch. Independent browser/mobile/print QA still not done — no browser access in this environment.
- [x] G004a / P0-02 (partial, 2026-09-17): Retired the legacy heuristic quiz (candidacy score, "Roast Me" mode, lab-input advanced quiz) and replaced it with a deterministic, non-clinical decision quiz. High-risk article corpus triage remains open — deliberately out of scope this session (avoid broad medical corpus rewrite).
- [x] G005a / P0-03,04 (partial, 2026-09-17): Newsletter now fails closed (no filesystem writes, no fake success); misleading "$19" purchase framing removed from the Longevity Blueprint guide along with its unused checkout/BuyButton code. Quiz and decision-guide screens are now exempt from all page-view/analytics tracking. Verified checkout/fulfillment (P0-05) remains open — no payment provider is configured or enabled.
- [ ] G003b / P0-01: Independent browser/mobile/print QA for the exact PR head (this branch). Check the new quiz's keyboard/mobile flow, the new print stylesheet output, long CTA wrapping on narrow phones, and calculator interactions. Partial browser QA already found and fixed one release blocker this pass (blue-on-blue button text); full pass still not done — no browser access in this environment.
- [ ] G004b / P0-02: Clinical/editorial triage of the remaining high-risk legacy articles. The quiz retirement/rebuild and CTA changes are not a substitute for this review.
- [ ] G006 / P0-06–07: Approve the proposed clinic scope, reviewer responsibilities, acceptance/refund terms and appropriate legal/data safeguards. Enable and test a real business inquiry destination only after approval. Enrollment remains disabled and the pilot page remains noindex.
- [ ] G007 / P0-08–11: Validate public prospect records, run an approved small outreach cohort, close the first paid pilot, ship its accepted template and measure aggregate business utility. No outreach or paid demand is claimed completed.
- [ ] G008 / P1: Establish the typed source ledger, review/expiry queue, high-intent content upgrades, consent-aware measurement and reusable partner kit before increasing publishing volume.
- [x] G009 (2026-09-17): Swapped all batch2 illustrations for batch3 (flat etched style, real alpha, mounted on a warm-bone `--editorial-frame` surface instead of floating on the dark background). See HANDOFF.md.
- [ ] G010 (new, 2026-09-17): Root's commerce/infrastructure audit should confirm whether any durable, testable email or payment provider exists before either is re-enabled. Nothing in this session re-enables Stripe or any email provider.
- [x] G011 (2026-09-17): Made the quiz/decision-guide "local-only" privacy promise structurally true (separate root layout, not a pathname check) after browser QA found GA still loading on those routes. See HANDOFF.md.
- [x] G012 (2026-09-17): Fixed a release-blocking CSS bug where primary CTA button text rendered blue-on-blue site-wide, found by browser QA.
- [x] G013 (2026-09-17): Regenerated the Longevity Blueprint PDF (stale price, no branding, localhost in metadata, unqualified outcome claims) via a new ReportLab-based build script; all three served copies now byte-identical.

## Existing active work (retained)

- [ ] T002: Verify live article rendering and on-page polish for `/blog/testosterone-and-anemia` `HIGH`.
- [ ] T003: Wire Google Search Console / indexing visibility so article velocity can be measured `HIGH`. PR #7's verification tag is merged and preserved in PR #8; production ownership/indexing verification remains open. The GSC Wizard connection returned a subscription-required error in this session.

## Existing next-up work (reordered)

- [ ] T004: Publish the next diagnostic content piece only after the clinical/source review and current release gates; prioritize useful existing-URL improvements over article volume.
- [ ] T005: Affiliate links on `/pricing` are deferred until written partner terms, appropriate legal review and disclosure/editorial rules exist. The revised comparison uses untracked direct-source links and must not imply paid ranking.

## Existing technical debt (retained)

- [ ] TD001: Previously documented unrelated local design/commerce work increases deployment ambiguity. Those local files were not accessed or modified; keep work isolated.
- [x] TD003 (2026-09-17): Replaced stale `next lint` (removed in Next 16) with `eslint .` (flat config, `eslint-config-next`). Full-project TypeScript baseline established: `tsc --noEmit` and `next build` both pass with no `ignoreBuildErrors` skip.

## Existing questions (retained)

- [ ] OQ001: Confirm production release workflow and isolation of content/design work. PR #8 must stay separate from local dirty work and must not be auto-promoted on the basis of this plan.
- [ ] OQ002: Decide whether diagnostic-category badges need dedicated styling after higher-priority release and revenue work.

## Prior GSC work

- [x] P001a: GSC verification metadata PR #7 merged into main.
- [ ] P001b: Independently verify production tag, property ownership and indexing. A token in source alone does not establish these outcomes.

## Previously completed

- [x] T001: `testosterone-and-anemia` article shipped to production on 2026-03-31, as recorded in the prior handoff.
