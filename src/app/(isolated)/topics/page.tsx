import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JourneyCards } from "@/components/journeys/JourneyCards";
export const metadata: Metadata = {
  title: "Start With Your Question: Testosterone Decision Guides",
  description: "Choose energy and testing, fertility questions, needle-free options, or clinic costs. Get focused education and a free, private appointment brief.",
  alternates: { canonical: "/topics" }, referrer: "no-referrer",
  openGraph: { title: "Start with the question on your mind", description: "Four short guides. One useful next step. Education, not a diagnosis.", url: "https://shotfreetrt.com/topics", images: [{ url: "/og-shotfreetrt.png", width: 1024, height: 1024 }] },
};
export default function TopicsPage() {
  return <div className="space-y-10">
    <section className="max-w-3xl space-y-5"><p className="text-sm font-semibold uppercase tracking-widest text-primary">A clearer place to start</p><h1 className="font-[family-name:var(--font-barlow-condensed)] text-5xl font-extrabold leading-tight sm:text-6xl">What is on your mind?</h1><p className="text-lg leading-relaxed text-muted-foreground">You do not need to read the whole library. Pick the question that matters today, see the important distinctions, and build a brief for your next conversation.</p><p className="text-sm text-muted-foreground">These are decision concerns—not diagnoses. Choosing a path does not tell us that you have a condition or prefill an answer.</p></section>
    <JourneyCards />
    <section className="rounded-xl border bg-card p-6 sm:p-8"><h2 className="text-2xl font-bold">Not sure where to start?</h2><p className="mb-5 mt-3 text-muted-foreground">The general quiz covers all six decision questions. No account, credit card or bloodwork upload.</p><Button asChild className="h-auto min-h-11 whitespace-normal"><Link href="/quiz/healthspan" prefetch={false}>Build my free decision brief</Link></Button></section>
  </div>;
}
