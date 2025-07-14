import createMutation from "../createMutation";
import { sendStartSessionMessage } from "../message-senders/sendStartSessionMessage";
import { createMutationAdapterFromWebsocket } from "@/entity/createMutationAdapterForWebsocket.ts";

export const { useMutationHook: useStartSession } = createMutation(
  createMutationAdapterFromWebsocket(sendStartSessionMessage),
);
