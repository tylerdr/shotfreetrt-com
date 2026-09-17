# shotfreetrt.com — Product Spec

**Last updated:** 2026-09-17
**Version:** 0.3 — decision-first proposal and draft PR implementation

## Overview

ShotFreeTRT helps adults understand testosterone-treatment questions, compare the commercial terms of clinic quotes, and prepare for a licensed clinician visit. It publishes education; it does not diagnose, score treatment eligibility, prescribe, or recommend an individual medicine or dose through the new decision-guide experience.

The commercial proposal is a separate, fixed-fee clinic-branded education and consult-readiness service using the clinic's existing inquiries. It is not a patient-referral marketplace, a clinical practice, or a source of guaranteed patients. Demand and willingness to pay remain unvalidated.

The full market research, buying motivations, competitive landscape, product scope, source register, September economics and prioritized acceptance criteria are in [GROWTH-PLAN-2026-09-17.md](GROWTH-PLAN-2026-09-17.md). Current release evidence is in [HANDOFF.md](HANDOFF.md).

## Problem and target users

Consumer hypothesis: an adult already comparing treatment providers or preparing an appointment within the next month, often with a preference to avoid injections and questions about costs, product differences or future family plans. The immediate job is to know what to ask and verify before a purchase, not to receive an automated clinical decision. Demographic descriptions in the growth plan are commercial hypotheses, not eligibility rules.

Paying customer hypothesis: an independent clinic with existing inquiry volume, available appointment capacity, a clinical reviewer, and repeated administrative questions about services, pricing and next steps. The proposed scope and pricing require a real paid pilot before broader platform investment.

## Features and actual status

### 1. Existing public article library

- Metadata, internal links, statically generated article routes and registry-based article modules are already present.
- Legacy content is not fully reviewed by PR #8. High-risk claims and older treatment-oriented CTAs require the P0 editorial audit.
- Status: existing production capability, not evidence of current traffic or authority.

### 2. Free decision companion

- Appointment questions and source-linked general distinctions.
- Two-quote calculator for plan charges, billing interval, separately billed medication, annual extras and one-time fees.
- Unknown costs block totals; confirmed included/free costs may be entered as zero.
- Every-four-week billing is not treated as a calendar month. Output is an annualized budget, not a dated first-year cash forecast.
- No health inputs, medical-record uploads, treatment scores or clinical recommendations in this new experience.
- Entries remain in component state, clear on refresh, and are not included in the generic share link. This does not imply that global site analytics are disabled.
- Status: implemented in draft PR #8; 19 focused tests passed. Preview build succeeded with type validation skipped. Browser/mobile/print checks remain open.

### 3. Dated provider-price examples

- Provider-owned source links, explicit snapshot date, billing period, commitments, exclusions and unknowns.
- No implied clinical equivalence, endorsement, live quote or paid ranking.
- Status: implemented in draft PR #8. A durable structured source ledger and ongoing review process remain backlog items.

### 4. Proposed clinic pilot

- Proposed offer: $2,000 setup and $1,000/month after agreed acceptance.
- One brand, one education page, approved FAQ and price sheet, appointment checklist, existing booking-system handoff, and aggregate performance review.
- No EHR replacement, patient-record ingestion, automatic medical advice, or included traffic acquisition.
- Status: proposal page only. Noindex and enrollment disabled by default. Written scope, clinical approval, appropriate legal/data review, operational contact destination, delivery and measurement acceptance are required before activation.

### 5. Legacy quiz and commerce

- Existing quiz routes, heuristic scoring, checkout, newsletter capture and paid-guide delivery remain in the repository.
- They are not made safe or production-ready merely by changing homepage navigation. Their specific remediation gates are P0 in the growth plan.
- No clinical validation of the legacy scoring model or complete payment/fulfillment verification is claimed.

## Non-goals for this phase

- A full EHR, patient management system, lab interpretation service, prescribing system or clinical chatbot.
- A consumer authenticated health dashboard or health-data sharing network.
- Autonomous treatment selection, medication changes, synthetic clinicians, fabricated testimonials or outcome guarantees.
- A mass-produced clinic directory, general longevity platform, or paid advertising launch before the pilot economics and compliance gates are established.

## Technical architecture

- Next.js 16 App Router, TypeScript, Tailwind and existing shadcn components on Vercel.
- Public-first server-rendered content; isolated client component for deterministic quote arithmetic.
- Existing article registry: `src/data/articles.ts` plus standalone article modules.
- New reusable decision facts and arithmetic: `src/lib/decision-guide.ts`.
- No live Astra/Fable/model calls added by PR #8. Agent-assisted research/editorial workflows are proposed in the growth plan, not deployed clinical functionality.
- Preserves the Google Search Console verification token from merged PR #7. Property ownership, indexing and analytics baselines remain unverified.

## Scope log

| Date | Scope | Status |
|---|---|---|
| 2026-03-31 | Publish `testosterone-and-anemia` article | Recorded as shipped in prior handoff |
| 2026-09-17 | Google Search Console verification metadata | PR #7 merged; production ownership/indexing verification still open |
| 2026-09-17 | Research ICP, offer, distribution, SEO/AEO/GEO, September revenue path; improve funnel and open PR with backlog | Research and draft PR #8 implemented; commercial hypotheses, clinical review and release gates remain open |
