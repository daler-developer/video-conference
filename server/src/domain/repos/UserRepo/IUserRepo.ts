import { User } from '../../entities/User';

export interface IUserRepo {
  addOne(): Promise<void>;
  getOneById(): Promise<void>;
  getMany(): Promise<User[]>;
}
