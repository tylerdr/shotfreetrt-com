import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DecisionQuizEngine } from "@/components/quiz/DecisionQuizEngine";
import { getJourney, journeys } from "@/lib/journeys";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return journeys.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const journey = getJourney((await params).slug); if (!journey) return {};
  return { title: `${journey.label} Decision Brief`, description: journey.description, robots: { index: false, follow: true }, alternates: { canonical: `/quiz/concern/${journey.slug}` }, referrer: "no-referrer" };
}
export default async function ConcernQuizPage({ params }: Props) {
  const journey = getJourney((await params).slug); if (!journey) notFound();
  return <div className="mx-auto max-w-3xl space-y-6"><section className="space-y-3"><p className="text-sm font-semibold uppercase tracking-widest text-primary">Free · 6 questions · {journey.label}</p><h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Build your decision brief.</h1><p className="text-muted-foreground">Start with your {journey.label.toLowerCase()} questions. No answer is preselected. This prepares a conversation; it does not determine a diagnosis or treatment.</p><Link href={`/topics/${journey.slug}`} prefetch={false} className="inline-block text-sm underline">Read the short explanation first</Link></section><DecisionQuizEngine key={journey.slug} journey={journey} /></div>;
}
