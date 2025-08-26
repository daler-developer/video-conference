import { createEventSub } from "../utils/createEventSub";
import { createWebsocketEventSubCallback } from "@/entity/utils/createWebsocketEventSubCallback.ts";

type EventSubParams = {
  conferenceId: string;
};

type EventSubData = {
  data: ArrayBuffer;
  foo: "bar";
};

const NEW_MEDIA_FRAME = "NEW_MEDIA_FRAME";

export const { hook: useNewMediaFrameSub } = createEventSub<
  EventSubParams,
  EventSubData
>({
  callback: createWebsocketEventSubCallback({
    eventName: NEW_MEDIA_FRAME,
  }),
  update({ data }) {},
});

// const adapter = createEventSubAdapterForWebsocket<Params, Data>({});

// adapter.subscribe({
//   params: {
//     conferenceId: "324",
//   },
//   onData({ data }) {
//     console.log(data.);
//   },
// });
