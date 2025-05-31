import { IncomingMessage } from 'node:http';

export type MiddlewareOptions = {
  ctx: any;
  request: IncomingMessage;
  message: any;
};

const createMiddleware = (callback: (options: MiddlewareOptions) => void) => {
  return callback;
};

export type Middleware = ReturnType<typeof createMiddleware>;

export default createMiddleware;
