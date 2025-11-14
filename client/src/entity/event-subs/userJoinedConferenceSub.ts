import { createEventSub } from "../utils/createEventSub";
import { createWebsocketEventSubCallback } from "@/entity/utils/createWebsocketEventSubCallback.ts";

type EventSubParams = {
  conferenceId: string;
};

type EventSubData = {
  conferenceId: string;
  userId: number;
};

const USER_JOINED_CONFERENCE = "USER_JOINED_CONFERENCE";

export const { hook: useUserJoinedConferenceSub } = createEventSub<
  EventSubParams,
  EventSubData
>({
  name: USER_JOINED_CONFERENCE,
  callback: createWebsocketEventSubCallback({
    eventName: USER_JOINED_CONFERENCE,
  }),
  update({ data }) {},
});
