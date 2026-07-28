"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
// import { getuserCandidate } from "@/lib/candidate" // Uncomment in your actual project
// import DashboardSkeleton from "@/app/components/ui/dashboardloader" // Uncomment in your actual project

// ── Mock Data ────────────────────────────────────────────────────────────────

const statCards = [
  { label: "Active Policies", val: "12", sub: "2 require updates", trend: "neutral" },
  { label: "Avg. Pass Rate", val: "78%", sub: "+4.2% this month", trend: "up" },
  { label: "Pending Quizzes", val: "142", sub: "Across 3 campaigns", trend: "down" },
  { label: "High-Risk Gaps", val: "3", sub: "IT Security, POSH", trend: "alert" },
]

const policyPerformance = [
  { name: "Code of Conduct", passed: 245, failed: 12, pending: 43 },
  { name: "IT Security v2", passed: 180, failed: 45, pending: 82 },
  { name: "Leave Policy Q4", passed: 310, failed: 22, pending: 15 },
  { name: "Expense Guidelines", passed: 156, failed: 38, pending: 110 },
]

const mockCandidates = [
  { id: "1", email: "priya.sharma@company.com", policy: "IT Security v2", score: 88, status: "Pass", date: "Today, 10:42 AM" },
  { id: "2", email: "arjun.mehta@company.com", policy: "Leave Policy Q4", score: 52, status: "Fail", date: "Today, 09:15 AM" },
  { id: "3", email: "sanjana.rao@company.com", policy: "Code of Conduct", score: 100, status: "Pass", date: "Yesterday" },
  { id: "4", email: "dev.patil@company.com", policy: "IT Security v2", score: 61, status: "Fail", date: "Yesterday" },
  { id: "5", email: "kavya.nair@company.com", policy: "Remote Work Guide", score: 92, status: "Pass", date: "Oct 12" },
]

// ── Helper ──────────────────────────────────────────────────────────────────

const getInitials = (email: string) => {
  if (!email) return "??"
  const parts = email.split('@')[0].split(/[._-]/)
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase()
  return email.substring(0, 2).toUpperCase()
}

