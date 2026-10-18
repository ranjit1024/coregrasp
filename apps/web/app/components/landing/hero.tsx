"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRouter } from "next/navigation"

export default function LandingHero() {
  const router = useRouter()
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -60])

  return (
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
  )
}
