import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import pubsub from '../../pubsub';

export default createResolverByMessageType({
  type: 'SEND_MEDIA_FRAME',
  middleware: [],
  execute({ ws, msg, ctx, binary }) {
    pubsub.publish('NEW_MEDIA_FRAME', {
      data: binary!,
      conferenceId: 'hello',
    });
  },
});
