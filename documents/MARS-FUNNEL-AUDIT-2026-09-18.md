# Mars funnel audit → ShotFreeTRT implementation

Date: 2026-09-18. Implementation based on main 205a12ba4ac7650ac2160ec79f135b38ddf97a4d. This is public-page research, not access to Mars's conversion data, customer database, ads account or automated email sequence.

## What is observed, inferred, and unverified

Primary pages inspected:
- https://mengotomars.com/ — benefit-first hero, repeated purchase CTAs, ingredient/mechanism modules, customer-proof claims, usage timeline, offer stack, subscription/refund FAQs, email opt-in.
- https://mengotomars.com/products/30-day-supply-starter-kit — product purchase and gift-stack presentation.
- https://mengotomars.com/pages/prepare-for-lift-off — science/education positioning.
- https://mengotomars.com/pages/mars-men-protocol — long-form advertorial structure.
- https://mengotomars.com/pages/affiliate-program — creator recruitment, commission and customer-coupon terms.
- https://mengotomars.com/pages/quiz-v6 — page exists, but the available web renderer exposed only a theme fragment, not the question sequence.
- https://mengotomars.com/pages/quiz-energy — discovered entry URL; rendered flow was not accessible.

The public affiliate page describes 15% commissions, a customer coupon and creator eligibility/application. These are Mars's published terms, not a ShotFreeTRT agreement or a recommendation to promote its supplement. The program recruits inbound creators; that is a different commercial model from referring readers to external clinics.

No reliable evidence was obtained for Mars's completion rate, conversion rate, retention, customer acquisition cost, affiliate revenue, actual question branching, email cadence, or referral attribution. The audit therefore does not claim that the implementation reproduces a fully observed quiz or a proven conversion lift. Public timers and claims were observed as page content; their runtime behavior was not tested, so no claim about timer resetting is made.

## Borrow the structure, not the medical claims

| Observed pattern | Why it may help (hypothesis) | ShotFreeTRT adaptation | State |
|---|---|---|---|
| A concrete benefit before product detail | Makes the next action understandable | Four concerns with a useful, non-clinical output promise | Implemented in this change |
| Dedicated quiz entrances | Matches the reason a visitor arrived | Four topic pages and quiz variants; each changes order but never prefills an answer | Implemented; no diagnosis, treatment score or new clinical engine |
| Visual mechanism/benefit modules | Reduces a wall of text into scannable distinctions | Existing approved illustrations, three short sourced takeaways, preview of the brief, explicit next-question panel | Implemented |
| Repeated contextual CTAs | Reduces the need to return to the top after learning | Topic hero, post-explainer CTA, mobile sticky CTA with bottom clearance, and eleven mapped article entrances | Implemented |
| FAQ and risk reversal near a decision | Answers purchase/friction objections where they arise | No-email/no-account/free-result disclosure and explicit limits before starting | Implemented; no fabricated guarantee |
| Routine and timeline | Gives a reason to return and a next behavior | Before/during/after visit checklist plus optional generic seven-day calendar download | Implemented; a workflow timeline, not a promised health result |
| Gifting/bonus stack | Makes a tangible deliverable easier to see | Show actual brief, worksheet and user-controlled reminder features; no invented dollar values | Implemented |
| Affiliate recruitment | Creates a potential distributed acquisition channel | Draft partner specification requiring signed terms and disclosures | Pending commercial agreement, not activated |
| Subscription and email retention | Can support recurring use when real value persists | Do not enable recurring charges or email capture until useful paid fulfillment and consent/suppression are proven | Explicitly gated |

Avoid copied copy, artwork, endorsements, reviews, ingredient/outcome claims, fear-based anti-treatment narratives, fake scarcity, and unsupported testosterone/fertility results. FTC health-product guidance requires appropriate substantiation: https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance .

## The implemented journey

Home or relevant article → focused topic explanation → six-question private quiz → next useful action and appointment brief → quote worksheet/print → optional generic share or calendar file.

Public topics: `/topics`, `/topics/energy-and-testing`, `/topics/fertility-questions`, `/topics/needle-free-options`, `/topics/clinic-costs`.

