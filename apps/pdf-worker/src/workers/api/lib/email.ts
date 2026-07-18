import { Bindings } from "../../../shared/types";

async function getAccessToken(env: Bindings): Promise<string> {
    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: env.GMAIL_CLIENT_ID,
            client_secret: env.GMAIL_CLIENT_SECRET,
            refresh_token: env.GMAIL_REFRESH_TOKEN,
            grant_type: "refresh_token",
        }),
    });

    if (!res.ok) {
        throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`);
    }

    const data = await res.json<{ access_token: string }>();
    return data.access_token;
}

function base64UrlEncode(str: string): string {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function sendQuizEmail(
    env: Bindings,
    to: string,
    quizUrl: string,
    title: string
) {
    const link = `https://coregrasp.app/quiz/${encodeURIComponent(quizUrl)}`;
    const from = "ranjitdas2048@gmail.com"; // your personal Gmail

    const subject = `Quiz ready: ${title}`;
    const html = `
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
    `;

    const messageParts = [
        `From: ${from}`,
        `To: ${to}`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "",
        html,
    ];
    const rawMessage = messageParts.join("\r\n");
    const encodedMessage = base64UrlEncode(rawMessage);

    const accessToken = await getAccessToken(env);

    const res = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ raw: encodedMessage }),
        }
    );

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gmail send failed: ${res.status} ${err}`);
    }

    return res.json();
}