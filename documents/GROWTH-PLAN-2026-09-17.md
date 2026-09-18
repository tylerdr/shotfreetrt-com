# ShotFreeTRT: decision-first product and September revenue plan

**Research date:** September 17, 2026. **Implementation:** PR #8, `feature/decision-first-growth-20260917`, against main `fbc72264b0952e76b29e7d3324a44959d2bd47ef`. This is a proposed commercial strategy, not evidence of customer demand or a production release.

## 1. Executive decision

Build the useful step **before a clinic purchase**: understand the choices, get an itemized quote, and arrive prepared for a clinician conversation. Do not sell an autonomous AI hormone protocol. Keep consumer decision tools free initially; test a fixed-fee, clinic-branded education and consult-readiness service as the first recurring revenue product.

Positioning: **“Considering TRT? Compare before you commit.”** The brand's needle-free emphasis is a delivery preference, not a claim that non-injection options are universally better, safer, natural, or fertility-preserving.

The near-term product has two customers with distinct jobs. Men need clarity without being pushed into a drug. Clinics need approved, consistent education and price explanations that reduce repeated administrative work and help existing inquiries reach a suitable consultation. Never make clinical conversion or prescribing volume the optimization objective.

Do not expand this into a general longevity platform, supplement store, lab-interpretation chatbot, EHR, or mass-generated clinic directory this month. The current broad content footprint is not a substitute for demand evidence.

### Scope and evidence boundaries

Owner request: deeply research the site, market, ICP, buying motivations, irresistible offer, first-month value, agent-driven distribution, SEO/AEO/GEO, capabilities, and a realistic September path to $10,000/month; implement funnel improvements and open a PR with the revenue-ready backlog.

Inspected live public pages and current repository source. There were no open PRs at the start of this implementation. PR #7's Google verification token is preserved. No customer interviews, sales, affiliate contracts, conversion tests, medical review, or clinical outcome evaluation were conducted. Search Console access returned a subscription-required error; traffic, rankings, email-list size, conversion rates, and current revenue remain **unknown**, not zero. Third-party prices are dated source snapshots, not patient-specific or real-time quotes.

## 2. What the audit found

The homepage, shared navigation, pricing page, and paid guide told different stories: natural optimization, an advanced AI plan, treatment selection, provider comparisons, and a general longevity PDF. The live library displayed 159 articles, with many topics outside the immediate TRT decision. That establishes breadth, not authority or commercial traction. [S01–S03]

The old pricing matrix mixed medication, membership, tests, and commitments without primary-source links. For example, Fountain's current program page bills Starter every four weeks; Hone's Plus membership excludes medication; Maximus's lowest enclomiphene listing requires a different commitment from its one-month price. These are useful, demonstrable comparison problems—not speculative claims about consumers being overcharged. [S04–S06]

Code-level launch risks:

- `src/app/api/newsletter/route.ts` writes to `data/subscribers.json` in the application filesystem. This is not a durable, concurrency-safe production subscription system for a serverless deployment.
- `src/app/api/checkout/route.ts` derives return destinations from request headers, hardcodes a price ID, and exposes internal errors. It does not establish payment fulfillment or access control.
- The guide success page displays “Purchase Complete” without checking payment and links to a public PDF. A successful redirect is not proof of a paid entitlement.
- Legacy quiz source contains a hand-built candidate score and pathway system. This review did not establish clinical validation. Existing routes and article links remain available; replacing homepage navigation is not a full safety remediation.
- Google Analytics sends full page location/title on navigation, and a separate analytics provider sends page views. Sensitive flows need a real data-flow audit, not a footer disclaimer.
- The existing handoff records a broken `next lint` command and article-type errors. Those baseline claims were not independently reproduced in a full checkout during this session.

## 3. Exact ICP and purchase psychology

### Consumer audience: decision-stage, not symptom-stage

Primary hypothesis: a US adult man, approximately 30–49, already comparing a clinic or preparing a visit in the next 30 days. He prefers to avoid injections, is uncertain about implications for family plans or household use, and wants to understand total costs and commitment. Age is descriptive, not a clinical eligibility rule or sensitive-ad targeting instruction.

Observable intent signals: comparing two named providers; asking what labs or medication a quoted fee includes; asking how oral, topical, or other options differ; researching cancellation terms; or requesting a checklist for an already planned consultation. These signals can inform public content. Do not scrape identifiable health disclosures to build outreach lists.

