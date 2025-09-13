import { createQuery } from "../utils/createQuery";
import { createWebsocketQueryCallback } from "../utils/createWebsocketQueryCallback.ts";
import {
  type Entity as MessageEntity,
  EntitySchema as MessageEntitySchema,
} from "@/entity/query-cache/entity-manager/entities/message.ts";
import { createInfiniteQuery } from "@/entity/utils/createInfiniteQuery.ts";

const GET_MESSAGES = "GET_MESSAGES";

type QueryParams = {};

type QueryData = {
  list: MessageEntity[];
};

type QueryPageParam = {
  page: number;
};

type QueryErrorMap = {};

export const getInfiniteMessagesQuery = createInfiniteQuery<
    QueryParams,
    QueryData,
    QueryErrorMap,
    QueryPageParam
>({
  name: GET_MESSAGES,
  callback: createWebsocketQueryCallback({
    outgoingMessageType: GET_MESSAGES,
  }),
  schema: {
    list: [MessageEntitySchema],
  },
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
  getPageParamsFromData(data) {
    return new Array(Math.ceil(data.list.length / 2))
        .fill(null)
        .map((_, i) => ({
          page: i + 1,
        }));
});

export const {
  useQuery: useGetMessagesQuery,
  useLazyQuery: useGetMessagesLazyQuery,
} = getInfiniteMessagesQuery;
