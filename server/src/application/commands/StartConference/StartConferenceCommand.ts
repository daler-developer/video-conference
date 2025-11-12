import { inject, injectable } from 'inversify';
import { UseCase } from '../../UseCase';
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

  async execute(request: Request) {
    const conferenceId = await this.conferenceRepo.addOne(request);
    const currentUserId = 1;

    await this.userConferenceRelationManager.addParticipantToConference(currentUserId, conferenceId);

    return {
      conferenceId,
    };
  }
}
