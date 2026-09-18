# ShotFreeTRT: make the decision easier, then prove the business

**Planning date:** September 17, 2026 (America/Los_Angeles). **Workstream:** PR #10, following merged PR #9. **Status:** roadmap and commercial hypotheses, not a claim of active paid services or measured conversion lift.

## 1. The decision

Preserve the new quiz-led experience. Build a useful decision companion for an adult who is already comparing testosterone-related care or preparing a clinician visit, not a general-purpose longevity publisher or an automated prescriber.

The customer outcome is simple: **leave with the next question to ask, the information still missing, and a more complete written quote.** A decision not to pursue treatment can be a successful outcome. A purchase or prescription is not the clinical optimization objective.

The three linked jobs are:

| Job | Useful output | Evidence that the product helped |
|---|---|---|
| Understand the options | Distinguish replacement testosterone from medicines affecting production, without choosing a drug automatically | Reader can explain the distinction and one unresolved clinical question |
| Understand the routine | Know which exact product instructions and monitoring questions to confirm | Reader does not generalize one brand's instructions to every oral product |
| Understand the bill | Separate inclusions, unknown costs, billing intervals and commitment | Reader produces an itemized comparison without treating unknowns as zero |

The first complete path is **question-specific article → decision quiz → printable appointment brief → written-quote worksheet → real clinician conversation**. This path already contains more product utility than a generic AI summary. Its value still needs to be observed in use.

## 2. Current baseline and what this PR changes

PR #9 merged during this task at `9c0b6ad7717ca231930cafc62bbd806672f99f20`. This follow-up was moved onto that merged main commit rather than restoring an earlier draft. It preserves the six-question deterministic quiz, two analytics-isolated root layouts, no-prefetch answer-dependent links, final mobile gutters and CTA contrast fixes, existing approved illustrations, free guide, compatibility redirects and global 404. The old treatment-scoring API remains removed. Payments and email fulfillment are not activated here.

PR #10 implements three existing-URL article replacements, a shared article read boundary, responsive diagrams, source-linked explanations, consistent FAQ/metadata, updated sitemap dates and a curated library entry point. The client filter now receives article summaries rather than full HTML bodies, sections and FAQs. This is a structural payload improvement; no measured percentage or real-user performance score is claimed.

The full legacy corpus is not medically reviewed. The homepage's clinical-safety boundaries do not automatically correct claims inside old articles. The selected URLs are prioritized by decision relevance, source quality and observed content defects, **not by verified traffic or keyword volumes**. No new Search Console performance dataset, customer interviews or paid-demand evidence was collected in this pass.

## 3. Why these three articles come first

| Existing URL | Reader's decision | Revision and useful asset | Next action |
|---|---|---|---|
| `/blog/enclomiphene-vs-trt` | Are these two approaches actually the same? What does fertility evidence establish? | Mechanism comparison; trial-population/endpoints/limitations table; distinction between hormone, semen and pregnancy outcomes | Use the quiz to prepare clinical questions, not receive a winner |
| `/blog/oral-testosterone` | What would the exact product require in daily use and monitoring? | Current label-based food and monitoring explanations; product-specific blood-test window chart; corrected warning context | Obtain written product and monitoring instructions from the clinician |
| `/blog/trt-cost-2026` | What will I pay, and are these two quotes comparable? | Dated provider examples; six-field cost checklist; annualized budget versus advance-billed cash illustration | Fill the existing quote worksheet with confirmed numbers |

The source and correction ledger is [RESEARCH-LEDGER-2026-09-17.md](RESEARCH-LEDGER-2026-09-17.md). The articles reuse their canonical URLs and original publication history. No duplicate query-variation pages are added.

Each guide has an answer summary, anchored contents, source references next to material claims, a visible update date, a comparison or process block, FAQs and the existing free-tool handoff. The clinical material is editorial synthesis; it must not be represented as a completed clinician review.

## 4. Roadmap with decision gates

### Phase A — ship the useful foundation, next 7 days after release approval

Finish exact-head integrated browser and editorial checks, release only after approval, and verify the deployed source matches the approved commit. Review the three rewritten clinical/commercial explanations with the appropriate reviewer. Confirm the existing quiz and worksheet still load without analytics after deliberate navigation from an article.

**Exit criteria:** all automated checks pass; canonical URLs and visible/schema content agree; desktop/mobile/print flows work; source-linked statements and visual labels are approved; no implied clinical credential, treatment score or guaranteed outcome; no broken existing-article URLs.

The immediate next clinical-content queue is the existing fertility and bloodwork guides, followed by the broad TRT guide and clinic-comparison article. The fertility article contains strong generalized suppression/recovery claims that need population- and source-specific review. Do not quote an exact azoospermia or recovery rate until its denominator, treatment, duration and study population are explicit. These articles are not rewritten by this PR.

### Phase B — demonstrate utility, next 7–14 days

Run five observed, consented usability sessions with decision-stage adults. Use sample quotes or locally entered redacted information; do not request medical records. Ask participants to complete a task, not rate whether the design looks good.

