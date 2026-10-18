"use client";

import MCQList from "@/app/components/ui/mcq";
import QuizReviewLayout from "@/app/components/ui/quiz-skeloton";
import { fetchMcqQuestions, McqQuestion } from "@/lib/fetchMcq";
import { use, useEffect, useState } from "react";

interface PolicyDetailsProps {
    params: Promise<{ policy: string }>;
}

export default function PolicyDetails({ params }: PolicyDetailsProps) {
    const { policy } = use(params);

    const [data, setData] = useState<McqQuestion[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!policy) return;

        const fetchPolicyData = async () => {
            try {
                setLoading(true);
                setError(null);
                setData(await fetchMcqQuestions(policy));
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchPolicyData();
    }, [policy]);

    if (loading) return <div className="p-6 text-center text-zinc-500"><QuizReviewLayout /></div>;
    if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="max-md:p-0 p-4">
            {data ? <MCQList questions={data} policyUrl={policy} /> : <p>No questions found.</p>}
        </div>
    );
}
