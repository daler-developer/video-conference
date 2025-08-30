import { injectable } from 'inversify';
import { UseCase } from '../../UseCase';

type Request = {
  fullName: string;
};

type Result = {
  accessToken: string;
};

@injectable()
export class StartSessionCommandUseCase extends UseCase<Request, Result> {
  async execute(value: Request) {
    return {
      accessToken: 'hello_token',
    };
  }
}
