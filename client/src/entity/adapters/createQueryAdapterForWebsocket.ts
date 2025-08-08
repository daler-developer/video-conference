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
import { type QueryAdapter } from "../utils/createQuery";
import {
  type BaseQueryData,
  type BaseQueryParams,
  type BaseQueryPageParam,
} from "../query-cache/Query";

// type Options<
//   TQueryName extends string,
//   TOutgoingMessageCreator extends OutgoingMessageCreator<any, any>,
//   TParams extends Record<string, any>,
//   TPageParam extends Record<string, any>,
//   TPayload extends Record<string, any>,
// > = {
//   name: TQueryName;
//   outgoingMessageCreator: TOutgoingMessageCreator;
//   createPayload: (options: {
//     params: TParams;
//     pageParam: TPageParam;
//   }) => TPayload;
// };

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
  "name" | "isInfinite" | "initialPageParam" | "getNextPageParam" | "merge"
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
