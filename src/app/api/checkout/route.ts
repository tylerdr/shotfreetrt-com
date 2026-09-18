import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import {
  BLUEPRINT_PRICE_ID,
  BLUEPRINT_PRODUCT_KEY
} from "@/lib/commerce";
import {
  CHECKOUT_STATE_COOKIE,
  verifyCheckoutStateToken
} from "@/lib/entitlement";
import {
  buildClientReferenceId,
  sanitizeAttribution,
  serializeAttribution,
  type FirstTouchAttribution
} from "@/lib/attribution";

export const runtime = "nodejs";

function getRequestOrigin(request: NextRequest): string {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredOrigin) {
    try {
      const url = new URL(configuredOrigin);
      if (url.protocol === "https:" || url.hostname === "localhost") {
        return url.origin;
      }
    } catch {
      // Fall through to the safe canonical origin.
    }
  }

  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") {
    const protocol = request.headers.get("x-forwarded-proto") ?? "http";
    return `${protocol}://${request.headers.get("host")}`;
  }

  return "https://shotfreetrt.com";
}

function readAttribution(requestBody: unknown): FirstTouchAttribution {
  if (!requestBody || typeof requestBody !== "object") {
    return sanitizeAttribution(null);
  }

  const attribution = (requestBody as { attribution?: unknown }).attribution;
  return sanitizeAttribution(attribution);
}

export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY environment variable." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);
  const origin = getRequestOrigin(request);
  const checkoutState = verifyCheckoutStateToken(
    request.cookies.get(CHECKOUT_STATE_COOKIE)?.value
  );
  if (!checkoutState) {
    return NextResponse.json(
      { error: "Checkout state expired. Please try again." },
      { status: 409 }
    );
  }
  let requestBody: unknown = null;

  try {
    requestBody = await request.json();
  } catch {
    // Attribution is optional. Checkout can still start with an empty envelope.
  }

  const attribution = readAttribution(requestBody);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: BLUEPRINT_PRICE_ID,
          quantity: 1
        }
      ],
      // The exchange endpoint consumes the Stripe ID and redirects to a clean
      // success path before any browser analytics code runs.
      success_url: `${origin}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/guides/longevity-blueprint`,
      client_reference_id: buildClientReferenceId(attribution),
      metadata: {
        product: BLUEPRINT_PRODUCT_KEY,
        attribution_version: "1",
        attribution: serializeAttribution(attribution),
        checkout_state: checkoutState.nonce
      }
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Stripe.errors.StripeError
        ? error.message
        : "Unable to create checkout session.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
