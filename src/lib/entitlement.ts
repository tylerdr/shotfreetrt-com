import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual
} from "crypto";

const ENTITLEMENT_TOKEN_VERSION = "v2";
const STATE_TOKEN_VERSION = "state1";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
const STATE_TTL_SECONDS = 60 * 15;

export const BLUEPRINT_ENTITLEMENT_COOKIE = "sft_blueprint_entitlement";
export const CHECKOUT_STATE_COOKIE = "sft_checkout_state";

type EntitlementPayload = {
  sessionId: string;
  issuedAt: number;
  expiresAt: number;
};

export type CheckoutStatePayload = {
  nonce: string;
  issuedAt: number;
  expiresAt: number;
};

function getSigningSecret(): string | null {
  const secret =
    process.env.ENTITLEMENT_SIGNING_SECRET?.trim() ||
    process.env.STRIPE_SECRET_KEY?.trim() ||
    "";

  return Buffer.byteLength(secret, "utf8") >= 32 ? secret : null;
}

function getEncryptionKey(): Buffer | null {
  const secret = getSigningSecret();
  return secret ? createHash("sha256").update(secret).digest() : null;
}

function sign(value: string): string | null {
  const secret = getSigningSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeNumber(value: string): number | null {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function isSessionId(value: string): boolean {
  return /^cs_[A-Za-z0-9_]+$/.test(value) && value.length <= 200;
}

function isNonce(value: string): boolean {
  return /^[a-f0-9]{32}$/.test(value);
}

function verifySignature(unsigned: string, encodedSignature: string): boolean {
  const expectedSignature = sign(unsigned);
  if (!expectedSignature) return false;

  const received = Buffer.from(encodedSignature, "base64url");
  const expected = Buffer.from(expectedSignature, "base64url");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

/**
 * The entitlement cookie is encrypted with AES-GCM. It is intentionally not a
 * recoverable/base64 representation of the Stripe session ID; only this
 * server-side module can decrypt it after validating the authenticated tag.
 */
export function createBlueprintEntitlementToken(
  sessionId: string,
  now = Math.floor(Date.now() / 1000)
): string | null {
  if (!isSessionId(sessionId)) return null;

  const key = getEncryptionKey();
  if (!key) return null;

  const issuedAt = now;
  const expiresAt = now + TOKEN_TTL_SECONDS;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(sessionId, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  const unsigned = [
    ENTITLEMENT_TOKEN_VERSION,
    issuedAt,
    expiresAt,
    iv.toString("base64url"),
    tag.toString("base64url"),
    ciphertext.toString("base64url")
  ].join(".");
  const signature = sign(unsigned);

  return signature ? `${unsigned}.${signature}` : null;
}

export function verifyBlueprintEntitlementToken(
  token: string | null | undefined,
  now = Math.floor(Date.now() / 1000)
): EntitlementPayload | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 7 || parts[0] !== ENTITLEMENT_TOKEN_VERSION) return null;

  const issuedAt = safeNumber(parts[1]);
  const expiresAt = safeNumber(parts[2]);
  if (issuedAt === null || expiresAt === null) return null;
  if (issuedAt > now + 60 || expiresAt <= now || expiresAt - issuedAt > TOKEN_TTL_SECONDS) {
    return null;
  }

  const unsigned = parts.slice(0, 6).join(".");
  if (!verifySignature(unsigned, parts[6])) return null;

  const key = getEncryptionKey();
  if (!key) return null;

  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(parts[3], "base64url")
    );
    decipher.setAuthTag(Buffer.from(parts[4], "base64url"));
    const sessionId = Buffer.concat([
      decipher.update(Buffer.from(parts[5], "base64url")),
      decipher.final()
    ]).toString("utf8");

    return isSessionId(sessionId) ? { sessionId, issuedAt, expiresAt } : null;
  } catch {
    return null;
  }
}

export function createCheckoutStateToken(
  now = Math.floor(Date.now() / 1000)
): { token: string; nonce: string } | null {
  const nonce = randomBytes(16).toString("hex");
  const issuedAt = now;
  const expiresAt = now + STATE_TTL_SECONDS;
  const unsigned = [STATE_TOKEN_VERSION, issuedAt, expiresAt, nonce].join(".");
  const signature = sign(unsigned);

  return signature ? { token: `${unsigned}.${signature}`, nonce } : null;
}

export function verifyCheckoutStateToken(
  token: string | null | undefined,
  now = Math.floor(Date.now() / 1000)
): CheckoutStatePayload | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 5 || parts[0] !== STATE_TOKEN_VERSION) return null;

  const issuedAt = safeNumber(parts[1]);
  const expiresAt = safeNumber(parts[2]);
  if (issuedAt === null || expiresAt === null || !isNonce(parts[3])) return null;
  if (issuedAt > now + 60 || expiresAt <= now || expiresAt - issuedAt > STATE_TTL_SECONDS) {
    return null;
  }

  return verifySignature(parts.slice(0, 4).join("."), parts[4])
    ? { nonce: parts[3], issuedAt, expiresAt }
    : null;
}

/** Stable non-authorizing order token for analytics and de-duplication. */
export function createBlueprintOrderToken(sessionId: string): string | null {
  const signature = sign(`order:${sessionId}`);
  return signature ? `ord_${signature.slice(0, 32)}` : null;
}

export const BLUEPRINT_ENTITLEMENT_TTL_SECONDS = TOKEN_TTL_SECONDS;
export const CHECKOUT_STATE_TTL_SECONDS = STATE_TTL_SECONDS;
