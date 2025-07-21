import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
} from "@/websocket";
import type { MessageSender } from "@/websocket/createMessageSender.ts";
import { prepareMeta } from "@/websocket/utils.ts";
import { onMessage, sendMessage } from "@/websocket/connection.ts";
import {
  BaseError,
  incomingMessageIsOfTypeError,
} from "@/websocket/BaseError.ts";
import { ApiError } from "./ApiError";

export type MutationAdapter<
  TPayload extends Record<string, unknown> = Record<string, unknown>,
  TData extends Record<string, unknown> = Record<string, unknown>,
  TError extends ApiError<any> = ApiError<any>,
> = {
  callback: (o: {
    payload: TPayload;
  }) => Promise<{ data: TData | null; error: TError | null }>;
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
  ApiError<TErrorDetailsMap>
> => {
  return {
    async callback({ payload }) {
      const outgoingMessage = {
        type: outgoingMessageType,
        payload,
        meta: prepareMeta(),
      };

      sendMessage(outgoingMessage);

      return new Promise((res, rej) => {
        const unsubscribe = onMessage((message) => {
          if (
            message.type === incomingMessageType &&
            message.meta.messageId === outgoingMessage.meta.messageId
          ) {
            unsubscribe();
            res({
              data: message.payload,
              error: null,
            });
          }

          if (
            incomingMessageIsOfTypeError(message) &&
            message.meta.messageId === outgoingMessage.meta.messageId
          ) {
            unsubscribe();
            res({
              data: null,
              error: new ApiError<TErrorDetailsMap>(
                "test message",
                "test_type",
                {
                  first: "second",
                  age: 20,
                },
              ),
            });
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
