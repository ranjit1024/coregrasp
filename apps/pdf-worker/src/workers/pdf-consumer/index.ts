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
                    const res = await processMessage(message.body, env);
                    const category = res?.category;
                    await prisma.policy.update({
                        where: { key },
                        data: {
                            status: "READY",
                            url: `${key}.result.json`,
                            category,
                        },
                    });
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