import { PdfJob } from "../../shared/types";
import { processMessage } from "./processer/r2";

type Env = {
  PDF_BUCKET: R2Bucket;
  AI: Ai;
};

export default {
    async queue(batch: MessageBatch<PdfJob>, env: Env): Promise<void> {
        console.log(`Processing batch of ${batch.messages.length} messages`);
        await Promise.allSettled(
            batch.messages.map(async (message) => {
                const { key, uploadedAt } = message.body;
                console.log(`Processing Job ${key} uploaded ${uploadedAt}`);
                try {
                    await processMessage(message.body, env);
                    message.ack();
                } catch (err) {
                    console.error(`Failed job ${key}`, err);
                    message.retry();
                }
            })
        );
    }
};