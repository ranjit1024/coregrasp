import { Context } from "hono";
import { createPrismaClient } from "@revisly/db";

export const result_Route = async (c: Context) => {
  const userId = c.req.query("userId");

  if (!userId) {
    return c.json({ error: "userId is required" }, 400);
  }

  const prisma = createPrismaClient(c.env.HYPERDRIVE.connectionString);

  const policy = await prisma.policy.findMany({
    where: { userId:userId},
  });

  if (!policy) {
    return c.json({ error: "No policy found" }, 404);
  }

  return c.json({
    userName: policy
  });
};