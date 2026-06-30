import { PdfJob } from "../../shared/types";
import { processMessage } from "./processer/r2";

type Env = {
  PDF_BUCKET: R2Bucket;
  GEMINI_API_KEY: string;
};

export default {
    async queue(batch:MessageBatch<PdfJob>, env:Env):Promise<void>{
        console.log(`Processing batach of ${batch.messages.length} message`)
        await Promise.allSettled(
            batch.messages.map(async (message)=>{
                const {key, uploadedAt} = message.body;
                console.log(`Processing Job ${key} uploaded ${uploadedAt}`);
                try{
                    await processMessage(message.body, env);
                    message.ack();
                } catch (err){
                    console.error(`Failed job ${key}`, err);
                    message.retry();
                }
            })   
        )
    }
}  