"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CLINIC_LEAD_SOURCE = "shotfreetrt-clinic-interest";

type ApiResponse = {
  ok?: boolean;
  message?: string;
  confirmation_status?: "sent" | "unavailable" | "failed";
};

export function ClinicInterestForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError(false);
    setSaved(false);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          source: CLINIC_LEAD_SOURCE,
          source_url: window.location.pathname,
        }),
      });
      const payload = await response.json() as ApiResponse;
      if (!response.ok || payload.ok !== true) {
        setError(true);
        setMessage(payload.message ?? "We couldn't save your request. Please try again later.");
        return;
      }

      setSaved(true);
      setMessage(payload.message ?? "You're on the clinic launch list. Check your inbox for the overview.");
      setEmail("");
      setConsent(false);
    } catch {
      setError(true);
      setMessage("We couldn't reach the signup service. Please try again later.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="clinic-interest-email">Work email</Label>
        <Input
          id="clinic-interest-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@clinic.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          aria-describedby="clinic-interest-consent clinic-interest-message"
        />
      </div>

      <div id="clinic-interest-consent" className="flex items-start gap-3">
        <Checkbox
          id="clinic-interest-consent-checkbox"
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked === true)}
          required
        />
        <Label htmlFor="clinic-interest-consent-checkbox" className="text-sm font-normal leading-5">
          Email me the clinic launch overview and future ShotFreeTRT clinic-product updates.
        </Label>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending || !consent}>
          {pending ? "Saving…" : "Send me the clinic launch overview"}
        </Button>
        <Button asChild type="button" variant="outline">
          <Link href="/decision-guide">Walk the patient experience</Link>
        </Button>
      </div>

      <p
        id="clinic-interest-message"
        className={`text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>

      {saved ? (
        <p className="text-sm font-medium">
          Next: open the patient-facing demo and note the three questions your staff repeats most often.
        </p>
      ) : null}
    </form>
  );
}
