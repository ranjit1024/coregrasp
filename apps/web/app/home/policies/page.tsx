"use client";

import { useSession } from "../../../lib/auth-client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PolicyDocument, PolicyStatus, statusConfig } from "../../../lib/types";
import { PolicyRow } from "@/app/components/ui/policy_row";
import { AlertCircle, FileX2, ServerCrash } from "lucide-react";

function MetricCard({
    status,
    count,
    index,
}: {
    status: PolicyStatus;
    count: number;
    index: number;
}) {
    const cfg = statusConfig[status];

    return (
        <div
            className="relative bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:bg-zinc-900/50 hover:border-white/10 hover:-translate-y-1 hover:shadow-xl group animate-in fade-in slide-in-from-bottom-4 "
            style={{ animationFillMode: "both", animationDelay: `${index * 100}ms` }}
        >
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${cfg.dotColor} opacity-70 group-hover:opacity-100 transition-opacity`} />

            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {cfg.label}
                </span>
                <div className="relative flex items-center justify-center w-2.5 h-2.5">
                    {status === "PROCESSING" && (
                        <div className={`absolute w-full h-full rounded-full ${cfg.dotColor} opacity-40 animate-ping`} />
                    )}
                    <div className={`w-2 h-2 rounded-full ${cfg.dotColor} ${cfg.glowColor} shadow-lg`} />
                </div>
            </div>

            <div className="text-4xl font-bold tracking-tight text-zinc-100 leading-none mb-2.5">
                {count}
            </div>
            <div className="text-sm font-medium text-zinc-300 mb-1">{cfg.name}</div>
            <div className="text-xs text-zinc-500 leading-relaxed max-w-[90%]">{cfg.desc}</div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────

export default function PolicyStatusPage() {
    const { data: session, isPending: isSessionPending } = useSession();
    const [policies, setPolicies] = useState<PolicyDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        async function fetchPolicies() {
            if (!session?.user?.id) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const res = await fetch(
                    `https://api.ranjitdas2048.workers.dev/result?userId=${session.user.id}`
                );

                if (!res.ok) {
                    throw new Error(`Failed to fetch policies (Status: ${res.status})`);
                }

                const data = await res.json();
                
                if (isMounted) {
                    // Fixed: Changed data.userName to data.policies assuming it was a typo in the original code
                    setPolicies(data.policies || data.userName || []);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "An unknown error occurred.");
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        if (!isSessionPending) fetchPolicies();

        return () => {
            isMounted = false;
        };
    }, [session?.user?.id, isSessionPending]);

    const statusCounts = useMemo(() => {
        return policies.reduce(
            (acc, p) => {
                acc[p.status] = (acc[p.status] || 0) + 1;
                return acc;
            },
            { PENDING: 0, PROCESSING: 0, READY: 0, FAILED: 0 } as Record<PolicyStatus, number>
        );
    }, [policies]);

    // ---------------------------------------------------------------------------
    // SKELETON LOADING STATE
    // ---------------------------------------------------------------------------
    if (isLoading || isSessionPending) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-300 antialiased p-6 md:p-12 animate-in fade-in duration-500">
                <div className="max-w-7xl mx-auto">
                    {/* Header Skeleton */}
                    <div className="space-y-3 mb-10">
                        <div className="h-8 w-64 bg-zinc-900 rounded-lg animate-pulse" />
                        <div className="h-4 w-96 bg-zinc-900/50 rounded-md animate-pulse" />
                    </div>

                    {/* Metrics Skeleton */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-[160px] bg-zinc-900/30 border border-white/5 rounded-2xl animate-pulse p-5 flex flex-col justify-between">
                                <div className="h-3 w-16 bg-zinc-800 rounded" />
                                <div className="space-y-2">
                                    <div className="h-8 w-12 bg-zinc-800 rounded-md" />
                                    <div className="h-4 w-24 bg-zinc-800/50 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table Skeleton */}
                    <div className="bg-zinc-900/20 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="h-12 border-b border-white/5 bg-zinc-900/40" />
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-16 border-b border-white/5 last:border-0 bg-zinc-900/10 animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------------------
    // MAIN RENDER
    // ---------------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-300 antialiased p-6 md:p-10 selection:bg-zinc-800">
            <div className="max-w-7xl mx-auto">
                
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-8">
                    <a href="#" className="hover:text-zinc-300 transition-colors">Workspace</a>
                    <span className="text-zinc-700">/</span>
                    <span className="text-zinc-300">Policies</span>
                </nav>

                {/* Header */}
                <div className="mb-10 animate-in fade-in slide-in-from-left-4 duration-500">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-100 mb-2">
                        Policy Compliance Registry
                    </h1>
                    <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                        Live tracking of company documentation, compliance frameworks, and active policy updates across your workspace.
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {(["PENDING", "PROCESSING", "READY", "FAILED"] as PolicyStatus[]).map((status, idx) => (
                        <MetricCard key={status} status={status} count={statusCounts[status]} index={idx} />
                    ))}
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-8 flex items-start gap-3 p-4 bg-red-950/20 border border-red-900/50 rounded-2xl text-red-400 animate-in fade-in zoom-in-95">
                        <ServerCrash className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-red-300">Sync Interrupted</h3>
                            <p className="text-sm opacity-90">{error}</p>
                        </div>
                    </div>
                )}

                {/* Table Section */}
                <div className="mb-5 animate-in fade-in duration-700">
                    <h2 className="text-lg font-medium text-zinc-100 tracking-tight">Document Processing Logs</h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        Granular breakdown of structural compliance checking sequences.
                    </p>
                </div>

                <div className="bg-zinc-900/20 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Table Header */}
                    <div className="grid grid-cols-[1fr_140px_120px] items-center px-6 py-4 border-b border-white/5 bg-zinc-900/40">
                        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Document</span>
                        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Status</span>
                        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 text-right">Created</span>
                    </div>

                    {/* Table Body */}
                    {policies.length === 0 && !error ? (
                        /* Premium Empty State */
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="bg-zinc-900/50 p-4 rounded-full mb-4 border border-white/5">
                                <FileX2 className="w-8 h-8 text-zinc-600" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-zinc-300 font-medium mb-1">No policies found</h3>
                            <p className="text-sm text-zinc-500">
                                There are currently no policies in the registry.
                            </p>
                        </div>
                    ) : (
                        /* Rows */
                        <div className="divide-y divide-white/5">
                            {policies.map((policy) => (
                                <div 
                                    key={policy.id} 
                                    className="transition-colors hover:bg-zinc-900/40 cursor-pointer"
                                >
                                    <PolicyRow
                                        policy={policy}
                                        onClick={() => router.push(`/home/policies/${policy.url}`)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}