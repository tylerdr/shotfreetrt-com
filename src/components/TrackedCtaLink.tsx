"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { TENANT_ID } from "@/components/analytics-provider";
import { trackCtaClick } from "@/lib/analytics";

type TrackedCtaLinkProps = {
  href: string;
  eventType: "cta_starter_guide_click" | "cta_self_check_click" | "cta_consult_click";
  metadata: Record<string, unknown>;
  children: ReactNode;
};

export function TrackedCtaLink({ href, eventType, metadata, children }: TrackedCtaLinkProps) {
  return (
    <Link href={href} onClick={() => trackCtaClick(TENANT_ID, eventType, metadata)}>
      {children}
    </Link>
  );
}
