import { createEventSub } from "../createEventSub.ts";

type EventParams = {
  conferenceId: string;
};

type EventData = {
  data: ArrayBuffer;
};

export const [newMediaFrameSub, useNewMediaFrameSub] = createEventSub<
  EventParams,
  EventData,
  "NEW_MEDIA_FRAME"
>({
  eventName: "NEW_MEDIA_FRAME",
});
