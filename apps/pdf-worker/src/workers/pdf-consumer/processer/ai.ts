import { GeiminmiResult, } from "../../../shared/types";

export async function reuGemini(base64: string,
    apiKey: string
): Promise<GeiminmiResult> {

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                inline_data: {
                                    mime_type: "application/pdf",
                                    data: base64,
                                },
                            },
                            {
                                text: `Analyze this PDF document and return ONLY a JSON object with no markdown, no backticks, just raw JSON:
{
  "summary": "2-3 sentence summary of the document",
  "topics": ["main topic 1", "topic 2"],
  "entities": ["person/org/place mentioned"]
}`,
                            },
                        ],
                    },
                ],
            }),
        }
    );
    if (!response.ok) {
    const errorBody = await response.text();
    console.error("Gemini error body:", errorBody);
    throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
}


    const data = await response.json() as {
        candidates: { content: { parts: { text: string }[] } }[];
    };


    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    try {
        const parsed = JSON.parse(raw);
        return { ...parsed, raw };
    }
    catch {
        return {
            summery: raw,
            topics: [],
            entities: [],
            raw
        }
    }
}