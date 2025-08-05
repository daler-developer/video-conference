import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
  type BaseIncomingMessagePayload,
  createOutgoingMessageCreator,
  websocketClient,
} from "@/websocket";

export type QueryAdapter<
  TQueryName extends string = string,
  TParams extends Record<string, any> = Record<string, any>,
  TData extends TIncomingMessagePayload = TIncomingMessagePayload,
  TPageParam extends Record<string, any> = Record<string, any>,
> = {
  name: TQueryName;
  callback: (options: {
    params: TParams;
    pageParam?: TPageParam;
  }) => Promise<{ data: TData }>;
};

type Options<
  TQueryName extends string,
  TParams extends Record<string, any>,
  TPageParam extends Record<string, any>,
  TPayload extends Record<string, any>,
> = {
  name: TQueryName;
  outgoingMessageType: string;
  createPayload: (options: {
    params: TParams;
    pageParam: TPageParam;
  }) => TPayload;
};

export const createEventSubAdapterForWebsocket = <
  TOutgoingMessagePayload extends Record<string, any>,
  TIncomingMessagePayload extends BaseIncomingMessagePayload,
  TParams extends Record<string, any>,
  TPageParam extends Record<string, any>,
  TOutgoingMessageType extends string,
>({
  name,
  outgoingMessageType,
  createPayload,
}: Options<
  TOutgoingMessageType,
  TParams,
  TPageParam,
  TOutgoingMessagePayload
>): QueryAdapter<
  TOutgoingMessageType,
  TParams,
  TIncomingMessagePayload,
  TPageParam
> => {
  return {
    name,
    async callback({ params, pageParam }) {
      const createOutgoingMessage = createOutgoingMessageCreator({
        type: outgoingMessageType,
      });

      const payload = createPayload({ params, pageParam: pageParam! });

      const incomingResponseMessage = await websocketClient.sendMessage(
        createOutgoingMessage({
          payload,
        }),
      );

      return {
        data: incomingResponseMessage.payload,
      };
    },
  };
};
