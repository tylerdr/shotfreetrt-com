# Session Handoff

**Session date:** 2026-09-17 PT  
**Branch:** `fix/release-identity-copy-drift-20260917`  
**Base:** `main@ee2b5ca36fde9f4f605687db84170ba466f564e9`  
**Status:** diagnostic/safety PR only; no production activation.

## Production source and deployment evidence

The latest `main` commit is `ee2b5ca36fde9f4f605687db84170ba466f564e9`. Vercel reports production deployment `dpl_9nZFzYSLB7hLctv4jP8Uy9rnZ1ob` READY, target `production`, with aliases `shotfreetrt.com` and `www.shotfreetrt.com`, and metadata bound to that exact Git SHA. Application source is unchanged from the merged decision-first release beneath the documentation-only PR #11 closeout.

The repository homepage source is the safer decision-first experience: “Considering TRT? Compare before you commit,” no treatment score, no lab upload, and explicit clinician/education boundaries.

## Newly observed release-integrity uncertainty

A fresh independent public-web fetch of `https://shotfreetrt.com/` on September 17 returned the older pre-release homepage: AI-generated 30-day testosterone plan language, the four-block protocol framing, “Best first move for most guys,” and “EVERY CLAIM SOURCED.” This conflicts with both current repository source and Vercel deployment metadata.

This is **not yet proof that Vercel origin is serving the wrong build**. The independent fetch may be stale or routed through another cache, and direct origin HTML retrieval was unavailable in this review environment. Do not label it a rollback without origin evidence.

See `documents/LIVE-RELEASE-DRIFT-2026-09-17.md` for the evidence boundary and exact reconciliation checklist.

## Current patch

Commit `13800151e9d9fbecc763feb24c2a9dc18e52a0b3` adds only release-integrity diagnostics and regressions:

- `X-ShotFreeTRT-Release` on hosted responses, sourced from `VERCEL_GIT_COMMIT_SHA`;
- `X-ShotFreeTRT-Copy-Contract: decision-first-v1`;
- uncached `/api/release` returning the deployed SHA and copy-contract version;
- source regression coverage that rejects the retired treatment-plan homepage claims.

No clinical content, recommendation logic, analytics, payments, email, customer data, domain/DNS setting, cache purge or production deployment is changed by this patch.

After any separately authorized merge/deployment, verify the public custom domains, immutable Vercel deployment, root HTML and `/api/release` all agree before closing the incident.

## Parallel product work

Draft PR #10 (`feature/evidence-guides-roadmap-20260917`, head `34bfdba5a66ff93a8a5530a5f96a37b14f43dfb6`) remains a separate content-review lane. It refreshes three guides with primary sources and has its own release gates. Do not fold this diagnostic patch into that stacked clinical/editorial work or treat PR #10 as approved because this patch exists.

## Remaining gates

- Clinical/editorial triage of the remaining high-risk legacy article corpus is still open.
- Clinic pilot scope, reviewer responsibility, legal/data safeguards and acceptance/refund terms remain unapproved.
- Revenue, durable email and payment activation remain gated; no paid demand or fulfilled commerce is proven.
- Public release/copy discrepancy remains open until origin-identifying evidence passes the checklist above.

## Control-plane note

This repository records implementation evidence only. Venture thesis, experiment, review coverage and commercial actuals belong in Amble. The scheduled review environment did not expose the Amble Sprinter MCP, so no canonical review receipt or coverage advancement is claimed here.
