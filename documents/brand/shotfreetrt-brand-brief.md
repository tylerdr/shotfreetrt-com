# ShotFreeTRT brand brief and coverage manifest

**Version:** 1.0 · 17 September 2026  
**Purpose:** the source of truth for the next content, UX, and ChatGPT WEB image batch.  
**Site:** [shotfreetrt.com](https://shotfreetrt.com/)

## Brand decision

ShotFreeTRT is the **calm decision desk for men investigating low testosterone and TRT**. It helps a reader move from a symptom, lab result, or treatment question to a safer next question. The brand earns attention by making tradeoffs visible: diagnose before treating, protect fertility when it matters, measure the response, and keep escalation proportional to evidence.

The promise is **clearer decisions before commitment**. It is not a promise to raise testosterone, reverse aging, or replace clinical care. “Shot-free” describes the site’s first-choice lens and the reader’s desire to understand non-injectable and endogenous options; it does not imply that every reader should avoid prescribed injections.

### Audience and reader jobs

- Men roughly 35–55 who are searching around symptoms, bloodwork, fertility, performance, or a treatment decision.
- A skeptical, time-poor reader who has seen clinic marketing, supplement hype, and extreme physique imagery.
- The immediate job is to identify the next useful evaluation step, not to collect another protocol.
- The emotional need is agency: enough structure to act, enough uncertainty to stay honest.

### Personality

Measured, direct, adult, practical, evidence-literate, and quietly confident. Write like a careful editor who can explain a lab result without talking down to the reader.

Use short declarative sentences, concrete tradeoffs, and explicit decision points:

> “That result is a reason to repeat the test and widen the panel, not a diagnosis by itself.”

> “If fertility is a near-term goal, make that constraint part of the first clinician conversation.”

Label the evidence boundary in the sentence where it matters: **established**, **associated**, **plausible**, **uncertain**, or **not studied well enough**. End a section with a small next step or a question to take to a clinician.

Avoid miracle language, “hack,” “biohack,” “guaranteed,” “fix your hormones,” “natural cure,” “men’s health warrior,” clinic shaming, fabricated patient stories, invented doctors, and before/after body promises. Never turn a secondary editorial source into medical evidence.

## Visual identity

The current live shell establishes a near-black interface, blue action color, compact Barlow Condensed headlines, and Inter body copy. Keep that recognizable foundation while giving it a more distinctive editorial-scientific signature. The source of the current shell is [globals.css](/Users/td/code/github/tylerdr/shotfreetrt-com/src/app/globals.css), [layout.tsx](/Users/td/code/github/tylerdr/shotfreetrt-com/src/app/layout.tsx), and [BlogContent.tsx](/Users/td/code/github/tylerdr/shotfreetrt-com/src/components/BlogContent.tsx).

### The visual idea: “field notes, rendered precisely”

Every visual should feel like a well-made page from a clinical field notebook: one meaningful object or relationship, clear negative space, controlled geometry, and enough imperfection to feel authored. The design should support scanning and comprehension before decoration.

Use a single subject, a clear focal plane, and one diagrammatic relationship per asset. Prefer a cutaway, cross-section, specimen, instrument, or measured path over a smiling model. Human figures appear only when the human decision or behavior is the subject; use cropped, non-identifiable silhouettes or hands rather than generic photorealistic men.

### Color system

| Token | Hex | Use |
|---|---:|---|
| Ink | `#090B10` | page background and negative space |
| Carbon | `#111722` | card and panel surface |
| Graphite | `#1B2431` | secondary surface, table bands, quiet structure |
| Cobalt | `#2E5FA7` | primary action, route lines, selected states |
| Signal blue | `#65A4FF` | links, active data points, small highlights |
| Brass | `#C7A86B` | scarce editorial accent, key marker, paid guide detail |
| Bone | `#E9E5DA` | high-emphasis type and diagram fills |
| Mist | `#A8B1BE` | body copy, metadata, secondary labels |
| Rust | `#A96855` | warnings or risk states only; never a decorative accent |

Blue carries action and measurement. Brass carries editorial value and a small amount of warmth. Rust means “pause and review.” Keep surfaces matte. If a gradient is used, it should be a barely visible tonal shift within the same family; do not use the current generic radial or neon cyan glow as the art direction.

### Type and layout

- **Display:** existing Barlow Condensed, 700–800, sentence case. Reserve it for page titles, section titles, and short labels; never use it for paragraphs or dense tables.
- **Body and UI:** existing Inter, 400–600. Use 1.55–1.8 line height for article text and tabular numerals for lab values, prices, and time ranges.
- **Data labels:** Inter semibold with generous tracking; optional mono treatment only for units, ranges, and assay names, never for whole paragraphs.
- **Shapes:** 10–14px card radii, 1px low-opacity outlines, soft layered shadows only where they establish depth. Keep nested radii concentric.
- **Composition:** one dominant editorial anchor, a readable text column around 65–75 characters, and a deliberate quiet margin. Let images sit beside or above an idea; do not fill every empty area.

### Illustration and diagram rules

1. Use a restrained two-to-four color palette from the tokens above, with bone or signal blue for the focal structure and carbon/graphite secondary fills.
2. Combine clean vector-like contour lines with lightly textured, hand-inked edges. The texture should resemble graphite or screen print at low opacity, never AI grain, chrome, glass, or plastic.
3. Show anatomy as simplified educational cutaways with correct relative relationships. Ask for no labels or generated text; add labels in HTML/SVG so they remain legible, translatable, and accessible.
4. Use transparent PNG/WebP cutouts for cards and inline figures when the subject can stand alone. Use a solid ink background only for an OG/social composition that needs a controlled crop.
5. Keep one asset to one idea. A blood cell, sleep waveform, or lab tube may be paired with a single directional cue; do not make a crowded infographic inside an image model.
6. Use the same light source, line weight, shadow softness, crop behavior, and accent ratio across batches. Reuse a subject only when it is the same concept in a new state, such as baseline → follow-up.
7. Do not generate logos, medication packaging, clinic marks, readable labels, fake citations, signatures, badges, or UI screenshots. Do not depict an identifiable doctor, a fabricated patient, an injection as a hero symbol, or a miraculous body transformation.

### Photography policy

Photography is optional and subordinate to the illustration system. If used, choose documentary still life: a real notebook, lab requisition, home blood-pressure cuff, running shoes, or a morning window. No airbrushed torsos, hyper-muscular bodies, white-coat authority shots, syringe glamour, or stock “wellness” smiles. Every photo needs a clear reader job and a rights receipt before publication.

### Asset accessibility and performance

- Generate one downloadable image per prompt, never a contact sheet.
- Prefer transparent PNG for line art and object cutouts; create an optimized AVIF/WebP derivative after review. Keep an original master outside the web bundle.
- Use 1x and 2x exports only when the display size needs it. Do not ship a 4,000px image into a 320px card.
- Keep text out of generated images. Add semantic headings, captions, and labels in the page source.
- Mark purely decorative cutouts `alt=""`; give educational diagrams concise alt text that states the relationship, not every visual detail. Use a visible caption for clinical nuance.
- Add a subtle 1px outline around images so transparent edges remain readable on `#090B10` and `#111722`.

## Content and monetization architecture

The site has a strong inventory signal: the live homepage and blog report **159 articles**. The source registry also resolves 159 unique slugs across the primary array, the longevity import, and standalone article modules. The live blog has a 66-article TRT cluster, with smaller diagnostic, lifestyle, biomarker, recovery, nutrition, supplement, science, fitness, and access clusters. The useful opportunity is to make the decision paths legible and deepen a few high-intent hubs, not to add a thin article to every keyword.

### Coverage manifest

| Lane | Reader question | Existing anchors to strengthen | Asset family | Monetization handoff |
|---|---|---|---|---|
| Diagnose | “Are these symptoms actually low T?” | `/blog/low-testosterone-symptoms`, `/blog/low-testosterone-causes`, `/blog/testosterone-and-anemia`, `/blog/testosterone-and-thyroid` | symptom map, lab-sheet cutaway, root-cause path | free quiz; email only after a useful result |
| Baseline labs | “What should I test and how do I read it?” | `/blog/trt-bloodwork-panel`, `/blog/free-testosterone-vs-total-testosterone`, `/blog/high-shbg-low-free-testosterone`, `/blog/trt-and-blood-donation` | bloodwork panel, SHBG/free-T relationship, hematocrit diagram | quiz result; $19 Blueprint when the reader wants a 30-day plan |
| Choose a path | “What changes if fertility, delivery method, or speed matters?” | `/blog/enclomiphene-vs-trt`, `/blog/trt-alternatives`, `/blog/trt-and-fertility`, `/blog/oral-testosterone`, `/blog/testosterone-gel-vs-injections` | four-route comparison, fertility-aware pathway, neutral delivery objects | clinician question list; reviewed provider comparison with disclosed sponsorship |
| Monitor safely | “How do I know whether a protocol is helping or creating risk?” | `/blog/trt-side-effects`, `/blog/trt-protocol-optimization`, `/blog/trt-and-sleep-apnea`, `/blog/trt-and-cardiovascular-health`, `/blog/trt-and-blood-donation` | hematocrit/erythrocytosis, sleep/oxygen, feedback loop | repeat-visit content; no automatic treatment recommendation |
| Foundations | “What can I do this month while I investigate?” | `/blog/testosterone-and-energy`, `/blog/testosterone-and-weight-loss`, `/blog/testosterone-and-cortisol`, `/blog/testosterone-and-caffeine`, `/blog/strength-training-after-40-longevity` | sleep rhythm, training/lab loop, meal and walking objects | $19 Blueprint; newsletter with measurable weekly action |
| Healthspan context | “How does this fit broader health?” | `/blog/testosterone-and-longevity-in-men`, `/blog/blood-tests-for-longevity`, `/blog/sleep-optimization-longevity` | healthspan dashboard, biomarker trend, strength + aerobic capacity | contextual handoff to AliveLongevity only when it answers the next question |
| Access and cost | “What will this path cost and how do I compare it?” | `/blog/best-online-trt-clinic`, `/blog/trt-cost-2026`, `/blog/trt-insurance-coverage`, `/blog/best-trt-clinics-by-state` | pricing worksheet, provider due-diligence checklist | affiliate links only after exact URL, current price, disclosure, and tracking proof |

### Cross-site linking policy

ShotFreeTRT owns the low-T/TRT decision narrative. Link to [PeakedLabs](https://peakedlabs.com/) only when the reader is actively evaluating provider selection, delivery method, cost, or treatment monitoring. Link to [AliveLongevity](https://alivelongevity.com/) only when the reader has reached a broader healthspan, biomarker, sleep, training, or minimum-effective-protocol question. A destination must answer a question introduced in the paragraph immediately before the link.

Use one contextual cross-site link in a short article and at most two in a long guide as an editorial starting point, not as an SEO quota. Add a link only when it earns its place in the reader’s next question. Use descriptive anchors such as “PeakedLabs’ provider-monitoring comparison” or “AliveLongevity’s core blood-test panel.” Do not add footer, sidebar, “recommended network,” or reciprocal link blocks. Do not link to a secondary article as proof of a medical claim; cite AUA, Endocrine Society, FDA, CDC, NIH/PubMed, or the relevant primary study for that claim. Verify the destination URL, title, and freshness during each content review.

### Revenue guardrails

The value ladder is: free decision content → useful quiz result → optional email brief → $19 Blueprint → carefully reviewed, clearly disclosed partner comparison. Measure visits, quiz starts, qualified results, checkout starts, completed purchases, downloads, affiliate clicks, approved applications, and cleared net revenue as separate events. Never turn target arithmetic into revenue proof.

The live homepage currently says **“Free guide”** while its adjacent promotion and source commerce work frame the Blueprint as a paid $19 product. Reconcile that copy, the button label, and the fulfillment path before adding a Blueprint hero asset. Keep all affiliate/provider claims, pricing, logos, and outbound URLs behind an exact current-source review. No asset should imply a clinical outcome or provider endorsement.

## Evidence and implementation handoff

The visual findings above are based on the live [homepage](https://shotfreetrt.com/), [blog](https://shotfreetrt.com/blog), [resources](https://shotfreetrt.com/resources), [pricing](https://shotfreetrt.com/pricing), and the local source. The current OG asset is a 1024×1024 dark gradient wordmark ([og-shotfreetrt.png](/Users/td/code/github/tylerdr/shotfreetrt-com/public/og-shotfreetrt.png)); metadata advertises it as 1200×630, and the JSON-LD references `/logo.png`, which currently returns 404. The current favicon is a bright cyan square monogram ([favicon.png](/Users/td/code/github/tylerdr/shotfreetrt-com/public/favicon.png)) that does not share the page palette. Treat the first asset batch as a controlled replacement proposal, not an automatic production write.

Medical claim review should start with the [AUA Testosterone Deficiency Guideline](https://www.auanet.org/Documents/Guidelines/PDF/Testosterone%20Website%20Final%280%29.pdf), [Endocrine Society testosterone therapy guidance](https://www.endocrine.org/clinical-practice-guidelines/testosterone-therapy), current FDA testosterone labeling and safety communications, and the NIH/PubMed review of [testosterone-associated erythrocytosis](https://pmc.ncbi.nlm.nih.gov/articles/PMC5690890/). The older [FDA caution page](https://www.fda.gov/drugs/postmarket-drug-safety-information-patients-and-providers/fda-drug-safety-communication-fda-cautions-use-testosterone-products-low-testosterone-due-aging) is a historical locator only; re-check the current 2025–2026 FDA label and cardiovascular/BP wording before publishing any safety copy. Current PeakedLabs and AliveLongevity pages are useful related reading and portfolio context; they remain secondary sources.

Before publication, review each asset against this brief, add the actual alt/caption/route in the source, compress the approved file, and confirm the page still has a single clear next step. Keep the existing dirty commerce/search checkout changes isolated and preserve one writer per source file.
