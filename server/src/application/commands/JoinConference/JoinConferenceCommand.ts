import { inject, injectable } from 'inversify';
import { UseCase } from '../../UseCase';
import { ApplicationError } from '../../ApplicationError';
import { TYPES } from '@/types';
import { IConferenceRepo, IUserConferenceRelationManager, IUserRepo } from '@/domain';
import { ApplicationContext } from '@/application/ApplicationContext';
import { ConferenceShouldExistRule } from '@/application/commands/JoinConference/rules/ConferenceShouldExistRule';

type Request = {
  conferenceId: string;
};

type Result = {
  message: string;
};

@injectable()
export class JoinConferenceCommandUseCase extends UseCase<Request, Result> {
  async execute({ conferenceId }: Request) {
    const conference = await this.ctx.conferenceRepo.getOneById(conferenceId);

    await this.checkRule(new ConferenceShouldExistRule(conference));

    await this.ctx.userConferenceRelationManager.addParticipantToConference(this.ctx.currentUserId!, conferenceId);

    return {
      message: 'You successfully joined the conference',
    };
  }
}
