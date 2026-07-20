"use server"
import prisma from "@/lib/prisma";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function getuserId(){
    const session = await auth .api.getSession({
        headers: await headers()
    })

    if(!session){
        return null;
    }
    const email = session.user.email;
    const id = await prisma.user.findFirst({where:{email:email}});
    console.log(id);
    return id;
}