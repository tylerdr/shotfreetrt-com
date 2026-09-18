# Session Handoff

**Date:** 2026-09-18  
**Branch:** `feature/concern-journeys-20260918`  
**PR:** https://github.com/tylerdr/shotfreetrt-com/pull/13  
**Base:** `main@205a12ba4ac7650ac2160ec79f135b38ddf97a4d`  
**Status:** functional application checks pass; draft held for dependency remediation, integrated browser and live-domain acceptance. No paid offer or affiliate activation.

## Read first

- [Mars audit, adaptations and conversion experiments](MARS-FUNNEL-AUDIT-2026-09-18.md)
- [Verified application evidence, dependency findings and release/revenue gates](RELEASE-GATES-2026-09-18.md)
- [Exact user request](PROMPT-MARS-2026-09-18.md)
- [Earlier copy-drift investigation](LIVE-RELEASE-DRIFT-2026-09-17.md)
- [Backlog](BACKLOG.md), including preserved prior medical, commercial and indexing obligations

## Implemented

Four distinct public topic guides and four noindex quiz variants reuse the existing six-question decision engine. Entry changes question order, never preselects answers or creates a diagnosis/treatment score. Homepage, navigation and eleven explicitly mapped article slugs lead to the relevant path. Existing approved illustrations, short source-linked lessons, output previews, FAQs, repeated contextual CTAs and a mobile sticky CTA make the pages easier to scan. Card actions were corrected to wrap at narrow grid widths.

The result now leads with its next useful action. A separate component receives no answers or concern identifier and provides generic site-link copying and a one-time seven-day calendar-file download. Both are deliberate user actions; no email, appointment, referral record or server-side health record is created.

Topics and quiz variants use the existing analytics-isolated root; answer-dependent links keep `prefetch={false}`. Metadata includes canonical/OG fields, visible/schema breadcrumbs, public-topic sitemap entries, noindex variants, safe JSON and article image/word-count fixes. Existing article bodies remain unchanged; PR #10's source-refreshed articles are not silently merged or medically approved.

## Actual test/build receipts

[CI run 35395430216](https://github.com/tylerdr/shotfreetrt-com/actions/runs/35395430216) tested head `1e6cf20940c64a7236ad60ab27256f87b3561a1b` against main205a:
- **73/73 tests pass**, zero failures.
- **Lint passes**, zero errors, one pre-existing warning in `commitlint.config.js`.
- **Full TypeScript and Next build pass**; **188/188 pages** generated.
- The obsolete truthiness-source assertion was corrected to validate actual option IDs; a behavioral invalid-answer regression was added.

[CI run 35395754890](https://github.com/tylerdr/shotfreetrt-com/actions/runs/35395754890), application job `105764094686`, tested head `55f7df6b1e90bb4bd8ad31be139e5b1eb7e8abf1`. Its test/lint/build step and the additional **rendered-HTML acceptance step both passed**. The latter checks all eleven topic, quiz and worksheet documents, canonical/H1/OG/noindex/sitemap facts, and absence of the GA loader in isolated documents. A CI-only test GA ID makes the comparison non-vacuous by requiring the main root to contain the loader. No browser executes that build and it is not deployed/uploaded.

Local calendar-export checks passed six cases under UTC and again under America/Los_Angeles. The tested source is byte-identical to blob `1edad86e6b5accfea9ea9112464a6befeff387a1`.

These receipts do **not** establish browser interaction/accessibility, actual live release, clinical review, search indexing or paid fulfillment. Later documentation commits do not change application source, but final merge/deployment must still reference the exact approved head.

## Material release blockers

1. **Dependency baseline:** runtime audit reports eleven affected package entries, including the existing pinned Next.js 16.1.6 with critical advisories. See RELEASE-GATES for applicability limits and the verified 16.3.5 remediation candidate. No exploit or compromise was demonstrated. No blind force-upgrade or uncommitted lockfile substitution was performed. Functional CI success is not security clearance.
2. **Live-domain identity:** PR #12 really merged to main205a and Vercel lists its READY production-target deployment `dpl_CVDbyuwHkZBwmLZ21LSqEkvbGtRz`. A subsequent domain lookup still returned older production `dpl_9nZFzYSLB7hLctv4jP8Uy9rnZ1ob` at `ee2b5ca36fde9f4f605687db84170ba466f564e9`. This discrepancy is not reconciled. The new PR13 journeys are not claimed live.
3. **Integrated browser checks:** full mobile/keyboard/back/edit/restart/clipboard/download/print and real network inspection remain open. Vercel build-log/deploy actions returned tool-not-found; preview share URL generation failed. No remote browser result is claimed.
4. **Commercial path:** no accepted ShotFreeTRT-specific paid offer or signed affiliate terms were established. A narrow live Stripe name search found no `ShotFree` products; that is not an exhaustive alias audit. The earlier dossier and clinic-pilot ideas remain proposals. No payment, email or referral/commission path is enabled here.

## Next agent-owned execution

First resolve the dependency baseline with an actual committed lockfile and rerun acceptance. Then verify integrated browser behavior and reconcile the approved immutable deployment, root/www aliases, release headers and `/api/release`. `scripts/verify-production-funnel.mjs <approved-merge-sha>` is a reusable HTTP-only acceptance check; no successful production receipt from it is claimed.

Before combining #10 and #13, reconcile their overlapping article-template and sitemap changes explicitly, preserving both the researched content catalog and contextual journey CTAs. Keep prior legacy-medical-content review requirements.

Prepare the exact paid deliverable or partner arrangement, approval, terms, disclosures, fulfillment/refund tests and support owner before commercial activation. Do not assign routine operations to Tyler or treat a quiz completion as revenue.

Amble discovery returned no accessible connector. Roadmap/experiment reconciliation is pending; no accepted thesis write, task dispatch or canonical execution receipt is fabricated. Prior recorded Search Console ownership and sitemap submission are preserved; this session obtained no new ranking, traffic or indexing-performance dataset.
