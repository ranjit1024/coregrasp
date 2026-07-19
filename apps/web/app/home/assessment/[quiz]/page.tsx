"use client";

import { use, useEffect, useState } from "react";

interface PublicQuizProps {
    params: Promise<{ quizId: string }>;
}

export default function PublicAssessment({ params }: PublicQuizProps) {
    const { quizId } = use(params);
    const [questions, setQuestions] = useState(null);
    const [guestInfo, setGuestInfo] = useState({ name: "", email: "" });
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        async function fetchQuiz() {
            const res = await fetch(`https://api.ranjitdas2048.workers.dev/public/quiz/${quizId}`);
            const data = await res.json(); 
            setQuestions(data.questions);
        }
        fetchQuiz();
    }, [quizId]);

    // 1. Require them to identify themselves before starting
    if (!hasStarted) {
        return (
            <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-zinc-900 border rounded-xl">
                <h2 className="text-xl font-bold mb-4">Coregrasp Policy Assessment</h2>
                <p className="mb-4 text-zinc-500">Please enter your details to begin the assessment.</p>
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full mb-3 p-2 border rounded"
                    onChange={e => setGuestInfo({...guestInfo, name: e.target.value})}
                />
                <input 
                    type="email" 
                    placeholder="Work Email" 
                    className="w-full mb-4 p-2 border rounded"
                    onChange={e => setGuestInfo({...guestInfo, email: e.target.value})}
                />
                <button 
                    onClick={() => setHasStarted(true)}
                    disabled={!guestInfo.name || !guestInfo.email}
                    className="w-full bg-zinc-900 text-white p-2 rounded disabled:opacity-50"
                >
                    Start Assessment
                </button>
            </div>
        );
    }

    // 2. Render the actual quiz interface here once they start
    return (
        <div>
            {/* Map over your questions array and show the MCQ interface */}
        </div>
    );
}