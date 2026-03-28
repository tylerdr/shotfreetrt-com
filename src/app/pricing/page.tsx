import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, ClipboardList, Microscope, Shield } from "lucide-react";

import { DisclosureNotice } from "@/components/DisclosureNotice";

export const metadata: Metadata = {
  title: "TRT Resources & Pricing | ShotFreeTRT",
  description:
    "Free tools, guides, and honest clinic comparisons to help you navigate testosterone replacement therapy. Start with our free TRT decision quiz.",
  alternates: {
    canonical: "/pricing"
  }
};

const freeResources = [
  {
    icon: ClipboardList,
    title: "TRT Decision Quiz",
    description:
      "Answer 6 questions and get a personalized recommendation: lifestyle-first, SERM path, or TRT — matched to your profile.",
    cta: "Take the Free Quiz",
    href: "/quiz",
    highlight: true
  },
  {
    icon: BookOpen,
    title: "Complete TRT Guide (2026)",
    description:
      "Everything you need to understand TRT — benefits, risks, delivery methods, cost, and how to start.",
    cta: "Read the Guide",
    href: "/blog/testosterone-replacement-therapy-guide"
  },
  {
    icon: Microscope,
    title: "TRT Bloodwork Panel",
    description:
      "The exact labs to request before starting TRT. What each number means. How to interpret them.",
    cta: "See the Panel",
    href: "/blog/trt-bloodwork-panel"
  },
  {
    icon: Shield,
    title: "TRT Side Effects: What's Real",
    description:
      "12 side effects reviewed honestly — which are real, which are overstated, and how to manage each one.",
    cta: "Read the Breakdown",
    href: "/blog/trt-side-effects"
  }
];

const clinicOptions = [
  {
    name: "Defy Medical",
    tagline: "Most comprehensive protocol management",
    price: "~$200–$350/mo",
    best: "Men who want close monitoring and protocol flexibility",
    details: [
      "Telemedicine + in-person options",
      "Patient portal with lab tracking",
      "HCG, enclomiphene, and ancillaries available",
      "Longer-term relationship model"
    ],
    affiliateNote: true
  },
  {
    name: "Fountain TRT",
    tagline: "Streamlined online-only TRT",
    price: "~$99–$149/mo",
    best: "Men who want fast setup with a simple protocol",
    details: [
      "100% telemedicine",
      "Quick onboarding (1–2 weeks to first dose)",
      "Testosterone cypionate injections focus",
      "Lower cost, less customization"
    ],
    affiliateNote: true
  },
  {
    name: "Maximus",
    tagline: "Oral TRT + metabolic focus",
    price: "~$129–$199/mo",
    best: "Men who want oral TRT (Kyzatrex) or Clomid-first approach",
    details: [
      "Kyzatrex (oral testosterone) primary option",
      "Enclomiphene available",
      "App-based management",
      "Good fit for fertility-preserving paths"
    ],
    affiliateNote: true
  },
  {
    name: "Hone Health",
    tagline: "Hormones + primary care hybrid",
    price: "~$149–$249/mo",
    best: "Men who want broader hormonal health coverage alongside TRT",
    details: [
      "Online physician visits",
      "Full hormone panel + thyroid included",
      "Injectable and topical options",
      "Access to compounding pharmacy"
    ],
    affiliateNote: true
  }
];

const comparisonRows = [
  { label: "Monthly cost", defy: "$200–$350", fountain: "$99–$149", maximus: "$129–$199", hone: "$149–$249" },
  { label: "Delivery methods", defy: "Inj, topical, oral", fountain: "Injections", maximus: "Oral, SERM", hone: "Inj, topical" },
  { label: "HCG / fertility support", defy: "✓", fountain: "Limited", maximus: "✓ (enclomiphene)", hone: "✓" },
  { label: "Lab monitoring included", defy: "✓", fountain: "✓ (basic)", maximus: "✓", hone: "✓" },
  { label: "Telemedicine", defy: "✓", fountain: "✓", maximus: "✓", hone: "✓" },
  { label: "In-person option", defy: "✓", fountain: "✗", maximus: "✗", hone: "✗" },
  { label: "Compounding pharmacy", defy: "✓", fountain: "Limited", maximus: "✓", hone: "✓" }
];

