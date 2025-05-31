import { Middleware, MiddlewareOptions } from './createMiddleware';

const processMiddleware = (list: Middleware[], options: MiddlewareOptions) => {
  for (const middleware of list) {
    middleware(options);
  }
};

export default processMiddleware;
