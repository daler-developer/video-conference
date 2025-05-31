import { Middleware } from './createMiddleware';

const processMiddleware = (list: Middleware[], ctx: any, message: any) => {
  for (const middleware of list) {
    middleware({ ctx, message });
  }
};

export default processMiddleware;
