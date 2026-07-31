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
                className="flex flex-col items-center justify-center py-24 px-4 text-center bg-[#09090B] border border-white/[0.04] rounded-2xl"
            >
                <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mb-3">
                    <HelpCircle className="w-6 h-6 text-zinc-500" strokeWidth={1.5} />
                </div>
                <p className="text-zinc-400 text-[13px] font-medium">No questions found.</p>
            </motion.div>
        );
    }

    return (
        <div className="max-w-8xl mx-auto space-y-8 p-6 md:p-8 font-sans text-zinc-100 bg-[#09090B] min-h-screen">
            
            {/* Elegant Header Block */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6"
            >
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            Review Mode
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-xs text-zinc-400 font-medium">
                            {questions.length} total questions
                        </span>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
                        Questions & Verified Answers
                    </h2>
                </div>

                {/* Send Quiz Trigger Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-zinc-950 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-sm"
                >
                    <Send className="w-4 h-4" />
                    Send Assessment
                </motion.button>
            </motion.div>

            {/* Questions Stack */}
            <div className="space-y-6">
                {questions.map((que, index) => {
                    const { question, options, correctIndex, explanation } = que;
                    const formattedIndex = String(index + 1).padStart(2, '0');

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className="group relative p-6 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-sm hover:border-white/[0.15] transition-all duration-300 overflow-hidden"
                        >
                            {/* Watermark Index Number */}
                            <span className="absolute top-4 right-6 text-4xl font-black text-white/[0.02] select-none font-mono">
                                {formattedIndex}
                            </span>

                            {/* Question Title */}
                            <div className="flex items-start gap-4 pr-12">
                                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-xs font-bold shrink-0">
                                    Q
                                </span>
                                <h3 className="font-medium text-zinc-100 text-[15px] leading-snug mt-0.5">
                                    {question}
                                </h3>
                            </div>

                            {/* Options Grid */}
                            <div className="grid gap-2.5 mt-6">
                                {options.map((option, idx) => {
                                    const isCorrect = idx === correctIndex;
                                    return (
                                        <div
                                            key={idx}
                                            className={`p-3.5 rounded-xl border text-sm font-medium flex justify-between items-center transition-all duration-200 ${
                                                isCorrect
                                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_2px_8px_rgba(16,185,129,0.05)]"
                                                    : "border-white/[0.04] bg-white/[0.01] text-zinc-400"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                                                    isCorrect
                                                        ? "bg-emerald-500 text-white"
                                                        : "bg-white/[0.06] text-zinc-500"
                                                }`}>
                                                    {String.fromCharCode(65 + idx)}
                                                </span>
                                                <span className="leading-normal">{option}</span>
                                            </div>
                                            {isCorrect && (
                                                <span className="flex items-center gap-1 text-emerald-400 font-semibold text-xs shrink-0 ml-4 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
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
                                    className="mt-5 p-4 bg-indigo-500/10 border-l-2 border-indigo-500 rounded-r-xl flex gap-3"
                                >
                                    <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                                            Insight & Explanation
                                        </span>
                                        <p className="text-sm text-zinc-300 leading-relaxed font-normal">
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
                            className="relative w-full max-w-md bg-[#121214] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden p-6"
                        >
                            {/* Close Modal Button */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <SendQuizForm policyUrl={policyUrl} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}