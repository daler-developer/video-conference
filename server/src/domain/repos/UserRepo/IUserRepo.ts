import { User } from '../../entities/User';
import { CreateUserDto } from './dto/CreateUserDto';

export interface IUserRepo {
  addOne(dto: CreateUserDto): Promise<number>;
  getOneById(id: number): Promise<User | null>;
  getMany(): Promise<User[]>;
}
