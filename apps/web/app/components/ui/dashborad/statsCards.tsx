"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Users,
  Trophy,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

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

const cards = [
  { key: "totalPolicies" as const, label: "Policies", icon: FileText, color: "bg-blue-500" },
  { key: "totalCandidates" as const, label: "Candidates", icon: Users, color: "bg-purple-500" },
  { key: "averageScore" as const, label: "Avg Score", icon: TrendingUp, color: "bg-green-500" },
  { key: "highestScore" as const, label: "Highest Score", icon: Trophy, color: "bg-yellow-500" },
  { key: "attemptedCount" as const, label: "Attempted", icon: CheckCircle2, color: "bg-emerald-500" },
  { key: "notAttemptedCount" as const, label: "Not Attempted", icon: AlertCircle, color: "bg-red-500" },
];

export function StatsCards({ stats }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const value = stats[card.key];
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
              </div>
              <div className={`rounded-lg ${card.color} p-2.5`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}