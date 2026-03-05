import Link from "next/link";

export default function LongevityBlueprintSuccessPage() {
  return (
    <>
      <section className="hero guide-hero">
        <p className="guide-badge-row">
          <span className="badge">Purchase Complete</span>
          <span className="badge" style={{ background: "#166534", color: "#bbf7d0" }}>
            Thank You
          </span>
        </p>
        <h1>Your Longevity Blueprint Is Ready</h1>
        <p>
          Thank you for your purchase. Your download link is below so you can access
          The Longevity Blueprint (2026 Edition) immediately.
        </p>
        <a
          href="/longevity-blueprint.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button"
          style={{
            display: "inline-block",
            marginTop: 16,
            padding: "12px 24px",
            background: "#22c55e",
            color: "#000",
            borderRadius: 12,
            fontWeight: 600,
            textDecoration: "none"
          }}
        >
          ⬇ Download The Longevity Blueprint PDF
        </a>
      </section>

      <section style={{ marginTop: 24 }}>
        <article className="card guide-card">
          <h2>What To Do Next</h2>
          <p>
            Save the guide locally, review the implementation checklist, and use the
            90-day dashboard inside the PDF to run your protocol with clear metrics.
          </p>
          <p style={{ marginBottom: 0 }}>
            <Link className="guide-secondary-link" href="/">
              Return to ShotFreeTRT
            </Link>
          </p>
        </article>
      </section>
    </>
  );
}
