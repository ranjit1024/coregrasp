import { Bindings, MCQ, MCQResult } from "../../../shared/types";
import { extractText, getDocumentProxy } from "unpdf";

const TEXT_MODEL = "@cf/openai/gpt-oss-20b";
const numQuestions = 5;
const estimatedTokens = Math.min(4096, 300 * numQuestions + 200);

async function runWithRetry(
    env: Bindings,
    prompt: string,
    attempts = 1
): Promise<any> {
    let lastErr: unknown;
    for (let i = 0; i < attempts; i++) {
        try {
            const t0 = Date.now();
            const result = await env.AI.run(TEXT_MODEL, {
                messages: [{ role: "user", content: prompt }],
                max_tokens: estimatedTokens,
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

function stripFences(raw: string): string {
    return raw
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();
}


function closeUnmatchedBrackets(str: string): string {
    let fixed = str.trim().replace(/,\s*$/, "");
    const stack: string[] = [];
    let inString = false;
    let escapeNext = false;

    for (let i = 0; i < fixed.length; i++) {
        const ch = fixed[i];
        if (escapeNext) { escapeNext = false; continue; }
        if (ch === "\\") { escapeNext = true; continue; }
        if (ch === '"') { inString = !inString; continue; }
        if (inString) continue;
        if (ch === "{" || ch === "[") stack.push(ch);
        else if (ch === "}" || ch === "]") stack.pop();
    }

    let closing = "";
    while (stack.length) closing += stack.pop() === "{" ? "}" : "]";
    return fixed + closing;
}

function safeParseJson(cleaned: string): any | null {
    try {
        return JSON.parse(cleaned);
    } catch {
        try {
            const repaired = closeUnmatchedBrackets(cleaned);
            console.warn("Plain parse failed, used bracket repair");
            return JSON.parse(repaired);
        } catch (err) {
            console.error("Repair also failed. Raw:", cleaned);
            return null;
        }
    }
}

export async function generateMcqs(
    buffer: ArrayBuffer,
    env: Bindings,
): Promise<MCQResult> {
    const t0 = Date.now();
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    console.log(`Extraction took ${Date.now() - t0}ms, length: ${text.length}`);

    const prompt = `You are a quiz generator. Read the document below and create exactly ${numQuestions} multiple-choice questions that test understanding of its key facts and concepts.

Rules:
- Each question must have exactly 4 options.
- Only one option is correct.
- Avoid trivial or ambiguous questions.
- Base every question strictly on the document content, not outside knowledge.

Return ONLY a JSON object with no markdown, no backticks, no commentary — just raw JSON in this exact shape:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "short reason why this is correct"
    }
  ]
}

Document:
${text.slice(0, 6000)}`;

    const response = await runWithRetry(env, prompt);
    const raw = response?.response ?? "";
    const rawString = typeof raw === "string" ? raw : JSON.stringify(raw);
    const cleaned = stripFences(rawString);

    const parsed = safeParseJson(cleaned);
    const questions: MCQ[] = Array.isArray(parsed?.questions) ? parsed.questions : [];

    return { questions, raw: rawString };
}