import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
  createMessageSender,
} from "@/websocket";
import type { MessageSender } from "@/websocket/createMessageSender.ts";

export type MutationAdapter<
  TMessageSender extends MessageSender = MessageSender,
> = {
  callback: (args: {
    payload: Parameters<TMessageSender>[0]["payload"];
  }) => Promise<{
    data: Awaited<ReturnType<TMessageSender>>["response"];
  }>;
};

export const createMutationAdapterFromWebsocket = <
  TMessageSender extends MessageSender,
>(
  outgoingMessageSender: TMessageSender,
): MutationAdapter<TMessageSender> => {
  return {
    async callback({ payload }) {
      try {
        const { response } = await outgoingMessageSender({
          payload,
        });

        return {
          data: response,
        };
      } catch (e) {
        alert("test 2");
        throw new Error("test");
      }
    },
  };
};
