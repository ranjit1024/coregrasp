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
