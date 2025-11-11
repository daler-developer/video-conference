import { User, IUserRepo, CreateUserDto } from '@/domain';
import dbClient from '@/infra/dbClient';
import { Conference } from '@/domain/entities/Conference';

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

  async getOneById(id: number): Promise<User | null> {
    return dbClient.user.findUnique({ where: { id } });
  }

  async getMany(): Promise<User[]> {
    return [];
  }
}
