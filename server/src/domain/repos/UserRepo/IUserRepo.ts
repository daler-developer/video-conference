import { User } from '../../entities/User';
import { CreateUserDto } from './dto/CreateUserDto';

export interface IUserRepo {
  addOne(dto: CreateUserDto): Promise<number>;
  getOneById(): Promise<void>;
  getMany(): Promise<User[]>;
}
