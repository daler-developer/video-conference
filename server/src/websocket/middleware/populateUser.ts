import { parse } from 'url';
import jwt from 'jsonwebtoken';
import createMiddleware from './createMiddleware';

const SECRET_KEY = 'test_secret';

export const populateUser = createMiddleware(({ ctx, request }) => {
  const { query } = parse(request.url!, true);

  const accessToken = query.accessToken;

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken as string, SECRET_KEY) as any;

      ctx.userId = decoded.userId;
    } catch (e) {
      console.log('cannot parse user');
    }
  }
});
