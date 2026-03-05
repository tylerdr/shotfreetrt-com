import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PRICE_ID = "price_1T7LXwCrDNIXmbyxFxKhIyOT";
export const runtime = "nodejs";

function getRequestOrigin(request: NextRequest): string {
  const origin = request.headers.get("origin");
  if (origin) {
    return origin;
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");

  if (host) {
    const protocol = forwardedProto ?? "https";
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1
        }
      ],
      success_url: `${origin}/guides/longevity-blueprint/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/guides/longevity-blueprint`
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
