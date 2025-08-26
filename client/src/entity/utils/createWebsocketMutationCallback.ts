import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
  createOutgoingMessageCreator,
  websocketClient,
  WebsocketError,
} from "@/websocket";
import { type MutationCallback } from "./createMutation.ts";
import type { BaseIncomingErrorMessage } from "@/websocket/types.ts";
import { MutationError } from "@/entity/MutationError.ts";

type Options<TOutgoingMessage extends BaseOutgoingMessage> = {
  outgoingMessageType: TOutgoingMessage["type"];
};

export const createWebsocketMutationCallback = <
  TOutgoingMessage extends BaseOutgoingMessage,
>({
  outgoingMessageType,
}: Options<TOutgoingMessage>): MutationCallback<any, any> => {
  return async ({ payload }) => {
    try {
      const createOutgoingMessage = createOutgoingMessageCreator({
        type: outgoingMessageType,
      });

      const incomingResponseMessage = await websocketClient.sendMessage(
        createOutgoingMessage({
          payload,
        }),
      );
      console.log("success");
      return {
        data: incomingResponseMessage.payload,
        age: 234,
      };
    } catch (e) {
      if (e instanceof WebsocketError) {
        throw new MutationError(
          e.incomingErrorMessage.payload.message,
          e.incomingErrorMessage.payload.errorType,
          e.incomingErrorMessage.payload.details,
        );
      } else {
        alert("createWebsocketMutationCallback error");
      }
      // const incomingErrorResponseMessage = e as BaseIncomingErrorMessage;
      //
      // throw new MutationError(
      //   incomingErrorResponseMessage.payload.message,
      //   incomingErrorResponseMessage.payload.errorType,
      //   incomingErrorResponseMessage.payload.details as any,
      // );
    }
  };
};
