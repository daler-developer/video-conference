import { RequestData, RequestHandler, requestHandler } from 'mediatr-ts';
import { inject, injectable } from 'inversify';
import { UseCase } from '../../UseCase';
import { container } from '../../iocContainer';

// type Result = {
//   accessToken: string;
// };
//
// export class StartSessionCommand extends RequestData<Result> {
//   constructor(public fullName: string) {
//     super();
//   }
// }

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

container.bind(StartSessionCommandUseCase).toSelf();
