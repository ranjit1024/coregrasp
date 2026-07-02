import { GeiminmiResult } from "../../../shared/types";
import { extractText, getDocumentProxy } from "unpdf";

const TEXT_MODEL = "@cf/meta/llama-3.2-3b-instruct";

async function runWithRetry(
    env: { AI: Ai },
    prompt: string,
    attempts = 1
): Promise<any> {
    let lastErr: unknown;
    for (let i = 0; i < attempts; i++) {
        try {
            const t0 = Date.now();
            const result = await env.AI.run(TEXT_MODEL, {
                messages: [{ role: "user", content: prompt }],
                max_tokens: 600,
            });
            console.log(`AI call took ${Date.now() - t0}ms`);
            console.log("AI raw response object:", JSON.stringify(result));
            return result;
        } catch (err) {
            lastErr = err;
            console.warn(`AI call attempt ${i + 1} failed`, err);
        }
    }
    throw lastErr;
}

export async function reuGemini(
    buffer: ArrayBuffer,
    env: { AI: Ai }
): Promise<GeiminmiResult> {
    const t0 = Date.now();
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    console.log(`Extraction took ${Date.now() - t0}ms, length: ${text.length}`);

    const prompt = `Analyze this document and return ONLY a JSON object with no markdown, no backticks, just raw JSON:
{
  "summary": "2-3 sentence summary of the document",
  "topics": ["main topic 1", "topic 2"],
  "entities": ["person/org/place mentioned"]
}
Document:
${text.slice(0, 5000)}`;

    const response = await runWithRetry(env, prompt);

    const raw = response?.response ?? "";

    try {
        const parsed = JSON.parse(raw);
        return { ...parsed, raw };
    } catch {
        return {
            summery: raw,
            topics: [],
            entities: [],
            raw,
        };
    }
}