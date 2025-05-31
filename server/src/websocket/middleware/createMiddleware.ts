type Next = (error?: Error) => void;

type Options = {
  ctx: any;
  message: any;
};

const createMiddleware = (callback: (options: Options) => void) => {
  return callback;
};

export type Middleware = ReturnType<typeof createMiddleware>;

export default createMiddleware;
