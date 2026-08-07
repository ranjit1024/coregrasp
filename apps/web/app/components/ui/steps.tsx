"client"

import { motion } from "framer-motion"
import { useState } from "react"

// ── Animation Helpers ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const
    }
  })
}

const pulseRing = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.3, 0.1, 0.3]
  },
  transition: {
    repeat: Infinity,
    duration: 3,
    ease: "easeInOut" as const
  }
}

// ── Step Visuals ──────────────────────────────────────────────────────────────

function UploadVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-56 flex items-center justify-center"
    >
      {/* Background glow */}
      <motion.div
        {...pulseRing}
        className="absolute w-36 h-36 rounded-full bg-emerald-500/10"
      />

      {/* PDF Document */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="relative z-10"
      >
        <div className="w-20 h-26 bg-white/[0.04] rounded-xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col p-4 gap-2">
          <div className="w-full h-2 bg-white/[0.08] rounded-full" />
          <div className="w-3/4 h-2 bg-white/[0.05] rounded-full" />
          <div className="w-full h-2 bg-white/[0.05] rounded-full mt-1.5" />
          <div className="w-5/6 h-2 bg-white/[0.05] rounded-full" />
          <div className="w-2/3 h-2 bg-white/[0.05] rounded-full" />
        </div>

        {/* Badge */}
        <div className="absolute -bottom-2.5 -right-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md">
          PDF
        </div>
      </motion.div>

      {/* Floating dots */}
      <motion.div
        animate={{ y: [0, -10, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ repeat: Infinity, duration: 2, delay: 0 }}
        className="absolute top-8 left-10 w-2 h-2 rounded-full bg-emerald-400/40"
      />
      <motion.div
        animate={{ y: [0, -8, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
        className="absolute bottom-10 right-12 w-1.5 h-1.5 rounded-full bg-white/20"
      />
    </motion.div>
  )
}

function AIGenerationVisual() {
  const [sparkles] = useState([0, 1, 2, 3, 4])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-56 flex items-center justify-center"
    >
      {/* Central AI orb */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="w-28 h-28 rounded-full border border-dashed border-emerald-500/20 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="w-20 h-20 rounded-full border border-dashed border-white/[0.06] flex items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
          </motion.div>
        </motion.div>

        {/* Orbiting sparkles */}
        {sparkles.map((i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, Math.cos(i * 1.25) * 45, 0],
              y: [0, Math.sin(i * 1.25) * 45, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400/60">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Question cards floating out */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="absolute right-5 top-6 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2 shadow-lg"
      >
        <div className="text-[9px] text-emerald-400/80 font-mono mb-1">Q1</div>
        <div className="w-16 h-1.5 bg-white/[0.08] rounded-full" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="absolute right-3 bottom-8 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2 shadow-lg"
      >
        <div className="text-[9px] text-emerald-400/80 font-mono mb-1">Q2</div>
        <div className="w-14 h-1.5 bg-white/[0.08] rounded-full" />
      </motion.div>
    </motion.div>
  )
}

function SendVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-56 flex items-center justify-center"
    >
      {/* Sender */}
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400/70">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
      </div>

      {/* Flying envelope animation */}
      <motion.div
        animate={{ x: [0, 70, 70], y: [0, -12, 0], opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 -translate-y-1/2 z-20"
      >
        <div className="w-8 h-5 bg-emerald-500/20 border border-emerald-500/30 rounded-sm flex items-center justify-center">
          <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[4px] border-l-transparent border-r-transparent border-b-emerald-400/60" />
        </div>
      </motion.div>

      {/* Recipients */}
      <div className="flex -space-x-2.5 ml-20">
        {["JD", "AS", "MK", "+24"].map((label, i) => (
          <motion.div
            key={label}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-black ${
              i === 3
                ? "bg-white/[0.04] text-white/40"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            }`}
          >
            {label}
          </motion.div>
        ))}
      </div>

      {/* Labels */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5">
        <span className="text-[10px] font-mono text-white/20 bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/[0.04]">CSV</span>
        <span className="text-[10px] font-mono text-white/20 bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/[0.04]">Email</span>
        <span className="text-[10px] font-mono text-emerald-400/50 bg-emerald-500/[0.05] px-2.5 py-1 rounded-full border border-emerald-500/10">Link</span>
      </div>
    </motion.div>
  )
}

function AnalyticsVisual() {
  const bars = [
    { label: "Pass", value: 78, color: "bg-emerald-400" },
    { label: "Fail", value: 15, color: "bg-rose-400" },
    { label: "Pending", value: 7, color: "bg-amber-400" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-56 flex items-center justify-center"
    >
      {/* Chart container */}
      <div className="flex items-end gap-7 h-32">
        {bars.map((bar, i) => (
          <div key={bar.label} className="flex flex-col items-center gap-2.5">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${bar.value * 1.15}px` }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`w-12 ${bar.color} rounded-t-lg relative shadow-[0_0_20px_rgba(52,211,153,0.15)]`}
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-[11px] font-bold text-white font-mono"
              >
                {bar.value}%
              </motion.div>
            </motion.div>
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{bar.label}</span>
          </div>
        ))}
      </div>

      {/* Decorative ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="absolute inset-4 rounded-full border border-dashed border-white/[0.03] pointer-events-none"
      />
    </motion.div>
  )
}

// ── Main Data ─────────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Upload Your Policy",
    desc: "Drag and drop any PDF — leave policy, code of conduct, IT rules, anything. That's it.",
    visual: <UploadVisual />
  },
  {
    number: "02",
    title: "AI Builds the Quiz",
    desc: "CoreGrasp reads every clause and creates smart multiple-choice questions that test real understanding.",
    visual: <AIGenerationVisual />
  },
  {
    number: "03",
    title: "Send to Your Team",
    desc: "Share via email, a simple link, or upload a CSV to reach everyone at once. Slack & Teams work too.",
    visual: <SendVisual />
  },
  {
    number: "04",
    title: "See the Results",
    desc: "Instantly see who passed, who needs a nudge, and where your team has knowledge gaps.",
    visual: <AnalyticsVisual />
  }
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10  overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[600px] bg-emerald-500/[0.02] rounded-full blur-[140px]" />
      </div>

      <div className="max-w-[1280px] mx-auto w-full px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] uppercase text-emerald-400/70 mb-6 bg-emerald-500/[0.05] border border-emerald-500/10 px-4.5 py-2.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            How It Works
          </div>
          <h2 className="serif font-normal text-[clamp(2.6rem,5vw,4.5rem)] tracking-[-0.03em] leading-[1.05] mb-6 text-white">
            Four steps to<br />
            <em className="text-emerald-400 not-italic">complete compliance.</em>
          </h2>
          <p className="text-[18px] text-[#a1a1aa] max-w-[540px] mx-auto font-light leading-relaxed">
            No technical setup. No manual work. Upload a PDF, and we handle the rest.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group relative bg-white/[0.01] backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-white/[0.03] hover:ring-white/[0.08] hover:bg-white/[0.02] transition-all duration-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] flex flex-col justify-between"
            >
              {/* Visual area */}
              <div className="relative border-b border-white/[0.03]">
                {step.visual}

                {/* Step number watermark */}
                <div className="absolute top-4 left-5 text-[38px] font-bold text-white/[0.03] font-mono leading-none select-none">
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <span className="text-[11px] font-bold text-emerald-400">{step.number}</span>
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
                </div>

                <h3 className="text-[18px] font-bold text-white mb-2.5 tracking-wide">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#71717a] leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Connecting arrow (desktop only, between cards) */}
        <div className="hidden lg:flex items-center justify-center gap-2 mt-10 mb-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ x: [0, 4, 0], opacity: [0.2, 0.4, 0.2] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
              className="flex-1 h-[1px] bg-gradient-to-r from-white/[0.05] via-white/[0.1] to-white/[0.05] max-w-[80px]"
            />
          ))}
        </div>

        {/* Bottom trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >

        </motion.div>
      </div>
    </section>
  )
}
