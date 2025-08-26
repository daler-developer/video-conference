import createMutation from "../utils/createMutation.ts";
import { createWebsocketMutationCallback } from "../utils/createWebsocketMutationCallback.ts";

const NEW_MEDIA_FRAME = "NEW_MEDIA_FRAME";

type MutationPayload = {
  data: ArrayBuffer;
};

type MutationData = {
  message: string;
};

type MutationErrorMap = {
  VALIDATION: {
    foo: "bar";
  };
  SECOND: {
    age: number;
    name: string;
  };
};

export const {
  useMutationHook: useSendMediaFrameMutation,
  Error: SendMediaFrameMutationError,
} = createMutation<MutationPayload, MutationData, MutationErrorMap>({
  callback: createWebsocketMutationCallback({
    outgoingMessageType: NEW_MEDIA_FRAME,
  }),
  update({ entityManager }) {},
});
