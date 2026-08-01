"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useRouter } from "next/navigation"
import RadialFeatures from "./components/ui/feture"

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Data ────────────────────────────────────────────────────────────────────

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

const steps: Step[] = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 3v13m0 0l-4-4m4 4l4-4" />
      </svg>
    ),
    step: "01",
    title: "Upload your policy PDF",
    desc: "Drop in any internal policy document — leave rules, code of conduct, IT security, anything.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    step: "02",
    title: "AI generates the quiz",
    desc: "CoreGrasp reads the document and creates multiple-choice questions that test real understanding — not just memory.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    step: "03",
    title: "Send to your team, see results",
    desc: "Share a link. Your dashboard shows who passed, who failed, and who hasn't taken it yet — in real time.",
  },
]

// Restructured Bento Grid with clean vertical separation (Media top, text bottom for precise alignment)


const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for small teams trying out CoreGrasp.",
    features: ["Up to 50 employees", "3 active policies", "Basic analytics", "Email support"],
  },
  {
    name: "Business",
    price: "$49",
    period: "/month",
    description: "For growing teams that need compliance at scale.",
    features: ["Up to 500 employees", "Unlimited policies", "Advanced analytics", "Slack & Teams integration", "Priority support", "CSV & API import"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Dedicated support and custom integrations.",
    features: ["Unlimited employees", "Unlimited policies", "Custom AI tuning", "SSO & SAML", "Dedicated CSM", "SLA guarantee"],
  },
]

const companyLogos = ["Acme Corp", "Globex", "Initech", "Umbrella", "Massive", "Hooli"]

