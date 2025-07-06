import { createMessageSender } from "../createMessageSender.ts";
import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
} from "../types.ts";

const OUTGOING_MESSAGE_TYPE = "NEW_MEDIA_FRAME";
const INCOMING_MESSAGE_TYPE = "OUTGOING_MESSAGE_TYPE";

type OutgoingMessage = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    data: ArrayBuffer;
  }
>;

type IncomingMessage = BaseIncomingMessage<
  typeof INCOMING_MESSAGE_TYPE,
  {
    message: string;
  }
>;

export const sendMediaFrameMessage = createMessageSender<
  OutgoingMessage,
  IncomingMessage
>({
  outgoingMessageType: OUTGOING_MESSAGE_TYPE,
  incomingMessageType: INCOMING_MESSAGE_TYPE,
});
