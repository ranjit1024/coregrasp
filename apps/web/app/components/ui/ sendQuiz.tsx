"use client";
import { useState } from "react";

export function SendQuizForm({ policyUrl }: { policyUrl: string }) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSend() {
        setStatus("sending");
        setErrorMsg("");
        try {
            const res = await fetch(`https://api.ranjitdas2048.workers.dev/send-quiz`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ policyUrl, recipientEmail: email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error ?? "Something went wrong");
                setStatus("error");
                return;
            }

            setStatus("sent");
            setEmail("");
        } catch {
            setErrorMsg("Network error, try again");
            setStatus("error");
        }
    }

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm max-w-md">
            <h3 className="font-semibold mb-3 text-gray-800">Send quiz to someone</h3>

            <div className="flex gap-2">
                <input
                    type="email"
                    placeholder="ranjitdas2048@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={status === "sending"}
                />
                <button
                    onClick={handleSend}
                    disabled={status === "sending" || !email}
                    className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                >
                    {status === "sending" ? "Sending..." : "Send"}
                </button>
            </div>

            {status === "sent" && (
                <p className="text-green-600 text-sm mt-2">✓ Quiz link sent to that email</p>
            )}
            {status === "error" && (
                <p className="text-red-600 text-sm mt-2">✗ {errorMsg}</p>
            )}
        </div>
    );
}