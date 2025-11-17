import { z } from 'zod';
import createEventSubResolver, { BaseEventSubDataOutgoingMessage } from '../../createEventSubResolver';
import { GetUserQueryUseCase } from '@/application';
import { User } from '@/domain';

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
    user: User;
  }
>;

export default createEventSubResolver<typeof CHANNEL_NAME, EventSubDataOutgoingMessage>(EVENT_NAME, {
  eventParamsSchema: z.object({
    conferenceId: z.string(),
  }),
  subscribe: {
    channelName: CHANNEL_NAME,
    filter({ payload, params }) {
      return payload.conferenceId === params.conferenceId;
    },
  },
  middleware: [],
  async format({ payload, ctx, params }) {
    const user = await ctx.useCaseRunner.run(GetUserQueryUseCase, { id: payload.userId });
    return {
      ...payload,
      user: user!,
    };
  },
});
