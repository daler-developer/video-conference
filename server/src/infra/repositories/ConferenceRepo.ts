import { CreateConferenceDto, IConferenceRepo } from '@/domain';
import dbClient from '@/infra/dbClient';

export class ConferenceRepo implements IConferenceRepo {
  async addOne(dto: CreateConferenceDto): Promise<number> {
    const { id } = await dbClient.conference.create({
      data: {
        name: dto.name,
      },
      select: {
        id: true,
      },
    });

    return id;
  }
}
