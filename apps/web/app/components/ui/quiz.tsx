"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface MCQ {
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
}

interface QuizProps {
    questions: MCQ[];
    policyUrl?: string;
    onComplete?: (score: number, total: number) => void;
}

// ─── Icons ───────────────────────────────────────────────────────

const CheckIcon = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const XIcon = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const ArrowPathIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
);

// ─── Main Component ──────────────────────────────────────────────

export default function Quiz({ questions, policyUrl, onComplete,  }: QuizProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showShake, setShowShake] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    const answeredCount = Object.keys(selectedAnswers).length;
    const totalQuestions = questions.length;
    const allAnswered = answeredCount === totalQuestions;
    const progress = (answeredCount / totalQuestions) * 100;

    const { score, results } = useMemo(() => {
        let correct = 0;
        const res = questions.map((q, i) => {
            const userAns = selectedAnswers[i];
            const isCorrect = userAns === q.correctIndex;
            if (isCorrect) correct++;
            return { isCorrect, userAns };
        });
        return { score: correct, results: res };
    }, [selectedAnswers, questions]);

    const scorePercentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    useEffect(() => {
        if (isSubmitted && onComplete) onComplete(score, totalQuestions);
    }, [isSubmitted, score, totalQuestions, onComplete]);

    useEffect(() => {
        if (isSubmitted && headerRef.current) {
            headerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [isSubmitted]);

    const handleSelect = useCallback((qIdx: number, optIdx: number) => {
        if (isSubmitted) return;
        setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    }, [isSubmitted]);

    const handleSubmit = useCallback(() => {
        if (!allAnswered) {
            setShowShake(true);
            setTimeout(() => setShowShake(false), 500);
            return;
        }
        setIsSubmitted(true);
    }, [allAnswered]);

    const handleRetake = useCallback(() => {
        setSelectedAnswers({});
        setIsSubmitted(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    if (!questions?.length) {
        return (
            <div className="max-w-2xl mx-auto py-16 px-6 text-center text-zinc-500">
                No questions available.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-5">
            {/* Header */}
            <div className="mb-10" ref={headerRef}>
                <h1 className="text-[28px] font-bold tracking-tight text-white mb-2">
                    {isSubmitted ? "Assessment Results" : "Policy Assessment"}
                </h1>
                <p className="text-[15px] text-zinc-400 font-normal">
                    {isSubmitted
                        ? `You scored ${score} out of ${totalQuestions} (${scorePercentage}%)`
                        : `Answer all ${totalQuestions} questions to submit your assessment.`}
                </p>

                {/* Progress */}
                {!isSubmitted && (
                    <div className="mt-6">
                        <div className="flex justify-between text-xs font-medium text-zinc-500 mb-2 tracking-wide">
                            <span>Progress</span>
                            <span>{answeredCount} / {totalQuestions}</span>
                        </div>
                        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)" }}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                            />
                        </div>
                    </div>
                )}

                {/* Score Ring (submitted) */}
                {isSubmitted && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 flex items-center gap-6"
                    >
                        <div className="relative w-[120px] h-[120px] flex-shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#232326" strokeWidth="6" />
                                <motion.circle
                                    cx="50" cy="50" r="45" fill="none"
                                    stroke={scorePercentage >= 70 ? "#22c55e" : scorePercentage >= 50 ? "#f59e0b" : "#ef4444"}
                                    strokeWidth="6" strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 45}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - scorePercentage / 100) }}
                                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[32px] font-extrabold tracking-tighter leading-none text-white">{scorePercentage}%</span>
                                <span className="text-xs font-medium text-zinc-500 mt-1">{score} / {totalQuestions}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white mb-1">
                                {scorePercentage >= 80 ? "Excellent" : scorePercentage >= 60 ? "Well done" : scorePercentage >= 40 ? "Needs review" : "Study required"}
                            </p>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                {score === totalQuestions
                                    ? "Perfect score! Strong understanding of the policy."
                                    : score >= totalQuestions * 0.7
                                    ? "Solid grasp. Check the explanations for missed questions."
                                    : "Review the policy and try again."}
                            </p>
                         
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Questions */}
            <div className="space-y-4" role="radiogroup">
                <AnimatePresence>
                    {questions.map((que, qIdx) => {
                        const result = results[qIdx];
                        const isCorrect = result?.isCorrect ?? false;
                        const userSelected = selectedAnswers[qIdx];

                        return (
                            <motion.div
                                key={qIdx}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: qIdx * 0.04, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                                className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-7 hover:border-zinc-700 transition-colors duration-200"
                            >
                                {/* Question text */}
                                <div className="flex items-start gap-3.5 mb-5">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-[13px] font-bold text-zinc-500 font-mono">
                                        {String(qIdx + 1).padStart(2, "0")}
                                    </span>
                                    <h3 className="text-base font-medium text-white leading-relaxed pt-1">
                                        {que.question}
                                    </h3>
                                    {isSubmitted && (
                                        <span className="ml-auto flex-shrink-0 mt-1" aria-label={isCorrect ? "Correct" : "Incorrect"}>
                                            {isCorrect ? (
                                                <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                                                    <CheckIcon />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-red-500/15 flex items-center justify-center text-red-400">
                                                    <XIcon />
                                                </div>
                                            )}
                                        </span>
                                    )}
                                </div>

                                {/* Options */}
                                <div className="space-y-2 ml-11" role="radiogroup" aria-label={`Question ${qIdx + 1}`}>
                                    {que.options.map((opt, oIdx) => {
                                        const isOptCorrect = oIdx === que.correctIndex;
                                        const isOptSelected = userSelected === oIdx;
                                        const showCorrect = isSubmitted && isOptCorrect;
                                        const showWrong = isSubmitted && isOptSelected && !isOptCorrect;

                                        const baseClasses = "group flex items-center gap-3.5 w-full text-left px-4 py-3.5 rounded-xl border text-sm font-normal transition-all duration-150";
                                        const stateClasses = showCorrect
                                            ? "bg-emerald-500/[0.06] border-emerald-500/20 text-emerald-300"
                                            : showWrong
                                            ? "bg-red-500/[0.05] border-red-500/15 text-red-300/70 opacity-70"
                                            : isSubmitted
                                            ? "border-transparent text-zinc-600 opacity-50"
                                            : isOptSelected
                                            ? "bg-white/[0.04] border-zinc-600 text-white"
                                            : "border-transparent text-zinc-400 hover:bg-white/[0.03] hover:border-zinc-700 hover:text-zinc-200";

                                        return (
                                            <button
                                                key={oIdx}
                                                onClick={() => handleSelect(qIdx, oIdx)}
                                                disabled={isSubmitted}
                                                role="radio"
                                                aria-checked={isOptSelected}
                                                className={`${baseClasses} ${stateClasses} ${!isSubmitted ? "cursor-pointer" : "cursor-default"}`}
                                            >
                                                {/* Radio indicator */}
                                                <span
                                                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                                        showCorrect
                                                            ? "border-emerald-500 bg-emerald-500 text-zinc-950"
                                                            : showWrong
                                                            ? "border-red-500 bg-red-500 text-zinc-950"
                                                            : isOptSelected
                                                            ? "border-white bg-white"
                                                            : "border-zinc-600 group-hover:border-zinc-500"
                                                    }`}
                                                >
                                                    {!isSubmitted && isOptSelected && (
                                                        <span className="w-2 h-2 rounded-full bg-zinc-950" />
                                                    )}
                                                    {isSubmitted && (showCorrect || showWrong) && (
                                                        <span className="text-current">
                                                            {showCorrect ? <CheckIcon /> : <XIcon />}
                                                        </span>
                                                    )}
                                                </span>

                                                <span className="flex-1 leading-snug">{opt}</span>

                                                {showCorrect && !isOptSelected && (
                                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500/70">Correct</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Explanation */}
                                <AnimatePresence>
                                    {isSubmitted && que.explanation && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="ml-11 mt-3 overflow-hidden"
                                        >
                                            <div className="px-5 py-4 rounded-xl bg-white/[0.02] border-l-[3px] border-zinc-600">
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500 mb-1.5">
                                                    Explanation
                                                </p>
                                                <p className="text-[13.5px] text-zinc-400 leading-relaxed">
                                                    {que.explanation}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Submit */}
            <AnimatePresence mode="wait">
                {!isSubmitted && (
                    <motion.div
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-10"
                    >
                        <motion.button
                            onClick={handleSubmit}
                            animate={showShake ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            className={`w-full py-4 rounded-xl text-[15px] font-semibold transition-all duration-200 ${
                                allAnswered
                                    ? "bg-white text-zinc-950 hover:opacity-90 hover:-translate-y-0.5"
                                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                            }`}
                        >
                            {allAnswered ? "Submit Assessment" : `Answer ${totalQuestions - answeredCount} more question${totalQuestions - answeredCount !== 1 ? "s" : ""}`}
                        </motion.button>
                        {!allAnswered && (
                            <p className="text-center text-[13px] text-zinc-600 mt-3">
                                Complete all questions before submitting
                            </p>
                        )}
                        {policyUrl && (
                            <a
                                href={policyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-center text-[13px] text-zinc-600 hover:text-zinc-400 mt-3 transition-colors underline underline-offset-2 decoration-zinc-700"
                            >
                                Review the policy document
                            </a>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Screen reader */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {isSubmitted && `Assessment complete. You scored ${score} out of ${totalQuestions}.`}
            </div>
        </div>
    );
}