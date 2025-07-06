import { createEventSub } from "../createEventSub.ts";
import {
  type BaseEventSubOutgoingMessage,
  type BaseEventSubIncomingMessage,
} from "../sendMessage/sendEventSubMessage.ts";

const EVENT_NAME = "NEW_MEDIA_FRAME";

type OutgoingMessage = BaseEventSubOutgoingMessage<
  typeof EVENT_NAME,
  {
    conferenceId: string;
  }
>;

type IncomingMessage = BaseEventSubIncomingMessage<
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
  IncomingMessage
>({
  eventName: EVENT_NAME,
});
