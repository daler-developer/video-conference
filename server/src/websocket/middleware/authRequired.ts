import { parse } from 'url';
import jwt from 'jsonwebtoken';
import createMiddleware from './createMiddleware';

export type AuthContextProps = {
  userId: number;
};

const SECRET_KEY = 'test_secret';

export const authRequired = createMiddleware(({ ctx, request }) => {
  if (!ctx.userId) {
    throw new Error('auth required');
  }
  // const { query } = parse(request.url!, true);
  //
  // const accessToken = query.accessToken;
  //
  // if (!accessToken) {
  //   throw new Error('auth required');
  // }
  //
  // try {
  //   const decoded = jwt.verify(accessToken as string, SECRET_KEY) as any;
  //
  //   ctx.userId = decoded.userId;
  // } catch (e) {
  //   throw new Error('auth required');
  // }
});
