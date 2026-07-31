"use client";

import { motion } from "framer-motion";

interface Props {
  distribution: { range: string; count: number }[];
}

export function ScoreChart({ distribution }: Props) {
  // Prevent division by zero if all counts are 0
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="flex flex-col rounded-xl bg-[#09090B] border border-white/[0.04] p-6 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[14px] font-medium text-zinc-100">Score Distribution</h2>
        <span className="text-[12px] text-zinc-500">All Assessments</span>
      </div>

      {/* Chart Rows */}
      <div className="space-y-4">
        {distribution.map((item, index) => {
          const percentage = (item.count / maxCount) * 100;

          return (
            <div key={item.range} className="group flex items-center gap-4">
              {/* Range Label */}
              <span className="w-12 text-[12px] font-medium text-zinc-400 tabular-nums">
                {item.range}
              </span>

              {/* Bar Track */}
              <div className="relative flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ 
                    duration: 1, 
                    delay: index * 0.1, 
                    ease: "easeOut" 
                  }}
                  className="absolute top-0 left-0 h-full rounded-full bg-zinc-300 transition-colors group-hover:bg-white"
                />
              </div>

              {/* Count Value */}
              <span className="w-8 text-right text-[12px] text-zinc-500 tabular-nums">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}