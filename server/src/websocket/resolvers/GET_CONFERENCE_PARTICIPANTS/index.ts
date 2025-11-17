import createResolverByMessageType from '../../createResolverByMessageType';
import { GetConferenceParticipantsQueryUseCase, ConferenceParticipantsQueryResult } from '@/application';

const GET_CONFERENCE_PARTICIPANTS = 'GET_CONFERENCE_PARTICIPANTS';
const OUTGOING_MESSAGE_TYPE = 'GET_CONFERENCE_PARTICIPANTS_RESULT';

type IncomingPayload = {
  conferenceId: string;
};

type OutgoingPayload = ConferenceParticipantsQueryResult;

export default createResolverByMessageType<IncomingPayload, OutgoingPayload>(GET_CONFERENCE_PARTICIPANTS, {
  validator({ payload }) {
    return true;
    // return message.payload.page < 5;
  },
  middleware: [],
  async execute({ payload, ctx }) {
    return await ctx.useCaseRunner.run(GetConferenceParticipantsQueryUseCase, {
      conferenceId: payload.conferenceId,
    });
  },
});
