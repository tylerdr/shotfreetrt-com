import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Clinic Consult-Readiness Pilot",
  description: "Proposed clinic-branded patient education and quote-clarity pilot. Defined scope, fixed fees, no prescription commissions or clinical automation.",
  alternates: { canonical: "/for-clinics" },
  robots: { index: false, follow: true },
};

function enrollmentUrl(): string | null {
  if (process.env.CLINIC_PILOT_ENROLLMENT_ENABLED !== "true") return null;
  try {
    const url = new URL(process.env.CLINIC_PILOT_CONTACT_URL ?? "");
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : null;
  } catch { return null; }
}

export default function ForClinicsPage() {
  const contactUrl = enrollmentUrl();
  return <div className="mx-auto max-w-4xl space-y-8">
    <section className="space-y-5">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">Clinic pilot proposal · Not a medical service</p>
      <h1 className="text-4xl font-extrabold sm:text-5xl">Help patients arrive prepared.<br />Give your team fewer basics to repeat.</h1>
      <p className="text-lg text-muted-foreground">A proposed clinic-branded education and cost-clarity experience for the inquiries you already receive. Your team approves the content; your clinicians make every care decision.</p>
      <Button asChild variant="outline"><Link href="/decision-guide">Try the public demonstration</Link></Button>
    </section>
    <Card><CardHeader><CardTitle className="text-2xl">Consult-Ready Launch</CardTitle></CardHeader><CardContent className="space-y-4">
      <p className="text-3xl font-bold">$2,000 setup + $1,000/month</p>
      <p>Proposed pilot pricing, subject to a written scope and readiness review. Recurring fees begin only after agreed acceptance. No checkout or automatic subscription is enabled here.</p>
      <p>Scope: one clinic brand, one education landing page, a verified price/FAQ sheet, an appointment checklist, a link to your existing booking system, and a monthly aggregate performance review. No EHR replacement or patient-record ingestion in the initial pilot.</p>
      <p><strong>Acceptance:</strong> clinic-approved content, correct published costs, tested booking handoff, accessible mobile flow, and a signed-off measurement plan. The proposed agreement should make setup refundable if we cannot deliver that agreed scope; it must not guarantee clinical outcomes, prescriptions, or revenue.</p>
    </CardContent></Card>
    <section className="grid gap-5 md:grid-cols-2">
      <Card><CardHeader><CardTitle>Designed for</CardTitle></CardHeader><CardContent><p>Independent men’s-health practices with an accountable clinical reviewer, existing inquiries, available appointment capacity, and repeated questions about routes, costs, testing, and follow-up.</p></CardContent></Card>
      <Card><CardHeader><CardTitle>Not designed for</CardTitle></CardHeader><CardContent><p>Clinics seeking guaranteed patients, prescription-based commissions, autonomous medical advice, or a replacement for qualified clinical judgment. Traffic acquisition and advertising spend are outside this pilot.</p></CardContent></Card>
    </section>
    <section className="space-y-4 rounded-xl border p-6">
      <h2 className="text-2xl font-bold">Start with a fit review</h2>
      <p>Review inquiry volume, booking capacity, repeated administrative questions, existing materials, and the cost of delivery. Only de-identified aggregate business information is needed. Do not send patient information.</p>
      {contactUrl ? <Button asChild><a href={contactUrl} rel="noreferrer">Request a clinic pilot review</a></Button> : <p className="rounded-lg bg-secondary p-4 text-muted-foreground">Pilot enrollment is not open yet. This page describes the proposed offer; the public demonstration is available now. We are not accepting payments or applications through this page.</p>}
    </section>
    <p className="text-sm text-muted-foreground">Fixed software and content-service fees do not purchase preferential placement in consumer comparisons. Any future sponsorship must be separately labeled. Clinical, privacy, contract, and applicable referral-law review are required before activation.</p>
  </div>;
}
