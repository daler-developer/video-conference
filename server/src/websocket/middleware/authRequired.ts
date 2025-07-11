import { parse } from 'url';
import createMiddleware from './createMiddleware';

export type AuthContextProps = {
  userId: string;
};

export const authRequired = createMiddleware(({ ctx, request }) => {
  const { query } = parse(request.url!, true);

  const token = query.token;

  ctx.userId = token;
});
