"use client";

import { useSession } from "@/lib/auth-client";
import { PolicyDocument } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Users, 
  AlertCircle, 
  Inbox, 
  FileText, 
  ChevronRight,
  Loader2,
  RefreshCcw
} from "lucide-react";
import { PolicyRow } from "@/app/components/ui/policy_row";
import { motion, AnimatePresence } from "framer-motion";

interface PolicyWithCandidates extends PolicyDocument {
  candidateCount?: number;
  candidates?: Array<unknown>;
}

export default function Candidates() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [policies, setPolicies] = useState<PolicyWithCandidates[]>([]);
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
          setPolicies(data.policies || []);
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

  // ─── Animation Variants ────────────────────────────────────────────────

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.3 } },
  } as const;

  // ─── Loading State ─────────────────────────────────────────────────────

  if (isLoading || isSessionPending) {
    return (
      <div className="min-h-screen bg-[#09090B] p-6 md:p-10 w-full flex flex-col gap-8">
        <div className="max-w-8xl mx-auto w-full space-y-8">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.04] pb-6">
            <div className="space-y-3">
              <div className="h-8 w-48 bg-white/[0.02] rounded-lg animate-pulse" />
              <div className="h-4 w-72 bg-white/[0.04] rounded-md animate-pulse" />
            </div>
            <div className="h-9 w-32 bg-white/[0.02] rounded-xl animate-pulse" />
          </div>
          
          {/* List Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[76px] bg-[#121214] border border-white/[0.04] rounded-xl animate-pulse flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/[0.02] rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-white/[0.04] rounded-md" />
                    <div className="h-3 w-24 bg-white/[0.02] rounded-md" />
                  </div>
                </div>
                <div className="h-8 w-28 bg-white/[0.02] rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ───────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12 px-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center max-w-md w-full shadow-lg"
        >
          <div className="bg-rose-500/20 p-3 rounded-full mb-4 ring-1 ring-rose-500/30">
            <AlertCircle className="w-6 h-6 text-rose-400" />
          </div>
          <h3 className="text-[15px] font-semibold text-rose-300 mb-2">Failed to load assessments</h3>
          <p className="text-[13px] text-rose-400/80 mb-6 leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-lg text-[13px] font-medium transition-colors border border-rose-500/30"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── Main Render ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-300 font-sans selection:bg-white/20">
      
      {/* Subtle Top Glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <main className="max-w-8xl mx-auto p-6 md:p-10 w-full flex flex-col gap-6">
        
        {/* Breadcrumbs */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 mb-2"
        >
          <a href="#" className="hover:text-zinc-300 transition-colors">Workspace</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-200">Assessments</span>
        </motion.nav>

        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show"
          className="flex flex-col gap-8"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/[0.04] pb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                  <FileText className="w-5 h-5 text-zinc-400" />
                </div>
                Active Assessments
              </h1>
              <p className="text-[14px] text-zinc-500 max-w-xl leading-relaxed">
                Track employee comprehension and candidate participation across all of your deployed corporate policies.
              </p>
            </div>
            
            {/* Metric Badge */}
            <div className="inline-flex items-center gap-2.5 bg-[#121214] border border-white/[0.08] px-4 py-2 rounded-lg shadow-sm">
              <div className="relative flex items-center justify-center w-2 h-2">
                <div className="absolute w-full h-full rounded-full bg-emerald-500 opacity-40 animate-ping" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-widest">
                {policies.length} {policies.length === 1 ? "Policy" : "Policies"} Active
              </span>
            </div>
          </motion.div>

          {/* Content Section */}
          <AnimatePresence mode="wait">
            {policies.length === 0 ? (
              /* Premium Empty State */
              <motion.div 
                key="empty"
                variants={itemVariants}
                className="relative flex flex-col items-center justify-center py-24 px-4 text-center bg-[#121214] border border-dashed border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <div className="relative flex items-center justify-center w-14 h-14 bg-white/[0.02] rounded-2xl mb-5 border border-white/[0.04] shadow-sm">
                  <Inbox className="w-6 h-6 text-zinc-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-[15px] font-medium text-zinc-200 mb-1.5">No assessments active</h3>
                <p className="text-[13px] text-zinc-500 max-w-sm leading-relaxed">
                  You haven't deployed any policy tests yet. Once policies are assigned, candidate tracking will appear here.
                </p>
              </motion.div>
            ) : (
              /* Policy List */
              <motion.div key="list" className="flex flex-col gap-3">
                {policies.map((policy) => {
                  const count =
                    policy.candidateCount ??
                    (Array.isArray(policy.candidates) ? policy.candidates.length : 0);

                  return (
                    <motion.div
                      variants={itemVariants}
                      key={policy.id}
                      onClick={() => router.push(`/home/candidates/${policy.url}`)}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      className="group relative flex items-center justify-between bg-[#121214] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.02] rounded-xl p-3 cursor-pointer transition-colors shadow-sm"
                    >
                      {/* Policy Details Component */}
                      <div className="flex-1 min-w-0 pointer-events-none">
                        <PolicyRow policy={policy} />
                      </div>

                      {/* Right Side Action / Metrics */}
                      <div className="shrink-0 flex items-center gap-3 pl-4 ml-2 border-l border-white/[0.04] group-hover:border-white/[0.08] transition-colors">
                        
                        {/* Candidate Badge */}
                        <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.04] group-hover:bg-white/[0.04] px-3 py-1.5 rounded-lg transition-colors">
                          <Users className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-400" />
                          <span className="text-[12px] font-medium text-zinc-500">
                            <strong className="text-zinc-200 font-semibold mr-1">
                              {count}
                            </strong>
                            {count === 1 ? "Candidate" : "Candidates"}
                          </span>
                        </div>

                        {/* Interactive Arrow */}
                        <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-transparent group-hover:bg-white/[0.04]">
                          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-all duration-300 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}