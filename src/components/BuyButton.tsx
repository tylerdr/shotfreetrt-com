"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

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

      const response = await fetch("/api/checkout", { method: "POST" });
      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start checkout. Please try again.");
      }

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
        <p className="m-0 text-sm font-semibold text-red-800">{error}</p>
      ) : null}
    </div>
  );
}
