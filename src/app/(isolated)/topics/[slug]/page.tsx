import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditorialImageFrame } from "@/components/EditorialImageFrame";
import { getJourney, journeys, journeySources, JOURNEY_UPDATED_AT, quizPath } from "@/lib/journeys";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return journeys.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const journey = getJourney((await params).slug); if (!journey) return {};
  return { title: `${journey.label}: Build Your Decision Brief`, description: journey.description, alternates: { canonical: `/topics/${journey.slug}` }, referrer: "no-referrer", openGraph: { type: "website", title: journey.title, description: journey.description, url: `https://shotfreetrt.com/topics/${journey.slug}`, images: [{ url: journey.image, width: 960, height: 640 }] } };
}
export default async function TopicPage({ params }: Props) {
  const journey = getJourney((await params).slug); if (!journey) notFound();
  const href = quizPath(journey);
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", name: journey.title, description: journey.description, url: `https://shotfreetrt.com/topics/${journey.slug}`, dateModified: JOURNEY_UPDATED_AT },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Topics", item: "https://shotfreetrt.com/topics" }, { "@type": "ListItem", position: 2, name: journey.label, item: `https://shotfreetrt.com/topics/${journey.slug}` }] },
  ] };
  return <div className="space-y-10 pb-24 md:pb-0">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link href="/topics" prefetch={false}>All topics</Link><span aria-hidden="true"> / </span><span aria-current="page">{journey.label}</span></nav>
    <section className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-5"><p className="text-sm font-semibold uppercase tracking-widest text-primary">{journey.label} · A free decision companion</p><h1 className="font-[family-name:var(--font-barlow-condensed)] text-4xl font-extrabold leading-tight sm:text-6xl">{journey.title}</h1><p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{journey.description}</p><Button asChild size="lg" className="h-auto min-h-12 whitespace-normal text-left"><Link href={href} prefetch={false}>Build my free decision brief <ArrowRight className="size-4 shrink-0" aria-hidden="true" /></Link></Button><p className="text-sm text-muted-foreground">6 questions · No account · No payment · No diagnosis</p></div>
      <Card className="overflow-hidden"><EditorialImageFrame src={journey.image} width={960} height={640} sizes="(min-width:1024px) 440px, 90vw" priority /><CardHeader><p className="text-xs font-semibold uppercase tracking-widest text-primary">What you leave with</p><CardTitle className="text-2xl">Less guessing. Better questions.</CardTitle></CardHeader><CardContent><ul className="space-y-3">{journey.preview.map((item) => <li key={item} className="flex gap-3 text-sm"><Check className="size-5 shrink-0 text-primary" aria-hidden="true" /><span>{item}</span></li>)}</ul></CardContent></Card>
    </section>
    <section aria-labelledby="key-distinctions"><h2 id="key-distinctions" className="text-2xl font-bold sm:text-3xl">Three things worth understanding first</h2><div className="mt-5 grid gap-5 md:grid-cols-3">{journey.lessons.map((lesson, index) => <Card key={lesson.title}><CardHeader><span className="text-sm font-semibold text-primary">0{index + 1}</span><CardTitle className="text-xl">{lesson.title}</CardTitle></CardHeader><CardContent><p className="text-sm leading-relaxed text-muted-foreground">{lesson.text}</p>{lesson.source && <a href={journeySources[lesson.source].url} rel="noreferrer" className="mt-4 inline-block text-sm underline">{journeySources[lesson.source].name}</a>}</CardContent></Card>)}</div></section>
    <section className="rounded-xl border border-primary/30 bg-card p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Start with one useful question</p><h2 className="mt-3 max-w-3xl text-2xl font-bold leading-snug">“{journey.firstQuestion}”</h2><p className="mb-5 mt-4 max-w-3xl text-muted-foreground">The quiz starts with this topic, then covers the other decision questions. It changes the order—not your answers. Your brief is built from what you actually select.</p><Button asChild className="h-auto min-h-11 whitespace-normal"><Link href={href} prefetch={false}>Organize my questions</Link></Button></section>
    <section aria-labelledby="common-questions" className="space-y-4"><h2 id="common-questions" className="text-2xl font-bold">Before you start</h2>{journey.faqs.map((faq) => <Card key={faq.question}><CardHeader><CardTitle className="text-lg">{faq.question}</CardTitle></CardHeader><CardContent><p className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>{faq.source && <a className="mt-3 inline-block text-sm underline" href={journeySources[faq.source].url} rel="noreferrer">Read the source</a>}</CardContent></Card>)}</section>
    <p className="text-xs leading-relaxed text-muted-foreground">Editorial education updated {JOURNEY_UPDATED_AT}. Referenced sources checked on that date; no individual clinical review is provided. Do not start, stop or change prescribed treatment based on this page. These topic and quiz pages do not load our marketing analytics. Hosting logs can still record visited URLs; quiz answers remain in page memory. This is not an urgent-care service.</p>
    <aside aria-label="Start the free quiz" className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden print:hidden"><Button asChild size="lg" className="w-full"><Link href={href} prefetch={false}>Get my free decision brief <ArrowRight className="size-4" aria-hidden="true" /></Link></Button></aside>
  </div>;
}
