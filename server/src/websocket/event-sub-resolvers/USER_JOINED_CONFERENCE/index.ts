import { z } from 'zod';
import createEventSubResolver, { BaseEventSubDataOutgoingMessage } from '../../createEventSubResolver';
import { GetUserQueryUseCase, useCaseManager } from '@/application';

const CHANNEL_NAME = 'USER_JOINED_CONFERENCE';
const EVENT_NAME = 'USER_JOINED_CONFERENCE';

type EventSubDataOutgoingMessage = BaseEventSubDataOutgoingMessage<
  typeof EVENT_NAME,
  {
    conferenceId: string;
  },
  {
    conferenceId: string;
    userId: number;
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
  async format({ payload, ctx }) {
    const user = await ctx.useCaseRunner.run(GetUserQueryUseCase, { id: payload.userId });
    return {
      ...payload,
      user,
    };
  },
});
