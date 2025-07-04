import { serializeMessage, parseMessage } from "./utils";
import type { BaseIncomingMessage, BaseOutgoingMessage } from "./types.ts";

type Callback = (event: MessageEvent) => void;

const callbacks: Array<Callback> = [];
let ws: WebSocket | null = null;

const isConnected = () => {
  return ws && ws.readyState === WebSocket.OPEN;
};

export const connect = async () => {
  ws = new WebSocket("ws://localhost:3000?token=DalerSaidov");

  ws.binaryType = "arraybuffer";

  ws.onmessage = (event) => {
    for (const callback of callbacks) {
      callback(event);
    }
  };

  return new Promise((res) => {
    ws!.addEventListener("open", () => {
      res("Connected");
    });
  });
};

export const onMessage = (cb: (message: BaseIncomingMessage) => void) => {
  if (!isConnected()) {
    throw new Error("not connected");
  }

  const callback: Callback = async (event) => {
    const parsed = await parseMessage(event);

    cb(parsed);
  };

  callbacks.push(callback);

  return () => {
    const idx = callbacks.indexOf(callback);
    callbacks.splice(idx, 1);
  };
};

export const sendMessage = async (message: BaseOutgoingMessage) => {
  if (!isConnected()) {
    throw new Error("not connected");
  }

  const serialized = await serializeMessage(message);

  ws!.send(serialized);
};