Surface desires: avoid unwanted injections; understand the medicine being offered; know the full bill; prepare for the appointment; avoid reading contradictory articles all evening.

Deeper desires, explicitly hypotheses rather than interview findings: regain agency; feel capable and present for a partner or family; avoid an irreversible-feeling decision; protect future choices; and feel taken seriously without being pressured. Copy should respect those motivations, not exploit insecurity about masculinity, sexual performance, or aging.

The immediate job is **“Help me decide what to ask and verify before I spend money.”** It is not “Tell me what dose to take.” A clinician conversation, including deciding against treatment, can be a successful outcome. The product should not promise better hormones, fertility, mood, strength, or relationships.

Secondary audience: an existing patient comparing service logistics or renewal costs, with an explicit instruction not to stop or change care based on the comparison. Exclude under-18 users from clinical personalization, performance-enhancing drug cycles, emergency decisions, and DIY prescribing.

### First paying ICP: independent clinics with existing demand

Prioritize owner-led men's-health practices with approximately 1–5 clinicians and 1–3 locations, an accountable clinical reviewer, existing appointment capacity, and roughly 150–400 relevant inquiries per month **to be confirmed in qualification**. The proposed volumes are a screening hypothesis, not measured market data. A lower-volume practice can qualify only when measured administrative savings or other business value justify the fee.

Economic buyer: owner or practice operator. Clinical approver: a named licensed clinician. Implementation counterpart: the person who owns the existing website, booking link, and patient communications.

Good trigger: a new non-injection service, repeated route/cost questions, a recently changed plan structure, or inconsistent explanations across existing pages. A multi-route clinic is a better early fit than an injection-only commodity provider. Capacity and baseline inquiry volume matter more than attractive branding.

Why buy now: remove recurring explanations without hiring another coordinator; give patients one approved source of information; publish actual price inclusions; launch without replacing an EHR; and measure whether the intervention helps. Deeper desire: run a credible practice rather than a call center, protect clinician time, and compete on clarity rather than aggressive medical promises.

Disqualify clinics that want guaranteed prescriptions, per-patient kickbacks, an AI clinician, fabricated testimonials, or acquisition results without existing traffic or a separate acquisition budget. Large national brands are useful pricing references but poor first-sale assumptions because they already have content and acquisition infrastructure.

### Validation interviews before further platform work

Ask five consumers to use the public worksheet on a real or historical quote without uploading personal information. Can they identify an unknown cost, distinguish a billing interval from a commitment, and name the next question for their clinician? Ask ten clinic owners what staff repeatedly explain, how many inquiries they receive, and what they would remove from their workflow in exchange for this service. Request a paid pilot decision, not a compliment. No interviews are claimed completed.

## 4. Competitive reality and differentiation

| Alternative | What the buyer already gets | Implication for ShotFreeTRT |
|---|---|---|
| Maximus | Direct treatment funnel and condition/product education; enclomiphene-only listing $199.99/month for one month, $149.99 on three months, $99.99 on twelve months | Do not charge merely to restate its product page. Preserve the commitment and verify labs/terms separately. [S04] |
| Hone | Clinical memberships and testing; Plus starts from $180, then $135/month, with medication extra | Itemization is useful. Its $25 Basic tier is not a TRT bundle. [S05] |
| Fountain | Clinical delivery with several treatment options; $199/4 weeks, $499/12 weeks, $1,799/48 weeks | Billing normalization and prepayment timing are concrete comparison jobs. [S06] |
| AlphaMD | Direct clinical funnel; its monthly payment option has a published minimum commitment | “Monthly payment” and “cancel anytime” cannot be treated as synonyms. [S07] |
| Defy Medical | Clinical consultations, educational resources, existing quiz and advice-only offerings | A clinician's actual advice is a different product from an AI-generated summary. Do not market the summary as a second medical opinion. [S08] |
| TelehealthTrueCost, FindTRTClinic and other comparison publishers | Cost comparisons and discovery/filtering are already available | A directory or generic comparison article is not a moat. Claims about their audience size are not independently verified. [S09–S10] |
| General AI + a spreadsheet + the clinic's existing materials | A cheap way to summarize and compare information | Our paid value must be implementation, approved facts, source maintenance, and measured workflow utility—not “we use AI.” |

