"use client";

import { useSession } from "../../../lib/auth-client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PolicyDocument, PolicyStatus, statusConfig } from "../../../lib/types";
import { PolicyRow } from "@/app/components/ui/policy_row";
import { FileX2, ServerCrash, ChevronRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Skleton_policy_Loader from "@/app/components/ui/policy_loader";

// ─── Metric Card ────────────────────────────────────────────────────────

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
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, ease: "easeOut", duration: 0.3 }}
            className="relative flex flex-col rounded-xl bg-[#09090B] border border-white/[0.04] p-5 shadow-sm overflow-hidden"
        >
            {/* Subtle Colored Top Border */}
            <div className={`absolute top-0 left-0 right-0 h-[1.5px] ${cfg.dotColor} opacity-70`} />

            {/* Top row: Status Text and Dot indicator */}
            <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {cfg.label}
                </span>
                
                <div className="relative flex items-center justify-center w-2 h-2">
                    {status === "PROCESSING" && (
                        <div className={`absolute w-full h-full rounded-full ${cfg.dotColor} opacity-40 animate-ping`} />
                    )}
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotColor} opacity-80`} />
                </div>
            </div>

            {/* The numeric value */}
            <div className="mt-4 mb-2">
                <span className="text-[32px] font-medium tracking-tight text-zinc-100 leading-none">
                    {count}
                </span>
            </div>

            {/* Bottom labels */}
            <div className="mt-auto pt-2 flex flex-col">
                <span className="text-[13px] font-medium text-zinc-300">
                    {cfg.name}
                </span>
                <span className="text-[12px] text-zinc-500 mt-0.5 max-w-[90%] truncate">
                    {cfg.desc}
                </span>
            </div>
        </motion.div>
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
                    // Try to parse the error message if the API sends one
                    let errorMessage = `Failed to fetch policies (Status: ${res.status})`;
                    try {
                        const errData = await res.json();
                        if (errData.error) errorMessage = errData.error;
                        else if (errData.message) errorMessage = errData.message;
                    } catch (e) {
                        // Not JSON, fallback to default message
                    }

                    // Intercept "Not Found" errors and treat them as an empty list
                    if (res.status === 404 || errorMessage.toLowerCase().includes("no policy found")) {
                        if (isMounted) {
                            setPolicies([]);
                            setError(null); // Clear any error to trigger empty state
                        }
                        return;
                    }

                    throw new Error(errorMessage);
                }

                const data = await res.json();
                
                if (isMounted) {
                    setPolicies(data.policies || data.userName || []);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    const msg = err instanceof Error ? err.message : "An unknown error occurred.";
                    // Final fallback check for the string just in case it was thrown
                    if (msg.toLowerCase().includes("no policy found")) {
                        setPolicies([]);
                        setError(null);
                    } else {
                        setError(msg);
                    }
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

    // ─── Animation Variants ────────────────────────────────────────────────

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.4 } },
    } as const;

    // ─── Loading State ─────────────────────────────────────────────────────
    
    if (isLoading || isSessionPending) {
        return (
            <div className="min-h-screen bg-[#09090B] flex flex-col gap-4 items-center justify-center text-[#A1A1AA] text-sm">
                <Skleton_policy_Loader/>
            </div>
        );
    }

    // ─── Main Render ───────────────────────────────────────────────────────
    
    return (
        <div className="min-h-screen bg-[#09090B] text-zinc-300 font-sans selection:bg-white/20">
            {/* Subtle Top Glow */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-8xl mx-auto p-6 md:p-10 w-full flex flex-col gap-6">
                
                {/* Breadcrumbs */}
                <motion.nav 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="flex items-center gap-1.5 text-[13px] font-medium text-[#71717A] mb-2"
                >
                    <a href="#" className="hover:text-[#FAFAFA] transition-colors">Workspace</a>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-[#FAFAFA]">Policies</span>
                </motion.nav>

                <motion.div 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="show"
                    className="flex flex-col gap-10"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
                            Policy Compliance Registry
                        </h1>
                        <p className="text-[14px] text-zinc-500 leading-relaxed max-w-2xl">
                            Live tracking of company documentation, compliance frameworks, and active policy updates across your workspace.
                        </p>
                    </motion.div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(["PENDING", "PROCESSING", "READY", "FAILED"] as PolicyStatus[]).map((status, idx) => (
                            <MetricCard key={status} status={status} count={statusCounts[status]} index={idx} />
                        ))}
                    </div>

                    {/* Error State (Only displays if error is NOT "no policy found") */}
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400"
                            >
                                <ServerCrash className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h3 className="text-[13px] font-medium text-rose-300">Sync Interrupted</h3>
                                    <p className="text-[12px] opacity-90">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Table Section */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-[15px] font-semibold text-zinc-100 tracking-tight">Document Processing Logs</h2>
                            <p className="text-[13px] text-zinc-500 mt-0.5">
                                Granular breakdown of structural compliance checking sequences.
                            </p>
                        </div>

                        <div className="bg-[#09090B] border border-white/[0.04] rounded-xl overflow-hidden shadow-sm">
                            {/* Table Header */}
                            <div className="grid grid-cols-[1fr_140px_120px] items-center px-6 py-4 border-b border-white/[0.04] bg-[#121214]">
                                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Document</span>
                                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Status</span>
                                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 text-right">Created</span>
                            </div>

                            {/* Table Body */}
                            {policies.length === 0 && !error ? (
                                /* Empty State with Create/Upload Button */
                                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                    <div className="flex items-center justify-center w-12 h-12 bg-white/[0.02] border border-white/[0.04] rounded-full mb-4">
                                        <FileX2 className="w-6 h-6 text-zinc-600" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-[15px] font-medium text-zinc-200 mb-2">No policies found</h3>
                                    <p className="text-[13px] text-zinc-500 max-w-sm mb-6">
                                        Get started by creating or uploading your first compliance policy document to the registry.
                                    </p>
                                    <button
                                        onClick={() => router.push("/home/upload")}
                                        className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-900 text-[13px] font-medium rounded-lg transition-colors shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Upload Policy
                                    </button>
                                </div>
                            ) : (
                                /* Rows */
                                <div className="flex flex-col divide-y divide-white/[0.04]">
                                    {policies.map((policy, index) => (
                                        <motion.div 
                                            key={policy.id} 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, ease: "easeOut" }}
                                            className="group transition-colors hover:bg-white/[0.02] cursor-pointer"
                                            onClick={() => router.push(`/home/policies/${policy.url}`)}
                                        >
                                            <PolicyRow policy={policy} />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}