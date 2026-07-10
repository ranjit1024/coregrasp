import { Context } from "hono";
import { createPrismaClient } from "@revisly/db";

export const result_Route = async (c: Context) => {
  const userId = c.req.query("userId");

  if (!userId) {
    return c.json({ error: "userId is required" }, 400);
  }

  const prisma = createPrismaClient(c.env.HYPERDRIVE.connectionString);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({
    userName: user.name,
  });
};