The defensible asset is a **versioned record of sourced facts, clinic-approved explanations, explicit unknowns, and tested handoffs**. Every public price should retain provider, product, jurisdiction scope, bill amount, billing interval, minimum commitment, inclusions, exclusions, source, capture date, and reviewer status. Paid placement must not control the default comparison order.

## 5. Offer and money model

### Consumer: Before You Commit kit — free

Deliver a useful checklist and two-quote worksheet immediately, with no email wall, medical-record upload, or score. The current PR implements this initial version. Share a generic guide link, not personal symptoms, quotes, or eligibility badges. A clinic can share the resource with existing inquiries; that distribution can be more natural than asking men to post hormone details publicly.

A future $49 consumer dossier is a **test**, not the September base case: a structured comparison of user-supplied written quotes and questions, with clear exclusions and privacy controls. Do not call it clinical review unless a qualified clinician actually performs that service. It would require 205 sales to exceed $10,000 gross cash at $49, and none of that is MRR. Validate five paid requests before building a consumer subscription.

### Clinic: Consult-Ready Launch — proposed pilot

**$2,000 setup plus $1,000/month after acceptance.** One clinic brand, one landing experience, a price/inclusions sheet, clinician-approved FAQ, visit checklist, existing-booking-system handoff, and an aggregate performance review. No new EHR, patient-record ingestion, autonomous clinical advice, ad spend, or guaranteed new patient supply.

Proposed delivery commitment: an acceptance-ready installation within seven business days after the clinic supplies complete inputs and reviewer approval, with the actual timing written into the agreement. Proposed risk reversal: refund setup if the agreed installation cannot be delivered and accepted, with defined cure/cancellation terms. This is a deliverable guarantee to negotiate—not a currently active guarantee on an enabled checkout. Month-to-month ongoing service should cover source and price maintenance, one defined update batch, monitoring, and a review of aggregate usage and booking outcomes.

Why this can be compelling: small scope, uses traffic the clinic already has, concrete preview before payment, no system migration, explicit ownership of the deliverables, and no clinical or revenue guarantees. Show a clinic-specific sample before requesting a fit call. Do not increase the price solely to make an arbitrary MRR spreadsheet work.

Protect margins with a fixed template and acceptance checklist. An illustrative initial budget could reserve $500–$1,000 for external review/implementation exceptions; this is a planning allowance, not a vendor quote. Track actual review, support, tool and acquisition costs. Avoid an unlimited custom-content or unlimited-support promise.

### The 10x requirement needs honest arithmetic

Do not claim a 10x first-month return for a medical information product. There is no evidence for that promise here, and health claims need substantiation. [S11]

Define benefit-to-fee ratio separately from net ROI. For a $1,000 monthly fee, 10x gross economic benefit means $10,000 of incremental contribution/savings. With $2,000 setup also paid in month one, a 10x first-month benefit-to-fee ratio requires $30,000 of benefit. Net ROI would subtract the fee again.

Illustrative clinic model, not observed performance: 100 inquiries × a 4-percentage-point improvement in suitable paid-consult conversion × $150 first-month contribution = $600; 25 genuinely redeployed staff hours × $35/hour = $875; total $1,475. That is 1.48x ongoing fee and only 0.49x the $3,000 launch-month fee. Break-even without time savings requires 20 incremental first-month contributions at $150. Tenfold launch-month benefit would require 200. An owner should reject an uneconomic pilot rather than be sold inflated lifetime revenue as month-one profit.

Use clinic-specific baselines, contribution margin, capacity and retained-customer economics to determine fit. Count time as money saved only when cash expense is reduced or capacity is actually redeployed. Report lifetime value separately. Gate scale on demonstrated useful outcomes, not a number chosen to make the offer sound irresistible.

## 6. Agent-driven distribution

### First channel: researched B2B outreach with a useful sample

Agents can identify public clinic sites, capture current offer facts, draft a branded sample, prepare a concise observation, and maintain a source-backed prospect record. They must not invent decision-maker emails, purchase intent, traffic, lost revenue, or ownership. Human-approved sending and a compliant sender identity, postal address, unsubscribe/suppression process, and platform rules remain required. CAN-SPAM also applies to B2B email. [S12]

