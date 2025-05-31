import { parse } from 'url';
import createMiddleware from './createMiddleware';

export default createMiddleware(({ ctx, request }) => {
  const { query } = parse(request.url!, true);

  const token = query.token;

  ctx.userId = token;
});
