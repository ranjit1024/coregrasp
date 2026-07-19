"use client";

import { useState } from "react";
import { SendQuizForm } from "@/app/components/ui/sendQuiz"; // Adjust import path as needed

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
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">No questions found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-9xl mx-auto space-y-8 p-6">
            {/* Elegant Header Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                            Review Mode
                        </span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">•</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                            {questions.length} total questions
                        </span>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                        Questions & Verified Answers
                    </h2>
                </div>
                
                {/* Send Quiz Trigger Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Quiz
                </button>
            </div>

            {/* Questions Stack */}
            <div className="space-y-6">
                {/* ... Keep your existing question mapping code exactly the same ... */}
                {questions.map((que, index) => {
                    const { question, options, correctIndex, explanation } = que;
                    const formattedIndex = String(index + 1).padStart(2, '0');

                    return (
                        <div 
                            key={index} 
                            className="relative group p-6 bg-white border border-zinc-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 dark:bg-zinc-900 dark:border-zinc-800/80"
                        >
                            <span className="absolute top-4 right-6 text-4xl font-black text-zinc-100/70 select-none font-mono dark:text-zinc-800/30">
                                {formattedIndex}
                            </span>
                            <div className="flex items-start gap-4 pr-12">
                                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-150/70 text-zinc-700 text-xs font-bold shrink-0 dark:bg-zinc-800 dark:text-zinc-300">
                                    Q
                                </span>
                                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-snug mt-0.5">
                                    {question}
                                </h3>
                            </div>
                            <div className="grid gap-2.5 mt-6">
                                {options.map((option, idx) => {
                                    const isCorrect = idx === correctIndex;
                                    return (
                                        <div
                                            key={idx}
                                            className={`p-3.5 rounded-xl border text-sm font-medium flex justify-between items-center transition-all duration-250 ${
                                                isCorrect
                                                    ? "border-emerald-500/25 bg-emerald-50/30 text-emerald-950 dark:bg-emerald-950/15 dark:text-emerald-300 dark:border-emerald-500/10 shadow-[0_2px_8px_rgba(16,185,129,0.02)]"
                                                    : "border-zinc-100 bg-zinc-50/20 text-zinc-600 dark:border-zinc-800/30 dark:bg-zinc-900/10 dark:text-zinc-400"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                                                    isCorrect
                                                        ? "bg-emerald-500 text-white dark:bg-emerald-600"
                                                        : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                                                }`}>
                                                    {String.fromCharCode(65 + idx)}
                                                </span>
                                                <span className="leading-normal">{option}</span>
                                            </div>
                                            {isCorrect && (
                                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs shrink-0 ml-4 bg-emerald-100/40 dark:bg-emerald-950/35 px-2.5 py-1 rounded-full">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Correct
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            {explanation && (
                                <div className="mt-5 p-4 bg-indigo-50/20 border-l-2 border-indigo-500/50 rounded-r-xl dark:bg-indigo-950/10 dark:border-indigo-500/30 flex gap-3">
                                    <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                                            Insight & Explanation
                                        </span>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                                            {explanation}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Glassmorphic Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Close Modal Button */}
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="p-6">
                            <SendQuizForm policyUrl={policyUrl} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}