"use client";

import { motion } from "framer-motion";
import { Users, BarChart3 } from "lucide-react";

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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Policy Breakdown</h2>
      
      {policies.length === 0 ? (
        <div className="py-4 text-center text-sm text-gray-500">No policies yet.</div>
      ) : (
        <div className="space-y-3">
          {policies.map((p, i) => (
            <motion.div
              key={p.policyId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-gray-100 p-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="truncate font-medium text-gray-900">{p.policyName}</h3>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="h-3 w-3" />
                  {p.total}
                </span>
              </div>
              
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <span className="text-green-600">{p.attempted} done</span>
                <span className="text-red-400">{p.notAttempted} pending</span>
                <span className="ml-auto flex items-center gap-1 font-medium text-gray-700">
                  <BarChart3 className="h-3 w-3" />
                  Avg: {p.avgScore}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}