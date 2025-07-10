import { z } from 'zod';
import createEventSubResolver, { BaseEventSubDataOutgoingMessage } from '../../createEventSubResolver';

const CHANNEL_NAME = 'NEW_MEDIA_FRAME';
const EVENT_NAME = 'NEW_MEDIA_FRAME';

type EventSubDataOutgoingMessage = BaseEventSubDataOutgoingMessage<
  typeof EVENT_NAME,
  {
    conferenceId: string;
  },
  {
    data: Buffer;
  }
>;

export default createEventSubResolver<typeof CHANNEL_NAME, EventSubDataOutgoingMessage>(EVENT_NAME, {
  eventParamsSchema: z.object({
    conferenceId: z.string(),
  }),
  subscribe: {
    channelName: CHANNEL_NAME,
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
