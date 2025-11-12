import { inject, injectable } from 'inversify';
import { UseCase } from '../../UseCase';
import { ApplicationError } from '../../ApplicationError';
import { TYPES } from '@/types';
import { IConferenceRepo, IUserConferenceRelationManager, IUserRepo } from '@/domain';

type Request = {
  conferenceId: string;
  currentUserId: number;
};

type Result = {
  message: string;
};

@injectable()
export class JoinConferenceCommandUseCase extends UseCase<Request, Result> {
  @inject(TYPES.ConferenceRepo) private conferenceRepo!: IConferenceRepo;
  @inject(TYPES.UserRepo) private userRepo!: IUserRepo;
  @inject(TYPES.UserConferenceRelationManager) private userConferenceRelationManager!: IUserConferenceRelationManager;

  async execute({ conferenceId, currentUserId }: Request) {
    const conference = await this.conferenceRepo.getOneById(conferenceId);
    const user = await this.userRepo.getOneById(currentUserId);

    await this.userConferenceRelationManager.addParticipantToConference(currentUserId, conferenceId);

    return {
      message: 'You successfully joined the conference',
    };
  }
}
