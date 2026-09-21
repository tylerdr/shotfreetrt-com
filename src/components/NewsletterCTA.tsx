import Link from "next/link";

import { LeadCaptureForm } from "@/components/LeadCaptureForm";

type NewsletterCTAProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  href?: string;
  compact?: boolean;
};

export function NewsletterCTA({
  title = "Get the free decision guide",
  description = "Receive the existing appointment checklist and private quiz link. This is an educational resource, not a diagnosis or treatment recommendation.",
  buttonLabel = "Email me the guide",
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
      <LeadCaptureForm source="newsletter-cta" submitLabel={buttonLabel} />
      <p className="text-sm"><Link href={href}>Open the guide without email →</Link></p>
    </section>
  );
}
