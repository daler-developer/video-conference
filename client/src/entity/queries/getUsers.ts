import { schema } from "normalizr";
import { createEventSubAdapterForWebsocket } from "../adapters/createQueryAdapterForWebsocket";
import { createQuery } from "../utils/createQuery";
import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
} from "@/websocket";

const GET_USERS = "GET_USERS";
const GET_USERS_RESULT = "GET_USERS_RESULT";

type OutgoingMessage = BaseOutgoingMessage<
  typeof GET_USERS,
  {
    limit: number;
    search: string;
  }
>;

type IncomingMessage = BaseIncomingMessage<
  typeof GET_USERS_RESULT,
  {
    list: Array<{ id: number; name: string; age: number }>;
  }
>;

const user = new schema.Entity("users");

export const { hook: useGetUsersQuery, updateData } = createQuery(
  createEventSubAdapterForWebsocket<OutgoingMessage, IncomingMessage>({
    name: GET_USERS,
    outgoingMessageType: GET_USERS,
  }),
  {
    list: [user],
  },
);

// const adapter = createEventSubAdapterForWebsocket<
//   OutgoingMessage,
//   IncomingMessage
// >({
//   name: GET_USERS,
//   outgoingMessageType: GET_USERS,
// });

// adapter.callback({
//   params: {
//     limit: 123,
//     search: 'sdf'
//   },
// }).then(result => {
//   result.data.list.forEach((item) => {
//     item
//   })
// })
