import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';

export default createResolverByMessageType({
  type: 'START_SESSION',
  // validator: z.object({
  //   params: z.object({
  //     fullName: z.string(),
  //   }),
  // }),
  middleware: [],
  execute({ ws, msg, ctx }) {},
});
