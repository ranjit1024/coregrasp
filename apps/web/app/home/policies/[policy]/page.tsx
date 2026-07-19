"use client";

import MCQList from "@/app/components/ui/mcq";
import { use, useEffect, useState } from "react";

interface PolicyDetailsProps {
    params: Promise<{ policy: string, url: string }>;
}

export default function PolicyDetails({ params }: PolicyDetailsProps) {
    const { policy } = use(params);
    const { url } = use(params);
    
    const [data, setData] = useState<any>(null); 
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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
                const mcqData = json?.result?.finalResult?.mcq?.questions;
               
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
    }, [policy]); 

    if (loading) return <div className="p-6 text-center text-zinc-500">Loading policy details...</div>;
    if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="p-4">
            {data ? <MCQList questions={data} policyUrl={policy} /> : <p>No questions found.</p>}
        </div>
    );
}