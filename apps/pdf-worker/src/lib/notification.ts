
import { createPrismaClient, PrismaClient } from "@revisly/db";
import { Env } from "hono";
import { Bindings } from "../shared/types";

export async function pushNotification( env: Bindings,
 prisma: PrismaClient,
 userId: string,
 notif: { type: string; payload: unknown })
{
	const record = await prisma.notification.create({
		data: {
			userId, type: notif.type, payload: notif.payload as any
		}
	});

	const id = env.NOTIF_HUB.idFromName(userId);

 await env.NOTIF_HUB.get(id).fetch("https://internal/push", {
    method: "POST",
    body: JSON.stringify(record),
  });
 return record;
}
