"use client";

import { use, useEffect, useState } from "react";

export default function PolicyDetails({
    params,
}: {
    params: Promise<{ policy: string }>;
}) {
    const { policy } = use(params); 
    console.log(policy)
    const [data, setData] = useState<any>(null);
    const ans = fetch(`https://api.ranjitdas2048.workers.dev/ans/${policy}`);
    console.log(ans)
    if (!data) return <div>Loading...</div>;

    return (
        <div>
            <h1>Policy {data.answer?.id}</h1>
        </div>
    );
}