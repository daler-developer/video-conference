import { createMessageSender } from "../createMessageSender.ts";
import type { BaseIncomingMessage, BaseOutgoingMessage } from "../types.ts";

const OUTGOING_MESSAGE_TYPE = "START_SESSION";

type OutgoingMessage = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    fullName: string;
  }
>;

const INCOMING_MESSAGE_TYPE = "START_SESSION_RESULT";

type IncomingMessage = BaseIncomingMessage<
  typeof INCOMING_MESSAGE_TYPE,
  {
    accessToken: string;
  }
>;

export const sendStartSessionMessage = createMessageSender<
  OutgoingMessage,
  IncomingMessage
>({
  outgoingMessageType: OUTGOING_MESSAGE_TYPE,
  incomingMessageType: INCOMING_MESSAGE_TYPE,
});