A prospect record needs: business/domain, public contact channel, observed offer, supporting URL/date, specific opportunity hypothesis, actual qualification status, outreach state, opt-out state, and next action. No patient identities or inferred health conditions.

Initial researched **seeds, not qualified or contacted leads**:

| Business | Observed signal | Personalized opening / next verification |
|---|---|---|
| MD Total Wellness | Publishes several testosterone-related options and plan prices; emphasizes physician ownership | “You already distinguish multiple options and monthly prices. A single pre-visit sheet could help patients compare the inclusions without interpreting a treatment recommendation. Which questions does your team still repeat?” Confirm operator, inquiry volume and review capacity. [S13] |
| Xcel, Huntington Beach | Explains that injections are not its only approach and explicitly emphasizes local providers rather than an AI chatbot | “The demonstration keeps your clinician—not a chatbot—at the center. Would a clinician-approved quote/checklist page reduce repeated administrative questions?” Do not pitch an AI replacement for its stated differentiation. [S14] |
| Limitless Alternative Medicine | Multiple geography/program pages, telehealth workflow, and fertility-conscious options described | “Your pages describe several programs and local lab workflows. A shared approved fact sheet could keep inclusions and next steps consistent across them.” Confirm whether this is actually an operational pain. [S15] |
| AlphaMD | Publicly separates payment frequencies and commitment lengths | Offer a transparent payment-period/commitment explanation prototype; verify staff demand and budget rather than assuming a national provider needs another tool. [S07] |
| Defy Medical | Existing education, quiz, app and advice-only services | Research-partner or content-workflow conversation; lower priority for a rapid small-clinic close. Existing sophistication is a disqualifier unless a specific unmet job is confirmed. [S08] |

A previously surfaced HEXIS page is not a reliable active prospect: its home page returned a suspended-service notice on review. Do not inflate a prospect list by including dead sites or scraped directory records as verified businesses.

Outreach template (draft only):

> Subject: A clearer pre-visit cost sheet for [Clinic]
>
> Your [specific page] describes [verified offering]. I put together a small example showing how patients could see the inclusions and questions to bring before booking—without an AI treatment recommendation or an EHR change. Is [specific repeated question] something your team spends time explaining? The proposed pilot is $2,000 setup and $1,000/month after acceptance; it uses your existing inquiries, not purchased patient leads. Happy to send the example for your review.
>
> [Real sender identity, commercial disclosure, valid business postal address and opt-out method required before sending.]

### Second channel: clinic and professional distribution

Offer the free generic checklist for an approved clinic-resource page, after-booking education, or a clinician newsletter. The clinic controls its patient communications and consent. A discreet “decision worksheet by ShotFreeTRT” link can attract additional practices without revealing patient information. Pursue clinician educators and practice consultants as distribution partners; no medical-referral compensation structure should be enabled without appropriate legal review.

### Third channel: public educational content

Make short, sourced pieces around specific decisions: “four weeks is not a calendar month,” “what is included in the quoted fee,” and “questions to ask about needle-free treatment.” A generic worksheet is shareable; health-score badges are not an appropriate virality mechanism. Agents can draft scripts, format carousels, caption demonstrations and schedule approved posts. No synthetic doctor, fabricated testimonial, fake before/after, automated community spam, or personalized outreach based on a health disclosure.

Do not rely on paid health retargeting or prescription-keyword campaigns as the first channel. Verify platform eligibility, privacy rules, certifications and claim requirements before any paid campaign. Do not launch spending in this PR.

## 7. September plan: cash is not MRR

September 17 is the planning date; September 30 is the target. There are 13 full days after today. No current traffic, list, warm pipeline, partner contracts or baseline conversion rates have been verified.

| Accepted and activated clinics | Setup cash | First recurring payments | Gross cash if both paid by September 30 | Exit MRR |
|---:|---:|---:|---:|---:|
| 1 | $2,000 | $1,000 | $3,000 | $1,000 |
| 3 | $6,000 | $3,000 | $9,000 | $3,000 |
| 4 | $8,000 | $4,000 | $12,000 | $4,000 |
| 10 | $20,000 | $10,000 | $30,000 | $10,000 |

These are arithmetic scenarios, not forecasts. Cash excludes tax, fees, refunds and fulfillment costs; setup may have revenue-recognition obligations beyond collection. Deposits for unaccepted installations are not active MRR. Delayed activation moves the first recurring payment out of September.

