import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
  createOutgoingMessageCreator,
  websocketClient,
  type OutgoingMessageExtractPayload,
  type IncomingMessageExtractPayload,
  type OutgoingMessageExtractType,
} from "@/websocket";
import {
  type BaseQueryData,
  type BaseQueryParams,
  type BaseQueryPageParam,
} from "../query-cache/Query";
import { type QueryCallback } from "../query-cache/Query.ts";
import { type QueryObserverConfig } from "../query-cache/QueryObserver.ts";

type Options<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
> = {
  outgoingMessageType: string;
  createPayload: (options: {
    params: TQueryParams;
    pageParam: TQueryPageParam;
  }) => unknown;
};

export const createWebsocketQueryCallback = <
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
>({
  outgoingMessageType,
  createPayload,
}: Options<TQueryParams, TQueryData, TQueryPageParam>): QueryCallback<
  TQueryParams,
  TQueryData,
  TQueryPageParam
> => {
  return async ({ params, pageParam }) => {
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
  };
};
