import { z } from 'zod';
import createEventSubResolver, { BaseEventSubDataOutgoingMessage } from '../../createEventSubResolver';

const CHANNEL_NAME = 'CONFERENCE_NEW_PARTICIPANT_JOINED';
const EVENT_NAME = 'CONFERENCE_NEW_PARTICIPANT_JOINED';

type EventSubDataOutgoingMessage = BaseEventSubDataOutgoingMessage<
  typeof EVENT_NAME,
  {
    conferenceId: string;
  },
  {
    foo: 'bar';
  }
>;

export default createEventSubResolver<typeof EVENT_NAME, EventSubDataOutgoingMessage>(EVENT_NAME, {
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
      foo: 'bar',
    };
  },
});
