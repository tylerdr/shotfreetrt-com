import type { QuizAnswers } from "@/lib/quiz/healthspan-types";
import type { QuizQuestion } from "@/lib/quiz/healthspan-config";

type AdvancedQuestion = QuizQuestion & {
  when?: (introAnswers: QuizAnswers, advancedAnswers: QuizAnswers) => boolean;
};

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}

function introHasPoorSleep(introAnswers: QuizAnswers) {
  const sleepQuality = toStringValue(introAnswers.sleepQuality);
  const apnea = toStringValue(introAnswers.snoringOrApnea);

  return (
    sleepQuality === "poor" ||
    sleepQuality === "fair" ||
    apnea === "snore" ||
    apnea === "suspected-apnea" ||
    apnea === "untreated-apnea"
  );
}

function introWantsFertility(introAnswers: QuizAnswers) {
  const fertilityGoal = toStringValue(introAnswers.fertilityGoal);
  return fertilityGoal === "yes" || fertilityGoal === "unsure";
}

function introHasTherapyHistory(introAnswers: QuizAnswers) {
  const previous = toStringArray(introAnswers.previousTherapies);
  return previous.length > 0 && !previous.includes("none");
}

const advancedQuestionBank: AdvancedQuestion[] = [
  {
    id: "labMarkersKnown",
    type: "multi-select",
    title: "Which markers do you actually know right now?",
    options: [
      { value: "none", label: "None", exclusive: true },
      { value: "total-t", label: "Total testosterone" },
      { value: "free-t", label: "Free testosterone" },
      { value: "shbg", label: "SHBG" },
      { value: "lh", label: "LH" },
      { value: "fsh", label: "FSH" },
      { value: "estradiol", label: "Estradiol" },
      { value: "prolactin", label: "Prolactin" },
      { value: "tsh", label: "TSH" },
      { value: "a1c", label: "HbA1c" },
      { value: "hematocrit", label: "Hematocrit" },
      { value: "psa", label: "PSA" }
    ]
  },
  {
    id: "totalTestosteroneValue",
    type: "number-input",
    title: "Most recent total testosterone",
    fields: [{ key: "totalT", label: "Total testosterone", min: 50, max: 1500, step: 1, unit: "ng/dL" }],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.labMarkersKnown).includes("total-t")
  },
  {
    id: "freeTestosteroneValue",
    type: "number-input",
    title: "Most recent free testosterone",
    fields: [{ key: "freeT", label: "Free testosterone", min: 1, max: 300, step: 0.1, unit: "pg/mL" }],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.labMarkersKnown).includes("free-t")
  },
  {
    id: "shbgValue",
    type: "number-input",
    title: "Most recent SHBG",
    fields: [{ key: "shbg", label: "SHBG", min: 5, max: 150, step: 0.1, unit: "nmol/L" }],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.labMarkersKnown).includes("shbg")
  },
  {
    id: "lhValue",
    type: "number-input",
    title: "Most recent LH",
    fields: [{ key: "lh", label: "LH", min: 0.1, max: 30, step: 0.1, unit: "IU/L" }],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.labMarkersKnown).includes("lh")
  },
  {
    id: "fshValue",
    type: "number-input",
    title: "Most recent FSH",
    fields: [{ key: "fsh", label: "FSH", min: 0.1, max: 40, step: 0.1, unit: "IU/L" }],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.labMarkersKnown).includes("fsh")
  },
  {
    id: "estradiolValue",
    type: "number-input",
    title: "Most recent estradiol",
    fields: [{ key: "estradiol", label: "Estradiol", min: 1, max: 120, step: 1, unit: "pg/mL" }],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.labMarkersKnown).includes("estradiol")
  },
  {
    id: "prolactinValue",
    type: "number-input",
    title: "Most recent prolactin",
    fields: [{ key: "prolactin", label: "Prolactin", min: 1, max: 80, step: 0.1, unit: "ng/mL" }],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.labMarkersKnown).includes("prolactin")
  },
  {
    id: "tshValue",
    type: "number-input",
    title: "Most recent TSH",
    fields: [{ key: "tsh", label: "TSH", min: 0.1, max: 15, step: 0.1, unit: "mIU/L" }],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.labMarkersKnown).includes("tsh")
  },
  {
    id: "a1cValue",
    type: "number-input",
    title: "Most recent HbA1c",
    fields: [{ key: "a1c", label: "HbA1c", min: 3.5, max: 14, step: 0.1, unit: "%" }],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.labMarkersKnown).includes("a1c")
  },
  {
    id: "hematocritValue",
    type: "number-input",
    title: "Most recent hematocrit",
    fields: [{ key: "hematocrit", label: "Hematocrit", min: 20, max: 60, step: 0.1, unit: "%" }],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.labMarkersKnown).includes("hematocrit")
  },
  {
    id: "psaValue",
    type: "number-input",
    title: "Most recent PSA",
    fields: [{ key: "psa", label: "PSA", min: 0.1, max: 20, step: 0.1, unit: "ng/mL" }],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.labMarkersKnown).includes("psa")
  },
  {
    id: "morningDrawn",
    type: "single-select",
    title: "Were your hormone labs drawn early in the morning?",
    description: "Useful for interpreting borderline or low results.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" }
    ],
    when: (_, advancedAnswers) => {
      const markers = toStringArray(advancedAnswers.labMarkersKnown);
      return markers.includes("total-t") || markers.includes("free-t") || markers.includes("lh") || markers.includes("fsh");
    }
  },
  {
    id: "repeatLowStatus",
    type: "single-select",
    title: "If you were low, how well confirmed is that result?",
    options: [
      { value: "one-low", label: "One low result" },
      { value: "two-low", label: "Two early-morning lows" },
      { value: "not-low", label: "Not actually low" },
      { value: "unsure", label: "Unsure" }
    ],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.labMarkersKnown).includes("total-t")
  },
  {
    id: "sleepFollowup",
    type: "single-select",
    title: "What is the current sleep / apnea status?",
    options: [
      { value: "working-on-it", label: "I know sleep is an issue and I’m working on it" },
      { value: "not-addressed", label: "Sleep issue is not really addressed" },
      { value: "sleep-study-pending", label: "Sleep study pending / being evaluated" },
      { value: "treated-apnea", label: "Apnea is treated and controlled" }
    ],
    when: (introAnswers) => introHasPoorSleep(introAnswers)
  },
  {
    id: "caffeineTiming",
    type: "single-select",
    title: "When is your last caffeine on a normal day?",
    options: [
      { value: "before-noon", label: "Before noon" },
      { value: "early-afternoon", label: "Early afternoon" },
      { value: "late-afternoon", label: "Late afternoon or later" }
    ],
    when: (introAnswers) => introHasPoorSleep(introAnswers)
  },
  {
    id: "shiftWork",
    type: "single-select",
    title: "How much shift work or circadian disruption is in your life?",
    options: [
      { value: "none", label: "None" },
      { value: "occasional", label: "Occasional" },
      { value: "regular", label: "Regular night / rotating schedule" }
    ]
  },
  {
    id: "weightTrend",
    type: "single-select",
    title: "What has your weight been doing over the last 6 months?",
    options: [
      { value: "down", label: "Trending down" },
      { value: "stable", label: "Mostly stable" },
      { value: "up-slight", label: "Up a little" },
      { value: "up-clear", label: "Clearly up" }
    ]
  },
  {
    id: "fertilityTimeline",
    type: "single-select",
    title: "If fertility matters, what is the likely timeline?",
    options: [
      { value: "lt12", label: "Within 12 months" },
      { value: "12-24", label: "12-24 months" },
      { value: "24plus", label: "More than 24 months" },
      { value: "unsure", label: "Still unsure" }
    ],
    when: (introAnswers) => introWantsFertility(introAnswers)
  },
  {
    id: "therapyHistoryFollowup",
    type: "text-input",
    optional: true,
    multiline: true,
    title: "If you’ve tried anything before, what happened?",
    placeholder: "Examples: tried enclomiphene for 8 weeks, libido improved but sleep still bad; topical TRT helped energy but fertility became a concern...",
    when: (introAnswers) => introHasTherapyHistory(introAnswers)
  },
  {
    id: "advancedNotes",
    type: "text-input",
    optional: true,
    multiline: true,
    maxLength: 900,
    title: "Anything else a clinician should know before thinking about SERM or TRT?",
    placeholder: "Fertility context, prolactin or thyroid history, prior fertility testing, sleep study results, medication changes, etc."
  }
];

export function getAdvancedQuestions(introAnswers: QuizAnswers, advancedAnswers: QuizAnswers): QuizQuestion[] {
  return advancedQuestionBank.filter((question) => (question.when ? question.when(introAnswers, advancedAnswers) : true));
}
