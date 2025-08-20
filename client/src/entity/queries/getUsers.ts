import { createEventSubAdapterForWebsocket } from "../adapters/createQueryAdapterForWebsocket";
import { createQuery } from "../utils/createQuery";
import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
} from "@/websocket";
import { UserEntitySchema } from "../query-cache/entity-manager/UserRepository";
import { type UserEntity } from "../types";
import { createWebsocketQueryCallback } from "../utils/createWebsocketQueryCallback.ts";

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

type QueryParams = {
  limit: number;
  search: string;
};

type QueryData = {
  list: UserEntity[];
};

type QueryPageParam = {
  page: number;
};

export const {
  useQuery: useGetUsersQuery,
  useLazyQuery: useGetUsersLazyQuery,
} = createQuery<QueryParams, QueryData, QueryPageParam, true>({
  name: GET_USERS,
  callback: createWebsocketQueryCallback<
    QueryParams,
    QueryData,
    QueryPageParam
  >({
    outgoingMessageType: GET_USERS,
    createPayload({ params, pageParam }) {
      return {
        limit: params.limit,
        search: params.search,
        page: pageParam.page,
      };
    },
  }),
  isInfinite: true,
  initialPageParam: {
    page: 1,
  },
  getNextPageParam: ({ lastPageParam }) => {
    return {
      ...lastPageParam,
      page: lastPageParam.page + 1,
    };
  },
  merge: ({ existingData, incomingData }) => {
    return {
      ...existingData,
      list: [...existingData.list, ...incomingData.list],
    };
  },
  schema: {
    list: [UserEntitySchema],
  },
});

// const adapter = createEventSubAdapterForWebsocket<Params, PageParam>({
//   name: GET_USERS,
//   outgoingMessageCreator: createOutgoingMessage,
//   createPayload({ params, pageParam }) {
//     return {
//       limit: params.limit,
//       search: params.search,
//       page: pageParam.page,
//     };
//   },
// });

// adapter
//   .callback({
//     params: {
//       limit: 123,
//       search: "sdf",
//     },
//     pageParam: {
//       page: 1,
//     },
//   })
//   .then((result) => {
//     result.data.list.forEach((a) => {});
//   });

// const adapter = createEventSubAdapterForWebsocket<
//   OutgoingMessage,
//   IncomingMessage,
//   Params,
//   PageParam,
//   true
// >({
//   name: GET_USERS,
//   outgoingMessageType: GET_USERS,
//   createPayload: ({ params, pageParam }) => {
//     return {
//       limit: params.limit,
//       search: params.search,
//       page: pageParam.page,
//     };
//   },
//   isInfinite: true,
//   initialPageParam: {
//     page: 1,
//   },
//   getNextPageParam: ({ lastPageParam }) => {
//     return {
//       ...lastPageParam,
//       page: lastPageParam.page + 1,
//     };
//   },
//   merge: ({ existingData, incomingData }) => {
//     return {
//       ...existingData,
//       list: [...existingData.list, ...incomingData.list],
//     };
//   },
//   schema: {
//     list: [UserEntitySchema],
//   },
// });
