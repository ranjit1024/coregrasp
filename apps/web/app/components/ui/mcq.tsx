"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendQuizForm } from "@/app/components/ui/sendQuiz"; // Adjust import path as needed
import {
  HelpCircle,
  Send,
  Check,
  Lightbulb,
  X,
  Sparkles
} from "lucide-react";

export interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface MCQListProps {
  questions: MCQ[];
  policyUrl: string;
}

export default function MCQList({ questions, policyUrl }: MCQListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:w-full items-center justify-center py-16 sm:py-24 px-4 max-md:px-0 text-center bg-[#09090B] border border-white/[0.04] rounded-2xl mx-4 sm:mx-0"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mb-3">
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-500" strokeWidth={1.5} />
        </div>
        <p className="text-zinc-400 text-[12px] sm:text-[13px] font-medium">No questions found.</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 w-full font-sans text-zinc-100 bg-[#09090B] min-h-screen">

      {/* Elegant Header Block */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-white/[0.08] pb-5 sm:pb-6"
      >
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
              Review Mode
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-[11px] sm:text-xs text-zinc-400 font-medium">
              {questions.length} total questions
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
            Questions & Verified Answers
          </h2>
        </div>

        {/* Send Quiz Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-white text-zinc-950 rounded-lg text-[13px] sm:text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
          Send Assessment
        </motion.button>
      </motion.div>

      {/* Questions Stack */}
      <div className="space-y-4 sm:space-y-6">
        {questions.map((que, index) => {
          const { question, options, correctIndex, explanation } = que;
          const formattedIndex = String(index + 1).padStart(2, '0');

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="group relative p-4 sm:p-6 bg-[#121214] border border-white/[0.08] rounded-xl sm:rounded-2xl shadow-sm hover:border-white/[0.15] transition-all duration-300 overflow-hidden"
            >
              {/* Watermark Index Number */}
              <span className="absolute top-2 right-3 sm:top-4 sm:right-6 text-3xl sm:text-4xl font-black text-white/[0.02] select-none font-mono">
                {formattedIndex}
              </span>

              {/* Question Title */}
              <div className="flex items-start gap-3 sm:gap-4 pr-8 sm:pr-12 relative z-10">
                <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-[11px] sm:text-xs font-bold shrink-0 mt-0.5">
                  Q
                </span>
                <h3 className="font-medium text-zinc-100 text-[14px] sm:text-[15px] leading-snug mt-1 sm:mt-0.5">
                  {question}
                </h3>
              </div>

              {/* Options Grid */}
              <div className="grid gap-2 sm:gap-2.5 mt-5 sm:mt-6 relative z-10">
                {options.map((option, idx) => {
                  const isCorrect = idx === correctIndex;
                  return (
                    <div
                      key={idx}
                      className={`p-3 sm:p-3.5 rounded-xl border text-[13px] sm:text-sm font-medium flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-0 transition-all duration-200 ${
                        isCorrect
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_2px_8px_rgba(16,185,129,0.05)]"
                          : "border-white/[0.04] bg-white/[0.01] text-zinc-400"
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                        <span className={`w-5 h-5 shrink-0 flex items-center justify-center rounded-full text-[9px] sm:text-[10px] font-bold mt-0.5 sm:mt-0 ${
                          isCorrect
                            ? "bg-emerald-500 text-white"
                            : "bg-white/[0.06] text-zinc-500"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed sm:leading-normal mt-0.5 sm:mt-0">{option}</span>
                      </div>

                      {isCorrect && (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px] sm:text-xs shrink-0 self-start sm:self-auto ml-7 sm:ml-4 bg-emerald-500/20 px-2 sm:px-2.5 py-1 rounded-full border border-emerald-500/30">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          Correct
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Block */}
              {explanation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 sm:mt-5 p-3 sm:p-4 bg-indigo-500/10 border-l-2 border-indigo-500 rounded-r-xl flex gap-2.5 sm:gap-3 relative z-10"
                >
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      Insight & Explanation
                    </span>
                    <p className="text-[13px] sm:text-sm text-zinc-300 leading-relaxed font-normal">
                      {explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Glassmorphic Modal Overlay with Animation */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md bg-[#121214] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6"
            >
              {/* Close Modal Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors z-10"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="mt-2 sm:mt-0">
                <SendQuizForm policyUrl={policyUrl} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
