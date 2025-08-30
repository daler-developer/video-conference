import { injectable } from 'inversify';
import { UseCase } from '../../UseCase';
import { container } from '../../iocContainer';

function getRandom1to10() {
  return Math.floor(Math.random() * 10) + 1;
}

type User = {
  id: number;
  name: string;
  age: number;
};

type Request = {
  limit: number;
  page: number;
};

type Result = User[];

@injectable()
export class GetUsersQueryUseCase extends UseCase<Request, Result> {
  async execute({ page }: Request) {
    return [
      {
        id: page * 2,
        name: 'Daler',
        age: getRandom1to10(),
      },
      {
        id: page * 2 + 1,
        name: 'Aziz',
        age: getRandom1to10(),
      },
    ];
  }
}

container.bind(GetUsersQueryUseCase).toSelf();
