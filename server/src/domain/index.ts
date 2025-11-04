import { User } from './entities/User';
import { type IUserRepo } from './repos/UserRepo/IUserRepo';
import { type IConferenceRepo } from './repos/ConferenceRepo/IConferenceRepo';
import { CreateUserDto } from './repos/UserRepo/dto/CreateUserDto';
import { CreateConferenceDto } from './repos/ConferenceRepo/dto/CreateConferenceDto';

export { User, IUserRepo, IConferenceRepo, CreateUserDto, CreateConferenceDto };
