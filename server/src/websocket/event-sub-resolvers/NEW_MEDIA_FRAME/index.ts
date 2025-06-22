import { z } from 'zod';
import createEventSubResolver from '../../createEventSubResolver';

export default createEventSubResolver({
  eventParamsSchema: z.object({
    conferenceId: z.string(),
  }),
  eventName: 'NEW_MEDIA_FRAME',
  channelName: 'NEW_MEDIA_FRAME',
  middleware: [],
  activate(payload, params) {
    return true;
  },
  format(payload) {
    return {
      type: 'EVENT_SUB_RESULT',
      payload: {
        data: payload.data,
      },
    };
  },
});
