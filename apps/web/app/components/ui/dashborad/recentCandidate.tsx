"use client";

import { motion } from "framer-motion";
import { Mail, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  candidates: {
    id: string;
    email: string;
    score: number;
    attempted: boolean;
    policyName: string;
    policyCategory: string | null;
  }[];
}

export function RecentCandidates({ candidates }: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-base font-semibold text-gray-900">Top Candidates</h2>

      {candidates.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">No candidates yet.</div>
      ) : (
        <div className="space-y-3">
          {candidates.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="truncate text-sm font-medium text-gray-900">{c.email}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {c.policyName}
                  </span>
                  {c.policyCategory && (
                    <span className="text-xs text-gray-400">{c.policyCategory}</span>
                  )}
                </div>
              </div>

              <div className="ml-4 flex items-center gap-3">
                <span className="text-base font-bold text-gray-900">{c.score}</span>
                {c.attempted ? (
                  <XCircle className="h-5 w-5 text-red-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}