"use client";

import { useEffect, useState, useCallback } from "react";
import Papa from "papaparse";
import { getuserId } from "@/lib/userId";

type Row = Record<string, string>;

const EMAIL_KEYS = ["email", "email address", "e-mail", "primary email"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function findEmailKey(fields: string[]): string | null {
    const lower = fields.map((f) => f.toLowerCase().trim());
    for (const candidate of EMAIL_KEYS) {
        const idx = lower.indexOf(candidate);
        if (idx !== -1) return fields[idx];
    }
    const idx = lower.findIndex((f) => f.includes("email"));
    return idx !== -1 ? fields[idx] : null;
}

async function parseCsv(file: File): Promise<string[]> {
    return new Promise((resolve, reject) => {
        Papa.parse<Row>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const fields = results.meta.fields ?? [];
                const emailKey = findEmailKey(fields);
                if (!emailKey) {
                    reject(new Error(`No email column found. Headers: ${fields.join(", ") || "none"}`));
                    return;
                }
                const emails = results.data
                    .map((row) => row[emailKey]?.trim())
                    .filter((e): e is string => !!e && EMAIL_RE.test(e));
                resolve([...new Set(emails)]);
            },
            error: reject,
        });
    });
}

async function parsePdf(file: File): Promise<string[]> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://api.ranjitdas2048.workers.dev/extract-pdf-emails", {
        method: "POST",
        body: formData,
    });
    if (!res.ok) throw new Error(`PDF extraction failed (${res.status})`);

    const data = (await res.json()) as { emails: string[] };
    return [...new Set(data.emails.filter((e) => EMAIL_RE.test(e)))];
}

