import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
  createOutgoingMessageCreator,
  websocketClient,
} from "@/websocket";

export type QueryAdapter<
  TQueryName extends string = string,
  TParams extends Record<string, any> = Record<string, any>,
  TData extends Record<string, any> = Record<string, any>,
> = {
  name: TQueryName;
  callback: (options: { params: TParams }) => Promise<{ data: TData }>;
};

type Options<TQueryName extends string = string> = {
  name: TQueryName;
  outgoingMessageType: string;
};

export const createEventSubAdapterForWebsocket = <
  TOutgoingMessage extends BaseOutgoingMessage<any, any> = BaseOutgoingMessage<
    any,
    any
  >,
  TIncomingMessage extends BaseIncomingMessage<any, any> = BaseIncomingMessage<
    any,
    any
  >,
>({
  name,
  outgoingMessageType,
}: Options<TOutgoingMessage["type"]>): QueryAdapter<
  TOutgoingMessage["type"],
  TOutgoingMessage["payload"],
  TIncomingMessage["payload"]
> => {
  return {
    name,
    async callback({ params }) {
      const createOutgoingMessage = createOutgoingMessageCreator({
        type: outgoingMessageType,
      });

      const incomingResponseMessage = await websocketClient.sendMessage(
        createOutgoingMessage({
          payload: params,
        }),
      );

      return {
        data: incomingResponseMessage.payload,
      };
    },
  };
};
