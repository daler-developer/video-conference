import { injectable } from 'inversify';
import { UseCase } from '../../UseCase';
import { ApplicationError } from '../../ApplicationError';

type Request = {
  fullName: string;
};

type Result = {
  accessToken: string;
};

@injectable()
export class StartSessionCommandUseCase extends UseCase<Request, Result> {
  async execute(value: Request) {
    // throw new ApplicationError('not_found', 'User was not found', {
    //   foo: 'bar',
    //   inner: {
    //     bar: [true, 2, 10, false],
    //   },
    // });

    return {
      accessToken: 'hello_token',
    };
  }
}
