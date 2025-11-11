import createResolverByMessageType from '../../createResolverByMessageType';
import { StartConferenceCommandUseCase, StartSessionCommandUseCase } from '@/application';
import { CreateConferenceDto, CreateUserDto } from '@/domain';

const START_CONFERENCE = 'START_CONFERENCE';

type IncomingPayload = {
  name: string;
};

type OutgoingPayload = {
  conferenceId: string;
};

export default createResolverByMessageType<IncomingPayload, OutgoingPayload>(START_CONFERENCE, {
  validator() {
    return true;
  },
  middleware: [],
  async execute({ ctx, payload }) {
    const startConferenceDto = new CreateConferenceDto(payload.name);

    const result = await ctx.useCaseManager.run(StartConferenceCommandUseCase, startConferenceDto);

    return result;
  },
});
