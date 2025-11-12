import createResolverByMessageType from '../../createResolverByMessageType';
import { StartConferenceCommandUseCase, createApplicationContext } from '@/application';
import { CreateConferenceDto, CreateUserDto } from '@/domain';
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
  middleware: [authRequired],
  async execute({ ctx, payload }) {
    const startConferenceDto = new CreateConferenceDto(payload.name);

    const result = await ctx.useCaseManager.run(
      StartConferenceCommandUseCase,
      startConferenceDto,
      createApplicationContext({ currentUserId: ctx.userId })
    );

    return result;
  },
});
