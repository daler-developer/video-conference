import { Repository } from "@/entity/query-cache/entity-manager/Repository.ts";
import { schema } from "normalizr";

export const ENTITY_TYPE = "user";

export type Entity = {
  id: number;
  name: string;
  age: number;
};

export type NormalizedEntity = Entity;

export const EntitySchema = new schema.Entity(ENTITY_TYPE);

export const identify = (entity: Entity) => {
  return entity.id;
};

export class UserRepository extends Repository<NormalizedEntity> {
  constructor() {
    super(ENTITY_TYPE);
  }

  getId(entity: NormalizedEntity) {
    return entity.id;
  }
}
