import { Context } from "hono";
import { Bindings } from "../../../shared/types";
import { createPrismaClient } from "../lib/db"
import { error } from "console";

export async function validate(c:Context<{Bindings:Bindings}>){
    const {email} = await c.req.json<{email:string}>();
    const prisma = createPrismaClient(c.env.HYPERDRIVE.connectionString);
    if(!email) return c.json({error:"Email not found"}, 404);

}