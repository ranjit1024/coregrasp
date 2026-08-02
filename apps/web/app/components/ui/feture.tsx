"use client";

import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
} as const

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const features = [
  {
    size: "hero",
    gradient: "from-blue-500/[0.08] via-transparent to-transparent",
    icon: "📄",
    title: "Policy Intelligence",
    desc: "Upload your company handbook, code of conduct, or compliance docs. Our AI parses PDF, DOCX, and TXT files to extract key policies and generate contextual assessment questions automatically.",
    tags: ["PDF", "DOCX", "Auto-parse"],
    visual: (
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="relative w-full max-w-[320px]">
          {/* Document stack effect */}
          <div className="absolute top-2 left-2 right-2 h-full bg-white/[0.03] rounded-xl border border-white/[0.06] transform rotate-1" />
          <div className="absolute top-1 left-1 right-1 h-full bg-white/[0.04] rounded-xl border border-white/[0.08] transform -rotate-1" />
          <div className="relative bg-white/[0.05] rounded-xl border border-white/[0.1] p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg">📄</div>
              <div className="flex-1">
                <div className="h-2.5 bg-white/10 rounded-full w-3/4 mb-2" />
                <div className="h-2 bg-white/5 rounded-full w-1/2" />
              </div>
            </div>
            <div className="space-y-2.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`h-1.5 rounded-full bg-gradient-to-r from-blue-500/30 to-transparent ${i === 2 ? 'w-full' : i === 4 ? 'w-2/3' : 'w-full'}`} />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-medium">✓ Parsed</div>
              <div className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[9px] text-blue-400 font-medium">42 Clauses</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    size: "default",
    gradient: "from-violet-500/[0.08] via-transparent to-transparent",
    icon: "🧠",
    title: "AI Quiz Gen",
    desc: "Generates role-specific quizzes from policy content with varying difficulty.",
    tags: ["MCQ", "Scenario", "Timed"],
    visual: (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border border-violet-500/20 rounded-full animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-2 border border-dashed border-violet-500/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">🧠</div>
        </div>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400/50" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    )
  },
  {
    size: "tall",
    gradient: "from-emerald-500/[0.08] via-transparent to-transparent",
    icon: "✉️",
    title: "Bulk Import",
    desc: "Upload candidate emails via CSV or extract contact lists directly from PDF resumes and application forms. Auto-deduplication and validation built-in.",
    tags: ["CSV", "PDF Extract", "Validate"],
    visual: (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-6">
        <div className="relative">
          <div className="w-20 h-24 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col items-center justify-center gap-2 transform -rotate-3">
            <div className="text-2xl">📊</div>
            <div className="text-[8px] text-white/30 font-mono">candidates.csv</div>
          </div>
          <div className="absolute -right-3 -top-2 w-16 h-20 bg-white/[0.05] rounded-lg border border-white/[0.1] flex flex-col items-center justify-center gap-2 transform rotate-6 shadow-lg">
            <div className="text-xl">📄</div>
            <div className="text-[7px] text-white/30 font-mono">resumes.pdf</div>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 bg-emerald-500/20 rounded-full border border-emerald-500/30 flex items-center justify-center">
            <span className="text-emerald-400 text-xs">↓</span>
          </div>
        </div>
        <div className="mt-4 flex gap-1.5">
          <div className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[9px] text-white/40">247 emails</div>
          <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400">Valid</div>
        </div>
      </div>
    )
  },
  {
    size: "wide",
    gradient: "from-amber-500/[0.08] via-transparent to-transparent",
    icon: "🚀",
    title: "Smart Distribution",
    desc: "Send personalized assessment links via email or SMS. Schedule reminders, set deadlines, and track delivery status in real-time.",
    tags: ["Email", "SMS", "Tracking"],
    visual: (
      <div className="relative h-24 w-full flex items-center px-4">
        <div className="flex items-center gap-4 w-full">
          {[
            { icon: "📝", label: "Draft", done: true },
            { icon: "📤", label: "Send", done: true },
            { icon: "✉️", label: "Delivered", active: true },
            { icon: "✓", label: "Complete", done: false }
          ].map((step, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 relative">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm border transition-all duration-500 ${
                step.done ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' :
                step.active ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_16px_rgba(251,191,36,0.15)]' :
                'bg-white/[0.03] border-white/[0.06] text-white/20'
              }`}>
                {step.icon}
              </div>
              <span className={`text-[9px] uppercase tracking-wider font-medium ${step.done || step.active ? 'text-white/50' : 'text-white/20'}`}>
                {step.label}
              </span>
              {i < 3 && (
                <div className="absolute top-5 left-[60%] w-full h-[1px] bg-gradient-to-r from-amber-500/20 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  },
 {
  size: "large",
  gradient: "from-rose-500/[0.08] via-transparent to-transparent",
  icon: "📊",
  title: "Auto-Evaluation",
  desc: "Instant scoring with AI-powered answer analysis. Detects policy comprehension gaps and flags high-risk candidates automatically.",
  tags: ["AI-Graded", "Risk-Flags"],
  visual: (
    <div className="relative h-full w-full min-h-[140px] flex items-center gap-5 px-2">
      {/* Left: Score Ring */}
     

      {/* Right: Bar Chart + Scan */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        {/* Chart header */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-wider text-white/30 font-medium">Comprehension</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] text-emerald-400/60 font-medium">Live</span>
          </div>
        </div>

        {/* Bars */}
        <div className="flex items-end gap-[3px] h-16">
          {[85, 62, 94, 78, 55, 88, 72, 100, 45, 82, 91, 67].map((h, i) => {
            const isRisk = h < 60;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar">
                <div className="relative w-full">
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-700 ${
                      isRisk 
                        ? 'bg-gradient-to-t from-rose-500/40 to-rose-400/10 group-hover/bar:from-rose-500/60' 
                        : 'bg-gradient-to-t from-rose-500/20 to-rose-400/5 group-hover/bar:from-rose-500/30'
                    }`}
                    style={{ height: `${h * 0.6}px` }}
                  />
                  {/* Risk indicator */}
                  {isRisk && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] opacity-0 group-hover/bar:opacity-100 transition-opacity">
                      ⚠️
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scan line effect */}
        <div className="relative h-[1px] bg-white/[0.04] overflow-hidden rounded-full">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-rose-400/30 to-transparent animate-[scan_2.5s_ease-in-out_infinite]" />
        </div>

        {/* Bottom metrics */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-white/20 font-mono">Avg: 76.4</span>
            <span className="text-[9px] text-rose-400/40 font-mono">● 2 flagged</span>
          </div>
          <div className="h-1 w-12 bg-white/[0.04] rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-rose-500/40 to-rose-400/20 rounded-full" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  )
},
  {
    size: "default",
    gradient: "from-cyan-500/[0.08] via-transparent to-transparent",
    icon: "🔔",
    title: "Reminders",
    desc: "Automated follow-ups for incomplete assessments.",
    tags: ["Auto-nudge"],
    visual: (
      <div className="flex items-center justify-center h-20">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl">
            🔔
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center text-[9px] font-bold text-black animate-bounce">
            3
          </div>
        </div>
      </div>
    )
  },
  {
  size: "large",
  gradient: "from-white/[0.02] via-transparent to-transparent",
  icon: "◈",
  title: "Analytics",
  desc: "Completion trends, score distributions, and audit-ready exports. Quietly observe how comprehension evolves across your organization.",
  tags: ["Export", "Compliance"],
  visual: (
    <div className="h-full w-full flex flex-col relative">
      
      {/* Central Gauge Composition */}
      <div className="flex-1 flex items-center justify-center relative">
        
        {/* Outer decorative ring */}
        <div className="absolute w-40 h-40 rounded-full border border-white/[0.04] animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-40 h-40 rounded-full border border-dashed border-white/[0.03] animate-[spin_40s_linear_infinite_reverse]" />
        
        {/* Main circular progress */}
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Track */}
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            {/* Progress arc — 94% */}
            <circle 
              cx="50" cy="50" r="44" fill="none" 
              stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="276.5" 
              strokeDashoffset="16.6"
              className="transition-all duration-1000 group-hover:stroke-white/25"
            />
            {/* Secondary arc — score */}
            <circle 
              cx="50" cy="50" r="36" fill="none" 
              stroke="rgba(255,255,255,0.08)" strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="226.2" 
              strokeDashoffset="36.2"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] mb-1">Completed</span>
            <span className="text-3xl font-extralight text-white/90 tracking-tight">94</span>
            <span className="text-sm text-zinc-500 font-light -mt-1">%</span>
          </div>
        </div>

        {/* Orbiting metric satellites */}
        <div className="absolute inset-0">
          {/* Top right satellite */}
          <div className="absolute top-2 right-4 text-right group/sat">
            <div className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] mb-1">Mean</div>
            <div className="text-xl font-extralight text-white/80">8.4</div>
            <div className="text-[9px] text-zinc-600 font-mono mt-0.5">of 10</div>
            {/* Connector line */}
            <div className="absolute -left-8 top-1/2 w-6 h-[1px] bg-gradient-to-l from-white/10 to-transparent" />
          </div>
          
          {/* Bottom left satellite */}
          <div className="absolute bottom-4 left-4 group/sat">
            <div className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] mb-1">Time</div>
            <div className="text-xl font-extralight text-white/80">42<span className="text-sm text-zinc-500 ml-0.5">s</span></div>
            <div className="text-[9px] text-zinc-600 font-mono mt-0.5">per question</div>
            {/* Connector line */}
            <div className="absolute -right-8 top-1/2 w-6 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
          </div>
        </div>
      </div>

      {/* Bottom micro-bar */}
      <div className="flex items-center justify-between px-2 pt-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-3">
          <span className="w-1 h-1 rounded-full bg-white/40 animate-pulse" />
          <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider">Last updated 2m ago</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[9px] text-zinc-600 font-mono">312 active</span>
          <span className="text-[9px] text-zinc-700">|</span>
          <span className="text-[9px] text-zinc-600 font-mono">19 pending</span>
        </div>
      </div>
    </div>
  )
}

];

