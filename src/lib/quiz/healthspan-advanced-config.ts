import type { QuizAnswers } from "@/lib/quiz/healthspan-types";
import type { QuizOption, QuizQuestion } from "@/lib/quiz/healthspan-config";

type AdvancedQuestion = QuizQuestion & {
  when?: (introAnswers: QuizAnswers, advancedAnswers: QuizAnswers) => boolean;
};

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toNumberValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}

function introExercises(introAnswers: QuizAnswers) {
  const frequency = toStringValue(introAnswers.exerciseFrequency);
  return frequency.length > 0 && frequency !== "none";
}

function introStrengthFocused(introAnswers: QuizAnswers, advancedAnswers: QuizAnswers) {
  const introTypes = toStringArray(introAnswers.exerciseTypes);
  const advancedTypes = toStringArray(advancedAnswers.trainingFocus);
  return introTypes.includes("strength") || advancedTypes.includes("strength");
}

function introHasChronicConditions(introAnswers: QuizAnswers) {
  const conditions = toStringArray(introAnswers.chronicConditions);
  return conditions.length > 0 && !conditions.includes("none");
}

function introHasPoorSleep(introAnswers: QuizAnswers) {
  const sleepQuality = toStringValue(introAnswers.sleepQuality);
  const sleepHours = toNumberValue(introAnswers.sleepHours);

  if (sleepQuality === "poor" || sleepQuality === "fair") {
    return true;
  }

  if (sleepHours !== null && (sleepHours < 7 || sleepHours > 9)) {
    return true;
  }

  return false;
}

function introSex(introAnswers: QuizAnswers) {
  const sex = toStringValue(introAnswers.sex);
  return sex === "female" ? "female" : "male";
}

const maleBodyFatVisualOptions: QuizOption[] = [
  {
    value: "male-8-10",
    label: "8-10%",
    icon: "🏋️",
    description: "Very lean with clear abdominal definition and vascularity."
  },
  {
    value: "male-12-15",
    label: "12-15%",
    icon: "💪",
    description: "Athletic, visible definition, strong waist-to-shoulder contrast."
  },
  {
    value: "male-18-20",
    label: "18-20%",
    icon: "🧍",
    description: "Average fitness build with softer abdominal definition."
  },
  {
    value: "male-25-plus",
    label: "25%+",
    icon: "📈",
    description: "Higher body fat distribution around abdomen and trunk."
  }
];

const femaleBodyFatVisualOptions: QuizOption[] = [
  {
    value: "female-15-18",
    label: "15-18%",
    icon: "🏋️",
    description: "Very lean athletic physique with high definition."
  },
  {
    value: "female-20-25",
    label: "20-25%",
    icon: "💪",
    description: "Fit and athletic with moderate definition."
  },
  {
    value: "female-28-32",
    label: "28-32%",
    icon: "🧍",
    description: "Average healthy range with softer contours."
  },
  {
    value: "female-35-plus",
    label: "35%+",
    icon: "📈",
    description: "Higher fat mass distribution across hips, trunk, and limbs."
  }
];

