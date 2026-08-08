import { useEffect, useRef, useState } from "react";

export function useNotifications(wsUrl: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let retry = 0;
    let closedByUs = false;

    function connect() {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        retry = 0;
        // reconcile anything missed while disconnected
        const res = await fetch("/api/notifications?unread=true", {
          credentials: "include",
        });
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.length);
      };

      ws.onmessage = (e) => {
        const notif = JSON.parse(e.data);
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((c) => c + 1);
      };

      ws.onclose = () => {
        if (closedByUs) return;
        retry++;
        setTimeout(connect, Math.min(1000 * 2 ** retry, 30000));
      };
    }

    connect();
    return () => {
      closedByUs = true;
      wsRef.current?.close();
    };
  }, [wsUrl]);

  return { notifications, unreadCount, setUnreadCount };
}