**Proposed gate, not a measured result:** at least four of five can identify an unknown cost, distinguish the billing interval from the commitment, and leave with a useful appointment question. No participant should believe the quiz selected a drug or diagnosed them. Any such misunderstanding is a release-copy defect to fix, even if clicks increase.

Observe whether users can find the next action without a facilitator. Capture task completion, confusion, time on task, and volunteered feedback. Do not send quiz answers, lab details, quote values, fertility intentions or answer-dependent paths into advertising analytics. Aggregate measurement needs its own privacy review; do not infer permission from the existence of a page-view tracker.

Build the next feature only from observed friction. Likely candidates are a clearer printable brief, a missing-cost checklist, transparent source freshness, or improved comparison entry—not a logged-in health dashboard.

### Phase C — validate a paying workflow, next 30 days

Keep consumer tools free while testing whether a clinic will pay for deployment, maintained approved content and an improved administrative workflow. Interview ten independent operators with existing inquiries, reviewer availability and appointment capacity. Show the actual public experience plus a narrowly customized example.

Ask for two explicit paid-pilot decisions. A compliment or request for a free demo is not willingness to pay. The earlier proposal of $2,000 setup plus $1,000/month remains a **pricing hypothesis requiring a written scope and commercial approval**. It is not an active offer enabled by this PR.

A one-time checklist does not automatically justify a $1,000 retainer. Recurring value must be visible in source/price maintenance, defined clinic updates, tested handoffs and a useful aggregate performance review. Document the actual reviewer, fulfillment, software and support costs. A clinic-specific page alone is not a moat.

**Exit criteria:** two paid agreements for a deliverable scope, completed acceptance checks and an explicit baseline for business utility. Reject uneconomic accounts instead of inventing a 10x ROI story. Separate incremental contribution, actually redeployed staff time, cash savings and speculative lifetime value.

### Phase D — scale only after retention evidence, approximately 30–60 days

Expand only after the initial clinics retain the service, approve the updates and show enough operational benefit to justify price and delivery effort. Develop a reusable clinic configuration and approval queue before a portal. Add another distribution partner only when the first experience can be delivered without bespoke work on every account.

At the proposed $1,000/month, ten active retained clinics are needed for $10,000 MRR. Four clinics paying setup and their first month could generate $12,000 gross cash but only $4,000 MRR. Those are arithmetic scenarios, not a September forecast. There is no verified pipeline supporting a promise of ten near-term closes.

## 5. Prioritized execution backlog

Owners below are execution roles, not claims that a person or service is already engaged. The clinic supplies the clinical approver; routine delivery should not depend on Tyler doing fulfillment.

| ID | Priority / role | Work | Acceptance and dependency |
|---|---|---|---|
| V01 | Implemented / engineering | Three researched existing-URL guides and diagrams | Code in PR #10; retain source register and original URL/date history |
| V02 | Implemented / engineering | Unified article consumption and thinner listing props | Detail, library, related links and sitemap use the catalog; only summaries cross the client listing boundary |
| V03 | P0 / independent QA | Integrated preview browser and accessibility checks | Three articles, library, quiz and worksheet at 360, 390 and 1440 widths; image variants, anchors, keyboard, print, source links and privacy transitions; inspect actual hosted assets |
| V04 | P0 / qualified editorial reviewer | Approve clinical claims, diagrams and labels | Review the claim ledger, exact current labels and trial limits; record reviewer/date only after real approval; no invented medical badge |
| V05 | P0 / release operator | Deploy approved commit and verify production | Check exact commit, canonicals, updated dates, FAQ parity, source links, generated images and quiz handoff; maintain rollback reference |
| V06 | P0 / editor and clinical reviewer | Triage fertility and bloodwork articles next | Replace unsupported generalized percentages/dose suggestions with source-specific education; audit old embedded quiz claims; do not equate link changes with content review |
| V07 | P0 / research | Five observed consumer tasks | Record anonymized observations and the proposed four-of-five usability gate; no PHI upload or diagnosis promise |
| V08 | P1 / engineering and editor | Normalize source and provider facts | One typed record for product, billing interval, payment timing, commitment, inclusions, exclusions, jurisdiction, source, capture date and review status; remove duplicate price literals across pricing page and articles |
| V09 | P1 / research agent | Source-change and expiry queue | Initial price recheck within 14 days; visible stale/unknown status when a fact cannot be reverified; clinical changes wait for appropriate approval; no fabricated fresh dates |
| V10 | P1 / analytics and privacy reviewer | Establish a usable baseline | Confirm GSC property and access, export page/query/indexing evidence; define permitted aggregate events; exclude health answers, quote values and sensitive query strings |
| V11 | P1 / content and engineering | Improve next-step/print experience based on observations | Fix demonstrated confusion; user-initiated export only; no automatic sensitive sharing or new patient-data storage |
| V12 | P1 / sales research | Ten operator conversations and two paid-pilot decisions | Source-backed clinic records, genuine contacts, explicit scope and objections; no claim of pipeline before replies; approved sender and opt-out process before outreach |
| V13 | P1 / delivery agent and clinic reviewer | One reusable clinic-branded configuration | Clinic-approved explanation, current inclusions, tested existing-booking handoff, bounded revisions and signed acceptance; no EHR or clinical messaging automation |
| V14 | P1 / business operator | Measure pilot delivery economics and retention | Actual fees, review/support/tool costs and useful business outcomes; no double-counted savings or month-one use of projected lifetime revenue |
| V15 | P2 / growth and editor | Approved partner distribution kit | Generic checklist, approved article excerpt, diagram usage notes, disclosure and working links; no health-status badges, fake doctors or patient-based referral payments |
| V16 | P2 / engineering | Simplify legacy content storage | Move one article at a time out of the large registry into a validated module; snapshot slug count, metadata and links before each migration; remove overwritten legacy copies once migration is safe |
| V17 | P2 / product | Consider a paid consumer dossier only after direct demand | Five explicit paid requests and tested fulfillment/refund/privacy terms; organize quotes and questions, not a clinical second opinion |

