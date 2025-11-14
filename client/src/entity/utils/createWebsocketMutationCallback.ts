import {
  createOutgoingMessageCreator,
  websocketClient,
  WebsocketError,
} from "@/websocket";
import { type MutationCallback } from "./createMutation.ts";
import { MutationError } from "@/entity/MutationError.ts";

type Options<TOutgoingMessageType extends string> = {
  outgoingMessageType: TOutgoingMessageType;
};

export const createWebsocketMutationCallback = <
  TOutgoingMessageType extends string,
>({
  outgoingMessageType,
}: Options<TOutgoingMessageType>): MutationCallback<any, any> => {
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

      return incomingResponseMessage.payload;
    } catch (e) {
      if (e instanceof WebsocketError) {
        throw new MutationError(
          e.incomingErrorMessage.payload.message,
          e.incomingErrorMessage.payload.errorType,
          e.incomingErrorMessage.payload.details,
        );
      } else {
        console.log("e", e);
        alert("createWebsocketMutationCallback error");
      }
    }
  };
};
