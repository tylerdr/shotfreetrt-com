import type { QuestionId } from "./quiz/decision-quiz";

export const JOURNEY_UPDATED_AT = "2026-09-18";
export const SHARE_GUIDE_URL = "https://shotfreetrt.com/";
export const journeySources = {
  testing: { name: "Endocrine Society: hypogonadism in men", url: "https://www.endocrine.org/patient-engagement/endocrine-library/hypogonadism" },
  guideline: { name: "Endocrine Society: testosterone therapy guideline", url: "https://www.endocrine.org/clinical-practice-guidelines/testosterone-therapy" },
  compounding: { name: "FDA: understanding compounded drugs", url: "https://www.fda.gov/drugs/human-drug-compounding/understanding-risks-compounded-drugs" },
} as const;
type SourceId = keyof typeof journeySources;
export type Journey = {
  slug: string; label: string; title: string; description: string; image: string;
  promise: string; firstQuestion: string; preview: string[];
  questionOrder: QuestionId[];
  lessons: { title: string; text: string; source?: SourceId }[];
  faqs: { question: string; answer: string; source?: SourceId }[];
};

/** These are reading/decision priorities, never a diagnosis or prefilled quiz answer. */
export const journeys: Journey[] = [
  {
    slug: "energy-and-testing", label: "Energy & testing",
    title: "Low energy? Start with better questions.",
    description: "Organize what to discuss about testosterone testing before choosing a treatment. Build an appointment brief, not a symptom score.",
    image: "/media/sft-web-batch3-06.webp", promise: "Know what is established—and what still needs checking.",
    firstQuestion: "What should we investigate before assuming testosterone explains how I feel?",
    preview: ["Your testing stage, in your own words", "Questions about other possible causes", "A checklist to take to your appointment"],
    questionOrder: ["testingStage", "intent", "fertilityPriority", "routePreference", "costClarity", "timing"],
    lessons: [
      { title: "A feeling is not a diagnosis", text: "The Endocrine Society describes diagnosis using both relevant signs or symptoms and repeated low morning testosterone results. A quiz cannot establish either for you.", source: "testing" },
      { title: "Bring the context", text: "Make your own note of when things changed and what you want help understanding. Discuss your history and current medicines with the clinician, rather than uploading them here.", source: "testing" },
      { title: "Leave with a next step", text: "Ask what remains uncertain, whether testing is appropriate, and how results will be followed up. A useful visit can lead to further evaluation rather than a prescription." },
    ],
    faqs: [
      { question: "Will this tell me whether I have low testosterone?", answer: "No. It organizes questions using the answers you choose. Diagnosis requires clinical assessment and appropriate testing.", source: "testing" },
      { question: "Do I need to upload bloodwork?", answer: "No. The quiz asks about your testing stage, not your lab values. Keep clinical documents for the clinician who is assessing you." },
      { question: "What will I get at the end?", answer: "A summary of your selected answers, prioritized appointment questions, reading suggestions, and a printable brief. You can use it without an email address or account." },
    ],
  },
  {
    slug: "fertility-questions", label: "Fertility questions",
    title: "Thinking about testosterone—and future children?",
    description: "Put family plans into the conversation before treatment. Prepare the right questions without relying on a fertility-friendly marketing label.",
    image: "/media/sft-web-batch3-04.webp", promise: "Make an important priority part of the first conversation.",
    firstQuestion: "How do my plans for children change the options we should discuss?",
    preview: ["Your fertility-conversation priority", "Questions to raise before choosing a medicine", "Room to keep uncertain answers visible"],
    questionOrder: ["fertilityPriority", "intent", "testingStage", "routePreference", "costClarity", "timing"],
    lessons: [
      { title: "Raise it before the prescription", text: "The Endocrine Society recommends against testosterone therapy when planning fertility in the near term. Discuss your plans before deciding on a treatment.", source: "guideline" },
      { title: "Needle-free does not settle it", text: "A delivery preference and a fertility question are different things. Ask what the exact medicine is and how your clinician would evaluate the outcomes that matter to you.", source: "guideline" },
      { title: "Do not change treatment on your own", text: "Already receiving care? Bring the question to your prescriber. This page does not recommend stopping treatment, switching medicines, or adding a fertility drug." },
    ],
    faqs: [
      { question: "Does this quiz test or predict fertility?", answer: "No. It neither measures fertility nor predicts pregnancy. It helps you state your priorities clearly for a clinician." },
      { question: "Will it recommend a fertility-preserving medicine?", answer: "No. The output is an appointment checklist, not a medicine ranking. A clinical discussion must consider the cause of the problem and your circumstances." },
      { question: "Can I keep my answers private?", answer: "Answers stay in the quiz page's memory and are not automatically stored or transmitted. You decide whether to print or save the brief; do not share that file unless you intend to." },
    ],
  },
  {
    slug: "needle-free-options", label: "Needle-free options",
    title: "Prefer to skip the shots? Compare the whole routine.",
    description: "Separate delivery method, exact medicine, monitoring, and cost. Bring a better set of questions to a discussion about non-injection options.",
    image: "/media/sft-web-batch3-07.webp", promise: "Know what to compare beyond the word “oral” or “topical.”",
    firstQuestion: "What exact product are we discussing, and what would its routine require?",
    preview: ["Your delivery preference—without assuming suitability", "Questions about product status and instructions", "A worksheet for the costs outside the headline"],
    questionOrder: ["routePreference", "intent", "testingStage", "fertilityPriority", "costClarity", "timing"],
    lessons: [
      { title: "Start with the exact product", text: "Write down the product name, formulation and dispensing pharmacy. Ask the clinician to distinguish the route of delivery from the kind of medicine being proposed." },
      { title: "Ask what approval means", text: "Compounded drugs are not FDA-approved. A prescription and FDA approval are not the same fact; ask why the particular product is being considered.", source: "compounding" },
      { title: "Compare routine and follow-up", text: "Ask for the product's instructions, monitoring plan, relevant precautions and full quote. Avoid borrowing instructions from a different medicine simply because it uses the same route." },
    ],
    faqs: [
      { question: "Does avoiding injections make a treatment appropriate for me?", answer: "No. Preference is one question; diagnosis, risks and monitoring are separate questions for your clinician. The quiz does not determine suitability." },
      { question: "Will this provide a dose or treatment plan?", answer: "No. It produces a decision brief and questions. Follow your own prescription and clinician's instructions, not a generic online routine." },
      { question: "Can I compare costs without choosing a treatment here?", answer: "Yes. The free worksheet helps you compare written prices and flag unknowns. A price comparison is not a clinical recommendation." },
    ],
  },
  {
    slug: "clinic-costs", label: "Clinic costs",
    title: "Before you commit, see the whole bill.",
    description: "Compare the billing interval, inclusions, extra costs and commitment—not just a monthly headline. Turn two written quotes into a clearer decision.",
    image: "/media/sft-web-batch3-10.webp", promise: "Leave with a complete question list, not a misleading cheapest-clinic score.",
    firstQuestion: "What is due today, what repeats, and what is not included?",
    preview: ["Your current quote situation", "Missing costs to request in writing", "An annualized comparison, clearly labeled"],
    questionOrder: ["costClarity", "intent", "testingStage", "fertilityPriority", "routePreference", "timing"],
    lessons: [
      { title: "Put both quotes on the same clock", text: "Every four weeks means every 28 days, not every calendar month. Twelve four-week periods cover 336 days. Ask for the actual billing interval and payment dates." },
      { title: "Unknown is not free", text: "Separate membership, medicine, initial and follow-up testing, visits, supplies and delivery. Mark unresolved costs as unknown; do not quietly count them as zero." },
      { title: "Read the commitment", text: "A lower monthly equivalent may come with a longer commitment or advance payment. Compare what you owe if you cancel, not only the displayed rate." },
    ],
    faqs: [
      { question: "Does the calculator show my exact first-year cash payments?", answer: "No. It estimates an annualized budget from the amounts you enter. Advance billing, taxes, renewals and cancellations can change actual payment dates and totals." },
      { question: "Are the cheapest services always equivalent?", answer: "No. Different quotes can include different services or medicines. Ask the provider about commercial differences and a clinician about clinical differences." },
      { question: "Do I need an account or credit card?", answer: "No. The quiz and quote worksheet are free. There is no automatic subscription or payment step." },
    ],
  },
];

export function getJourney(slug: string): Journey | undefined { return journeys.find((journey) => journey.slug === slug); }
const articleJourneys: Record<string, string> = {
  "low-testosterone-symptoms": "energy-and-testing", "trt-bloodwork-panel": "energy-and-testing",
  "trt-and-sleep-apnea": "energy-and-testing", "trt-and-fertility": "fertility-questions",
  "does-trt-cause-infertility": "fertility-questions", "enclomiphene-vs-trt": "fertility-questions",
  "oral-testosterone": "needle-free-options", "testosterone-gel-vs-injections": "needle-free-options",
  "trt-cost-2026": "clinic-costs", "best-online-trt-clinic": "clinic-costs", "trt-insurance-coverage": "clinic-costs",
};
export function journeyForArticle(slug: string): Journey | undefined { const id = articleJourneys[slug]; return id ? getJourney(id) : undefined; }
export function quizPath(journey: Journey): string { return `/quiz/concern/${journey.slug}`; }
