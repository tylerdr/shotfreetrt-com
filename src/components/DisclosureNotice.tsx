type DisclosureNoticeVariant = "medical" | "affiliate" | "both";

type DisclosureNoticeProps = {
  variant?: DisclosureNoticeVariant;
  title?: string;
};

const DISCLOSURE_COPY: Record<DisclosureNoticeVariant, string> = {
  medical:
    "Educational content only. This site does not provide medical diagnosis or treatment. Always discuss supplements, labs, and medication changes with a licensed clinician.",
  affiliate:
    "Some links on this page may become affiliate links over time. If the site earns commissions, that will be disclosed and does not replace evidence review.",
  both:
    "Educational content only. This site does not provide medical diagnosis or treatment. Some links may eventually generate affiliate commissions, which will be disclosed. Always confirm safety and relevance with a licensed clinician."
};

export function DisclosureNotice({
  variant = "medical",
  title = "Disclosure"
}: DisclosureNoticeProps) {
  return (
    <aside className="disclosure" aria-label={`${title} notice`}>
      <p>
        <strong>{title}:</strong> {DISCLOSURE_COPY[variant]}
      </p>
    </aside>
  );
}
