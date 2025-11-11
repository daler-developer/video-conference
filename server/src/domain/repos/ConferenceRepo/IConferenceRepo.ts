import { CreateConferenceDto } from './dto/CreateConferenceDto';
import { Conference } from '../../entities/Conference';

export interface IConferenceRepo {
  getOneById(id: string): Promise<Conference | null>;
  addOne(dto: CreateConferenceDto): Promise<string>;
}
