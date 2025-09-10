import { Repository } from "@/entity/query-cache/entity-manager/Repository.ts";
import { schema } from "normalizr";
import {
  type Entity as UserEntity,
  EntitySchema as UserEntitySchema,
} from "./user";

export const ENTITY_TYPE = "message";

export type Entity = {
  id: number;
  text: string;
  likesCount: number;
  sender: UserEntity;
};

export type NormalizedEntity = Entity;

export const MessageEntitySchema = new schema.Entity(ENTITY_TYPE, {
  sender: UserEntitySchema,
});

export const identify = (entity: Entity) => {
  return entity.id;
};

export class MessageRepository extends Repository<NormalizedEntity> {
  constructor() {
    super(ENTITY_TYPE);
  }

  getId(entity: NormalizedEntity) {
    return entity.id;
  }
}
