import { Context } from "hono";

export const result_Route = async (c:Context) => {
    const key = c.req.param('key');
    const result = await c.env.PDF_BUCKET.get(`${key}.result.json`);
    if(!result) return c.json({status:"processing"}, 202);
    return c.json({status:'done', data:await result.json()})
}