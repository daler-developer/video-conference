import { createEventSub } from "../createEventSub.ts";
import { type BaseEventSubOutgoingMessage } from "../sendMessage/sendEventSubMessage.ts";
import type { BaseEventSubDataIncomingMessage } from "../listenMessage/onEventSubDataMessage.ts";

const EVENT_NAME = "NEW_MEDIA_FRAME";

type OutgoingMessage = BaseEventSubOutgoingMessage<
  typeof EVENT_NAME,
  {
    conferenceId: string;
  }
>;

type EventSubDataIncomingMessage = BaseEventSubDataIncomingMessage<
  typeof EVENT_NAME,
  {
    conferenceId: string;
  },
  {
    data: ArrayBuffer;
  }
>;

export const { hook: useNewMediaFrameSub } = createEventSub<
  OutgoingMessage,
  EventSubDataIncomingMessage
>({
  eventName: EVENT_NAME,
});
