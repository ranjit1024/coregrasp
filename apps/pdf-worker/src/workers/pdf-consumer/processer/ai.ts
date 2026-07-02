import { GeiminmiResult, } from "../../../shared/types";
import { extractText, getDocumentProxy } from "unpdf";

const TEXT_MODEL = "@cf/zai-org/glm-4.7-flash";

export async function reuGemini(
    buffer: ArrayBuffer,
    env: { AI: Ai }
): Promise<GeiminmiResult> {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });

    const prompt = `Analyze this document and return ONLY a JSON object with no markdown, no backticks, just raw JSON:
{
  "summary": "2-3 sentence summary of the document",
  "topics": ["main topic 1", "topic 2"],
  "entities": ["person/org/place mentioned"]
}
Document:
${text.slice(0, 20000)}`;

    const response = await env.AI.run(TEXT_MODEL, {
        messages: [{ role: "user", content: prompt }],
    });

    const raw = (response as { response?: string }).response ?? "";

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