import { inject, injectable } from 'inversify';
import { UseCase } from '../../UseCase';
import { TYPES } from '@/types';
import { CreateConferenceDto, IConferenceRepo } from '@/domain';

type Request = CreateConferenceDto;

type Result = {
  conferenceId: number;
};

@injectable()
export class StartConferenceCommandUseCase extends UseCase<Request, Result> {
  @inject(TYPES.ConferenceRepo)
  private conferenceRepo!: IConferenceRepo;

  async execute(request: Request) {
    const conferenceId = await this.conferenceRepo.addOne(request);

    return {
      conferenceId,
    };
  }
}
