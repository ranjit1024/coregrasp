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
    onComplete?: (score: number, total: number, email?: string) => void;
}

// ─── Icons ───────────────────────────────────────────────────────

const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
        <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const XIcon = () => (
    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
        <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const MailIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const InfoIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

// ─── Main Component ──────────────────────────────────────────────

export default function Quiz({ questions, policyUrl, onComplete }: QuizProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showShake, setShowShake] = useState(false);

    // States for the email popup
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [email, setEmail] = useState("");
    const [isSaving, setIsSaving] = useState(false)

    const headerRef = useRef<HTMLDivElement>(null);

    const answeredCount = Object.keys(selectedAnswers).length;
    const totalQuestions = questions.length;
    const allAnswered = answeredCount === totalQuestions;
    const progress = (answeredCount / totalQuestions) * 100;
    const [alreadyAttempted, setAlreadyAttempted] = useState(false);

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
        if (isSubmitted && onComplete) onComplete(score, totalQuestions, email);
    }, [isSubmitted, score, totalQuestions, onComplete, email]);



    useEffect(() => {
        if (isSubmitted && headerRef.current) {
            headerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [isSubmitted]);

    const handleSelect = useCallback((qIdx: number, optIdx: number) => {
        if (isSubmitted) return;
        setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    }, [isSubmitted]);

    const handleInitialSubmit = useCallback(() => {
        if (!allAnswered) {
            setShowShake(true);
            setTimeout(() => setShowShake(false), 500);
            return;
        }
        setShowEmailModal(true);
    }, [allAnswered]);


    const handleFinalSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || isSaving) return;
        setIsSaving(true);
        try {
            const res = await fetch("https://api.ranjitdas2048.workers.dev/update-score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, score }),
            });

            if (res.status === 409) {
                setShowEmailModal(false);
                setAlreadyAttempted(true);
                return; // don't mark isSubmitted, don't show results
            }

            if (!res.ok) throw new Error(`Save failed: ${res.status}`);

            setShowEmailModal(false);
            setIsSubmitted(true);
        } catch (err) {
            console.error(err);
            // TODO: surface a real error state to the user here too —
            // right now a network failure silently closes the modal
            // and does nothing, which looks broken.
        } finally {
            setIsSaving(false);
        }
    }, [email, score, isSaving]);

    if (!questions?.length) {
        return (
            <div className="max-w-2xl mx-auto py-16 px-6 text-center text-zinc-500">
                No questions available.
            </div>
        );
    }

    return (
        <div className="relative max-w-3xl mx-auto py-16 px-5 font-sans">
            {/* Header */}
            <div className="mb-14" ref={headerRef}>
                <h1 className="text-[32px] font-bold tracking-tight text-white mb-3">
                    {isSubmitted ? "Assessment Results" : "Policy Assessment"}
                </h1>
                <p className="text-[16px] text-zinc-400 font-normal">
                    {isSubmitted
                        ? `You scored ${score} out of ${totalQuestions} (${scorePercentage}%)`
                        : `Complete all ${totalQuestions} questions to test your knowledge.`}
                </p>

                {/* Progress Bar */}
                {!isSubmitted && (
                    <div className="mt-8">
                        <div className="flex justify-between text-[13px] font-medium text-zinc-400 mb-3 tracking-wide">
                            <span className="uppercase tracking-wider text-[11px] font-semibold">Progress</span>
                            <span>{answeredCount} / {totalQuestions} answered</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800/80 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: "linear-gradient(90deg, #10b981, #34d399)" }}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                            />
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {alreadyAttempted && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.3, type: "spring", bounce: 0.25 }}
                                className="bg-zinc-900 border border-zinc-800/80 rounded-[32px] p-8 w-full max-w-md shadow-2xl text-center"
                            >
                                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Already Submitted</h2>
                                <p className="text-[15px] text-zinc-400 mb-8 leading-relaxed">
                                    This email has already completed the assessment. Each candidate can only submit once.
                                </p>
                                <button
                                    onClick={() => setAlreadyAttempted(false)}
                                    className="w-full py-4 rounded-2xl text-[15px] font-bold text-zinc-950 bg-white hover:bg-zinc-200 transition-all"
                                >
                                    Close
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Score Ring (submitted) */}
                {isSubmitted && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 flex items-center gap-8 bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-3xl"
                    >
                        <div className="relative w-[110px] h-[110px] flex-shrink-0 drop-shadow-xl">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#27272a" strokeWidth="7" />
                                <motion.circle
                                    cx="50" cy="50" r="45" fill="none"
                                    stroke={scorePercentage >= 70 ? "#10b981" : scorePercentage >= 50 ? "#f59e0b" : "#ef4444"}
                                    strokeWidth="7" strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 45}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - scorePercentage / 100) }}
                                    transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-extrabold tracking-tighter leading-none text-white">{scorePercentage}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white mb-1">
                                {scorePercentage >= 80 ? "Outstanding Work!" : scorePercentage >= 60 ? "Good Job!" : scorePercentage >= 40 ? "Needs Review" : "Study Required"}
                            </p>
                            <p className="text-[15px] text-zinc-400 leading-relaxed max-w-sm">
                                {score === totalQuestions
                                    ? "You have a perfect understanding of the policies."
                                    : score >= totalQuestions * 0.7
                                        ? "You have a solid grasp. Check below for the ones you missed."
                                        : "Please review the policy documentation and try again."}
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Questions List */}
            <div className="space-y-6" role="radiogroup">
                <AnimatePresence>
                    {questions.map((que, qIdx) => {
                        const result = results[qIdx];
                        const isCorrect = result?.isCorrect ?? false;
                        const userSelected = selectedAnswers[qIdx];
                        const isAnswered = userSelected !== undefined;

                        return (
                            <motion.div
                                key={qIdx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: qIdx * 0.05, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                                className={`relative bg-zinc-900/30 backdrop-blur-md border rounded-3xl p-6 sm:p-8 transition-colors duration-300 ${isAnswered && !isSubmitted ? "border-zinc-700/60" : "border-zinc-800/80"
                                    } ${isSubmitted && !isCorrect ? "border-red-900/30 bg-red-950/5" : ""}
                                  ${isSubmitted && isCorrect ? "border-emerald-900/30 bg-emerald-950/5" : ""}`}
                            >
                                {/* Question Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shadow-inner border ${isSubmitted
                                        ? isCorrect
                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                            : "bg-red-500/10 border-red-500/20 text-red-400"
                                        : "bg-gradient-to-b from-zinc-800 to-zinc-900 border-zinc-700/50 text-zinc-300"
                                        }`}>
                                        {isSubmitted ? (isCorrect ? <CheckIcon /> : <XIcon />) : String(qIdx + 1).padStart(2, "0")}
                                    </div>
                                    <h3 className="text-[17px] font-medium text-zinc-100 leading-relaxed pt-1.5">
                                        {que.question}
                                    </h3>
                                </div>

                                {/* Options */}
                                <div className="space-y-3 sm:ml-14" role="radiogroup" aria-label={`Question ${qIdx + 1}`}>
                                    {que.options.map((opt, oIdx) => {
                                        const isOptCorrect = oIdx === que.correctIndex;
                                        const isOptSelected = userSelected === oIdx;
                                        const showCorrect = isSubmitted && isOptCorrect;
                                        const showWrong = isSubmitted && isOptSelected && !isOptCorrect;

                                        // Styling logic for options
                                        let stateClasses = "border-zinc-800/80 text-zinc-400 bg-zinc-950/30 hover:bg-zinc-800/50 hover:border-zinc-700";

                                        if (showCorrect) {
                                            stateClasses = "bg-emerald-500/10 border-emerald-500/30 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.05)]";
                                        } else if (showWrong) {
                                            stateClasses = "bg-red-500/10 border-red-500/30 text-red-200/80";
                                        } else if (isSubmitted) {
                                            stateClasses = "border-transparent text-zinc-600 opacity-50 bg-transparent";
                                        } else if (isOptSelected) {
                                            stateClasses = "bg-white/10 border-white/30 text-white shadow-sm";
                                        }

                                        return (
                                            <motion.button
                                                key={oIdx}
                                                whileTap={!isSubmitted ? { scale: 0.985 } : {}}
                                                onClick={() => handleSelect(qIdx, oIdx)}
                                                disabled={isSubmitted}
                                                role="radio"
                                                aria-checked={isOptSelected}
                                                className={`group relative flex items-center w-full text-left px-5 py-4 rounded-2xl border-[1.5px] text-[15px] transition-all duration-200 ease-out ${stateClasses} ${!isSubmitted ? "cursor-pointer" : "cursor-default"}`}
                                            >
                                                {/* Custom Radio Button */}
                                                <div
                                                    className={`flex-shrink-0 w-5 h-5 mr-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${showCorrect
                                                        ? "border-emerald-500 bg-emerald-500 text-zinc-950"
                                                        : showWrong
                                                            ? "border-red-500 bg-red-500 text-zinc-950"
                                                            : isOptSelected
                                                                ? "border-white bg-transparent"
                                                                : "border-zinc-600 group-hover:border-zinc-400 bg-zinc-950/50"
                                                        }`}
                                                >
                                                    <AnimatePresence>
                                                        {!isSubmitted && isOptSelected && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                exit={{ scale: 0 }}
                                                                className="w-2 h-2 rounded-full bg-white"
                                                            />
                                                        )}
                                                        {isSubmitted && (showCorrect || showWrong) && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="text-current"
                                                            >
                                                                {showCorrect ? <CheckIcon /> : <XIcon />}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                <span className="flex-1 leading-snug">{opt}</span>

                                                {/* Feedback Label */}
                                                {isSubmitted && showCorrect && !isOptSelected && (
                                                    <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-500/80 ml-3">Missed</span>
                                                )}
                                                {isSubmitted && showCorrect && isOptSelected && (
                                                    <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-500 ml-3">Correct</span>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Explanation Box */}
                                <AnimatePresence>
                                    {isSubmitted && que.explanation && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                            animate={{ opacity: 1, height: "auto", y: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                                            className="sm:ml-14 mt-4 overflow-hidden"
                                        >
                                            <div className={`p-5 rounded-2xl border flex gap-3 ${isCorrect ? "bg-emerald-500/5 border-emerald-500/10" : "bg-zinc-800/30 border-zinc-700/30"}`}>
                                                <div className={`mt-0.5 ${isCorrect ? "text-emerald-400" : "text-zinc-400"}`}>
                                                    <InfoIcon />
                                                </div>
                                                <div>
                                                    <p className={`text-[12px] font-bold uppercase tracking-wider mb-1 ${isCorrect ? "text-emerald-500" : "text-zinc-500"}`}>
                                                        Explanation
                                                    </p>
                                                    <p className="text-[14px] text-zinc-300 leading-relaxed">
                                                        {que.explanation}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Bottom Action Area */}
            <AnimatePresence mode="wait">
                {!isSubmitted && (
                    <motion.div
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-12"
                    >
                        <motion.button
                            onClick={handleInitialSubmit}
                            animate={showShake ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            className={`w-full py-4 rounded-2xl text-[16px] font-bold transition-all duration-300 shadow-lg ${allAnswered
                                ? "bg-white text-zinc-950 hover:bg-zinc-200 hover:scale-[1.01] active:scale-[0.99] shadow-white/10"
                                : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50 shadow-none"
                                }`}
                        >
                            {allAnswered ? "Complete Assessment" : `Answer ${totalQuestions - answeredCount} more question${totalQuestions - answeredCount !== 1 ? "s" : ""}`}
                        </motion.button>

                        {!allAnswered && (
                            <p className="text-center text-[14px] text-zinc-500 mt-4">
                                You must complete all questions before submitting.
                            </p>
                        )}

                        {policyUrl && (
                            <a
                                href={policyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-center text-[14px] text-zinc-500 hover:text-white mt-4 transition-colors decoration-zinc-700 underline-offset-4"
                            >
                                Need help? Review the policy document →
                            </a>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Email Popup Modal */}
            <AnimatePresence>
                {showEmailModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, type: "spring", bounce: 0.25 }}
                            className="bg-zinc-900 border border-zinc-800/80 rounded-[32px] p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
                        >
                            {/* Decorative background glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />

                            <div className="relative">
                                <div className="w-14 h-14 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm">
                                    <MailIcon className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Almost done!</h2>
                                <p className="text-[15px] text-zinc-400 mb-8 leading-relaxed">
                                    Please enter your email address to submit your assessment and view your final score.
                                </p>

                                <form onSubmit={handleFinalSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="sr-only">Email address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                                                <MailIcon className="w-[18px] h-[18px]" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                placeholder="you@company.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white text-[15px] placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowEmailModal(false)}
                                            className="py-4 px-5 rounded-2xl text-[14px] font-semibold text-zinc-300 bg-zinc-800/50 hover:bg-zinc-800 border border-transparent transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={async () => {
                                                const res = await fetch(`https://api.ranjitdas2048.workers.dev/update-score`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ email: email, score: score })
                                                });
                                                console.log(score)
                                                console.log(res.json)
                                            }}


                                            type="submit"
                                            className="flex-1 py-4 px-5 rounded-2xl text-[15px] font-bold text-zinc-950 bg-white hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                        >
                                            Submit Assessment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Screen reader */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {isSubmitted && `Assessment complete. You scored ${score} out of ${totalQuestions}.`}
            </div>
        </div>
    );
}