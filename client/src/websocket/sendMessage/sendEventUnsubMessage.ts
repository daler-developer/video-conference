import { createMessageSender } from "../createMessageSender.ts";

type Payload = {
  eventName: string;
  eventParams: { [key: string]: any };
};

export const sendEventUnsubMessage = createMessageSender<Payload>({
  type: "EVENT_UNSUB",
});
