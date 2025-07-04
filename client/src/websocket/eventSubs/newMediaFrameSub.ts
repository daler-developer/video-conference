import { createEventSub } from "../createEventSub.ts";

type EventParams = {
  conferenceId: string;
};

type EventData = {
  data: ArrayBuffer;
};

const EVENT_NAME = "NEW_MEDIA_FRAME";

export const { hook: useNewMediaFrameSub } = createEventSub<
  EventParams,
  EventData,
  typeof EVENT_NAME
>({
  eventName: EVENT_NAME,
});
