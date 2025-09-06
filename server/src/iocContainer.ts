import { Container } from 'inversify';
import { GetMessagesQueryUseCase, GetUsersQueryUseCase, StartSessionCommandUseCase } from '@/application';
import { UserRepo } from './infra';
import { TYPES } from './types';
import { IUserRepo } from '@/domain';

const container = new Container();

container.bind(StartSessionCommandUseCase).toSelf();
container.bind(GetUsersQueryUseCase).toSelf();
container.bind(GetMessagesQueryUseCase).toSelf();

container.bind<IUserRepo>(TYPES.UserRepo).to(UserRepo);

export { container };