The existing [BACKLOG.md](BACKLOG.md) remains the historical cross-workstream record. This table is the current priority order for the researched-content and value-validation workstream, not authorization to activate its commercial steps.

## 6. Content, SEO, AEO and GEO operating system

Create original decision utility, not more articles for their own sake. Google's current guidance emphasizes useful original content and standard search foundations for generative features; no special file or schema guarantees inclusion. See the [official guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

The implementation now gives the selected guides one content source for the body, title, FAQ and dates, with direct primary-source citations and readable visuals. The next technical cleanup is shared typed provider facts so `/pricing` and the article cannot silently diverge. Dates should reflect actual substantive updates, not builds. Public evidence references must remain separate from private health data.

Use the existing URLs. Audit overlap before adding any new page. Do not mass-delete the library or point unrelated old URLs at the homepage. Prioritize a legacy article when it combines important decision intent, material inaccuracies and a realistic source-backed improvement. Search performance can reorder the backlog once actual data is available.

Maintain a small fixed set of external answer-engine questions about mechanisms, product monitoring and billing. Save date, engine/version, returned answer, citations and errors. Treat this as observation, not a deterministic rank or proof of sales. Measure whether the answer is correct before optimizing its frequency.

Do not use article count, an invented authority score or a model mention as the business north star. Track useful brief completion and qualified business inquiries where lawful and measurable. A voluntary follow-up about whether the guide helped is better evidence of usefulness than a longer time-on-page that may simply mean confusion.

## 7. Agent-native fulfillment without unsupported clinical automation

Use agents for public-source retrieval, candidate claim extraction, old/new comparisons, formatting, code changes, source-link checks and reproducible visual generation. An independent critique pass can flag ambiguity; it cannot confer medical review credentials. Keep arithmetic, allowed URLs and required fields deterministic.

The reusable Sprinter-style modules should be small: source records, approved content blocks, artifact generation, release evidence, and a bounded review queue. Do not migrate this public content site into a large multi-tenant platform until repeated paid work proves the need. No new live model calls, patient records, labs, diagnosis, doses or automated care instructions are introduced here.

Distribution should share the generic utility and approved explanations. No scraping identifiable health disclosures, fake testimonials, synthetic clinicians, or unsolicited patient-specific messages. Business outreach, paid campaigns and any partner compensation require their own approved process; this PR sends nothing and spends nothing.

## 8. Verification and release boundaries

Code commit `281dd8cdf38ec2290ff1ec43b32f0f86cb5291e6` built as Vercel preview `dpl_J4rbDnGAtQhNJQRhE51Yk6Hijyfp`. Inspected logs show **78/78 tests passing**, successful Next.js compilation, **full TypeScript validation running**, and **179/179 generated pages**. This is materially stronger than the earlier PR #8 build that skipped types.

Locally, the 30 new tests pass and the standalone content module passes strict TypeScript. Nine isolated article-body browser fixtures (three articles at 360/390/1440 widths) passed overflow, image selection, source-anchor, page-error and print-CTA checks. These fixtures do not prove the full deployed application, shared shell, cross-root navigation or analytics isolation works on this new head. Full integrated browser QA and qualified editorial review remain release gates. The existing upstream test suite covers structural privacy protections but is not a substitute for network inspection.

The six SVG outputs are generated from the versioned script and typed facts before dev/test/build; they are not manually edited binary assets. Existing brand illustrations are unchanged. Tests run inside the Vercel build without enabling additional GitHub Actions or changing billing settings.

## Request captured for this workstream

> Review the latest, build the roadmap to make this valuable. Do deep research on a few of the highest impact articles, then open a PR, including content, diagrams and rich visual content where relevant.

**Operating decision:** improve the complete reader task, observe whether it helps, and demand paid evidence before broadening the platform. More publishing is not a substitute for those three steps.
