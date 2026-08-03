"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useRouter } from "next/navigation"
import RadialFeatures from "./components/ui/feture"
import { CoreGraspLogo } from "./components/ui/logo"
import HowItWorks from "./components/ui/steps"

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
        className={`flex items-center justify-between px-6 lg:px-10 py-4 sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-black/60 backdrop-blur-xl shadow-2xl shadow-black/50 ring-1 ring-white/[0.02]"
            : "bg-transparent"
          }`}
      >
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
          
            <CoreGraspLogo/>
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
        className="relative max-w-[1100px] mx-auto w-full px-6 pt-[120px] md:pt-[160px] pb-20 flex flex-col items-center text-center z-10 overflow-hidden"
      >
        {/* Ambient background glow behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[300px] bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent pointer-events-none" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] uppercase px-5 py-2.5 rounded-full bg-white/[0.02] text-emerald-400 mb-10 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_40px_rgba(52,211,153,0.08)] ring-1 ring-white/[0.06] hover:ring-emerald-500/20 transition-all duration-500 cursor-default group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          </span>
          <span className="group-hover:text-emerald-300 transition-colors">Compliance Engine 2.0</span>
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/20 ml-1">NEW</span>
        </motion.div>

        {/* Headline */}
        {/* Headline */}
<motion.h1
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
  className="relative z-10 mx-auto max-w-[1000px] text-center"
>
  {/* Line 1 */}
  <span className="block serif text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1.1] tracking-[-0.04em] text-white/90">
    Upload any policy.
  </span>

  {/* Line 2 + 3 with glow and gradient */}
  <span className="relative mt-2 block sm:mt-3">
    {/* Ambient Glow - softer, more diffuse */}
    <span className="absolute left-1/2 top-1/3 -z-10 h-[1%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/15 blur-[80px] sm:blur-[120px]" />

    {/* Gradient Text */}
    <span className="block w-[30vw] bg-gradient-to-b from-emerald-50 via-emerald-200 to-emerald-400 bg-clip-text font-serif text-[clamp(2.5rem,6vw,5.5rem)] serif leading-[1.1] tracking-[-0.04em] text-transparent">
      <span className="block sarif">
        Know who <em className="serif">actually</em>
      </span>
      <span className="block ">read it.</span>
    </span>
  </span>
</motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-[16px] md:text-[18px] text-[#a1a1aa] leading-[1.7] max-w-[660px] mb-12 mt-4 font-light"
        >
          Upload any internal policy. CoreGrasp parses it with AI, generates rigorous assessments, and deploys them instantly — so you know who actually understands the rules.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row justify-center gap-3 mb-16 w-full sm:w-auto"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 50px rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/signin")}
            className="group relative text-[13px] font-bold px-10 py-4 rounded-md bg-white text-black cursor-pointer hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto uppercase tracking-[0.15em] overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Deploy Free Quiz
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.06)" }}
            whileTap={{ scale: 0.97 }}
            className="group text-[13px] font-semibold px-10 py-4 rounded-md bg-white/[0.02] text-white cursor-pointer transition-all backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/[0.06] hover:ring-white/[0.12] w-full sm:w-auto uppercase tracking-[0.15em] flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/50 group-hover:text-white/80 transition-colors">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            See How It Works
          </motion.button> 
        </motion.div>

        {/* ─── LIVE PRODUCT PREVIEW ─── */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[800px] mb-20 group"
        >
          {/* Glow behind preview */}
          <div className="absolute -inset-4 bg-gradient-to-b from-emerald-500/[0.07] to-transparent rounded-[32px] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/[0.06] p-1 shadow-[0_0_60px_rgba(0,0,0,0.4)] overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/20 font-mono">
                  app.coregrasp.io/dashboard
                </div>
              </div>
            </div>

            {/* Preview content */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1: Upload */}
              <div className="relative bg-white/[0.02] rounded-2xl p-5 border border-white/[0.05] hover:border-white/[0.1] transition-all duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs">1</div>
                  <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">Upload Policy</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-white/[0.06] rounded-full w-full" />
                  <div className="h-2 bg-white/[0.04] rounded-full w-4/5" />
                  <div className="h-2 bg-white/[0.04] rounded-full w-3/5" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-medium">✓ Parsed</div>
                  <div className="text-[9px] text-white/20 font-mono">42 clauses</div>
                </div>
              </div>

              {/* Step 2: Generate */}
              <div className="relative bg-white/[0.02] rounded-2xl p-5 border border-white/[0.05] hover:border-white/[0.1] transition-all duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs">2</div>
                  <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">Generate Quiz</span>
                </div>
                <div className="flex items-center gap-1.5 mb-3">
                  {["A", "B", "C", "D"].map((opt) => (
                    <div key={opt} className="flex-1 h-8 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[10px] text-white/30 font-bold">{opt}</div>
                  ))}
                </div>
                <div className="h-2 bg-blue-500/10 rounded-full w-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, delay: 1.2, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-blue-500/40 to-blue-400/20 rounded-full"
                  />
                </div>
                <div className="mt-2 text-[9px] text-blue-400/60 font-mono">Generating 12 questions...</div>
              </div>

              {/* Step 3: Deploy */}
              <div className="relative bg-white/[0.02] rounded-2xl p-5 border border-white/[0.05] hover:border-white/[0.1] transition-all duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs">3</div>
                  <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">Send & Track</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex -space-x-1.5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-[7px] text-white/40">{String.fromCharCode(65 + i)}</div>
                    ))}
                  </div>
                  <span className="text-[9px] text-white/30">+243 more</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-emerald-400/60">Sent • 89% opened</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── SOCIAL PROOF ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col items-center gap-5 w-full"
        >
          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/[0.1]" />
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#71717a] whitespace-nowrap">
              Trusted by compliance teams at
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/[0.1]" />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-40 hover:opacity-70 transition-all duration-700">
            {companyLogos.map((logo, i) => (
              <motion.span
                key={logo}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="serif text-[18px] md:text-[20px] text-white font-normal tracking-wide hover:text-white/80 transition-colors cursor-default"
              >
                {logo}
              </motion.span>
            ))}
          </div>

          {/* Trust micro-bar */}
          <div className="flex items-center gap-6 mt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-white/30">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400/60"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              SOC 2 Compliant
            </div>
            <div className="w-[1px] h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5 text-[10px] text-white/30">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400/60"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              End-to-End Encrypted
            </div>
            <div className="w-[1px] h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5 text-[10px] text-white/30">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400/60"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              GDPR Ready
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ── DASHBOARD MOCKUP ── */}

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1000px] lg:max-w-[1200px] mx-auto w-full px-6 pb-32 z-10"
      >
        <div className="relative bg-black/40 backdrop-blur-2xl rounded-[32px] overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.04] group">

          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none" />

          {/* Ambient top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-emerald-500/[0.04] rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/[0.06] transition-all duration-1000" />

          {/* Browser chrome */}
          <div className="relative bg-white/[0.015] px-6 py-4 flex items-center gap-4 backdrop-blur-xl border-b border-white/[0.04]">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/20 ring-1 ring-rose-500/30" />
              <span className="w-3 h-3 rounded-full bg-amber-500/20 ring-1 ring-amber-500/30" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/30" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#52525b] bg-white/[0.03] px-4 py-1.5 rounded-full ring-1 ring-white/[0.04]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500/40"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                acme-corp.coregrasp.com/dashboard
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="text-[9px] text-emerald-400/60 font-mono uppercase tracking-wider">Live</span>
            </div>
          </div>

          <div className="p-6 lg:p-10 relative">
            {/* ─── STATS ROW ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                {
                  label: "Active Policies",
                  val: "04",
                  sub: "Leave, Conduct, IT, Security",
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
                  trend: "↓ 12% vs last month",
                  trendUp: false,
                  icon: "⚠️",
                  sparkline: [55, 52, 48, 50, 45, 42, 38]
                },
              ].map((s, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  key={i}
                  className="relative bg-white/[0.02] rounded-2xl p-6 lg:p-7 flex flex-col justify-between hover:bg-white/[0.035] transition-all duration-500 ring-1 ring-white/[0.03] hover:ring-white/[0.08] group/stat overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/[0.03] rounded-full blur-[40px] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-700" />

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg opacity-60">{s.icon}</span>
                      <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-[0.2em]">{s.label}</span>
                    </div>
                    <div className={`text-[9px] font-mono px-2.5 py-1 rounded-full ring-1 flex items-center gap-1 ${s.trendUp
                        ? "bg-emerald-500/5 text-emerald-400/70 ring-emerald-500/10"
                        : "bg-amber-500/5 text-amber-400/70 ring-amber-500/10"
                      }`}>
                      {s.trendUp ? "↑" : "↓"} {s.trend}
                    </div>
                  </div>

                  <div className="flex items-end justify-between relative z-10">
                    <div>
                      <div className={`serif text-4xl lg:text-5xl tracking-tight mb-1.5 ${i === 2 ? "text-amber-400" : "text-white"}`}>
                        {s.val}
                      </div>
                      <div className={`text-[10px] font-mono uppercase tracking-wider ${s.subColor} opacity-80`}>
                        {s.sub}
                      </div>
                    </div>

                    {/* Mini sparkline */}
                    <svg width="60" height="30" viewBox="0 0 60 30" className="opacity-40 group-hover/stat:opacity-70 transition-opacity">
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
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">

              {/* Left: Latest Attempts */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative bg-white/[0.02] rounded-2xl p-6 lg:p-8 ring-1 ring-white/[0.03] hover:ring-white/[0.06] transition-all duration-500"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-white mb-1">Latest Attempts</div>
                    <div className="text-[10px] text-[#71717a] font-mono">Leave Policy • Last 24h</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full ring-1 ring-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.08)] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      LIVE
                    </div>
                    <button className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
                    </button>
                  </div>
                </div>

                {/* Table header */}
                <div className="flex items-center px-4 pb-3 mb-2 border-b border-white/[0.03]">
                  <div className="flex-1 text-[9px] font-bold text-[#52525b] uppercase tracking-[0.2em]">Candidate</div>
                  <div className="w-24 text-[9px] font-bold text-[#52525b] uppercase tracking-[0.2em] text-right hidden sm:block">Progress</div>
                  <div className="w-20 text-[9px] font-bold text-[#52525b] uppercase tracking-[0.2em] text-right">Score</div>
                  <div className="w-16 text-[9px] font-bold text-[#52525b] uppercase tracking-[0.2em] text-right hidden md:block">Time</div>
                </div>

                <div className="space-y-1">
                  {candidates.map((c, i) => (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.06 }}
                      className="flex items-center py-3 px-4 rounded-xl hover:bg-white/[0.03] transition-all duration-300 group/row cursor-default"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ring-1 ${c.pass ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" : "bg-rose-500/10 text-rose-400 ring-rose-500/20"
                          }`}>
                          {c.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[12px] text-[#a1a1aa] font-medium group-hover/row:text-white transition-colors truncate">{c.name}</div>
                          <div className="text-[9px] text-[#52525b] font-mono">{"Engineering"}</div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-24 hidden sm:block">
                        <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: c.score }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.08, ease: "easeOut" }}
                            className={`h-full rounded-full ${c.pass ? "bg-emerald-400" : "bg-rose-400"} shadow-[0_0_8px_rgba(52,211,153,0.2)]`}
                          />
                        </div>
                      </div>

                      {/* Score badge */}
                      <div className="w-20 text-right">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg ring-1 ${c.pass
                            ? "bg-emerald-500/[0.08] text-emerald-400 ring-emerald-500/15"
                            : "bg-rose-500/[0.08] text-rose-400 ring-rose-500/15"
                          }`}>
                          {c.pass ? "✓" : "✕"} {c.score}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="w-16 text-right hidden md:block">
                        <span className="text-[10px] text-[#52525b] font-mono">{ "2m ago"}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-white/[0.03] flex justify-between items-center">
                  <span className="text-[10px] text-[#52525b]">Showing 5 of 312 employees</span>
                  <button className="text-[10px] font-bold text-emerald-400/70 hover:text-emerald-400 uppercase tracking-wider transition-colors">
                    View All →
                  </button>
                </div>
              </motion.div>

              {/* Right: Analytics Column */}
              <div className="flex flex-col gap-4">
                {/* Pass Rate Bars */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative bg-white/[0.02] rounded-2xl p-6 lg:p-8 ring-1 ring-white/[0.03] hover:ring-white/[0.06] transition-all duration-500 flex-1"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-white">Pass Rate by Policy</div>
                      <div className="text-[10px] text-[#71717a] font-mono mt-1">Last 30 days</div>
                    </div>
                    <div className="text-[10px] font-mono text-white/30 bg-white/[0.03] px-2 py-1 rounded-md">Avg: 78%</div>
                  </div>

                  <div className="flex flex-col gap-5">
                    {policyBars.map((b, i) => (
                      <div key={b.label}>
                        <div className="flex justify-between text-[10px] mb-2">
                          <span className="text-[#a1a1aa] font-medium uppercase tracking-wider">{b.label}</span>
                          <span className="text-white font-mono font-bold">{b.pct}%</span>
                        </div>
                        <div className="h-2 bg-white/[0.03] overflow-hidden rounded-full ring-1 ring-white/[0.02]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${b.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className={`h-full rounded-full ${b.color} relative`}
                          >
                            <div className={`absolute inset-0 rounded-full ${b.color} opacity-50 blur-sm`} />
                            <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3 ${b.color} rounded-full`} />
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Mini Activity Feed */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="relative bg-white/[0.02] rounded-2xl p-6 ring-1 ring-white/[0.03] hover:ring-white/[0.06] transition-all duration-500"
                >
                  <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-white mb-4">Recent Activity</div>
                  <div className="space-y-3">
                    {[
                      { icon: "📤", text: "Quiz sent to 24 candidates", time: "2m ago", color: "text-blue-400" },
                      { icon: "✓", text: "Sarah Chen passed IT Policy", time: "5m ago", color: "text-emerald-400" },
                      { icon: "📝", text: "New policy uploaded", time: "12m ago", color: "text-amber-400" },
                      { icon: "⚠️", text: "3 reminders triggered", time: "1h ago", color: "text-rose-400" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 group/item">
                        <div className={`w-6 h-6 rounded-md bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-xs ${item.color}`}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] text-[#a1a1aa] group-hover/item:text-white transition-colors truncate">{item.text}</div>
                        </div>
                        <div className="text-[9px] text-[#52525b] font-mono shrink-0">{item.time}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* ── BENTO GRID FEATURES (ENHANCED) ── */}
      <RadialFeatures />
      <HowItWorks/>
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
                    <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[10px] font-mono mt-px transition-colors ${((chosen && o.correct) || (revealed && o.correct))
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

      {/* {How it wokd} */}
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
              className={`relative rounded-3xl p-8 lg:p-10 transition-all duration-300 ${tier.highlighted
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
                className={`w-full py-4 rounded-full text-[12px] font-bold uppercase tracking-widest transition-colors shadow-md ${tier.highlighted
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