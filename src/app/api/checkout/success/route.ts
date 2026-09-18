import { NextRequest, NextResponse } from "next/server";

import {
  CHECKOUT_STATE_COOKIE,
  BLUEPRINT_ENTITLEMENT_COOKIE,
  BLUEPRINT_ENTITLEMENT_TTL_SECONDS,
  createBlueprintEntitlementToken,
  verifyCheckoutStateToken
} from "@/lib/entitlement";
import {
  privateNoStoreHeaders,
  verifyBlueprintCheckoutSession
} from "@/lib/stripe-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUCCESS_PATH = "/guides/longevity-blueprint/success";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const checkoutState = verifyCheckoutStateToken(
    request.cookies.get(CHECKOUT_STATE_COOKIE)?.value
  );
  const verification = checkoutState
    ? await verifyBlueprintCheckoutSession(sessionId, checkoutState.nonce)
    : { ok: false as const, reason: "invalid_state" as const };
  const response = NextResponse.redirect(new URL(SUCCESS_PATH, request.url), 303);

  for (const [key, value] of Object.entries(privateNoStoreHeaders())) {
    response.headers.set(key, value);
  }

  if (verification.ok) {
    const token = createBlueprintEntitlementToken(sessionId ?? "");
    if (token) {
      response.cookies.set({
        name: BLUEPRINT_ENTITLEMENT_COOKIE,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: BLUEPRINT_ENTITLEMENT_TTL_SECONDS
      });
      // Consume state only after entitlement issuance succeeds. Failed,
      // unpaid, or transient Stripe exchanges remain retryable.
      response.cookies.set({
        name: CHECKOUT_STATE_COOKIE,
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0
      });
    }
  }

  return response;
}
