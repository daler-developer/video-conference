import { Repository } from "@/entity/query-cache/entity-manager/Repository.ts";
import { schema } from "normalizr";
import { type UserEntity, UserEntitySchema } from "./user.ts";

export const ENTITY_NAME = "message";

export type MessageEntity = {
  id: number;
  text: string;
  likesCount: number;
  sender: UserEntity;
};

export type NormalizedMessageEntity = MessageEntity;

export const MessageEntitySchema = new schema.Entity(ENTITY_NAME, {
  sender: UserEntitySchema,
});

export const identify = (entity: MessageEntity) => {
  return entity.id;
};

export class MessageRepository extends Repository<NormalizedMessageEntity> {
  static entityName = ENTITY_NAME;

  constructor() {
    super(ENTITY_NAME);
  }

  getId(entity: NormalizedMessageEntity) {
    return entity.id;
  }
}
