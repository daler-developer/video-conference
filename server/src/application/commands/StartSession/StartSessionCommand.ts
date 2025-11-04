import { inject, injectable } from 'inversify';
import { UseCase } from '../../UseCase';
import { ApplicationError } from '../../ApplicationError';
import { TYPES } from '@/types';
import { CreateUserDto, CreateConferenceDto, IUserRepo } from '@/domain';

type Request = CreateUserDto & CreateConferenceDto;

type Result = {
  accessToken: string;
};

@injectable()
export class StartSessionCommandUseCase extends UseCase<Request, Result> {
  @inject(TYPES.UserRepo)
  private userRepo!: IUserRepo;

  async execute(request: Request) {
    // throw new ApplicationError('not_found', 'User was not found', {
    //   foo: 'bar',
    //   inner: {
    //     bar: [true, 2, 10, false],
    //   },
    // });

    const userId = await this.userRepo.addOne(request);

    return {
      accessToken: `accessToken: ${userId}`,
    };
  }
}
