"use client"

import { motion } from "framer-motion"

interface Candidate {
  name: string
  score: string
  pass: boolean
  avatar: string
}

interface PolicyBar {
  label: string
  pct: number
  color: string
}

const candidates: Candidate[] = [
  { name: "Priya Sharma", score: "88%", pass: true, avatar: "PS" },
  { name: "Arjun Mehta", score: "52%", pass: false, avatar: "AM" },
  { name: "Sanjana Rao", score: "79%", pass: true, avatar: "SR" },
  { name: "Dev Patil", score: "61%", pass: false, avatar: "DP" },
  { name: "Ananya Krishnan", score: "94%", pass: true, avatar: "AK" },
]

const policyBars: PolicyBar[] = [
  { label: "Leave Policy", pct: 74, color: "bg-emerald-400" },
  { label: "Code of Conduct", pct: 88, color: "bg-emerald-400" },
  { label: "IT Security", pct: 61, color: "bg-amber-400" },
  { label: "POSH", pct: 45, color: "bg-rose-400" },
  { label: "Data Privacy", pct: 92, color: "bg-emerald-400" },
]

export default function DashboardMockup() {
  return (
    <section className="relative z-10 py-16 md:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1100px] lg:max-w-[1200px] mx-auto w-full px-4 sm:px-6"
      >
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#52525b] mb-4 block">Live Dashboard</span>
          <h2 className="font-mono text-[clamp(1.8rem,4vw,3.5rem)] font-normal tracking-[-0.02em] leading-[1.1] text-white mb-4">
            Real-time compliance intelligence
          </h2>
          <p className="text-[14px] md:text-[15px] text-[#71717a] max-w-[500px] mx-auto font-light leading-relaxed px-2">
            Track every policy, every candidate, every result — all in one unified view.
          </p>
        </div>

        <div className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-[20px] md:rounded-[28px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] md:shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] border border-white/[0.04] group">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none" />

          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[500px] h-[150px] md:h-[200px] bg-emerald-500/[0.03] rounded-full blur-[60px] md:blur-[80px] pointer-events-none group-hover:bg-emerald-500/[0.05] transition-all duration-1000" />

          {/* Browser chrome */}
          <div className="relative bg-white/[0.01] px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3 backdrop-blur-xl border-b border-white/[0.04]">
            <div className="flex gap-1.5 md:gap-2 shrink-0">
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-rose-500/15 ring-1 ring-rose-500/25" />
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-amber-500/15 ring-1 ring-amber-500/25" />
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/25" />
            </div>
            <div className="flex-1 flex justify-center overflow-hidden px-2">
              <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-mono text-[#3f3f46] bg-white/[0.02] px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-white/[0.04] truncate max-w-full">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500/30 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <span className="truncate">acme-corp.coregrasp.com/dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
              <span className="text-[8px] md:text-[9px] text-emerald-400/50 font-mono uppercase tracking-wider hidden sm:block">Live</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-10 relative">
            {/* ─── STATS ROW ─── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
              {[
                {
                  label: "Active Policies",
                  val: "04",
                  sub: "Leave, Conduct, IT",
                  subColor: "text-emerald-400",
                  trend: "+1 this week",
                  trendUp: true,
                  icon: "📄",
                  sparkline: [40, 55, 45, 60, 52, 68, 72]
                },
                {
                  label: "Employees Sync'd",
                  val: "312",
                  sub: "↑ 24 this week",
                  subColor: "text-emerald-400",
                  trend: "92% complete",
                  trendUp: true,
                  icon: "👥",
                  sparkline: [200, 220, 245, 260, 280, 300, 312]
                },
                {
                  label: "Mandate Gaps",
                  val: "38",
                  sub: "Reminders queued",
                  subColor: "text-amber-400",
                  trend: "↓ 12% vs last mo",
                  trendUp: false,
                  icon: "⚠️",
                  sparkline: [55, 52, 48, 50, 45, 42, 38]
                },
              ].map((s, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
                  key={i}
                  className="relative bg-white/[0.015] rounded-xl md:rounded-2xl p-5 lg:p-7 flex flex-col justify-between hover:bg-white/[0.03] transition-all duration-500 border border-white/[0.03] hover:border-white/[0.06] group/stat overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/[0.03] rounded-full blur-[40px] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-700" />

                  <div className="flex justify-between items-start mb-4 md:mb-5 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] md:text-lg opacity-50">{s.icon}</span>
                      <span className="text-[9px] md:text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em]">{s.label}</span>
                    </div>
                    <div className={`text-[8px] md:text-[9px] font-mono px-2 py-1 rounded-full border flex items-center gap-1 ${s.trendUp
                        ? "bg-emerald-500/5 text-emerald-400/60 border-emerald-500/10"
                        : "bg-amber-500/5 text-amber-400/60 border-amber-500/10"
                      }`}>
                      {s.trendUp ? "↑" : "↓"} {s.trend}
                    </div>
                  </div>

                  <div className="flex items-end justify-between relative z-10">
                    <div>
                      <div className={`font-display text-3xl md:text-4xl lg:text-[3.2rem] tracking-tight mb-1.5 md:mb-2 ${i === 2 ? "text-amber-400" : "text-white"}`}>
                        {s.val}
                      </div>
                      <div className={`text-[9px] md:text-[10px] font-mono uppercase tracking-wider ${s.subColor} opacity-70`}>
                        {s.sub}
                      </div>
                    </div>

                    <svg width="60" height="30" viewBox="0 0 60 30" className="opacity-30 group-hover/stat:opacity-60 transition-opacity hidden sm:block">
                      <defs>
                        <linearGradient id={`spark-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={i === 2 ? "#f59e0b" : "#34d399"} stopOpacity="0.3" />
                          <stop offset="100%" stopColor={i === 2 ? "#f59e0b" : "#34d399"} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d={`M0,${30 - (s.sparkline[0] / Math.max(...s.sparkline)) * 30} ${s.sparkline.slice(1).map((v, j) => `L${(j + 1) * (60 / (s.sparkline.length - 1))},${30 - (v / Math.max(...s.sparkline)) * 30}`).join(" ")}`}
                        fill="none"
                        stroke={i === 2 ? "#f59e0b" : "#34d399"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d={`M0,${30 - (s.sparkline[0] / Math.max(...s.sparkline)) * 30} ${s.sparkline.slice(1).map((v, j) => `L${(j + 1) * (60 / (s.sparkline.length - 1))},${30 - (v / Math.max(...s.sparkline)) * 30}`).join(" ")} V30 H0 Z`}
                        fill={`url(#spark-${i})`}
                        opacity="0.2"
                      />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ─── MAIN DASHBOARD GRID ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 md:gap-5">
              {/* Left: Latest Attempts */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative bg-white/[0.015] rounded-xl md:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/[0.03] hover:border-white/[0.06] transition-all duration-500 overflow-x-auto"
              >
                <div className="flex justify-between items-center mb-6 md:mb-8 min-w-[300px]">
                  <div>
                    <div className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.15em] text-white mb-1">Latest Attempts</div>
                    <div className="text-[9px] md:text-[10px] text-[#52525b] font-mono">Leave Policy • Last 24h</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[9px] md:text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.06)] flex items-center gap-1.5 md:gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      LIVE
                    </div>
                  </div>
                </div>

                {/* Table header */}
                <div className="flex items-center px-2 md:px-4 pb-2 md:pb-3 mb-2 md:mb-3 border-b border-white/[0.03] min-w-[300px]">
                  <div className="flex-1 text-[8px] md:text-[9px] font-bold text-[#3f3f46] uppercase tracking-[0.2em]">Candidate</div>
                  <div className="w-20 md:w-24 text-[8px] md:text-[9px] font-bold text-[#3f3f46] uppercase tracking-[0.2em] text-right hidden sm:block">Progress</div>
                  <div className="w-16 md:w-20 text-[8px] md:text-[9px] font-bold text-[#3f3f46] uppercase tracking-[0.2em] text-right">Score</div>
                  <div className="w-14 md:w-16 text-[8px] md:text-[9px] font-bold text-[#3f3f46] uppercase tracking-[0.2em] text-right hidden lg:block">Time</div>
                </div>

                <div className="space-y-1 min-w-[300px]">
                  {candidates.map((c, i) => (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-center py-2.5 md:py-3 px-2 md:px-4 rounded-xl hover:bg-white/[0.02] transition-all duration-300 group/row cursor-default"
                    >
                      <div className="flex items-center gap-2.5 md:gap-3 flex-1 min-w-0">
                        <div className={`w-7 h-7 md:w-8 md:h-8 shrink-0 rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-bold border ${c.pass ? "bg-emerald-500/8 text-emerald-400 border-emerald-500/15" : "bg-rose-500/8 text-rose-400 border-rose-500/15"}`}>
                          {c.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] md:text-[13px] text-[#a1a1aa] font-medium group-hover/row:text-white transition-colors truncate">{c.name}</div>
                          <div className="text-[8px] md:text-[9px] text-[#3f3f46] font-mono truncate">Engineering</div>
                        </div>
                      </div>

                      <div className="w-20 md:w-24 hidden sm:block">
                        <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: c.score }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4 + i * 0.08, ease: "easeOut" }}
                            className={`h-full rounded-full ${c.pass ? "bg-emerald-400" : "bg-rose-400"} shadow-[0_0_6px_rgba(52,211,153,0.15)]`}
                          />
                        </div>
                      </div>

                      <div className="w-16 md:w-20 text-right">
                        <span className={`inline-flex items-center gap-1 text-[9px] md:text-[11px] font-mono px-2 md:px-2.5 py-0.5 md:py-1 rounded-md md:rounded-lg border ${c.pass
                            ? "bg-emerald-500/[0.06] text-emerald-400 border-emerald-500/12"
                            : "bg-rose-500/[0.06] text-rose-400 border-rose-500/12"
                          }`}>
                          {c.pass ? "✓" : "✕"} {c.score}
                        </span>
                      </div>

                      <div className="w-14 md:w-16 text-right hidden lg:block">
                        <span className="text-[9px] md:text-[10px] text-[#3f3f46] font-mono">2m ago</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 md:mt-5 pt-3 md:pt-4 border-t border-white/[0.03] flex justify-between items-center min-w-[300px]">
                  <span className="text-[9px] md:text-[10px] text-[#3f3f46]">Showing 5 of 312 employees</span>
                  <button className="text-[9px] md:text-[10px] font-bold text-emerald-400/60 hover:text-emerald-400 uppercase tracking-wider transition-colors">
                    View All →
                  </button>
                </div>
              </motion.div>

              {/* Right: Analytics Column */}
              <div className="flex flex-col gap-4 md:gap-5">
                {/* Pass Rate Bars */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="relative bg-white/[0.015] rounded-xl md:rounded-2xl p-5 sm:p-6 lg:p-8 border border-white/[0.03] hover:border-white/[0.06] transition-all duration-500 flex-1"
                >
                  <div className="flex justify-between items-center mb-6 md:mb-8">
                    <div>
                      <div className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.15em] text-white">Pass Rate by Policy</div>
                      <div className="text-[9px] md:text-[10px] text-[#52525b] font-mono mt-1">Last 30 days</div>
                    </div>
                    <div className="text-[9px] md:text-[10px] font-mono text-white/25 bg-white/[0.02] px-2 py-1 rounded-md border border-white/[0.04]">Avg: 78%</div>
                  </div>

                  <div className="flex flex-col gap-5 md:gap-6">
                    {policyBars.map((b, i) => (
                      <div key={b.label}>
                        <div className="flex justify-between text-[10px] md:text-[11px] mb-2">
                          <span className="text-[#a1a1aa] font-medium uppercase tracking-wider">{b.label}</span>
                          <span className="text-white font-mono font-bold">{b.pct}%</span>
                        </div>
                        <div className="h-1.5 md:h-2 bg-white/[0.02] overflow-hidden rounded-full border border-white/[0.02]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${b.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className={`h-full rounded-full ${b.color} relative`}
                          >
                            <div className={`absolute inset-0 rounded-full ${b.color} opacity-40 blur-sm`} />
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Mini Activity Feed */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="relative bg-white/[0.015] rounded-xl md:rounded-2xl p-5 md:p-6 border border-white/[0.03] hover:border-white/[0.06] transition-all duration-500"
                >
                  <div className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.15em] text-white mb-4 md:mb-5">Recent Activity</div>
                  <div className="space-y-3 md:space-y-4">
                    {[
                      { icon: "📤", text: "Quiz sent to 24 candidates", time: "2m ago", color: "text-blue-400" },
                      { icon: "✓", text: "Sarah Chen passed IT Policy", time: "5m ago", color: "text-emerald-400" },
                      { icon: "📝", text: "New policy uploaded", time: "12m ago", color: "text-amber-400" },
                      { icon: "⚠️", text: "3 reminders triggered", time: "1h ago", color: "text-rose-400" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 md:gap-3 group/item">
                        <div className={`w-6 h-6 md:w-7 md:h-7 rounded-md md:rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-[10px] md:text-xs shrink-0 ${item.color}`}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] md:text-[12px] text-[#a1a1aa] group-hover/item:text-white transition-colors truncate">{item.text}</div>
                        </div>
                        <div className="text-[8px] md:text-[9px] text-[#3f3f46] font-mono shrink-0">{item.time}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
