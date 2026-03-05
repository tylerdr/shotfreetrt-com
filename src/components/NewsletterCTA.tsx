type NewsletterCTAProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  formId?: string;
  compact?: boolean;
};

export function NewsletterCTA({
  title = "Get weekly longevity protocols",
  description = "Join the ShotFreeTRT newsletter for evidence-based strategies on training, nutrition, sleep, and biomarkers.",
  buttonLabel = "Subscribe",
  formId = "newsletter-email",
  compact = false
}: NewsletterCTAProps) {
  return (
    <section
      className={`cta${compact ? " cta-compact" : ""}`}
      aria-label="Newsletter sign up"
    >
      <h2>{title}</h2>
      <p>{description}</p>
      <form className="cta-form" action="#" method="post">
        <label htmlFor={formId} className="sr-only">
          Email address
        </label>
        <input
          id={formId}
          name="email"
          type="email"
          placeholder="you@company.com"
          required
        />
        <button type="submit">{buttonLabel}</button>
      </form>
    </section>
  );
}