The defensible sales objective is four accepted pilots for more than $10,000 gross cash, while treating ten retained clinics as the stretch required for $10,000 MRR. Nothing found supports calling ten September closes a likely outcome. More agents can produce more research and samples; they cannot compress every buyer's review or create budget and trust by assertion.

Illustrative acquisition funnel to test: 200 properly qualified, deliverable business contacts × 8% meaningful positive replies × 75% fit conversations × 25% close = 3 clinics. All rates are assumptions. Ten closes from the same 200 contacts would require much better response or closing, warm distribution, or a larger qualified pool. Measure actual stage conversions before increasing send volume.

### Dated execution sequence

- **September 17–19:** finish exact-head release checks and top-risk content/privacy triage; approve pilot agreement, clinical reviewer responsibility, payment/delivery terms and booking/contact destination. Create 30 source-backed prospect records and three genuine clinic-specific samples. Do not enable enrollment before gates pass.
- **September 20–22:** expand to 100 eligible records, send a small approved first cohort, conduct fit conversations, and seek the first signed paid pilot. Success means an actual buyer and accepted scope, not email opens or compliments. A clinic supplies its existing aggregate funnel baseline and approved content.
- **September 23–26:** fulfill the first installation, verify its handoff and cost statements, then reuse the template for the next clinics. Expand toward 200 contacts only if replies show genuine relevance and suppression/deliverability are healthy. If there is no paid pilot by September 23, freeze feature expansion and diagnose the offer with five owners.
- **September 27–30:** prioritize acceptance, invoicing and usable deployments over more speculative leads. Target four accepted customers; pursue ten only where real pipeline and reviewer capacity support it. Publish cash collected, active MRR, refunds/obligations, delivery cost and pipeline separately.

For subsequent growth, retain the first cohort through measured utility and current information, use their permissioned evidence as case studies, and add distribution partners. At ten clinics, $1,000/month equals $120,000 annualized recurring revenue before churn. Do not build a marketplace or broader platform until repeatable sales and support costs are visible.

## 8. SEO, AEO and GEO

The intent cluster should be narrow: needle-free treatment distinctions, appointment preparation, true-cost comparison, and provider terms. Start by reviewing existing URLs rather than generating new duplicates. Proposed briefs: needle-free TRT versus fertility considerations; topical versus oral product questions; enclomiphene versus replacement testosterone terminology; first-year cost components; cancellation/commitment comparison; and a visit preparation checklist. Medical articles require qualified review before stronger individualized claims are made.

Use primary clinical/regulatory sources for clinical claims and provider-owned pages for their commercial terms. Add real author/reviewer identity where authorized, source capture dates, meaningful update dates, change history, explicit uncertainty and a visible corrections channel. Never invent credentials or “medically reviewed” badges. The FDA's February 2025 labeling change is an example of why older generalizations about testosterone boxed warnings need checking against the current exact product label. [S16–S17]

Technical changes in this PR: decision-focused page metadata, explicit canonicals for the changed/new public pages, Organization/WebSite identifiers, visible-content-matching FAQ structured data, a sitemap entry for the useful guide, and removal of artificial fresh dates on unchanged static pages. The pilot proposal stays noindex. No search ranking or rich-result appearance is guaranteed.

Google's current generative-AI optimization guidance emphasizes useful original information and standard search foundations; it does not make `llms.txt` or special AI schema a shortcut. Avoid hundreds of thin pages for query variations. The practical differentiator is inspectable original work: an actual calculator, accurate billing normalization, documented unknowns and approved explanations. [S18]

Restore Search Console access, confirm ownership/property scope, then export page/query/device data and indexing evidence. The newer Google guide mentions generative-AI reporting; verify actual availability in this property instead of assuming it is enabled. Track qualified guide visits and clinic inquiries alongside search metrics. Do not label every AI referral or brand mention as a sale or promise SEO will create September revenue.

For answer-engine checks, maintain 12 fixed questions with saved outputs, date, engine/model, cited source, incorrect facts and branded mentions. These are repeatable observations, not deterministic rankings. Audit whether the page's visible answer is accurate before optimizing how frequently it is repeated elsewhere.

## 9. Astra/Fable operating design

