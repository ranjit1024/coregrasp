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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Top Candidates</h2>

      {candidates.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No candidates yet.</div>
      ) : (
        <div className="space-y-3">
          {candidates.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="truncate font-medium text-gray-900">{c.email}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs">
                    {c.policyName}
                  </span>
                  {c.policyCategory && (
                    <span className="text-xs">{c.policyCategory}</span>
                  )}
                </div>
              </div>

              <div className="ml-4 flex items-center gap-3 text-right">
                <div className="text-lg font-bold text-gray-900">{c.score}</div>
                {c.attempted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
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