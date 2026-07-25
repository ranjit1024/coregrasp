"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { getuserId } from "@/lib/userId";

interface SendQuizFormProps {
  policyUrl?: string;
  onUploadSuccess?: (uploadedUrl: string) => void;
  maxFileSizeMB?: number;
}

type SendStatus = "idle" | "sending" | "sent" | "error";

export function SendQuizForm({
  policyUrl: initialPolicyUrl = "",
  onUploadSuccess,
  maxFileSizeMB = 10,
}: SendQuizFormProps) {
  // ── Upload State ─────────────────────────────────────────
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPolicyUrl, setCurrentPolicyUrl] = useState(initialPolicyUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Send State ───────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SendStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [userId, setUserId] = useState<string>();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // ── Auto-dismiss toast ───────────────────────────────────
  useEffect(() => {
    if (status !== "sent" && status !== "error") return;
    const timer = setTimeout(() => {
      setStatus("idle");
      setErrorMsg("");
    }, 4000);
    return () => clearTimeout(timer);
  }, [status]);

  // ── Load user ID ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function loadUser() {
      try {
        const result = await getuserId();
        if (!cancelled && result?.id) setUserId(result.id);
      } finally {
        if (!cancelled) setIsLoadingUser(false);
      }
    }
    loadUser();
    return () => { cancelled = true; };
  }, []);

  // ── Sync external policy URL ─────────────────────────────
  useEffect(() => {
    if (initialPolicyUrl) setCurrentPolicyUrl(initialPolicyUrl);
  }, [initialPolicyUrl]);

  // ── Keyboard shortcuts ───────────────────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && file) {
        e.preventDefault();
        handleRemoveFile();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [file]);

  // ── Validation helpers ───────────────────────────────────
  const isValidFileType = useCallback((f: File) => {
    const validTypes = [
      "application/pdf",
      "text/csv",
      "application/vnd.ms-excel",
    ];
    const name = f.name.toLowerCase();
    return (
      validTypes.includes(f.type) ||
      name.endsWith(".pdf") ||
      name.endsWith(".csv")
    );
  }, []);

  const isValidEmail = useCallback((val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }, []);

  const getFileExtension = (name: string) =>
    name.split(".").pop()?.toUpperCase() || "FILE";

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // ── File handlers ────────────────────────────────────────
  const handleFileSelected = useCallback(
    async (selectedFile: File) => {
      // Multiple files guard
      if (!selectedFile) return;

      // Type guard
      if (!isValidFileType(selectedFile)) {
        setErrorMsg("Unsupported format. Please attach a .PDF or .CSV file.");
        setStatus("error");
        return;
      }

      // Size guard
      if (selectedFile.size > maxFileSizeMB * 1024 * 1024) {
        setErrorMsg(`File too large. Max size is ${maxFileSizeMB} MB.`);
        setStatus("error");
        return;
      }

      setFile(selectedFile);
      setIsUploading(true);
      setStatus("idle");
      setErrorMsg("");

      try {
        // TODO: Replace with real upload call
        // const newUrl = await uploadFile(selectedFile);
        await new Promise((r) => setTimeout(r, 800));
        const newUrl = URL.createObjectURL(selectedFile); // placeholder
        setCurrentPolicyUrl(newUrl);
        onUploadSuccess?.(newUrl);
      } catch {
        setErrorMsg("Failed to upload file. Please try again.");
        setStatus("error");
        setFile(null);
      } finally {
        setIsUploading(false);
      }
    },
    [isValidFileType, maxFileSizeMB, onUploadSuccess]
  );

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setCurrentPolicyUrl(initialPolicyUrl);
    setStatus("idle");
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [initialPolicyUrl]);

  // ── Drag & Drop ──────────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) handleFileSelected(dropped);
    },
    [handleFileSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFileSelected(selected);
    },
    [handleFileSelected]
  );

  // ── Send handler ─────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!email || !isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    if (!currentPolicyUrl && !file) {
      setErrorMsg("Please attach a document first.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(
        `https://api.ranjitdas2048.workers.dev/send-quiz`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            policyUrl: currentPolicyUrl,
            recipientEmail: email,
            userId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong while sending.");
        setStatus("error");
        return;
      }

      setStatus("sent");
      setEmail("");
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setStatus("error");
    }
  }, [email, isValidEmail, currentPolicyUrl, file, userId]);

  // ── Render helpers ───────────────────────────────────────
  const ext = file ? getFileExtension(file.name) : "";
  const canSend =
    !isUploading && !isLoadingUser && email.length > 0 && status !== "sending";

  return (
    <div className="w-full max-w-lg bg-[#0B0D13] border border-zinc-800/80 rounded-2xl p-6 space-y-6 shadow-2xl text-zinc-100 font-sans">
      {/* ── SECTION 1: DOCUMENT ATTACHMENT ── */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label
            htmlFor="file-upload"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
          >
            Source Document
          </label>
          <span className="text-[11px] text-zinc-500 font-mono">
            PDF, CSV · Max {maxFileSizeMB}MB
          </span>
        </div>

        <input
          id="file-upload"
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".pdf,.csv,application/pdf,text/csv"
          className="hidden"
          aria-label="Upload policy or CSV dataset"
        />

        {/* Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Drop zone for file upload. Click or press Enter to browse."
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`relative group rounded-xl p-4 transition-all duration-200 cursor-pointer border outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
            isDragging
              ? "border-emerald-500 bg-emerald-500/5 ring-4 ring-emerald-500/10"
              : "border-zinc-800/90 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/80"
          }`}
        >
          {file ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 truncate">
                <div
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border shrink-0 ${
                    ext === "PDF"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}
                >
                  {ext}
                </div>
                <div className="text-left truncate space-y-0.5 min-w-0">
                  <p className="text-xs font-medium text-zinc-200 truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {formatSize(file.size)}{" "}
                    {isUploading ? "• Uploading…" : "• Ready"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-500"
                aria-label="Remove attached file"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3.5 py-1">
              <div className="w-9 h-9 rounded-lg bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-600 transition-all">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                  Upload Policy or CSV Dataset
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Drag and drop or click to browse
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-zinc-800/60" />

      {/* ── SECTION 2: SHARE ASSESSMENT ── */}
      <div className="space-y-3">
        <div>
          <label
            htmlFor="email-input"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
          >
            Recipient
          </label>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Deliver interactive assessment directly to employee email.
          </p>
        </div>

        {/* Input Bar */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-zinc-500 pointer-events-none">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <input
            id="email-input"
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "sending" || isLoadingUser}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSend) handleSend();
            }}
            className="w-full bg-zinc-900/60 text-zinc-100 border border-zinc-800/90 pl-10 pr-28 py-2.5 rounded-xl text-xs placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all disabled:opacity-50"
          />

          <button
            onClick={handleSend}
            disabled={!canSend}
            className="absolute right-1.5 bg-zinc-100 text-zinc-900 hover:bg-white px-3.5 py-1.5 rounded-lg text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center space-x-1.5 shadow-sm focus-visible:ring-2 focus-visible:ring-white/50"
          >
            {status === "sending" ? (
              <>
                <svg
                  className="animate-spin w-3 h-3 text-zinc-900"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx={12}
                    cy={12}
                    r={10}
                    stroke="currentColor"
                    strokeWidth={4}
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Sending</span>
              </>
            ) : (
              <span>Send Link</span>
            )}
          </button>
        </div>

        {/* Status Messages */}
        {status === "sent" && (
          <div
            className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1"
            role="status"
            aria-live="polite"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-emerald-400 text-xs font-medium">
              Quiz invitation dispatched successfully.
            </p>
          </div>
        )}

        {status === "error" && (
          <div
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1"
            role="alert"
            aria-live="assertive"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <p className="text-red-400 text-xs font-medium flex-1">{errorMsg}</p>
            <button
              onClick={() => setStatus("idle")}
              className="text-[10px] text-red-300 hover:text-red-200 underline underline-offset-2"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}