"use server"
import prisma from "@/lib/prisma";
import { auth } from "./auth";
import { headers } from "next/headers";
export async function Dashboard_data(){
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if(!session){
        return null;
    }
    const email = session.user.email;

    const user  = await prisma.user.findFirst({
        where:{
            email: email
        },
        include:{
            policies:true,
            candidate:true
        }
    })
 
    
    return {data:{
        policies: user?.policies,
        candidate:user?.candidate.length
    }}
} 