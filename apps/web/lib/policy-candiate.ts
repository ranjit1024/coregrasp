"use server"
import prisma from "@/lib/prisma";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function getCandidatepolicy({key}: {key:string}) {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return null;
    }
    const email = session.user.email;
    const policy = await prisma.policy.findFirst({
        where: {
            key:key
        }
    })

    if (!policy) {
        return [];
    }

    const candidates = await prisma.candidate.findMany({
        where: {
            user: { email },
            policyId: policy.id
        },
    });
    console.log(candidates)
    return candidates
    
}