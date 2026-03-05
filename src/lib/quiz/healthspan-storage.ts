import type { HealthspanResult, QuizAnswers } from "@/lib/quiz/healthspan-types";

export const INTRO_ANSWERS_STORAGE_KEY = "healthspan:intro-answers";
export const ADVANCED_ANSWERS_STORAGE_KEY = "healthspan:advanced-answers";
export const LAST_RESULT_STORAGE_KEY = "healthspan:last-result";

export function readStoredAnswers(key: string): QuizAnswers | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    return parsed as QuizAnswers;
  } catch {
    return null;
  }
}

export function writeStoredAnswers(key: string, answers: QuizAnswers) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(answers));
  } catch {
    // Ignore storage write failures.
  }
}

export function writeStoredResult(result: HealthspanResult) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(LAST_RESULT_STORAGE_KEY, JSON.stringify(result));
  } catch {
    // Ignore storage write failures.
  }
}
