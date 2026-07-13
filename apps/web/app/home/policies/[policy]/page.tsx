"use client";

import { use, useEffect, useState } from "react";

interface Policy {
    id: string;
    key: string;
    url: string;
    name: string;
    status: string;
}

export default function PolicyDetails({
    params,
}: {
    params: Promise<{ policy: string }>;
}) {
    const { policy } = use(params);
    const [data, setData] = useState();
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        const res = fetch(`https://api.ranjitdas2048.workers.dev/ans/${policy}`).then(data => data.json().then(res =>  console.log(res.result.result.summery)))
    },[])
    

    if (error) return <div>{error}</div>;


    return (
        <div>
           {}
           
        </div>
    );
}