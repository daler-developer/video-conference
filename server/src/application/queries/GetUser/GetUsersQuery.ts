import { inject, injectable } from 'inversify';
import { TYPES } from '@/types';
import { IUserRepo, User } from '@/domain';
import { UseCase } from '../../UseCase';

type Request = {
  id: number;
};

type Result = User | null;

@injectable()
export class GetUserQueryUseCase extends UseCase<Request, Result> {
  @inject(TYPES.UserRepo)
  private userRepository!: IUserRepo;

  async execute({ id }: Request) {
    const user = await this.userRepository.getOneById(id);

    return user;
  }
}
