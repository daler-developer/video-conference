import { User, IUserRepo } from '@/domain';

const page = 1;

function getRandom1to10() {
  return Math.floor(Math.random() * 10) + 1;
}

export class UserRepo implements IUserRepo {
  async addOne(): Promise<void> {
    return;
  }

  async getOneById(): Promise<void> {
    return;
  }

  async getMany(): Promise<User[]> {
    return [
      {
        id: 1,
        name: 'Daler',
        age: getRandom1to10(),
      },
      {
        id: 2,
        name: 'Aziz',
        age: getRandom1to10(),
      },
    ];
  }
}
