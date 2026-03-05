"use client";

import { FormEvent, useState } from "react";

type NewsletterSignupProps = {
  formId?: string;
  buttonLabel?: string;
};

export default function NewsletterSignup({
  formId = "newsletter-signup-email",
  buttonLabel = "Subscribe"
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      setIsError(true);
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setIsError(true);
        setMessage(result.message ?? "Unable to subscribe right now.");
        return;
      }

      setMessage(result.message ?? "Subscribed successfully.");
      setEmail("");
    } catch {
      setIsError(true);
      setMessage("Unable to subscribe right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="cta" aria-label="Newsletter sign up">
      <h2>Get the weekly Shot-Free TRT playbook</h2>
      <p>
        Join for practical protocols, lab interpretation guides, and zero-fluff
        updates focused on natural testosterone optimization.
      </p>
      <form className="cta-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor={formId} className="sr-only">
          Email address
        </label>
        <input
          id={formId}
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSubmitting}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : buttonLabel}
        </button>
      </form>
      {message ? (
        <p
          className={`newsletter-message${isError ? " newsletter-message-error" : ""}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
