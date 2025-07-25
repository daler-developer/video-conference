import createMutation from "../utils/createMutation.ts";
import { createMutationAdapterFromWebsocket } from "../adapters/createMutationAdapterForWebsocket.ts";
import type { BaseIncomingMessage, BaseOutgoingMessage } from "@/websocket";

const OUTGOING_MESSAGE_TYPE = "NEW_MEDIA_FRAME";
const INCOMING_MESSAGE_TYPE = "OUTGOING_MESSAGE_TYPE";

type OutgoingMessage = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    data: ArrayBuffer;
  }
>;

type IncomingResponseMessage = BaseIncomingMessage<
  typeof INCOMING_MESSAGE_TYPE,
  {
    message: string;
  }
>;

type ErrorDetailsMap = {};

export const {
  useMutationHook: useSendMediaFrame,
  Error: SendMediaFrameError,
} = createMutation(
  createMutationAdapterFromWebsocket<
    OutgoingMessage,
    IncomingResponseMessage,
    ErrorDetailsMap
  >({
    incomingMessageType: INCOMING_MESSAGE_TYPE,
    outgoingMessageType: OUTGOING_MESSAGE_TYPE,
  }),
);
