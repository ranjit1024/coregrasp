import { createPrismaClient } from "@revisly/db";
import { MAX_FILE_SIZE } from "../../../shared/constants";
import { Context } from "hono";
import { Bindings } from "../../../shared/types";

export const uplaod_Route = async (c: Context<{ Bindings: Bindings }>) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File | null;
  const userId = formData.get('userId') as string;

  if (!file) return c.text('No file', 400);
  if (file.size > MAX_FILE_SIZE) {
    return c.json({ error: 'File exceeds 10 MB limit' }, 400);
  }

  const key = `${crypto.randomUUID()}-${file.name}`;
  const prisma = createPrismaClient(c.env.HYPERDRIVE.connectionString);

  const policy = await prisma.policy.create({
    data: { key, name: file.name, userId, status: "PENDING" }
  });

  await c.env.PDF_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/pdf' }
  });

  await c.env.PDF_QUEUE.send({ key, policyId: policy.id, uploaded_at: new Date().toISOString() });

  return c.json({ policyId: policy.id, key });
};