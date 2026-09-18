const STORAGE_KEY = "_sft_first_touch_v1";
const MAX_VALUE_LENGTH = 80;

export type FirstTouchAttribution = {
  source: string;
  medium: string;
  campaign: string;
  landingPath: string;
  referrerHost: string;
  capturedAt: string;
};

const EMPTY_ATTRIBUTION: FirstTouchAttribution = {
  source: "direct",
  medium: "none",
  campaign: "",
  landingPath: "/",
  referrerHost: "",
  capturedAt: ""
};

function sanitizeValue(value: unknown, maxLength = MAX_VALUE_LENGTH): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[^a-zA-Z0-9._~:/?&=%+\- ]/g, "")
    .trim()
    .slice(0, maxLength);
}

function sanitizePath(value: unknown): string {
  const path = sanitizeValue(value, 160);
  if (!path.startsWith("/") || path.startsWith("//")) return "/";
  return path.split(/[?#]/, 1)[0] || "/";
}

function sanitizeHost(value: unknown): string {
  const host = sanitizeValue(value, 120).toLowerCase();
  return /^[a-z0-9.-]+$/.test(host) ? host : "";
}

function sanitizeMarketingValue(value: unknown, maxLength = MAX_VALUE_LENGTH): string {
  return sanitizeValue(value, maxLength).replace(/[^a-zA-Z0-9._~-]/g, "");
}

const CONTROLLED_SOURCES = new Set([
  "bing",
  "direct",
  "duckduckgo",
  "facebook",
  "google",
  "instagram",
  "linkedin",
  "newsletter",
  "referral",
  "tiktok",
  "youtube"
]);
const CONTROLLED_MEDIA = new Set([
  "cpc",
  "email",
  "none",
  "organic",
  "referral",
  "social"
]);
const CONTROLLED_REFERRER_HOSTS = new Set([
  "bing.com",
  "duckduckgo.com",
  "facebook.com",
  "google.com",
  "instagram.com",
  "linkedin.com",
  "tiktok.com",
  "t.co",
  "youtube.com"
]);

function isControlledHost(host: string): boolean {
  return CONTROLLED_REFERRER_HOSTS.has(host) ||
    [...CONTROLLED_REFERRER_HOSTS].some((allowed) => host.endsWith(`.${allowed}`));
}

function getReferrerHost(referrer: string): string {
  if (!referrer) return "";

  try {
    return sanitizeHost(new URL(referrer).hostname);
  } catch {
    return "";
  }
}

export function sanitizeAttribution(input: unknown): FirstTouchAttribution {
  const value = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const sourceCandidate = sanitizeMarketingValue(value.source).toLowerCase();
  const mediumCandidate = sanitizeMarketingValue(value.medium).toLowerCase();
  const referrerCandidate = sanitizeHost(value.referrerHost);

  return {
    // Only controlled labels enter Stripe metadata. Unknown client-provided
    // labels are rejected rather than treated as trusted attribution.
    source: CONTROLLED_SOURCES.has(sourceCandidate) ? sourceCandidate : "direct",
    medium: CONTROLLED_MEDIA.has(mediumCandidate) ? mediumCandidate : "none",
    // Campaign names are client-controlled and may contain identifying data;
    // keep the envelope honest until a signed campaign registry exists.
    campaign: "",
    landingPath: sanitizePath(value.landingPath),
    referrerHost: isControlledHost(referrerCandidate) ? referrerCandidate : "",
    capturedAt: ""
  };
}

function readStoredAttribution(): FirstTouchAttribution | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return sanitizeAttribution(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function captureFirstTouchAttribution(): FirstTouchAttribution {
  if (typeof window === "undefined") return EMPTY_ATTRIBUTION;

  const stored = readStoredAttribution();
  if (stored) return stored;

  const params = new URLSearchParams(window.location.search);
  const referrerHost = getReferrerHost(document.referrer);
  const attribution = sanitizeAttribution({
    source: params.get("utm_source") || referrerHost || "direct",
    medium: params.get("utm_medium") || (referrerHost ? "referral" : "none"),
    campaign: params.get("utm_campaign"),
    landingPath: window.location.pathname,
    referrerHost,
  });

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution is optional and must never block the core journey.
  }

  return attribution;
}

export function getFirstTouchAttribution(): FirstTouchAttribution {
  return readStoredAttribution() ?? captureFirstTouchAttribution();
}

export function serializeAttribution(attribution: FirstTouchAttribution): string {
  const safe = sanitizeAttribution(attribution);
  const bounded = {
    source: sanitizeMarketingValue(safe.source, 24),
    medium: sanitizeMarketingValue(safe.medium, 24),
    campaign: sanitizeMarketingValue(safe.campaign, 40),
    landingPath: sanitizePath(safe.landingPath).slice(0, 90),
    referrerHost: sanitizeHost(safe.referrerHost).slice(0, 48),
  };
  const serialized = JSON.stringify(bounded);

  // All fields are allowlisted and bounded before serialization. Never byte-
  // truncate JSON, which could create invalid Stripe metadata.
  if (new TextEncoder().encode(serialized).length <= 500) return serialized;

  const compact = JSON.stringify({
    source: bounded.source,
    medium: bounded.medium,
    campaign: bounded.campaign,
    landingPath: bounded.landingPath,
    referrerHost: bounded.referrerHost
  });
  return compact;
}

export function buildClientReferenceId(attribution: FirstTouchAttribution): string {
  const source = sanitizeValue(attribution.source, 32).replace(/[^a-zA-Z0-9._~-]/g, "_");
  const campaign = sanitizeValue(attribution.campaign, 48).replace(/[^a-zA-Z0-9._~-]/g, "_");
  return `sft_${source || "direct"}${campaign ? `_${campaign}` : ""}`.slice(0, 200);
}
