import { createMessageListener } from "../createMessageListener.ts";
import type { BaseIncomingMessage } from "../types.ts";

export type BaseEventSubResultMessage<
  TEventName extends string,
  TEventParams extends { [key: string]: any },
  TEventData extends { [key: string]: any },
> = BaseIncomingMessage<
  "EVENT_SUB_RESULT",
  {
    eventName: TEventName;
    eventParams: TEventParams;
    eventData: TEventData;
  }
>;

type Payload = {
  eventName: string;
  eventParams: { [key: string]: any };
  eventData: { [key: string]: any };
};

export const onEventSubResultMessage = createMessageListener<
  Payload,
  "EVENT_SUB_RESULT"
>({
  type: "EVENT_SUB_RESULT",
});
