import { inject, injectable } from 'inversify';
import { UseCase } from '../../UseCase';
import { ApplicationError } from '../../ApplicationError';
import { TYPES } from '@/types';
import { IConferenceRepo, IUserConferenceRelationManager, IUserRepo } from '@/domain';
import { ApplicationContext } from '@/application/ApplicationContext';

type Request = {
  conferenceId: string;
};

type Result = {
  message: string;
};

@injectable()
export class JoinConferenceCommandUseCase extends UseCase<Request, Result> {
  @inject(TYPES.ConferenceRepo) private conferenceRepo!: IConferenceRepo;
  @inject(TYPES.UserRepo) private userRepo!: IUserRepo;
  @inject(TYPES.UserConferenceRelationManager) private userConferenceRelationManager!: IUserConferenceRelationManager;

  async execute({ conferenceId }: Request, { currentUserId }: ApplicationContext) {
    const conference = await this.conferenceRepo.getOneById(conferenceId);
    const user = await this.userRepo.getOneById(currentUserId!);

    await this.userConferenceRelationManager.addParticipantToConference(currentUserId!, conferenceId);

    return {
      message: 'You successfully joined the conference',
    };
  }
}
