/** Education and quote arithmetic only. Never score treatment eligibility. */
export const EVIDENCE_DATE = "2026-09-17";
export const sources = {
  guideline: "https://www.endocrine.org/clinical-practice-guidelines/testosterone-therapy",
  compounding: "https://www.fda.gov/drugs/human-drug-compounding/understanding-risks-compounded-drugs",
  labeling: "https://www.fda.gov/drugs/drug-alerts-and-statements/fda-issues-class-wide-labeling-changes-testosterone-products",
} as const;

export const visitQuestions = [
  "Do my symptoms and repeat morning testosterone results support a diagnosis, and what other causes should we investigate?",
  "How would my plans for children affect the options we discuss?",
  "Is this replacement testosterone, or a different medicine intended to stimulate my own production?",
  "Is the exact product FDA-approved, compounded, or being used off-label? What does that mean for me?",
  "What monitoring, side effects, blood-pressure checks, and follow-up would this option require?",
  "What are the household transfer precautions for a topical product, and the instructions for this exact formulation?",
  "What is due today, what repeats, and are labs, medicine, visits, delivery, and cancellation fees included?",
  "What happens if treatment is unsuitable, does not help, or I decide not to continue?",
] as const;

export const decisionFaqs = [
  { question: "Does needle-free mean fertility-preserving?", answer: "No. Avoiding injections does not remove the fertility concerns associated with replacement testosterone. Discuss plans for children before treatment; the Endocrine Society recommends against testosterone therapy when planning fertility in the near term.", source: sources.guideline },
  { question: "Can this tool tell me whether I need TRT?", answer: "No. This is an educational comparison and appointment-preparation tool, not a diagnosis, eligibility score, or prescription. Clinical assessment and repeat morning testing matter.", source: sources.guideline },
  { question: "Is a compounded medicine the same as an FDA-approved medicine?", answer: "No. Compounded drugs are not FDA-approved; FDA does not review their safety, effectiveness, or quality before they are marketed. Ask about the exact product, evidence, alternatives, and pharmacy.", source: sources.compounding },
] as const;

export const providerSnapshots = [
  { name: "Fountain", plan: "TRT program", price: "$199 every 4 weeks", detail: "Starter is billed every 4 weeks, not every calendar month. The site also lists $499 every 12 weeks and $1,799 every 48 weeks.", confirm: "Confirm initial testing, add-ons, cancellation terms, and your exact prescription quote. A 48-week plan is not a calendar year.", url: "https://fountain.net/trt" },
  { name: "Hone", plan: "Plus membership", price: "$135/month + medication", detail: "Hone lists a starting cost from $180, including the initial test and first membership month. Medication is extra; confirmatory testing can change the total.", confirm: "Do not compare the $25 Basic longevity membership to a TRT treatment bundle. Confirm medication, test type, and any additional testing.", url: "https://help.honehealth.com/hc/en-us/articles/40161781101335-Hone-Health-Membership-Overview-Compare-Basic-Plus-Premium-Plans" },
  { name: "Maximus", plan: "Enclomiphene-only listing", price: "$199.99/month on the 1-month plan", detail: "The listing also shows $149.99/month on a 3-month plan and $99.99/month on a 12-month plan. These are different commitments, not interchangeable prices.", confirm: "Confirm lab charges, payment timing, cancellation terms, state availability, and product details. This listing is not a recommendation of enclomiphene or a testosterone-replacement quote.", url: "https://shop.maximustribe.com/testosterone/enclomiphene-only" },
] as const;

export type QuoteInput = {
  plan: string;
  cadence: "monthly" | "four-week";
  medication: string;
  labs: string;
  setup: string;
};
export type QuoteEstimate = { annualBudgetCents: number; monthlyRunRateCents: number };

/** Blank is unknown, never silently free. Decimal USD only, capped to prevent overflow. */
export function parseMoney(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(trimmed)) return null;
  const [whole, fraction = ""] = trimmed.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents <= 10_000_000 ? cents : null;
}

export function estimateQuote(input: QuoteInput): QuoteEstimate | null {
  if (input.cadence !== "monthly" && input.cadence !== "four-week") return null;
  const values = [input.plan, input.medication, input.labs, input.setup].map(parseMoney);
  if (values.some((value) => value === null)) return null;
  const [plan, medication, labs, setup] = values as number[];
  // Annualized consumption budget, NOT a forecast of dated/prepaid cash charges.
  const annualPlan = Math.round(plan * (input.cadence === "monthly" ? 12 : 365 / 28));
  const annualRecurring = annualPlan + medication * 12 + labs;
  return { annualBudgetCents: annualRecurring + setup, monthlyRunRateCents: Math.round(annualRecurring / 12) };
}

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
