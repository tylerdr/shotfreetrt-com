/**
 * The same eight appointment questions shown on /decision-guide
 * (src/lib/decision-guide.ts). Duplicated as plain strings here, rather than
 * imported, so this module has no cross-file dependency and stays directly
 * runnable by the plain Node test runner as well as the Next.js bundler.
 */
const visitQuestions = [
  "Do my symptoms and repeat morning testosterone results support a diagnosis, and what other causes should we investigate?",
  "How would my plans for children affect the options we discuss?",
  "Is this replacement testosterone, or a different medicine intended to stimulate my own production?",
  "Is the exact product FDA-approved, compounded, or being used off-label? What does that mean for me?",
  "What monitoring, side effects, blood-pressure checks, and follow-up would this option require?",
  "What are the household transfer precautions for a topical product, and the instructions for this exact formulation?",
  "What is due today, what repeats, and are labs, medicine, visits, delivery, and cancellation fees included?",
  "What happens if treatment is unsuitable, does not help, or I decide not to continue?"
] as const;

/**
 * Deterministic decision-quiz engine. This is intentionally NOT a clinical
 * scoring model: it never touches symptoms, lab values, or diagnosis. It
 * only asks about intent, testing stage, fertility-conversation priority,
 * delivery-route preference, cost clarity, and decision timing, then maps
 * those answers to plain-language reasons, a prioritized checklist, and
 * reading links — every output is traceable to the exact answer that
 * produced it. Nothing here calls a network endpoint, an AI model, or
 * persists answers outside component memory.
 */

export type QuestionId =
  | "intent"
  | "testingStage"
  | "fertilityPriority"
  | "routePreference"
  | "costClarity"
  | "timing";

export type QuizOption = {
  id: string;
  label: string;
  /** First-person reflection sentence used verbatim in the decision brief. */
  summary: string;
};

export type QuizQuestion = {
  id: QuestionId;
  title: string;
  helpText: string;
  options: readonly QuizOption[];
};

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: "intent",
    title: "What brings you here today?",
    helpText: "This tells us which reading paths to put first. It is not a diagnosis.",
    options: [
      { id: "just-symptoms", label: "Noticing possible low-T symptoms and want to understand them", summary: "You're just starting to look into possible low-T symptoms." },
      { id: "comparing-providers", label: "Actively comparing clinics or providers", summary: "You're actively comparing clinics or providers." },
      { id: "before-appointment", label: "Preparing for an appointment I already have", summary: "You have an appointment coming up and want to prepare." },
      { id: "already-treating", label: "Already being treated and want a second look", summary: "You're already being treated and want a second look at the plan." }
    ]
  },
  {
    id: "testingStage",
    title: "Where are you with testosterone testing?",
    helpText: "One early-morning result is not the same as a confirmed diagnosis.",
    options: [
      { id: "not-tested", label: "Haven't been tested yet", summary: "You haven't had testosterone testing yet." },
      { id: "tested-once", label: "Tested once", summary: "You have one testosterone result so far." },
      { id: "tested-twice", label: "Tested on two or more separate mornings", summary: "You have repeat morning testing already." },
      { id: "unsure-results", label: "Tested, but not sure what the results mean", summary: "You've been tested but aren't sure how to read the results." }
    ]
  },
  {
    id: "fertilityPriority",
    title: "How much does preserving fertility matter right now?",
    helpText: "Exogenous testosterone can suppress fertility; this changes which questions matter most.",
    options: [
      { id: "high", label: "High priority — I want children soon", summary: "Preserving fertility soon is a high priority for you." },
      { id: "some", label: "Some priority — I want to keep options open", summary: "Keeping fertility options open matters to you, even if it's not urgent." },
      { id: "not-priority", label: "Not a priority for me right now", summary: "Fertility preservation is not a near-term priority for you." },
      { id: "unsure", label: "Not sure, or doesn't apply", summary: "You're not sure how fertility factors into your decision, or it doesn't apply." }
    ]
  },
  {
    id: "routePreference",
    title: "How do you feel about injections?",
    helpText: "This is a delivery preference, not a treatment recommendation.",
    options: [
      { id: "avoid", label: "I want to avoid them entirely", summary: "You want to avoid injections entirely." },
      { id: "explore-oral-topical", label: "I'd rather explore oral or topical options first", summary: "You'd rather explore oral or topical options before anything injectable." },
      { id: "open", label: "I'm open to injections if that's the best fit", summary: "You're open to injections if a clinician says that's the best fit." },
      { id: "no-preference", label: "No strong preference either way", summary: "You don't have a strong delivery-route preference yet." }
    ]
  },
  {
    id: "costClarity",
    title: "How clear is your cost picture?",
    helpText: "An unknown cost should never be treated as zero.",
    options: [
      { id: "no-idea", label: "I have no idea what this costs", summary: "You don't have a cost picture yet." },
      { id: "one-quote", label: "I have one written quote", summary: "You have one written quote so far." },
      { id: "multiple-quotes", label: "I have more than one quote to compare", summary: "You have multiple quotes to compare." },
      { id: "already-paying", label: "I'm already paying and want to sanity-check it", summary: "You're already paying and want to double-check the bill." }
    ]
  },
  {
    id: "timing",
    title: "How soon do you want to make a decision?",
    helpText: "This only changes how urgently we surface the checklist, not what's in it.",
    options: [
      { id: "this-week", label: "This week", summary: "You're hoping to decide this week." },
      { id: "this-month", label: "This month", summary: "You're aiming to decide sometime this month." },
      { id: "researching", label: "Just researching, no rush", summary: "You're researching with no immediate deadline." },
      { id: "decided", label: "Already decided, want a gut check", summary: "You've mostly decided and want a gut check." }
    ]
  }
] as const;

