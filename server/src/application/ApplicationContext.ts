import { IConferenceRepo, IUserConferenceRelationManager, IUserRepo } from '@/domain';
import { container } from '@/iocContainer';
import { TYPES } from '@/types';

export class ApplicationContext {
  userRepo: IUserRepo = null!;
  conferenceRepo: IConferenceRepo = null!;
  userConferenceRelationManager: IUserConferenceRelationManager = null!;

  constructor(public currentUserId?: number) {}
}

export const createApplicationContext = ({ currentUserId }: { currentUserId?: number }) => {
  const ctx = new ApplicationContext(currentUserId);

  ctx.userRepo = container.get(TYPES.UserRepo);
  ctx.conferenceRepo = container.get(TYPES.ConferenceRepo);
  ctx.userConferenceRelationManager = container.get(TYPES.UserConferenceRelationManager);

  return ctx;
};
