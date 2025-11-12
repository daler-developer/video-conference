import { inject, injectable } from 'inversify';
import { UseCase } from '../../UseCase';
import { ApplicationContext } from '../../ApplicationContext';
import { TYPES } from '@/types';
import { StartConferenceDto, IConferenceRepo, IUserConferenceRelationManager } from '@/domain';

type Request = StartConferenceDto;

type Result = {
  conferenceId: string;
};

@injectable()
export class StartConferenceCommandUseCase extends UseCase<Request, Result> {
  @inject(TYPES.ConferenceRepo) private conferenceRepo!: IConferenceRepo;
  @inject(TYPES.UserConferenceRelationManager) private userConferenceRelationManager!: IUserConferenceRelationManager;

  async execute(request: Request, { currentUserId }: ApplicationContext) {
    const conferenceId = await this.conferenceRepo.addOne(request);

    await this.userConferenceRelationManager.addParticipantToConference(currentUserId!, conferenceId);

    return {
      conferenceId,
    };
  }
}
