import { createMessageSender } from "../createMessageSender.ts";

type Payload = {
  eventName: string;
  eventParams: { [key: string]: any };
};

export const sendEventSubMessage = createMessageSender<Payload>({
  type: "EVENT_SUB",
});
