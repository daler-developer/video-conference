import { schema } from "normalizr";
import { Repository } from "./Repository";
import { type UserEntity } from "../../types";

export type NormalizedUserEntity = UserEntity;

const ENTITY_NAME = "users" as const;

export const UserEntitySchema = new schema.Entity(ENTITY_NAME);

export class UserRepository extends Repository<NormalizedUserEntity> {
  static entityName = ENTITY_NAME;
}
