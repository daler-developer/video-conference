import { Repository } from "./Repository";
import { schema } from "normalizr";
import {
  type UserEntity,
  UserEntitySchema,
} from "@/entity/query-cache/entity-manager/UserRepository.ts";
// import { type MessageEntity } from "../../types";

export type MessageEntity = {
  id: number;
  text: string;
  likesCount: number;
  sender: UserEntity;
};

export type NormalizedMessageEntity = MessageEntity;

const ENTITY_NAME = "messages" as const;

export const MessageEntitySchema = new schema.Entity(ENTITY_NAME, {
  sender: UserEntitySchema,
});

export class MessageRepository extends Repository<NormalizedMessageEntity> {
  static entityName = ENTITY_NAME;
}
