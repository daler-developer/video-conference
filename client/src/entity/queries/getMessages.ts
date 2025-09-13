import { createQuery } from "../utils/createQuery";
import { createWebsocketQueryCallback } from "../utils/createWebsocketQueryCallback.ts";
import {
  type Entity as MessageEntity,
  EntitySchema as MessageEntitySchema,
} from "@/entity/query-cache/entity-manager/entities/message.ts";

const GET_MESSAGES = "GET_MESSAGES";

type QueryParams = {
  limit: number;
};

type QueryData = {
  list: MessageEntity[];
};

type QueryErrorMap = {};

export const getMessagesQuery = createQuery<
  undefined,
  QueryData,
  QueryErrorMap
>({
  name: GET_MESSAGES,
  callback: createWebsocketQueryCallback({
    outgoingMessageType: GET_MESSAGES,
  }),
  schema: {
    list: [MessageEntitySchema],
  },
});

export const {
  useQuery: useGetMessagesQuery,
  useLazyQuery: useGetMessagesLazyQuery,
  Error: GetMessagesQueryError,
} = getMessagesQuery;
