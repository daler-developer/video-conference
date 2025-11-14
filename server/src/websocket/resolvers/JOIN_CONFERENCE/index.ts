import createResolverByMessageType from '../../createResolverByMessageType';
import { createApplicationContext, JoinConferenceCommandUseCase } from '@/application';
import { authRequired, AuthContextProps } from '../../middleware/authRequired';

const JOIN_CONFERENCE = 'JOIN_CONFERENCE';

type IncomingPayload = {
  conferenceId: string;
};

type OutgoingPayload = {
  message: string;
};

type Context = AuthContextProps;

export default createResolverByMessageType<IncomingPayload, OutgoingPayload, Context>(JOIN_CONFERENCE, {
  validator() {
    return true;
  },
  middleware: [],
  async execute({ ctx, payload }) {
    await ctx.useCaseRunner.run(JoinConferenceCommandUseCase, {
      conferenceId: payload.conferenceId,
    });

    return {
      message: 'Successfully joined the conference',
    };
  },
});
