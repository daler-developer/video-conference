import { inject, injectable } from 'inversify';
import { UseCase } from '../../UseCase';
import { ApplicationError } from '../../ApplicationError';
import { TYPES } from '@/types';
import { IConferenceRepo, IUserRepo } from '@/domain';

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

  async execute({ conferenceId }: Request) {
    const currentUserId = 1;
    const conference = await this.conferenceRepo.getOneById(conferenceId);
    const user = await this.userRepo.getOneById(currentUserId);

    return {
      message: 'You successfully joined the conference',
    };
  }
}
