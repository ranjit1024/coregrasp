"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: "emerald" | "rose" | "blue" | "amber" | "violet";
  subValue?: string;
}

const accentMap = {
  emerald: "text-emerald-300",
  rose: "text-rose-300",
  blue: "text-blue-300",
  amber: "text-amber-300",
  violet: "text-violet-300",
};

export function StatsCard({ label, value, icon: Icon, color, subValue }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-xl border border-white/[0.04] bg-[#0c0c0e] p-6 transition-colors duration-500 hover:border-white/[0.08]"
    >
      {/* Soft ambient glow on hover */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/[0.015] blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      
      {/* Hairline top sheen */}
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Icon + Subvalue row */}
      <div className="relative flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.02] transition-all duration-300 group-hover:border-white/[0.08] group-hover:bg-white/[0.03]">
          <Icon className={`h-4 w-4 ${accentMap[color]}`} strokeWidth={1.5} />
        </div>

        {subValue && (
          <span className="mt-1 text-[11px] font-medium tabular-nums text-zinc-600 group-hover:text-zinc-500 transition-colors duration-300">
            {subValue}
          </span>
        )}
      </div>

      {/* Value + Label */}
      <div className="relative mt-6">
        <div className="text-2xl font-semibold tracking-tight text-zinc-100 tabular-nums leading-none">
          {value}
        </div>
        <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-600">
          {label}
        </div>
      </div>
    </motion.div>
  );
}