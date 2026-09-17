import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ClipboardList, Scale, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sources } from "@/lib/decision-guide";

export const metadata: Metadata = {
  title: "Needle-Free TRT Options, Costs and Questions to Ask",
  description: "Considering testosterone treatment but not sure about injections? Understand needle-free options, compare written clinic quotes, and prepare for a clinician visit. Free decision guide.",
  alternates: { canonical: "/" },
  openGraph: { title: "Considering TRT? Compare the options before you commit.", description: "Needle-free does not mean fertility-preserving. Get a free decision guide and clinic-cost worksheet.", url: "https://shotfreetrt.com" },
};

const steps = [
  { icon: Scale, title: "Separate the options", text: "Understand the difference between replacement testosterone, medicines that stimulate production, and evaluating other causes." },
  { icon: Wallet, title: "See the cost beyond the headline", text: "Compare billing periods, medicine, labs, visits, upfront fees, and cancellation terms using written quotes." },
  { icon: ClipboardList, title: "Prepare for your appointment", text: "Bring practical questions about testing, fertility, household precautions, monitoring, and follow-up." },
];

export default function HomePage() {
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": "https://shotfreetrt.com/#organization", name: "ShotFreeTRT", url: "https://shotfreetrt.com", logo: "https://shotfreetrt.com/favicon.png" },
    { "@type": "WebSite", "@id": "https://shotfreetrt.com/#website", name: "ShotFreeTRT", url: "https://shotfreetrt.com", publisher: { "@id": "https://shotfreetrt.com/#organization" } },
  ] };
  return <div className="space-y-14">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="grid items-center gap-8 py-5 lg:grid-cols-[1.3fr_1fr] sm:py-10">
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">For men comparing testosterone treatment options</p>
        <h1 className="font-[family-name:var(--font-barlow-condensed)] text-5xl font-extrabold leading-none tracking-tight sm:text-7xl">Considering TRT?<br /><span className="text-primary">Compare before<br />you commit.</span></h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Prefer to avoid injections? Get clear on the options, the questions that matter, and what a clinic will actually charge—before your next appointment.</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg"><Link href="/quiz/healthspan">Take the 2-minute decision quiz <ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/decision-guide">Open the free decision guide</Link></Button>
        </div>
        <p className="text-sm text-muted-foreground">No account. No lab upload. No treatment score. Education, not medical care.</p>
      </div>
      <Card className="overflow-hidden border-primary/40">
        <Image
          src="/media/sft-web-batch2-01.webp"
          alt=""
          width={960}
          height={640}
          sizes="(min-width: 1024px) 420px, 100vw"
          priority
          className="h-auto w-full border-b border-[#222230]"
        />
        <CardHeader><p className="text-xs font-semibold uppercase tracking-widest text-primary">Inside your free guide</p><CardTitle className="text-2xl">A clearer conversation.<br />A more complete quote.</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          {steps.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3"><Icon className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" /><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{text}</p></div></div>)}
          <p className="border-t pt-4 text-sm text-muted-foreground">Use it with a primary-care clinician, endocrinologist, urologist, or a clinic you are already considering.</p>
        </CardContent>
      </Card>
    </section>
    <section className="rounded-xl border bg-card p-6 sm:p-8">
      <h2 className="text-2xl font-bold">Needle-free is a delivery preference.<br />Not a safety or fertility guarantee.</h2>
      <p className="mt-4 max-w-3xl text-muted-foreground">Testosterone delivered without injections is still replacement testosterone. Plans for children belong in the conversation before treatment; the Endocrine Society recommends against testosterone therapy when planning fertility in the near term.</p>
      <a href={sources.guideline} className="mt-4 inline-block text-sm" rel="noreferrer">Read the Endocrine Society guidance →</a>
    </section>
    <section className="space-y-5">
      <h2 className="text-3xl font-bold">Choose the question you need answered</h2>
      <div className="grid gap-5 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-xl">“Which questions should I ask?”</CardTitle></CardHeader><CardContent><p className="mb-4 text-muted-foreground">Use a printable appointment checklist, without turning symptoms into an automated prescription.</p><Link href="/decision-guide">Prepare for your visit →</Link></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-xl">“What will I really pay?”</CardTitle></CardHeader><CardContent><p className="mb-4 text-muted-foreground">A 4-week bill is not a monthly bill. Compare the published terms, then enter your own quotes.</p><Link href="/pricing">See the price comparison →</Link></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-xl">“Is this product FDA-approved?”</CardTitle></CardHeader><CardContent><p className="mb-4 text-muted-foreground">Compounded drugs are not FDA-approved. Ask about the exact formulation and the evidence behind it.</p><a href={sources.compounding} rel="noreferrer">Read the FDA explanation →</a></CardContent></Card>
      </div>
    </section>
    <section className="rounded-xl border bg-secondary p-6 sm:p-8">
      <h2 className="text-2xl font-bold">Make the next conversation count.</h2>
      <p className="mb-5 mt-3 text-muted-foreground">You do not need to choose a drug today. Start by knowing what to ask—and what you still need to confirm.</p>
      <Button asChild size="lg"><Link href="/decision-guide">Get the free checklist and cost worksheet <ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
    </section>
    <div className="space-y-3 border-t pt-6 text-sm text-muted-foreground">
      <p>ShotFreeTRT publishes education, not prescriptions. Clinical decisions require a licensed clinician. Paid placements, when present, must be labeled; listing a provider is not an endorsement.</p>
      <p><Link href="/about">About this site</Link> · <Link href="/blog">Browse the article library</Link> · <Link href="/for-clinics">Run a clinic? Explore the proposed pilot</Link></p>
    </div>
  </div>;
}
