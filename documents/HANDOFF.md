# Session Handoff

**Date:** 2026-09-18  
**Branch:** `feature/concern-journeys-20260918`  
**PR:** https://github.com/tylerdr/shotfreetrt-com/pull/13  
**Application base:** `main@205a12ba4ac7650ac2160ec79f135b38ddf97a4d`  
**Status:** implementation prepared in a draft PR; full build/browser/production acceptance not verified. No new paid offer or affiliate program activated.

## Read first

- [Mars public-funnel audit, adaptation matrix, experiments and revenue gates](MARS-FUNNEL-AUDIT-2026-09-18.md)
- [Exact user scope](PROMPT-MARS-2026-09-18.md)
- [Prior release-identity discrepancy](LIVE-RELEASE-DRIFT-2026-09-17.md)
- Existing [BACKLOG.md](BACKLOG.md) for prior clinical, commerce and indexing obligations. Its unfinished work is not erased by the new journeys.

## Actual changes in this workstream

Four topic-specific public education paths and four noindex quiz variants reuse the existing six-question, non-clinical engine. They reorder questions without preselecting answers or changing the answer-to-brief logic. The new paths are energy/testing, fertility questions, needle-free options and clinic costs. Public topics and quiz variants live in the existing analytics-isolated root. Result links retain disabled prefetch.

The homepage/navigation now offer a concern-led entrance; eleven explicitly mapped article slugs receive a contextual CTA. Existing approved illustrations are reused with short takeaways, an output preview, FAQs, a next-question panel and a mobile sticky CTA. A follow-up fixes potential button overflow in narrow four-column cards.

The brief now places its next useful action before the longer result. A separate component, which receives no answers or concern identifier, offers generic site-link copying and a one-time calendar-file download seven days later. No email, calendar event, referral record or server-side answer record is created automatically.

Metadata changes include public canonicals/OG images, visible breadcrumbs with matching structured data, public-topic sitemap entries, noindex quiz variants, safe JSON serialization, and article image/word-count corrections. No indexing, AI-citation or conversion gain is established.

## Exact verification achieved

- Local copy of `src/lib/brief-reminder.ts` was checked against its actual Git blob SHA: `1edad86e6b5accfea9ea9112464a6befeff387a1`. The copies are byte-identical.
- Six focused calendar-export checks passed under UTC and again under America/Los_Angeles: next-week date, exclusive end date, year and leap-year boundaries, invalid date/identifier rejection, generic contents and line endings. These are not full application tests.
- Twenty-one new journey regression cases are committed. The normal build command is `npm test && npm run lint && next build`. No successful run of that complete chain is claimed for this PR.
- The first preview `dpl_tEgBcaPHxfXzJJJ9K5sjcot5ooja` for `00c1e6acf9792e8c3d9e4f2f466d85a23a5778f6` remained INITIALIZING on repeated reads. Subsequent code commits need their own exact-head verification.
- Vercel's exposed build-log and deployment actions returned `Tool ... not found`. Authenticated preview fetching failed to create a shareable URL. A full hosted browser run did not occur.

## Production status — do not conflate merge, build and live acceptance

The separately reviewed diagnostic PR #12 was marked ready and merged at exact head `32122b747eb4f9dc9bffd14f9b6d7bfc3231fdec`, producing main merge `205a12ba4ac7650ac2160ec79f135b38ddf97a4d`. This was a real GitHub merge, not a production-verification receipt.

At the last successful domain lookup, `shotfreetrt.com` still mapped to READY production deployment `dpl_9nZFzYSLB7hLctv4jP8Uy9rnZ1ob`, Git SHA `ee2b5ca36fde9f4f605687db84170ba466f564e9`. No deployment of the new funnel to the public domain has been verified. Do not close the prior copy-drift investigation merely because the headers were merged into source.

A reusable, read-only checker is now included: `node scripts/verify-production-funnel.mjs <expected-merge-sha>`. It fails on a mismatched release before checking topic/quiz HTML, canonicals, noindex, sitemap, images and GA-loader absence. It explicitly reports HTTP-only evidence, not browser interaction, clinical approval or paid fulfillment. It has not produced a successful production receipt in this session.

## Next agent-owned actions

1. Obtain actual exact-head test, lint, TypeScript and build results; resolve any failures before requesting release approval.
2. Complete integrated mobile/desktop, radio/keyboard/focus, back/edit/restart, download/clipboard-error and print checks. Inspect real network requests on isolated routes and cross-root navigation.
3. Inspect the pending PR #10 article-catalog/template changes before integration. This PR also touches the article template and sitemap; preserve both the researched content and concern-specific handoffs in any reconciliation. No broad legacy medical-content approval is implied.
4. Release only the approved, tested head through the existing gate. Confirm the actual root and www domains, immutable deployment, headers and `/api/release` agree; then run the HTTP checker and browser smoke tests.
5. Evaluate the proposed concern-entry and contextual-CTA experiments without adding unapproved health-data analytics or outbound sending. Amble reconciliation remains pending because no accessible connector was discovered.

## Revenue activation remains separate

A narrow live Stripe search for products named `ShotFree` returned no matches. No approved paid offer, signed affiliate agreement or verified payment/lead fulfillment was retrieved. This is not a comprehensive financial audit or a claim that no alias exists. Do not enable a new price, commission, subscription, medical service, mailing list or payment button solely to label the site revenue-ready.

The necessary commercial decision is an exact authorized offer or partner arrangement with deliverable acceptance, claims/disclosure review, payment/refund or commission rules, fulfillment tests and an agent-owned support process. Pending that decision, the actual public product remains free.
