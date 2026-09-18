import Stripe from "stripe";

import {
  BLUEPRINT_CURRENCY,
  BLUEPRINT_PRICE_CENTS,
  BLUEPRINT_PRICE_ID,
  BLUEPRINT_PRODUCT_KEY,
  BLUEPRINT_PRODUCT_NAME,
  BLUEPRINT_ITEM,
  type BlueprintPurchase
} from "@/lib/commerce";
import { createBlueprintOrderToken } from "@/lib/entitlement";

type VerificationFailure = {
  ok: false;
  reason:
    | "missing_configuration"
    | "invalid_session"
    | "not_paid"
    | "wrong_product"
    | "invalid_state"
    | "refunded_or_disputed"
    | "stripe_error";
};

export type BlueprintVerification =
  | { ok: true; purchase: BlueprintPurchase }
  | VerificationFailure;

function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return secretKey ? new Stripe(secretKey) : null;
}

function isSessionId(value: string): boolean {
  return /^cs_[A-Za-z0-9_]+$/.test(value) && value.length <= 200;
}

function productIdMatches(product: Stripe.Price["product"]): boolean {
  const expectedProductId = process.env.STRIPE_BLUEPRINT_PRODUCT_ID?.trim();
  if (!expectedProductId) return true;
  return typeof product === "string"
    ? product === expectedProductId
    : Boolean(product && "id" in product && product.id === expectedProductId);
}

function productNameMatches(product: Stripe.Price["product"]): boolean {
  return Boolean(
    product &&
      typeof product !== "string" &&
      !("deleted" in product) &&
      product.name === BLUEPRINT_PRODUCT_NAME
  );
}

/**
 * Treat Stripe as the source of truth for fulfillment. The success page and
 * the download route both call this function; a client redirect alone never
 * unlocks the paid asset.
 */
export async function verifyBlueprintCheckoutSession(
  rawSessionId: string | null | undefined,
  expectedCheckoutStateNonce?: string
): Promise<BlueprintVerification> {
  const sessionId = rawSessionId?.trim() ?? "";
  if (!sessionId || !isSessionId(sessionId)) {
    return { ok: false, reason: "invalid_session" };
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return { ok: false, reason: "missing_configuration" };
  }

  try {
    const [session, lineItems, expectedPrice] = await Promise.all([
      stripe.checkout.sessions.retrieve(sessionId),
      stripe.checkout.sessions.listLineItems(sessionId, { limit: 10 }),
      stripe.prices.retrieve(BLUEPRINT_PRICE_ID, { expand: ["product"] })
    ]);

    const lineItem = lineItems.data[0];
    const product = expectedPrice.product;
    if (
      expectedCheckoutStateNonce &&
      session.metadata?.checkout_state !== expectedCheckoutStateNonce
    ) {
      return { ok: false, reason: "invalid_state" };
    }
    const isCorrectPurchase =
      session.status === "complete" &&
      session.payment_status === "paid" &&
      session.amount_total === BLUEPRINT_PRICE_CENTS &&
      session.currency?.toUpperCase() === BLUEPRINT_CURRENCY &&
      expectedPrice.id === BLUEPRINT_PRICE_ID &&
      expectedPrice.unit_amount === BLUEPRINT_PRICE_CENTS &&
      expectedPrice.currency.toUpperCase() === BLUEPRINT_CURRENCY &&
      !expectedPrice.recurring &&
      lineItems.data.length === 1 &&
      lineItem?.quantity === 1 &&
      lineItem.price?.id === BLUEPRINT_PRICE_ID &&
      productIdMatches(product) &&
      productNameMatches(product);

    if (!isCorrectPurchase) {
      return {
        ok: false,
        reason:
          session.status !== "complete" || session.payment_status !== "paid"
            ? "not_paid"
            : "wrong_product"
      };
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;
    if (!paymentIntentId) {
      return { ok: false, reason: "not_paid" };
    }

    const [paymentIntent, charges] = await Promise.all([
      stripe.paymentIntents.retrieve(paymentIntentId),
      stripe.charges.list({ payment_intent: paymentIntentId, limit: 100 })
    ]);
    const hasRefundOrDispute = charges.has_more || charges.data.some(
      (charge) =>
        charge.refunded ||
        charge.amount_refunded > 0 ||
        charge.disputed
    );
    if (paymentIntent.status !== "succeeded" || charges.data.length === 0) {
      return { ok: false, reason: "not_paid" };
    }
    if (hasRefundOrDispute) {
      return { ok: false, reason: "refunded_or_disputed" };
    }

    const orderToken = createBlueprintOrderToken(session.id);
    if (!orderToken) {
      return { ok: false, reason: "missing_configuration" };
    }

    return {
      ok: true,
      purchase: {
        transactionId: orderToken,
        value: BLUEPRINT_PRICE_CENTS / 100,
        currency: BLUEPRINT_CURRENCY,
        items: [BLUEPRINT_ITEM]
      }
    };
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return { ok: false, reason: "stripe_error" };
    }
    return { ok: false, reason: "stripe_error" };
  }
}

export function privateNoStoreHeaders(contentType = "application/json") {
  return {
    "Cache-Control": "private, no-store, max-age=0",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Content-Type": contentType
  };
}

export const BLUEPRINT_FULFILLMENT_KEY = BLUEPRINT_PRODUCT_KEY;