export type QuizAnswers = Partial<Record<QuestionId, string>>;

export function isQuizComplete(answers: QuizAnswers): boolean {
  return QUIZ_QUESTIONS.every((question) => Boolean(answers[question.id]));
}

function getOption(questionId: QuestionId, optionId: string | undefined): QuizOption | null {
  if (!optionId) return null;
  const question = QUIZ_QUESTIONS.find((item) => item.id === questionId);
  return question?.options.find((option) => option.id === optionId) ?? null;
}

export type PrioritizedQuestion = {
  question: string;
  reason: string | null;
};

export type ReadingPath = {
  title: string;
  description: string;
  href: string;
};

export type NextAction = {
  label: string;
  href: string;
};

export type DecisionBrief = {
  situationSummary: string[];
  prioritizedQuestions: PrioritizedQuestion[];
  readingPaths: ReadingPath[];
  primaryAction: NextAction;
  secondaryAction: NextAction;
};

function buildPrioritizedQuestions(answers: QuizAnswers): PrioritizedQuestion[] {
  const boosted: PrioritizedQuestion[] = [];
  const boostedText = new Set<string>();

  const boost = (question: string, reason: string) => {
    if (boostedText.has(question)) return;
    boostedText.add(question);
    boosted.push({ question, reason });
  };

  if (answers.fertilityPriority === "high" || answers.fertilityPriority === "some") {
    boost(
      visitQuestions[1],
      "You said fertility matters, so raise this before discussing any specific treatment."
    );
  }

  if (answers.testingStage === "not-tested" || answers.testingStage === "unsure-results") {
    boost(
      visitQuestions[0],
      "You don't have a confirmed diagnosis yet, so start with this."
    );
  }

  if (answers.costClarity === "no-idea" || answers.costClarity === "already-paying") {
    boost(
      visitQuestions[6],
      "You don't have a full written cost picture yet, so get every number in writing."
    );
  }

  if (answers.routePreference === "avoid" || answers.routePreference === "explore-oral-topical") {
    boost(
      visitQuestions[2],
      "You want to limit or avoid injections, so confirm what type of medicine is actually being proposed."
    );
  }

  const rest = visitQuestions
    .filter((question) => !boostedText.has(question))
    .map((question) => ({ question, reason: null }));

  return [...boosted, ...rest];
}

function buildReadingPaths(answers: QuizAnswers): ReadingPath[] {
  const paths: ReadingPath[] = [];
  const seen = new Set<string>();

  const add = (path: ReadingPath) => {
    if (seen.has(path.href)) return;
    seen.add(path.href);
    paths.push(path);
  };

  if (answers.testingStage === "not-tested" || answers.testingStage === "unsure-results") {
    add({
      title: "What a TRT bloodwork panel actually measures",
      description: "Understand the labs before you interpret a single number.",
      href: "/blog/trt-bloodwork-panel"
    });
  }

  if (answers.fertilityPriority === "high" || answers.fertilityPriority === "some") {
    add({
      title: "TRT and fertility",
      description: "What exogenous testosterone can do to fertility, and what to ask.",
      href: "/blog/trt-and-fertility"
    });
  }

  if (answers.routePreference === "avoid" || answers.routePreference === "explore-oral-topical") {
    add({
      title: "Enclomiphene vs. TRT",
      description: "A fertility-aware, non-injectable route some men discuss with a clinician.",
      href: "/blog/enclomiphene-vs-trt"
    });
    add({
      title: "Testosterone gel vs. injections",
      description: "How a topical route compares on absorption, transfer risk, and monitoring.",
      href: "/blog/testosterone-gel-vs-injections"
    });
  }

  if (answers.costClarity === "no-idea" || answers.costClarity === "one-quote") {
    add({
      title: "TRT cost in 2026",
      description: "What published clinic pricing tends to include and leave out.",
      href: "/blog/trt-cost-2026"
    });
  }

  if (answers.intent === "already-treating") {
    add({
      title: "TRT side effects to monitor",
      description: "What to track if you're already on a protocol.",
      href: "/blog/trt-side-effects"
    });
  }

  if (paths.length === 0) {
    add({
      title: "Best online TRT clinics",
      description: "A starting point for evaluating providers.",
      href: "/blog/best-online-trt-clinic"
    });
  }

  return paths.slice(0, 3);
}

function buildActions(answers: QuizAnswers): { primary: NextAction; secondary: NextAction } {
  const hasQuoteToCompare =
    answers.costClarity === "one-quote" ||
    answers.costClarity === "multiple-quotes" ||
    answers.costClarity === "already-paying";

  if (hasQuoteToCompare) {
    return {
      primary: { label: "Compare your quotes in the calculator", href: "/decision-guide" },
      secondary: { label: "See dated provider price examples", href: "/pricing" }
    };
  }

  return {
    primary: { label: "See dated provider price examples", href: "/pricing" },
    secondary: { label: "Open the free appointment checklist", href: "/decision-guide" }
  };
}

export function buildDecisionBrief(answers: QuizAnswers): DecisionBrief | null {
  if (!isQuizComplete(answers)) return null;

  const situationSummary = QUIZ_QUESTIONS.map((question) => {
    const option = getOption(question.id, answers[question.id]);
    return option?.summary ?? "";
  }).filter(Boolean);

  const { primary, secondary } = buildActions(answers);

  return {
    situationSummary,
    prioritizedQuestions: buildPrioritizedQuestions(answers).slice(0, 5),
    readingPaths: buildReadingPaths(answers),
    primaryAction: primary,
    secondaryAction: secondary
  };
}
