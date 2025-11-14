import { inject, injectable } from 'inversify';
import { UseCase } from '../../UseCase';
import { ApplicationContext } from '../../ApplicationContext';
import { TYPES } from '@/types';
import { StartConferenceDto, IConferenceRepo, IUserConferenceRelationManager } from '@/domain';
import { SessionRequiredRule } from '@/application/rules/SessionRequiredRule';

type Request = StartConferenceDto;

type Result = {
  conferenceId: string;
};

@injectable()
export class StartConferenceCommandUseCase extends UseCase<Request, Result> {
  async execute(request: Request) {
    await this.checkRule(new SessionRequiredRule());

    const conferenceId = await this.ctx.conferenceRepo.addOne(request);

    await this.ctx.userConferenceRelationManager.addParticipantToConference(this.ctx.currentUserId!, conferenceId);

    return {
      conferenceId,
    };
  }
}
