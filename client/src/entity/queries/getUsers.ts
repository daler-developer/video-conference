import { createQuery } from "../utils/createQuery";
import { EntitySchema as UserEntitySchema } from "../query-cache/entity-manager/entities/user.ts";
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

export const {
  useQuery: useGetUsersQuery,
  useLazyQuery: useGetUsersLazyQuery,
  Error: GetUsersQueryError,
} = createQuery<QueryParams, QueryData, QueryErrorMap>({
  name: GET_USERS,
  callback: createWebsocketQueryCallback({
    outgoingMessageType: GET_USERS,
    createPayload({ params }) {
      return {
        limit: params.limit,
        search: params.search,
        page: 1,
      };
    },
  }),
  schema: {
    list: [UserEntitySchema],
  },
});
