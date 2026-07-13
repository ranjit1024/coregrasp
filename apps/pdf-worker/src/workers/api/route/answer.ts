import { Context } from "hono";
import { createPrismaClient } from "../lib/db";
import { Bindings } from "../../../shared/types";

export async function get_url(c: Context<{ Bindings: Bindings }>) {
    const url = c.req.param("url");

    const prisma = createPrismaClient(c.env.HYPERDRIVE.connectionString);

    const ans = await prisma.policy.findFirst({
        where: { url: url }
    });

    if (!ans) {
        return c.json({ error: "Not found" }, 404);
    }

    const object = await c.env.PDF_BUCKET.get(`${ans.key}.result.json`);

    if (!object) {
        return c.json({ error: "File not found in R2" }, 404);
    }

    const resultData = await object.json(); 

    return c.json({
        answer: ans,
        result: resultData,
    });
}