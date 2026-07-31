"use client";

import { motion } from "framer-motion";

interface Props {
  attempted: number;
  notAttempted: number;
}

export function AttemptStatus({ attempted, notAttempted }: Props) {
  // Prevent division by zero
  const total = attempted + notAttempted || 1;
  const attemptedPct = Math.round((attempted / total) * 100);
  const notAttemptedPct = Math.round((notAttempted / total) * 100);

  return (
    <div className="flex flex-col rounded-xl bg-[#09090B] border border-white/[0.04] p-6 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <h2 className="text-[14px] font-medium text-zinc-100">Attempt Status</h2>
        <span className="text-[12px] text-zinc-500">Overall completion</span>
      </div>
      
      <div className="space-y-6">
        {/* Attempted Bar */}
        <div className="group">
          <div className="mb-2 flex justify-between items-end">
            <span className="text-[13px] font-medium text-zinc-300">Attempted</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[14px] font-semibold text-emerald-400">{attempted}</span>
              <span className="text-[11px] font-medium text-zinc-500">({attemptedPct}%)</span>
            </div>
          </div>
          {/* Track */}
          <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
            {/* Animated Fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${attemptedPct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500/50 to-emerald-400 transition-colors"
            />
          </div>
        </div>

        {/* Not Attempted Bar */}
        <div className="group">
          <div className="mb-2 flex justify-between items-end">
            <span className="text-[13px] font-medium text-zinc-300">Not Attempted</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[14px] font-semibold text-orange-400">{notAttempted}</span>
              <span className="text-[11px] font-medium text-zinc-500">({notAttemptedPct}%)</span>
            </div>
          </div>
          {/* Track */}
          <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
            {/* Animated Fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${notAttemptedPct}%` }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-orange-500/50 to-orange-400 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}