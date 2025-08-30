import { User } from '../../../domain';

export interface IUserRepository {
  addOne(): Promise<void>;
  getOneById(): Promise<void>;
  getMany(): Promise<User[]>;
}
