"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { CoreGraspLogo } from "./components/ui/logo"

// ── Data ────────────────────────────────────────────────────────────────────

const candidates = [
  { name: "Priya Sharma", score: "88%", pass: true },
  { name: "Arjun Mehta", score: "52%", pass: false },
  { name: "Sanjana Rao", score: "79%", pass: true },
  { name: "Dev Patil", score: "61%", pass: false },
]

const policyBars = [
  { label: "Leave Policy", pct: 74, color: "bg-emerald-500" },
  { label: "Code of Conduct", pct: 88, color: "bg-emerald-500" },
  { label: "IT Security", pct: 61, color: "bg-amber-400" },
  { label: "POSH", pct: 45, color: "bg-rose-500" },
]

const steps = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px] text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 3v13m0 0l-4-4m4 4l4-4" />
      </svg>
    ),
    step: "Step 1",
    title: "Upload your policy PDF",
    desc: "Drop in any internal policy document  leave rules, code of conduct, IT security, anything.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px] text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
      </svg>
    ),
    step: "Step 2",
    title: "AI generates the quiz",
    desc: "CoreGrasp reads the document and creates multiple-choice questions that test real understanding not just memory.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px] text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
    step: "Step 3",
    title: "Send to your team, see results",
    desc: "Share a link. Your dashboard shows who passed, who failed, and who hasn't taken it yet.",
  },
]

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    title: "No test writing required",
    desc: "CoreGrasp generates all questions from your document. HR teams stop spending days writing tests by hand.",
    accent: true,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V7a2 2 0 012-2h4V3h6v2h4a2 2 0 012 2v14M9 21v-6h6v6" />
      </svg>
    ),
    title: "Works for every team size",
    desc: "Each company gets its own isolated workspace. Send quiz links to 5 people or 5,000 — results stay separate per org.",
    accent: false,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "See gaps, not just checkboxes",
    desc: "Your dashboard shows exactly which policy sections your team is getting wrong so you know where to run training.",
    accent: false,
  },
]

