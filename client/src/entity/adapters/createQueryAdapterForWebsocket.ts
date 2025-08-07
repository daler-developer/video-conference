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

export const createEventSubAdapterForWebsocket = <
  TQueryName extends string,
  TOutgoingMessage extends BaseOutgoingMessage,
  TIncomingMessage extends BaseIncomingMessage<any, any>,
  TParams extends Record<string, any>,
  TPageParam extends Record<string, any>,
  TIsInfinite extends boolean,
>(
  name: TQueryName,
  outgoingMessageType: OutgoingMessageExtractType<TOutgoingMessage>,
  createPayload: (options: {
    params: TParams;
    pageParam: TPageParam;
  }) => OutgoingMessageExtractPayload<TOutgoingMessage>,
  isInfinite: TIsInfinite,
  initialPageParam: TPageParam,
  getNextPageParam: (options: {
    lastPageParam: TPageParam;
  }) => NonNullable<TPageParam>,
  merge: (options: {
    existingData: IncomingMessageExtractPayload<TIncomingMessage>;
    incomingData: IncomingMessageExtractPayload<TIncomingMessage>;
  }) => IncomingMessageExtractPayload<TIncomingMessage>,
): QueryAdapter<
  TQueryName,
  TParams,
  IncomingMessageExtractPayload<TIncomingMessage>,
  TPageParam
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

      return {
        data: incomingResponseMessage.payload as IncomingMessageExtractPayload<TIncomingMessage>,
      };
    },
  };
};
