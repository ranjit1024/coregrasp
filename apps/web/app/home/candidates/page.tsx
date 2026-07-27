"use client";

import { useSession } from "@/lib/auth-client";
import { PolicyDocument } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, AlertCircle, Inbox, FileText, ChevronRight } from "lucide-react";
import { PolicyRow } from "@/app/components/ui/policy_row";

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

  // ---------------------------------------------------------------------------
  // SKELETON LOADING STATE
  // ---------------------------------------------------------------------------
  if (isLoading || isSessionPending) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-zinc-800/50 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-zinc-900 rounded-md animate-pulse" />
          </div>
          <div className="h-9 w-32 bg-zinc-800/30 rounded-xl animate-pulse" />
        </div>
        
        {/* List Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[76px] bg-zinc-900/20 border border-white/5 rounded-2xl animate-pulse flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800/50 rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-zinc-800/50 rounded-md" />
                  <div className="h-3 w-24 bg-zinc-900 rounded-md" />
                </div>
              </div>
              <div className="h-8 w-28 bg-zinc-800/30 rounded-xl" />
            </div>
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
      <div className="w-full max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-950/10 border border-red-900/30 rounded-3xl text-center">
          <div className="bg-red-950/30 p-3 rounded-full mb-4 ring-1 ring-red-900/50">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-200 mb-2">Failed to load assessments</h3>
          <p className="text-sm text-red-400/80 max-w-md">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-red-950/50 hover:bg-red-900/50 text-red-200 rounded-lg text-sm font-medium transition-colors border border-red-900/50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8 space-y-8 font-sans selection:bg-zinc-800 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-zinc-100 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-zinc-900/50 rounded-xl border border-white/5 shadow-inner">
              <FileText className="w-5 h-5 text-zinc-400" />
            </div>
            Active Assessments
          </h1>
          <p className="text-sm text-zinc-500 max-w-xl leading-relaxed">
            Track employee comprehension and candidate participation across all of your deployed corporate policies.
          </p>
        </div>
        
        {/* Metric Badge */}
        <div className="inline-flex items-center gap-2.5 bg-zinc-900/40 backdrop-blur-md border border-white/5 px-4 py-2.5 rounded-xl shadow-sm">
          <div className="relative flex items-center justify-center w-2.5 h-2.5">
            <div className="absolute w-full h-full rounded-full bg-emerald-500 opacity-20 animate-ping" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">
            {policies.length} {policies.length === 1 ? "Policy" : "Policies"} Active
          </span>
        </div>
      </div>

      {/* Content Section */}
      {policies.length === 0 ? (
        
        /* Premium Empty State */
        <div className="relative flex flex-col items-center justify-center py-24 px-4 text-center bg-zinc-950/30 border border-dashed border-white/10 rounded-3xl overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-zinc-800/20 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative bg-zinc-900/80 p-5 rounded-2xl mb-5 border border-white/5 shadow-xl">
            <Inbox className="w-8 h-8 text-zinc-500" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-medium text-zinc-200 mb-2 relative">No assessments active</h3>
          <p className="text-sm text-zinc-500 max-w-sm relative leading-relaxed">
            You haven't deployed any policy tests yet. Once policies are assigned, candidate tracking will appear here.
          </p>
        </div>

      ) : (
        
        /* Policy List */
        <div className="space-y-3">
          {policies.map((policy, index) => {
            const count =
              policy.candidateCount ??
              (Array.isArray(policy.candidates) ? policy.candidates.length : 0);

            return (
              <div
                key={policy.id}
                onClick={() => router.push(`/home/candidates/${policy.url}`)}
                className="group relative flex items-center justify-between bg-zinc-950/40 hover:bg-zinc-900/60 border border-white/5 hover:border-zinc-700/50 rounded-2xl p-3 cursor-pointer transition-all duration-300 ease-out active:scale-[0.99] shadow-sm hover:shadow-md animate-in slide-in-from-bottom-2 fade-in"
                style={{ animationFillMode: "both", animationDelay: `${index * 50}ms` }}
              >
                {/* Policy Details (Assuming PolicyRow renders background-transparently) */}
                <div className="flex-1 min-w-0 pointer-events-none">
                  {/* Note: Ensure PolicyRow has no internal onClick or background styling that conflicts */}
                  <PolicyRow policy={policy} />
                </div>

                {/* Elevated Candidate Count Pill & Action Chevron */}
                <div className="shrink-0 flex items-center gap-3 pl-4 ml-2 border-l border-white/5 group-hover:border-white/10 transition-colors">
                  
                  {/* Candidate Badge */}
                  <div className="flex items-center gap-2 bg-zinc-900/80 border border-white/5 group-hover:border-white/10 px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-400 shadow-inner transition-colors">
                    <Users className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                    <span>
                      <strong className="text-zinc-200 text-[13px] mr-1">
                        {count}
                      </strong>
                      {count === 1 ? "Candidate" : "Candidates"}
                    </span>
                  </div>

                  {/* Hover Indicator */}
                  <div className="w-8 h-8 rounded-full bg-zinc-800/0 group-hover:bg-zinc-800/50 flex items-center justify-center transition-all duration-200">
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}