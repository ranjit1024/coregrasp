"use client";

import { motion } from "framer-motion";

interface Props {
  stats: {
    totalPolicies: number;
    totalCandidates: number;
    attemptedCount: number;
    notAttemptedCount: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  };
}

type StatKey = keyof Props["stats"];

interface CardConfig {
  key: StatKey;
  status: string;
  title: string;
  subtext: string;
  format?: "percentage" | "number";
}

const cards: CardConfig[] = [
  {
    key: "notAttemptedCount",
    status: "Pending",
    title: "Not Attempted",
    subtext: "Queued for user action",
  },
  {
    key: "totalPolicies",
    status: "Library",
    title: "Total Policies",
    subtext: "Extracting clauses & vectors",
  },

  {
    key: "totalCandidates",
    status: "Users",
    title: "Total Candidates",
    subtext: "Deployed to employee feeds",
  },
  {
    key: "averageScore",
    status: "Metrics",
    title: "Average Score",
    subtext: "Across all active policies",
    format: "percentage",
  },
];

export function StatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card, i) => {
        const rawValue = stats[card.key] || 0;
        
        const displayValue = card.format === "percentage" 
          ? `${Math.round(rawValue)}%` 
          : rawValue;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: i * 0.05, 
              ease: "easeOut",
              duration: 0.3
            }}
            className="relative flex flex-col rounded-xl bg-[#09090B] border border-white/[0.04] p-5 shadow-sm overflow-hidden"
          >
            {/* Top row: Status Text and a neutral subtle dot indicator */}
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                {card.status}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
            </div>

            {/* The numeric value: soft font weight and slightly muted white */}
            <div className="mt-4 mb-2">
              <span className="text-[32px] font-medium tracking-tight text-zinc-100 leading-none">
                {displayValue}
              </span>
            </div>

            {/* Bottom labels: gentler typography colors */}
            <div className="mt-auto pt-2 flex flex-col">
              <span className="text-[13px] font-medium text-zinc-300">
                {card.title}
              </span>
              <span className="text-[12px] text-zinc-500 mt-0.5">
                {card.subtext}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}