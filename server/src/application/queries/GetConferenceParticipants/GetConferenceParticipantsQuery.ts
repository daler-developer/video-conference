import { injectable } from 'inversify';
import { UseCase } from '../../UseCase';
import dbClient from '@/infra/dbClient';

type Request = {
  conferenceId: string;
};

type Result = ConferenceParticipantsQueryResult;

export type ConferenceParticipantsQueryResult = Array<{
  id: number;
  text: string;
  likesCount: number;
}>;

@injectable()
export class GetConferenceParticipantsQueryUseCase extends UseCase<Request, Result> {
  async execute({ conferenceId }: Request) {
    return dbClient.$queryRaw<ConferenceParticipantsQueryResult>`
      SELECT 
          id, 
          full_name AS "fullName", 
          conference_id AS "conferenceId",
          created_at AS "createdAt"
      FROM 
          users
      WHERE
          users.conference_id = ${conferenceId}
    `;
  }
}
