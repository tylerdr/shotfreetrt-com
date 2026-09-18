# Backlog

The original growth backlog is in **[GROWTH-PLAN-2026-09-17.md](GROWTH-PLAN-2026-09-17.md), section 10**. Current workstream evidence is in **[HANDOFF.md](HANDOFF.md)** and **[RELEASE-GATES-2026-09-18.md](RELEASE-GATES-2026-09-18.md)**. Historical completion records below are preserved; they do not certify later PR heads or current indexing.

## September 18 concern-funnel workstream — PR #13

- [x] J001: Research Mars's public offer, education, retention and creator-affiliate patterns. Dynamic quiz sequences and conversion metrics remain unobserved; see MARS-FUNNEL-AUDIT-2026-09-18.md.
- [x] J002: Implement four topic guides and four private quiz variants, contextual home/navigation/article entrances, output previews and scannable source-linked lessons. Implemented on the draft branch, not accepted in production.
- [x] J003: Add explicit-action generic sharing and a seven-day calendar-file export, with no quiz answers or concern slug in either output.
- [x] J004: Real application CI: 73 tests, lint, full TypeScript and 188-page build passed. Additional rendered-HTML checks passed for eleven topic/quiz/worksheet documents. Preserve the distinction from browser QA and revenue verification.
- [ ] J005 / P0: Remediate the existing dependency baseline. Runtime audit flags eleven package entries, including Next.js critical advisories. Verify a patched version, commit the regenerated lockfile, re-audit and rerun all acceptance checks. Do not auto-force dependencies or interpret a report-only audit as approval.
- [ ] J006 / P0: Full integrated browser/mobile/keyboard/print/download/clipboard/network acceptance on the corrected dependency head. Static HTML checks are not a substitute.
- [ ] J007 / P0: Reconcile actual root/www domain, release headers, `/api/release` and immutable deployment after approved release. PR #12 merged to main205a, but domain/deployment evidence remains inconsistent; no new-funnel production acceptance is claimed.
- [ ] J008 / P0: Reconcile #10 and #13 article-template/sitemap changes without discarding the researched catalog or the new contextual CTAs. Preserve medical/editorial review gates.
- [ ] J009 / commercial gate: Obtain an exact approved paid offer or signed affiliate agreement plus terms/disclosures, delivery/refund or commission rules and verified fulfillment. No existing proposal is silently treated as accepted.
- [ ] J010 / learning gate: Run the proposed concern-entry/contextual-CTA tests with authorized measurement, a stable window and useful-brief acceptance criteria. No unapproved analytics of health answers and no claims of conversion lift from implementation alone.
- [ ] J011: Reconcile proposals and receipts into Amble when authorized access exists. No canonical write or dispatch is claimed.

## Immediate release and revenue priorities (prior work retained)

