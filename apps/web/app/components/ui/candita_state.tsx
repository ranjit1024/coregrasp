"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: "emerald" | "blue" | "amber" | "rose";
  delay?: number;
}

const colorMap = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export function StatsCard({ label, value, icon: Icon, trend, color, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="relative bg-[#121214] border border-white/[0.04] rounded-xl p-5 overflow-hidden group hover:border-white/[0.08] transition-colors duration-300"
    >
      {/* Subtle top highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-4 h-4" strokeWidth={1.5} />
        </div>
        {trend && (
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {trend}
          </span>
        )}
      </div>
      
      <div className="text-[22px] font-semibold text-zinc-100 tracking-tight tabular-nums">
        {value}
      </div>
      <div className="text-[11px] text-zinc-500 font-medium mt-0.5 uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}