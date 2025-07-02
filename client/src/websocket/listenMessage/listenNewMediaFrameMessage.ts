import { createEventSubResultListener } from "../createEventSubResultListener.ts";

type EventParams = {
  conferenceId: string;
};

type EventData = {
  data: ArrayBuffer;
};

export const listenNewMediaFrameMessage = createEventSubResultListener<
  EventParams,
  EventData,
  "NEW_MEDIA_FRAME"
>({
  eventName: "NEW_MEDIA_FRAME",
});
