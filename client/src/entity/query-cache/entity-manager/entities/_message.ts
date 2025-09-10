import { createEntity } from "../createEntity.ts";
import { schema } from "normalizr";
import { type UserEntity } from "./_user.ts";

export type MessageEntity = {
  id: number;
  text: string;
  likesCount: number;
  sender: UserEntity;
};

export type NormalizedMessageEntity = MessageEntity & {
  sender: number;
};

export const MESSAGE_ENTITY_TYPE = "message";

export const MessageEntitySchema = new schema.Entity(MESSAGE_ENTITY_TYPE);

export const messageEntity = createEntity<
  "message",
  MessageEntity,
  NormalizedMessageEntity
>({
  type: MESSAGE_ENTITY_TYPE,
  schema: MessageEntitySchema,
  identify(normalizedEntity) {
    return normalizedEntity.id;
  },
});