Official current documentation describes GPT-6 Astra for complex reasoning, coding, computer use, research and document work; Anthropic lists Claude Fable 5.1 for advanced coding and knowledge work. Both list $10/million input and $50/million output token base prices in the reviewed sources; caching, tools and configurations can change actual costs. These are vendor descriptions, not benchmarks independently run for this product. [S19–S20]

Use Astra for source collection, structured extraction, code changes and release-test execution. Use Fable as a separately prompted editor/critic for clarity and unsupported claims. The architecture should allow either provider to fill a role after evaluation, rather than making a model name the customer proposition.

The workflow: allowlisted public source → structured claim or price record → deterministic consistency checks → independent critique → named human approval where clinical judgment is involved → versioned public content → monitored expiry/change queue. A model must abstain when a price is inaccessible or a statement is not supported. No model may auto-approve a medical claim merely because another model agrees.

Keep common visitor pages and quote calculations deterministic. The PR adds **no live model calls**; it does not claim Fable has reviewed these outputs. A hypothetical 25,000-input/4,000-output-token call at the cited base prices costs $0.45 before additional tools, retries, cache writes or uncounted reasoning output. Actual workflow costs need metering. Avoid paying that repeatedly to regenerate the same public explanation.

Do not build patient-record ingestion, lab interpretation, dose suggestions, diagnostic eligibility scores, autonomous prescribing, or AI-to-patient clinical messaging in the first release. If later handling regulated data, separately establish the contracts, lawful basis, access controls, retention, provider policies and incident response; the presence of an API or a BAA option is not blanket compliance. FTC health-data obligations can apply outside HIPAA, and unauthorized advertising disclosures are a real enforcement risk. [S21–S22]

## 10. Full prioritized launch backlog

Effort ranges are planning estimates, not delivery commitments. Clinical and legal review capacity is an external dependency. “Agent” means a bounded execution role, not an authorization to publish, spend, send messages or make treatment decisions without the relevant gate.

