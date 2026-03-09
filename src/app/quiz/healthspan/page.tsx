import type { Metadata } from "next";

import { QuizEngine } from "@/components/quiz/QuizEngine";

export const metadata: Metadata = {
  title: "TRT Quiz: Lifestyle, SERM, or Needle-Free TRT?",
  description:
    "Take the ShotFreeTRT quiz to see whether you should focus on lifestyle optimization first, explore a fertility-aware SERM path, or discuss oral/topical TRT with a clinician.",
  alternates: {
    canonical: "/quiz/healthspan"
  }
};

export default function HealthspanQuizPage() {
  return (
    <>
      <section className="hero">
        <h1>Should You Fix Lifestyle First, Consider a SERM, or Discuss TRT?</h1>
        <p>
          This TRT-focused quiz looks at symptoms, fertility goals, sleep, waist-driven metabolic drag,
          training, stress, and lab context. The result is built to recommend lifestyle optimization first
          where it matters — then rank SERM vs oral/topical TRT fit.
        </p>
      </section>

      <QuizEngine />
    </>
  );
}
