import createMutation from "../utils/createMutation.ts";
import { createWebsocketMutationCallback } from "../utils/createWebsocketMutationCallback.ts";

const JOIN_CONFERENCE = "JOIN_CONFERENCE";

type MutationPayload = {
  conferenceId: string;
};

type MutationData = {};

type MutationErrorMap = {};

export const { useMutationHook: useJoinConferenceMutation } = createMutation<
  MutationPayload,
  MutationData,
  MutationErrorMap
>({
  callback: createWebsocketMutationCallback({
    outgoingMessageType: JOIN_CONFERENCE,
  }),
});
