"use client"

import { Dashboard_data } from "@/lib/dashboard"
import { date } from "better-auth"
import { AwardIcon } from "lucide-react"
import { useEffect, useState } from "react"

// ── Mock Data: The Pipeline ──────────────────────────────────────────────────

const statCards = [
  { label: "Policies Uploaded", val: "12", sub: "3 currently active", trend: "neutral" },
  { label: "Questions Generated", val: "148", sub: "+24 this week", trend: "up" },
  { label: "Invites Sent", val: "842", sub: "Across 4 departments", trend: "neutral" },
  { label: "Avg. Pass Rate", val: "84%", sub: "Target is 90%", trend: "alert" },
]

const policyLibrary = [
  { id: "P1", name: "Data Privacy v2.1.pdf", status: "Ready", questions: 12, date: "Today, 09:00 AM" },
  { id: "P2", name: "Remote Work Q3.pdf", status: "Generating", questions: null, date: "Today, 10:15 AM" },
  { id: "P3", name: "Code of Conduct.pdf", status: "Ready", questions: 15, date: "Yesterday" },
]

// NEW: Active rollout data for the middle-right section
const activeRollouts = [
  { id: "R1", name: "Code of Conduct", completed: 142, total: 150, status: "healthy" },
  { id: "R2", name: "Remote Work Q3", completed: 18, total: 60, status: "lagging" },
  { id: "R3", name: "Data Privacy v2.1", completed: 89, total: 90, status: "healthy" },
]

const candidateTracking = [
  { id: "1", email: "priya.sharma@company.com", policy: "Data Privacy v2.1", score: 92, status: "Pass", date: "Today, 10:42 AM" },
  { id: "2", email: "arjun.mehta@company.com", policy: "Data Privacy v2.1", score: null, status: "Pending", date: "Sent Yesterday" },
  { id: "3", email: "sanjana.rao@company.com", policy: "Code of Conduct", score: 100, status: "Pass", date: "Yesterday" },
  { id: "4", email: "dev.patil@company.com", policy: "Remote Work Q3", score: 61, status: "Fail", date: "Oct 12" },
  { id: "5", email: "kavya.nair@company.com", policy: "Code of Conduct", score: null, status: "Pending", date: "Sent Oct 11" },
]

// ── Helper ──────────────────────────────────────────────────────────────────

const getInitials = (email: string) => {
  if (!email) return "??"
  const parts = email.split('@')[0].split(/[._-]/)
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase()
  return email.substring(0, 2).toUpperCase()
}

// ── Main Dashboard Component ────────────────────────────────────────────────

