import createResolverByMessageType from '../../createResolverByMessageType';
import { StartConferenceCommandUseCase, createApplicationContext } from '@/application';
import { StartConferenceDto } from '@/domain';
import { authRequired, AuthContextProps } from '../../middleware/authRequired';

const START_CONFERENCE = 'START_CONFERENCE';

type IncomingPayload = {
  name: string;
};

type OutgoingPayload = {
  conferenceId: string;
};

type Context = AuthContextProps;

export default createResolverByMessageType<IncomingPayload, OutgoingPayload, Context>(START_CONFERENCE, {
  validator() {
    return true;
  },
  middleware: [],
  async execute({ ctx, payload }) {
    const startConferenceDto = new StartConferenceDto(payload.name);

    const result = await ctx.useCaseRunner.run(StartConferenceCommandUseCase, startConferenceDto);

    return result;
  },
});
