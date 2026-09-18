import type { Metadata } from "next";
import Link from "next/link";
import { EditorialImageFrame } from "@/components/EditorialImageFrame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVIDENCE_DATE, providerSnapshots } from "@/lib/decision-guide";

export const metadata: Metadata = {
  title: "TRT Clinic Costs: Compare Billing Periods, Labs and Medication",
  description: "Dated provider price examples with original sources, plan commitments, and unknown costs. Compare written clinic quotes with a free calculator.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return <div className="mx-auto max-w-4xl space-y-8">
    <section className="space-y-4">
      <p className="text-sm uppercase tracking-widest text-primary">Free tools · Published price examples</p>
      <h1 className="text-4xl font-extrabold sm:text-5xl">Compare the bill.<br />Not just the headline.</h1>
      <p className="text-lg text-muted-foreground">ShotFreeTRT’s decision guide and quote calculator are free. The prices below belong to third-party clinics, not to ShotFreeTRT.</p>
      <Button asChild size="lg"><Link href="/decision-guide">Compare my written quotes</Link></Button>
      <figure className="overflow-hidden rounded-xl border border-border">
        <EditorialImageFrame
          src="/media/sft-web-batch3-10.webp"
          width={960}
          height={640}
          sizes="(min-width: 768px) 700px, 100vw"
        />
        <figcaption className="border-t border-border px-4 py-2 text-xs text-muted-foreground">Working through what a written quote actually adds up to.</figcaption>
      </figure>
    </section>
    <div className="rounded-xl border bg-secondary p-5 text-sm">
      <p><strong>Source snapshot: {EVIDENCE_DATE}.</strong> These examples are not a live quote, ranking, complete market survey, or treatment recommendation. Different products and services are not clinically interchangeable.</p>
      <p className="mt-2">Each link goes directly to the source without an affiliate tracking parameter. Check current terms, state availability, eligibility, included services, and the full checkout amount with the provider.</p>
    </div>
    {providerSnapshots.map((provider) => <Card key={provider.name}>
      <CardHeader><p className="text-sm text-muted-foreground">{provider.plan}</p><CardTitle className="text-2xl">{provider.name}</CardTitle></CardHeader>
      <CardContent className="space-y-4"><p className="text-2xl font-bold">{provider.price}</p><p>{provider.detail}</p><p className="text-muted-foreground"><strong>Still confirm:</strong> {provider.confirm}</p><a href={provider.url} rel="noreferrer">Check the original provider page →</a></CardContent>
    </Card>)}
    <section className="space-y-3 rounded-xl border p-6">
      <h2 className="text-2xl font-bold">Get these six numbers in writing</h2>
      <p className="text-muted-foreground">Amount due at enrollment; recurring charge and billing interval; separate medication; initial and follow-up testing; other visits and shipping; minimum commitment and cancellation/refund terms. An unknown cost is not zero.</p>
      <p>Do not use a cheaper quote to change or stop treatment. Ask a clinician whether the services and treatment being compared are appropriate.</p>
      <Link href="/decision-guide">Open the calculator and appointment questions →</Link>
    </section>
  </div>;
}
