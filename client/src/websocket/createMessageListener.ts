import { onMessage } from "./connection.ts";
import type { BaseIncomingMessage } from "./types.ts";

type Options<TIncomingMessage extends BaseIncomingMessage> = {
  type: TIncomingMessage["type"];
};

export const createMessageListener = <
  TIncomingMessage extends BaseIncomingMessage,
>({
  type,
}: Options<TIncomingMessage>) => {
  return (cb: (message: TIncomingMessage) => void) => {
    return onMessage((message) => {
      if (message.type === type) {
        cb(message as TIncomingMessage);
      }
    });
  };
};
