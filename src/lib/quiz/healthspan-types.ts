export type QuizMode = "serious" | "roast";

export type QuizGrade = "A+" | "A" | "B" | "C" | "D" | "F";

export type QuizObjectValue = Record<string, number | string | "">;

export type QuizAnswerValue = string | number | string[] | QuizObjectValue;

export type QuizAnswers = Record<string, QuizAnswerValue>;

export type HealthspanAssessmentType = "intro" | "advanced";

export type HealthspanRecommendation = {
  title: string;
  action: string;
  yearsGained: number;
};

export type HealthspanResult = {
  score: number;
  projectedHealthspan: number;
  projectedLifespan: number;
  grade: QuizGrade;
  summary: string;
  helpingFactors: string[];
  hurtingFactors: string[];
  recommendations: HealthspanRecommendation[];
  mode: QuizMode;
};

export type HealthspanSharePayload = {
  v: 1;
  result: HealthspanResult;
};
