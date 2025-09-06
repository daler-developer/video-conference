import { createQuery } from "../utils/createQuery";
import { UserEntitySchema } from "../query-cache/entity-manager/UserRepository";
import { createWebsocketQueryCallback } from "../utils/createWebsocketQueryCallback.ts";
import {
  type MessageEntity,
  MessageEntitySchema,
} from "@/entity/query-cache/entity-manager/MessageRepository.ts";

const GET_MESSAGES = "GET_MESSAGES";

type QueryParams = {};

type QueryData = {
  list: MessageEntity[];
};

type QueryErrorMap = {};

export const {
  useQuery: useGetMessagesQuery,
  useLazyQuery: useGetMessagesLazyQuery,
  Error: GetMessagesQueryError,
} = createQuery<QueryParams, QueryData, QueryErrorMap>({
  name: GET_MESSAGES,
  callback: createWebsocketQueryCallback({
    outgoingMessageType: GET_MESSAGES,
    createPayload({ params }) {
      return params;
    },
  }),
  schema: {
    list: [MessageEntitySchema],
  },
});
