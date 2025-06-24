import { z } from 'zod';
import createEventSubResolver from '../../createEventSubResolver';

export default createEventSubResolver({
  eventName: 'NEW_MEDIA_FRAME',
  eventParamsSchema: z.object({
    conferenceId: z.string(),
  }),
  subscribe: {
    channelName: 'NEW_MEDIA_FRAME',
    filter() {
      return true;
    },
  },
  middleware: [],
  format({ payload }) {
    return {
      data: payload.data,
    };
  },
});
