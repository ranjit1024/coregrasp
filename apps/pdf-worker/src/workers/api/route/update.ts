import { Context } from "hono";
import { Bindings } from "../../../shared/types";
import { createPrismaClient } from "../lib/db"

export async function  update_score(c:Context<{Bindings:Bindings}>){
    const {email, score} = await c.req.json<{email:string, score:string}>();
    console.log(email);
    const prisma = createPrismaClient(c.env.HYPERDRIVE.connectionString);
    const isEmail = await prisma.candidate.findFirst({where:{
        email: email
    }});
    if(!isEmail) return c.json({res:"No assigement found"}, 400);
    try{
        await prisma.candidate.update({
            where:{
                email : email
            },
            data:{
                score: Number(score)
            }
    
        })
    }
    catch(e){
        console.log(e);
    }
    return  c.json({status:"Update"}, 200)
}