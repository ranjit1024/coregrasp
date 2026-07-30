"use client"

import { useEffect, useState } from "react"
import { Dashboard_data } from "@/lib/dashboard"
import { 
  FileText, 
  CheckCircle2, 
  Loader2, 
  ChevronRight, 
  Download, 
  ArrowUpRight,
  Send,
  Eye
} from "lucide-react"

// ── Mock Data ───────────────────────────────────────────────────────────────




const candidateTracking = [
  { id: "1", email: "priya.sharma@company.com", policy: "Data Privacy v2.1", score: 92, status: "Pass", date: "Today, 10:42 AM" },
  { id: "2", email: "arjun.mehta@company.com", policy: "Data Privacy v2.1", score: null, status: "Pending", date: "Sent Yesterday" },
  { id: "3", email: "sanjana.rao@company.com", policy: "Code of Conduct", score: 100, status: "Pass", date: "Yesterday" },
  { id: "4", email: "dev.patil@company.com", policy: "Remote Work Q3", score: 61, status: "Fail", date: "Oct 12" },
  { id: "5", email: "kavya.nair@company.com", policy: "Code of Conduct", score: null, status: "Pending", date: "Sent Oct 11" },
]

// ── Helpers ─────────────────────────────────────────────────────────────────

const getInitials = (email: string) => {
  if (!email) return "??"
  const parts = email.split('@')[0].split(/[._-]/)
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase()
  return email.substring(0, 2).toUpperCase()
}

// ── Main Dashboard Component ────────────────────────────────────────────────

