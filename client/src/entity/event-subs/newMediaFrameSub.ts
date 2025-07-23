import { createEventSub } from "../utils/createEventSub";
import { createEventSubAdapterForWebsocket } from "../adapters/createEventSubAdapterForWebsocket";

type Params = {
  conferenceId: string;
};

type Data = {
  data: ArrayBuffer;
};

const EVENT_NAME = "NEW_MEDIA_FRAME";

export const { hook: useNewMediaFrameSub } = createEventSub(
  createEventSubAdapterForWebsocket<typeof EVENT_NAME, Params, Data>({
    eventName: EVENT_NAME,
  }),
);

// const adapter = createEventSubAdapterForWebsocket<Params, Data>({});

// adapter.subscribe({
//   params: {
//     conferenceId: "324",
//   },
//   onData({ data }) {
//     console.log(data.);
//   },
// });
