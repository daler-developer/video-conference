import { schema } from "normalizr";
import { Repository } from "./Repository";
// import { type UserEntity } from "../../types";

export type UserEntity = {
  id: number;
  name: string;
  age: number;
};

export type NormalizedUserEntity = UserEntity;

const ENTITY_NAME = "users" as const;

export const UserEntitySchema = new schema.Entity(ENTITY_NAME);

export class UserRepository extends Repository<NormalizedUserEntity> {
  static entityName = ENTITY_NAME;

  getId(entity: NormalizedUserEntity) {
    return entity.id;
  }
}