// ── Animations ──────────────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
} as const

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter()
  const [picked, setPicked] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -40])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const options = [
    { letter: "A", text: "5 days — carryover is limited to unused days at year-end", correct: false },
    { letter: "B", text: "4 days — Q4 requests are subject to a deferred carryover cap", correct: false },
    { letter: "C", text: "3 days — the policy caps carryover at 25% of annual entitlement", correct: true },
    { letter: "D", text: "None — leave cannot be carried over with any pending requests", correct: false },
  ]

  return (
    <div
      className="flex flex-col min-h-screen overflow-x-hidden bg-[#000000] text-[#fafafa] antialiased selection:bg-emerald-500/30 selection:text-emerald-50"
      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.6 }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .serif { font-family: 'Instrument Serif', serif; }
      `}</style>

      {/* ── AMBIENT BACKGROUND & GRID ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[140px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`flex items-center justify-between px-6 lg:px-10 py-4 sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-black/60 backdrop-blur-xl shadow-2xl shadow-black/50 ring-1 ring-white/[0.02]" 
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
          <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_15px_rgba(52,211,153,0.15)] group-hover:scale-105 transition-transform duration-300">
            <span className="serif text-lg text-white font-normal">C</span>
          </div>
          <span className="serif text-2xl tracking-wide text-white">
            Core<span className="text-emerald-400">Grasp</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[13px] text-[#a1a1aa] font-medium uppercase tracking-widest">
          {[
            { label: "How it works", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
          ].map((l) => (
            <a 
              key={l.label} 
              href={l.href} 
              className="no-underline hover:text-white transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/signin")}
            className="hidden md:block text-[13px] font-semibold px-6 py-2.5 rounded-full bg-white/[0.05] text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
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
            className="md:hidden flex flex-col gap-5 px-6 py-6 bg-black/90 backdrop-blur-xl overflow-hidden sticky top-[65px] z-40 ring-1 ring-white/[0.02]"
          >
            {["How it works", "Features", "Pricing"].map((l) => (
              <a key={l} href="#" className="text-[13px] font-medium text-[#a1a1aa] uppercase tracking-widest no-underline hover:text-white transition-colors">
                {l}
              </a>
            ))}
            <button 
              onClick={() => router.push("/signin")}
              className="text-[14px] font-semibold px-4 py-3 mt-2 rounded-full bg-white text-black text-center cursor-pointer hover:bg-white/90 transition-all duration-300"
            >
              Request Access
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative max-w-[800px] lg:max-w-[1000px] mx-auto w-full px-6 pt-[140px] pb-24 flex flex-col items-center text-center z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] uppercase px-5 py-2.5 rounded-full bg-white/[0.02] text-emerald-400 mb-10 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_30px_rgba(52,211,153,0.1)] ring-1 ring-white/[0.03]"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          Compliance Engine 2.0
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="serif font-normal leading-[1.0] tracking-[-0.03em] text-[clamp(3.2rem,7vw,6.5rem)] mb-8 text-white drop-shadow-2xl"
        >
          Turn a policy PDF into
          <br />
          <em className="text-emerald-400 not-italic">a verifiable mandate.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-[17px] lg:text-[19px] text-[#a1a1aa] leading-[1.6] max-w-[620px] mb-10 font-light"
        >
          Upload any internal policy document. CoreGrasp uses AI to parse it, generate rigorous assessments, and deploy them instantly so you know who actually understands the rules.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-20 w-full sm:w-auto"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/signin")}
            className="text-[14px] font-bold px-10 py-4 rounded-full bg-white text-black cursor-pointer hover:bg-gray-100 transition-all duration-300 w-full sm:w-auto uppercase tracking-widest"
          >
            Deploy Free Quiz
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
            whileTap={{ scale: 0.98 }}
            className="text-[14px] font-semibold px-10 py-4 rounded-full bg-white/[0.03] text-white cursor-pointer transition-all backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/[0.03] w-full sm:w-auto uppercase tracking-widest"
          >
            View Architecture
          </motion.button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center gap-6 w-full"
        >
          <div className="h-[1px] w-24 bg-white/[0.1] mb-2 rounded-full" />
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#71717a]">
            Infrastructure Trusted By
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {companyLogos.map((logo) => (
              <span key={logo} className="serif text-[22px] text-white font-normal tracking-wide">
                {logo}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* ── DASHBOARD MOCKUP ── */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1000px] lg:max-w-[1200px] mx-auto w-full px-6 pb-32 z-10"
      >
        <div className="bg-black/40 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,1)] ring-1 ring-white/[0.03] relative group">
          {/* Top-bar Glass effect */}
          <div className="bg-white/[0.01] px-6 py-4 flex items-center gap-4 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.02)]">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-white/[0.1] shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-white/[0.1] shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-white/[0.1] shadow-inner" />
            </div>
            <div className="flex-1 flex justify-center">
              <span className="text-[11px] font-mono font-medium text-[#71717a] bg-white/[0.03] px-4 py-1.5 rounded-full ring-1 ring-white/[0.02]">
                acme-corp.coregrasp.com/dashboard
              </span>
            </div>
          </div>

          <div className="p-6 lg:p-10 relative">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
              {[
                { label: "Active Policies", val: "04", sub: "Leave, Conduct, IT", subColor: "text-emerald-400", trend: "+1 WTD" },
                { label: "Employees Sync'd", val: "312", sub: "↑ 24 WTD", subColor: "text-emerald-400", trend: "92% CPL" },
                { label: "Mandate Gaps", val: "38", sub: "Reminders active", subColor: "text-rose-400", trend: "↓ 12% MTD" },
              ].map((s, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  key={i}
                  className="bg-white/[0.02] rounded-2xl p-6 lg:p-8 flex flex-col justify-between hover:bg-white/[0.03] transition-all duration-300 ring-1 ring-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest">{s.label}</div>
                    <div className="text-[9px] font-mono text-[#52525b] ring-1 ring-white/[0.03] px-2 py-0.5 rounded-full bg-black/50">{s.trend}</div>
                  </div>
                  <div className={`serif text-5xl lg:text-6xl mb-2 tracking-tight ${i === 2 ? "text-rose-400" : "text-white"}`}>{s.val}</div>
                  <div className={`text-[11px] font-mono uppercase tracking-wider ${s.subColor}`}>{s.sub}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/[0.02] rounded-2xl p-6 lg:p-8 ring-1 ring-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="text-[12px] font-bold uppercase tracking-widest text-white">Latest Attempts // Leave Policy</div>
                  <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full ring-1 ring-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> LIVE
                  </div>
                </div>
                <div className="space-y-2">
                  {candidates.map((c, i) => (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex justify-between items-center py-3 px-4 rounded-xl hover:bg-white/[0.03] transition-colors group/row"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-[10px] font-mono text-[#a1a1aa] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/[0.05]">
                          {c.avatar}
                        </div>
                        <span className="text-[13px] text-[#a1a1aa] font-medium group-hover/row:text-white transition-colors">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-28 h-1.5 bg-white/[0.03] overflow-hidden hidden sm:block rounded-full">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: c.score }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                            className={`h-full rounded-full ${c.pass ? "bg-emerald-400" : "bg-rose-400"}`}
                          />
                        </div>
                        <span className={`text-[11px] font-mono px-3 py-1 rounded-full ring-1 ${
                          c.pass
                            ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 ring-rose-500/20"
                        }`}>
                          {c.score}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/[0.02] rounded-2xl p-6 lg:p-8 ring-1 ring-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
              >
                <div className="text-[12px] font-bold uppercase tracking-widest mb-8 text-white">Aggregated Pass Rate</div>
                <div className="flex flex-col gap-6">
                  {policyBars.map((b, i) => (
                    <div key={b.label}>
                      <div className="flex justify-between text-[11px] font-mono text-[#71717a] mb-2.5 uppercase">
                        <span>{b.label}</span>
                        <span className="text-white">{b.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.03] overflow-hidden rounded-full">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${b.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          className={`h-full rounded-full ${b.color} shadow-[0_0_15px_rgba(52,211,153,0.3)]`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── BENTO GRID FEATURES (STRUCTURED & ALIGNED) ── */}
      {/* ── BENTO GRID FEATURES (ENHANCED) ── */}
      <RadialFeatures/>
    
      {/* ── SAMPLE QUESTION ── */}
      <section className="relative z-10 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-[800px] lg:max-w-[900px] mx-auto w-full px-6 mb-16 text-center"
        >
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#71717a] mb-4">
            Interactive Node
          </div>
          <h2 className="serif font-normal text-[clamp(2.6rem,5vw,4.5rem)] tracking-[-0.03em] leading-[1.0] mb-6 text-white">
            Inspect the Output
          </h2>
          <p className="text-[16px] text-[#a1a1aa] max-w-[480px] mx-auto font-light">
            Generated directly from an internal knowledge base. Select the correct logic path below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[700px] lg:max-w-[800px] mx-auto w-full px-6"
        >
          <div className="bg-black/60 backdrop-blur-2xl rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_30px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.03]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10 relative z-10">
              <span className="text-[10px] font-mono uppercase tracking-widest bg-white/[0.03] px-4 py-2 rounded-full text-[#a1a1aa] shadow-inner">
                Source: Leave_Policy_v4.pdf
              </span>
              <span className="text-[10px] font-mono text-[#52525b] px-4 py-2 rounded-full bg-black/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] ring-1 ring-white/[0.03] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Llama 3.2 3B Instruct
              </span>
            </div>

            <div className="text-[18px] lg:text-[20px] font-medium leading-[1.6] mb-10 text-white relative z-10 font-serif italic tracking-wide">
              "An employee has utilized 8 of their 12 annual leave days and requests 5 more in Q4. What is the maximum leave they can carry into the next fiscal year under Section 4?"
            </div>

            <div className="flex flex-col gap-4 relative z-10">
              {options.map((o, i) => {
                const chosen = picked === i
                const revealed = picked !== null

                const cls =
                  (chosen && o.correct) || (revealed && o.correct)
                    ? "bg-emerald-500/[0.08] text-emerald-400 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.3)]"
                    : chosen && !o.correct
                      ? "bg-rose-500/[0.08] text-rose-400 shadow-[inset_0_0_0_1px_rgba(244,63,94,0.3)]"
                      : "bg-white/[0.01] text-[#a1a1aa] hover:bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"

                return (
                  <motion.div
                    key={o.letter}
                    whileHover={picked === null ? { scale: 1.01, x: 4 } : {}}
                    whileTap={picked === null ? { scale: 0.99 } : {}}
                    onClick={() => picked === null && setPicked(i)}
                    className={`flex items-center gap-5 px-6 py-4 rounded-2xl text-[14px] transition-all duration-300 ${cls} ${picked === null ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[10px] font-mono mt-px transition-colors ${
                      ((chosen && o.correct) || (revealed && o.correct)) 
                        ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' 
                        : (chosen && !o.correct) 
                          ? 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30' 
                          : 'bg-black text-[#71717a] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/[0.05]'
                    }`}>
                      {o.letter}
                    </span>
                    <span className="leading-relaxed font-light">{o.text}</span>
                  </motion.div>
                )
              })}
            </div>

            <AnimatePresence>
              {picked !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden relative z-10"
                >
                  <div className="px-6 py-5 bg-black rounded-2xl text-[13px] text-[#a1a1aa] leading-relaxed font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/[0.03]">
                    <strong className="text-emerald-400 block mb-2 uppercase tracking-widest">Diagnostic Logic:</strong>
                    Distractors A and D mirror generic HR terminology. B fabricates a "Q4 deferred cap" absent from the source document. C isolates the exact constraint defined in Section 4. True comprehension verified.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* ── SCALE & INTEGRATIONS ── */}
      <section className="relative z-10 pb-32">
        <div className="max-w-[1000px] lg:max-w-[1200px] mx-auto w-full px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#71717a] mb-4">
              Infrastructure
            </div>
            <h2 className="serif font-normal text-[clamp(2.6rem,5vw,4.5rem)] tracking-[-0.03em] leading-[1.0] mb-6 text-white">
              Distributed Dispatch
            </h2>
            <p className="text-[16px] text-[#a1a1aa] max-w-[580px] mx-auto leading-relaxed font-light">
              Connect core HR systems or utilize bulk CSV ingests. Trigger automated, asynchronous testing pipelines across massive organizational charts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bulk Import Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/[0.01] backdrop-blur-xl rounded-3xl p-8 lg:p-12 relative overflow-hidden group transition-all duration-300 ring-1 ring-white/[0.03] hover:ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
            >
              <h3 className="text-[18px] font-bold uppercase tracking-widest text-white mb-4 relative z-10">Batch Operations</h3>
              <p className="text-[14px] text-[#71717a] leading-relaxed mb-10 max-w-[400px] relative z-10 font-light">
                Sync directories and deploy evaluation workflows to thousands of target nodes concurrently via Cloudflare Queues.
              </p>

              <div className="bg-black/50 rounded-2xl p-6 lg:p-8 relative z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] ring-1 ring-white/[0.03]">
                <div className="flex items-center gap-3 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[11px] font-mono text-white uppercase tracking-wider">Queue Dispatch</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] font-mono text-[#52525b] uppercase tracking-widest block mb-2">Target Subset (JSON)</label>
                    <div className="w-full bg-black rounded-xl px-4 py-3 text-[13px] text-white flex justify-between items-center font-mono shadow-inner ring-1 ring-white/[0.05]">
                      <span>status: "active"</span>
                      <span className="text-[10px] bg-white/[0.08] px-3 py-1 rounded-full text-[#a1a1aa]">1,248 Nodes</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-[#52525b] uppercase tracking-widest block mb-2">Payload Reference</label>
                    <div className="w-full bg-black rounded-xl px-4 py-3 text-[13px] text-emerald-400 font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_10px_rgba(52,211,153,0.05)] ring-1 ring-emerald-500/20">
                      id: "pol_392f_sec_update"
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-white text-black font-bold text-[12px] py-4 rounded-full uppercase tracking-widest mt-2 flex justify-center items-center gap-3 hover:bg-gray-200 transition-colors shadow-lg"
                  >
                    Execute Batch
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Integrations Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/[0.01] backdrop-blur-xl rounded-3xl p-8 lg:p-12 relative overflow-hidden group transition-all duration-300 flex flex-col ring-1 ring-white/[0.03] hover:ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
            >
              <h3 className="text-[18px] font-bold uppercase tracking-widest text-white mb-4 relative z-10">Event-Driven Architecture</h3>
              <p className="text-[14px] text-[#71717a] leading-relaxed mb-10 relative z-10 font-light">
                Hook into upstream identity providers. When state changes occur in the primary HRIS, the compliance graph reconciles automatically.
              </p>

              <div className="flex-1 flex flex-col gap-5 relative z-10">
                {/* HRIS Sync */}
                <div className="bg-black/50 rounded-2xl p-6 ring-1 ring-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-white">Upstream Sync</span>
                    <span className="text-[9px] font-mono text-emerald-400 ring-1 ring-emerald-500/20 px-3 py-1 rounded-full bg-emerald-500/5">HEALTHY</span>
                  </div>
                  <div className="flex items-center justify-center gap-6 py-2">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[10px] font-mono text-white bg-white/[0.02] ring-1 ring-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                      HRIS
                    </div>
                    <div className="flex-1 h-[2px] bg-white/[0.05] relative overflow-hidden max-w-[100px] rounded-full">
                      <motion.div
                        className="absolute top-0 left-0 h-full w-[30%] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]"
                        animate={{ left: ["-50%", "150%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      />
                    </div>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-black shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_20px_rgba(52,211,153,0.1)] ring-1 ring-emerald-500/20">
                      <span className="serif text-xl text-white">C<span className="text-emerald-400">G</span></span>
                    </div>
                  </div>
                </div>

                {/* Chat Nudge */}
                <div className="bg-black/50 rounded-2xl p-6 flex-1 ring-1 ring-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-white">Webhook Delivery</span>
                    <span className="text-[9px] font-mono text-emerald-400 ring-1 ring-emerald-500/20 px-3 py-1 rounded-full bg-emerald-500/5">200 OK</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-2xl bg-black flex items-center justify-center ring-1 ring-white/[0.05] shadow-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-white font-bold text-[12px] uppercase">CoreGrasp Bot</span>
                      </div>
                      <p className="text-[#a1a1aa] text-[12px] leading-relaxed mb-3 font-light">
                        <strong className="text-white">Action Required:</strong> Q4 Leave Policy evaluation is pending. Deadline approaches in 24h.
                      </p>
                      <span className="inline-block bg-white text-black px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors cursor-pointer shadow-md">
                        Init Test
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="relative z-10 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-[800px] lg:max-w-[1000px] mx-auto w-full px-6 mb-16 text-center"
        >
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#71717a] mb-4">
            Licensing
          </div>
          <h2 className="serif font-normal text-[clamp(2.6rem,5vw,4.5rem)] tracking-[-0.03em] leading-[1.0] mb-6 text-white">
            Predictable Costs.
          </h2>
          <p className="text-[16px] text-[#a1a1aa] max-w-[480px] mx-auto font-light">
            Start completely free. Scale horizontally as your infrastructure demands.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-[1000px] lg:max-w-[1200px] mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {pricingTiers.map((tier, i) => (
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              key={tier.name}
              className={`relative rounded-3xl p-8 lg:p-10 transition-all duration-300 ${
                tier.highlighted
                  ? "bg-white/[0.02] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_40px_rgba(255,255,255,0.05)] ring-1 ring-white/[0.15]"
                  : "bg-white/[0.01] backdrop-blur-xl hover:bg-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] ring-1 ring-white/[0.03]"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-8">
                  <span className="text-[9px] font-mono font-bold tracking-widest uppercase bg-white text-black px-4 py-1.5 rounded-full shadow-lg">
                    Standard Prod
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <div className="text-[14px] font-bold uppercase tracking-widest text-white mb-4">{tier.name}</div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="serif text-5xl text-white">{tier.price}</span>
                  {tier.period && <span className="text-[12px] font-mono text-[#71717a] uppercase">{tier.period}</span>}
                </div>
                <p className="text-[13px] text-[#71717a] leading-relaxed font-light">{tier.description}</p>
              </div>

              <div className="h-[1px] bg-white/[0.05] mb-8 rounded-full" />

              <ul className="flex flex-col gap-4 mb-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[13px] text-[#a1a1aa] font-light">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/signin")}
                className={`w-full py-4 rounded-full text-[12px] font-bold uppercase tracking-widest transition-colors shadow-md ${
                  tier.highlighted
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-white/[0.03] text-white hover:bg-white/[0.08] ring-1 ring-white/[0.05] hover:ring-white/[0.1]"
                }`}
              >
                {tier.name === "Enterprise" ? "Contact Ops" : "Initialize"}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-[1000px] mx-auto w-full px-6 pb-32 flex flex-col items-center text-center relative z-10"
      >
        <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-[2.5rem] p-12 lg:p-20 w-full overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.03]">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/[0.3] to-transparent" />
          
          <h2 className="serif font-normal text-[clamp(2.4rem,4vw,3.5rem)] tracking-[-0.03em] leading-[1.0] mb-6 text-white">
            Production-Ready Compliance.
          </h2>
          <p className="text-[16px] lg:text-[18px] text-[#a1a1aa] leading-[1.6] mb-12 max-w-[540px] mx-auto font-light">
            Upload your first policy payload at zero cost. No credit card required. Graph extraction ready in under 120 seconds.
          </p>
          <motion.button
            onClick={() => router.push("/signin")}
            whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.98 }}
            className="text-[14px] font-bold px-12 py-5 rounded-full bg-white text-black uppercase tracking-widest cursor-pointer hover:bg-gray-200 transition-all shadow-lg"
          >
            Upload Policy PDF
          </motion.button>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.05] px-8 py-16 bg-[#000000] relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/[0.05]">
                  <span className="serif text-sm text-white">C</span>
                </div>
                <span className="serif text-xl tracking-wide text-white">
                  Core<span className="text-emerald-400">Grasp</span>
                </span>
              </div>
              <p className="text-[12px] text-[#71717a] leading-relaxed font-mono">
                Systematic extraction and compliance verification protocol for distributed org charts.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white mb-3">Protocol</span>
              <a href="#how-it-works" className="text-[13px] text-[#71717a] hover:text-white transition-colors font-light">Architecture</a>
              <a href="#features" className="text-[13px] text-[#71717a] hover:text-white transition-colors font-light">Capabilities</a>
              <a href="#pricing" className="text-[13px] text-[#71717a] hover:text-white transition-colors font-light">Licensing</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white mb-3">Entity</span>
              <a href="#" className="text-[13px] text-[#71717a] hover:text-white transition-colors font-light">Changelog</a>
              <a href="#" className="text-[13px] text-[#71717a] hover:text-white transition-colors font-light">Engineering Blog</a>
              <a href="#" className="text-[13px] text-[#71717a] hover:text-white transition-colors font-light">Careers</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white mb-3">Legal</span>
              <a href="#" className="text-[13px] text-[#71717a] hover:text-white transition-colors font-light">Privacy</a>
              <a href="#" className="text-[13px] text-[#71717a] hover:text-white transition-colors font-light">Terms</a>
              <a href="#" className="text-[13px] text-[#71717a] hover:text-white transition-colors font-light">SOC 2 Report</a>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.05] flex items-center justify-between">
            <p className="text-[11px] font-mono text-[#52525b]">
              &copy; {new Date().getFullYear()} COREGRASP INC. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-[#71717a] uppercase">Systems Nominal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}