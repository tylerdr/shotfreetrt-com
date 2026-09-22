import type { Metadata } from "next";
import Link from "next/link";
import { ClinicInterestForm } from "@/components/clinics/ClinicInterestForm";
import { ClinicWorkloadCalculator } from "@/components/clinics/ClinicWorkloadCalculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "TRT Clinic Patient Education & Consult Readiness",
  description: "Turn repeated TRT questions into better-prepared consults with a clinic-branded education and booking-preparation layer.",
  alternates: { canonical: "/for-clinics" },
  robots: { index: true, follow: true },
};

function enrollmentUrl(): string | null {
  if (process.env.CLINIC_PILOT_ENROLLMENT_ENABLED !== "true") return null;
  try {
    const url = new URL(process.env.CLINIC_PILOT_CONTACT_URL ?? "");
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : null;
  } catch {
    return null;
  }
}

export default function ForClinicsPage() {
  const contactUrl = enrollmentUrl();

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <section className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">For men&apos;s-health clinics</p>
        <h1 className="max-w-4xl text-4xl font-extrabold sm:text-5xl">
          Turn repeated TRT questions into better-prepared consults.
        </h1>
        <p className="max-w-3xl text-lg text-muted-foreground">
          Give prospective patients one clear, clinic-branded place to understand routes, pricing, testing, and what to ask before they book—so your team spends less time re-explaining the basics.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="#workload">See your admin load</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/decision-guide">Walk the patient experience</Link>
          </Button>
        </div>
      </section>

      <Card id="launch" className="scroll-mt-28">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">Consult-Ready Launch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-3xl font-bold">$2,000 launch + $1,000/month</p>
            <p className="mt-2 text-muted-foreground">
              We build the patient education layer around the questions your staff already answers every day, then improve it from the aggregate questions and booking friction you see each month.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border p-4">
              <p className="font-semibold">Branded education</p>
              <p className="mt-1 text-sm text-muted-foreground">One patient-facing education experience aligned to your clinic.</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="font-semibold">Clear costs & FAQs</p>
              <p className="mt-1 text-sm text-muted-foreground">Your published pricing and the questions your team repeats most often.</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="font-semibold">Booking preparation</p>
              <p className="mt-1 text-sm text-muted-foreground">An appointment checklist and a handoff into the booking system you already use.</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="font-semibold">Monthly improvement</p>
              <p className="mt-1 text-sm text-muted-foreground">A practical review of aggregate questions, friction, and what to improve next.</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Your clinical reviewer approves patient-facing content before it goes live. The first launch does not require EHR integration or patient-record ingestion.
          </p>
        </CardContent>
      </Card>

      <section className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Best fit</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              An independent men&apos;s-health practice with existing inquiries, appointment capacity, a clinical reviewer, and repeated questions about routes, costs, testing, or follow-up.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>First useful result</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              A prospective patient can answer the basic “what are my options, what does it cost, and what happens next?” questions and reach your booking path without your front desk starting from zero.
            </p>
          </CardContent>
        </Card>
      </section>

      <ClinicWorkloadCalculator />

      <section className="grid gap-6 rounded-xl border p-6 md:grid-cols-[1fr_1.15fr] md:p-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Clinic launch</p>
          <h2 className="text-2xl font-bold sm:text-3xl">Get the clinic launch overview.</h2>
          <p className="text-muted-foreground">
            Use your work email. We&apos;ll send the clinic overview and keep the patient-facing demo one click away so you can decide whether this would remove real friction for your team.
          </p>
          {contactUrl ? (
            <Button asChild variant="outline">
              <a href={contactUrl} rel="noreferrer">Start a clinic launch</a>
            </Button>
          ) : null}
        </div>
        <ClinicInterestForm />
      </section>

      <p className="text-sm text-muted-foreground">
        Consult-Ready Launch is a patient-education and booking-preparation product. Clinicians keep care decisions, and the initial launch does not ingest patient records.
      </p>
    </div>
  );
}
