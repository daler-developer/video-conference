import type { BaseIncomingMessage } from "./types.ts";
import websocketClient from "./WebsocketClient.ts";

type Options<TIncomingMessage extends BaseIncomingMessage> = {
  type: TIncomingMessage["type"];
};

export const createMessageListener = <
  TIncomingMessage extends BaseIncomingMessage,
>({
  type,
}: Options<TIncomingMessage>) => {
  return (cb: (message: TIncomingMessage) => void) => {
    return websocketClient.onMessage((message) => {
      if (message.type === type) {
        cb(message as TIncomingMessage);
      }
    });
  };
};
