import createMutation from "../utils/createMutation.ts";
import { createWebsocketMutationCallback } from "../utils/createWebsocketMutationCallback.ts";

const START_CONFERENCE = "START_CONFERENCE";

type MutationPayload = {
  name: string;
};

type MutationData = {
  conferenceId: number;
};

type MutationErrorMap = {};

export const {
  useMutationHook: useStartConference,
  Error: StartConferenceError,
} = createMutation<MutationPayload, MutationData, MutationErrorMap>({
  callback: createWebsocketMutationCallback({
    outgoingMessageType: START_CONFERENCE,
  }),
});
