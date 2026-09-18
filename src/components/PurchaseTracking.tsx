"use client";

import { useEffect } from "react";

import { trackGa4Event } from "@/lib/analytics";
import type { BlueprintPurchase } from "@/lib/commerce";

export function PurchaseTracking({ purchase }: { purchase: BlueprintPurchase }) {
  useEffect(() => {
    const storageKey = `_sft_purchase_tracked_${purchase.transactionId}`;

    try {
      if (window.sessionStorage.getItem(storageKey)) return;
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // Continue with one best-effort event if storage is unavailable.
    }

    trackGa4Event("purchase", {
      transaction_id: purchase.transactionId,
      value: purchase.value,
      currency: purchase.currency,
      items: purchase.items
    });
    // First-party purchase ingestion remains fail-closed until this repo has
    // an idempotent migration/RPC path. GA4 still receives the verified event.
  }, [purchase]);

  return null;
}
