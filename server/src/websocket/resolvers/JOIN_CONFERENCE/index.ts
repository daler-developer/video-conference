import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import pubsub from '../../pubsub';

export default createResolverByMessageType({
  messageType: 'JOIN_CONFERENCE',
  // validator: z.object({
  //   params: z.object({
  //     fullName: z.string(),
  //   }),
  // }),
  middleware: [],
  execute({ ws, msg, ctx }) {
    pubsub.publish('CONFERENCE_NEW_PARTICIPANT_JOINED', {
      conferenceId: 'confid',
      participantId: 'partid',
    });
  },
});
