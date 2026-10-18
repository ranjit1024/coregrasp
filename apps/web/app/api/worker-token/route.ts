import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const encoder = new TextEncoder();
const TOKEN_TTL_SECONDS = 300;

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return base64UrlEncode(new Uint8Array(signature));
}

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.WORKER_API_SECRET;
  if (!secret) {
    console.error("WORKER_API_SECRET is not set");
    return Response.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const payload = JSON.stringify({ userId: session.user.id, exp: expiresAt });
  const payloadB64 = base64UrlEncode(encoder.encode(payload));
  const signature = await sign(payloadB64, secret);

  return Response.json({
    token: `${payloadB64}.${signature}`,
    expiresIn: TOKEN_TTL_SECONDS,
  });
}
