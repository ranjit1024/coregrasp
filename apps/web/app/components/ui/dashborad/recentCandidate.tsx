"use client";

import { motion } from "framer-motion";
import { Mail, CheckCircle2, XCircle, Clock } from "lucide-react";

interface Props {
  candidates: {
    id: string;
    email: string;
    score: number;
    attempted: boolean;
    policyName: string;
    policyCategory: string | null;
  }[];
}

export function RecentCandidates({ candidates }: Props) {
  return (
    <div className="flex flex-col rounded-xl bg-[#09090B] border border-white/[0.04] p-6 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[14px] font-medium text-zinc-100">Top Candidates</h2>
        <span className="text-[12px] text-zinc-500">Recent activity</span>
      </div>

      {/* Empty State */}
      {candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.08] py-10">
          <Mail className="mb-2 h-5 w-5 text-zinc-600" />
          <span className="text-[13px] text-zinc-500">No candidates yet.</span>
        </div>
      ) : (
        /* Candidate List */
        <div className="flex flex-col gap-3">
          {candidates.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, ease: "easeOut" }}
              className="group flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04] hover:border-white/[0.08]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Avatar / Icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#18181B] border border-white/[0.08] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  <Mail className="h-4 w-4" strokeWidth={2} />
                </div>
                
                {/* Details */}
                <div className="flex flex-col min-w-0 gap-1.5">
                  <span className="truncate text-[13px] font-medium text-zinc-200">
                    {c.email}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                      {c.policyName}
                    </span>
                    {c.policyCategory && (
                      <span className="truncate text-[12px] text-zinc-500">
                        {c.policyCategory}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status / Score */}
              <div className="ml-4 flex shrink-0 items-center gap-3">
                {c.attempted ? (
                  <>
                    <span className="text-[15px] font-semibold tracking-tight text-zinc-100">
                      {c.score}%
                    </span>
                    {c.score >= 70 ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" strokeWidth={2} />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-500" strokeWidth={2} />
                    )}
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-500/20 bg-zinc-500/10 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
                    <Clock className="h-3 w-3" />
                    Pending
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}