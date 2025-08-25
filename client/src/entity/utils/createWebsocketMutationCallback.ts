import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
  createOutgoingMessageCreator,
  websocketClient,
} from "@/websocket";
import { type MutationCallback } from "./createMutation.ts";

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

      return {
        data: incomingResponseMessage.payload,
        age: 234,
      };
    } catch (e) {
      return 1 as any;
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
