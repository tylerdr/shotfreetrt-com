import type { Metadata } from "next";
import { DecisionQuizEngine } from "@/components/quiz/DecisionQuizEngine";
export const metadata: Metadata = {
  title: "TRT Decision Quiz: Get Your Personalized Decision Brief",
  description: "Six questions about your priorities, testing stage and costs. Get an appointment checklist and reading list. No lab values, diagnosis or treatment score.",
  alternates: { canonical: "/quiz/healthspan" }, referrer: "no-referrer",
};
export default function DecisionQuizPage() {
  return <div className="mx-auto max-w-3xl space-y-6"><section className="space-y-3"><p className="text-sm font-semibold uppercase tracking-widest text-primary">Free · 6 questions · No account</p><h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Get your TRT Decision Brief.</h1><p className="max-w-2xl text-lg text-muted-foreground">Organize your priorities, testing stage and cost questions. Leave with a printable checklist—not a diagnosis or a treatment recommendation.</p></section><DecisionQuizEngine /></div>;
}