export function SendQuizForm({ policyUrl }: { policyUrl: string }) {
    const [mode, setMode] = useState<"single" | "bulk">("single");
    const [userId, setUserId] = useState<string>();

    // Single-send state
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    // Bulk-send state
    const [bulkEmails, setBulkEmails] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string | null>(null);
    const [parsing, setParsing] = useState(false);
    const [bulkStatus, setBulkStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
    const [bulkProgress, setBulkProgress] = useState(0);
    const [bulkFailed, setBulkFailed] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        async function loadEmail() {
            try {
                const result = await getuserId();
                if (result?.id) setUserId(result.id);
            } catch (error) {
                console.error("Failed to fetch user ID:", error);
            }
        }
        loadEmail();
    }, []);

    async function handleSend(e?: React.FormEvent) {
        if (e) e.preventDefault();
        if (!email || status === "sending") return;

        setStatus("sending");
        setErrorMsg("");
        try {
            const res = await fetch(`https://api.ranjitdas2048.workers.dev/send-quiz`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ policyUrl, recipientEmail: email, userId }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error ?? "Something went wrong");
                setStatus("error");
                return;
            }

            setStatus("sent");
            setEmail("");
            // Auto-reset success message after 3 seconds
            setTimeout(() => setStatus("idle"), 3000);
        } catch {
            setErrorMsg("Network error, please try again.");
            setStatus("error");
        }
    }

    const handleFile = useCallback(async (file: File) => {
        setFileName(file.name);
        setParsing(true);
        setBulkFailed([]);
        setBulkStatus("idle");
        try {
            const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
            const emails = isPdf ? await parsePdf(file) : await parseCsv(file);
            setBulkEmails(emails);
        } catch (err) {
            setBulkEmails([]);
            setFileName(null);
            alert(err instanceof Error ? err.message : "Failed to parse file");
        } finally {
            setParsing(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    async function handleBulkSend() {
        setBulkStatus("sending");
        setBulkProgress(0);
        const failed: string[] = [];
        const CONCURRENCY = 5;
        let index = 0;

        async function worker() {
            while (index < bulkEmails.length) {
                const current = bulkEmails[index++];
                try {
                    const res = await fetch(`https://api.ranjitdas2048.workers.dev/send-quiz`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ policyUrl, recipientEmail: current, userId }),
                    });
                    if (!res.ok) throw new Error();
                } catch {
                    failed.push(current);
                }
                setBulkProgress((p) => p + 1);
            }
        }

        await Promise.all(Array.from({ length: CONCURRENCY }, worker));
        setBulkFailed(failed);
        setBulkStatus("done");
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Share Assessment</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        {mode === "single"
                            ? "Send an access link directly to a team member's inbox."
                            : "Upload a CSV or PDF to send links to multiple people at once."}
                    </p>
                </div>
                <div className="flex shrink-0 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1 bg-zinc-50 dark:bg-zinc-900/50">
                    <button
                        onClick={() => setMode("single")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                            mode === "single"
                                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                    >
                        Single
                    </button>
                    <button
                        onClick={() => setMode("bulk")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                            mode === "bulk"
                                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                    >
                        Bulk
                    </button>
                </div>
            </div>

            {/* Single Mode */}
            {mode === "single" ? (
                <div className="space-y-4">
                    <form onSubmit={handleSend} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                                disabled={status === "sending"}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === "sending" || !email}
                            className="shrink-0 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                        >
                            {status === "sending" ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                "Send Link"
                            )}
                        </button>
                    </form>

                    {/* Feedback Messages */}
                    {status === "sent" && (
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-1 rounded-full">
                                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Quiz link sent successfully.</p>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="bg-red-100 dark:bg-red-900/50 p-1 rounded-full">
                                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <p className="text-red-700 dark:text-red-400 text-sm font-medium">{errorMsg}</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Bulk Mode */
                <div className="space-y-4">
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => document.getElementById("bulk-file-input")?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3
                            ${isDragging 
                                ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900/50" 
                                : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                            }`}
                    >
                        <input
                            id="bulk-file-input"
                            type="file"
                            accept=".csv,application/pdf"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    handleFile(file);
                                    e.target.value = ""; // Reset input so same file can be re-selected
                                }
                            }}
                        />
                        <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                            <svg className="w-6 h-6 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                {fileName ?? "Click to upload or drag and drop"}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">CSV or PDF (Max 10MB)</p>
                        </div>
                    </div>

                    {parsing && (
                        <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 py-4">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Extracting emails...
                        </div>
                    )}

                    {!parsing && bulkEmails.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                    {bulkEmails.length} recipient{bulkEmails.length !== 1 && "s"} ready
                                </span>
                            </div>

                            <div className="max-h-48 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-zinc-50/50 dark:bg-zinc-900/20 shadow-inner">
                                {bulkEmails.slice(0, 50).map((e, i) => (
                                    <div key={i} className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {e}
                                    </div>
                                ))}
                                {bulkEmails.length > 50 && (
                                    <div className="px-4 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-900 text-center sticky bottom-0 border-t border-zinc-200 dark:border-zinc-800">
                                        + {bulkEmails.length - 50} more recipients hidden
                                    </div>
                                )}
                            </div>

                            {bulkStatus === "sending" && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium text-zinc-500">
                                        <span>Sending in progress...</span>
                                        <span>{Math.round((bulkProgress / bulkEmails.length) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="bg-zinc-900 dark:bg-zinc-100 h-2 rounded-full transition-all duration-300 ease-out" 
                                            style={{ width: `${(bulkProgress / bulkEmails.length) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleBulkSend}
                                disabled={bulkStatus === "sending" || bulkStatus === "done"}
                                className="w-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-5 py-3 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
                            >
                                {bulkStatus === "sending"
                                    ? `Sending... (${bulkProgress}/${bulkEmails.length})`
                                    : bulkStatus === "done" 
                                        ? "Campaign Finished"
                                        : `Send to ${bulkEmails.length} Recipients`}
                            </button>
                        </div>
                    )}

                    {bulkStatus === "done" && (
                        <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-lg animate-in zoom-in-95">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-1.5 rounded-full">
                                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h4 className="text-emerald-800 dark:text-emerald-300 font-semibold">Sending Complete</h4>
                            </div>
                            <p className="text-emerald-700 dark:text-emerald-400 text-sm ml-10">
                                Successfully sent {bulkEmails.length - bulkFailed.length} of {bulkEmails.length} links.
                            </p>
                            
                            {bulkFailed.length > 0 && (
                                <div className="ml-10 mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60">
                                    <p className="text-red-600 dark:text-red-400 text-xs font-semibold mb-1">
                                        Failed ({bulkFailed.length}):
                                    </p>
                                    <p className="text-red-500 dark:text-red-400/80 text-xs leading-relaxed">
                                        {bulkFailed.join(", ")}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}