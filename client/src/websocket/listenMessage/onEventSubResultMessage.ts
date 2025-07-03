import { createMessageListener } from "../createMessageListener.ts";
import type { BaseIncomingMessage } from "../types.ts";

export type BaseEventSubResultMessage<
  TEventName extends string,
  TEventParams extends { [key: string]: unknown },
  TEventData extends { [key: string]: unknown },
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
  eventParams: { [key: string]: unknown };
};

export const onEventSubResultMessage = createMessageListener<
  Payload,
  "EVENT_SUB_RESULT"
>({
  type: "EVENT_SUB_RESULT",
});