// ── Main Dashboard Component ────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();

  const [recent, setRecent] = useState<any[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadCandidate = async () => {
    setIsLoading(true);
    try {
      // const candidate = await getuserCandidate();
      // if (candidate) setRecent(candidate);
      
      // Fallback to mock data for demonstration
      setRecent(mockCandidates); 
    } catch (error) {
      console.error("Failed to load candidates:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCandidate()
  }, [])
 
  if (isLoading) {
    // return <DashboardSkeleton />
    return <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white/50 text-sm">Loading Workspace...</div>
  }

  return ( 
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] font-sans selection:bg-white/20">
      
      {/* ── Subtle Top Glow ── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ── Main Content ── */}
      <main className="p-6 md:p-8 w-full">
        <div className="max-w-8xl  mx-auto flex flex-col gap-6">
          
          {/* Header Section */}
          <div className="flex justify-between items-end mb-2">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white">Revisly Dashboard</h1>
              <p className="text-[13px] text-[#A1A1AA] mt-1">Monitor policy comprehension and employee compliance.</p>
            </div>
          </div>

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

          {/* ── Middle Row: Charts & Alerts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">

            {/* Performance by Policy */}
            <div className="bg-[#121214] border border-white/[0.08] rounded-xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[14px] font-medium text-white">Performance by Policy</h2>
                <button className="text-[12px] text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1">
                  View All <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              <div className="flex flex-col gap-5 flex-1">
                {policyPerformance.map((policy) => {
                  const total = policy.passed + policy.failed + policy.pending;
                  const passPct = (policy.passed / total) * 100;
                  const failPct = (policy.failed / total) * 100;
                  const pendPct = (policy.pending / total) * 100;

                  return (
                    <div key={policy.name} className="group">
                      <div className="flex justify-between text-[12px] mb-2">
                        <span className="font-medium text-[#FAFAFA]">{policy.name}</span>
                        <span className="text-[#71717A] text-[11px]">{total} attempts</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden flex ring-1 ring-white/[0.05]">
                        <div style={{ width: `${passPct}%` }} className="h-full bg-emerald-500 transition-all duration-1000 ease-out" />
                        <div style={{ width: `${failPct}%` }} className="h-full bg-rose-500 transition-all duration-1000 ease-out" />
                        <div style={{ width: `${pendPct}%` }} className="h-full bg-[#3F3F46] transition-all duration-1000 ease-out" />
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="flex gap-4 mt-6 pt-4 border-t border-white/[0.08] text-[11px] font-medium text-[#A1A1AA]">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Passed</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /> Failed</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3F3F46]" /> Pending</div>
              </div>
            </div>

            {/* Required Actions / Alerts */}
            <div className="bg-[#121214] border border-white/[0.08] rounded-xl p-6 flex flex-col">
              <h2 className="text-[14px] font-medium text-white mb-4">Required Actions</h2>
              <div className="flex-1 flex flex-col gap-3">
                
                {/* Alert 1 */}
                <div className="p-4 rounded-lg bg-[#18181B] border border-white/[0.04] hover:border-emerald-500/20 transition-colors group">
                  <div className="flex items-center gap-2 text-[12px] font-medium text-emerald-500 mb-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Autopilot Sequence
                  </div>
                  <p className="text-[12px] text-[#A1A1AA] leading-relaxed mb-3">
                    142 pending employees will receive Slack nudges tomorrow at 09:00.
                  </p>
                  <button className="text-[11px] font-medium text-white px-3 py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.1] transition-colors w-full">
                    Review Schedule
                  </button>
                </div>

                {/* Alert 2 */}
                <div className="p-4 rounded-lg bg-[#18181B] border border-rose-500/10 hover:border-rose-500/30 transition-colors group">
                  <div className="flex items-center gap-2 text-[12px] font-medium text-rose-500 mb-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Policy Expiring
                  </div>
                  <p className="text-[12px] text-[#A1A1AA] leading-relaxed mb-3">
                    Data Privacy v1.4 expires in 4 days. A new upload is required.
                  </p>
                  <button className="text-[11px] font-medium text-white px-3 py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.1] transition-colors w-full">
                    Upload PDF
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* ── Table Area ── */}
          <div className="bg-[#121214] border border-white/[0.08] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <h2 className="text-[14px] font-medium text-white">Recent Completions</h2>
              <button className="text-[12px] font-medium text-[#A1A1AA] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded px-3 py-1.5 transition-colors">
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#0E0E11]">
                    <th className="py-3 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Candidate</th>
                    <th className="py-3 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Policy Assessed</th>
                    <th className="py-3 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Score</th>
                    <th className="py-3 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Status</th>
                    <th className="py-3 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {recent?.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#18181B] flex items-center justify-center text-[11px] font-medium text-[#FAFAFA] border border-white/[0.08]">
                            {getInitials(attempt.email)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-medium text-[#FAFAFA]">{attempt.email}</span>
                            <span className="text-[11px] text-[#71717A]">Employee</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="text-[13px] text-[#FAFAFA]">{attempt.policy}</div>
                        <div className="text-[11px] text-[#71717A]">{attempt.date || "Just now"}</div>
                      </td>
                      <td className="py-3 px-6">
                        <span className="text-[13px] font-medium text-[#FAFAFA]">{attempt.score}%</span>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                          (attempt.status === "Pass" || attempt.score >= 70)
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}>
                          {attempt.status || (attempt.score >= 70 ? "Pass" : "Fail")}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        {(attempt.status === "Fail" || attempt.score < 70) ? (
                          <button className="text-[11px] font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-2.5 py-1.5 rounded transition-colors">
                            Send Nudge
                          </button>
                        ) : (
                          <button className="text-[11px] font-medium text-[#71717A] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1.5 rounded transition-colors">
                            Details
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