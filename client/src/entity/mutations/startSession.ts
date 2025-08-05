import createMutation from "../utils/createMutation.ts";
import {
  createMutationAdapterFromWebsocket,
  type MutationAdapter,
} from "@/entity/adapters/createMutationAdapterForWebsocket.ts";
import type { BaseIncomingMessage, BaseOutgoingMessage } from "@/websocket";
// import { getUsersQuery } from "../queries/getUsers.ts";

const OUTGOING_MESSAGE_TYPE = "START_SESSION";
const INCOMING_MESSAGE_TYPE = "START_SESSION_RESULT";

type OutgoingMessage = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    fullName: string;
  }
>;

type IncomingResponseMessage = BaseIncomingMessage<
  typeof INCOMING_MESSAGE_TYPE,
  {
    accessToken: string;
  }
>;

type ErrorDetailsMap = {
  VALIDATION: {
    foo: "bar";
  };
  SECOND: {
    age: number;
    name: string;
  };
};

let counter = 3;

export const { useMutationHook: useStartSession, Error: StartSessionError } =
  createMutation(
    createMutationAdapterFromWebsocket<
      OutgoingMessage,
      IncomingResponseMessage,
      ErrorDetailsMap
    >({
      incomingMessageType: INCOMING_MESSAGE_TYPE,
      outgoingMessageType: OUTGOING_MESSAGE_TYPE,
    }),
    {
      update({ entityManager }) {
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
        const entity = entityManager.getRepository("users").getOne(2);

        entity!.updateData({
          name: "Aziz Test",
        });
      },
    },
  );

export const { callback: startMutation, Error: asdf } =
  createMutationAdapterFromWebsocket<
    OutgoingMessage,
    IncomingResponseMessage,
    ErrorDetailsMap
  >({
    incomingMessageType: INCOMING_MESSAGE_TYPE,
    outgoingMessageType: OUTGOING_MESSAGE_TYPE,
  });

//
// const e = new StartSessionError();
//
// if (e.errorIs("VALIDATION")) {
// }
