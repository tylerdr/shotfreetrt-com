# Session Handoff

**Session date:** 2026-08-23
**Agent:** Codex
**Branch:** feature/portfolio-commerce-search-20260823
**Status:** code-ready; not deployed

## Completed

- Legacy public PDF URLs are blocked by request-order redirects and `src/proxy.ts`.
- Paid fulfillment now uses `/api/download/longevity-blueprint` in the Node runtime and verifies a completed, paid Stripe session, the fixed $19 price, product name, currency, single quantity, successful PaymentIntent, and charge refund/dispute state before reading the PDF.
- Checkout now issues a browser-bound signed state nonce before Stripe session creation; the success exchange requires that state, consumes it only after entitlement issuance succeeds, and redirects cleanly. Failed/unpaid/transient exchanges remain retryable. The entitlement cookie is AES-GCM encrypted, signed, short-lived, HttpOnly, and never contains a recoverable/plaintext Stripe session ID. The success page is server-verified, has `noindex,nofollow` metadata, and exposes no download on missing/invalid/unpaid/refunded/disputed sessions.
- Checkout captures a sanitized first-touch attribution envelope in Stripe metadata and a non-PII client reference ID.
- GA4 and first-party events distinguish `begin_checkout`, verified `purchase`, `download_click`, and server-recorded `download_success`; purchase tracking uses a non-authorizing HMAC order token, queues until gtag is ready, emits explicit query-free origin+pathname pageviews, and strips uncontrolled/query data.
- Removed the stale SearchAction markup and the direct Next `Link` to a PDF. The Blueprint promotion now presents the product as a $19 paid guide.
- Added `npm run verify:growth` deterministic commerce/search readiness checks.

## Verification

- `npm run verify:growth` passed.
- `npm run build` passed; Next reported the new dynamic checkout/download/success routes and proxy.
- `npm run lint` remains unavailable because this repo's existing `next lint` script is incompatible with Next 16 (`Invalid project directory .../lint`).
- `npx tsc --noEmit` was started but interrupted while the parent task was being finalized; `next build` completed with this repo's configured type-validation skip.

## Required production gates

- Set `STRIPE_SECRET_KEY` and verify the configured Stripe price belongs to the expected product. Set `STRIPE_BLUEPRINT_PRODUCT_ID` when the live product ID is confirmed.
- Set a stable `ENTITLEMENT_SIGNING_SECRET` (the Stripe secret is a development fallback) before enabling production fulfillment.
- `ENTITLEMENT_SIGNING_SECRET` or its development fallback must be at least 32 bytes; production should use the dedicated secret.
- Set `NEXT_PUBLIC_SITE_URL` to the approved canonical origin if it differs from `https://shotfreetrt.com`.
- Configure GA4 measurement ID and confirm first-party analytics ingestion; no account settings or production deploy was changed in this session.
- Keep `SERVER_COMMERCE_INGESTION_READY` unset/false until a migration-backed idempotent purchase/download RPC exists; client purchase ingestion is intentionally disabled until then.
- Run approved real purchase/refund/dispute/download verification after deployment. No live checkout or payment was created here.

## Next work

- Review the draft diff, merge through the normal PR gate, deploy only with explicit approval, then verify both legacy PDF paths redirect and the authenticated download returns the private headers.
- Add a Stripe webhook/fulfillment ledger if durable post-payment reconciliation is required beyond session verification.
