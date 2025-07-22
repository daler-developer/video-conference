import type { BaseIncomingMessage, BaseOutgoingMessage } from "./types.ts";
import { prepareMeta } from "./utils.ts";
import { incomingMessageIsOfTypeError } from "@/websocket";
import websocketClient from "./WebsocketClient.ts";

type Options<
  TOutgoingMessage extends BaseOutgoingMessage = BaseOutgoingMessage,
  TIncomingMessage extends BaseIncomingMessage = BaseIncomingMessage,
> = {
  outgoingMessageType: TOutgoingMessage["type"];
  incomingMessageType: TIncomingMessage["type"];
};

type MessageSenderResult<TIncomingMessage extends BaseIncomingMessage> =
  Promise<{
    response: TIncomingMessage;
  }>;

export type MessageSender<
  TOutgoingMessage extends BaseOutgoingMessage = BaseOutgoingMessage,
  TIncomingMessage extends BaseIncomingMessage = BaseIncomingMessage,
> = ({
  payload,
}: {
  payload: TOutgoingMessage["payload"];
}) => Promise<{ response: TIncomingMessage }>;

export const createMessageSender = <
  TOutgoingMessage extends BaseOutgoingMessage = BaseOutgoingMessage,
  TIncomingMessage extends BaseIncomingMessage = BaseIncomingMessage,
>({
  outgoingMessageType,
  incomingMessageType,
}: Options<TOutgoingMessage, TIncomingMessage>): MessageSender<
  TOutgoingMessage,
  TIncomingMessage
> => {
  return async ({
    payload,
  }: {
    payload: TOutgoingMessage["payload"];
  }): MessageSenderResult<TIncomingMessage> => {
    const outgoingMessage = await websocketClient.sendMessage({
      type: outgoingMessageType,
      payload,
    });

    return new Promise((res, rej) => {
      const unsubscribe = websocketClient.onMessage((message) => {
        if (
          message.type === incomingMessageType &&
          message.meta.messageId === outgoingMessage.meta.messageId
        ) {
          unsubscribe();
          res({
            response: message as TIncomingMessage,
          });
        }

        if (
          incomingMessageIsOfTypeError(message) &&
          message.meta.messageId === outgoingMessage.meta.messageId
        ) {
          unsubscribe();
          // rej(new BaseError(message));
        }
      });

      // setTimeout(() => {
      //   off();
      //   rej();
      // }, 5000);
    });
  };
};
