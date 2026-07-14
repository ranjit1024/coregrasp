"use client";

import MCQList from "@/app/components/ui/mcq";
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
    let res;
    useEffect(()=>{
        res = fetch(`https://api.ranjitdas2048.workers.dev/ans/${policy}`).then(data => data.json().then(res =>  console.log(res.result.result)))
    },[])
    

    if (error) return <div>{error}</div>;


    return (
        <div>
           {/* <MCQList questions={res}></MCQList> */}
           
        </div>
    );
}