import { Context } from "hono";
import { z } from "zod";
import { Bindings } from "../../../shared/types";
import { createPrismaClient } from "../lib/db";
import { pushNotification } from "../../../lib/notification";

const bodySchema = z.object({
    email: z.email(),
    score: z.coerce.number().int().min(0).max(100),
});

export async function update_score(c: Context<{ Bindings: Bindings }>) {
    const parsed = bodySchema.safeParse(await c.req.json());
    if (!parsed.success) {
        return c.json({ error: "Invalid payload" }, 400);
    }
    const { email, score } = parsed.data;

    const prisma = createPrismaClient(c.env.HYPERDRIVE.connectionString);
    const exists = await prisma.candidate.findFirst({ where: { email } });
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
        console.log(result)

        if (result.count === 0) {

            if (!exists) return c.json({ error: "No assignment found" }, 404);
            return c.json({ error: "Already attempted" }, 409);
        }
        await pushNotification(c.env, exists?.userId || "", {
             type: "QUIZ_COMPLETED",
            payload: { email, score },
        });
        return c.json({ status: "updated" }, 200);
    } catch (err) {
        console.error("update_score failed:", err);
        return c.json({ error: "Internal error" }, 500);
    }
}