import { createInfiniteQuery } from "../utils/createInfiniteQuery.ts";
import { EntitySchema as UserEntitySchema } from "../query-cache/entity-manager/entities/user";
import { type UserEntity } from "../types";
import { createWebsocketQueryCallback } from "../utils/createWebsocketQueryCallback.ts";

const GET_USERS = "GET_USERS";

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

type QueryErrorMap = {
  foo: {
    foo1: string;
    foo2: string;
  };
  age: {
    age1: string;
    age2: string;
  };
  VALIDATION: {
    age: number;
    inner: {
      name: boolean;
    };
  };
};

export const getUsersInfiniteQuery = createInfiniteQuery<
  QueryParams,
  QueryData,
  QueryErrorMap,
  QueryPageParam
>({
  name: GET_USERS,
  callback: createWebsocketQueryCallback({
    outgoingMessageType: GET_USERS,
    createPayload({ pageParam, params }) {
      return {
        limit: params.limit,
        search: params.search,
        page: pageParam.page,
      };
    },
  }),
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
  getPageParamsFromData(data) {
    return new Array(Math.ceil(data.list.length / 2))
      .fill(null)
      .map((_, i) => ({
        page: i + 1,
      }));
  },
});

export const {
  useQuery: useGetUsersInfiniteQuery,
  useLazyQuery: useGetUsersInfiniteLazyQuery,
} = getUsersInfiniteQuery;
