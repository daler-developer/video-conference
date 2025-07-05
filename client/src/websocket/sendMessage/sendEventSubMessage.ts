import { createMessageSender } from "../createMessageSender.ts";
import type { BaseIncomingMessage, BaseOutgoingMessage } from "../types.ts";

const OUTGOING_MESSAGE_TYPE = "EVENT_SUB";

export type BaseEventSubOutgoingMessage<
  TEventName extends string = string,
  TEventParams extends Record<string, any> = Record<string, any>,
> = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    eventName: TEventName;
    eventParams: TEventParams;
  }
>;

type OutgoingMessage = BaseEventSubOutgoingMessage;

const INCOMING_MESSAGE_TYPE = "EVENT_SUB";

type IncomingMessage = BaseIncomingMessage<
  typeof INCOMING_MESSAGE_TYPE,
  {
    foo: number;
  }
>;

export const sendEventSubMessage = createMessageSender<
  OutgoingMessage,
  IncomingMessage
>({
  outgoingMessageType: OUTGOING_MESSAGE_TYPE,
  incomingMessageType: INCOMING_MESSAGE_TYPE,
});
