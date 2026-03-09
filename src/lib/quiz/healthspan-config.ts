import type { QuizAnswerValue } from "@/lib/quiz/healthspan-types";

export type QuizCitation = {
  source: string;
  href?: string;
};

export type QuizOption = {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  exclusive?: boolean;
};

export type NumberInputField = {
  key: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  placeholder?: string;
};

type BaseQuestion = {
  id: string;
  title: string;
  description?: string;
  citations?: QuizCitation[];
  optional?: boolean;
};

export type SingleSelectQuestion = BaseQuestion & {
  type: "single-select";
  options: QuizOption[];
};

export type MultiSelectQuestion = BaseQuestion & {
  type: "multi-select";
  options: QuizOption[];
};

export type IconSelectQuestion = BaseQuestion & {
  type: "icon-select";
  options: QuizOption[];
  multiple?: boolean;
};

export type GallerySelectQuestion = BaseQuestion & {
  type: "gallery-select";
  options: QuizOption[];
  multiple?: boolean;
};

export type SliderQuestion = BaseQuestion & {
  type: "slider";
  min: number;
  max: number;
  step: number;
  unit?: string;
  minLabel?: string;
  maxLabel?: string;
};

export type NumberInputQuestion = BaseQuestion & {
  type: "number-input";
  fields: NumberInputField[];
};

export type TextInputQuestion = BaseQuestion & {
  type: "text-input";
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
};

export type QuizQuestion =
  | SingleSelectQuestion
  | MultiSelectQuestion
  | IconSelectQuestion
  | GallerySelectQuestion
  | SliderQuestion
  | NumberInputQuestion
  | TextInputQuestion;

