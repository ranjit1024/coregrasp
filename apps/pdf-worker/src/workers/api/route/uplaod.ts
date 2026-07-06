import { Context } from "hono";
import { MAX_FILE_SIZE } from "../../../shared/constants";
import { PrismaClient } from "@revisly/db/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

interface env{
  DATABASE_URL: string;
}

export const uplaod_Route = async (c: Context, ) => {



  const formData = await c.req.formData();
  const file = formData.get('file') as File | null;
  const userId = formData.get('userId') as string;
  if (!file) return c.text('No file', 400);
  if (!file) return
  if (file.size > MAX_FILE_SIZE) {
    return c.json({ error: 'File exceeds 10 MB limit' }, 400);
  }
  const key = `${crypto.randomUUID()}-${file.name}`;

  // const policy = await prisma.policy.create({
  //   data: { key, name: file.name, userId: userId, status: "PENDING" }
  // })
  await c.env.PDF_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: 'application/pdf' }
  });

  await c.env.PDF_QUEUE.send({ key, uploaded_at: new Date().toISOString() });

  return c.json({"Fsd":"fsad"});
}