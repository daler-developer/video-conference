import {
  type BaseOutgoingMessagePayload,
  createOutgoingMessageCreator,
  websocketClient,
  WebsocketError,
} from "@/websocket";
import {
  type BaseQueryData,
  type BaseQueryParams,
  type BaseQueryPageParam,
} from "../query-cache/Query";
import { type QueryCallback } from "../query-cache/Query.ts";
import { QueryError } from "@/entity/QueryError.ts";

type Options<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
> = {
  outgoingMessageType: string;
  createPayload?: (options: {
    params: TQueryParams;
    pageParam: TQueryPageParam;
  }) => BaseOutgoingMessagePayload;
};

export const createWebsocketQueryCallback = <
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
>({
  outgoingMessageType,
  createPayload = () => ({}),
}: Options<TQueryParams, TQueryData, TQueryPageParam>): QueryCallback<
  TQueryParams,
  TQueryData,
  TQueryPageParam
> => {
  return async ({ params, pageParam }) => {
    try {
      const payload = createPayload({ params, pageParam: pageParam! });

      const createOutgoingMessage = createOutgoingMessageCreator({
        type: outgoingMessageType,
      });

      const outgoingMessage = createOutgoingMessage({
        payload,
      });

      const incomingResponseMessage =
        await websocketClient.sendMessage(outgoingMessage);

      return incomingResponseMessage.payload as TQueryData;
    } catch (e) {
      if (e instanceof WebsocketError) {
        throw new QueryError(
          e.incomingErrorMessage.payload.message,
          e.incomingErrorMessage.payload.errorType,
          e.incomingErrorMessage.payload.details,
        );
      } else {
        alert("something is wrong in createWebsocketQueryCallback");
        throw e;
      }
    }
  };
};
