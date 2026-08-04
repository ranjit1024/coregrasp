import { Env } from "hono";

export class NotificationHub {
	constructor(private state: DurableObjectState, private env: Env) { }

	async fetch(req: Request) {

		const upgrade = req.headers.get("Upgrade");
		if (upgrade === "websocket") {
			const pair = new WebSocketPair();
			const [client, server] = Object.values(pair);
			this.state.acceptWebSocket(server);
			return new Response(null, { status: 101, webSocket: client });
		} console

		if (req.method === "POST") {
			const notif = await req.json();
			for (const ws of this.state.getWebSockets()) {
				ws.send(JSON.stringify(notif));
			}
			return new Response("ok");
		}

		return new Response("not found", { status: 404 });
	}

	async webSocketMessage(ws: WebSocket, msg: string) {
		if (msg === "ping") ws.send("pong");
	}

	async webSocketClose(ws: WebSocket) {
		ws.close();
	}
}
