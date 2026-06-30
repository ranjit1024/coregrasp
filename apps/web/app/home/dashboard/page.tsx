"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

// ── Mock Data ────────────────────────────────────────────────────────────────

const statCards = [
  { label: "Active Policies", val: "12", sub: "2 require updates", trend: "neutral" },
  { label: "Avg. Pass Rate", val: "78%", sub: "+4.2% this month", trend: "up" },
  { label: "Pending Quizzes", val: "142", sub: "Across 3 campaigns", trend: "down" },
  { label: "High-Risk Gaps", val: "3", sub: "IT Security, POSH", trend: "alert" },
]

const recentAttempts = [
  { id: "1", name: "Priya Sharma", role: "Engineering", policy: "IT Security v2", date: "Today, 10:42 AM", score: 88, status: "Pass" },
  { id: "2", name: "Arjun Mehta", role: "Sales", policy: "Leave Policy Q4", date: "Today, 09:15 AM", score: 52, status: "Fail" },
  { id: "3", name: "Sanjana Rao", role: "Marketing", policy: "Code of Conduct", date: "Yesterday", score: 100, status: "Pass" },
  { id: "4", name: "Dev Patil", role: "Design", policy: "IT Security v2", date: "Yesterday", score: 61, status: "Fail" },
  { id: "5", name: "Kavya Nair", role: "Product", policy: "Remote Work Guide", date: "Oct 12", score: 92, status: "Pass" },
]

const policyPerformance = [
  { name: "Code of Conduct", passed: 245, failed: 12, pending: 43 },
  { name: "IT Security v2", passed: 180, failed: 45, pending: 82 },
  { name: "Leave Policy Q4", passed: 310, failed: 22, pending: 15 },
  { name: "Expense Guidelines", passed: 156, failed: 38, pending: 110 },
]

// ── Logo Component ──────────────────────────────────────────────────────────

function CoreGraspLogo({ className = "w-6 h-6 text-emerald-500" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className={className}>
      <path d="M28 16c0 6.627-5.373 12-12 12S4 22.627 4 16 9.373 4 16 4c2.83 0 5.43 1.01 7.44 2.68" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="16" cy="16" r="4.5" fill="currentColor" />
      <circle cx="25.5" cy="6.5" r="2.5" fill="currentColor" className="opacity-80" />
    </svg>
  )
}

