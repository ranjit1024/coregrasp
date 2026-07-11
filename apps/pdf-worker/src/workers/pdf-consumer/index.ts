import { createPrismaClient } from "@revisly/db";
import { PdfJob, Bindings } from "../../shared/types";
import { processMessage } from "./processer/r2";

export default {
    async queue(batch: MessageBatch<PdfJob>, env: Bindings, ctx: ExecutionContext): Promise<void> {
        console.log(`Processing batch of ${batch.messages.length} messages`);
        await Promise.allSettled(
            batch.messages.map(async (message) => {
                const { key, uploadedAt } = message.body;
                const prisma = createPrismaClient(env.HYPERDRIVE.connectionString);
                console.log(`Processing Job ${key} uploaded ${uploadedAt}`);
                try {
                    await prisma.policy.update({ where: { key }, data: { status: "PROCESSING" } });
                    await processMessage(message.body, env); // pass env/bindings, not a Hono context
                    await prisma.policy.update({ where: { key }, data: { status: "READY" } });
                    await prisma.policy.update({where: {key}, data: {
                        url:`${key}.result.json`
                    }})
                    message.ack();
                } catch (err) {
                    console.error(`Failed job ${key}`, err);
                    await prisma.policy.update({ where: { key }, data: { status: "FAILED" } });
                    message.retry();
                }
            })
        );
    }
};