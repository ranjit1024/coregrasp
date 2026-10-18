"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function LandingCta() {
  const router = useRouter()

  return (
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
  )
}
