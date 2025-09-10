import { type Schema } from "normalizr";
import { Repository as BaseRepository } from "@/entity/query-cache/entity-manager/Repository.ts";
// import {
//   // ENTITY_NAME,
//   type NormalizedUserEntity,
// } from "@/entity/query-cache/entity-manager/entities/user.ts";

type Options<
  TType extends string,
  TEntity extends object,
  TNormalizedEntity extends object,
> = {
  type: TType;
  identify: (entity: TNormalizedEntity) => EntityId;
  schema: Schema;
};

export type EntityId = string | number;

export const createEntity = <
  TType extends string,
  TEntity extends object,
  TNormalizedEntity extends object,
>({
  type,
  identify,
  schema,
}: Options<TType, TEntity, TNormalizedEntity>) => {
  class Repository extends BaseRepository<TNormalizedEntity> {
    constructor() {
      super(type);
    }

    getId(entity: TNormalizedEntity) {
      return identify(entity);
    }
  }

  return {
    type,
    identify,
    schema,
    Repository,
  };
};