| ID / priority | Work and accountable role | Acceptance / dependency |
|---|---|---|
| DONE-01 / branch only | Decision-first homepage, pricing and navigation — build agent | Implemented in PR; no claim of conversion lift or production deployment. |
| DONE-02 / branch only | Free checklist and quote planner — build agent | 19 focused tests pass; blanks block totals; 28-day billing is distinct; generic sharing carries no entries. Full browser testing still open. |
| DONE-03 / branch only | Pilot proposal and metadata — build agent | Noindex, no payment flow, enrollment disabled without explicit configuration. GSC token preserved. |
| P0-01 / 0.5–1 day | Exact-head release QA — independent QA agent | Full install/build/typecheck; compare baseline errors; mobile 360/390 and desktop 1440 widths; keyboard, contrast, print, clipboard failure, hydration and console checks; inspect new page source, canonical and sitemap. No new failures accepted. |
| P0-02 / 1–2 days | Legacy quiz and high-risk content triage — clinical reviewer + build agent | Inventory scoring, pathway recommendations and share routes; stop promoting unvalidated personalized treatment guidance; prioritize dosing, AI protocols, fertility, oral safety and anastrozole claims; approved corrections or explicit quarantine plan before acquisition. Do not pretend homepage changes remediate all articles. |
| P0-03 / 1–2 days | Analytics/privacy boundary — privacy lead + build agent | Inventory every destination and payload; no health answers, lab data, names, share IDs or health-bearing query strings in marketing analytics. Test initial load and SPA navigation. Establish consent, retention and deletion requirements; do not claim HIPAA compliance without applicable review. |
| P0-04 / 1–2 days | Existing commerce integrity — payments agent | Trusted return origin; server-side product/price configuration; verified signed payment event and idempotent fulfillment; genuine entitlement check; refund/recovery flow. Migrate public paid-guide delivery without breaking legitimate existing purchasers. Preserve audit trail. |
| P0-05 / 0.5–1 day | Durable subscription capture — build agent | Configured ESP/database, timeout and error states, opt-in/consent record, duplicate/rate-limit handling and tested delivery. Return failure honestly when unavailable; no local JSON persistence as production source of truth. |
| P0-06 / review-dependent | Pilot contract and clinical accountability — operator + counsel + clinic reviewer | Signed scope, acceptance/refund terms, reviewer responsibility, fixed fair-value service fee, editorial independence and appropriate data terms. Assess applicable federal/state referral and fee-splitting rules; fixed fees alone do not guarantee legality. [S23] |
| P0-07 / 0.5 day | Enable a real business inquiry destination — operator + build agent | Set `CLINIC_PILOT_ENROLLMENT_ENABLED=true` and a verified HTTPS `CLINIC_PILOT_CONTACT_URL` only after gates pass. Test receipt and follow-up. Do not ask for patient information. Update noindex only when offer is genuinely public-ready. |
| P0-08 / 1–2 days | Prospect validation and first cohort — research/sales agent | 30 audited records then 100; source/date/contact channel, specific hypothesis, genuine owner resolution, no patient scraping. Approved sender identity, opt-out and suppression before sending. |
| P0-09 / 2–5 days | First paid demand test — sales agent + authorized signer | Ten fit conversations, documented objections and explicit pilot decisions. No fake urgency. Stop additional product scope if no paid pilot by September 23. |
| P0-10 / 2–4 days per first template | Clinic-branded deployment template — build agent + clinic reviewer | One configuration-driven experience with approved brand, current prices, services, source dates and booking link. No PHI or EHR integration. Clinic signs acceptance after mobile and handoff checks. |
| P0-11 / 0.5–1 day | Business baseline and value measurement — analytics agent + clinic operator | Define inquiries, suitable consult bookings, attendance, staff time, contribution, review cost and capacity. Use aggregate counts; distinguish correlation from lift and lifetime value from first-month contribution. |
| P1-01 / 1–2 days | Typed source/price ledger — research + build agents | Product, billing period, commitment, inclusions, exclusions, state scope, source/date, status and change history required. Unknowns cannot silently become “included.” |
| P1-02 / ongoing | Source refresh queue — research agent | Price review at least every 14 days during pilots; material changes trigger review. Expired/unverifiable claims display stale/unknown status rather than quietly continuing as current. Clinical updates require the appropriate reviewer. |
| P1-03 / 2–4 days | Editorial standard and top intent pages — editor + clinical reviewer | Reuse/upgrade six appropriate existing URLs; direct answers, source-backed distinctions, true author/reviewer identities, meaningful dates, corrections path and guide CTA. No unsupported clinical outcome claims. |
| P1-04 / 1–2 days | Existing content consolidation — SEO agent | Inventory all articles; classify keep/review/merge/retire; preserve valuable URLs with relevant redirects where justified. Do not mass-delete or redirect unrelated pages to the homepage. |
| P1-05 / access-dependent | Search baseline and AI answer audit — SEO agent | Restore GSC access; confirm property and indexing; export baseline; maintain 12 repeatable answer-engine queries and evidence. Do not report fabricated volumes or imply schema guarantees visibility. |
| P1-06 / 1–2 days | Consent-aware funnel instrumentation — analytics agent | Allowlisted non-sensitive events for guide open, comparison completion, print/share and clinic inquiry; no values/health topics in event payloads. Verified operational consent/storage design first. |
| P1-07 / 1–2 days | Clinical-safe distribution assets — content agent + approver | Three demonstrations and three short educational scripts derived from approved facts; accessible captions; no synthetic clinicians, fake testimonials or biomarker before/after claims. |
| P1-08 / 1–2 days | Partner kit — partnership agent | Branded generic checklist, embedding/link guidance, editorial rules and approved disclosure. Partner agreement cannot purchase favorable clinical ranking. |
| P1-09 / 1–2 days | Consumer usability and optional paid dossier test — research agent | Five observed worksheet sessions; fix confusion. Only test $49 after five explicit paid commitments and a truthful delivery/privacy/refund design; never call it a clinical second opinion without actual clinician service. |
| P1-10 / 1 day | Agent evaluations and cost controls — build agent | Provider/model/version logged; source-entailment and arithmetic fixtures; fail closed on missing evidence; hard tool/spend budgets; independent review queue. No patient inputs sent to an unapproved model. |
| P1-11 / 1–2 days | Performance and accessibility — QA agent | Measure real page loading, layout shift, interaction and bundle costs; retain server-rendered readable content; eliminate accidental overflow/poor print behavior. Compare against baseline, not invented scores. |
| P1-12 / 1–2 days | Baseline engineering debt — build agent | Repair supported lint command and article type errors with before/after evidence. Do not enable paid CI or alter billing settings as part of this PR. |
| P2-01 / after retention proof | Clinic portal and reusable platform modules — product/build agents | Only build where repeated update/review work is measured. Tenant isolation, roles and audit trails before multi-client private data. No premature EHR scope. |
| P2-02 / after legal and demand review | Sponsorship/affiliate experiments — partnerships + counsel | Written agreements, transparent placements and separate editorial criteria. No unreviewed prescription or patient-referral commissions. |
| P2-03 / after measured economics | Acquisition/retention expansion — growth agent | Two cohorts with documented delivery cost, retention and useful outcomes; explicit paid-channel eligibility; reviewed budget before spend. Scale what sells, not article count. |

