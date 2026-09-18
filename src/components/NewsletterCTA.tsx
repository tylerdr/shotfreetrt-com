import Link from "next/link";

import { Button } from "@/components/ui/button";

type NewsletterCTAProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  href?: string;
  compact?: boolean;
};

// There is no durable email-delivery backend. Rather than collect addresses
// a subscriber will never actually receive anything from, this links to a
// real, working, free resource instead of an email form.
export function NewsletterCTA({
  title = "Get the free decision guide",
  description = "No email required. Read the appointment checklist, compare written clinic quotes with the calculator, and see dated provider price examples.",
  buttonLabel = "Open the decision guide",
  href = "/decision-guide",
  compact = false
}: NewsletterCTAProps) {
  return (
    <section
      className={`cta${compact ? " cta-compact" : ""}`}
      aria-label="Free decision guide"
    >
      <h2>{title}</h2>
      <p>{description}</p>
      <Button asChild>
        <Link href={href}>{buttonLabel}</Link>
      </Button>
    </section>
  );
}
