import { Repository } from "./Repository";
import { schema } from "normalizr";

type NormalizedMessage = {
  id: number;
  text: string;
  likesCount: 20;
};

export const user = new schema.Entity("messages");

export class MessageRepository extends Repository<NormalizedMessage> {}