Quiz variants: `/quiz/concern/[slug]`, all noindex and excluded from the sitemap. The general `/quiz/healthspan` remains available. All six existing questions remain and all answers are selected by the visitor. The original answer-to-brief logic is reused, rather than adding four clinical scoring models. Identical answers must produce the identical brief regardless of starting path.

Topic and quiz routes use the existing isolated root that renders no Google Analytics or custom analytics provider. Answer-dependent links retain `prefetch={false}`. Standard hosting logs can still record page URLs; do not claim browsing itself is invisible. The generic share and calendar exports contain neither answers nor a concern slug. Export happens only after an explicit click; no calendar entry or email is sent automatically.

## SEO / AEO / GEO changes and limits

Implemented: crawlable static topic pages, unique titles/descriptions/canonicals, explicit OG images, visible breadcrumbs and matching BreadcrumbList/WebPage data, internal linking from home/navigation and selected articles, sitemap inclusion for public topics only, noindex quiz variants, safe JSON serialization, meaningful date metadata, and article image/word-count metadata fixes. Existing URLs, GSC verification, robots settings, privacy roots, and release identity markers are preserved.

No FAQ rich-result, AI citation, ranking, traffic or sales gain is guaranteed. These changes are not every possible SEO tactic and do not establish indexing. Google's guidance describes the same search foundations for AI features and does not require special AI files or schema: https://developers.google.com/search/docs/appearance/ai-features . Do not mass-produce diagnosis/condition pages simply to feed a common quiz. Each new public page needs distinct useful content.

Still pending: property-level Search Console data access and live indexing evidence; whole-corpus medical/FAQ accuracy review; PR #10's source-refreshed article review and conflict-aware integration; field performance/accessibility evidence; external answer-engine sampling; approved measurement and consent policy. PR #10's existing draft is not silently merged or declared medically approved by this work.

## Conversion experiments, without claiming results

1. Concern-led home CTA vs direct general quiz. Hypothesis: matching entry intent improves usable brief completion. Measure starts and voluntarily reported brief utility, not a treatment or prescription conversion. Proposed gate: five observed users, at least four complete the task without help and none interpret the brief as a diagnosis. Stop/change if medical misunderstanding appears. Window: first seven days after verified release. No new spending or unapproved analytics.
2. Post-reading contextual CTA. Hypothesis: a relevant next step reduces abandonment compared with a generic footer. Denominator: visitors to the eleven mapped articles where measurement is authorized. Primary outcome: completed useful brief, not just link clicks. Keep a stable cohort/window rather than resetting daily; review after at least 100 eligible visits or fourteen days, acknowledging low power.
3. Reminder/share utility. Hypothesis: user-controlled return tools help people use the brief at the next conversation. A file download or copy is not proof of follow-through, referral or a sale. Validate with voluntary follow-up or observed tasks; do not transmit answers to analytics. Stop if users misunderstand what the file contains or believe a medical appointment was booked.

Execution owner: Tai research/build/QA roles. These are proposals pending Amble reconciliation, not dispatched jobs. No Amble connector was available in discovery and no accepted thesis/experiment receipt is claimed.

## Revenue readiness: separate gates

The existing public tool is free. A narrow Stripe product-name search for `ShotFree` on the connected Sprinter account returned no matches; that is not a full catalog audit or proof that no differently named product exists. No active ShotFreeTRT affiliate agreement or accepted new paid offer was retrieved. Therefore no purchase/subscription/lead-delivery system is represented as operational by this release.

To activate a paid product or affiliate channel, require the exact offer and price, authorized seller/partner, claim/disclosure review, customer acceptance criteria, payment/refund/fulfillment tests, support ownership, and attribution reconciled to actual accepted or settled events. A tracked outbound click is not earned commission; a checkout redirect is not payment evidence. Do not create a new medical service or fee arrangement to manufacture a revenue-ready label.

Most useful next commercial decision: authorize a bounded non-clinical paid deliverable or a specific signed affiliate arrangement. Reuse the current catalog and approval path rather than inventing a SKU or transplanting Mars's economics. Until that exists, keep purchase and newsletter paths honestly disabled and improve the free utility.
