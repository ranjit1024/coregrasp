"use client";

import { motion } from "framer-motion";

interface Props {
  distribution: { range: string; count: number }[];
}

export function ScoreChart({ distribution }: Props) {
  // Prevent division by zero if all counts are 0
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  // Array of gradients to color-code the bars from low (red/orange) to high (green/teal)
  const barColors = [
    "from-rose-500/50 to-rose-400/90 group-hover:from-rose-500/70 group-hover:to-rose-300",
    "from-orange-500/50 to-orange-400/90 group-hover:from-orange-500/70 group-hover:to-orange-300",
    "from-amber-500/50 to-amber-400/90 group-hover:from-amber-500/70 group-hover:to-amber-300",
    "from-emerald-500/50 to-emerald-400/90 group-hover:from-emerald-500/70 group-hover:to-emerald-300",
    "from-teal-500/50 to-teal-400/90 group-hover:from-teal-500/70 group-hover:to-teal-300",
    "from-blue-500/50 to-blue-400/90 group-hover:from-blue-500/70 group-hover:to-blue-300",
  ];

  return (
    // Removed overflow-hidden so tooltips don't get clipped at the top bounds
    <div className="flex flex-col rounded-xl bg-[#09090B] border border-white/[0.04] p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-[13px] sm:text-[14px] font-medium text-zinc-100">Score Distribution</h2>
          <span className="text-[11px] sm:text-[12px] text-zinc-500 mt-0.5">Assessment performance across ranges</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-40 sm:h-48 w-full flex items-end justify-between gap-1 sm:gap-4 mt-6 sm:mt-4">

        {/* Subtle background grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none mb-5 sm:mb-6">
          {[0, 1, 2, 3].map((_, i) => (
            <div key={i} className="w-full h-[1px] bg-white/[0.02]" />
          ))}
        </div>

        {/* Vertical Bars */}
        {distribution.map((item, index) => {
          const heightPercentage = (item.count / maxCount) * 100;
          // Assign a color based on the index (caps at the last color if there are many ranges)
          const colorClass = barColors[Math.min(index, barColors.length - 1)];

          return (
            <div
              key={item.range}
              // z-index management: base z-0, but elevates to z-50 on hover so tooltips don't hide behind neighboring bars
              className="group relative flex flex-1 flex-col items-center justify-end h-full z-0 hover:z-50"
            >
              {/* Hover Tooltip (Count) */}
              <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center pointer-events-none">
                <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-100 bg-[#18181B] border border-white/[0.08] px-2 sm:px-2.5 py-1 rounded-md shadow-xl">
                  {item.count}
                </span>
                {/* Tooltip notch */}
                <div className="w-1.5 h-1.5 bg-[#18181B] border-r border-b border-white/[0.08] rotate-45 -mt-[4px]" />
              </div>

              {/* Bar */}
              <div className="w-full max-w-[28px] sm:max-w-[40px] flex-1 flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercentage}%` }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.05,
                    type: "spring",
                    bounce: 0.2
                  }}
                  className={`w-full rounded-t-sm sm:rounded-t-md bg-gradient-to-t ${colorClass} transition-all duration-300 min-h-[4px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]`}
                />
              </div>

              {/* X-Axis Label */}
              <span className="mt-2 sm:mt-3 text-[9px] sm:text-[11px] font-medium text-zinc-500 whitespace-nowrap group-hover:text-zinc-300 transition-colors">
                {item.range}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
