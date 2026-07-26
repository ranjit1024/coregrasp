"use client";

import { useSession } from "../../../lib/auth-client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Skleton_policy_Loader from "@/app/components/ui/policy_loader";
import {PolicyDocument, PolicyStatus, statusConfig} from "../../../lib/types"
import { PolicyRow } from "@/app/components/ui/policy_row";


function MetricCard({
    status,
    count,
}: {
    status: PolicyStatus;
    count: number;
}) {
    const cfg = statusConfig[status];

    return (
        <div
            className={`relative bg-[#121316] border ${cfg.borderColor} rounded-[14px] p-5 overflow-hidden transition-all duration-200 hover:border-[#27272a] hover:-translate-y-px group`}
        >
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${cfg.dotColor}`} />

            <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-600">
                    {cfg.label}
                </span>
                <div className={`w-2 h-2 rounded-full ${cfg.dotColor} ${cfg.glowColor} shadow-lg ${status === "PROCESSING" ? "animate-pulse" : ""}`} />
            </div>

            <div className="text-[36px] font-extrabold tracking-tighter text-white leading-none mb-2">
                {count}
            </div>
            <div className="text-[13px] font-semibold text-zinc-400 mb-1">{cfg.name}</div>
            <div className="text-xs text-zinc-600 leading-relaxed">{cfg.desc}</div>
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
                console.log(data)

                if (isMounted) {
                    setPolicies(data.userName || []);
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

    const totalPolicies = policies.length;

    if (isSessionPending) {
        return (
            <div className="min-h-screen bg-[#090A0C] flex items-center justify-center">
                <Skleton_policy_Loader/>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#090A0C] text-zinc-300 antialiased p-6 md:p-12">
            <div className=" mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs font-medium text-zinc-600 mb-6">
                    <a href="#" className="hover:text-zinc-400 transition-colors">Workspace</a>
                    <span className="text-zinc-700">/</span>
                    <span className="text-zinc-400">Policies</span>
                </nav>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-[28px] font-bold tracking-tight text-white mb-1.5">
                        Policy Compliance Registry
                    </h1>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        Live tracking of company documentation, compliance frameworks, and active policy updates.
                    </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
                    {(["PENDING", "PROCESSING", "READY", "FAILED"] as PolicyStatus[]).map((status) => (
                        <MetricCard key={status} status={status} count={statusCounts[status]} />
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/5 border border-red-500/15 rounded-xl text-red-400 text-sm">
                        <span className="font-semibold">Error:</span> {error}
                    </div>
                )}

                {/* Table Section */}
                <div className="mb-4">
                    <h2 className="text-[15px] font-semibold text-white tracking-tight">Document Processing Logs</h2>
                    <p className="text-xs text-zinc-600 mt-0.5">
                        Granular breakdown of structural compliance checking sequences.
                    </p>
                </div>

                <div className="bg-[#121316] border border-[#1c1e22] rounded-[14px] overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-[1fr_140px_120px] items-center px-5 py-3 border-b border-[#1c1e22]">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-600">Document</span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-600">Status</span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-600 text-right">Created</span>
                    </div>

                    {/* Rows */}
                    {isLoading ? (
                        <div className="py-12 text-center">
                            <div className="w-5 h-5 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-sm text-zinc-600">Syncing secure documents...</p>
                        </div>
                    ) : policies.length === 0 && !error ? (
                        <div className="py-12 text-center text-sm text-zinc-600">
                            No policies found in the registry.
                        </div>
                    ) : (
                        policies.map((policy) => (
                            <PolicyRow
                                key={policy.id}
                                policy={policy}
                                onClick={() => router.push(`/home/policies/${policy.url}`)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}