import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
  type BaseIncomingMessagePayload,
  type BaseOutgoingMessagePayload,
  createOutgoingMessageCreator,
  websocketClient,
  type OutgoingMessageCreator,
  type OutgoingMessageExtractPayload,
  type IncomingMessageExtractPayload,
  type OutgoingMessageExtractType,
} from "@/websocket";
import {
  type BaseQueryData,
  type BaseQueryParams,
  type BaseQueryPageParam,
} from "../query-cache/Query";
import { type QueryObserverOptions } from "../query-cache/QueryObserver.ts";

export type QueryAdapter<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
> = Pick<
  QueryObserverOptions<TQueryParams, TQueryData, TQueryPageParam>,
  | "name"
  | "isInfinite"
  | "initialPageParam"
  | "getNextPageParam"
  | "callback"
  | "merge"
  | "schema"
>;

type Options<
  TOutgoingMessage extends BaseOutgoingMessage,
  TIncomingMessage extends BaseIncomingMessage,
  TQueryParams extends BaseQueryParams,
  TQueryPageParam extends BaseQueryPageParam,
> = Pick<
  QueryAdapter<
    TQueryParams,
    IncomingMessageExtractPayload<TIncomingMessage>,
    TQueryPageParam
  >,
  | "name"
  | "isInfinite"
  | "initialPageParam"
  | "getNextPageParam"
  | "merge"
  | "schema"
> & {
  outgoingMessageType: OutgoingMessageExtractType<TOutgoingMessage>;
  createPayload: (options: {
    params: TQueryParams;
    pageParam: TQueryPageParam;
  }) => OutgoingMessageExtractPayload<TOutgoingMessage>;
};

export const createEventSubAdapterForWebsocket = <
  TOutgoingMessage extends BaseOutgoingMessage,
  TIncomingMessage extends BaseIncomingMessage,
  TQueryParams extends BaseQueryParams,
  TQueryPageParam extends BaseQueryPageParam,
>({
  name,
  outgoingMessageType,
  createPayload,
  isInfinite,
  initialPageParam,
  getNextPageParam,
  merge,
  schema,
}: Options<
  TOutgoingMessage,
  TIncomingMessage,
  TQueryParams,
  TQueryPageParam
>): QueryAdapter<
  TQueryParams,
  IncomingMessageExtractPayload<TIncomingMessage>,
  TQueryPageParam
> => {
  return {
    name,
    isInfinite,
    initialPageParam,
    getNextPageParam,
    merge,
    schema,
    async callback({ params, pageParam }) {
      const payload = createPayload({ params, pageParam: pageParam! });

      const createOutgoingMessage = createOutgoingMessageCreator({
        type: outgoingMessageType,
      });

      const outgoingMessage = createOutgoingMessage({
        payload,
      });

      const incomingResponseMessage =
        await websocketClient.sendMessage(outgoingMessage);

      return incomingResponseMessage.payload as IncomingMessageExtractPayload<TIncomingMessage>;
    },
  };
};
