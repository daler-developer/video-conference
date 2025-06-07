import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import pubsub from '../../pubsub';

export default createResolverByMessageType({
  messageType: 'SEND_MEDIA_FRAME',
  middleware: [],
  execute({ ws, msg, ctx, binary }) {},
});
