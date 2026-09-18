import { NextResponse } from "next/server";

import {
  CHECKOUT_STATE_COOKIE,
  CHECKOUT_STATE_TTL_SECONDS,
  createCheckoutStateToken
} from "@/lib/entitlement";
import { privateNoStoreHeaders } from "@/lib/stripe-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const state = createCheckoutStateToken();
  if (!state) {
    return NextResponse.json(
      { error: "Checkout state is not configured." },
      { status: 503, headers: privateNoStoreHeaders() }
    );
  }

  const response = NextResponse.json(
    { ready: true },
    { status: 200, headers: privateNoStoreHeaders() }
  );
  response.cookies.set({
    name: CHECKOUT_STATE_COOKIE,
    value: state.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CHECKOUT_STATE_TTL_SECONDS
  });
  return response;
}
