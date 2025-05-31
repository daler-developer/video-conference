import createMiddleware from './createMiddleware';

export default createMiddleware(({ ctx }) => {
  ctx.userId = 1234;
});
