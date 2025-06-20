import { z } from 'zod';
import createEventSubResolver from '../../createEventSubResolver';

export default createEventSubResolver({
  eventParamsSchema: z.object({
    conferenceId: z.string(),
  }),
  eventName: 'CONFERENCE_NEW_PARTICIPANT_JOINED',
  channelName: 'CONFERENCE_NEW_PARTICIPANT_JOINED',
  middleware: [],
  activate(payload, params) {
    return true;
  },
  format(payload) {
    return payload;
  },
});