export default function RevislyDashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function loadData() {
    const res =  await Dashboard_data();
    const policyUpload = res?.data.policies.length;
    return res;
  }
  useEffect( ()=>{
    loadData()
  },[])
  if (isLoading) {
    return <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white/50 text-sm">Loading Workspace...</div>
  }

  return ( 
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] font-sans selection:bg-white/20">
      
      {/* ── Subtle Top Glow ── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ── Main Content ── */}
      <main className="p-6 md:p-8 w-full">
        <div className="max-w-8xl mx-auto flex flex-col gap-6">

           {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-8">
                    <a href="#" className="hover:text-zinc-300 transition-colors">Workspace</a>
                    <span className="text-zinc-700">/</span>
                    <span className="text-zinc-300">DashBoard</span>
                </nav>
          {/* ── KPI Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-[#121214] border border-white/[0.08] rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-[110px] hover:border-white/[0.15] transition-colors">
                <div className="flex justify-between items-start">
                  <div className="text-[12px] font-medium text-[#A1A1AA]">{stat.label}</div>
                  {stat.trend !== "neutral" && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      stat.trend === "up" ? "bg-emerald-500/10 text-emerald-400" :
                      stat.trend === "alert" ? "bg-rose-500/10 text-rose-400" :
                      "bg-amber-500/10 text-amber-400"
                    }`}>
                      {stat.sub.split(" ")[0]}
                    </span>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <div className={`text-2xl font-semibold tracking-tight ${stat.trend === "alert" ? "text-rose-500" : "text-white"}`}>
                    {stat.val}
                  </div>
                  {stat.trend === "neutral" && (
                    <div className="text-[11px] text-[#71717A] mb-1">{stat.sub}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Middle Row: Policy Library & Active Rollouts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">

            {/* Policy Library (The Input) */}
            <div className="bg-[#121214] border border-white/[0.08] rounded-xl flex flex-col overflow-hidden">
              <div className="px-6 py-5 border-b border-white/[0.08] flex justify-between items-center">
                <h2 className="text-[14px] font-medium text-white">Policy Library & Generator</h2>
                <button className="text-[12px] text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1">
                  View All
                </button>
              </div>

              <div className="flex flex-col divide-y divide-white/[0.04]">
                {policyLibrary.map((policy) => (
                  <div key={policy.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#18181B] border border-white/[0.08] flex items-center justify-center text-[#71717A]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-[#FAFAFA]">{policy.name}</span>
                        <span className="text-[12px] text-[#71717A] mt-1">Uploaded: {policy.date}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-3">
                      <div className="flex items-center gap-2">
                        {policy.status === "Ready" ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {policy.questions} MCQs Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            AI is generating MCQs...
                          </span>
                        )}
                      </div>

                      {policy.status === "Ready" && (
                        <div className="flex items-center gap-2">
                          <button className="text-[11px] font-medium text-white bg-white/[0.06] hover:bg-white/[0.1] px-3 py-1.5 rounded transition-colors">
                            Review MCQs
                          </button>
                          <button className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 px-3 py-1.5 rounded transition-colors">
                            Send Invites
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Active Rollouts / Campaign Tracker */}
            <div className="bg-[#121214] border border-white/[0.08] rounded-xl p-6 flex flex-col">
              <h2 className="text-[14px] font-medium text-white mb-6">Active Rollouts</h2>
              
              <div className="flex-1 flex flex-col gap-6">
                {activeRollouts.map((rollout) => {
                  const percentage = Math.round((rollout.completed / rollout.total) * 100);
                  
                  return (
                    <div key={rollout.id} className="group">
                      <div className="flex justify-between items-end mb-2">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-[#FAFAFA]">{rollout.name}</span>
                          <span className="text-[11px] text-[#71717A] mt-0.5">{rollout.completed} of {rollout.total} completed</span>
                        </div>
                        <span className={`text-[12px] font-medium ${rollout.status === 'lagging' ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {percentage}%
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${percentage}%` }} 
                          className={`h-full transition-all duration-1000 ease-out ${rollout.status === 'lagging' ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        />
                      </div>
                      
                      {/* Action trigger for lagging rollouts */}
                      {rollout.status === 'lagging' && (
                        <button className="mt-3 text-[11px] font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded transition-colors w-full">
                          Nudge {rollout.total - rollout.completed} Pending Users
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Table Area: Candidate Tracking (The Output) ── */}
          <div className="bg-[#121214] border border-white/[0.08] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <h2 className="text-[14px] font-medium text-white">Candidate Tracking</h2>
              <button className="text-[12px] font-medium text-[#A1A1AA] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded px-3 py-1.5 transition-colors">
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#0E0E11]">
                    <th className="py-3 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Candidate Email</th>
                    <th className="py-3 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Policy Assessed</th>
                    <th className="py-3 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Score</th>
                    <th className="py-3 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Status</th>
                    <th className="py-3 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {candidateTracking.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#18181B] flex items-center justify-center text-[11px] font-medium text-[#FAFAFA] border border-white/[0.08]">
                            {getInitials(attempt.email)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-medium text-[#FAFAFA]">{attempt.email}</span>
                            <span className="text-[11px] text-[#71717A]">{attempt.date}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="text-[13px] text-[#FAFAFA]">{attempt.policy}</div>
                      </td>
                      <td className="py-3 px-6">
                        <span className="text-[13px] font-medium text-[#FAFAFA]">
                          {attempt.score !== null ? `${attempt.score}%` : "--"}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        {attempt.status === "Pending" ? (
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-white/[0.04] text-[#A1A1AA] border-white/[0.08]">
                             Pending
                           </span>
                        ) : (
                           <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                             attempt.status === "Pass" 
                               ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                               : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                           }`}>
                             {attempt.status}
                           </span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-right">
                        {(attempt.status === "Fail" || attempt.status === "Pending") ? (
                          <button className="text-[11px] font-medium text-white bg-white/[0.06] hover:bg-white/[0.1] px-2.5 py-1.5 rounded transition-colors">
                            Send Nudge
                          </button>
                        ) : (
                          <button className="text-[11px] font-medium text-[#71717A] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1.5 rounded transition-colors">
                            View Log
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="h-8" />
        </div>
      </main>
    </div>
  )
}