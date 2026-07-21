import { Context } from "hono";
import { Bindings } from "../../../shared/types";
import { createPrismaClient } from "../lib/db"
import { error } from "console";

export async function validate(c:Context<{Bindings:Bindings}>){
    try{
        const {email, id} = await c.req.json<{email:string, id:string}>();
        if(!email) return c.json({error:"Email not found"}, 404);
        const prisma = createPrismaClient(c.env.HYPERDRIVE.connectionString);
        const user = await prisma.user.findFirst({where:{id:id}});
        if(!user){
            console.log("user Not found");
            return c.json({mas:"user not found"},404 )
        };
        
    }
    catch(e){
        console.log(e);
    }

}