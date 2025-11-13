import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { UseCase } from '../../UseCase';
import { ApplicationError } from '../../ApplicationError';
import { TYPES } from '@/types';
import { CreateUserDto, CreateConferenceDto, IUserRepo } from '@/domain';

const SECRET_KEY = 'test_secret';

type Request = CreateUserDto & CreateConferenceDto;

type Result = {
  accessToken: string;
};

@injectable()
export class StartSessionCommandUseCase extends UseCase<Request, Result> {
  async execute(request: Request) {
    const userId = await this.ctx.userRepo.addOne(request);

    const accessToken = jwt.sign(
      {
        userId,
      },
      SECRET_KEY,
      {
        expiresIn: '10h',
      }
    );

    return {
      accessToken,
    };
  }
}
