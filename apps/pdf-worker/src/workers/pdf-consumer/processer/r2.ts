import { generateMcqs,  } from "./ai";
import { PdfJob, type MCQResult } from "../../../shared/types";
import { Bindings } from "../../../shared/types";


export async function processMessage(job: PdfJob, env:Bindings) {
  const { key } = job;

  const object = await env.PDF_BUCKET.get(key);

  if (!object) {
    console.error("R2 Object not found", { key });
    throw new Error(`R2 Object not found: ${key}`);
    return;
  }
  const buffer = await object.arrayBuffer();
  const result : MCQResult = await generateMcqs(buffer, env);

  const finalResult = {
  
    mcq: result, 
};


  await env.PDF_BUCKET.put(
    `${key}.result.json`,
    JSON.stringify({
      
      processedAt: new Date().toISOString(),
      finalResult
    }),
    { httpMetadata: { contentType: "application/json" } }
  )
  console.log(`Processed and saved result for : ${key}`);


}


function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const CHUNK = 8192;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)));
  }
  return btoa(binary);
}