export const healthspanQuizQuestions: QuizQuestion[] = [
  {
    id: "age",
    type: "number-input",
    title: "How old are you?",
    description: "This quiz is built for adult men evaluating low-T symptoms, lifestyle drag, and treatment fit.",
    fields: [
      {
        key: "age",
        label: "Age",
        min: 18,
        max: 80,
        step: 1,
        unit: "years",
        placeholder: "e.g. 38"
      }
    ]
  },
  {
    id: "sex",
    type: "single-select",
    title: "What sex were you assigned at birth?",
    description: "We use this because TRT / SERM decision rules and reference ranges differ by sex.",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" }
    ]
  },
  {
    id: "goals",
    type: "multi-select",
    title: "What do you most want to improve?",
    options: [
      { value: "energy", label: "Energy and motivation" },
      { value: "libido", label: "Libido / sexual function" },
      { value: "muscle", label: "Muscle / gym performance" },
      { value: "fat-loss", label: "Body composition / fat loss" },
      { value: "focus", label: "Focus / mental clarity" },
      { value: "mood", label: "Mood / resilience" },
      { value: "fertility", label: "Preserve fertility while improving symptoms" }
    ]
  },
  {
    id: "symptoms",
    type: "multi-select",
    title: "Which low-testosterone symptoms actually apply right now?",
    citations: [
      {
        source: "AUA Testosterone Deficiency Guideline (2024)",
        href: "https://www.auanet.org/guidelines-and-quality/guidelines/testosterone-deficiency-guideline"
      }
    ],
    options: [
      { value: "none", label: "None of these", exclusive: true },
      { value: "low-libido", label: "Lower libido" },
      { value: "erection-quality", label: "Weaker erection quality" },
      { value: "fatigue", label: "Low energy / fatigue" },
      { value: "brain-fog", label: "Brain fog / poor focus" },
      { value: "strength-loss", label: "Harder to gain or keep muscle" },
      { value: "fat-gain", label: "More belly fat / worse body composition" },
      { value: "low-mood", label: "Low mood / irritability" },
      { value: "poor-recovery", label: "Poor workout recovery" }
    ]
  },
  {
    id: "symptomDuration",
    type: "single-select",
    title: "How long have these issues been going on?",
    options: [
      { value: "lt3m", label: "Less than 3 months" },
      { value: "3-6m", label: "3-6 months" },
      { value: "6-12m", label: "6-12 months" },
      { value: "12m-plus", label: "More than a year" }
    ]
  },
  {
    id: "priorLabs",
    type: "single-select",
    title: "What do you know about your testosterone labs?",
    description: "Guidelines support diagnosing testosterone deficiency only when low testosterone is paired with symptoms, ideally confirmed with repeat early-morning testing.",
    citations: [
      {
        source: "AUA Testosterone Deficiency Guideline (2024)",
        href: "https://www.auanet.org/guidelines-and-quality/guidelines/testosterone-deficiency-guideline"
      }
    ],
    options: [
      { value: "never-tested", label: "Never tested" },
      { value: "borderline", label: "Borderline / low-normal" },
      { value: "low-once", label: "Low once" },
      { value: "low-twice", label: "Low on 2 early-morning tests" },
      { value: "normal-not-explained", label: "Normal, but I still feel off" }
    ]
  },
  {
    id: "fertilityGoal",
    type: "single-select",
    title: "Do you want to preserve fertility in the next 12-24 months?",
    description: "This is one of the biggest branching questions in online TRT funnels.",
    citations: [
      {
        source: "AUA Testosterone Deficiency Guideline (2024) — fertility counseling before treatment",
        href: "https://www.auanet.org/guidelines-and-quality/guidelines/testosterone-deficiency-guideline"
      }
    ],
    options: [
      { value: "yes", label: "Yes" },
      { value: "unsure", label: "Not sure / maybe" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "previousTherapies",
    type: "multi-select",
    title: "What have you already tried?",
    options: [
      { value: "none", label: "Nothing specific yet", exclusive: true },
      { value: "supplements", label: "OTC supplements / vitamins" },
      { value: "lifestyle", label: "Sleep, lifting, diet, stress work" },
      { value: "serm", label: "Clomid / enclomiphene / other SERM" },
      { value: "oral-t", label: "Oral testosterone" },
      { value: "topical-t", label: "Topical gel / cream" },
      { value: "injectable-t", label: "Injectable TRT" }
    ]
  },
  {
    id: "bodyMetrics",
    type: "number-input",
    title: "What are your height and weight?",
    description: "Obesity and waist-driven insulin resistance are strongly linked with lower testosterone in men.",
    citations: [
      {
        source: "Lowered testosterone in male obesity: mechanisms, morbidity and management",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3955331/"
      }
    ],
    fields: [
      {
        key: "heightCm",
        label: "Height",
        min: 120,
        max: 230,
        step: 1,
        unit: "cm",
        placeholder: "e.g. 178"
      },
      {
        key: "weightKg",
        label: "Weight",
        min: 35,
        max: 250,
        step: 0.1,
        unit: "kg",
        placeholder: "e.g. 84"
      }
    ]
  },
  {
    id: "waistSize",
    type: "single-select",
    title: "How would you describe your waist / belly fat right now?",
    description: "Waist-driven visceral fat is usually more relevant than scale weight alone when thinking about testosterone drag.",
    options: [
      { value: "lean", label: "Lean / flat waist" },
      { value: "slight", label: "A little extra around the middle" },
      { value: "noticeable", label: "Noticeable belly fat" },
      { value: "central-obesity", label: "Most of my weight sits at the waist" }
    ]
  },
  {
    id: "sleepHours",
    type: "slider",
    title: "How many hours do you usually sleep per night?",
    min: 3,
    max: 10,
    step: 0.5,
    unit: "hours",
    minLabel: "3h",
    maxLabel: "10h"
  },
  {
    id: "sleepQuality",
    type: "gallery-select",
    title: "How would you rate your sleep quality?",
    options: [
      { value: "poor", label: "Poor", icon: "😵", description: "Wake up tired, broken sleep, not restorative." },
      { value: "fair", label: "Fair", icon: "😐", description: "Inconsistent. Some good nights, some bad ones." },
      { value: "good", label: "Good", icon: "🙂", description: "Mostly restorative with occasional bad nights." },
      { value: "excellent", label: "Excellent", icon: "😴", description: "Consistently deep, restorative sleep." }
    ]
  },
  {
    id: "snoringOrApnea",
    type: "single-select",
    title: "How much sleep-apnea risk is in the picture?",
    description: "Untreated sleep apnea can mimic or worsen low-T symptoms and matters before TRT decisions.",
    options: [
      { value: "none", label: "No snoring / no concern" },
      { value: "snore", label: "I snore a lot" },
      { value: "suspected-apnea", label: "Possible apnea / wake gasping / daytime sleepiness" },
      { value: "treated-apnea", label: "Diagnosed but treated" },
      { value: "untreated-apnea", label: "Diagnosed and not treated" }
    ]
  },
  {
    id: "stressLevel",
    type: "gallery-select",
    title: "What is your baseline stress load?",
    options: [
      { value: "low", label: "Low", icon: "😌", description: "Mostly steady, stress spikes are brief." },
      { value: "moderate", label: "Moderate", icon: "🙂", description: "Manageable, but not always easy." },
      { value: "high", label: "High", icon: "😟", description: "Feels elevated most days." },
      { value: "very-high", label: "Very high", icon: "😰", description: "Hard to recover and always on." }
    ]
  },
  {
    id: "liftingFrequency",
    type: "single-select",
    title: "How often do you lift or resistance train each week?",
    options: [
      { value: "none", label: "0 times" },
      { value: "1", label: "1 time" },
      { value: "2-3", label: "2-3 times" },
      { value: "4-plus", label: "4+ times" }
    ]
  },
  {
    id: "stepsActivity",
    type: "single-select",
    title: "How active are you outside the gym?",
    options: [
      { value: "desk-mostly", label: "Desk-bound / mostly sedentary" },
      { value: "some-walking", label: "Some walking, but inconsistent" },
      { value: "8k-plus", label: "Usually 8k+ steps / active daily" },
      { value: "very-active", label: "Very active job / lifestyle" }
    ]
  },
  {
    id: "dietQuality",
    type: "single-select",
    title: "How dialed-in is your diet for testosterone and body composition?",
    options: [
      { value: "poor", label: "Not dialed in" },
      { value: "mixed", label: "Mixed / inconsistent" },
      { value: "good", label: "Pretty solid most days" },
      { value: "excellent", label: "High-protein, mostly whole-food, consistent" }
    ]
  },
  {
    id: "alcoholUse",
    type: "single-select",
    title: "What does alcohol look like in a normal week?",
    options: [
      { value: "none", label: "None" },
      { value: "light", label: "1-3 drinks/week" },
      { value: "moderate", label: "4-7 drinks/week" },
      { value: "heavy", label: "8+ drinks/week or binges" }
    ]
  },
  {
    id: "nicotineStatus",
    type: "single-select",
    title: "Nicotine status?",
    options: [
      { value: "never", label: "Never" },
      { value: "former", label: "Former" },
      { value: "current", label: "Current" }
    ]
  },
  {
    id: "medications",
    type: "multi-select",
    title: "Any medication or exposure buckets worth flagging?",
    options: [
      { value: "none", label: "None", exclusive: true },
      { value: "opioids", label: "Chronic opioids" },
      { value: "finasteride", label: "Finasteride / dutasteride" },
      { value: "ssri", label: "SSRI / antidepressant" },
      { value: "steroids", label: "Recent anabolic steroid use" },
      { value: "corticosteroids", label: "Chronic corticosteroids" },
      { value: "other", label: "Other / unsure" }
    ]
  },
  {
    id: "conditions",
    type: "multi-select",
    title: "Which health issues are part of the picture?",
    options: [
      { value: "none", label: "None", exclusive: true },
      { value: "prediabetes", label: "Prediabetes / insulin resistance" },
      { value: "diabetes", label: "Type 2 diabetes" },
      { value: "hypertension", label: "High blood pressure" },
      { value: "thyroid", label: "Known thyroid issue" },
      { value: "infertility-history", label: "History of infertility" },
      { value: "pituitary", label: "Pituitary / endocrine issue" },
      { value: "other", label: "Other" }
    ]
  },
  {
    id: "routePreference",
    type: "icon-select",
    title: "If medication becomes part of the plan, what route feels closest to your preference?",
    options: [
      { value: "lifestyle-first", label: "Lifestyle first", icon: "🛠️" },
      { value: "fertility-oral", label: "Fertility-preserving oral route", icon: "🌱" },
      { value: "oral-t", label: "Oral testosterone", icon: "💊" },
      { value: "topical-t", label: "Topical cream / gel", icon: "🧴" },
      { value: "unsure", label: "Not sure yet", icon: "🤔" }
    ]
  },
  {
    id: "additionalNotes",
    type: "text-input",
    optional: true,
    multiline: true,
    maxLength: 900,
    title: "Anything else we should factor in? (optional)",
    placeholder: "Examples: fertility timeline, exact symptoms, recent labs, previous response to enclomiphene/TRT, shift work, apnea history, etc."
  }
];

export function getInitialQuestionValue(question: QuizQuestion): QuizAnswerValue | undefined {
  if (question.type === "slider") {
    return undefined;
  }

  if (question.type === "single-select") {
    return "";
  }

  if (question.type === "multi-select") {
    return [];
  }

  if (question.type === "icon-select") {
    return question.multiple ? [] : "";
  }

  if (question.type === "gallery-select") {
    return question.multiple ? [] : "";
  }

  if (question.type === "text-input") {
    return "";
  }

  if (question.fields.length === 1) {
    return "";
  }

  return question.fields.reduce<Record<string, number | "">>((accumulator, field) => {
    accumulator[field.key] = "";
    return accumulator;
  }, {});
}

export function isQuestionAnswered(question: QuizQuestion, value: QuizAnswerValue | undefined) {
  if (question.type === "single-select") {
    return typeof value === "string" && value.trim().length > 0;
  }

  if (question.type === "multi-select") {
    return Array.isArray(value) && value.length > 0;
  }

  if (question.type === "icon-select") {
    if (question.multiple) {
      return Array.isArray(value) && value.length > 0;
    }

    return typeof value === "string" && value.trim().length > 0;
  }

  if (question.type === "gallery-select") {
    if (question.multiple) {
      return Array.isArray(value) && value.length > 0;
    }

    return typeof value === "string" && value.trim().length > 0;
  }

  if (question.type === "slider") {
    return typeof value === "number";
  }

  if (question.type === "text-input") {
    if (question.optional) {
      return true;
    }

    return typeof value === "string" && value.trim().length > 0;
  }

  if (question.fields.length === 1) {
    return typeof value === "number" && Number.isFinite(value);
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return question.fields.every((field) => {
    const fieldValue = value[field.key];
    return typeof fieldValue === "number" && Number.isFinite(fieldValue);
  });
}
