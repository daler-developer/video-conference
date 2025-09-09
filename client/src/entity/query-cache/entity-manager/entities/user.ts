import { Repository } from "@/entity/query-cache/entity-manager/Repository.ts";
import { schema } from "normalizr";

export const ENTITY_NAME = "user";

export type UserEntity = {
  id: number;
  name: string;
  age: number;
};

export type NormalizedUserEntity = UserEntity;

export const UserEntitySchema = new schema.Entity(ENTITY_NAME);

export const identify = (entity: UserEntity) => {
  return entity.id;
};

export class UserRepository extends Repository<NormalizedUserEntity> {
  static entityName = ENTITY_NAME;

  constructor() {
    super(ENTITY_NAME);
  }

  getId(entity: NormalizedUserEntity) {
    return entity.id;
  }
}