### Release acceptance commands and manual checks

Run `node --experimental-strip-types --test tests/decision-guide.test.mjs` on Node 22.16+; then the full repository's install/build/typecheck and supported lint. The new isolated test command does not replace full application validation.

Verify `/`, `/pricing`, `/decision-guide`, `/for-clinics`, a representative existing article and existing guide flow. Test both direct navigation and client-side navigation; zero and unknown costs; malformed money; different cadences; mobile overflow; keyboard labels; clearing; browser print; clipboard rejection; sitemap URLs; structured data; and preservation of the GSC token. Confirm the pilot has no live enrollment without both configuration values. The source-level no-upload test is not a substitute for network inspection of the whole application.

## 11. Evidence register

All links reviewed or surfaced during September 17 research. Clinical guidelines, provider marketing and our inferences are different evidence classes. No vendor marketing outcome claim has been adopted as independently proven clinical efficacy.

- **S01** Live homepage: https://shotfreetrt.com/
- **S02** Live library: https://shotfreetrt.com/blog
- **S03** Existing paid guide: https://shotfreetrt.com/guides/longevity-blueprint
- **S04** Maximus product listing: https://shop.maximustribe.com/testosterone/enclomiphene-only
- **S05** Hone plan overview, updated August 31, 2026: https://help.honehealth.com/hc/en-us/articles/40161781101335-Hone-Health-Membership-Overview-Compare-Basic-Plus-Premium-Plans
- **S06** Fountain current program and billing intervals: https://fountain.net/trt
- **S07** AlphaMD public plans and workflow: https://www.alphamd.net/
- **S08** Defy public services and workflow: https://www.defymedical.com/
- **S09** Competing cost comparison (secondary; not used as source of clinic prices): https://www.telehealthtruecost.com/trt/guides/trt-cost-without-insurance.html
- **S10** Competing directory: https://www.findtrtclinic.com/
- **S11** FTC health-product claim substantiation: https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance
- **S12** FTC CAN-SPAM guidance: https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
- **S13** MD Total Wellness service page: https://mdtw.co/testosterone-therapy-orange-county/
- **S14** Xcel public positioning: https://xcelwell.com/
- **S15** Limitless public service/workflow: https://limitlessaltmed.com/trt-orange-county/
- **S16** Endocrine Society testosterone guideline resource: https://www.endocrine.org/clinical-practice-guidelines/testosterone-therapy
- **S17** FDA February 28, 2025 labeling update: https://www.fda.gov/drugs/drug-alerts-and-statements/fda-issues-class-wide-labeling-changes-testosterone-products
- **S18** Google generative-AI optimization guide: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- **S19** OpenAI Astra documentation: https://developers.openai.com/api/docs/models/gpt-6-astra and https://openai.com/index/gpt-6-astra/
- **S20** Anthropic Fable availability/pricing: https://www.anthropic.com/claude/fable
- **S21** FTC health-breach guidance: https://www.ftc.gov/business-guidance/resources/complying-ftcs-health-breach-notification-rule-0
- **S22** FTC GoodRx enforcement: https://www.ftc.gov/news-events/news/press-releases/2023/02/ftc-enforcement-action-bar-goodrx-sharing-consumers-sensitive-health-info-advertising
- **S23** HHS OIG fraud/abuse laws: https://oig.hhs.gov/compliance/physician-education/fraud-abuse-laws/
- **S24** FDA compounded-drug limitations: https://www.fda.gov/drugs/human-drug-compounding/understanding-risks-compounded-drugs

## 12. Final operating rule

The next proof is a clinic that pays for an accepted, useful installation—not another hundred articles and not another frontier-model wrapper. Preserve the free consumer utility and clinical boundaries, run the small paid demand test, and expand only after buyer behavior and measured delivery economics justify it.
