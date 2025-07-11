import {
  createMessageSender,
  type BaseOutgoingMessage,
  type BaseIncomingMessage,
} from "@/websocket";

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

export const sendStartSessionMessage = createMessageSender<
  OutgoingMessage,
  IncomingResponseMessage
>({
  outgoingMessageType: OUTGOING_MESSAGE_TYPE,
  incomingMessageType: INCOMING_MESSAGE_TYPE,
});
