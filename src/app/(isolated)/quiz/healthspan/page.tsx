import type { Metadata } from "next";

import { DecisionQuizEngine } from "@/components/quiz/DecisionQuizEngine";

export const metadata: Metadata = {
  title: "TRT Decision Quiz: Get Your Personalized Decision Brief",
  description:
    "Answer 6 quick questions about your situation, testing stage, fertility priorities, delivery preference, cost clarity, and timing. Get a personalized checklist and reading list. No labs, no diagnosis, no treatment score.",
  alternates: {
    canonical: "/quiz/healthspan"
  }
};

export default function DecisionQuizPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Free · 6 questions · No account
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Get your TRT Decision Brief.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Six quick questions about your situation, not your symptoms or labs.
          The result is a personalized checklist and reading list — not a
          diagnosis, an eligibility score, or a treatment recommendation.
        </p>
      </section>
      <DecisionQuizEngine />
    </div>
  );
}
