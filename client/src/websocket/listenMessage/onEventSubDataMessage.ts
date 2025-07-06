import { createMessageListener } from "../createMessageListener.ts";
import type { BaseIncomingMessage } from "../types.ts";

const INCOMING_MESSAGE_TYPE = "EVENT_SUB_DATA";

export type BaseEventSubDataIncomingMessage<
  TEventName extends string = string,
  TEventParams extends Record<string, any> = Record<string, any>,
  TEventData extends Record<string, any> = Record<string, any>,
> = BaseIncomingMessage<
  typeof INCOMING_MESSAGE_TYPE,
  {
    eventName: TEventName;
    eventParams: TEventParams;
    eventData: TEventData;
  }
>;

type IncomingMessage = BaseEventSubDataIncomingMessage;

export const onEventSubDataMessage = createMessageListener<IncomingMessage>({
  type: INCOMING_MESSAGE_TYPE,
});
