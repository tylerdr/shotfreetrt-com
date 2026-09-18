import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, Scale, Wallet } from "lucide-react";
import { EditorialImageFrame } from "@/components/EditorialImageFrame";
import { JourneyCards } from "@/components/journeys/JourneyCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sources } from "@/lib/decision-guide";

export const metadata: Metadata = {
  title: "Needle-Free TRT Options, Costs and Questions to Ask",
  description: "Considering testosterone treatment? Start with your questions about energy, testing, fertility, needle-free options or costs. Build a free, private decision brief for a clinician visit.",
  alternates: { canonical: "/" },
  openGraph: { title: "Considering TRT? Compare the options before you commit.", description: "Start with your question. Leave with a clearer next step. Free guides, a private quiz and a quote worksheet.", url: "https://shotfreetrt.com", images: [{ url: "/og-shotfreetrt.png", width: 1024, height: 1024 }] },
};
const steps = [
  { icon: Scale, title: "Separate the options", text: "Understand the difference between replacement testosterone, medicines that stimulate production, and evaluating other causes." },
  { icon: Wallet, title: "See the cost beyond the headline", text: "Compare billing periods, medicine, labs, visits, upfront fees, and cancellation terms using written quotes." },
  { icon: ClipboardList, title: "Prepare for your appointment", text: "Bring practical questions about testing, fertility, monitoring, and follow-up." },
];
export default function HomePage() {
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": "https://shotfreetrt.com/#organization", name: "ShotFreeTRT", url: "https://shotfreetrt.com", logo: "https://shotfreetrt.com/favicon.png" },
    { "@type": "WebSite", "@id": "https://shotfreetrt.com/#website", name: "ShotFreeTRT", url: "https://shotfreetrt.com", publisher: { "@id": "https://shotfreetrt.com/#organization" } },
  ] };
  return <div className="space-y-14">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="grid items-start gap-8 py-5 lg:grid-cols-[1.3fr_1fr] sm:py-10">
      <div className="space-y-6"><p className="text-sm font-semibold uppercase tracking-widest text-primary">For men comparing testosterone treatment options</p><h1 className="font-[family-name:var(--font-barlow-condensed)] text-5xl font-extrabold leading-none tracking-tight sm:text-7xl">Considering TRT?<br /><span className="text-primary">Compare before<br />you commit.</span></h1><p className="max-w-xl text-lg leading-relaxed text-muted-foreground">You do not need another rabbit hole. Start with the question on your mind, get the important distinctions, and prepare your next conversation.</p><div className="flex flex-wrap gap-3"><Button asChild size="lg" className="h-auto min-h-12 whitespace-normal text-left"><Link href="/topics" prefetch={false}>Start with my question <ArrowRight className="size-4 shrink-0" aria-hidden="true" /></Link></Button><Button asChild size="lg" variant="outline" className="h-auto min-h-12 whitespace-normal"><Link href="/quiz/healthspan" prefetch={false}>Go straight to the free quiz</Link></Button></div><p className="text-sm text-muted-foreground">No account. No lab upload. No treatment score. Education, not medical care.</p></div>
      <Card className="overflow-hidden border-primary/40"><EditorialImageFrame src="/media/sft-web-batch3-01.webp" width={960} height={640} sizes="(min-width: 1024px) 420px, 100vw" priority className="border-b border-border" /><CardHeader><p className="text-xs font-semibold uppercase tracking-widest text-primary">A useful result—not a sales diagnosis</p><CardTitle className="text-2xl">A clearer conversation.<br />A more complete quote.</CardTitle></CardHeader><CardContent className="space-y-5">{steps.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3"><Icon className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" /><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{text}</p></div></div>)}<p className="border-t pt-4 text-sm text-muted-foreground">Use the free brief with a clinician or a clinic you are already considering.</p></CardContent></Card>
    </section>
    <section id="start" className="space-y-5"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Choose one starting point</p><h2 className="text-3xl font-bold">What matters to you today?</h2><p className="max-w-2xl text-muted-foreground">Each path gives you a short explanation and starts the quiz with that topic. No assumptions about your health. No preselected answers.</p><JourneyCards /></section>
    <section className="rounded-xl border bg-card p-6 sm:p-8"><h2 className="text-2xl font-bold">Needle-free is a delivery preference.<br />Not a safety or fertility guarantee.</h2><p className="mt-4 max-w-3xl text-muted-foreground">Testosterone delivered without injections is still replacement testosterone. Plans for children belong in the conversation before treatment; the Endocrine Society recommends against testosterone therapy when planning fertility in the near term.</p><a href={sources.guideline} className="mt-4 inline-block text-sm" rel="noreferrer">Read the Endocrine Society guidance →</a></section>
    <section className="grid gap-5 md:grid-cols-3" aria-label="How the decision companion works">{[
      ["1. Start with your question", "A short explainer separates the important ideas before you answer anything."],
      ["2. Build your brief", "Six questions organize your priorities. The result is useful without an email address."],
      ["3. Take the next step", "Print your questions, compare written quotes, or download a private check-in reminder."],
    ].map(([title, text]) => <Card key={title}><CardHeader><CardTitle className="text-xl">{title}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{text}</p></CardContent></Card>)}</section>
    <section className="rounded-xl border bg-secondary p-6 sm:p-8"><h2 className="text-2xl font-bold">Already have a quote?</h2><p className="mb-5 mt-3 text-muted-foreground">Skip the reading path and compare the numbers. Unknown costs stay unknown—not quietly counted as free.</p><Button asChild size="lg" className="h-auto min-h-12 whitespace-normal"><Link href="/decision-guide" prefetch={false}>Open the free quote worksheet <ArrowRight className="size-4 shrink-0" aria-hidden="true" /></Link></Button></section>
    <div className="space-y-3 border-t pt-6 text-sm text-muted-foreground"><p>ShotFreeTRT publishes education, not prescriptions. Clinical decisions require a licensed clinician. Paid placements, when present, must be labeled; listing a provider is not an endorsement.</p><p><Link href="/about">About this site</Link> · <Link href="/blog">Browse the article library</Link> · <Link href="/for-clinics">Run a clinic? Explore the proposed pilot</Link></p></div>
  </div>;
}
