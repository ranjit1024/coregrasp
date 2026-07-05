import { createPrismaClient } from "@revisly/db";
import { PdfJob } from "../../shared/types";
import { processMessage } from "./processer/r2";

type Env = {
  PDF_BUCKET: R2Bucket;
  AI: Ai;
  DATABASE_URL:string;
};

export default {
    async queue(batch: MessageBatch<PdfJob>, env: Env): Promise<void> {
        console.log(`Processing batch of ${batch.messages.length} messages`);
        await Promise.allSettled(
            batch.messages.map(async (message) => {
                const { key, uploadedAt } = message.body;
                const prisma =  createPrismaClient(env.DATABASE_URL);
                console.log(`Processing Job ${key} uploaded ${uploadedAt}`);
                try {
                    await prisma.policy.update({
                        where:{key},
                        data:{status:"PROCESSING"}
                    })
                    await processMessage(message.body, env);
                    await prisma.policy.update({
                        where: {key},
                        data:{
                            status:"READY"
                        }
                    })
                    message.ack();
                } catch (err) {
                    console.error(`Failed job ${key}`, err);
                    await prisma.policy.update({
                        where:{key},
                        data: {
                            status:"FAILED"
                        }
                    })
                    message.retry();
                }
            })
        );
    }
};