# shotfreetrt.com — Product Spec

**Last updated:** 2026-09-21
**Version:** 0.5 — decision-first consumer funnel, durable resource capture, and clinic growth proposal

## Overview

ShotFreeTRT helps adults understand testosterone-treatment questions, compare the commercial terms of clinic quotes, and prepare for a licensed clinician visit. It publishes education; it does not diagnose, score treatment eligibility, prescribe, or recommend an individual medicine or dose through the new decision-guide experience.

The commercial proposal is a separate, fixed-fee clinic-branded education and consult-readiness service using the clinic's existing inquiries. The implementation is designed to help a clinic quantify repeated administrative workload, preview the patient experience, and express interest without requiring patient data. Canonical offer/experiment acceptance remains in Amble; repository code and this document describe implementation state only.

The earlier market research, buying motivations, competitive landscape, product scope, source register, September economics and prioritized acceptance criteria are in [GROWTH-PLAN-2026-09-17.md](GROWTH-PLAN-2026-09-17.md). Current implementation evidence is in [HANDOFF.md](HANDOFF.md) and pull requests.

## Problem and target users

Consumer hypothesis: an adult already comparing treatment providers or preparing an appointment within the next month, often with a preference to avoid injections and questions about costs, product differences or future family plans. The immediate job is to know what to ask and verify before a purchase, not to receive an automated clinical decision. Demographic descriptions in the growth plan are commercial hypotheses, not eligibility rules.

Paying customer hypothesis: an independent men's-health clinic with existing inquiry volume, available appointment capacity, a clinical reviewer, and repeated administrative questions about routes, services, pricing, testing and next steps. The proposed scope and pricing still require real buying evidence before broader platform investment.

## Features and actual status

### 1. Existing public article library

- Metadata, internal links, statically generated article routes and registry-based article modules are already present.
- Legacy content is not fully reviewed by the prior release work. High-risk claims and older treatment-oriented CTAs remain separate editorial work.
- Status: existing production capability, not evidence of current traffic or authority.

### 2. Free decision companion

- Appointment questions and source-linked general distinctions.
- Two-quote calculator for plan charges, billing interval, separately billed medication, annual extras and one-time fees.
- Unknown costs block totals; confirmed included/free costs may be entered as zero.
- Every-four-week billing is not treated as a calendar month. Output is an annualized budget, not a dated first-year cash forecast.
- No health inputs, medical-record uploads, treatment scores or clinical recommendations in this new experience.
- Entries remain in component state, clear on refresh, and are not included in the generic share link.
- Status: implemented in the released decision-first codebase; later release verification still controls any claim about the exact public head.

### 3. Dated provider-price examples

- Provider-owned source links, explicit snapshot date, billing period, commitments, exclusions and unknowns.
- No implied clinical equivalence, endorsement, live quote or paid ranking.
- Status: implemented. A durable structured source ledger and ongoing review process remain backlog items.

### 4. Clinic Consult-Ready Launch — implementation proposal

- Proposed offer represented in code: **$2,000 launch + $1,000/month**.
- One clinic brand, one patient-education experience, clinic-approved FAQ and published price sheet, appointment checklist, existing booking-system handoff, and monthly aggregate improvement review.
- `/for-clinics` leads with the operator outcome, includes a local-only workload calculator, keeps the patient-facing decision guide one click away, and captures clinic interest through the existing durable subscriber infrastructure.
- The workload calculator uses only operator-entered business inputs: weekly inquiries, repeat-question minutes, loaded staff hourly cost, and a configurable pre-visit education target. It calculates a workload/capacity baseline; it does not claim realized savings.
- Clinic-interest capture uses source `shotfreetrt-clinic-interest`, a work email and explicit email consent. New clinic-interest leads persist through the existing tenant-scoped subscriber path; the source receives a clinic-specific confirmation email when Resend is configured.
- Optional direct enrollment remains separately gated by `CLINIC_PILOT_ENROLLMENT_ENABLED` and a valid HTTPS `CLINIC_PILOT_CONTACT_URL`.
- No EHR replacement, patient-record ingestion, automated medical advice, payment activation, or included traffic acquisition is added by this implementation.
- Status: draft PR #15 implementation proposal. The page is proposed as indexable; release, offer and experiment acceptance remain separate decisions.

