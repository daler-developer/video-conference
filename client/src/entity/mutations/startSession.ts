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
    update({ entityManager }) {},
  });

// export const { callback: startMutation } =
//   createMutationAdapterFromWebsocket<
//     OutgoingMessage,
//     IncomingResponseMessage,
//     any
//   >({
//     incomingMessageType: INCOMING_MESSAGE_TYPE,
//     outgoingMessageType: OUTGOING_MESSAGE_TYPE,
//   });

//
// const e = new StartSessionError();
//
// if (e.errorIs("VALIDATION")) {
// }

// entityManager.getRepository("users").updateOne({
//   id: 2,
//   changes: {
//     name: "Aziz test",
//   },
// });
// entityManager.getRepository("users").updateMany([
//   {
//     id: 1,
//     changes: {
//       name: "Aziz test",
//     },
//   },
//   {
//     id: 2,
//     changes: {
//       name: "Aziz test 2",
//     },
//   },
// ]);
// getUsersQuery.updateData({ limit: 23, search: "adf" }, (prev) => {
//   return {
//     ...prev,
//     list: [
//       ...prev.list,
//       {
//         id: counter++,
//         name: "a1",
//         age: 20,
//       },
//     ],
//   };
// });
// const entity = entityManager.getRepository("users").getOne(2);
//
// entity!.updateData({
//   name: "Aziz Test",
// });
