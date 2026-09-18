import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Growth readiness check failed: ${message}`);
  }
}

const checkout = read("src/app/api/checkout/route.ts");
const checkoutState = read("src/app/api/checkout/state/route.ts");
const download = read("src/app/api/download/longevity-blueprint/route.ts");
const exchange = read("src/app/api/checkout/success/route.ts");
const stripeServer = read("src/lib/stripe-server.ts");
const entitlement = read("src/lib/entitlement.ts");
const serverAnalytics = read("src/lib/server-analytics.ts");
const success = read("src/app/guides/longevity-blueprint/success/page.tsx");
const buyButton = read("src/components/BuyButton.tsx");
const purchaseTracking = read("src/components/PurchaseTracking.tsx");
const downloadTracking = read("src/components/BlueprintDownloadLink.tsx");
const analytics = read("src/lib/analytics.ts");
const googleAnalytics = read("src/components/GoogleAnalytics.tsx");
const attribution = read("src/lib/attribution.ts");
const privacy = read("src/app/privacy/page.tsx");
const guidePromo = read("src/components/GuidePromoBanner.tsx");
const home = read("src/app/page.tsx");
const robots = read("src/app/robots.ts");
const sitemap = read("src/app/sitemap.ts");
const nextConfig = read("next.config.mjs");
const proxy = read("src/proxy.ts");

assert(existsSync(join(root, "public/longevity-blueprint.pdf")), "legacy PDF is present for migration checks");
assert(existsSync(join(root, "public/guides/longevity-blueprint.pdf")), "guide PDF is present for migration checks");
assert(nextConfig.includes("/longevity-blueprint.pdf") && nextConfig.includes("/guides/longevity-blueprint.pdf"), "legacy PDF redirects are configured");
assert(proxy.includes("NextResponse.redirect") && proxy.includes("paidAssetPaths"), "proxy blocks both legacy PDF paths before static handling");
assert(checkoutState.includes("createCheckoutStateToken") && checkoutState.includes("httpOnly: true"), "checkout state issues a signed HttpOnly browser nonce before session creation");
assert(checkout.includes("verifyCheckoutStateToken") && checkout.includes("checkout_state") && checkout.includes("/api/checkout/success?session_id="), "checkout requires and binds the browser state nonce before Stripe session creation");
assert(download.includes("runtime = \"nodejs\"") && download.includes("verifyBlueprintCheckoutSession"), "download route is node-runtime and verifies Stripe");
assert(download.includes("verifyBlueprintEntitlementToken") && !download.includes("searchParams.get(\"session_id\")"), "download route authorizes only from the signed entitlement cookie");
assert(download.includes("privateNoStoreHeaders") && stripeServer.includes("private, no-store") && stripeServer.includes("X-Robots-Tag"), "download route is private and non-indexable");
assert(stripeServer.includes("payment_status === \"paid\"") && stripeServer.includes("status === \"complete\""), "Stripe fulfillment requires a completed paid session");
assert(stripeServer.includes("BLUEPRINT_PRICE_ID") && stripeServer.includes("BLUEPRINT_PRODUCT_NAME") && stripeServer.includes("lineItems.data.length === 1"), "Stripe fulfillment pins the expected price/product and quantity");
assert(stripeServer.includes("amount_refunded") && stripeServer.includes("disputed") && stripeServer.includes("has_more") && stripeServer.includes("paymentIntents.retrieve"), "Stripe fulfillment fails closed for refund/dispute/payment-intent state");
assert(stripeServer.includes("createBlueprintOrderToken") && !stripeServer.includes("transactionId: session.id"), "browser analytics uses a non-authorizing order token, never the Checkout Session ID");
assert(exchange.includes("verifyCheckoutStateToken") && exchange.includes("CHECKOUT_STATE_COOKIE") && exchange.includes("maxAge: 0") && exchange.indexOf("const token = createBlueprintEntitlementToken") < exchange.indexOf("name: CHECKOUT_STATE_COOKIE"), "success exchange consumes checkout state only after entitlement issuance");
assert(exchange.includes("createBlueprintEntitlementToken") && exchange.includes("httpOnly: true") && exchange.includes("303"), "success exchange sets a short-lived HttpOnly entitlement and redirects cleanly");
assert(entitlement.includes("timingSafeEqual") && entitlement.includes("TOKEN_TTL_SECONDS") && entitlement.includes("ENTITLEMENT_SIGNING_SECRET") && entitlement.includes("createCipheriv") && entitlement.includes("createDecipheriv") && !entitlement.includes("encodedSessionId"), "entitlement is encrypted, signed, time-bounded, and never stores a recoverable session ID");
assert(entitlement.includes('Buffer.byteLength(secret, "utf8") >= 32'), "signing/encryption secrets require at least 32 bytes");
assert(success.includes("index: false") && success.includes("follow: false") && success.includes("verifyBlueprintCheckoutSession"), "success page is noindex/nofollow and server-verified");
assert(success.includes("BlueprintDownloadLink") && success.includes('const downloadHref = \"/api/download/longevity-blueprint\"') && !success.includes("session_id"), "success page exposes only a clean verified download route");
assert(buyButton.includes('trackGa4Event("begin_checkout"') && !buyButton.includes('trackGa4Event("purchase"'), "begin_checkout is emitted only after checkout URL creation");
assert(purchaseTracking.includes('trackGa4Event("purchase"') && purchaseTracking.includes("transaction_id") && !purchaseTracking.includes("trackEvent"), "purchase event is GA4-only until atomic first-party commerce ingestion exists");
assert(downloadTracking.includes('trackGa4Event("download_click"') && !downloadTracking.includes('trackGa4Event("download"'), "client event is download_click, not a false success event");
assert(serverAnalytics.includes('event_type: \"download_success\"') && download.indexOf("const response") < download.indexOf("await recordBlueprintDownloadSuccess"), "download_success is recorded only after the PDF response is constructed");
assert(serverAnalytics.includes("SERVER_COMMERCE_INGESTION_READY") && serverAnalytics.includes("if (!SERVER_COMMERCE_INGESTION_READY) return"), "server commerce ingestion is fail-closed behind an explicit readiness flag");
assert(checkout.includes("client_reference_id") && checkout.includes("serializeAttribution") && checkout.includes("attribution_version"), "checkout stores sanitized attribution metadata without PII");
assert(attribution.includes("CONTROLLED_SOURCES") && attribution.includes("CONTROLLED_MEDIA") && attribution.includes("campaign: \"\"") && !attribution.includes("utm_term") && !attribution.includes("utm_content") && attribution.includes("TextEncoder") && !attribution.includes("JSON.stringify(sanitizeAttribution(attribution)).slice(0, 500)"), "attribution is controlled, drops term/content, and never byte-truncated into invalid JSON");
assert(analytics.includes("safeAnalyticsPath") && analytics.includes("__sftGa4Queue") && !analytics.includes("window.location.href"), "analytics strips query/hash data and queues GA events until gtag is ready");
assert(googleAnalytics.includes("send_page_view: false") && googleAnalytics.includes('trackGa4Event("page_view"') && googleAnalytics.includes("page_location: window.location.origin + pathname") && !googleAnalytics.includes("page_location: window.location.href"), "GA uses explicit query-free pageviews with auto pageviews disabled");
assert(privacy.includes("Free-form campaign, term, and content values are discarded") && privacy.includes("Query strings, user-entered full URLs, and Stripe Checkout Session IDs are not sent to analytics"), "privacy copy matches attribution and analytics behavior");
assert(!guidePromo.toLowerCase().includes("free guide") && !guidePromo.includes(".pdf"), "paid guide promotion has no free framing or direct PDF link");
assert(!home.includes("SearchAction") && !home.includes("search_term_string"), "stale SearchAction markup is removed until a real search endpoint exists");
assert(robots.includes("sitemap") && sitemap.includes("/guides/longevity-blueprint"), "robots and sitemap expose the canonical guide surface");

console.log("Growth readiness checks passed: paid delivery, signed entitlement, privacy-safe analytics, attribution, and search surfaces.");
