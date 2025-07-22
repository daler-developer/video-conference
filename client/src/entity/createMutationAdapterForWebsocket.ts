import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
  websocketClient,
} from "@/websocket";
import { prepareMeta } from "@/websocket/utils.ts";

import { incomingMessageIsOfTypeError } from "@/websocket";
import { ApiError } from "./ApiError";

export type MutationAdapter<
  TPayload extends Record<string, unknown> = Record<string, unknown>,
  TData extends Record<string, unknown> = Record<string, unknown>,
  TErrorDetailsMap extends Record<string, object> = Record<string, object>,
> = {
  Error: typeof ApiError<TErrorDetailsMap>;
  callback: (o: { payload: TPayload }) => Promise<{ data: TData }>;
};

type Options<
  TOutgoingMessage extends BaseOutgoingMessage,
  TIncomingMessage extends BaseIncomingMessage,
> = {
  outgoingMessageType: TOutgoingMessage["type"];
  incomingMessageType: TIncomingMessage["type"];
};

export const createMutationAdapterFromWebsocket = <
  TOutgoingMessage extends BaseOutgoingMessage,
  TIncomingMessage extends BaseIncomingMessage,
  TErrorDetailsMap extends Record<string, object> = Record<string, object>,
>({
  outgoingMessageType,
  incomingMessageType,
}: Options<TOutgoingMessage, TIncomingMessage>): MutationAdapter<
  TOutgoingMessage["payload"],
  TIncomingMessage["payload"],
  TErrorDetailsMap
> => {
  const MutationError = class extends ApiError<TErrorDetailsMap> {};

  return {
    Error: MutationError,
    async callback({ payload }) {
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
              data: message.payload,
            });
          }

          if (
            incomingMessageIsOfTypeError(message) &&
            message.meta.messageId === outgoingMessage.meta.messageId
          ) {
            unsubscribe();
            rej(
              new MutationError(
                message.payload.message,
                message.payload.errorType,
                message.payload.details as any,
              ),
            );
          }
        });

        // setTimeout(() => {
        //   off();
        //   rej();
        // }, 5000);
      });
    },
  };
};