const advancedQuestionBank: AdvancedQuestion[] = [
  {
    id: "trainingFocus",
    type: "icon-select",
    multiple: true,
    title: "What does your training currently emphasize?",
    description: "Only shown because you reported regular exercise.",
    options: [
      { value: "strength", label: "Strength", icon: "💪" },
      { value: "zone2", label: "Zone 2", icon: "🫀" },
      { value: "hypertrophy", label: "Muscle gain", icon: "🏋️" },
      { value: "conditioning", label: "Conditioning", icon: "🏃" },
      { value: "mobility", label: "Mobility", icon: "🧘" }
    ],
    when: (introAnswers) => introExercises(introAnswers)
  },
  {
    id: "weeklyTrainingDays",
    type: "single-select",
    title: "How many days per week do you train intentionally?",
    options: [
      { value: "2-3", label: "2-3 days" },
      { value: "4-5", label: "4-5 days" },
      { value: "6+", label: "6+ days" }
    ],
    when: (introAnswers) => introExercises(introAnswers)
  },
  {
    id: "strengthTrainingSplit",
    type: "single-select",
    title: "What strength training split do you use?",
    options: [
      { value: "full-body", label: "Full body" },
      { value: "upper-lower", label: "Upper/Lower" },
      { value: "push-pull-legs", label: "Push/Pull/Legs" },
      { value: "body-part", label: "Body-part split" },
      { value: "none", label: "No consistent split" }
    ],
    when: (introAnswers, advancedAnswers) => introStrengthFocused(introAnswers, advancedAnswers)
  },
  {
    id: "yearsStrengthTraining",
    type: "single-select",
    title: "How many years have you trained with weights?",
    options: [
      { value: "lt1", label: "<1 year" },
      { value: "1-3", label: "1-3 years" },
      { value: "4-7", label: "4-7 years" },
      { value: "8+", label: "8+ years" }
    ],
    when: (introAnswers, advancedAnswers) => introStrengthFocused(introAnswers, advancedAnswers)
  },
  {
    id: "progressiveOverload",
    type: "single-select",
    title: "Do you track progressive overload (load, reps, or volume)?",
    options: [
      { value: "yes-systematic", label: "Yes, systematically" },
      { value: "sometimes", label: "Sometimes" },
      { value: "no", label: "No" }
    ],
    when: (introAnswers, advancedAnswers) => introStrengthFocused(introAnswers, advancedAnswers)
  },
  {
    id: "liftsTracked",
    type: "multi-select",
    title: "Which key lifts can you estimate today?",
    description: "We use your best set weight and reps to estimate 1RM.",
    options: [
      { value: "none", label: "None yet", exclusive: true },
      { value: "squat", label: "Back squat" },
      { value: "bench", label: "Bench press" },
      { value: "deadlift", label: "Deadlift" }
    ],
    when: (introAnswers, advancedAnswers) => introStrengthFocused(introAnswers, advancedAnswers)
  },
  {
    id: "squatPerformance",
    type: "number-input",
    title: "Back squat best working set",
    fields: [
      { key: "weightKg", label: "Weight", min: 20, max: 350, step: 1, unit: "kg" },
      { key: "reps", label: "Reps", min: 1, max: 20, step: 1 }
    ],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.liftsTracked).includes("squat")
  },
  {
    id: "benchPerformance",
    type: "number-input",
    title: "Bench press best working set",
    fields: [
      { key: "weightKg", label: "Weight", min: 20, max: 250, step: 1, unit: "kg" },
      { key: "reps", label: "Reps", min: 1, max: 20, step: 1 }
    ],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.liftsTracked).includes("bench")
  },
  {
    id: "deadliftPerformance",
    type: "number-input",
    title: "Deadlift best working set",
    fields: [
      { key: "weightKg", label: "Weight", min: 20, max: 400, step: 1, unit: "kg" },
      { key: "reps", label: "Reps", min: 1, max: 20, step: 1 }
    ],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.liftsTracked).includes("deadlift")
  },
  {
    id: "conditionFollowup",
    type: "text-input",
    multiline: true,
    title: "Condition-specific follow-up",
    description: "Share key diagnosis dates, medications, and current control status.",
    placeholder: "Example: Prediabetes diagnosed 2023, HbA1c trend, current meds, home BP averages...",
    when: (introAnswers) => introHasChronicConditions(introAnswers)
  },
  {
    id: "conditionAdherence",
    type: "single-select",
    title: "How consistent are you with your condition management plan?",
    options: [
      { value: "high", label: "Highly consistent" },
      { value: "moderate", label: "Moderately consistent" },
      { value: "low", label: "Low consistency" }
    ],
    when: (introAnswers) => introHasChronicConditions(introAnswers)
  },
  {
    id: "sleepCaffeineTiming",
    type: "single-select",
    title: "When is your last caffeine intake?",
    options: [
      { value: "before-noon", label: "Before noon" },
      { value: "early-afternoon", label: "Early afternoon" },
      { value: "late-afternoon-evening", label: "Late afternoon/evening" }
    ],
    when: (introAnswers) => introHasPoorSleep(introAnswers)
  },
  {
    id: "sleepScreenTiming",
    type: "single-select",
    title: "How close to bedtime are you on bright screens?",
    options: [
      { value: "none", label: "No screens in final hour" },
      { value: "lt30", label: "Within 30 minutes" },
      { value: "30-60", label: "30-60 minutes before bed" },
      { value: "60plus", label: "More than 60 minutes before bed" }
    ],
    when: (introAnswers) => introHasPoorSleep(introAnswers)
  },
  {
    id: "sleepRoomTemp",
    type: "single-select",
    title: "What is your typical bedroom temperature?",
    options: [
      { value: "cool-16-19", label: "16-19C / 61-67F" },
      { value: "moderate-20-22", label: "20-22C / 68-72F" },
      { value: "warm-23plus", label: "23C+ / 73F+" },
      { value: "unknown", label: "Not sure" }
    ],
    when: (introAnswers) => introHasPoorSleep(introAnswers)
  },
  {
    id: "dexaScan",
    type: "single-select",
    title: "Have you ever had a DEXA scan?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "bodyFatPct",
    type: "number-input",
    title: "What is your most recent body fat percentage?",
    fields: [{ key: "bodyFatPct", label: "Body fat", min: 4, max: 60, step: 0.1, unit: "%" }],
    when: (_, advancedAnswers) => toStringValue(advancedAnswers.dexaScan) === "yes"
  },
  {
    id: "bodyFatVisual",
    type: "gallery-select",
    title: "Pick the body fat visual range closest to your current build",
    description: "Reference ranges used when DEXA is unavailable.",
    options: maleBodyFatVisualOptions,
    when: (_, advancedAnswers) => toStringValue(advancedAnswers.dexaScan) === "no"
  },
  {
    id: "biomarkersTracked",
    type: "multi-select",
    title: "Which biomarkers do you actively track?",
    options: [
      { value: "none", label: "None", exclusive: true },
      { value: "hba1c", label: "HbA1c" },
      { value: "lipids", label: "Lipid panel" },
      { value: "hscrp", label: "hsCRP" },
      { value: "sex-hormones", label: "Testosterone/Estrogen" },
      { value: "thyroid", label: "Thyroid" }
    ]
  },
  {
    id: "hba1cValue",
    type: "number-input",
    title: "Most recent HbA1c",
    fields: [{ key: "hba1c", label: "HbA1c", min: 3.5, max: 14, step: 0.1, unit: "%" }],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.biomarkersTracked).includes("hba1c")
  },
  {
    id: "lipidValues",
    type: "number-input",
    title: "Most recent lipid values",
    fields: [
      { key: "ldl", label: "LDL-C", min: 30, max: 320, step: 1, unit: "mg/dL" },
      { key: "hdl", label: "HDL-C", min: 15, max: 140, step: 1, unit: "mg/dL" },
      { key: "triglycerides", label: "Triglycerides", min: 20, max: 600, step: 1, unit: "mg/dL" }
    ],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.biomarkersTracked).includes("lipids")
  },
  {
    id: "hscrpValue",
    type: "number-input",
    title: "Most recent hsCRP",
    fields: [{ key: "hscrp", label: "hsCRP", min: 0.1, max: 20, step: 0.1, unit: "mg/L" }],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.biomarkersTracked).includes("hscrp")
  },
  {
    id: "thyroidValue",
    type: "number-input",
    title: "Most recent TSH",
    fields: [{ key: "tsh", label: "TSH", min: 0.1, max: 15, step: 0.1, unit: "mIU/L" }],
    when: (_, advancedAnswers) => toStringArray(advancedAnswers.biomarkersTracked).includes("thyroid")
  },
  {
    id: "hormoneValues",
    type: "text-input",
    optional: true,
    multiline: true,
    title: "Sex hormone values (if known)",
    placeholder: "Add testosterone/estradiol values with units and test dates.",
    when: (_, advancedAnswers) =>
      toStringArray(advancedAnswers.biomarkersTracked).includes("sex-hormones")
  },
  {
    id: "advancedNotes",
    type: "text-input",
    optional: true,
    multiline: true,
    maxLength: 900,
    title: "Anything else that should influence your advanced assessment?",
    placeholder: "Injuries, medications, lab goals, performance goals, sleep disorders, shift work, etc."
  }
];

export function getAdvancedQuestions(introAnswers: QuizAnswers, advancedAnswers: QuizAnswers): QuizQuestion[] {
  const sex = introSex(introAnswers);

  return advancedQuestionBank
    .filter((question) => (question.when ? question.when(introAnswers, advancedAnswers) : true))
    .map((question) => {
      if (question.id !== "bodyFatVisual") {
        return question;
      }

      return {
        ...question,
        options: sex === "female" ? femaleBodyFatVisualOptions : maleBodyFatVisualOptions
      };
    });
}
