"use server"
import prisma from "@/lib/prisma";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function getuserCandidate() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return null;
    }
    const email = session.user.email;

    const candidates = await prisma.candidate.findMany({
        where: {
            user: { email },
        },
    });
    console.log(candidates)
    return candidates
    
}