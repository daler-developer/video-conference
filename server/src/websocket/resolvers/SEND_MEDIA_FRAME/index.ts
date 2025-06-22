import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import pubsub from '../../pubsub';

export default createResolverByMessageType({
  type: 'SEND_MEDIA_FRAME',
  middleware: [],
  execute({ ws, msg, ctx }) {
    pubsub.publish('NEW_MEDIA_FRAME', {
      data: msg.payload.data!,
    });
  },
});
