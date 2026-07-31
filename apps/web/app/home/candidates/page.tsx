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
  Activity,
  CheckCircle2,
  Clock,
  BarChart3
} from "lucide-react";
import { PolicyRow } from "@/app/components/ui/policy_row";

import { motion, AnimatePresence } from "framer-motion";
import { StatsCard } from "@/app/components/ui/candita_state";

interface PolicyWithCandidates extends PolicyDocument {
  candidateCount?: number;
  candidates?: Array<unknown>;
}

type StatusFilter = "ALL" | "PROCESSING" | "READY" ;

export default function Candidates() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [policies, setPolicies] = useState<PolicyWithCandidates[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
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
    return policies.filter((p) => {
      const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [policies, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = policies.length;
    const processing = policies.filter(p => p.status === "PROCESSING").length;
    const completed = policies.filter(p => p.status === "READY").length;
    const totalCandidates = policies.reduce((acc, p) => {
      const count = p.candidateCount ?? (Array.isArray(p.candidates) ? p.candidates.length : 0);
      return acc + count;
    }, 0);
    return { total, processing, completed, totalCandidates };
  }, [policies]);

  const filters: { label: string; value: StatusFilter; count: number }[] = [
    { label: "All", value: "ALL", count: stats.total },
    { label: "Processing", value: "PROCESSING", count: stats.processing },
    { label: "Completed", value: "READY", count: stats.completed },
  
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.35 } },
  } as const;

  // ─── Loading State ─────────────────────────────────────────────────────

  if (isLoading || isSessionPending) {
    return (
      <div className="min-h-screen bg-[#09090B] p-6 md:p-10 w-full flex flex-col">
        <div className="max-w-8xl mx-auto w-full space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white/[0.02] border border-white/[0.04] rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-[52px] bg-white/[0.02] border border-white/[0.04] rounded-xl animate-pulse" />
          <div className="h-[300px] bg-white/[0.02] border border-white/[0.04] rounded-xl animate-pulse" />
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
          className="flex flex-col items-center justify-center py-12 px-6 bg-rose-500/[0.07] border border-rose-500/20 rounded-2xl text-center max-w-md w-full shadow-lg backdrop-blur-sm"
        >
          <div className="bg-rose-500/15 p-3 rounded-full mb-4 ring-1 ring-rose-500/25">
            <AlertCircle className="w-6 h-6 text-rose-400" />
          </div>
          <h3 className="text-[15px] font-semibold text-rose-200 mb-2">Failed to load assessments</h3>
          <p className="text-[13px] text-rose-400/70 mb-6 leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-lg text-[13px] font-medium transition-colors border border-rose-500/25"
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
      
      {/* Top ambient glow */}
      <div className="fixed top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent z-50 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />

      <main className="max-w-8xl mx-auto p-6 md:p-10 w-full flex flex-col gap-8">
        
        {/* Breadcrumbs */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex items-center gap-2 text-[11px] font-medium text-zinc-600"
        >
          <a href="#" className="hover:text-zinc-400 transition-colors">Workspace</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-300">Assessments</span>
        </motion.nav>

        {/* Stats Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Assessments" 
            value={stats.total} 
            icon={BarChart3} 
            color="blue" 
            delay={0}
          />
          <StatsCard 
            label="Total Candidates" 
            value={stats.totalCandidates} 
            icon={Users} 
            color="emerald" 
            delay={0.05}
          />
          <StatsCard 
            label="Processing" 
            value={stats.processing} 
            icon={Clock} 
            color="amber" 
            delay={0.1}
          />
          <StatsCard 
            label="Completed" 
            value={stats.completed} 
            icon={CheckCircle2} 
            color="emerald" 
            delay={0.15}
          />
        </div>

        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show"
          className="flex flex-col gap-6"
        >
          {/* Header + Filter Row */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
                Active Assessments
              </h1>
              <p className="text-[13px] text-zinc-500 leading-relaxed">
                Track comprehension and participation across deployed policies.
              </p>
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-1 bg-[#121214] border border-white/[0.04] p-1 rounded-xl">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`
                    relative px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all duration-200
                    ${statusFilter === f.value 
                      ? "text-zinc-100 bg-white/[0.06] shadow-sm" 
                      : "text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.02]"
                    }
                  `}
                >
                  {f.label}
                  <span className={`
                    ml-1.5 text-[10px] tabular-nums
                    ${statusFilter === f.value ? "text-zinc-400" : "text-zinc-700"}
                  `}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Search */}
          <motion.div variants={itemVariants} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="text"
              placeholder="Search policies by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121214] border border-white/[0.04] rounded-xl pl-11 pr-4 py-3 text-[13px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-white/[0.1] focus:bg-white/[0.02] transition-all shadow-sm"
            />
          </motion.div>

          {/* Policy List */}
          <AnimatePresence mode="wait">
            {filteredPolicies.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#121214] border border-dashed border-white/[0.06] rounded-xl"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-white/[0.02] border border-white/[0.05] rounded-full mb-4">
                  <Inbox className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-[14px] font-medium text-zinc-300 mb-1">
                  {searchQuery || statusFilter !== "ALL" ? "No matching policies" : "No assessments yet"}
                </h3>
                <p className="text-[13px] text-zinc-500 max-w-[280px] leading-relaxed">
                  {searchQuery || statusFilter !== "ALL"
                    ? "Try adjusting your search or filters." 
                    : "Deploy a policy to start collecting candidate responses."}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="list" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#121214] border border-white/[0.04] rounded-xl overflow-hidden shadow-sm"
              >
                {/* Table Header */}
                <PolicyRow showHeader policy={{} as PolicyDocument} />
                
                {/* Rows */}
                <div className="flex flex-col">
                  {filteredPolicies.map((policy, idx) => {
                    const count = policy.candidateCount ?? (Array.isArray(policy.candidates) ? policy.candidates.length : 0);

                    return (
                      <motion.div
                        key={policy.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.3 }}
                      >
                        <PolicyRow 
                          policy={policy} 
                          candidateCount={count}
                          onClick={() => router.push(`/home/candidates/${policy.url}`)}
                        />
                      </motion.div>
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