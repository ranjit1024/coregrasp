import { Context, Next } from "hono";
import { Bindings } from "../../../shared/types";

export type ApiVariables = { userId: string };

const encoder = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function verifyToken(
  token: string,
  secret: string
): Promise<{ userId: string } | null> {
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  if (!timingSafeEqual(base64UrlEncode(new Uint8Array(digest)), signature)) {
    return null;
  }

  let payload: { userId?: unknown; exp?: unknown };
  try {
    payload = JSON.parse(base64UrlDecode(payloadB64));
  } catch {
    return null;
  }

  if (typeof payload.userId !== "string" || !payload.userId) return null;
  if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return null;

  return { userId: payload.userId };
}

export async function requireUser(
  c: Context<{ Bindings: Bindings; Variables: ApiVariables }>,
  next: Next
) {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : c.req.query("token");

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const payload = await verifyToken(token, c.env.WORKER_API_SECRET);
  if (!payload) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("userId", payload.userId);
  await next();
}
