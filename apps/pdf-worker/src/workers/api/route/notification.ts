// route/notification-ws.ts
import { Context } from "hono";
import { Bindings } from "../../../shared/types";
import { createPrismaClient } from "@revisly/db";
import { ApiVariables } from "../middleware/auth";

type NotificationContext = Context<{ Bindings: Bindings; Variables: ApiVariables }>;

export const notification_ws_Route = async (c: NotificationContext) => {
    const userId = c.get("userId");

    const upgradeHeader = c.req.header("Upgrade");
    if (upgradeHeader !== "websocket") {
        return c.text("expected websocket", 426);
    }

    const id = c.env.NOTIF_HUB.idFromName(userId);
    const stub = c.env.NOTIF_HUB.get(id);

    return stub.fetch(c.req.raw);
};

export const notification_list_Route = async (c: NotificationContext) => {
    const userId = c.get("userId");
    const prisma = createPrismaClient(c.env.HYPERDRIVE.connectionString);
    const unreadOnly = c.req.query("unread") === "true";

    const notifs = await prisma.notification.findMany({
        where: { userId, ...(unreadOnly ? { read: false } : {}) },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    return c.json(notifs);
};


export const notification_read_Route = async (c: NotificationContext) => {
    const userId = c.get("userId");
    const prisma = createPrismaClient(c.env.HYPERDRIVE.connectionString);
    const notifId = c.req.param("id");

    await prisma.notification.update({
        where: { id: notifId, userId },
        data: { read: true },
    });

    return c.json({ ok: true });
};
