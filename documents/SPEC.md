# shotfreetrt.com — Product Spec

**Last updated:** 2026-08-23 (session: verified paid Blueprint delivery)
**Version:** 0.2

---

## Overview
ShotFreeTRT is a content-led testosterone optimization site for men evaluating TRT, alternatives, diagnostics, and protocol decisions. The product is a high-trust SEO and quiz funnel designed to convert symptom-driven readers into qualified decision-stage users.

## Problem
Men investigating low testosterone are usually stuck between oversimplified symptom content and low-rigor clinic marketing. They need clearer diagnostic content, better bloodwork education, and a safer path to understanding whether TRT is the right intervention.

## Target Users (ICP)
Men roughly 35-55 who are performance-minded, care about energy/libido/body composition, and are actively researching TRT, low testosterone symptoms, bloodwork, or non-injection treatment paths.

## Core Features

### Feature 1: SEO article library
- **Description:** High-intent educational content around TRT, diagnostics, side effects, and alternatives.
- **Acceptance criteria:**
  - [x] Articles have metadata, internal links, and static routes.
  - [x] New articles can be added as standalone data files and registered centrally.
- **Status:** live

### Feature 2: Quiz-driven conversion path
- **Description:** Guided quiz flow that helps visitors identify likely next steps before talking to a clinic.
- **Acceptance criteria:**
  - [ ] Quiz outcomes align with major reader states (diagnostics, TRT, alternatives, lifestyle-first)
  - [ ] Article pages consistently funnel qualified readers into the quiz
- **Status:** active

### Feature 3: Paid Longevity Blueprint delivery
- **Description:** A $19 digital guide sold through Stripe Checkout and released only after server-side verification of a completed payment for the expected product and price.
- **Acceptance criteria:**
  - [x] Legacy public PDF URLs redirect before static-file handling.
  - [x] Node download route verifies session status, payment status, price, product, currency, and quantity.
  - [x] Success page is non-indexable and renders a download link only for a verified session.
  - [x] Checkout attribution is sanitized and contains no PII.
  - [x] GA4 and first-party commerce events are semantically separated for checkout start, verified purchase, and download.
  - [ ] Production env, real purchase/refund, and live analytics ingestion are verified.
- **Status:** code-ready; not live from this session.

## Non-Goals
What we're explicitly NOT building in this phase:
- Full EMR or patient management tooling
- Custom authenticated dashboards for readers

## Technical Architecture
- **Stack:** Next.js 16, TypeScript, Tailwind, Vercel
- **Auth:** None required for core public content experience
- **Key patterns:** Article data is sourced from `src/data/articles.ts` plus standalone article modules imported into registry helpers
- **Data model:** Public-content-first; blog pages render from typed article objects with HTML content strings and optional FAQ schema
- **See:** `documents/DECISIONS.md` for architectural choices

## Open Questions
Unresolved product decisions. Agents should NOT unilaterally resolve these.
- [ ] OQ001: How should GSC/indexing feedback be incorporated into the article backlog prioritization loop?
- [ ] OQ002: Is a Stripe webhook-backed fulfillment ledger required for reconciliation beyond session verification?

## Scope Additions Log
*Verbatim or close-paraphrase of Tyler's scope changes, not yet incorporated above.*

| Date | Input | Status |
|------|-------|--------|
| 2026-03-31 | "Wire a new article into the shotfreetrt.com production site and deploy it." | incorporated |
| 2026-08-23 | Portfolio commerce/search review: treat the Blueprint as paid, secure delivery behind Stripe verification, add attribution and event semantics, and remove stale search markup. | code-ready; production/account gates pending |
