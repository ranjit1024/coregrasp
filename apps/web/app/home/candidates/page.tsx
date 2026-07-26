"use client";

import { PolicyRow } from "@/app/components/ui/policy_row";
import { useSession } from "@/lib/auth-client";
import { PolicyDocument } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, AlertCircle, Inbox, FileText } from "lucide-react";

// Extend PolicyDocument to account for candidate metadata from API
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
          setPolicies(data.userName || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred."
          );
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
      <div className="w-full  p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-zinc-900 rounded-md animate-pulse" />
          <div className="h-4 w-100 bg-zinc-900/50 rounded-md animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl animate-pulse"
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
      <div className="w-full max-w-8xl mx-auto p-6 md:p-8">
        <div className="flex items-start gap-3 p-4 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-red-300">Connection Error</h3>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-8xl mx-auto p-6 md:p-8 space-y-8 font-sans selection:bg-zinc-800">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-zinc-400" />
            Active Assessments
          </h1>
          <p className="text-sm text-zinc-400">
            Track employee comprehension and assessment participation across deployed policies.
          </p>
        </div>
        
        {/* Metric Badge */}
        <div className="inline-flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 px-4 py-2 rounded-xl shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            {policies.length} {policies.length === 1 ? "Policy" : "Policies"} Active
          </span>
        </div>
      </div>

      {/* Content Section */}
      {policies.length === 0 ? (
        
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-900/20 border border-dashed border-zinc-800/80 rounded-2xl">
          <div className="bg-zinc-900/50 p-4 rounded-full mb-4 border border-zinc-800">
            <Inbox className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-zinc-200 font-medium mb-1">No assessments found</h3>
          <p className="text-sm text-zinc-500 max-w-sm">
            You haven't deployed any policy tests yet. Once policies are assigned, candidate tracking will appear here.
          </p>
        </div>

      ) : (
        
        /* Policy List */
        <div className="space-y-3">
          {policies.map((policy) => {
            const count =
              policy.candidateCount ??
              (Array.isArray(policy.candidates) ? policy.candidates.length : 0);

            return (
              <div
                key={policy.id}
                className="group flex items-center justify-between bg-zinc-900/30 hover:bg-zinc-900/80 border border-zinc-800/60 hover:border-zinc-700/80 rounded-2xl p-2.5 transition-all duration-300 ease-out shadow-sm hover:shadow-md"
              >
                {/* Original PolicyRow Component */}
                <div className="flex-1 min-w-0">
                  <PolicyRow
                    policy={policy}
                    onClick={() => router.push(`/home/candidates/${policy.url}`)}
                  />
                </div>

                {/* Elevated Candidate Count Pill */}
                <div className="shrink-0 pr-3 pl-4 border-l border-zinc-800/60 ml-2">
                  <div className="flex items-center gap-2 bg-zinc-950/50 border border-zinc-800/80 px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-400 shadow-inner">
                    <Users className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    <span>
                      <strong className="text-zinc-200 text-[13px] mr-1">
                        {count}
                      </strong>
                      {count === 1 ? "Employee" : "Employees"}
                    </span>
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