// ── Animations ──────────────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const [picked, setPicked] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const options = [
    { letter: "A", text: "5 days — carryover is limited to unused days at year-end", correct: false },
    { letter: "B", text: "4 days — Q4 requests are subject to a deferred carryover cap", correct: false },
    { letter: "C", text: "3 days — the policy caps carryover at 25% of annual entitlement", correct: true },
    { letter: "D", text: "None — leave cannot be carried over with any pending requests", correct: false },
  ]

  return (
    <div
      className="flex flex-col min-h-screen overflow-x-hidden bg-[#09090b] text-[#fafafa] antialiased selection:bg-emerald-500/30"
      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.6 }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * .serif { font-family: 'Instrument Serif', serif; }
      `}</style>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50"
      >

      <div className="flex justify-between items-center gap-2">

          <CoreGraspLogo className="w-7 h-7 text-emerald-400 relative z-10 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />

          <span className="serif text-2xl lg:text-3xl tracking-wide text-white">
            Core<span className="text-emerald-400">Grasp</span>
          </span>
        </div>

        {/* Text Mark */}
        {/* Desktop links */}
        <div className="hidden md:flex gap-8 lg:gap-14 text-[14px] lg:text-[15px] text-[#a1a1aa] font-medium">
          {["How it works", "Features", "Pricing"].map(l => (
            <a key={l} href="#" className="no-underline hover:text-white transition-colors duration-200">{l}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:block text-[14px] font-medium px-6 py-2.5 rounded-lg border border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer"
          >
            Request access
          </motion.button>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1 cursor-pointer border-none bg-transparent"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-200 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-200 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden flex flex-col gap-5 px-6 py-6 bg-[#09090b] border-b border-white/10 overflow-hidden"
          >
            {["How it works", "Features", "Pricing"].map(l => (
              <a key={l} href="#" className="text-[15px] font-medium text-[#a1a1aa] no-underline hover:text-white">{l}</a>
            ))}
            <button className="text-[15px] font-medium px-4 py-2.5 mt-2 rounded-lg border border-white/20 bg-transparent text-white text-center cursor-pointer">
              Request access
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-[720px] lg:max-w-[900px] mx-auto w-full px-6 pt-[100px] pb-16 flex flex-col items-center text-center"
      >
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[.08em] uppercase px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          HR policy compliance tool
        </motion.div>

        <motion.h1 variants={fadeInUp} className="serif font-normal leading-[1.05] tracking-tight text-[clamp(2.5rem,6vw,4.5rem)] mb-6 text-white">
          Turn a policy PDF into<br />
          <em className="text-emerald-400 not-italic">a quiz your team must pass.</em>
        </motion.h1>

        <motion.p variants={fadeInUp} className="text-[16px] lg:text-[18px] text-[#a1a1aa] leading-[1.75] max-w-[560px] mb-8">
          Upload any internal policy document. CoreGrasp uses AI to read it, generate questions, and send a quiz to your team so you know who actually understands the rules.
        </motion.p>

        <motion.p variants={fadeInUp} className="text-[14px] text-[#71717a] mb-10 font-medium">
          Trusted by distributed teams & modern enterprises
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/signin")}
            className="text-[15px] font-semibold px-9 py-4 rounded-lg bg-white text-black border-none cursor-pointer hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Try it free  - upload a PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="text-[15px] font-medium px-9 py-4 rounded-lg border border-white/20 bg-transparent text-white cursor-pointer hover:bg-white/5 transition-colors"
          >
            Watch a 2-min demo
          </motion.button>
        </motion.div>
      </motion.section>

      {/* ── DASHBOARD MOCKUP ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        className="max-w-[760px] lg:max-w-5xl mx-auto w-full px-6 pb-24"
      >
        <div className="bg-[#18181b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 hover:border-white/20 transition-colors duration-500">
          <div className="bg-[#121214] border-b border-white/5 px-6 py-4 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-white/20" />
            <span className="w-3 h-3 rounded-full bg-white/20" />
            <span className="w-3 h-3 rounded-full bg-white/20" />
            <span className="text-[13px] font-medium text-[#71717a] ml-3">coregrasp-dashboard / Acme Corp</span>
          </div>

          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
              {[
                { label: "Policies uploaded", val: "4", sub: "Leave, Conduct, IT", subColor: "text-emerald-400" },
                { label: "Employees tested", val: "312", sub: "↑ 24 this week", subColor: "text-emerald-400" },
                { label: "Need re-training", val: "38", sub: "Reminders active", subColor: "text-rose-400" },
              ].map((s, i) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  className="bg-white/5 border border-white/5 rounded-xl p-5 lg:p-6 flex flex-col justify-center"
                >
                  <div className="text-[12px] font-bold text-[#71717a] uppercase tracking-wider mb-2 truncate">{s.label}</div>
                  <div className={`serif text-4xl lg:text-5xl mb-2 ${i === 2 ? "text-rose-400" : "text-white"}`}>{s.val}</div>
                  <div className={`text-[13px] font-medium ${s.subColor}`}>{s.sub}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/5 rounded-xl p-6"
              >
                <div className="text-[14px] font-semibold mb-5 text-white">Recent attempts — Leave Policy</div>
                {candidates.map((c, i) => (
                  <div
                    key={c.name}
                    className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 text-[14px]"
                  >
                    <span className="text-[#a1a1aa] font-medium">{c.name}</span>
                    <span className={`text-[12px] font-bold px-3 py-1 rounded-md ${c.pass
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                      {c.score} · {c.pass ? "Pass" : "Fail"}
                    </span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/5 rounded-xl p-6"
              >
                <div className="text-[14px] font-semibold mb-5 text-white">Pass rate by policy</div>
                <div className="flex flex-col gap-5">
                  {policyBars.map((b, i) => (
                    <div key={b.label}>
                      <div className="flex justify-between text-[13px] font-medium text-[#a1a1aa] mb-2.5">
                        <span>{b.label}</span>
                        <span className="text-white">{b.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${b.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                          className={`h-full rounded-full ${b.color}`}
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

      {/* ── HOW IT WORKS ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[720px] lg:max-w-[900px] mx-auto w-full px-6 pb-14 flex flex-col items-center text-center"
      >
        <div className="text-[13px] font-bold tracking-[0.1em] uppercase text-[#71717a] mb-5">
          Workflow
        </div>
        <h2 className="serif font-normal text-[clamp(2.2rem,4vw,3.2rem)] tracking-tight leading-[1.1] mb-5">
          Upload a PDF. Get a quiz.<br />See who passed.
        </h2>
        <p className="text-[16px] text-[#a1a1aa] max-w-[500px]">
          No manual question-writing. No spreadsheets. CoreGrasp handles everything from document parsing to results in minutes.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-[800px] lg:max-w-5xl mx-auto w-full px-6 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8"
      >
        {steps.map(s => (
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            key={s.step}
            className="bg-[#18181b] border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
              {s.icon}
            </div>
            <div className="text-[12px] font-bold text-[#71717a] tracking-widest uppercase mb-3">{s.step}</div>
            <div className="text-[17px] font-semibold text-white mb-3">{s.title}</div>
            <div className="text-[15px] text-[#a1a1aa] leading-relaxed">{s.desc}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── SAMPLE QUESTION ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[720px] lg:max-w-[900px] mx-auto w-full px-6 pb-12 flex flex-col items-center text-center"
      >
        <h2 className="serif font-normal text-[clamp(2.2rem,4vw,3.2rem)] tracking-tight leading-[1.1] mb-4">
          See a sample question
        </h2>
        <p className="text-[16px] text-[#a1a1aa]">
          Generated from a real leave policy. Test your knowledge.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-[600px] lg:max-w-[720px] mx-auto w-full px-6 pb-28"
      >
        <div className="bg-[#18181b] border border-white/10 rounded-2xl p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-4 mb-7">
            <span className="text-[13px] font-semibold bg-white/5 px-3 py-1.5 rounded-md text-[#a1a1aa] border border-white/10">
              Leave Policy · Section 4
            </span>
            <span className="text-[13px] font-medium text-[#71717a] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              AI Generated
            </span>
          </div>

          <div className="text-[17px] lg:text-[18px] font-medium leading-relaxed mb-7 text-white">
            An employee has used 8 of their 12 annual leave days and requests 5 more in Q4.
            What is the maximum leave they can carry into the next year under the carryover policy?
          </div>

          <div className="flex flex-col gap-4">
            {options.map((o, i) => {
              const chosen = picked === i
              const revealed = picked !== null

              const cls =
                (chosen && o.correct) || (revealed && o.correct)
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  : chosen && !o.correct
                    ? "border-rose-500/50 bg-rose-500/10 text-rose-400"
                    : "border-white/10 text-[#a1a1aa] hover:border-white/30 hover:bg-white/5"

              return (
                <motion.div
                  key={o.letter}
                  whileHover={picked === null ? { scale: 1.01, x: 4 } : {}}
                  whileTap={picked === null ? { scale: 0.99 } : {}}
                  onClick={() => picked === null && setPicked(i)}
                  className={`flex items-start gap-4 px-6 py-4 rounded-xl border text-[15px] transition-colors duration-200 ${cls} ${picked === null ? "cursor-pointer" : "cursor-default"}`}
                >
                  <span className={`w-[26px] h-[26px] shrink-0 rounded-md border flex items-center justify-center text-[12px] font-bold mt-0.5 transition-colors ${((chosen && o.correct) || (revealed && o.correct)) ? 'border-emerald-500/50' : (chosen && !o.correct) ? 'border-rose-500/50' : 'border-white/20'}`}>
                    {o.letter}
                  </span>
                  <span className="leading-relaxed pt-0.5">{o.text}</span>
                </motion.div>
              )
            })}
          </div>

          <AnimatePresence>
            {picked !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[14px] lg:text-[15px] text-amber-200/90 leading-relaxed">
                  <strong className="font-semibold text-amber-400 block mb-2">Why these wrong answers work:</strong>
                  A and D sound like real policy clauses. B invents a plausible-sounding "Q4 deferred cap" that doesn't exist. Only someone who actually read Section 4 would pick C — which is exactly the point.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── FEATURES ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-[800px] lg:max-w-5xl mx-auto w-full px-6 pb-28 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8"
      >
        {features.map(f => (
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            key={f.title}
            className={`bg-[#18181b] rounded-2xl p-7 lg:p-8 transition-colors hover:border-white/30 ${f.accent ? "border border-emerald-500/40 shadow-[0_0_30px_rgba(52,211,153,0.05)]" : "border border-white/10"
              }`}
          >
            <div className="mb-6">{f.icon}</div>
            <div className="text-[17px] font-semibold mb-3 text-white">{f.title}</div>
            <div className="text-[15px] text-[#a1a1aa] leading-relaxed">{f.desc}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── BULK IMPORT & SCALE SECTION ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[760px] lg:max-w-5xl mx-auto w-full px-6 pb-28"
      >
        <div className="bg-[#121214] border border-white/10 rounded-2xl p-8 lg:p-12 relative overflow-hidden">

          {/* subtle background glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[.08em] uppercase px-3 py-1.5 rounded-full bg-white/5 text-[#a1a1aa] border border-white/10 mb-6">
                Deploy at Scale
              </div>
              <h2 className="serif font-normal text-[clamp(2.2rem,4vw,3.2rem)] tracking-tight leading-[1.1] mb-5 text-white">
                Sync your team.<br />Email everyone.
              </h2>
              <p className="text-[16px] text-[#a1a1aa] leading-[1.7] mb-8">
                No manual data entry. Import your entire employee directory in seconds using a CSV file, connect directly to your HRIS database, or sync programmatically via our secure REST API.
              </p>

              <ul className="flex flex-col gap-4 text-[15px] text-[#a1a1aa]">
                {[
                  { label: "CSV Upload", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /> },
                  { label: "Database Connection", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /> },
                  { label: "REST API Sync", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /> }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {item.icon}
                      </svg>
                    </div>
                    <span className="font-medium text-white">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Email Dispatch Mockup UI */}
            <div className="bg-[#18181b] border border-white/10 rounded-xl p-6 shadow-2xl shadow-black/50">
              <div className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Bulk Quiz Dispatch
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-semibold text-[#71717a] uppercase tracking-wider block mb-1.5">To (Directory)</label>
                  <div className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-3 text-[14px] text-white flex justify-between items-center">
                    <span>All Active Employees</span>
                    <span className="text-[12px] bg-white/10 px-2 py-0.5 rounded text-[#a1a1aa]">1,248 imported</span>
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-[#71717a] uppercase tracking-wider block mb-1.5">Quiz Assignment</label>
                  <div className="w-full bg-[#121214] border border-emerald-500/30 rounded-lg px-4 py-3 text-[14px] text-emerald-400 font-medium">
                    Q3 IT Security Policy Update
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-black font-semibold text-[14px] py-3.5 rounded-lg mt-2 flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Email Quiz to 1,248 Employees
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── AUTOPILOT & INTEGRATIONS SECTION ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[760px] lg:max-w-5xl mx-auto w-full px-6 pb-28"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[.08em] uppercase px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            Put compliance on autopilot
          </div>
          <h2 className="serif font-normal text-[clamp(2rem,4vw,2.8rem)] tracking-tight leading-[1.1] mb-4 text-white">
            Never chase an employee again.
          </h2>
          <p className="text-[16px] text-[#a1a1aa] max-w-[540px]">
            CoreGrasp syncs with your HR software to automatically assign quizzes to new hires, and pings them in chat when they forget to take them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* HRIS Sync Box */}
          <div className="bg-[#18181b] border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-white/20 transition-colors group">
            <div>
              <h3 className="text-[18px] font-semibold text-white mb-2">Native HRIS Sync</h3>
              <p className="text-[14px] text-[#a1a1aa] leading-relaxed mb-8">
                Connect your directory once. When an employee's role or status changes in your HR system, their compliance requirements update instantly.
              </p>
            </div>

            {/* Faux Integration Graphic */}
            <div className="relative h-[120px] bg-[#121214] border border-white/5 rounded-xl flex items-center justify-center gap-4 lg:gap-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-bold text-[#a1a1aa] shadow-lg relative z-10"
              >
                HRIS
              </motion.div>

              {/* Animated Connecting Line */}
              <div className="h-[2px] w-12 lg:w-20 bg-white/10 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full w-[40%] bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                  animate={{ left: ["-50%", "150%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg relative z-10"
              >
                <span className="serif text-2xl text-white">C<span className="text-emerald-400">G</span></span>
              </motion.div>
            </div>
          </div>

          {/* Chat Nudge Box */}
          <div className="bg-[#18181b] border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-white/20 transition-colors">
            <div className="mb-8">
              <h3 className="text-[18px] font-semibold text-white mb-2">Automated Chat Nudges</h3>
              <p className="text-[14px] text-[#a1a1aa] leading-relaxed">
                Stop sending emails that get ignored. CoreGrasp automatically follows up with pending employees via direct messages in Slack or MS Teams.
              </p>
            </div>

            {/* Faux Slack Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="bg-[#121214] border border-white/10 p-5 rounded-xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-white font-bold text-[14px]">CoreGrasp</span>
                    <span className="text-[10px] font-bold tracking-widest bg-white/10 px-1.5 py-0.5 rounded text-[#a1a1aa]">APP</span>
                    <span className="text-[#71717a] text-[12px] font-medium">10:42 AM</span>
                  </div>
                  <p className="text-[#a1a1aa] text-[14px] leading-relaxed mb-3">
                    Hey Arjun! 👋 Just a quick reminder that your <strong className="text-white font-semibold">Q4 Leave Policy</strong> quiz is due tomorrow.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
                  >
                    Take Quiz (2 mins)
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* ── CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-[600px] mx-auto w-full px-6 pb-28 flex flex-col items-center text-center"
      >
        <h2 className="serif font-normal text-[clamp(2.2rem,4vw,3.2rem)] tracking-tight leading-[1.1] mb-6 text-white">
          Ready to actually verify compliance?
        </h2>
        <p className="text-[16px] lg:text-[17px] text-[#a1a1aa] leading-[1.7] mb-10">
          Upload your first policy PDF free. No credit card, no setup. Quizzes are ready in under 2 minutes.
        </p>
        <motion.button
          onClick={() => router.push("signin")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-[16px] font-semibold px-9 py-4.5 rounded-lg bg-white text-black border-none cursor-pointer hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          Upload a policy PDF — it's free
        </motion.button>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#09090b]">
        <span className="serif text-[20px] tracking-wide text-white">CoreGrasp</span>
        <span className="text-[13px] font-medium text-[#71717a]">Next.js · PostgreSQL · Gimini  · Resend · Docker</span>
      </footer>
    </div>
  )
}