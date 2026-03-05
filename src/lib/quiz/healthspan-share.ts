import type { HealthspanSharePayload } from "@/lib/quiz/healthspan-types";

function encodeBase64Url(value: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(value, "utf8").toString("base64url");
  }

  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(value, "base64url").toString("utf8");
  }

  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(`${normalized}${padding}`);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeHealthspanSharePayload(payload: HealthspanSharePayload) {
  return encodeBase64Url(JSON.stringify(payload));
}

export function decodeHealthspanSharePayload(shareId: string): HealthspanSharePayload | null {
  try {
    const decoded = decodeBase64Url(shareId);
    const parsed = JSON.parse(decoded) as HealthspanSharePayload;

    if (parsed.v !== 1 || !parsed.result || typeof parsed.result !== "object") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
