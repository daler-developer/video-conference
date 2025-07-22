import { createMessageSender } from "@/websocket";
import type { BaseIncomingMessage, BaseOutgoingMessage } from "../types.ts";

const OUTGOING_MESSAGE_TYPE = "EVENT_UNSUB";

type OutgoingMessage = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    eventName: string;
    eventParams: Record<string, any>;
  }
>;

const INCOMING_MESSAGE_TYPE = "EVENT_SUB";

type IncomingMessage = BaseIncomingMessage<
  typeof INCOMING_MESSAGE_TYPE,
  {
    foo: number;
  }
>;

export const sendEventUnsubMessage = createMessageSender<
  OutgoingMessage,
  IncomingMessage
>({
  outgoingMessageType: OUTGOING_MESSAGE_TYPE,
  incomingMessageType: INCOMING_MESSAGE_TYPE,
});
