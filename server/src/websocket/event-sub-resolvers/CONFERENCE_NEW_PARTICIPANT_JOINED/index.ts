import { z } from 'zod';
import createEventSubResolver from '../../createEventSubResolver';

export default createEventSubResolver({
  eventName: 'CONFERENCE_NEW_PARTICIPANT_JOINED',
  eventParamsSchema: z.object({
    conferenceId: z.string(),
  }),
  subscribe: {
    channelName: 'CONFERENCE_NEW_PARTICIPANT_JOINED',
    filter() {
      return true;
    },
  },
  middleware: [],
  format({ payload }) {
    return payload;
  },
});
