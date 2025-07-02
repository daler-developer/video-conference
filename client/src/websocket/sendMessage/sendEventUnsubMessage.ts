import { createMessageSender } from "../utils.ts";
import type { EventName, Mapping } from "./sendEventSubMessage.ts";

type Payload = {
  [K in EventName]: {
    eventName: K;
    eventParams: Mapping[K];
  };
}[EventName];

export const sendEventUnsubMessage = createMessageSender<Payload>({
  type: "EVENT_UNSUB",
});
