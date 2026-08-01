import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const dynamic = "force-dynamic";

const handlers = toNextJsHandler(auth);

export async function GET(req: Request) {
  try {
    return await handlers.GET(req);
  } catch (err) {
    console.error("BETTER_AUTH_GET_ERROR", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    return await handlers.POST(req);
  } catch (err) {
    console.error("BETTER_AUTH_POST_ERROR", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}