### 5. Decision quiz

- Six-question deterministic funnel at `/quiz/healthspan` (canonical; `/quiz` and `/quiz/healthspan/advanced` redirect into it): intent, testing stage, fertility-conversation priority, delivery-route preference, cost clarity, decision timing. No lab values, diagnosis, or numeric treatment score.
- Result is a "TRT Decision Brief": a plain-language reflection of the reader's own answers, a prioritized appointment-question checklist with stated reasons, 1-3 reading-path links, and a primary/secondary next action. Outputs are rules-based mappings, not model-generated clinical scores.
- Answers live only in component state; nothing is sent to a server, stored in localStorage/sessionStorage, or included in analytics. `/quiz/*` and `/decision-guide` are route-isolated from the site analytics providers.
- The previous heuristic scorer is retired.
- Status: implemented in the decision-first codebase.

### 6. Resource lead capture and guide monetization

- PR #14 merged the durable free-resource lead path into `main`: tenant-scoped subscriber persistence through the configured Supabase REST endpoint and optional confirmation delivery through Resend.
- Email capture fails with an explicit error if durable storage is not configured; the UI does not substitute a fake saved state.
- Consumer resource leads and clinic-interest leads share the persistence route but receive source-specific resource responses/confirmation content on PR #15.
- The Longevity Blueprint PDF remains free and publicly downloadable. There is no paid checkout path in this repository state.

## Non-goals for this phase

- A full EHR, patient management system, lab interpretation service, prescribing system or clinical chatbot.
- A consumer authenticated health dashboard or health-data sharing network.
- Autonomous treatment selection, medication changes, synthetic clinicians, fabricated testimonials or outcome guarantees.
- A mass-produced clinic directory or general longevity platform before useful buying and delivery evidence exists.

## Technical architecture

- Next.js 16 App Router, TypeScript, Tailwind and existing shadcn components on Vercel.
- Public-first server-rendered content; isolated client components for deterministic quote arithmetic and the clinic workload preview.
- Existing article registry: `src/data/articles.ts` plus standalone article modules.
- Decision facts and arithmetic: `src/lib/decision-guide.ts`.
- Clinic operating baseline: `src/lib/clinic-growth.ts` plus `ClinicWorkloadCalculator`.
- Lead persistence/confirmation: `src/lib/lead-capture.ts` and `/api/newsletter`, with source-specific consumer/clinic confirmation paths.
- No live model call is required for the clinic value preview or lead path.
- Preserves the Google Search Console verification token from earlier work.

## Scope log

| Date | Scope | Status |
|---|---|---|
| 2026-03-31 | Publish `testosterone-and-anemia` article | Recorded as shipped in prior handoff |
| 2026-09-17 | Google Search Console verification metadata | PR #7 merged; current indexing/performance requires current provider evidence |
| 2026-09-17 | Research ICP, offer, distribution, SEO/AEO/GEO, September revenue path; improve decision funnel | Historical research and implementation work retained as reference, not canonical business state |
| 2026-09-17 | Rebuild the quiz as a deterministic decision funnel; repair typecheck/lint baseline and privacy isolation | Implemented in later main history |
| 2026-09-21 | Durable free-resource capture | PR #14 merged to `main` at `fb2cd616930eea39426dcbb6ed2d475bebeb7698` |
| 2026-09-21 | Outcome-first clinic page, local workload preview, clinic-intent durable capture and source-specific confirmation | Draft PR #15; proposed business experiment pending Amble acceptance and release approval |
