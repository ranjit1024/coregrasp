import { Bindings } from "../../../shared/types";

export async function sendQuizEmail(
    env: Bindings,
    to: string,
    quizUrl: string,
    title: string
) {
    const link = `https://coregrasp.app/quiz/${encodeURIComponent(quizUrl)}`;

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: "CoreGrasp quiz@coregrasp.com",
            to: [to],
            subject: `Quiz ready: ${title}`,
            html: `
                <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
                    <h2>Your quiz is ready</h2>
                    <p>A short quiz was generated for <b>${title}</b>. Click below to attempt it.</p>
                    <a href="${link}" style="display:inline-block;padding:10px 20px;background:#111;color:#fff;border-radius:6px;text-decoration:none;">
                        Attempt Quiz
                    </a>
                    <p style="color:#888;font-size:12px;margin-top:20px;">
                        This link works without logging in. Anyone with the link can attempt it.
                    </p>
                </div>
            `,
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Resend failed: ${res.status} ${err}`);
    }

    return res.json();
}