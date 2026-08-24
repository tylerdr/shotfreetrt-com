# Backlog

*Single source of truth for what's next. Coding agents update at session end. Tyler can add at any time.*

---

## Active Sprint
- [ ] T002: Verify live article rendering and on-page polish for `/blog/testosterone-and-anemia` `HIGH`
- [ ] T003: Wire Google Search Console / indexing visibility so article velocity can be measured `HIGH`
- [ ] T006: Deploy and perform an approved real Stripe purchase/refund/dispute/download verification for the Blueprint `CRITICAL`
- [ ] T007: Confirm production GA4 measurement ID and first-party event ingestion across checkout, purchase, and download `HIGH`

## Next Up
- [ ] T004: Publish the next diagnostic content piece after the current design-overhaul changes settle
- [ ] T005: Add affiliate links to `/pricing` cards when final partner URLs are available

## Tech Debt
- [ ] TD001: The repo still carries unrelated local design-overhaul changes on this branch, which increases deployment ambiguity
- [ ] TD002: Add a Stripe webhook/fulfillment ledger if session revalidation is insufficient for reconciliation
- [ ] TD003: Replace the stale `next lint` script with the repository's supported ESLint command for Next 16

## Open Questions (blocking work)
- [ ] OQ001: Should production deploys continue from the current working branch, or should content ships move to isolated article branches? — blocks cleaner release hygiene

## Open Questions (non-blocking)
- [ ] OQ002: Should diagnostic-category badges get a dedicated color treatment instead of falling back to the default blog badge style?

## Completed
- [x] T001: Ship `testosterone-and-anemia` article to production — done 2026-03-31
- [x] T005: Lock paid Blueprint assets behind verified Stripe fulfillment and add commerce/search readiness checks — code-ready on 2026-08-23; deployment pending approval
