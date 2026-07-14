"use client";

import MCQList from "@/app/components/ui/mcq";
import { raw } from "@prisma/client/runtime/client";
import { use, useEffect, useState } from "react";

interface PolicyDetailsProps {
    params: Promise<{ policy: string }>;
}

export default function PolicyDetails({ params }: PolicyDetailsProps) {
    // Unwrapping params safely using Next.js 15 `use()` hook
    const { policy } = use(params);

    // States for data, loading, and errors
    const [data, setData] = useState<any>(null); // Replace 'any' with your specific MCQ array type if known
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Prevent fetching if policy isn't available yet
        if (!policy) return;

        const fetchPolicyData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`https://api.ranjitdas2048.workers.dev/ans/${policy}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch policy: ${response.statusText}`);
                }

                const json = await response.json();

                // Safely navigate the nested API structure
                const rawData: string = json?.result?.finalResult?.mcq.raw;
                console.log(rawData)
               
                // console.log(mcqData)
                const cleaned = rawData
                    .trim()
                    .replace(/^```json\s*/i, "")
                    .replace(/^```\s*/i, "")
                    .replace(/```$/i, "")
                    .trim();

                const mcqData = JSON.parse(cleaned)
                console.log(mcqData)
                if (mcqData) {
                    setData(mcqData);
                } else {
                    throw new Error("MCQ data format is missing or invalid.");
                }
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchPolicyData();
    }, [policy]); // Re-runs the fetch if the policy parameter changes

    // Conditional UI Rendering for UX
    if (loading) return <div className="p-6 text-center text-gray-500">Loading policy details...</div>;
    if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="p-4">
            {/* {data ? <MCQList questions={data} /> : <p>No questions found.</p>} */}
        </div>
    );
}