export default function HRBentoFeatures() {
  return (
    <section id="features" className="relative z-10 pb-32 overflow-hidden ">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 
        min-w-8xl   bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="min-w-8xl  mx-auto w-full px-6 mb-20 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
          bg-white/[0.03] border border-white/[0.06] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#a1a1aa]">
            Platform
          </span>
        </div>
        <h2 className="serif font-normal text-[clamp(2.4rem,5vw,4.5rem)] tracking-[-0.03em] leading-[1.0] mb-6 text-white">
          Assess Smarter
        </h2>
        <p className="text-[#71717a] text-lg max-w-[500px] mx-auto leading-relaxed">
          Upload policies, generate quizzes, and evaluate candidates — all in one intelligent platform.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-[1200px] mx-auto w-full px-6 
          grid grid-cols-1 md:grid-cols-4 gap-5 
          auto-rows-[300px] grid-flow-dense h-full"
      >
        {features.map((f, i) => {
          const gridClass = 
            f.size === "hero" ? "md:col-span-3 md:row-span-2" :
            f.size === "full" ? "md:col-span-4" :
            f.size === "large" ? "md:col-span-2 md:row-span-2" :
            f.size === "wide" ? "md:col-span-2" :
            f.size === "tall" ? "md:row-span-2" : 
            "md:col-span-1";

          return (
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              key={f.title}
              className={`relative bg-white/[0.01] backdrop-blur-2xl rounded-[28px] 
                p-7 lg:p-9 transition-all duration-700 overflow-hidden group 
                shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] 
                ring-1 ring-white/[0.04] hover:ring-white/[0.12] hover:bg-white/[0.025] 
                flex flex-col justify-between ${gridClass}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} 
                opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none`} />
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl 
                from-white/[0.03] to-transparent rounded-bl-full opacity-0 
                group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10 flex-1 w-full opacity-70 group-hover:opacity-100 
                transition-all duration-700 group-hover:scale-[1.02] origin-top-left">
                {f.visual}
              </div>

              <div className="relative z-10 mt-auto pt-6">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg 
                    bg-white/[0.04] border border-white/[0.06] text-white/70 text-xs">
                    {f.icon}
                  </span>
                  <h3 className="text-[14px] font-bold text-white uppercase tracking-wider">
                    {f.title}
                  </h3>
                </div>
                <p className="text-[13px] text-[#a1a1aa] leading-[1.7] font-light">
                  {f.desc}
                </p>
                
                {f.tags && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {f.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-full text-[10px] 
                        font-medium bg-white/[0.04] text-[#71717a] border border-white/[0.05] 
                        group-hover:border-white/[0.1] group-hover:text-[#a1a1aa] 
                        transition-colors duration-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}