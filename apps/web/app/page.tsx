"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useRouter } from "next/navigation"
import RadialFeatures from "./components/ui/feture"
import { CoreGraspLogo } from "./components/ui/logo"
import HowItWorks from "./components/ui/steps"

// ═══════════════════════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════════════════════

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

interface Step {
  icon: React.ReactNode
  step: string
  title: string
  desc: string
}

interface Feature {
  title: string
  desc: string
  size: "small" | "large" | "tall" | "full"
  visual: React.ReactNode
}

interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════════════════════════════════════

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

const options = [
  { letter: "A", text: "5 days — carryover is limited to unused days at year-end", correct: false },
  { letter: "B", text: "4 days — Q4 requests are subject to a deferred carryover cap", correct: false },
  { letter: "C", text: "3 days — the policy caps carryover at 25% of annual entitlement", correct: true },
  { letter: "D", text: "None — leave cannot be carried over with any pending requests", correct: false },
]

// ═══════════════════════════════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function Home() {
  const router = useRouter()
  const [picked, setPicked] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -60])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className="flex flex-col min-h-screen overflow-x-hidden bg-[#050505] text-[#fafafa] antialiased selection:bg-emerald-500/30 selection:text-emerald-50"
      style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif", fontSize: 16, lineHeight: 1.6 }}
    >
      {/* ── Global Styles & Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        .font-display {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-body {
          font-family: 'Inter', system-ui, sans-serif;
        }

        html { scroll-behavior: smooth; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════════
          AMBIENT BACKGROUND
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="absolute top-[-10%] left-[-5%] w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-emerald-500/[0.03] rounded-full blur-[100px] md:blur-[160px]" />
        <div className="absolute top-[40%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-500/[0.02] rounded-full blur-[100px] md:blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/[0.02] rounded-full blur-[100px] md:blur-[120px]" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          NAVIGATION
          ═══════════════════════════════════════════════════════════════════════ */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`flex items-center justify-between px-5 lg:px-12 py-4 sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#050505]/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/[0.04]"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
          <CoreGraspLogo />
          <span className="font-display text-[20px] md:text-[22px] tracking-tight text-white font-medium">
            Core<span className="text-emerald-400">Grasp</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[13px] text-[#71717a] font-medium uppercase tracking-[0.15em]">
          {[
            { label: "How it works", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="no-underline hover:text-white transition-colors duration-300 relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-emerald-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/signin")}
            className="hidden md:block text-[13px] font-semibold px-6 py-2.5 rounded-full bg-white/[0.04] text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer backdrop-blur-md border border-white/[0.06] hover:border-white"
          >
            Request Access
          </motion.button>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer border-none bg-transparent"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "opacity-0 translate-x-2" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden flex flex-col gap-5 px-6 py-6 bg-[#050505]/95 backdrop-blur-2xl overflow-hidden sticky top-[65px] z-40 border-b border-white/[0.04]"
          >
            {["How it works", "Features", "Pricing"].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMenuOpen(false)} className="text-[13px] font-medium text-[#71717a] uppercase tracking-widest no-underline hover:text-white transition-colors">
                {l}
              </a>
            ))}
            <button
              onClick={() => { setMenuOpen(false); router.push("/signin"); }}
              className="text-[14px] font-semibold px-4 py-3 mt-2 rounded-full bg-white text-black text-center cursor-pointer hover:bg-white/90 transition-all duration-300"
            >
              Request Access
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative max-w-[1100px] mx-auto w-full px-5 pt-[80px] md:pt-[120px] lg:pt-[140px] pb-16 flex flex-col items-center text-center z-10"
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[600px] bg-emerald-500/[0.03] rounded-full blur-[100px] md:blur-[140px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[150px] md:h-[250px] bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white/[0.02] text-emerald-400 mb-8 md:mb-10 backdrop-blur-xl border border-white/[0.06] hover:border-emerald-500/20 transition-all duration-500 cursor-default group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
          </span>
          <span className="group-hover:text-emerald-300 transition-colors">Compliance Engine 2.0</span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/20 ml-1">NEW</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto max-w-[900px] text-center mb-6 md:mb-8"
        >
          <h1 className="font-mono text-[clamp(2.5rem,7vw,5.5rem)] font-mono leading-[1.1] md:leading-[1.05] tracking-[-0.03em] text-white">
            Upload any policy.
          </h1>

          <div className="relative mt-2 md:mt-4">
            <span className="absolute left-1/2 top-1/2 -z-10 h-[80%] w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-[60px] md:blur-[100px]" />
            <h1 className="font-mono text-[clamp(2.5rem,7vw,5.5rem)]  font-mono leading-[1.1]  md:leading-[1.05] tracking-[-0.03em]">
              <span className="bg-gradient-to-b from-white via-emerald-100 to-emerald-400  bg-clip-text text-transparent">
                Know who <em >actually</em>
              </span>
              <br className="hidden md:block" />
              <span className="bg-gradient-to-b from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent pl-2 md:pl-0">
                read it.
              </span>
            </h1>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-[15px] md:text-[19px] text-[#a1a1aa] leading-[1.6] md:leading-[1.7] max-w-[600px] mb-10 md:mb-12 font-light tracking-[-0.01em]"
        >
          Upload any internal policy. CoreGrasp parses it with AI, generates rigorous assessments, and deploys them instantly — so you know who actually understands the rules.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-16 md:mb-20 w-full sm:w-auto px-4 sm:px-0"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 60px rgba(255,255,255,0.12)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/signin")}
            className="group relative text-[12px] md:text-[13px] font-bold px-8 py-3.5 md:px-10 md:py-4 rounded-xl bg-white text-black cursor-pointer hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto uppercase tracking-[0.12em] overflow-hidden border border-white/20"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Deploy Free Quiz
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.06)" }}
            whileTap={{ scale: 0.97 }}
            className="group text-[12px] md:text-[13px] font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-xl bg-white/[0.02] text-white cursor-pointer transition-all backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] w-full sm:w-auto uppercase tracking-[0.12em] flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/40 group-hover:text-white/70 transition-colors">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            See How It Works
          </motion.button>
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="relative z-10 py-16 md:py-24 lg:py-32">
        <HowItWorks />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DASHBOARD MOCKUP
          ═══════════════════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════════════════
          BENTO GRID FEATURES
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="features" className="relative z-10 py-16 md:py-24 lg:py-32">
        <RadialFeatures />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SAMPLE QUESTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-16 md:py-24 lg:py-32">
        <div className="max-w-[800px] lg:max-w-[900px] mx-auto w-full px-4 sm:px-6">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10 md:mb-16"
          >
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#52525b] mb-4 block">
              Interactive Demo
            </span>
            <h2 className="font-mono text-[clamp(1.8rem,4vw,3.5rem)] font-normal tracking-[-0.02em] leading-[1.1] text-white mb-4 md:mb-5">
              Inspect the Output
            </h2>
            <p className="text-[14px] md:text-[15px] text-[#71717a] max-w-[480px] mx-auto font-light leading-relaxed">
              Generated directly from an internal knowledge base. Select the correct logic path below.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-2xl md:rounded-3xl p-6 sm:p-8 lg:p-12 relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_40px_rgba(0,0,0,0.6)] md:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_30px_60px_rgba(0,0,0,0.6)] border border-white/[0.04]"
          >
            <div className="absolute top-0 right-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-emerald-500/[0.02] rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-8 md:mb-10 relative z-10">
              <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest bg-white/[0.02] px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[#71717a] border border-white/[0.04]">
                Source: Leave_Policy_v4.pdf
              </span>
              <span className="text-[9px] md:text-[10px] font-mono text-[#52525b] px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-black/50 border border-white/[0.04] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                Llama 3.2 3B Instruct
              </span>
            </div>

            <div className="text-[15px] md:text-[18px] font-mono lg:text-[21px] font-medium leading-[1.6] md:leading-[1.7] mb-8 md:mb-12 text-white relative z-10 italic tracking-wide">
              An employee has utilized 8 of their 12 annual leave days and requests 5 more in Q4. What is the maximum leave they can carry into the next fiscal year under Section 4?
            </div>

            <div className="flex flex-col gap-2.5 md:gap-3 relative z-10">
              {options.map((o, i) => {
                const chosen = picked === i
                const revealed = picked !== null

                const cls =
                  (chosen && o.correct) || (revealed && o.correct)
                    ? "bg-emerald-500/[0.06] text-emerald-400 border-emerald-500/20"
                    : chosen && !o.correct
                      ? "bg-rose-500/[0.06] text-rose-400 border-rose-500/20"
                      : "bg-white/[0.01] text-[#a1a1aa] hover:bg-white/[0.025] border-white/[0.04] hover:border-white/[0.08]"

                return (
                  <motion.div
                    key={o.letter}
                    whileHover={picked === null ? { scale: 1.01, x: 2 } : {}}
                    whileTap={picked === null ? { scale: 0.99 } : {}}
                    onClick={() => picked === null && setPicked(i)}
                    className={`flex items-start md:items-center gap-3 md:gap-5 px-4 md:px-6 py-3 md:py-4 rounded-xl text-[13px] md:text-[14px] transition-all duration-300 border ${cls} ${picked === null ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span className={`w-6 h-6 md:w-8 md:h-8 mt-0.5 md:mt-0 shrink-0 rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-mono font-bold transition-colors ${((chosen && o.correct) || (revealed && o.correct))
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                        : (chosen && !o.correct)
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                          : 'bg-[#0a0a0a] text-[#52525b] border border-white/[0.06]'
                      }`}>
                      {o.letter}
                    </span>
                    <span className="leading-relaxed font-light mt-0.5 md:mt-0">{o.text}</span>
                  </motion.div>
                )
              })}
            </div>

            <AnimatePresence>
              {picked !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden relative z-10"
                >
                  <div className="px-5 md:px-6 py-4 md:py-5 bg-[#0a0a0a] rounded-xl md:rounded-2xl text-[12px] md:text-[13px] text-[#a1a1aa] leading-relaxed font-mono border border-white/[0.04]">
                    <strong className="text-emerald-400 block mb-2 uppercase tracking-widest text-[10px] md:text-[11px]">Diagnostic Logic:</strong>
                    Distractors A and D mirror generic HR terminology. B fabricates a Q4 deferred cap absent from the source document. C isolates the exact constraint defined in Section 4. True comprehension verified.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="max-w-[1000px] mx-auto w-full px-4 sm:px-6 py-16 md:py-24 lg:py-32 flex flex-col items-center text-center relative z-10"
      >
        <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 lg:p-20 w-full overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_60px_rgba(0,0,0,0.6)] border border-white/[0.04]">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />

          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-normal tracking-[-0.02em] leading-[1.1] mb-4 md:mb-6 text-white">
            Production-Ready Compliance
          </h2>
          <p className="text-[14px] md:text-[16px] lg:text-[18px] text-[#71717a] leading-[1.6] md:leading-[1.7] mb-8 md:mb-12 max-w-[520px] mx-auto font-light">
            Upload your first policy payload at zero cost. No credit card required. Graph extraction ready in under 120 seconds.
          </p>
          <motion.button
            onClick={() => router.push("/signin")}
            whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.98 }}
            className="text-[12px] md:text-[14px] font-bold px-8 py-4 md:px-12 md:py-5 rounded-xl bg-white text-black uppercase tracking-[0.12em] cursor-pointer hover:bg-gray-100 transition-all shadow-lg border border-white/20 w-full sm:w-auto"
          >
            Upload Policy PDF
          </motion.button>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.04] px-6 lg:px-8 py-12 md:py-16 bg-[#050505] relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-5 md:mb-6">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.05]">
                  <CoreGraspLogo />
                </div>
                <span className="font-display text-lg md:text-xl tracking-tight text-white font-medium">
                  Core<span className="text-emerald-400">Grasp</span>
                </span>
              </div>
              <p className="text-[11px] md:text-[12px] text-[#52525b] leading-relaxed font-mono pr-4">
                Systematic extraction and compliance verification protocol for distributed org charts.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white mb-2 md:mb-3">Product</span>
              <a href="#how-it-works" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">How it Works</a>
              <a href="#features" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">Features</a>
              <a href="#pricing" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">Pricing</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white mb-2 md:mb-3">Company</span>
              <a href="#" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">Changelog</a>
              <a href="#" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">Engineering Blog</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white mb-2 md:mb-3">Legal</span>
              <a href="#" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">Privacy</a>
              <a href="#" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">Terms</a>
              <a href="#" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">SOC 2 Report</a>
            </div>
          </div>
          <div className="pt-6 md:pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[10px] md:text-[11px] font-mono text-[#3f3f46]">
              &copy; {new Date().getFullYear()} COREGRASP INC. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-mono text-[#52525b] uppercase">Systems Nominal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
