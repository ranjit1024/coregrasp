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
        <div className="w-full">
            <h3 className="text-lg font-semibold mb-1 text-zinc-900 dark:text-zinc-50">Share this assessment</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
                Send an access link directly to a team member's inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2.5 rounded-lg text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-shadow"
                    disabled={status === "sending"}
                />
                <button
                    onClick={handleSend}
                    disabled={status === "sending" || !email}
                    className="shrink-0 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                >
                    {status === "sending" ? "Sending..." : "Send Link"}
                </button>
            </div>

            {status === "sent" && (
                <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-lg flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Quiz link sent successfully.</p>
                </div>
            )}
            {status === "error" && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-red-700 dark:text-red-400 text-sm font-medium">{errorMsg}</p>
                </div>
            )}
        </div>
    );
}