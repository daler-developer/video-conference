import { createMessageSender } from "../utils.ts";

type Payload = {
  eventName: string;
  eventParams: { [key: string]: unknown };
};

export const sendEventUnsubMessage = createMessageSender<Payload>({
  type: "EVENT_UNSUB",
});
