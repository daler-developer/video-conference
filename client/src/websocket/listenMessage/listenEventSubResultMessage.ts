import { createMessageListener } from "../createMessageListener.ts";
import type { EventName } from "../sendMessage/sendEventSubMessage.ts";
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

export type Mapping = {
  NEW_MEDIA_FRAME: {
    eventName: string;
    eventParams: unknown;
    eventData: {
      data: ArrayBuffer;
    };
  };
  CONFERENCE_NEW_PARTICIPANT_JOINED: {
    eventName: string;
    eventParams: unknown;
    eventData: {
      userId: number;
    };
  };
};

type Payload = {
  [K in EventName]: {
    eventName: K;
    eventParams: Mapping[K];
  };
}[EventName];

export const listenEventSubResultMessage = createMessageListener<
  Payload,
  "EVENT_SUB_RESULT"
>({
  type: "EVENT_SUB_RESULT",
});
