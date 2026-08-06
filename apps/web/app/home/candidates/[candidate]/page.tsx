"use client";

import { getCandidatepolicy } from "@/lib/policy-candiate";
import { use, useEffect, useState } from "react";
import {
    AlertCircle,
    Inbox,
    User,
    Mail,
    CheckCircle2,
    XCircle
} from "lucide-react";

interface CandidatePolicy {
    id: string;
    attempt: boolean;
    email: string;
    policyId: string;
    score: number;
    userId: string;
}

interface PolicyDetailsProps {
    params: Promise<{ candidate: string }>;
}

export default function PolicyDetails({ params }: PolicyDetailsProps) {
    const { candidate } = use(params);
    const [data, setData] = useState<CandidatePolicy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchCandidateData() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await getCandidatepolicy({ key: candidate });

                if (isMounted) {
                    setData(response || []);
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err instanceof Error ? err.message : "Failed to load candidate records."
                    );
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        if (candidate) fetchCandidateData();

        return () => {
            isMounted = false;
        };
    }, [candidate]);

    // ---------------------------------------------------------------------------
    // SKELETON LOADING STATE
    // ---------------------------------------------------------------------------
    if (isLoading) {
        return (
            <div className="w-full max-w-8xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                <div className="space-y-2">
                    <div className="h-7 sm:h-8 w-48 sm:w-64 bg-zinc-900 rounded-md animate-pulse" />
                    <div className="h-4 w-64 sm:w-72 bg-zinc-900/50 rounded-md animate-pulse" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-24 sm:h-20 bg-zinc-900/40 border border-zinc-800/60 rounded-xl sm:rounded-2xl animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------------------
    // ERROR STATE
    // ---------------------------------------------------------------------------
    if (error) {
        return (
            <div className="w-full max-w-8xl mx-auto p-4 sm:p-6 md:p-8">
                <div className="flex items-start gap-3 p-4 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-red-300">Connection Error</h3>
                        <p className="text-[13px] sm:text-sm opacity-90">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------------------
    // MAIN RENDER
    // ---------------------------------------------------------------------------
    return (
        <div className="w-full max-w-8xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 font-sans selection:bg-zinc-800">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-5 sm:pb-6">
                <div className="space-y-1.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
                        Candidate Records
                    </h1>
                    <p className="text-[13px] sm:text-sm text-zinc-400">
                        Viewing policy attempt history for <span className="font-mono text-zinc-300 ml-1 break-all">{candidate}</span>
                    </p>
                </div>

                {/* Metric Badge */}
                <div className="inline-flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 px-3 sm:px-4 py-2 rounded-xl shadow-sm self-start sm:self-auto">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[11px] sm:text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                        {data.length} {data.length === 1 ? "Record" : "Records"} Found
                    </span>
                </div>
            </div>

            {/* Content Section */}
            {data.length === 0 ? (

                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-center bg-zinc-900/20 border border-dashed border-zinc-800/80 rounded-2xl">
                    <div className="bg-zinc-900/50 p-3 sm:p-4 rounded-full mb-3 sm:mb-4 border border-zinc-800">
                        <Inbox className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-600" />
                    </div>
                    <h3 className="text-[14px] sm:text-[15px] text-zinc-200 font-medium mb-1">No records found</h3>
                    <p className="text-[13px] sm:text-sm text-zinc-500 max-w-sm leading-relaxed">
                        This candidate doesn't have any policy attempts tracked in the system yet.
                    </p>
                </div>

            ) : (

                /* List View */
                <div className="space-y-3 sm:space-y-4">
                    {data.map((item) => (
                        <div
                            key={item.id}
                            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-zinc-900/30 hover:bg-zinc-900/80 border border-zinc-800/60 hover:border-zinc-700/80 rounded-xl sm:rounded-2xl p-4 transition-all duration-300 ease-out shadow-sm hover:shadow-md"
                        >
                            {/* Left Side: Identity & IDs */}
                            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                                <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/50 border border-zinc-700/50 shrink-0">
                                    <Mail className="w-4 h-4 text-zinc-400" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <h2 className="font-medium text-zinc-200 truncate text-[14px] sm:text-[15px]" title={item.email}>
                                        {item.email}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                                        <span className="text-[11px] sm:text-xs text-zinc-500 font-mono truncate max-w-[140px] sm:max-w-none" title={item.policyId}>
                                            Policy: {item.policyId}
                                        </span>
                                        <span className="text-zinc-700 text-[10px] hidden sm:inline">•</span>
                                        <span className="text-[11px] sm:text-xs text-zinc-500 font-mono truncate max-w-[140px] sm:max-w-none" title={item.id}>
                                            Record: {item.id}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Status & Score */}
                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-zinc-800/60 sm:border-t-0 shrink-0 sm:ml-4 gap-4">
                                {/* Status Pill */}
                                {item.attempt ? (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Attempted
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/30 border border-amber-900/50 text-amber-400 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider">
                                        <XCircle className="w-3.5 h-3.5" /> Pending
                                    </div>
                                )}

                                {/* Score Block */}
                                <div className="flex flex-col items-end pl-4 border-l border-zinc-800/60 min-w-[50px] sm:min-w-[60px]">
                                    <span className="text-[9px] sm:text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-0.5">
                                        Score
                                    </span>
                                    <span className="text-[13px] sm:text-sm font-bold text-zinc-200">
                                        {item.score}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
