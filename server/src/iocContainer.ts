import { Container } from 'inversify';
import { GetUsersQueryUseCase, StartSessionCommandUseCase } from '@/application';
import { UserRepository } from './infra';
import { TYPES } from './types';
import { IUserRepository } from '@/domain';

const container = new Container();

container.bind(StartSessionCommandUseCase).toSelf();
container.bind(GetUsersQueryUseCase).toSelf();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

export { container };
