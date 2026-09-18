# Live release / copy-drift investigation

**Date:** 2026-09-17 PT  
**Status:** open risk; diagnostic patch only  
**Reviewed main:** `ee2b5ca36fde9f4f605687db84170ba466f564e9`  
**Current Vercel production deployment observed:** `dpl_9nZFzYSLB7hLctv4jP8Uy9rnZ1ob`

## Why this is open

Repository `main` and the current Vercel production deployment metadata point to the decision-first release. The current homepage source says **“Considering TRT? Compare before you commit.”**, explicitly says there is no treatment score, and frames the product as education for a clinician conversation.

A separate fresh public-web fetch of `https://shotfreetrt.com/` on September 17 returned materially older homepage text instead: an AI-generated 30-day testosterone plan, a “Best first move for most guys” pathway, “EVERY CLAIM SOURCED,” and the prior four-block protocol framing.

That discrepancy is **not yet proof that Vercel's origin is serving the wrong build**. The independent web fetch may be stale or may traverse a different cache/path. Vercel reports the expected Git deployment as READY and assigned to `shotfreetrt.com`. Direct origin HTML retrieval was unavailable in this review environment. Treat this as release-integrity uncertainty until the public response can identify itself.

## This patch

The patch makes future live verification deterministic without changing product, treatment, commerce, analytics, or customer behavior:

- every hosted response receives `X-ShotFreeTRT-Release: <VERCEL_GIT_COMMIT_SHA>`;
- every hosted response receives `X-ShotFreeTRT-Copy-Contract: decision-first-v1`;
- `/api/release` returns the deployed Git SHA and copy-contract version with `no-store` caching;
- a regression test prevents the retired treatment-plan homepage claims from re-entering the current homepage source.

These markers are diagnostic facts, not customer analytics and not a health-data surface.

## Release acceptance after an authorized merge/deployment

Do not call the discrepancy resolved until all of the following are observed from the actual public domains:

1. `https://shotfreetrt.com/api/release` returns the expected merged Git SHA and `decision-first-v1`.
2. The root response headers on `shotfreetrt.com` and `www.shotfreetrt.com` show the same release and copy-contract values.
3. Public root HTML contains the decision-first headline and does not contain any retired claim listed in `tests/release-identity.test.mjs`.
4. The immutable Vercel deployment and both custom aliases agree.
5. If a third-party crawler still shows the old page after the origin checks pass, classify that separately as crawler/cache lag instead of a production rollback.

No DNS, domain, Vercel setting, cache purge, production deployment, payment, email, clinical content, or outbound action is changed by this PR.
