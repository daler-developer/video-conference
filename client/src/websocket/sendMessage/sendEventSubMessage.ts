import { createMessageSender } from "../utils.ts";

export type Mapping = {
  NEW_MEDIA_FRAME: {
    conferenceId: string;
  };
  CONFERENCE_NEW_PARTICIPANT_JOINED: {
    conferenceId: string;
    userId: number;
  };
};

export type EventName = keyof Mapping;

type Payload = {
  [K in EventName]: {
    eventName: K;
    eventParams: Mapping[K];
  };
}[EventName];

export const sendEventSubMessage = createMessageSender<Payload>({
  type: "EVENT_SUB",
});
