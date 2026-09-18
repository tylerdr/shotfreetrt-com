"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { TENANT_ID } from "@/components/analytics-provider";
import { getFirstTouchAttribution } from "@/lib/attribution";
import {
  BLUEPRINT_CURRENCY,
  BLUEPRINT_ITEM,
  BLUEPRINT_PRICE_CENTS
} from "@/lib/commerce";
import { trackEvent, trackGa4Event } from "@/lib/analytics";

type CheckoutResponse = {
  error?: string;
  url?: string;
};

type BuyButtonProps = {
  label?: string;
};

export function BuyButton({ label = "Buy The Longevity Blueprint — $19" }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const attribution = getFirstTouchAttribution();
      const stateResponse = await fetch("/api/checkout/state", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store"
      });
      if (!stateResponse.ok) {
        throw new Error("Unable to secure checkout. Please try again.");
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ attribution })
      });
      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start checkout. Please try again.");
      }

      const value = BLUEPRINT_PRICE_CENTS / 100;
      trackGa4Event("begin_checkout", {
        currency: BLUEPRINT_CURRENCY,
        value,
        items: [BLUEPRINT_ITEM]
      });
      void trackEvent(TENANT_ID, {
        event_type: "begin_checkout",
        metadata: {
          item_id: BLUEPRINT_ITEM.item_id,
          value,
          currency: BLUEPRINT_CURRENCY,
          attribution
        }
      });

      window.location.href = data.url;
    } catch (checkoutError) {
      if (checkoutError instanceof Error) {
        setError(checkoutError.message);
      } else {
        setError("Unable to start checkout. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <Button type="button" onClick={handleClick} disabled={isLoading} className="h-11 px-6">
        {isLoading ? "Redirecting to Checkout..." : label}
      </Button>
      {error ? (
        <p className="m-0 text-sm font-semibold text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
