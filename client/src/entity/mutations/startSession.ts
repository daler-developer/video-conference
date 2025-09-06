import createMutation from "../utils/createMutation.ts";
import { createWebsocketMutationCallback } from "../utils/createWebsocketMutationCallback.ts";

const START_SESSION = "START_SESSION";

type MutationPayload = {
  fullName: string;
};

type MutationData = {
  accessToken: string;
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

export const { useMutationHook: useStartSession, Error: StartSessionError } =
  createMutation<MutationPayload, MutationData, MutationErrorMap>({
    callback: createWebsocketMutationCallback({
      outgoingMessageType: START_SESSION,
    }),
    update({ entityManager }) {
      entityManager.updateEntity("users", 1, (old) => {
        return {
          ...old,
          name: "Changed 2",
        };
      });
      // const repo = entityManager.getRepository('messages');
      //
      // repo.updateOne({
      //   id: 1,
      //   changes: {
      //     likesCount: 10
      //   },
      // });
    },
  });
