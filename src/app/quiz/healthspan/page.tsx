import type { Metadata } from "next";

import { QuizEngine } from "@/components/quiz/QuizEngine";

export const metadata: Metadata = {
  title: "What's Your Healthspan Score?",
  description:
    "Take the ShotFreeTRT healthspan quiz to estimate your projected healthspan and lifespan, identify your top risk factors, and get personalized longevity recommendations.",
  alternates: {
    canonical: "/quiz/healthspan"
  }
};

export default function HealthspanQuizPage() {
  return (
    <>
      <section className="hero">
        <h1>What&apos;s Your Healthspan Score?</h1>
        <p>
          Answer evidence-based questions on sleep, training, nutrition, stress, biomarkers, and preventive care.
          Get your projected healthspan, grade, and a prioritized action plan, then unlock the Advanced Assessment.
        </p>
      </section>

      <QuizEngine />
    </>
  );
}
