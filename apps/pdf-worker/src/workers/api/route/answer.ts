import { Context } from "hono";
import { createPrismaClient } from "../lib/db";
import { Bindings } from "../../../shared/types";

export async function get_url(c: Context<{ Bindings: Bindings }>) {
    const url = c.req.param("url");

    const prisma = createPrismaClient(c.env.HYPERDRIVE.connectionString);

    const ans = await prisma.policy.findFirst({
        where: { url: url }
    });
    console.log(ans);
    if (!ans) {
        return c.json({ error: "Not found" }, 404);
    }

    const object = await c.env.PDF_BUCKET.get(ans.key);

    if (!object) {
        return c.json({ error: "File not found in R2" }, 404);
    }

    const body = await object.arrayBuffer(); 

    return c.json({
        answer: ans,
        file: Array.from(new Uint8Array(body))
    });
}