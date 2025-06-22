import { WebSocket } from 'ws';
import WebSocketWrapper from './WebSocketWrapper';

type BaseMessage<TPayload extends { [key: string]: unknown }> = {
  type: string;
  payload: TPayload;
};

type Options<TPayload extends { [key: string]: unknown }> = {
  type: string;
  middleware: any[];
  execute: (options: {
    ctx: any;
    message: BaseMessage<TPayload>;
    client: WebSocketWrapper;
  }) => void;
  validator?: (options: { message: BaseMessage<TPayload> }) => boolean;
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
