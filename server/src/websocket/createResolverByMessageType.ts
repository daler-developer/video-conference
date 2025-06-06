import { WebSocket } from 'ws';
import { ZodObject } from 'zod';
import { MESSAGE_TYPE } from './types';

type BaseMessage<TPayload extends { [key: string]: unknown }> = {
  type: string;
  payload: TPayload;
};

type Options<TPayload extends { [key: string]: unknown }> = {
  messageType: string;
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