- [x] G001: Implement decision-first homepage, free appointment checklist, local quote calculator and sourced pricing snapshots on the PR branch. Nineteen focused tests pass; preview production build passed with type validation skipped.
- [x] G002: Add the full ICP, buyer psychology, competitive research, proposed offer, source-backed prospect seeds, agent distribution design, September revenue scenarios and SEO/AEO/GEO backlog to the repository.
- [x] G003a / P0-01 (partial, 2026-09-17): Full-project `tsc --noEmit`, `eslint .`, and `next build` now pass clean with no `ignoreBuildErrors` escape hatch. Independent browser/mobile/print QA still not done — no browser access in this environment.
- [x] G004a / P0-02 (partial, 2026-09-17): Retired the legacy heuristic quiz (candidacy score, "Roast Me" mode, lab-input advanced quiz) and replaced it with a deterministic, non-clinical decision quiz. High-risk article corpus triage remains open — deliberately out of scope this session (avoid broad medical corpus rewrite).
- [x] G005a / P0-03,04 (partial, 2026-09-17): Newsletter now fails closed (no filesystem writes, no fake success); misleading "$19" purchase framing removed from the Longevity Blueprint guide along with its unused checkout/BuyButton code. Quiz and decision-guide screens are now exempt from all page-view/analytics tracking. Verified checkout/fulfillment (P0-05) remains open — no payment provider is configured or enabled.
- [x] G003b / P0-01: Independent browser/mobile/print QA for the merged release. Mobile, desktop, full quiz, quote, print/PDF, and network/privacy checks passed; the prior receipt is recorded in the historical release closeout.
- [ ] G004b / P0-02: Clinical/editorial triage of the remaining high-risk legacy articles. The quiz retirement/rebuild and CTA changes are not a substitute for this review.
- [ ] G006 / P0-06–07: Approve the proposed clinic scope, reviewer responsibilities, acceptance/refund terms and appropriate legal/data safeguards. Enable and test a real business inquiry destination only after approval. Enrollment remains disabled and the pilot page remains noindex.
- [ ] G007 / P0-08–11: Validate public prospect records, run an approved small outreach cohort, close the first paid pilot, ship its accepted template and measure aggregate business utility. No outreach or paid demand is claimed completed.
- [ ] G008 / P1: Establish the typed source ledger, review/expiry queue, high-intent content upgrades, consent-aware measurement and reusable partner kit before increasing publishing volume.
- [x] G009 (2026-09-17): Swapped all batch2 illustrations for batch3 (flat etched style, real alpha, mounted on a warm-bone `--editorial-frame` surface instead of floating on the dark background). See historical handoff.
- [ ] G010 (2026-09-17): Root's commerce/infrastructure audit should confirm whether any durable, testable email or payment provider exists before either is re-enabled. Nothing in this workstream re-enables Stripe or any email provider.
- [x] G011 (2026-09-17): Made the quiz/decision-guide privacy isolation structural (separate root layout, not a pathname check) after browser QA found GA still loading on those routes.
- [x] G012 (2026-09-17): Fixed a release-blocking CSS bug where primary CTA button text rendered blue-on-blue site-wide, found by browser QA.
- [x] G013 (2026-09-17): Regenerated the Longevity Blueprint PDF (stale price, no branding, localhost in metadata, unqualified outcome claims) via a ReportLab-based build script; all three served copies byte-identical.
- [x] G014a: Release/copy identity and regression coverage added in PR #12; merged September 18 at `205a12ba4ac7650ac2160ec79f135b38ddf97a4d`.
- [ ] G014b: Verify the actual root/www origin headers, release endpoint, immutable deployment and HTML agree. A READY production-target build alone is not proof that the public alias serves it. No DNS/domain settings or caches were changed.

## Existing active work (retained)

- [ ] T002: Verify live article rendering and on-page polish for `/blog/testosterone-and-anemia` `HIGH`.
- [x] T003: Prior closeout records Search Console ownership verification and successful submission of a 170-page sitemap. Submission is not proof that all URLs are indexed; no current performance dataset was obtained in this pass.

## Existing next-up work (reordered)

- [ ] T004: Publish the next diagnostic content piece only after clinical/source review and release gates; prioritize useful existing-URL improvements over article volume.
- [ ] T005: Affiliate links on `/pricing` deferred until written partner terms, legal review and disclosure/editorial rules exist. Direct-source comparison links must not imply paid ranking.

## Existing technical debt (retained)

- [ ] TD001: Previously documented unrelated local design/commerce work increases deployment ambiguity. Those local files were not accessed or modified; keep work isolated.
- [x] TD003 (2026-09-17): Replaced stale `next lint` with `eslint .`; full TypeScript/build validation restored without `ignoreBuildErrors`.

## Existing questions (retained)

- [x] OQ001: Prior release workflow and content/design isolation established for PRs 8/9; later deployments require their own evidence.
- [ ] OQ002: Decide whether diagnostic-category badges need dedicated styling after higher-priority release and revenue work.

## Prior GSC work

- [x] P001a: GSC metadata PR #7 merged.
- [x] P001b: Prior ownership/tag verification and 170-page sitemap submission recorded. Current indexing/performance still requires actual Search Console evidence.

## Previously completed

- [x] T001: `testosterone-and-anemia` shipped 2026-03-31, as recorded in the prior handoff.
