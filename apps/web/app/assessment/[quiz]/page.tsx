"use client";

import Quiz from "@/app/components/ui/quiz";
import { fetchMcqQuestions, McqQuestion } from "@/lib/fetchMcq";
import { use, useEffect, useState } from "react";

interface PolicyDetailsProps {
    params: Promise<{ quiz: string }>;
}

export default function QuizPage({ params }: PolicyDetailsProps) {
    const { quiz } = use(params);

    const [data, setData] = useState<McqQuestion[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!quiz) return;

        const fetchPolicyData = async () => {
            try {
                setLoading(true);
                setError(null);
                setData(await fetchMcqQuestions(quiz));
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchPolicyData();
    }, [quiz]);

    if (loading) return <div className="p-6 text-center text-zinc-500">Loading policy details...</div>;
    if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="p-4">
            {data ? <Quiz questions={data} policyUrl={quiz} /> : <p>No questions found.</p>}
        </div>
    );
}
