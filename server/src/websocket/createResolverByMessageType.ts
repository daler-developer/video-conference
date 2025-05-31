import { WebSocket } from 'ws';
import { ZodObject } from 'zod';
import { MESSAGE_TYPE } from './types';

type Options = {
  messageType: MESSAGE_TYPE;
  middleware: any[];
  execute: (options: { ctx: any; msg: any; ws: WebSocket }) => void;
  validator?: any;
};

const createResolverByMessageType = (options: Options) => {
  return options;
};

export default createResolverByMessageType;
