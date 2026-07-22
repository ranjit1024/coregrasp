import { Context } from "hono";
import { z } from "zod";
import { Bindings } from "../../../shared/types";
import { createPrismaClient } from "../lib/db";

const bodySchema = z.object({
    email: z.email(),
    score: z.coerce.number().int().min(0).max(10),
});

export async function update_score(c: Context<{ Bindings: Bindings }>) {
    const parsed = bodySchema.safeParse(await c.req.json());
    if (!parsed.success) {
        return c.json({ error: "Invalid payload" }, 400);
    }
    const { email, score } = parsed.data;

    const prisma = createPrismaClient(c.env.HYPERDRIVE.connectionString);

    try {
        const result = await prisma.candidate.updateMany({
            where: {
                email,
                attempt: false, 
            },
            data: {
                score,
                attempt: true,
            },
        });

        if (result.count === 0) {
            const exists = await prisma.candidate.findFirst({ where: { email } });
            if (!exists) return c.json({ error: "No assignment found" }, 404);
            return c.json({ error: "Already attempted" }, 409);
        }

        return c.json({ status: "updated" }, 200);
    } catch (err) {
        console.error("update_score failed:", err);
        return c.json({ error: "Internal error" }, 500);
    }
}