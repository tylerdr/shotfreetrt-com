import type { Metadata } from "next";

import { AdvancedQuizEngine } from "@/components/quiz/AdvancedQuizEngine";

export const metadata: Metadata = {
  title: "Advanced TRT Assessment",
  description:
    "Go deeper with lab-aware TRT assessment logic: total/free T, LH/FSH, prolactin, TSH, HbA1c, hematocrit, PSA, fertility context, and sleep-apnea follow-up.",
  alternates: {
    canonical: "/quiz/healthspan/advanced"
  }
};

export default function AdvancedHealthspanQuizPage() {
  return (
    <>
      <section className="hero">
        <h1>Advanced TRT Assessment</h1>
        <p>
          This version uses your intro answers, then layers in labs, fertility context, and root-cause
          workup signals so the result can better separate lifestyle-first, SERM, oral/topical TRT, and
          “you need a better workup first.”
        </p>
      </section>

      <AdvancedQuizEngine />
    </>
  );
}
