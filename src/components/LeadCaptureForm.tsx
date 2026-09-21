"use client";

import { FormEvent, useState } from "react";

type LeadCaptureFormProps = {
  source: string;
  id?: string;
  submitLabel?: string;
  description?: string;
};

type ApiResponse = {
  ok?: boolean;
  message?: string;
  confirmation_status?: "sent" | "unavailable" | "failed";
};

export function LeadCaptureForm({
  source,
  id = "shotfreetrt-lead-capture",
  submitLabel = "Email me the guide",
  description = "Get the existing decision guide and private quiz link by email. Your quiz answers stay on this page and are never included."
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError(false);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          source,
          source_url: window.location.pathname
        })
      });
      const payload = await response.json() as ApiResponse;
      if (!response.ok || payload.ok !== true) {
        setError(true);
        setMessage(payload.message ?? "We couldn't save your email. Please try again later.");
        return;
      }
      setMessage(payload.message ?? "Your email was saved. The guide is available now.");
      setEmail("");
      setConsent(false);
    } catch {
      setError(true);
      setMessage("We couldn't reach the signup service. Please try again later; the guide is available now.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form id={id} className="cta-form" onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor={`${id}-email`}>Email address</label>
      <input
        id={`${id}-email`}
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        aria-describedby={`${id}-description ${id}-consent ${id}-message`}
      />
      <button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </button>
      <p id={`${id}-description`} className="cta-form-description">{description}</p>
      <label id={`${id}-consent`} className="cta-consent">
        <input
          type="checkbox"
          name="consent"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          required
        />
        <span>Email me this guide and future ShotFreeTRT resource updates.</span>
      </label>
      <p
        id={`${id}-message`}
        className={`newsletter-message${error ? " newsletter-message-error" : ""}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  );
}
