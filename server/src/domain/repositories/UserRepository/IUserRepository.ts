import { User } from '../../entities/User';

export interface IUserRepository {
  addOne(): Promise<void>;
  getOneById(): Promise<void>;
  getMany(): Promise<User[]>;
}
