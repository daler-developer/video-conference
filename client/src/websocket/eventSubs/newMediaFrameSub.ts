import { createEventSub } from "../createEventSub.ts";
import type { BaseEventSubOutgoingMessage } from "../sendMessage/sendEventSubMessage.ts";

const EVENT_NAME = "NEW_MEDIA_FRAME";

type OutgoingMessage = BaseEventSubOutgoingMessage<
  typeof EVENT_NAME,
  {
    conferenceId: string;
  }
>;

export const { hook: useNewMediaFrameSub } = createEventSub<OutgoingMessage>({
  eventName: EVENT_NAME,
});
