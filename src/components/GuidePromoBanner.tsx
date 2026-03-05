import Link from "next/link";

type GuidePromoBannerProps = {
  compact?: boolean;
};

export default function GuidePromoBanner({
  compact = false
}: GuidePromoBannerProps) {
  return (
    <section
      className={`guide-promo-banner${compact ? " guide-promo-banner-compact" : ""}`}
      aria-label="The Shot-Free TRT Blueprint promotion"
    >
      <h2>📘 FREE: The Shot-Free TRT Blueprint</h2>
      <p>
        A 30-day protocol to improve testosterone inputs naturally: sleep,
        lifting, body fat, stress load, and high-yield labs.
      </p>

      <div className="guide-promo-actions">
        <Link href="/guides/longevity-blueprint" className="guide-promo-primary">
          Read the Blueprint →
        </Link>
        <Link href="/guides/longevity-blueprint.pdf" className="guide-promo-secondary">
          Download PDF
        </Link>
      </div>
    </section>
  );
}
