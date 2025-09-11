import createMutation from "../utils/createMutation.ts";
import { createWebsocketMutationCallback } from "../utils/createWebsocketMutationCallback.ts";
import { getMessagesQuery } from "@/entity/queries/getMessages.ts";

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
      // getMessagesQuery.updateData({}, (data) => {
      //   return {
      //     ...data,
      //     list: [
      //       ...data.list,
      //       {
      //         id: 3,
      //         text: "Third message",
      //         likesCount: 33,
      //         sender: {
      //           id: 3,
      //           name: "Nazir",
      //           age: 22,
      //         },
      //       },
      //     ],
      //   };
      // });

      const message1 = entityManager.getEntity("message", 1);
      // const message2 = entityManager.getEntity("message", 2);

      // console.log("message1", message1);
      // console.log(message2);

      // entityManager.updateEntity(
      //   "message",
      //   entityManager.identifyEntity(message1),
      //   (message) => {
      //     return {
      //       ...message,
      //       likesCount: message.likesCount + 1,
      //       sender: {
      //         ...message.sender,
      //         name: "Daler changed",
      //         age: message.sender.age + 2,
      //       },
      //     };
      //   },
      // );

      // console.log("message1", entityManager.identifyEntity(message1));
      // console.log("message2", entityManager.identifyEntity(message2));

      // entityManager.updateEntity("message", 1, (old) => {
      //   return {
      //     ...old,
      //     likesCount: 100,
      //     sender: {
      //       id: 1,
      //       name: "Aziz changed",
      //       age: 222,
      //     },
      //   };
      // });
      // entityManager.updateEntity("user", 1, (old) => {
      //   return {
      //     ...old,
      //     name: "Daler changed",
      //     age: 20,
      //   };
      // });
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
