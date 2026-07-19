"use client";

import { useState } from "react";

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

export default function Quiz({ questions, policyUrl }: MCQListProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
        if (isSubmitted) return;
        setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
    };

    if (!questions || questions.length === 0) return null;

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            {/* Header */}
            <div className="mb-12 border-b-2 border-zinc-900 dark:border-zinc-100 pb-8">
                <h2 className="text-4xl font-black tracking-tighter text-zinc-950 dark:text-zinc-50 uppercase">
                    {isSubmitted ? "Assessment Results" : "Policy Assessment"}
                </h2>
                <p className="mt-4 text-zinc-500 font-medium">
                    {isSubmitted 
                        ? `You scored ${Object.entries(selectedAnswers).filter(([i, ans]) => ans === questions[Number(i)].correctIndex).length} / ${questions.length}` 
                        : "Test your knowledge. Complete all questions to submit."}
                </p>
            </div>

            {/* Questions */}
            <div className="space-y-12">
                {questions.map((que, index) => {
                    const isSelected = selectedAnswers[index] !== undefined;
                    
                    return (
                        <div key={index} className="group">
                            <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-100 mb-6 leading-snug">
                                <span className="font-mono text-zinc-400 mr-3">{String(index + 1).padStart(2, '0')}.</span>
                                {que.question}
                            </h3>
                            
                            <div className="grid gap-3">
                                {que.options.map((option, idx) => {
                                    const isCorrect = idx === que.correctIndex;
                                    const userSelected = selectedAnswers[index] === idx;
                                    
                                    let stateClass = "border-2 border-zinc-200 hover:border-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-500";
                                    
                                    if (isSubmitted) {
                                        if (isCorrect) stateClass = "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20";
                                        else if (userSelected && !isCorrect) stateClass = "border-2 border-zinc-900 bg-zinc-100 opacity-50 dark:border-zinc-700";
                                        else stateClass = "border-2 border-zinc-100 opacity-40 dark:border-zinc-900";
                                    } else if (userSelected) {
                                        stateClass = "border-2 border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800";
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionSelect(index, idx)}
                                            disabled={isSubmitted}
                                            className={`p-5 rounded-none transition-all duration-200 w-full text-left font-medium ${stateClass} active:scale-[0.99]`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>

                            {isSubmitted && que.explanation && (
                                <div className="mt-6 p-5 border-l-4 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900">
                                    <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-70">Explanation</p>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">{que.explanation}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Submit Action */}
            {!isSubmitted && (
                <div className="mt-16">
                    <button
                        onClick={() => setIsSubmitted(true)}
                        disabled={Object.keys(selectedAnswers).length !== questions.length}
                        className="w-full py-6 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 font-black uppercase tracking-widest text-lg hover:opacity-90 disabled:opacity-30 transition-all"
                    >
                        {Object.keys(selectedAnswers).length === questions.length ? "Submit Assessment" : "Finish remaining questions..."}
                    </button>
                </div>
            )}
        </div>
    );
}