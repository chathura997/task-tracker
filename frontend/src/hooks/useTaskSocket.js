import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL || "http://localhost:8080/ws";

export function useTaskSocket(onTaskEvent) {
  const clientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS(WS_BASE_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/topic/tasks", (message) => {
          const event = JSON.parse(message.body);
          onTaskEvent(event);
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [onTaskEvent]);
}
