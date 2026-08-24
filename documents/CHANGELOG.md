# Changelog

*Append-only, newest first. Never edit old entries.*

## 2026-08-23 — verified paid Blueprint delivery and commerce measurement (Codex session)

**Branch:** feature/portfolio-commerce-search-20260823 (not deployed)
**Tyler's prompt:** "I've gotten a couple sales on alive longevity and peaked labs please review both and protocl rank and other sites with buy buttons and ensure they are optimized for real value add and revenue optimization to drive conversion and use marketing best practices and are agent-native using the vercel tool to check sites. then review these and praxium landing to see why peaked labs and other are driving so much more meaningful searhc impressions than praxium landing and make all optimized for SEO/AEO/GEO end-to-end and conversion with proper usage, analytics and tracking setup for each and the full google system properly wired."

**Shipped in this lane:**
- Paid asset protection: request-order redirect/proxy for both legacy PDF URLs plus a Node download route with Stripe session, price, product, amount, currency, and quantity verification.
- Server-verified success state with noindex/nofollow metadata; no download link is rendered for unverified sessions.
- Sanitized first-touch attribution envelope in Stripe metadata/client reference ID, without PII.
- GA4/first-party `begin_checkout`, verified `purchase`, and download events with transaction/value/currency/item fields.
- Removed stale SearchAction schema and direct PDF Link prefetch; changed Blueprint promotion from free framing to $19 paid framing.
- Added `scripts/verify-growth-readiness.mjs` and `npm run verify:growth`.

**Verification:** `npm run verify:growth` passed; `npm run build` passed. Existing `npm run lint` script fails before linting because `next lint` is not supported by this Next 16 setup. No live checkout, external settings, deploy, or production write was performed.

**Follow-up:** configure Stripe/GA4 production env, run an approved purchase/refund/download check after deploy, and consider a Stripe webhook ledger for durable fulfillment reconciliation.

## 2026-08-23 — entitlement and analytics hardening (Codex follow-up)

**Branch:** feature/portfolio-commerce-search-20260823 (not deployed)

**Shipped:**
- Added a server-side Stripe success exchange that consumes the raw Checkout Session ID, sets a signed short-lived HttpOnly entitlement cookie, and redirects to a clean success URL.
- Removed Checkout Session IDs from download links, page URLs after exchange, GA4/Supabase payloads, and purchase transaction IDs; analytics uses a non-authorizing HMAC order token.
- Revalidated PaymentIntent success plus all listed charge refund/dispute state before fulfillment; added fail-closed behavior for incomplete charge pagination.
- Added server-side `download_success` recording after the PDF response is constructed; client event is explicitly `download_click`.
- Queued GA4 events until gtag is ready, sanitized analytics paths/metadata, bounded attribution without invalid JSON truncation, and aligned privacy copy.

**Verification:** `npm run verify:growth`, `node --check scripts/verify-growth-readiness.mjs`, `git diff --check`, and `npm run build` passed. A full `npx tsc --noEmit` still reports pre-existing `src/data/articles.ts` shape errors; no errors were reported in the changed commerce/analytics files when filtered. No live checkout, external setting, or deployment was performed.

**Follow-up:** configure `ENTITLEMENT_SIGNING_SECRET`, run approved paid/refund/dispute/download probes, and confirm GA4 plus first-party `download_success` ingestion.

## 2026-08-23 — browser-bound checkout state and fail-closed commerce ingestion (Codex follow-up)

**Shipped:**
- Added a signed HttpOnly browser state nonce issued before checkout creation, bound into Stripe metadata, and consumed by the success exchange.
- Replaced recoverable entitlement payloads with AES-GCM encrypted, signed tokens requiring a minimum 32-byte signing/encryption secret.
- Disabled GA automatic pageviews in favor of explicit pathname-only events and removed uncontrolled `utm_term`/`utm_content` attribution.
- Restricted attribution to allowlisted source/medium/referrer values; free-form campaign values are discarded.
- Removed non-idempotent first-party client purchase ingestion. Server commerce ingestion is now fail-closed behind `SERVER_COMMERCE_INGESTION_READY` until a migration-backed idempotent path exists.

**Verification:** `npm run verify:growth`, filtered changed-file `npx tsc --noEmit`, `node --check scripts/verify-growth-readiness.mjs`, `git diff --check`, and `npm run build` passed. Full typecheck retains pre-existing article-shape errors outside this lane. No live checkout, external setting, or deployment was performed.

## 2026-08-23 — retry-safe checkout state and explicit GA location (Codex follow-up)

**Shipped:**
- Checkout-state cookies are consumed only after a verified entitlement cookie is successfully issued, so unpaid or transient Stripe failures remain retryable.
- GA4 explicit pageviews now include `page_path` plus query-free `page_location` (`origin + pathname`) while automatic pageviews remain disabled.

**Verification:** `npm run verify:growth`, changed-file TypeScript filter, `node --check scripts/verify-growth-readiness.mjs`, `git diff --check`, and `npm run build` passed. No deployment or external changes were made.

---

## 2026-03-31 — testosterone-and-anemia article shipped (Codex session)

**Branch:** feature/design-overhaul-light-theme -> deployed locally to production alias
**Tyler's prompt:** "Wire a new article into the shotfreetrt.com production site and deploy it."

**Shipped:**
- `src/data/testosteroneAndAnemia.ts` — new testosterone/anemia diagnostic article with required tables, FAQ, and internal links
- `src/data/articles.ts` — registered the new article in route generation and lookup helpers
- `documents/PLAN-testosterone-and-anemia-2026-03-31.md` — saved execution plan for this ship

**Verification:**
- `npm run build` passed locally
- Vercel deployment ready: `https://shotfreetrt-dinlkwvqb-tai-durden-ai.vercel.app`
- Production alias confirmed: `https://shotfreetrt.com`
- Live route check: `https://shotfreetrt.com/blog/testosterone-and-anemia` -> HTTP 200

**Decisions:** none
**Follow-up / tech debt created:** none

---

## YYYY-MM-DD — [Brief description] (Claude Code / Codex session)

**Branch:** feature/name → merged to main (PR #N)
**Tyler's prompt:** "[verbatim or close paraphrase of the instruction that kicked this off]"

**Shipped:**
- `path/to/file.ts` — [what it does]
- `path/to/other.ts` — [what it does]

**Decisions:** ADR-001
**Follow-up / tech debt created:** [Any items added to BACKLOG.md]

---
