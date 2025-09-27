import { User, IUserRepo, CreateUserDto } from '@/domain';
import dbClient from '@/infra/dbClient';

const page = 1;

function getRandom1to10() {
  return Math.floor(Math.random() * 10) + 1;
}

export class UserRepo implements IUserRepo {
  async addOne(dto: CreateUserDto): Promise<number> {
    const { id } = await dbClient.user.create({
      data: {
        fullName: dto.fullName,
      },
      select: {
        id: true,
      },
    });

    return id;
  }

  async getOneById(): Promise<void> {
    return;
  }

  async getMany(): Promise<User[]> {
    return [
      {
        id: 1,
        name: 'Daler',
        age: 11,
      },
      {
        id: 2,
        name: 'Aziz',
        age: 22,
      },
    ];
  }
}
