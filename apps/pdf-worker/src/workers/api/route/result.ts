import { Context } from "hono";
import { createPrismaClient } from "@revisly/db";

export const result_Route = async (c: Context) => {
  const userId = c.req.query("userId");

  if (!userId) {
    return c.json({ error: "userId is required" }, 400);
  }

  const prisma = createPrismaClient(c.env.HYPERDRIVE.connectionString);

  const policies = await prisma.policy.findMany({
    where: { userId },
    include: {
      _count: {
        select: { candidates: true }, // relation field name on Policy model
      },
    },
  });

  if (policies.length === 0) {
    return c.json({ error: "No policy found" }, 404);
  }

  return c.json({
    policies: policies.map((p) => ({
      id: p.id,
      name: p.name,
      key:p.key,
      status: p.status,
      url:p.url,
      userId:p.userId,
      category:p.category,
      candidateCount: p._count.candidates,
    })),
  });
};