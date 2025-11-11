import { v4 as uuidv4 } from 'uuid';
import { CreateConferenceDto, IConferenceRepo } from '@/domain';
import dbClient from '@/infra/dbClient';

export class ConferenceRepo implements IConferenceRepo {
  async addOne(dto: CreateConferenceDto): Promise<string> {
    const { id } = await dbClient.conference.create({
      data: {
        id: uuidv4(),
        name: dto.name,
      },
      select: {
        id: true,
      },
    });

    return id;
  }
}
