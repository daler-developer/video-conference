import { createEventSubAdapterForWebsocket } from "../adapters/createQueryAdapterForWebsocket";
import { createQuery } from "../utils/createQuery";
import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
} from "@/websocket";
import { UserEntitySchema } from "../query-cache/entity-manager/UserRepository";
import { type UserEntity } from "../types";

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
    list: UserEntity[];
  }
>;

const schema = {
  list: [UserEntitySchema],
};

export const getUsersQuery = createQuery(
  createEventSubAdapterForWebsocket<OutgoingMessage, IncomingMessage>({
    name: GET_USERS,
    outgoingMessageType: GET_USERS,
  }),
  schema,
);

export const { hook: useGetUsersQuery } = getUsersQuery;

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
