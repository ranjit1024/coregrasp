import { Context } from "hono";
import { createPrismaClient } from "../lib/db";
import { sendQuizEmail } from "../lib/email";
import { Bindings } from "../../../shared/types";

export async function send_quiz(c: Context<{ Bindings: Bindings }>) {
    const { policyUrl, recipientEmail } = await c.req.json<{
        policyUrl: string;
        recipientEmail: string;
    }>();

    if (!policyUrl || !recipientEmail) {
        return c.json({ error: "policyUrl and recipientEmail required" }, 400);
    }

    const prisma = createPrismaClient(c.env.HYPERDRIVE.connectionString);
    const policy = await prisma.policy.findFirst({ where: { url: policyUrl } });
    if (!policy) return c.json({ error: "Policy not found" }, 404);


    const quizObject = await c.env.PDF_BUCKET.head(`${policy.key}.result.json`);
    if (!quizObject) {
        return c.json({ error: "Quiz not generated yet for this policy" }, 404);
    }

    await sendQuizEmail(c.env, recipientEmail, policyUrl, policy.name ?? policyUrl);

    return c.json({
        sent: true,
        quizUrl: `https://coregrasp.app/quiz/${encodeURIComponent(policyUrl)}`,
    });
}