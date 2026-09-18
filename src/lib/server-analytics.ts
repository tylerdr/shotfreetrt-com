import type { BlueprintPurchase } from "@/lib/commerce";

const SUPABASE_URL = "https://mfzxaxzozqiehbwlfmcd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1menhheHpvenFpZWhid2xmbWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1OTAyMzgsImV4cCI6MjA4ODE2NjIzOH0.aTrWd0kIxdU6d38A5gi28Ofq8OXiCZd-QrmS1Pm7Iyw";
const TENANT_ID = "015fd669-36bc-4847-9d7d-d0ad20bf90b5";
const SERVER_COMMERCE_INGESTION_READY =
  process.env.SERVER_COMMERCE_INGESTION_READY === "true";

/** Server-only: the caller invokes this only after the PDF has been read. */
export async function recordBlueprintDownloadSuccess(
  purchase: BlueprintPurchase
): Promise<void> {
  // This REST table has no idempotency constraint/RPC in this repository yet.
  // Keep server commerce ingestion disabled until the migration-backed write
  // path is approved and the explicit readiness flag is enabled.
  if (!SERVER_COMMERCE_INGESTION_READY) return;

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/analytics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        tenant_id: TENANT_ID,
        event_type: "download_success",
        page_url: "/api/download/longevity-blueprint",
        referrer: "",
        // This is an HMAC order token, never a Stripe Checkout Session ID.
        session_id: purchase.transactionId,
        metadata: {
          item_id: purchase.items[0].item_id,
          value: purchase.value,
          currency: purchase.currency
        }
      }),
      signal: AbortSignal.timeout(1500)
    });
  } catch {
    // Analytics failure must not block a verified customer download.
  }
}
