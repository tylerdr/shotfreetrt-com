/** Source-checked editorial content, not individual medical advice.
 * All HTML below is authored in this repository, never user-supplied.
 */
export const EVIDENCE_CHECKED_AT = "2026-09-17";

export const evidenceSources = {
  kim: { label: "Kim et al., BJU International (2016): two 16-week randomized trials", url: "https://pubmed.ncbi.nlm.nih.gov/26496621/", kind: "Clinical trial" },
  wiehle: { label: "Wiehle et al., Fertility and Sterility (2014): phase II trial", url: "https://pubmed.ncbi.nlm.nih.gov/25044085/", kind: "Clinical trial" },
  endocrine: { label: "Endocrine Society: testosterone therapy guideline (2018)", url: "https://www.endocrine.org/clinical-practice-guidelines/testosterone-therapy", kind: "Clinical guideline" },
  ema: { label: "EMA: EnCyzix refusal, European Union (2018)", url: "https://www.ema.europa.eu/en/medicines/human/EPAR/encyzix", kind: "Regulatory assessment" },
  compound: { label: "FDA: understanding the risks of compounded drugs", url: "https://www.fda.gov/drugs/human-drug-compounding/understanding-risks-compounded-drugs", kind: "Regulatory guidance" },
  jatenzo: { label: "Jatenzo: current prescribing information, sections 2, 5 and 12", url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ed7b5d41-7475-4c10-99b9-b62b3434ae60", kind: "Product label" },
  kyzatrex: { label: "Kyzatrex: current prescribing information, sections 2, 5 and 12", url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7f7167a7-2a25-47e2-acf5-33f499fce971", kind: "Product label" },
  tlando: { label: "Tlando: current prescribing information, sections 2, 5 and 12", url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4b0b92e9-6d3c-a0e5-e1c7-342999f72580", kind: "Product label" },
  fda2025: { label: "FDA: class-wide testosterone labeling changes, February 28, 2025", url: "https://www.fda.gov/drugs/drug-alerts-and-statements/fda-issues-class-wide-labeling-changes-testosterone-products", kind: "Regulatory update" },
  fountain: { label: "Fountain: published TRT program pricing", url: "https://fountain.net/trt", kind: "Provider price page" },
  hone: { label: "Hone: Basic, Plus and Premium membership overview", url: "https://help.honehealth.com/hc/en-us/articles/40161781101335-Hone-Health-Membership-Overview-Compare-Basic-Plus-Premium-Plans", kind: "Provider price page" },
  maximus: { label: "Maximus: enclomiphene-only product listing", url: "https://shop.maximustribe.com/testosterone/enclomiphene-only", kind: "Provider price page" },
} as const;
export type EvidenceSourceId = keyof typeof evidenceSources;
export type GuideSection = { id: string; title: string; html: string };
export type GuideFaq = { q: string; a: string; sources: EvidenceSourceId[] };
export type EvidenceGuide = {
  slug: string; title: string; description: string; publishedAt: string;
  readTime: string; keywords: string[]; summary: string;
  sourceIds: EvidenceSourceId[]; sections: GuideSection[]; faqItems: GuideFaq[];
  diagram: string; diagramAlt: string;
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}
export function cite(...ids: EvidenceSourceId[]): string {
  return ids.map((id) => `<a class="eg-citation" href="#evidence-source-${id}" aria-label="Source: ${escapeHtml(evidenceSources[id].label)}">[${Object.keys(evidenceSources).indexOf(id) + 1}]</a>`).join(" ");
}
function table(caption: string, headings: string[], rows: string[][]): string {
  return `<div class="eg-table-scroll" role="region" aria-label="${escapeHtml(caption)}" tabindex="0"><table><caption>${escapeHtml(caption)}</caption><thead><tr>${headings.map((h) => `<th scope="col">${escapeHtml(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell, i) => i === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function note(title: string, text: string): string {
  return `<aside class="eg-note"><strong>${title}</strong><p>${text}</p></aside>`;
}

export const oralMonitoringWindows = [
  { product: "Kyzatrex", hours: "3–5 hours", start: 3, end: 5, firstCheck: "At least 7 days after starting or a dose change", source: "kyzatrex" as const },
  { product: "Jatenzo", hours: "6 hours", start: 6, end: 6, firstCheck: "At least 7 days after starting or a dose change", source: "jatenzo" as const },
  { product: "Tlando", hours: "8–9 hours", start: 8, end: 9, firstCheck: "3–4 weeks after starting; periodically thereafter", source: "tlando" as const },
];

/** Annualized service budget differs from advance-billed cash charges. */
export function billingIllustration(amountCents = 19900) {
  if (!Number.isSafeInteger(amountCents) || amountCents < 0 || amountCents > 10_000_000) throw new RangeError("Invalid illustrative amount");
  return {
    monthlyAnnualCents: amountCents * 12,
    fourWeekAnnualizedCents: Math.round(amountCents * 365 / 28),
    first365DaysAdvanceBilledCents: amountCents * 14,
    advanceChargeDays: Array.from({ length: 14 }, (_, i) => i * 28),
  };
}

export const evidenceGuides: EvidenceGuide[] = [
  {
    slug: "enclomiphene-vs-trt",
    title: "Enclomiphene vs TRT: What the Evidence Does—and Does Not—Show",
    description: "Compare mechanisms, fertility evidence, approval questions and monitoring—not just testosterone numbers. A source-linked guide to a better clinician conversation.",
    publishedAt: "2026-03-12", readTime: "7 min read",
    keywords: ["enclomiphene vs TRT", "enclomiphene fertility evidence", "testosterone replacement alternatives"],
    summary: "Enclomiphene and replacement testosterone are different approaches. A higher blood testosterone result is not the same outcome as symptom relief, sperm production or a pregnancy. Compare the evidence for the outcome you actually care about.",
    sourceIds: ["kim", "wiehle", "endocrine", "ema", "compound"],
    diagram: "/media/research/mechanism-and-outcomes.svg",
    diagramAlt: "Enclomiphene changes hormonal signaling; replacement testosterone supplies hormone. Blood testosterone, sperm concentration, and pregnancy are separate outcomes.",
    sections: [
      { id: "two-mechanisms", title: "Two mechanisms, not two versions of the same treatment", html: `
        <p>Enclomiphene is a selective estrogen receptor modulator, not testosterone in a capsule. In studied men with secondary hypogonadism, it increased the pituitary signals LH and FSH alongside testosterone. Replacement testosterone supplies the hormone; those signals decreased in the comparator gel groups. This is a qualitative explanation, not a map for choosing your own treatment. ${cite("kim", "wiehle")}</p>
        <div class="eg-flow-grid" aria-label="Mechanism comparison">
          <div class="eg-flow"><h3>Stimulate a signal</h3><ol><li>Enclomiphene</li><li>LH / FSH signaling increases in studied men</li><li>The testes produce testosterone</li></ol></div>
          <div class="eg-flow"><h3>Supply a hormone</h3><ol><li>Replacement testosterone</li><li>Testosterone is supplied from outside the body</li><li>LH / FSH signaling can decrease</li></ol></div>
        </div>
        <p>The cause of low testosterone matters. The Endocrine Society distinguishes testicular (primary) from hypothalamic/pituitary (secondary) causes, using clinical assessment and LH/FSH among the relevant information. A route preference alone cannot make that distinction. ${cite("endocrine")}</p>` },
      { id: "evidence", title: "What the head-to-head research actually measured", html: `
        ${table("Evidence and its boundaries", ["Evidence", "What it supports", "What it does not establish"], [
          ["Two randomized phase III trials", `Overweight men aged 18–60 with secondary hypogonadism were studied for 16 weeks. Enclomiphene maintained sperm concentration while gel reduced it. ${cite("kim")}`, "Pregnancy or live-birth success, years of safety, or the same result in every cause of low testosterone."],
          ["Earlier phase II study", `Hormone and semen findings supported further investigation. ${cite("wiehle")}`, "A universal best option for libido, energy, mood or an individual patient."],
          ["EMA assessment, 2018 (EU)", `The regulator cited missing symptom-benefit evidence and a blood-clot concern when refusing EnCyzix authorization. ${cite("ema")}`, "A current US prescribing or compounding ruling. This was a specific European application and decision."],
        ])}
        <p>Read the endpoint before the headline. “Raises testosterone” answers a laboratory question. “Maintains sperm concentration” answers a different question. Neither statement, by itself, proves how a person will feel or whether a couple will conceive. Your goal should determine which unanswered questions matter most.</p>
        ${note("An evidence gap is not a verdict", "Limited evidence for an outcome is not proof that the outcome cannot improve. It is a reason to avoid a guarantee and ask what evidence supports the proposed plan.")}` },
      { id: "fertility", title: "Make family plans part of the conversation—not a marketing checkbox", html: `
        <p>The Endocrine Society recommends against testosterone therapy for men planning fertility in the near term. Avoiding a needle does not settle this issue: ask specifically whether the medicine is replacement testosterone and what the plan means for fertility. ${cite("endocrine")}</p>
        <p>A practical question is: “What outcome are we trying to preserve, how would we assess it, and should a reproductive specialist be involved?” Do not treat a blood testosterone result as a fertility test or assume a clinic’s “fertility-friendly” label answers that question.</p>
        <p>Already taking medication? Bring the prescription details and your plans for children to the prescriber. This article is not a reason to stop, switch, combine medicines, or add a fertility drug yourself.</p>` },
      { id: "product-status", title: "Separate the ingredient, the prescription and the product’s approval", html: `
        <p>A compounded enclomiphene product is not an FDA-approved finished drug. FDA does not review compounded drugs for safety, effectiveness or quality before marketing. “Prescribed by a clinician” and “FDA-approved product” are different statements. ${cite("compound")}</p>
        <p>Ask for the exact product name, ingredient, formulation, dispensing pharmacy and approval status. Do not assume that a study of one preparation establishes the quality of every compounded preparation. Do not assume “compounded” automatically means inappropriate either; the question is why that particular product is being proposed, what alternatives exist and what its limitations are.</p>
        <p>The EMA’s refusal concerns a 2018 European application. It belongs in the evidence history, but should not be mislabeled as a US ban or a current FDA decision. ${cite("ema")}</p>` },
      { id: "visit-questions", title: "Bring a decision brief, not a preselected winner", html: `
        <ul><li>What diagnosis and cause are we evaluating?</li><li>What improvement matters to me, beyond a lab number?</li><li>How do plans for children change the discussion?</li><li>What is the exact medicine and its regulatory status?</li><li>What risks, monitoring, stopping rules and follow-up will we agree on?</li><li>What is included in the quote, and what is billed separately?</li></ul>
        <p>Write down the answers, including “not yet known.” An honest unresolved question is more useful than a confident but unsupported treatment ranking. The <a href="/quiz/healthspan">free decision quiz</a> organizes appointment questions; it does not decide which medicine you should take.</p>` },
    ],
    faqItems: [
      { q: "Is enclomiphene a type of TRT?", a: "It is not replacement testosterone. It is a different medicine that affects hormonal signaling; those mechanisms should not be treated as interchangeable.", sources: ["wiehle"] },
      { q: "Does preserving sperm concentration guarantee fertility?", a: "No. A semen endpoint and a pregnancy or live birth are different outcomes. The cited comparative trials do not establish a pregnancy guarantee.", sources: ["kim"] },
      { q: "Does this guide recommend enclomiphene over TRT?", a: "No. It separates the evidence and questions to discuss with a clinician. It provides no eligibility score, dose or individual treatment recommendation.", sources: [] },
    ],
  },
  {
    slug: "oral-testosterone",
    title: "Oral Testosterone: Food, Blood Tests and Safety Questions by Product",
    description: "Jatenzo, Kyzatrex and Tlando are not one interchangeable pill. Compare current label instructions, blood-test timing, blood-pressure warnings and the questions to ask.",
    publishedAt: "2026-03-21", readTime: "7 min read",
    keywords: ["oral testosterone", "Jatenzo Kyzatrex Tlando", "oral testosterone blood test timing"],
    summary: "Needle-free treatment still requires product-specific care. The practical comparison is the exact medicine, its food instructions, its monitoring plan and its full cost—not a promise that a capsule is risk-free.",
    sourceIds: ["jatenzo", "kyzatrex", "tlando", "fda2025"],
    diagram: "/media/research/oral-monitoring-windows.svg",
    diagramAlt: "Current label testosterone blood-draw windows after the morning dose: Kyzatrex 3 to 5 hours, Jatenzo 6 hours, Tlando 8 to 9 hours. This is not a drug-effect or dosing chart.",
    sections: [
      { id: "not-interchangeable", title: "Start with the name on the prescription", html: `
        <p>Jatenzo, Kyzatrex and Tlando contain testosterone undecanoate, but the labels give different instructions. Kyzatrex and Tlando explicitly say they are not substitutable with other oral testosterone undecanoate products. Do not swap a dose, schedule or monitoring instruction between brands. ${cite("kyzatrex", "tlando")}</p>
        <p>Ask your clinician to write down the exact product, your own instructions and what to do when travel, meals or a lab appointment disrupt the routine. This guide intentionally does not publish starting doses or a titration recipe: those belong to the prescription and clinical follow-up.</p>
        ${note("Same route is not the same product", "A page that discusses “oral testosterone” without naming the formulation can hide the practical differences that matter to using it correctly.")}` },
      { id: "food", title: "Food matters; one universal fat-gram rule does not", html: `
        <p>All three current labels direct patients to take the product with food. Their food-effect findings are formulation-specific; they do not justify one blanket “15–20 grams of fat” instruction for every oral product. Follow the exact label and your prescriber’s instructions rather than a generic meal hack. ${cite("jatenzo", "kyzatrex", "tlando")}</p>
        <p>Before choosing a route, ask: “Can I realistically follow this product’s routine on workdays, weekends and trips?” Convenience is not simply avoiding an injection. It includes meal timing, refill logistics, the prescribed schedule and access to correctly timed monitoring.</p>` },
      { id: "monitoring", title: "A testosterone blood test has a clock attached", html: `
        <p>The following summarizes label monitoring windows, <strong>not when a drug starts working</strong>. Confirm the exact appointment instructions with the clinic; do not change medication timing yourself to match a chart.</p>
        <div class="eg-timings">${oralMonitoringWindows.map((row) => `<div class="eg-timing"><h3>${row.product}</h3><strong>${row.hours}</strong><p>after the morning dose</p><p>${row.firstCheck}. ${cite(row.source)}</p></div>`).join("")}</div>
        <p>These are on-treatment monitoring instructions. A test used to investigate low testosterone before treatment answers a different question. Tell the clinician and laboratory which test is planned, the exact product, when you took it, and any departure from your usual instructions.</p>
        <p>The useful next action is to ask for a written plan—not to interpret one isolated result against a timing window copied from another product. Keep the prescription, laboratory order and follow-up appointment together so mismatched instructions can be resolved before the blood draw.</p>` },
      { id: "warnings", title: "Updated warnings do not mean zero cardiovascular risk", html: `
        <p>On February 28, 2025, FDA announced class-wide labeling changes following the TRAVERSE trial and ambulatory blood-pressure studies. The changes removed boxed-warning language about increased adverse cardiovascular outcomes and added or strengthened blood-pressure warnings. That is not a declaration that testosterone is risk-free. ${cite("fda2025")}</p>
        <p>Current labels still warn about blood-pressure increases and require monitoring. Other issues include raised red-cell concentration and effects on sperm production. A non-injection route does not remove those concerns. ${cite("jatenzo", "kyzatrex", "tlando")}</p>
        <p>Ask which warnings matter in your medical history and which measurements the clinician will follow. Do not rank brands as “safest” using adverse-event percentages from separate trials with different participants and methods. A clean-looking comparison table can create false certainty when there was no direct comparison.</p>` },
      { id: "liver", title: "Modern oral testosterone is not the old liver-risk story—but avoid absolutes", html: `
        <p>Testosterone undecanoate uses a different absorption pathway from older 17-alpha-alkylated oral androgens. Tlando’s label describes lymphatic absorption that avoids first-pass liver metabolism. That distinction is meaningful, but it is not a guarantee against every liver problem or adverse reaction. ${cite("tlando")}</p>
        <p>Bring existing conditions, medicines and supplements to the clinician’s review. Do not use an article’s “liver-safe” shorthand to dismiss symptoms or skip agreed monitoring. The product label and the individual assessment are more useful than a yes/no safety badge.</p>` },
      { id: "routine-and-cost", title: "Compare the whole routine and bill before committing", html: `
        <p>Request the medication cost separately from membership, initial testing, follow-up testing, visits and delivery. Confirm whether the quote changes with the prescribed amount or pharmacy. An advertised monthly membership is not automatically the total cost of a particular oral product.</p>
        <p>For a useful appointment, bring three things: the exact product name, the written monitoring instructions, and an itemized quote. Read the <a href="/blog/trt-cost-2026">TRT cost guide</a> to normalize billing periods, or open the <a href="/decision-guide">free quote worksheet</a>. Price can help compare services; it cannot determine clinical suitability.</p>` },
    ],
    faqItems: [
      { q: "Can I use the same blood-test timing for every oral testosterone product?", a: "No. The labels specify different post-morning-dose monitoring windows. Confirm the product and the clinic’s instructions before scheduling the test.", sources: ["jatenzo", "kyzatrex", "tlando"] },
      { q: "Does an updated warning mean oral testosterone cannot raise blood pressure?", a: "No. Blood-pressure warnings remain relevant after the 2025 FDA labeling update. A changed warning is not a guarantee of no risk.", sources: ["fda2025"] },
      { q: "Does this guide tell me how to take or adjust my dose?", a: "No. Use your own prescription and prescriber’s instructions. This article helps you identify the product-specific questions to resolve with them.", sources: [] },
    ],
  },
  {
    slug: "trt-cost-2026",
    title: "TRT Cost in 2026: Compare the Full Bill, Not the Monthly Headline",
    description: "Dated clinic-price examples, hidden unknowns, four-week versus monthly billing, and a practical first-year budget worksheet. No affiliate ranking or treatment recommendation.",
    publishedAt: "2026-03-12", readTime: "7 min read",
    keywords: ["TRT cost 2026", "TRT monthly cost", "TRT clinic price comparison"],
    summary: "There is no useful single TRT price without specifying the product, included services and billing interval. Separate the enrollment payment, recurring budget and minimum commitment before comparing clinics.",
    sourceIds: ["fountain", "hone", "maximus"],
    diagram: "/media/research/billing-periods.svg",
    diagramAlt: "Illustrative $199 charge: calendar-month annual budget $2,388; 28-day annualized budget $2,594.11. Advance billing can produce 14 payments, $2,786, in days 0 through 364.",
    sections: [
      { id: "published-prices", title: "Three dated examples of why the headline is not the quote", html: `
        <p><strong>Checked September 17, 2026.</strong> These are published commercial examples, not current personalized quotes, endorsements or a complete market survey. Different medicines and services are not interchangeable. The links go to provider sources without affiliate tracking parameters.</p>
        ${table("Published terms and unresolved costs", ["Provider / listing", "Published example", "Confirm before paying"], [
          ["Fountain / TRT program", `$199 every 4 weeks; $499 every 12 weeks; $1,799 every 48 weeks. ${cite("fountain")}`, "Initial testing, add-ons, exact medication, advance payment and cancellation terms. A 48-week period is not a calendar year."],
          ["Hone / Plus membership", `From $180 to start, then $135/month. Medication is extra. ${cite("hone")}`, "Initial versus confirmatory testing, prescribed medication cost and ongoing inclusions. Basic membership is a different product, not a TRT bundle."],
          ["Maximus / enclomiphene-only", `$199.99/month on a 1-month plan; $149.99/month on 3 months; $99.99/month on 12 months. ${cite("maximus")}`, "Commitment, payment timing, labs and current cancellation terms. Enclomiphene is not a replacement-testosterone quote."],
        ])}
        <p>Do not pick the lowest number in this table. Ask each provider to price the same scope in writing. Mark any unanswered field “unknown” instead of filling it with zero. A cheap incomplete quote is not a complete comparison.</p>` },
      { id: "billing-clock", title: "A four-week bill is not a monthly bill", html: `
        <p>For an <strong>illustrative $199 charge</strong>, twelve calendar-month payments total <strong>$2,388</strong>. Annualizing a repeating 28-day service period gives $199 × 365 ÷ 28 = <strong>$2,594.11</strong>. The annualized difference is <strong>$206.11</strong>, before extras.</p>
        <div class="eg-metric-grid"><div><span>Calendar-month budget</span><strong>$2,388</strong><small>$199 × 12</small></div><div><span>28-day annualized budget</span><strong>$2,594.11</strong><small>$199 × 365 ÷ 28</small></div></div>
        ${note("Budget and cash flow answer different questions", "If the hypothetical 28-day plan charges in advance on day 0 and renews without interruption through day 364, there are 14 charges, totaling $2,786. The last payment buys service beyond that 365-day window. That does not contradict the annualized service budget; it measures payment dates instead.")}
        <p>The example assumes no cancellation, proration or price changes. It is arithmetic, not a prediction of any named provider’s invoice. Ask for actual payment dates when cash due during a particular period matters.</p>` },
      { id: "all-in", title: "Build an all-in quote with six fields", html: `
        <div class="eg-flow eg-cost-flow"><ol><li>Enrollment: what is due today?</li><li>Recurring plan: amount and exact interval</li><li>Medication: included or separately billed?</li><li>Testing and visits: initial and follow-up</li><li>Other extras: delivery, supplies, fees</li><li>Commitment: renewal, cancellation and refund terms</li></ol></div>
        <p>Use the same checklist for both providers. Confirm whether a medication quote covers the exact prescribed product and quantity. List each inclusion once; do not add a bundled service again as an extra. Keep an unanswered cost visible until the clinic resolves it.</p>
        <p>For example, Hone’s published Plus starting figure includes the initial test and first membership month. Adding that whole starting figure to twelve more membership months would count the first membership month twice. The published breakdown is $45 plus $135; twelve $135 memberships plus the $45 initial test is $1,665 before medication or other testing. ${cite("hone")}</p>` },
      { id: "cheap-vs-value", title: "Compare what happens after enrollment", html: `
        <p>Ask who answers administrative questions, which visits are included, what happens if the prescribed plan changes, and how an unsuitable or ineffective treatment is handled. Ask what is owed if you decide not to continue. These are service and contract questions, not evidence that any treatment is appropriate.</p>
        <p>A longer commitment can lower a displayed monthly equivalent while increasing the amount at risk or reducing flexibility. Do not describe an annual-plan rate as the price of a cancellable monthly plan. Likewise, a medication-only pharmacy quote should not be compared directly with a clinic package that includes other services.</p>
        <p>Insurance, savings offers and pharmacy quotes can be individual and conditional. Obtain a written benefit or payment estimate rather than assuming an advertised cash amount applies to you. This article does not verify your insurance coverage or determine which route should be prescribed.</p>` },
      { id: "worksheet", title: "Make the next comparison actionable", html: `
        <p>Open the <a href="/decision-guide">free two-quote calculator</a>. Enter confirmed costs, choose calendar-month or four-week billing, and use zero only for an item confirmed free or included. It calculates an annualized budget; it does not predict advance-billed cash dates.</p>
        <p>Before discussing the price difference, identify anything the quotes do not have in common. Ask the clinician about differences in treatment and monitoring; ask the provider about differences in services and terms. A lower budget is useful only when you understand what changed.</p>
        <p>The most useful outcome is a complete written quote and a short list of remaining questions. You do not need a manufactured “best clinic” score or an automated treatment recommendation to get there.</p>` },
    ],
    faqItems: [
      { q: "Is a four-week payment the same as a monthly payment?", a: "No. Four weeks is 28 days. Compare the actual interval and payment dates; twelve four-week periods cover only 336 days.", sources: [] },
      { q: "Does a membership price include the medication?", a: "Not necessarily. For example, Hone’s published Plus membership excludes medication. Ask the provider to itemize the exact services and product in your quote.", sources: ["hone"] },
      { q: "Does the cheapest quote identify the best treatment?", a: "No. Cost comparison does not establish clinical suitability or equivalent care. Resolve the treatment questions with a licensed clinician.", sources: [] },
    ],
  },
];

export function getEvidenceGuide(slug: string) {
  return evidenceGuides.find((guide) => guide.slug === slug);
}
export function renderEvidenceGuide(guide: EvidenceGuide): string {
  return `<div class="evidence-guide">
    <aside class="eg-summary"><span class="eg-eyebrow">The decision in plain English</span><p>${guide.summary}</p><small>Sources checked ${EVIDENCE_CHECKED_AT}. Editorial synthesis; not an individual medical assessment. No clinician-review credential is claimed.</small></aside>
    <nav class="eg-toc" aria-label="On this page"><strong>In this guide</strong><ol>${guide.sections.map((s) => `<li><a href="#${s.id}">${s.title}</a></li>`).join("")}</ol></nav>
    <figure class="eg-figure"><picture><source media="(max-width: 600px)" srcset="${guide.diagram.replace(".svg", "-mobile.svg")}" width="480" height="800" /><img src="${guide.diagram}" alt="${escapeHtml(guide.diagramAlt)}" width="960" height="640" loading="lazy" decoding="async" /></picture><figcaption>${guide.diagramAlt} The full explanation and sources appear below.</figcaption></figure>
    ${guide.sections.map((s) => `<section id="${s.id}" class="eg-section"><h2>${s.title}</h2>${s.html}</section>`).join("")}
    <section id="frequent-questions" class="eg-section"><h2>Frequently asked questions</h2>${guide.faqItems.map((faq) => `<h3>${faq.q}</h3><p>${faq.a} ${cite(...faq.sources)}</p>`).join("")}</section>
    <aside class="eg-next"><h2>Turn the reading into better questions</h2><p>Use the non-clinical decision quiz to organize your appointment brief, or compare written costs with the free worksheet. Neither tool diagnoses or prescribes.</p><div><a href="/quiz/healthspan">Build my decision brief →</a><a href="/decision-guide">Compare my written quotes →</a></div></aside>
    <section id="sources" class="eg-section eg-sources"><h2>Sources and limitations</h2><p>Product labels support product instructions; trial reports support only the populations and outcomes studied. Provider pages support published prices, not independent clinical efficacy. Prices and labels can change after the source-check date.</p><ol>${guide.sourceIds.map((id) => `<li id="evidence-source-${id}" value="${Object.keys(evidenceSources).indexOf(id) + 1}"><a href="${evidenceSources[id].url}" rel="noreferrer">${evidenceSources[id].label}</a><span>${evidenceSources[id].kind} · checked ${EVIDENCE_CHECKED_AT}</span></li>`).join("")}</ol><p>Do not start, stop or change medication based on this article. Discuss treatment, monitoring and family plans with a licensed clinician. No paid placement determines these explanations.</p></section>
  </div>`;
}
