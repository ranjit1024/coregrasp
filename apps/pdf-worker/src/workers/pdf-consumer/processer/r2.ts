import { reuGemini } from "./ai";
import { PdfJob, type GeiminmiResult } from "../../../shared/types";
import { Context } from "hono";
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
  
  const result: GeiminmiResult = await reuGemini(buffer, env);

  await env.PDF_BUCKET.put(
    `${key}.result.json`,
    JSON.stringify({
      statu: "done",
      processedAt: new Date().toISOString(),
      result
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