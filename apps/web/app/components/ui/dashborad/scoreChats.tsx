"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useMemo } from "react";

// 1. Helper Component: Animates the number counting up from 0
function AnimatedNumber({ value, delay }: { value: number; delay: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    // Wait for the specific bar's delay, then count up
    const timeout = setTimeout(() => {
      animate(count, value, {
        duration: 0.6,
        type: "spring",
        bounce: 0,
      });
    }, delay * 1000); // Convert seconds to ms

    return () => clearTimeout(timeout);
  }, [count, value, delay]);

  return <motion.span>{rounded}</motion.span>;
}

// 2. Main Component
interface Props {
  distribution: { range: string; count: number }[];
}

export function ScoreChart({ distribution }: Props) {
  // Memoize maxCount so it doesn't recalculate on every render
  const maxCount = useMemo(() => {
    if (!distribution || distribution.length === 0) return 1;
    return Math.max(...distribution.map((d) => d.count), 1);
  }, [distribution]);

  // Array of gradients to color-code the bars
  const barColors = [
    "from-rose-500/50 to-rose-400/90 hover:from-rose-500/70 hover:to-rose-300",
    "from-orange-500/50 to-orange-400/90 hover:from-orange-500/70 hover:to-orange-300",
    "from-amber-500/50 to-amber-400/90 hover:from-amber-500/70 hover:to-amber-300",
    "from-emerald-500/50 to-emerald-400/90 hover:from-emerald-500/70 hover:to-emerald-300",
    "from-teal-500/50 to-teal-400/90 hover:from-teal-500/70 hover:to-teal-300",
    "from-blue-500/50 to-blue-400/90 hover:from-blue-500/70 hover:to-blue-300",
  ];

  // Graceful fallback if no data is passed
  if (!distribution?.length) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-xl bg-[#09090B] border border-white/[0.04]">
        <p className="text-sm text-zinc-500">No score data available</p>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col rounded-xl bg-[#09090B] border border-white/[0.04] p-4 sm:p-6 shadow-sm"
      role="region" 
      aria-label="Score Distribution Chart"
    >
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
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none mb-5 sm:mb-6" aria-hidden="true">
          {[0, 1, 2, 3].map((_, i) => (
            <div key={i} className="w-full h-[1px] bg-white/[0.02]" />
          ))}
        </div>

        {/* Vertical Bars */}
        {distribution.map((item, index) => {
          const heightPercentage = (item.count / maxCount) * 100;
          const colorClass = barColors[Math.min(index, barColors.length - 1)];
          
          // Edge case checks for tooltip positioning
          const isFirst = index === 0;
          const isLast = index === distribution.length - 1;
          const animationDelay = index * 0.05; // Snappy stagger delay

          return (
            <div
              key={item.range}
              className="group relative flex flex-1 flex-col items-center justify-end h-full z-0 hover:z-50 focus-within:z-50"
            >
              {/* Tooltip */}
              <div 
                className={`absolute -top-8 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 flex flex-col pointer-events-none translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0
                  ${isFirst ? 'items-start -left-1' : isLast ? 'items-end -right-1' : 'items-center'}
                `}
                aria-hidden="true"
              >
                <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-100 bg-[#18181B] border border-white/[0.08] px-2 sm:px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap">
                  <AnimatedNumber value={item.count} delay={animationDelay} />
                  {item.count === 1 ? ' score' : ' scores'}
                </span>
                {/* Tooltip notch */}
                <div className={`w-1.5 h-1.5 bg-[#18181B] border-r border-b border-white/[0.08] rotate-45 -mt-[4px]
                  ${isFirst ? 'ml-3' : isLast ? 'mr-3' : ''}
                `} />
              </div>

              {/* Bar */}
              <div 
                className="w-full max-w-[28px] sm:max-w-[40px] flex-1 flex items-end outline-none cursor-crosshair rounded-t-sm sm:rounded-t-md focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]"
                tabIndex={0}
                role="graphics-symbol"
                aria-label={`Range ${item.range}: ${item.count} scores`}
              >
                <motion.div
                  initial={{ height: "0%" }} // Explicitly start at 0
                  animate={{ height: `${heightPercentage}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 200, // Faster pop
                    damping: 20,    // Less wobble
                    delay: animationDelay
                  }}
                  className={`w-full rounded-t-sm sm:rounded-t-md bg-gradient-to-t ${colorClass} min-h-[4px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]`}
                />
              </div>

              {/* X-Axis Label */}
              <span 
                className="mt-2 sm:mt-3 text-[9px] sm:text-[11px] font-medium text-zinc-500 whitespace-nowrap group-hover:text-zinc-300 group-focus-within:text-zinc-300 transition-colors"
                aria-hidden="true"
              >
                {item.range}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}