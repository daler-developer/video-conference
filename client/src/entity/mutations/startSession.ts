import createMutation from "../utils/createMutation.ts";
import { sendStartSessionMessage } from "../message-senders/sendStartSessionMessage";
import {
  createMutationAdapterFromWebsocket,
  type MutationAdapter,
} from "@/entity/adapters/createMutationAdapterForWebsocket.ts";
import type { BaseIncomingMessage, BaseOutgoingMessage } from "@/websocket";

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
        console.log("update");
        // entityManager.updateEntity('users', {
        //   id: 1,
        //   changes: {
        //
        //   }
        // })
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
