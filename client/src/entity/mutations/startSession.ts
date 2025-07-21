import createMutation from "../createMutation";
import { sendStartSessionMessage } from "../message-senders/sendStartSessionMessage";
import {
  createMutationAdapterFromWebsocket,
  type MutationAdapter,
} from "@/entity/createMutationAdapterForWebsocket.ts";
import type { BaseIncomingMessage, BaseOutgoingMessage } from "@/websocket";

const OUTGOING_MESSAGE_TYPE = "START_SESSION";
const INCOMING_MESSAGE_TYPE = "START_SESSION_RESULT";

type OutgoingMessage = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    fullName: string;
  }
>;

type IncomingResponseMessage = BaseIncomingMessage<
  typeof INCOMING_MESSAGE_TYPE,
  {
    accessToken: string;
  }
>;

type ErrorDetailsMap = {
  VALIDATION: {
    foo: "bar";
  };
  SECOND: {
    age: number;
    name: string;
  };
};

export const { useMutationHook: useStartSession } = createMutation(
  createMutationAdapterFromWebsocket<
    OutgoingMessage,
    IncomingResponseMessage,
    ErrorDetailsMap
  >({
    incomingMessageType: INCOMING_MESSAGE_TYPE,
    outgoingMessageType: OUTGOING_MESSAGE_TYPE,
  }),
);

export const { callback: startMutation } = createMutationAdapterFromWebsocket<
  OutgoingMessage,
  IncomingResponseMessage,
  ErrorDetailsMap
>({
  incomingMessageType: INCOMING_MESSAGE_TYPE,
  outgoingMessageType: OUTGOING_MESSAGE_TYPE,
});
