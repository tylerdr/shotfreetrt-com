import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { BlueprintDownloadLink } from "@/components/BlueprintDownloadLink";
import { PurchaseTracking } from "@/components/PurchaseTracking";
import {
  BLUEPRINT_ENTITLEMENT_COOKIE,
  verifyBlueprintEntitlementToken
} from "@/lib/entitlement";
import { verifyBlueprintCheckoutSession } from "@/lib/stripe-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Longevity Blueprint Purchase",
  description: "Access your verified Longevity Blueprint purchase.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      noarchive: true
    }
  }
};

export default async function LongevityBlueprintSuccessPage() {
  const cookieStore = await cookies();
  const entitlement = verifyBlueprintEntitlementToken(
    cookieStore.get(BLUEPRINT_ENTITLEMENT_COOKIE)?.value
  );
  const verification = await verifyBlueprintCheckoutSession(entitlement?.sessionId);

  if (!verification.ok) {
    return (
      <section className="hero guide-hero">
        <p className="guide-badge-row">
          <span className="badge">Purchase Not Verified</span>
        </p>
        <h1>We Couldn&apos;t Confirm This Purchase</h1>
        <p>
          The download stays locked until Stripe confirms a completed payment. If
          you just paid, reopen the confirmation link from your Stripe receipt or
          return to the guide and try again.
        </p>
        <p style={{ marginBottom: 0 }}>
          <Link className="guide-secondary-link" href="/guides/longevity-blueprint">
            Return to the Longevity Blueprint
          </Link>
        </p>
      </section>
    );
  }

  const downloadHref = "/api/download/longevity-blueprint";

  return (
    <>
      <PurchaseTracking purchase={verification.purchase} />
      <section className="hero guide-hero">
        <p className="guide-badge-row">
          <span className="badge">Purchase Complete</span>
          <span className="badge" style={{ background: "#166534", color: "#bbf7d0" }}>
            Verified by Stripe
          </span>
        </p>
        <h1>Your Longevity Blueprint Is Ready</h1>
        <p>
          Your paid purchase is verified. Download The Longevity Blueprint (2026
          Edition) below and keep the link for your personal use.
        </p>
        <BlueprintDownloadLink href={downloadHref} />
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
