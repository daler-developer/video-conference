import { onMessage } from "./connection.ts";
import type {
  BaseIncomingMessage,
  BaseIncomingMessagePayload,
} from "./types.ts";

type Options<TMessageType extends string> = {
  type: TMessageType;
};

export const createMessageListener = <
  TMessagePayload extends BaseIncomingMessagePayload,
  TMessageType extends string,
>({
  type,
}: Options<TMessageType>) => {
  return (
    cb: (message: BaseIncomingMessage<TMessageType, TMessagePayload>) => void,
  ) => {
    return onMessage((message) => {
      if (message.type === type) {
        cb(message as BaseIncomingMessage<TMessageType, TMessagePayload>);
      }
    });
  };
};
