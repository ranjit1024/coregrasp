import { useEffect, useRef, useState } from "react";
import { apiUrl, authHeaders, getWorkerToken, wsUrl } from "@/lib/api";

export interface NotificationItem {
  id: string;
  type: string;
  payload?: unknown;
  read: boolean;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let retry = 0;
    let closedByUs = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    function scheduleReconnect() {
      retry++;
      reconnectTimer = setTimeout(connect, Math.min(1000 * 2 ** retry, 30000));
    }

    async function connect() {
      let token: string;
      try {
        token = await getWorkerToken();
      } catch {
        if (closedByUs) return;
        scheduleReconnect();
        return;
      }
      if (closedByUs) return;

      const ws = new WebSocket(
        `${wsUrl("/notifications/ws")}?token=${encodeURIComponent(token)}`
      );
      wsRef.current = ws;

      ws.onopen = async () => {
        retry = 0;
        // reconcile anything missed while disconnected
        try {
          const res = await fetch(apiUrl("/notifications?unread=true"), {
            headers: await authHeaders(),
          });
          if (!res.ok) return;
          const data: NotificationItem[] = await res.json();
          setNotifications(data);
          setUnreadCount(data.length);
        } catch {
          // the WebSocket still delivers new notifications
        }
      };

      ws.onmessage = (e) => {
        const notif: NotificationItem = JSON.parse(e.data);
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((c) => c + 1);
      };

      ws.onclose = () => {
        if (closedByUs) return;
        scheduleReconnect();
      };
    }

    connect();
    return () => {
      closedByUs = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, []);

  async function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    try {
      await fetch(apiUrl(`/notifications/${id}/read`), {
        method: "POST",
        headers: await authHeaders(),
      });
    } catch {
      // optimistic update; the next reconcile will resync
    }
  }

  return { notifications, unreadCount, markRead };
}
