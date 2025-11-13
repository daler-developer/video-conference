import { Container } from 'inversify';
import {
  GetMessagesQueryUseCase,
  GetUsersQueryUseCase,
  StartConferenceCommandUseCase,
  StartSessionCommandUseCase,
} from '@/application';
import { UserRepo } from './infra';
import { TYPES } from './types';
import { IConferenceRepo, IUserRepo, IUserConferenceRelationManager } from '@/domain';
import { ConferenceRepo } from '@/infra/repositories/ConferenceRepo';
import { UserConferenceRelationManager } from '@/infra/relation-managers/UserConferenceRelationManager';

const container = new Container();

container.bind(StartSessionCommandUseCase).toSelf().inTransientScope();
container.bind(GetUsersQueryUseCase).toSelf().inTransientScope();
container.bind(GetMessagesQueryUseCase).toSelf().inTransientScope();
container.bind(StartConferenceCommandUseCase).toSelf().inTransientScope();

container.bind<IUserRepo>(TYPES.UserRepo).to(UserRepo);
container.bind<IConferenceRepo>(TYPES.ConferenceRepo).to(ConferenceRepo);

container.bind<IUserConferenceRelationManager>(TYPES.UserConferenceRelationManager).to(UserConferenceRelationManager);

export { container };
