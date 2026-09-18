# Research and claim-correction ledger

**Source-check date:** September 17, 2026. **Implementation:** PR #10. **Scope:** three existing articles, not a medical review of the full site or a clinical assessment of any reader.

Read with [ROADMAP-VALUE-2026-09-17.md](ROADMAP-VALUE-2026-09-17.md). The executable source IDs below are in `src/data/evidence-guides.ts`. References appear beside material claims and in each article's source list. Clinical-trial findings were checked against the PubMed abstract records; this is not represented as a systematic review or a full-text risk-of-bias assessment.

## A. Enclomiphene versus replacement testosterone

**Existing URL:** `/blog/enclomiphene-vs-trt`.

The key editorial correction is to stop collapsing mechanism, laboratory response, symptoms and fertility into one “best treatment” judgment. The revised guide separates evidence by the outcome measured and gives readers questions for clinical review. It contains no dose table or eligibility recommendation.

| Source ID | Primary source | Claim supported and boundary |
|---|---|---|
| `kim` | [Kim et al., BJU International, 2016](https://pubmed.ncbi.nlm.nih.gov/26496621/) | Two 16-week randomized studies in overweight men aged 18–60 with secondary hypogonadism measured hormones and sperm concentration. Do not turn those endpoints into a pregnancy/live-birth guarantee, a long-term safety conclusion or a result for every cause of low testosterone. |
| `wiehle` | [Wiehle et al., Fertility and Sterility, 2014](https://pubmed.ncbi.nlm.nih.gov/25044085/) | Earlier phase II research supports discussing the differing hormonal and semen findings. It does not select a medicine for an individual reader. |
| `endocrine` | [Endocrine Society testosterone guideline resource, 2018](https://www.endocrine.org/clinical-practice-guidelines/testosterone-therapy) | Diagnosis and cause matter; the guideline recommends against testosterone therapy when planning fertility in the near term. A preference to avoid injections does not resolve that clinical question. |
| `ema` | [EMA EnCyzix assessment, 2018](https://www.ema.europa.eu/en/medicines/human/EPAR/encyzix) | The European refusal cited insufficient symptom-benefit evidence and a blood-clot concern. It is a dated EU application decision, not a current US ban or an FDA ruling. |
| `compound` | [FDA: risks of compounded drugs](https://www.fda.gov/drugs/human-drug-compounding/understanding-risks-compounded-drugs) | A compounded finished drug is not FDA-approved. Having a prescription and having FDA approval are different facts. The article does not claim a full current inventory of all US-approved products. |

**Visual:** `mechanism-and-outcomes.svg` and its mobile variant. The illustration is qualitative: stimulate hormonal signaling versus supply replacement hormone; blood testosterone, sperm concentration and pregnancy are distinct endpoints. It is not an anatomical illustration, treatment selector or quantitative effect-size chart. The adjacent HTML repeats the substantive explanation.

**Editorial question still requiring review:** does the public explanation preserve the appropriate population and endpoint limitations without suggesting a preferred treatment? No medical-review credential is added by code or by a second model's agreement.

## B. Oral testosterone

**Existing URL:** `/blog/oral-testosterone`.

The older public article used overly broad food instructions and warning/safety comparisons. The rewrite names the exact product, consults its current label and avoids ranking drugs using percentages from unrelated trials. It removes the need for a reader-facing dosing/titration recipe.

| Source ID | Primary source | Correction and boundary |
|---|---|---|
| `jatenzo` | [Jatenzo prescribing information, DailyMed](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ed7b5d41-7475-4c10-99b9-b62b3434ae60) | Use product-specific food and monitoring instructions. The label's testosterone monitoring sample is 6 hours after the morning dose, at least 7 days after starting or changing dose. The diagram is not a medication-effect or dose-adjustment chart. |
| `kyzatrex` | [Kyzatrex prescribing information, DailyMed](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7f7167a7-2a25-47e2-acf5-33f499fce971) | Monitoring is 3–5 hours after the morning dose, at least 7 days after starting or changing dose. Do not import another oral product's instructions or imply every patient uses one universal schedule. |
| `tlando` | [Tlando prescribing information, DailyMed](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4b0b92e9-6d3c-a0e5-e1c7-342999f72580) | Monitoring is 8–9 hours after the morning dose, initially 3–4 weeks after starting. Lymphatic absorption and avoidance of first-pass liver metabolism do not establish an absolute absence of liver problems or other adverse effects. |
| `fda2025` | [FDA class-wide labeling update, February 28, 2025](https://www.fda.gov/drugs/drug-alerts-and-statements/fda-issues-class-wide-labeling-changes-testosterone-products) | Removal of boxed-warning language about adverse cardiovascular outcomes did not remove the need to discuss blood-pressure risk; FDA required added or strengthened blood-pressure information. Do not frame an older brand-specific warning comparison as the current safety hierarchy. |

**Food-rule correction:** the labels direct use with food, but a universal “15–20 grams of fat” instruction across every oral product is not justified. The guide tells readers to confirm the exact product's instructions, not to improvise a meal or dose adjustment.

**Visual:** `oral-monitoring-windows.svg` and its mobile variant. Desktop uses a 0–9-hour scale; mobile uses readable product cards. Timing comes from the same typed facts that produce the HTML explanation. Each explicitly identifies the morning-dose reference and warns against interpreting it as time to benefit. Initial-check timing remains visible in the HTML rather than being hidden behind the graphic.

## C. Total cost and billing periods

**Existing URL:** `/blog/trt-cost-2026`.

The useful commercial comparison separates enrollment, recurring charges, medicine, testing/visits, extras and commitment. A membership-only price, a medication-only listing and a longer prepaid arrangement are different products. A missing cost is not zero; the examples are not clinical rankings.

| Source ID | Primary source | Snapshot and limitations |
|---|---|---|
| `fountain` | [Fountain TRT program](https://fountain.net/trt) | $199 every 4 weeks, $499 every 12 weeks, $1,799 every 48 weeks. Confirm current exact prescription, inclusions, payment timing and cancellation terms. Do not relabel a 48-week service period as a calendar year. |
| `hone` | [Hone membership overview](https://help.honehealth.com/hc/en-us/articles/40161781101335-Hone-Health-Membership-Overview-Compare-Basic-Plus-Premium-Plans) | Plus is $135/month with medication extra; starting from $180 includes the $45 initial test and first $135 month. Do not count that first month twice. Confirm test type, additional tests, medication and ongoing inclusions. |
| `maximus` | [Maximus enclomiphene-only listing](https://shop.maximustribe.com/testosterone/enclomiphene-only) | $199.99/month for the one-month plan, $149.99/month for three months, $99.99/month for twelve months. These commitments are not interchangeable. This is not a replacement-testosterone quote. Confirm current payment and cancellation terms. |

**Worked arithmetic, not sourced market averages:** a hypothetical $199 calendar-month charge is $2,388 over 12 months. A repeating 28-day service charge annualizes to $2,594.11 over 365 days. With advance billing on day 0 and every 28 days through day 364, cash payments total $2,786 across 14 charges; the last charge buys service extending beyond the window. This assumes no cancellation, proration, taxes or price change. It does not predict a named provider's bill.

Hone illustration: $45 plus twelve $135 membership months equals $1,665 before medication or other testing. Do not add the full $180 starting amount to twelve more membership months.

**Visual:** `billing-periods.svg` and its mobile variant. Numbers derive from integer-cent arithmetic in the content module; the output distinguishes annualized service budget from actual advance-payment dates. The existing quote calculator remains an annualized budget tool, not a dated cash-flow engine.

## D. Rich-content and engineering controls

All six visual variants are generated by `scripts/generate-evidence-visuals.mjs` from versioned facts. The script runs before dev, tests and production builds; SVG output is intentionally generated rather than checked in. There are no external image dependencies, artificial clinician identities, fake case results or runtime AI calls. Existing batch3 decorative illustrations remain unchanged.

HTML headings, lists, tables, captions and FAQs carry the meaning independently of the images. Mobile variants avoid shrinking desktop text beyond useful reading size. Tests check source anchors, matching bibliography entries, FAQ parity, allowed source URLs, arithmetic, responsive image files and the absence of dosing recipes. Automated tests verify structure and known fixtures, not clinical truth by themselves.

The shared `article-catalog.ts` adapter makes the refreshed bodies, metadata, library, related links and sitemap agree while preserving all original slugs and first-publication dates. The legacy registry still contains the overwritten old bodies; it is not a second public article version through the updated consumers. A later controlled migration should remove those obsolete copies and audit any newly added direct imports. Existing source-level tests prevent the currently changed public consumers from bypassing the adapter.

## E. Review and freshness process

A source-check date is not a clinical-approval date. Each material future change should record the old claim, new claim, exact source/version, affected page/visual, reviewer where required and regeneration/test evidence. Provider prices should enter a short refresh queue; inaccessible or stale data should remain visibly unknown rather than being silently renewed.

No traffic volumes or ranking changes were established in this pass. These articles were selected for decision relevance and identifiable corrections, not because they were proven to be the site's three largest search opportunities.

For publication strategy, use [Google's official generative-AI search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): useful original information and normal search foundations, not schema or special-file promises. Rich content should make the decision understandable before it is considered a distribution asset.

**Not completed by this ledger:** qualified clinical approval, full systematic literature review, full hosted browser regression, production promotion, all-article medical triage, signed commercial agreements, outreach or revenue validation.
