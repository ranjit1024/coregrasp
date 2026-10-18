"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const options = [
  { letter: "A", text: "5 days — carryover is limited to unused days at year-end", correct: false },
  { letter: "B", text: "4 days — Q4 requests are subject to a deferred carryover cap", correct: false },
  { letter: "C", text: "3 days — the policy caps carryover at 25% of annual entitlement", correct: true },
  { letter: "D", text: "None — leave cannot be carried over with any pending requests", correct: false },
]

export default function SampleQuestion() {
  const [picked, setPicked] = useState<number | null>(null)

  return (
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
  )
}
