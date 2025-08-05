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
    page: number;
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

export const { hook: useGetUsersQuery } = createQuery(
  createEventSubAdapterForWebsocket<OutgoingMessage, IncomingMessage>({
    name: GET_USERS,
    outgoingMessageType: GET_USERS,
    createPayload({ params, pageParam }) {
      return {
        limit: 234,
        search: "234",
      };
    },
  }),
  schema,
);

// export const { hook: useGetUsersQuery } = getUsersQuery;

type Params = {
  limit: number;
  search: string;
};

type PageParam = {
  page: number;
};

type OutgoingMessagePayload = {
  limit: number;
  search: string;
  page: number;
};

type IncomingMessagePayload = {
  list: UserEntity[];
};

const adapter = createEventSubAdapterForWebsocket<
  OutgoingMessagePayload,
  IncomingMessagePayload,
  Params,
  PageParam,
  typeof GET_USERS
>({
  name: GET_USERS,
  outgoingMessageType: GET_USERS,
  createPayload({ params, pageParam }) {
    return {
      limit: params.limit,
      search: params.search,
      page: pageParam.page,
    };
  },
});

adapter
  .callback({
    params: {
      limit: 123,
      search: "sdf",
    },
    pageParam: {
      page: 1,
    },
  })
  .then((result) => {
    console.log(result.data.list[0].age);
    // result.data.list.forEach((a) => {
    //   a.age;
    // });
    // result.data.list.forEach((item) => {
    //   item;
    // });
  });
