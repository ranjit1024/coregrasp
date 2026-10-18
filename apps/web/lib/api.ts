const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.ranjitdas2048.workers.dev";

export function apiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function wsUrl(path: string): string {
  const url = new URL(apiUrl(path));
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}

let tokenCache: { token: string; expiresAt: number } | null = null;

async function requestWorkerToken(): Promise<string> {
  const res = await fetch("/api/worker-token", { method: "POST" });
  if (!res.ok) {
    throw new Error(`Failed to obtain worker token (${res.status})`);
  }
  const data = (await res.json()) as { token: string; expiresIn: number };
  tokenCache = {
    token: data.token,
    expiresAt: Date.now() + Math.max(0, data.expiresIn - 30) * 1000,
  };
  return data.token;
}

export async function getWorkerToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }
  return requestWorkerToken();
}

export async function authHeaders(): Promise<Record<string, string>> {
  return { Authorization: `Bearer ${await getWorkerToken()}` };
}
