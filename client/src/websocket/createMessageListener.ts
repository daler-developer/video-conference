import websocketClient from "../WebsocketClient.ts";
import type { BaseIncomingMessage } from "./types.ts";

type Options<TMessageType extends string> = {
  type: TMessageType;
};

export const createMessageListener = <
  TPayload extends { [key: string]: any },
  TMessageType extends string,
>({
  type,
}: Options<TMessageType>) => {
  return (
    cb: (message: BaseIncomingMessage<TMessageType, TPayload>) => void,
  ) => {
    return websocketClient.onMessage((message) => {
      if (message.type === type) {
        cb(message as BaseIncomingMessage<TMessageType, TPayload>);
      }
    });
  };
};
