"use client";

import { useSession } from "../../../lib/auth-client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type PolicyStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

interface PolicyDocument {
    id: string;
    name: string;
    scope: string;
    createdAt: string;
    status: PolicyStatus;
    url: string;
    category:string;
}

// ─── Helpers ─────────────────────────────────────────────────────

const formatDate = (dateString: string) => {
    try {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(dateString));
    } catch {
        return dateString;
    }
};

const statusConfig: Record<
    PolicyStatus,
    {
        label: string;
        name: string;
        desc: string;
        dotColor: string;
        glowColor: string;
        borderColor: string;
        badgeBg: string;
        badgeBorder: string;
        badgeText: string;
        iconBg: string;
        iconColor: string;
    }
> = {
    PENDING: {
        label: "Pending",
        name: "Awaiting Review",
        desc: "Queued for compliance legal sign-off",
        dotColor: "bg-amber-500",
        glowColor: "shadow-amber-500/30",
        borderColor: "border-amber-500/20",
        badgeBg: "bg-amber-500/10",
        badgeBorder: "border-amber-500/15",
        badgeText: "text-amber-400",
        iconBg: "bg-amber-500/[0.08]",
        iconColor: "text-amber-500",
    },
    PROCESSING: {
        label: "Processing",
        name: "Parsing & Syncing",
        desc: "Extracting clauses & legal vectors",
        dotColor: "bg-blue-500",
        glowColor: "shadow-blue-500/30",
        borderColor: "border-blue-500/20",
        badgeBg: "bg-blue-500/10",
        badgeBorder: "border-blue-500/15",
        badgeText: "text-blue-400",
        iconBg: "bg-blue-500/[0.08]",
        iconColor: "text-blue-500",
    },
    READY: {
        label: "Ready",
        name: "Active & Enforced",
        desc: "Deployed to employee feeds",
        dotColor: "bg-emerald-500",
        glowColor: "shadow-emerald-500/30",
        borderColor: "border-emerald-500/20",
        badgeBg: "bg-emerald-500/10",
        badgeBorder: "border-emerald-500/15",
        badgeText: "text-emerald-400",
        iconBg: "bg-emerald-500/[0.08]",
        iconColor: "text-emerald-500",
    },
    FAILED: {
        label: "Failed",
        name: "Validation Errors",
        desc: "Failed integrity or format checks",
        dotColor: "bg-red-500",
        glowColor: "shadow-red-500/30",
        borderColor: "border-red-500/20",
        badgeBg: "bg-red-500/10",
        badgeBorder: "border-red-500/15",
        badgeText: "text-red-400",
        iconBg: "bg-red-500/[0.08]",
        iconColor: "text-red-500",
    },
};

// ─── Icons ───────────────────────────────────────────────────────

const FileIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

// ─── Components ──────────────────────────────────────────────────

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

function PolicyRow({ policy, onClick }: { policy: PolicyDocument; onClick: () => void }) {
    const cfg = statusConfig[policy.status];

    return (
        <div
            onClick={onClick}
            className="grid grid-cols-[1fr_140px_120px] items-center px-5 py-3.5 border-b border-[#16181d] last:border-b-0 cursor-pointer transition-all duration-150 hover:bg-[#16181d] group"
        >
            {/* Document info */}
            <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-9 h-9 rounded-[10px] ${cfg.iconBg} ${cfg.iconColor} flex items-center justify-center flex-shrink-0`}>
                    <FileIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-zinc-200 tracking-tight truncate group-hover:text-white transition-colors">
                        {policy.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-medium text-zinc-500 bg-[#1c1e22] px-2 py-0.5 rounded border border-zinc-800">
                            {policy.category}
                        </span>
                       
                    </div>
                </div>
            </div>

            {/* Status */}
            <div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide border ${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.badgeText}`}>
                    <span className={`w-[5px] h-[5px] rounded-full ${cfg.dotColor} ${status === "PROCESSING" ? "animate-pulse" : ""}`} />
                    {policy.status}
                </span>
            </div>

            {/* Date + Chevron */}
            <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-zinc-600 font-medium">{formatDate(policy.createdAt)}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-700 group-hover:text-zinc-400 group-hover:bg-[#1c1e22] transition-all">
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                </div>
            </div>
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
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
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