export default function PricingPage() {
  return (
    <div className="container" style={{ padding: "60px 20px 80px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: "16px", lineHeight: 1.2 }}>
          TRT Resources & Clinic Pricing
        </h1>
        <p style={{ color: "var(--site-muted)", fontSize: "1.1rem", maxWidth: "580px", margin: "0 auto 24px" }}>
          Free tools to help you decide, plus an honest look at what online TRT clinics
          actually cost — and who each one is best for.
        </p>
        <Link
          href="/quiz"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--accent-2)",
            color: "#000",
            padding: "14px 28px",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "1rem"
          }}
        >
          Not sure where to start? Take the free quiz
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Free Resources */}
      <section style={{ marginBottom: "72px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "8px" }}>Free Resources</h2>
        <p style={{ color: "var(--site-muted)", marginBottom: "32px" }}>
          Start here before spending a dollar. These tools are free and will save you months of confusion.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px"
          }}
        >
          {freeResources.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                style={{
                  background: item.highlight ? "rgba(16,185,129,0.08)" : "var(--surface)",
                  border: `1px solid ${item.highlight ? "rgba(16,185,129,0.4)" : "var(--border)"}`,
                  borderRadius: "12px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                <Icon size={24} color="var(--accent-2)" />
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: "1.05rem", marginBottom: "6px" }}>{item.title}</h3>
                  <p style={{ color: "var(--site-muted)", fontSize: "0.9rem", margin: 0 }}>{item.description}</p>
                </div>
                <Link
                  href={item.href}
                  style={{
                    color: "var(--accent-2)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    marginTop: "auto"
                  }}
                >
                  {item.cta} <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Clinic Comparison */}
      <section style={{ marginBottom: "72px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "8px" }}>
          Online TRT Clinic Pricing (2026)
        </h2>
        <p style={{ color: "var(--site-muted)", marginBottom: "32px" }}>
          These are the four most commonly recommended online TRT clinics. Prices are monthly estimates
          including medication and provider fees. Exact costs vary by protocol and state.
        </p>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: "20px",
            marginBottom: "40px"
          }}
        >
          {clinicOptions.map((clinic) => (
            <div
              key={clinic.name}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "24px"
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "4px" }}>{clinic.name}</h3>
                <span style={{ color: "var(--site-muted)", fontSize: "0.85rem" }}>{clinic.tagline}</span>
              </div>
              <div
                style={{
                  background: "rgba(16,185,129,0.1)",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  marginBottom: "16px",
                  display: "inline-block"
                }}
              >
                <span style={{ color: "var(--accent-2)", fontWeight: 700 }}>{clinic.price}</span>
                <span style={{ color: "var(--site-muted)", fontSize: "0.8rem" }}> / month</span>
              </div>
              <p style={{ color: "var(--site-muted)", fontSize: "0.85rem", marginBottom: "12px" }}>
                <strong style={{ color: "var(--text)" }}>Best for:</strong> {clinic.best}
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {clinic.details.map((d) => (
                  <li
                    key={d}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      fontSize: "0.85rem",
                      color: "var(--site-muted)",
                      marginBottom: "6px"
                    }}
                  >
                    <BadgeCheck size={14} color="var(--accent-2)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div style={{ overflowX: "auto" }}>
          <h3 style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "16px" }}>Side-by-Side Comparison</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem"
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--site-muted)", fontWeight: 500 }}>
                  Feature
                </th>
                {["Defy", "Fountain", "Maximus", "Hone"].map((h) => (
                  <th
                    key={h}
                    style={{ textAlign: "center", padding: "10px 14px", color: "var(--text)", fontWeight: 600 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={row.label}
                  style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}
                >
                  <td style={{ padding: "10px 14px", color: "var(--site-muted)" }}>{row.label}</td>
                  <td style={{ padding: "10px 14px", textAlign: "center", color: "var(--text)" }}>{row.defy}</td>
                  <td style={{ padding: "10px 14px", textAlign: "center", color: "var(--text)" }}>{row.fountain}</td>
                  <td style={{ padding: "10px 14px", textAlign: "center", color: "var(--text)" }}>{row.maximus}</td>
                  <td style={{ padding: "10px 14px", textAlign: "center", color: "var(--text)" }}>{row.hone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: "20px", fontSize: "0.85rem", color: "var(--site-muted)" }}>
          For a deeper breakdown:{" "}
          <Link href="/blog/best-online-trt-clinic">Best Online TRT Clinics Compared (2026) →</Link>
        </p>
      </section>

      {/* Cost breakdown CTA */}
      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "40px",
          marginBottom: "72px",
          textAlign: "center"
        }}
      >
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "12px" }}>
          What Does TRT Actually Cost Out-of-Pocket?
        </h2>
        <p style={{ color: "var(--site-muted)", marginBottom: "24px", maxWidth: "520px", margin: "0 auto 24px" }}>
          Monthly estimates vary $60–$500+ depending on delivery method, clinic model, and whether
          insurance covers any of it. See the full breakdown.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/blog/trt-cost-2026"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--accent-2)",
              color: "#000",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.95rem"
            }}
          >
            Full TRT Cost Breakdown <ArrowRight size={16} />
          </Link>
          <Link
            href="/blog/trt-insurance-coverage"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              border: "1px solid var(--border)",
              color: "var(--text)",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "0.95rem"
            }}
          >
            Is TRT Covered by Insurance?
          </Link>
        </div>
      </section>

      {/* Quiz CTA */}
      <section
        style={{
          background: "rgba(16,185,129,0.07)",
          border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: "16px",
          padding: "40px",
          textAlign: "center"
        }}
      >
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "12px" }}>
          Not sure which path is right for you?
        </h2>
        <p style={{ color: "var(--site-muted)", marginBottom: "28px", maxWidth: "480px", margin: "0 auto 28px" }}>
          Take our free 6-question quiz. It evaluates your symptoms, fertility goals, and risk profile
          to recommend the best starting point — lifestyle, SERM, or TRT.
        </p>
        <Link
          href="/quiz"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--accent-2)",
            color: "#000",
            padding: "14px 32px",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "1rem"
          }}
        >
          Take the Free TRT Quiz <ArrowRight size={18} />
        </Link>
        <p style={{ color: "var(--site-muted)", fontSize: "0.8rem", marginTop: "12px" }}>
          Free. No email required.
        </p>
      </section>

      <div style={{ marginTop: "60px" }}>
        <DisclosureNotice />
      </div>
    </div>
  );
}
