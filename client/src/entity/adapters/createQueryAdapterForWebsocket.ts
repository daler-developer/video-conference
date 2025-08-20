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
import { type QueryObserverConfig } from "../query-cache/QueryObserver.ts";

export type QueryAdapter<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
> = Pick<
  QueryObserverConfig<TQueryParams, TQueryData, TQueryPageParam, any, any>,
  "callback"
>;

type Options<
  TOutgoingMessage extends BaseOutgoingMessage,
  TQueryParams extends BaseQueryParams,
  TQueryPageParam extends BaseQueryPageParam,
> = {
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
  outgoingMessageType,
  createPayload,
}: Options<TOutgoingMessage, TQueryParams, TQueryPageParam>): QueryAdapter<
  TQueryParams,
  IncomingMessageExtractPayload<TIncomingMessage>,
  TQueryPageParam
> => {
  return {
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
