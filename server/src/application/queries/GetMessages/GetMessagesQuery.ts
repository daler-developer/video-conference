import { inject, injectable } from 'inversify';
import { TYPES } from '@/types';
import { IUserRepo } from '@/domain';
import { UseCase } from '../../UseCase';
import { User } from '@/application/queries/GetUsers/GetUsersQuery';
import dbClient from '@/infra/dbClient';

function getRandom1to10() {
  return Math.floor(Math.random() * 10) + 1;
}

export type Message = {
  id: number;
  text: string;
  likesCount: number;
  sender: User;
};

type Request = {};

type Result = any[];

type MessagesQueryResult = Array<{
  id: number;
  text: string;
  likesCount: number;
}>;

@injectable()
export class GetMessagesQueryUseCase extends UseCase<Request, Result> {
  @inject(TYPES.UserRepo)
  private userRepository!: IUserRepo;

  async execute({}: Request) {
    return dbClient.$queryRaw<MessagesQueryResult>`
      SELECT 
          id, 
          text, 
          likes_count AS "likesCount", 
          created_at AS "createdAt"
      FROM 
          messages
    `;

    // return [
    //   {
    //     id: 1,
    //     text: 'First message',
    //     likesCount: 11,
    //     sender: {
    //       id: 1,
    //       name: 'Daler',
    //       age: 11,
    //     },
    //   },
    //   {
    //     id: 2,
    //     text: 'Second message',
    //     likesCount: 22,
    //     sender: {
    //       id: 2,
    //       name: 'Aziz',
    //       age: 23,
    //     },
    //   },
    // ];
  }
}
