import { createMessageSender } from "../createMessageSender.ts";
import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
} from "../types.ts";

const OUTGOING_MESSAGE_TYPE = "NEW_MEDIA_FRAME";

type OutgoingMessage = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    data: ArrayBuffer;
  }
>;

const INCOMING_MESSAGE_TYPE = "OUTGOING_MESSAGE_TYPE";

type IncomingMessage = BaseIncomingMessage<
  typeof INCOMING_MESSAGE_TYPE,
  {
    foo: any;
  }
>;

export const sendMediaFrameMessage = createMessageSender<
  OutgoingMessage,
  IncomingMessage
>({
  outgoingMessageType: OUTGOING_MESSAGE_TYPE,
  incomingMessageType: INCOMING_MESSAGE_TYPE,
});
