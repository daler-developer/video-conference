import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
  websocketClient,
} from "@/websocket";
import { ApiError } from "./ApiError";
import type { IncomingErrorMessage } from "@/websocket/types.ts";

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
}: Options<TOutgoingMessage, TIncomingMessage>): MutationAdapter<
  TOutgoingMessage["payload"],
  TIncomingMessage["payload"],
  TErrorDetailsMap
> => {
  const MutationError = class extends ApiError<TErrorDetailsMap> {};

  return {
    Error: MutationError,
    async callback({ payload }) {
      try {
        const incomingResponseMessage = await websocketClient.sendMessage({
          type: outgoingMessageType,
          payload,
        });

        return {
          data: incomingResponseMessage.payload,
        };
      } catch (e) {
        const incomingErrorResponseMessage = e as IncomingErrorMessage;

        throw new MutationError(
          incomingErrorResponseMessage.payload.message,
          incomingErrorResponseMessage.payload.errorType,
          incomingErrorResponseMessage.payload.details as any,
        );
      }
    },
  };
};
