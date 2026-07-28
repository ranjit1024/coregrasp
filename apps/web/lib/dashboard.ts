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

    // Top bar\
    const policies = await prisma.user.findMany({
        where:{
            email: email
        },
        include:{
            policies:true
        }
    })
    console.log(policies);
    return {data:{
        policies
    }}
} 