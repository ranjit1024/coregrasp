import { Context } from "hono";
import { Bindings } from "../../../shared/types";

export async function validate(c: Context<{Bindings:Bindings}>) {
    const {email} = await c.req.json<{email:string}>()
}