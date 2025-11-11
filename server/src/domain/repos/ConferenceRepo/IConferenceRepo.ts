import { CreateConferenceDto } from './dto/CreateConferenceDto';

export interface IConferenceRepo {
  addOne(dto: CreateConferenceDto): Promise<string>;
}