export default function RevislyDashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({ uploaded: 0, questions: 0, invites: 0 });
  const [policies, setPolicies] = useState<any[]>();
  const [candidates, setCandidates] = useState<any[]>();
  async function loadData() {
    setIsLoading(true);
    try {
      const res = await Dashboard_data();
      const policyUpload = res?.data?.policies?.length || 0;
      
      setStats({
        uploaded: policyUpload,
        questions: policyUpload * 5,
        invites: res?.data?.total_candidate || 0
      });
      setPolicies(res?.data.policies);
      setCandidates(res?.data.candidates);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [])

  const statCards = [
    { label: "Policies Uploaded", val: stats.uploaded, sub: "Active in library", trend: "neutral" },
    { label: "Questions Generated", val: stats.questions, sub: "+24 this week", trend: "up" },
    { label: "Invites Sent", val: stats.invites, sub: "Across 4 departments", trend: "neutral" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col gap-4 items-center justify-center text-[#A1A1AA] text-sm">
        <Loader2 className="w-5 h-5 animate-spin text-white/50" />
        Loading Workspace...
      </div>
    )
  }

  return ( 
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] font-sans selection:bg-white/20">
      
      {/* ── Subtle Top Glow ── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

      {/* ── Main Content ── */}
      <main className="p-6 md:p-8 w-full">
        <div className="max-w-8xl mx-auto flex flex-col gap-6">

          {/* ── Breadcrumbs ── */}
          <nav className="flex items-center gap-1.5 text-[13px] font-medium text-[#71717A] mb-4">
            <a href="#" className="hover:text-[#FAFAFA] transition-colors">Workspace</a>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#FAFAFA]">Dashboard</span>
          </nav>

          {/* ── KPI Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-[#121214] border border-white/[0.08] rounded-xl p-5 flex flex-col gap-4 hover:border-white/[0.15] transition-colors">
                <div className="flex justify-between items-start">
                  <div className="text-[13px] font-medium text-[#A1A1AA]">{stat.label}</div>
                  {stat.trend !== "neutral" && (
                    <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      stat.trend === "up" ? "bg-emerald-500/10 text-emerald-400" :
                      stat.trend === "alert" ? "bg-rose-500/10 text-rose-400" :
                      "bg-amber-500/10 text-amber-400" 
                    }`}>
                      {stat.sub.split(" ")[0]}
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <div className={`text-3xl font-semibold tracking-tight ${stat.trend === "alert" ? "text-rose-500" : "text-[#FAFAFA]"}`}>
                    {stat.val}
                  </div>
                  {stat.trend === "neutral" && (
                    <div className="text-[12px] text-[#71717A]">{stat.sub}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Middle Row: Policy Library & Active Rollouts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">

            {/* Policy Library */}
            <div className="bg-[#121214] border border-white/[0.08] rounded-xl flex flex-col overflow-hidden">
              <div className="px-6 py-5 border-b border-white/[0.08] flex justify-between items-center">
                <h2 className="text-[15px] font-semibold text-[#FAFAFA]">Policy Library & Generator</h2>
                <button className="text-[13px] font-medium text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
                  View All
                </button>
              </div>

              <div className="flex flex-col divide-y divide-white/[0.04]">
                {policies!.map((policy) => (
                  <div key={policy.id} className="group p-6 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#18181B] border border-white/[0.08] flex items-center justify-center text-[#71717A] group-hover:text-[#FAFAFA] transition-colors">
                        <FileText className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[14px] font-medium text-[#FAFAFA]">{policy.name}</span>
                        <span className="text-[12px] text-[#71717A] mt-0.5">{policy.category}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-3">
                      <div className="flex items-center gap-2">
                        {policy.status === "READY" ? (
                          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {policy.questions} MCQs Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-amber-400">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            AI is generating MCQs...
                          </span>
                        )}
                      </div>

                      {policy.status === "READY" && (
                        <div className="flex items-center gap-2">
                          <button className="text-[12px] font-medium text-[#FAFAFA] bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.04] px-3 py-1.5 rounded-md transition-colors">
                            Review
                          </button>
                          <button className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 px-3 py-1.5 rounded-md transition-colors">
                            <Send className="w-3 h-3" />
                            Send Invites
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Active Rollouts */}
          
          </div>

          {/* ── Table Area: Candidate Tracking ── */}
          <div className="bg-[#121214] border border-white/[0.08] rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-[#FAFAFA]">Candidate Tracking</h2>
              <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#A1A1AA] bg-white/[0.04] hover:bg-white/[0.08] hover:text-[#FAFAFA] border border-white/[0.08] rounded-md px-3 py-1.5 transition-colors">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#0E0E11]/50">
                    <th className="py-3 px-6 text-[12px] font-medium text-[#A1A1AA]">Candidate Email</th>
                    <th className="py-3 px-6 text-[12px] font-medium text-[#A1A1AA]">Policy Assessed</th>
                    <th className="py-3 px-6 text-[12px] font-medium text-[#A1A1AA]">Score</th>
                    <th className="py-3 px-6 text-[12px] font-medium text-[#A1A1AA]">Status</th>
                    <th className="py-3 px-6 text-[12px] font-medium text-[#A1A1AA] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {candidates!.map((attempt) => (
                    <tr key={attempt.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#18181B] flex items-center justify-center text-[12px] font-medium text-[#FAFAFA] border border-white/[0.08]">
                            {getInitials(attempt.email)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-medium text-[#FAFAFA]">{attempt.email}</span>
                            <span className="text-[12px] text-[#71717A] mt-0.5">{attempt.date}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="text-[14px] text-[#FAFAFA]">{attempt.policy}</div>
                      </td>
                      <td className="py-3 px-6">
                        <span className="text-[14px] font-semibold text-[#FAFAFA]">
                          {attempt.score !== null ? `${attempt.score}%` : "--"}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        {attempt.status === "Pending" ? (
                           <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium border bg-white/[0.04] text-[#A1A1AA] border-white/[0.08]">
                             Pending
                           </span>
                        ) : (
                           <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium border ${
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
                          <button className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#FAFAFA] bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.04] px-3 py-1.5 rounded-md transition-colors">
                            <Send className="w-3 h-3 text-[#A1A1AA]" />
                            Send Nudge
                          </button>
                        ) : (
                          <button className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#A1A1AA] hover:text-[#FAFAFA] bg-white/[0.02] hover:bg-white/[0.08] border border-transparent hover:border-white/[0.08] px-3 py-1.5 rounded-md transition-colors">
                            <Eye className="w-3.5 h-3.5" />
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