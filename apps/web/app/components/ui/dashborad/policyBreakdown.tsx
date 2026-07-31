"use client";

import { motion } from "framer-motion";
import { Users, BarChart3, FileText } from "lucide-react";

interface Props {
  policies: {
    policyId: string;
    policyName: string;
    total: number;
    attempted: number;
    notAttempted: number;
    avgScore: number;
  }[];
}

export function PolicyBreakdown({ policies }: Props) {
  return (
    <div className="flex flex-col rounded-xl bg-[#09090B] border border-white/[0.04] p-6 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[14px] font-medium text-zinc-100">Policy Breakdown</h2>
        <span className="text-[12px] text-zinc-500">Performance by document</span>
      </div>
      
      {/* Empty State */}
      {policies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.08] py-10">
          <FileText className="mb-2 h-5 w-5 text-zinc-600" />
          <span className="text-[13px] text-zinc-500">No policies yet.</span>
        </div>
      ) : (
        /* List Area */
        <div className="flex flex-col gap-3">
          {policies.map((p, i) => (
            <motion.div
              key={p.policyId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, ease: "easeOut" }}
              className="group flex flex-col rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04] hover:border-white/[0.08]"
            >
              {/* Top Row: Name & Total Users */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="truncate text-[14px] font-medium text-zinc-200">
                  {p.policyName}
                </h3>
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 bg-white/[0.04] px-2 py-1 rounded-md border border-white/[0.04]">
                  <Users className="h-3 w-3" />
                  {p.total} Users
                </span>
              </div>
              
              {/* Bottom Row: Stats & Average */}
              <div className="flex items-center text-[12px]">
                {/* Status Indicators */}
                <div className="flex items-center gap-3.5">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 opacity-80" />
                    <span className="text-zinc-300 font-medium">{p.attempted}</span> done
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 opacity-80" />
                    <span className="text-zinc-300 font-medium">{p.notAttempted}</span> pending
                  </span>
                </div>
                
                {/* Average Score */}
                <span className="ml-auto flex items-center gap-1.5 font-semibold text-zinc-100">
                  <BarChart3 className="h-3.5 w-3.5 text-zinc-500" strokeWidth={2} />
                  {p.avgScore}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}