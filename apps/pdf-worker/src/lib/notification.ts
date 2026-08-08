
import {PrismaClient } from "@revisly/db";

import { Bindings } from "../shared/types";
import { createPrismaClient } from "../workers/api/lib/db";

export async function pushNotification( env: Bindings,
 userId: string,
 notif: { type: string; payload: unknown })
{
	  const prisma = createPrismaClient(env.HYPERDRIVE.connectionString);
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
