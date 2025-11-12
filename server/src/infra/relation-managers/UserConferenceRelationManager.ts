import { injectable } from 'inversify';
import { IUserConferenceRelationManager } from '@/domain';
import dbClient from '@/infra/dbClient';

@injectable()
export class UserConferenceRelationManager implements IUserConferenceRelationManager {
  async addParticipantToConference(userId: number, conferenceId: string) {
    await dbClient.user.update({
      where: { id: userId },
      data: {
        conference: {
          connect: { id: conferenceId },
        },
      },
    });
  }
}
