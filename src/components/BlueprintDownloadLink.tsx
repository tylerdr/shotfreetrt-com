"use client";

import { TENANT_ID } from "@/components/analytics-provider";
import { trackEvent, trackGa4Event } from "@/lib/analytics";
import {
  BLUEPRINT_CURRENCY,
  BLUEPRINT_ITEM,
  BLUEPRINT_PRICE_CENTS
} from "@/lib/commerce";

type BlueprintDownloadLinkProps = {
  href: string;
};

export function BlueprintDownloadLink({ href }: BlueprintDownloadLinkProps) {
  function handleClick() {
    const value = BLUEPRINT_PRICE_CENTS / 100;
    trackGa4Event("download_click", {
      item_id: BLUEPRINT_ITEM.item_id,
      item_name: BLUEPRINT_ITEM.item_name,
      value,
      currency: BLUEPRINT_CURRENCY
    });
    void trackEvent(TENANT_ID, {
      event_type: "download_click",
      metadata: {
        item_id: BLUEPRINT_ITEM.item_id,
        value,
        currency: BLUEPRINT_CURRENCY
      }
    });
  }

  return (
    <a
      href={href}
      onClick={handleClick}
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
  );
}
