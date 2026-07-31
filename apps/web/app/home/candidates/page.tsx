"use client";

import { useSession } from "@/lib/auth-client";
import { PolicyDocument } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { 
  Users, 
  AlertCircle, 
  Inbox, 
  FileText, 
  ChevronRight,
  RefreshCcw,
  Search,
  Activity
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
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredPolicies = useMemo(() => {
    return policies.filter((p) => 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [policies, searchQuery]);

  const totalCandidatesCount = useMemo(() => {
    return policies.reduce((acc, p) => {
      const count = p.candidateCount ?? (Array.isArray(p.candidates) ? p.candidates.length : 0);
      return acc + count;
    }, 0);
  }, [policies]);

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
  } as const

  // ─── Loading State ─────────────────────────────────────────────────────

  if (isLoading || isSessionPending) {
    return (
      <div className="min-h-screen bg-[#09090B] p-6 md:p-10 w-full flex flex-col">
        <div className="max-w-8xl mx-auto w-full space-y-8">
          <div className="space-y-4">
            <div className="h-8 w-64 bg-white/[0.02] rounded-lg animate-pulse" />
            <div className="h-4 w-96 bg-white/[0.02] rounded-md animate-pulse" />
          </div>
       
          <div className="h-[200px] bg-white/[0.02] border border-white/[0.04] rounded-xl animate-pulse" />
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
    <div className="min-h-screen bg-[#09090B] text-zinc-300 font-sans selection:bg-white/20 pb-20">
      
      {/* Subtle Top Glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <main className="max-w-8xl mx-auto p-6 md:p-10 w-full flex flex-col gap-8">
        
        {/* Breadcrumbs */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 mb-2"
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
          <motion.div variants={itemVariants} className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-white/[0.02] border border-white/[0.04] rounded-xl shadow-sm">
                <FileText className="w-5 h-5 text-zinc-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
                Active Assessments
              </h1>
              {/* Refined Metric Badge integrated into the title flow */}
              <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md ml-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">
                  {policies.length} Active
                </span>
              </div>
            </div>
            <p className="text-[14px] text-zinc-500 max-w-full leading-relaxed sm:ml-14">
              Track employee comprehension and candidate participation across all of your deployed corporate policies.
            </p>
          </motion.div>



          {/* Interactive Search Filter Bar */}
          <motion.div variants={itemVariants} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search active policies by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121214] border border-white/[0.04] rounded-xl pl-11 pr-4 py-3 text-[13px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-white/[0.1] focus:bg-white/[0.02] transition-all shadow-sm"
            />
          </motion.div>

          {/* Unified List Section */}
          <AnimatePresence mode="wait">
            {filteredPolicies.length === 0 ? (
              /* Premium Empty State */
              <motion.div 
                key="empty"
                variants={itemVariants}
                className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#121214] border border-dashed border-white/[0.08] rounded-xl shadow-sm"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-white/[0.02] border border-white/[0.04] rounded-full mb-4">
                  <Inbox className="w-5 h-5 text-zinc-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-[14px] font-medium text-zinc-200 mb-1">
                  {searchQuery ? "No matching policies found" : "No assessments active"}
                </h3>
                <p className="text-[13px] text-zinc-500 max-w-[280px] leading-relaxed">
                  {searchQuery 
                    ? `No active policies matching "${searchQuery}".` 
                    : "You haven't deployed any policy tests yet."}
                </p>
              </motion.div>
            ) : (
              /* Seamless Policy List */
              <motion.div 
                key="list" 
                variants={itemVariants}
                className="bg-[#121214] border border-white/[0.04] rounded-xl overflow-hidden shadow-sm"
              >
                <div className="flex flex-col">
                  {filteredPolicies.map((policy) => {
                    const count = policy.candidateCount ?? (Array.isArray(policy.candidates) ? policy.candidates.length : 0);

                    return (
                      <div
                        key={policy.id}
                        onClick={() => router.push(`/home/candidates/${policy.url}`)}
                        className="group flex items-center justify-between border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
                        {/* 
                          Render PolicyRow but disable pointer events so the hover state 
                          is controlled entirely by this outer container to prevent "double boxing". 
                        */}
                        <div className="flex-1 min-w-0 pointer-events-none">
                          <PolicyRow policy={policy} />
                        </div>

                        {/* Integrated Right-Side Action Metrics */}
                        <div className="shrink-0 flex items-center gap-4 pr-5">
                          <div className="hidden sm:flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.04] px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-400 group-hover:bg-white/[0.04] group-hover:text-zinc-300 transition-colors">
                            <Users className="w-3.5 h-3.5" />
                            {count} <span className="hidden md:inline">Candidates</span>
                          </div>
                          
                          <div className="flex items-center justify-center w-6 h-6 rounded bg-transparent group-hover:bg-white/[0.04] transition-colors">
                            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}