// ── Main Dashboard Component ────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview")

  return ( 
    
<div>
      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col h-full relative w-[100%] bg-[#09090B]">
        
        {/* Subtle top glow */}
        <div className="absolute top-0 inset-x-0 h-px  bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Top Header */}
        <header className="h-[68px] w-full px-8 border-b border-white/[0.08] flex items-center justify-between bg-[#09090B]/90 backdrop-blur-md z-10 sticky top-0">
          <h1 className="text-[16px] font-medium text-white">{activeTab}</h1>

          <div className="flex items-center gap-4">
            {/* Spotlight Search */}
            <div className="hidden lg:flex items-center bg-[#18181B] border border-white/[0.08] rounded-md px-3 py-1.5 w-[280px] focus-within:ring-1 focus-within:ring-emerald-500/50 focus-within:border-emerald-500/50 transition-all shadow-sm">
              <svg className="w-4 h-4 text-[#71717A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-[13px] text-white ml-2 w-full placeholder-[#71717A]"
              />
              <div className="flex items-center gap-0.5 text-[#71717A] text-[10px] font-medium">
                <kbd className="font-sans border border-white/10 bg-white/5 rounded px-1 py-0.5">⌘</kbd>
                <kbd className="font-sans border border-white/10 bg-white/5 rounded px-1 py-0.5">K</kbd>
              </div>
            </div>

            <button className="relative w-8 h-8 rounded-md flex items-center justify-center text-[#A1A1AA] hover:bg-white/5 hover:text-white transition-colors">
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-[#09090B]" />
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>

            <button onClick={(e)=> {
              router.push("/home/upload")
            }} className="bg-white hover:cursor-pointer text-black hover:bg-gray-200 font-medium text-[13px] px-4 py-1.5 rounded-md transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Policy
            </button>
          </div>
        </header>

        {/* Dashboard Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-8 w-3rem">
          <div className="max-w-[11000px] mx-auto flex flex-col gap-6">
            
            {/* ── KPI Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat, i) => (
                <div key={i} className="bg-[#121214] border border-white/[0.08] rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-[110px]">
                  <div className="flex justify-between items-start">
                    <div className="text-[12px] font-medium text-[#A1A1AA]">{stat.label}</div>
                    {/* Tiny Trend Badge */}
                    {stat.trend !== "neutral" && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        stat.trend === "up" ? "bg-emerald-500/10 text-emerald-500" :
                        stat.trend === "alert" ? "bg-rose-500/10 text-rose-500" :
                        "bg-amber-500/10 text-amber-500"
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
            {/* <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
  
              <div className="bg-[#121214] border border-white/[0.08] rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[14px] font-medium text-white">Performance by Policy</h2>
                  <button className="text-[12px] text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1">
                    View All <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {policyPerformance.map((policy) => {
                    const total = policy.passed + policy.failed + policy.pending;
                    const passPct = (policy.passed / total) * 100;
                    const failPct = (policy.failed / total) * 100;
                    const pendPct = (policy.pending / total) * 100;

                    return (
                      <div key={policy.name} className="group">
                        <div className="flex justify-between text-[12px] mb-1.5">
                          <span className="font-medium text-[#FAFAFA]">{policy.name}</span>
                          <span className="text-[#71717A] opacity-0 group-hover:opacity-100 transition-opacity">
                            {total} total attempts
                          </span>
                        </div>
            
                        <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden flex ring-1 ring-white/[0.05]">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${passPct}%` }} transition={{ duration: 0.8 }} className="h-full bg-emerald-500" />
                          <motion.div initial={{ width: 0 }} animate={{ width: `${failPct}%` }} transition={{ duration: 0.8, delay: 0.1 }} className="h-full bg-rose-500" />
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pendPct}%` }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full bg-[#3F3F46]" />
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
                  <div className="p-3.5 rounded-lg bg-[#18181B] border border-white/[0.04] hover:border-emerald-500/20 transition-colors group">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-emerald-500 mb-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      Autopilot Sequence
                    </div>
                    <p className="text-[12px] text-[#A1A1AA] leading-relaxed mb-3">
                      142 pending employees will receive Slack nudges tomorrow at 09:00.
                    </p>
                    <button className="text-[11px] font-medium text-white px-2.5 py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.1] transition-colors">
                      Review Schedule
                    </button>
                  </div>

                  {/* Alert 2 */}
                  <div className="p-3.5 rounded-lg bg-[#18181B] border border-rose-500/10 hover:border-rose-500/30 transition-colors group">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-rose-500 mb-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Policy Expiring
                    </div>
                    <p className="text-[12px] text-[#A1A1AA] leading-relaxed mb-3">
                      Data Privacy v1.4 expires in 4 days. A new upload is required.
                    </p>
                    <button className="text-[11px] font-medium text-white px-2.5 py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.1] transition-colors">
                      Upload PDF
                    </button>
                  </div>

                </div>
              </div>
            {/* </div> */}

            {/* ── Table Area ── */}
            <div className="bg-[#121214] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
                <h2 className="text-[14px] font-medium text-white">Recent Completions</h2>
                <button className="text-[12px] font-medium text-[#A1A1AA] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded px-2.5 py-1.5 transition-colors">
                  Export CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-[#0E0E11]">
                      <th className="py-2.5 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Candidate</th>
                      <th className="py-2.5 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Policy Assessed</th>
                      <th className="py-2.5 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Score</th>
                      <th className="py-2.5 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Status</th>
                      <th className="py-2.5 px-6 text-[11px] font-medium text-[#71717A] uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {recentAttempts.map((attempt) => (
                      <tr key={attempt.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#18181B] flex items-center justify-center text-[11px] font-medium text-[#A1A1AA] border border-white/[0.08]">
                              {attempt.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-medium text-[#FAFAFA]">{attempt.name}</span>
                              <span className="text-[11px] text-[#71717A]">{attempt.role}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="text-[13px] text-[#FAFAFA]">{attempt.policy}</div>
                          <div className="text-[11px] text-[#71717A]">{attempt.date}</div>
                        </td>
                        <td className="py-3 px-6">
                          <span className="text-[13px] font-medium text-[#FAFAFA]">{attempt.score}%</span>
                        </td>
                        <td className="py-3 px-6">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                            attempt.status === "Pass" 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}>
                            {attempt.status}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-right">
                          {attempt.status === "Fail" ? (
                            <button className="text-[11px] font-medium text-white bg-white/[0.08] hover:bg-white/[0.12] px-2.5 py-1.5 rounded transition-colors">
                              Send Nudge
                            </button>
                          ) : (
                            <button className="text-[11px] font-medium text-[#71717A] hover:text-white transition-colors">
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

            {/* Bottom spacer */}
            <div className="h-8" />
          </div>
        </main>
      </div>
    </div>
  )
}