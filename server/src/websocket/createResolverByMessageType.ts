import { WebSocket } from 'ws';

type BaseMessage<TPayload extends { [key: string]: unknown }> = {
  type: string;
  payload: TPayload;
};

type Options<TPayload extends { [key: string]: unknown }> = {
  type: string;
  middleware: any[];
  execute: (options: {
    ctx: any;
    msg: BaseMessage<TPayload>;
    ws: WebSocket;
  }) => void;
  validator?: (options: { msg: BaseMessage<TPayload> }) => boolean;
  init?: () => void;
};

const createResolverByMessageType = <
  TPayload extends { [key: string]: unknown },
>(
  options: Options<TPayload>
) => {
  return options;
};

export default createResolverByMessageType;
