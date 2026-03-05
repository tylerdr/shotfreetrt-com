import type { Metadata } from "next";

import { AdvancedQuizEngine } from "@/components/quiz/AdvancedQuizEngine";

export const metadata: Metadata = {
  title: "Advanced Healthspan Assessment",
  description:
    "Take the advanced ShotFreeTRT assessment with dynamic branching, body composition refinement, biomarker tracking, and training-specific analysis.",
  alternates: {
    canonical: "/quiz/healthspan/advanced"
  }
};

export default function AdvancedHealthspanQuizPage() {
  return (
    <>
      <section className="hero">
        <h1>Advanced Healthspan Assessment</h1>
        <p>
          This deeper assessment uses your intro answers, then branches into training detail, body composition,
          biomarkers, and condition-specific follow-up for a higher-resolution plan.
        </p>
      </section>

      <AdvancedQuizEngine />
    </>
  );
}
