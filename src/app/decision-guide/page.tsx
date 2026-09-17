import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import QuotePlanner from "@/components/QuotePlanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { decisionFaqs, EVIDENCE_DATE, sources, visitQuestions } from "@/lib/decision-guide";

export const metadata: Metadata = {
  title: "TRT Decision Guide: Compare Quotes and Prepare for Your Visit",
  description: "Free appointment questions and a TRT quote comparison calculator. Understand billing periods, treatment questions, and what to confirm before paying a clinic.",
  alternates: { canonical: "/decision-guide" },
};

export default function DecisionGuidePage() {
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: decisionFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  return <div className="mx-auto max-w-4xl space-y-10">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">Free decision companion · No account required</p>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Arrive with better questions.<br />Not an AI prescription.</h1>
      <p className="max-w-3xl text-lg text-muted-foreground">Use the same questions with every clinician, then compare the written costs. This guide does not select a treatment, interpret your labs, or assess whether you qualify for TRT.</p>
      <p className="text-sm text-muted-foreground">Education for adults. Do not start, stop, or change prescribed treatment based on this page.</p>
      <figure className="print:hidden">
        <Image
          src="/media/sft-web-batch2-04.webp"
          alt=""
          width={960}
          height={640}
          sizes="(min-width: 768px) 700px, 100vw"
          className="w-full rounded-xl border border-[#222230]"
        />
        <figcaption className="mt-2 text-xs text-muted-foreground">Editorial illustration referencing the decision-guide process — decorative, not a clinical diagram.</figcaption>
      </figure>
    </section>
    <Card>
      <CardHeader><CardTitle>Your appointment checklist</CardTitle></CardHeader>
      <CardContent><ol className="list-decimal space-y-4 pl-5">{visitQuestions.map((question) => <li key={question}>{question}</li>)}</ol>
        <p className="mt-6 text-sm text-muted-foreground">Clinical context: <a href={sources.guideline} rel="noreferrer">Endocrine Society guideline</a>; <a href={sources.compounding} rel="noreferrer">FDA on compounded medicines</a>. Sources checked {EVIDENCE_DATE}. No individual medical review of your situation is provided.</p>
      </CardContent>
    </Card>
    <QuotePlanner />
    <section aria-labelledby="faq-title" className="space-y-5">
      <h2 id="faq-title" className="text-2xl font-bold">Important distinctions</h2>
      {decisionFaqs.map((faq) => <Card key={faq.question}><CardHeader><CardTitle className="text-lg">{faq.question}</CardTitle></CardHeader><CardContent><p>{faq.answer}</p><a className="mt-3 inline-block text-sm" href={faq.source} rel="noreferrer">Read the source</a></CardContent></Card>)}
    </section>
    <p className="print:hidden"><Link href="/pricing">See dated provider price examples →</Link></p>
  </div>;
}
