import { Context } from "hono";
import { createPrismaClient } from "../lib/db";
import { sendQuizEmail } from "../lib/email";
import { Bindings } from "../../../shared/types";

export async function send_quiz(c: Context<{ Bindings: Bindings }>) {
    const { userId, policyUrl, recipientEmail } = await c.req.json<{
        userId: string;
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

    try {
        const existing = await prisma.candidate.findUnique({
            where: { email_policyId: { email: recipientEmail, policyId: policy.id } },
        });

        if (existing?.attempt) {
            return c.json({ error: "This candidate has already completed this quiz" }, 409);
        }

        await sendQuizEmail(c.env, recipientEmail, policyUrl, policy.name ?? policyUrl);
        console.log(sendQuizEmail)
        await prisma.candidate.upsert({
            where: { email_policyId: { email: recipientEmail, policyId: policy.id } },
            update: { score: 0, attempt: false, userId },
            create: { email: recipientEmail, score: 0, userId, attempt: false, policyId: policy.id },
        });
    } catch (e) {
        console.error("sendQuizEmail failed:", e instanceof Error ? e.message : String(e));
        return c.json({ error: "Failed to send email", detail: e instanceof Error ? e.message : String(e) }, 502);
    }


    return c.json({
        sent: true,
        quizUrl: `http://localhost:3000/assessment/${encodeURIComponent(policyUrl)}`,
    });
}