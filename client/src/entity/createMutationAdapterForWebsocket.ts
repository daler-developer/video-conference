import { createMessageSender } from "@/websocket";

export type MutationAdapter<
  TOutgoingMessageSender extends ReturnType<
    typeof createMessageSender
  > = ReturnType<typeof createMessageSender>,
> = {
  callback: (args: {
    payload: Parameters<TOutgoingMessageSender>[0];
  }) => Promise<{
    data: Awaited<ReturnType<TOutgoingMessageSender>>["response"];
  }>;
};

export const createMutationAdapterFromWebsocket = <
  TOutgoingMessageSender extends ReturnType<typeof createMessageSender>,
>(
  outgoingMessageSender: TOutgoingMessageSender,
): MutationAdapter<TOutgoingMessageSender> => {
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
