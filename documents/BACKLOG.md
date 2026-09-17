# Backlog

The detailed, acceptance-criteria-backed growth backlog is in **[GROWTH-PLAN-2026-09-17.md](GROWTH-PLAN-2026-09-17.md), section 10**. Release evidence and explicit limitations are in **[HANDOFF.md](HANDOFF.md)**. “Implemented” below means on draft PR #8, not merged or production-ready.

## Immediate release and revenue priorities

- [x] G001: Implement decision-first homepage, free appointment checklist, local quote calculator and sourced pricing snapshots on the PR branch. Nineteen focused tests pass; preview production build passed with type validation skipped.
- [x] G002: Add the full ICP, buyer psychology, competitive research, proposed offer, source-backed prospect seeds, agent distribution design, September revenue scenarios and SEO/AEO/GEO backlog to the repository.
- [ ] G003 / P0-01: Full-project typecheck/lint and independent browser/mobile/print QA for the exact PR head. Check long CTA wrapping on narrow phones, route metadata, form labels, calculator interactions and global analytics payloads. Preview-page access was unavailable in this review.
- [ ] G004 / P0-02: Clinical/editorial triage of the legacy scoring quiz and high-risk articles. Do not interpret new homepage copy as a full safety review.
- [ ] G005 / P0-03–05: Repair analytics/privacy boundaries, durable newsletter capture and verified checkout/fulfillment before acquisition.
- [ ] G006 / P0-06–07: Approve the proposed clinic scope, reviewer responsibilities, acceptance/refund terms and appropriate legal/data safeguards. Enable and test a real business inquiry destination only after approval. Enrollment remains disabled and the pilot page remains noindex.
- [ ] G007 / P0-08–11: Validate public prospect records, run an approved small outreach cohort, close the first paid pilot, ship its accepted template and measure aggregate business utility. No outreach or paid demand is claimed completed.
- [ ] G008 / P1: Establish the typed source ledger, review/expiry queue, high-intent content upgrades, consent-aware measurement and reusable partner kit before increasing publishing volume.

## Existing active work (retained)

- [ ] T002: Verify live article rendering and on-page polish for `/blog/testosterone-and-anemia` `HIGH`.
- [ ] T003: Wire Google Search Console / indexing visibility so article velocity can be measured `HIGH`. PR #7's verification tag is merged and preserved in PR #8; production ownership/indexing verification remains open. The GSC Wizard connection returned a subscription-required error in this session.

## Existing next-up work (reordered)

- [ ] T004: Publish the next diagnostic content piece only after the clinical/source review and current release gates; prioritize useful existing-URL improvements over article volume.
- [ ] T005: Affiliate links on `/pricing` are deferred until written partner terms, appropriate legal review and disclosure/editorial rules exist. The revised comparison uses untracked direct-source links and must not imply paid ranking.

## Existing technical debt (retained)

- [ ] TD001: Previously documented unrelated local design/commerce work increases deployment ambiguity. Those local files were not accessed or modified; keep work isolated.
- [ ] TD003: Replace stale `next lint` with the supported lint command for this Next 16 repository and establish the full-project TypeScript baseline. A Vercel build that skips types is not a substitute.

## Existing questions (retained)

- [ ] OQ001: Confirm production release workflow and isolation of content/design work. PR #8 must stay separate from local dirty work and must not be auto-promoted on the basis of this plan.
- [ ] OQ002: Decide whether diagnostic-category badges need dedicated styling after higher-priority release and revenue work.

## Prior GSC work

- [x] P001a: GSC verification metadata PR #7 merged into main.
- [ ] P001b: Independently verify production tag, property ownership and indexing. A token in source alone does not establish these outcomes.

## Previously completed

- [x] T001: `testosterone-and-anemia` article shipped to production on 2026-03-31, as recorded in the prior handoff.
