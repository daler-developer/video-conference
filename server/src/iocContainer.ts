import { Container } from 'inversify';
import {
  GetMessagesQueryUseCase,
  GetUsersQueryUseCase,
  StartConferenceCommandUseCase,
  StartSessionCommandUseCase,
} from '@/application';
import { UserRepo } from './infra';
import { TYPES } from './types';
import { IConferenceRepo, IUserRepo } from '@/domain';
import { ConferenceRepo } from '@/infra/repositories/ConferenceRepo';

const container = new Container();

container.bind(StartSessionCommandUseCase).toSelf();
container.bind(GetUsersQueryUseCase).toSelf();
container.bind(GetMessagesQueryUseCase).toSelf();
container.bind(StartConferenceCommandUseCase).toSelf();

container.bind<IUserRepo>(TYPES.UserRepo).to(UserRepo);
container.bind<IConferenceRepo>(TYPES.ConferenceRepo).to(ConferenceRepo);

export { container };
