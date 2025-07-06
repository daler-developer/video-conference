import { createMessageSender } from "../createMessageSender.ts";
import type { BaseIncomingMessage, BaseOutgoingMessage } from "../types.ts";

const OUTGOING_MESSAGE_TYPE = "EVENT_SUB";
const INCOMING_MESSAGE_TYPE = "EVENT_SUB_RESULT";

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

type IncomingMessage = BaseIncomingMessage<
  typeof INCOMING_MESSAGE_TYPE,
  {
    message: string;
  }
>;

export const sendEventSubMessage = createMessageSender<
  OutgoingMessage,
  IncomingMessage
>({
  outgoingMessageType: OUTGOING_MESSAGE_TYPE,
  incomingMessageType: INCOMING_MESSAGE_TYPE,
});

// export type BaseEventSubIncomingMessage<
//   TEventName extends string = string,
//   TEventParams extends Record<string, any> = Record<string, any>,
//   TEventData extends Record<string, any> = Record<string, any>,
// > = BaseIncomingMessage<
//   typeof INCOMING_MESSAGE_TYPE,
//   {
//     eventName: TEventName;
//     eventParams: TEventParams;
//     eventData: TEventData;
//   }
// >;
