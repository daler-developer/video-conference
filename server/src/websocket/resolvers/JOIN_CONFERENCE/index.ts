import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import pubsub from '../../pubsub';

export default createResolverByMessageType({
  type: 'JOIN_CONFERENCE',
  // validator: z.object({
  //   params: z.object({
  //     fullName: z.string(),
  //   }),
  // }),
  middleware: [],
  async execute({ client, message, ctx }) {
    return {
      status: 'success',
    };
  },
});
