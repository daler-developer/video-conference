import { denormalize, normalize, type Schema } from "normalizr";
// import {
//   UserRepository,
//   // ENTITY_NAME as USER_ENTITY_NAME,
//   UserEntitySchema,
//   identify as identifyUserEntity,
//   // type NormalizedUserEntity,
//   // type UserEntity,
// } from "./entities/user.ts";
// import {
//   MessageRepository,
//   // ENTITY_NAME as MESSAGE_ENTITY_NAME,
//   MessageEntitySchema,
//   identify as identifyMessageEntity,
//   // type NormalizedMessageEntity,
//   // type MessageEntity,
// } from "./entities/message.ts";
import { entityTypeSymbol } from "@/entity/query-cache/entity-manager/Repository.ts";

import {
  type UserEntity,
  type NormalizedUserEntity,
  userEntity,
  USER_ENTITY_TYPE,
} from "./entities/_user.ts";

import {
  type MessageEntity,
  type NormalizedMessageEntity,
  messageEntity,
  MESSAGE_ENTITY_TYPE,
} from "./entities/_message.ts";

export type EntityType = typeof USER_ENTITY_TYPE | typeof MESSAGE_ENTITY_TYPE;

const entities = {
  [userEntity.type]: userEntity,
  [messageEntity.type]: messageEntity,
};

type AllEntities = {
  [USER_ENTITY_TYPE]: Map<number, NormalizedUserEntity>;
  [MESSAGE_ENTITY_TYPE]: Map<number, NormalizedMessageEntity>;
};

type EntityTypeToEntityMap = {
  [userEntity.type]: UserEntity;
  [messageEntity.type]: MessageEntity;
};

type Entity = UserEntity | MessageEntity;

// export type EntityName = typeof USER_ENTITY_NAME | typeof MESSAGE_ENTITY_NAME;

// type EntityManagerNotifyEvent = {
//   type: "entity-updated";
// };

// const entityNameToSchemaMap = {
//   [USER_ENTITY_NAME]: UserEntitySchema,
//   [MESSAGE_ENTITY_NAME]: MessageEntitySchema,
// };
//
// const entityTypeToIdentifierMap = {
//   [USER_ENTITY_NAME]: identifyUserEntity,
//   [MESSAGE_ENTITY_NAME]: identifyMessageEntity,
// };

// type Update<TEntity extends BaseEntity> = {
//   id: number;
//   changes: Omit<Partial<TEntity>, "id">;
// };

// type Listener = (event: EntityManagerNotifyEvent) => void;

export class EntityManager {
  #repositories = {
    [entities.user.type]: new entities.user.Repository(),
    [entities.message.type]: new entities.message.Repository(),
  };

  constructor() {
    // Object.values(this.#repositories).forEach((repository) => {
    //   repository.subscribe((event) => {
    //     if (event.type === "entity-updated") {
    //       this.listeners.forEach((listener) => {
    //         listener({ type: "entity-updated" });
    //       });
    //     }
    //   });
    // });
  }

  identifyEntity(entity: Entity) {
    const entityType = entity[entityTypeSymbol] as EntityType;

    return entities[entityType].identify(entity);
  }

  private getAllEntities() {
    const res: AllEntities = {} as AllEntities;
    for (const entityName of Object.keys(this.#repositories) as EntityType[]) {
      const repository = this.#repositories[entityName];
      res[entityName] = repository.getAllById();
    }
    return res;
  }

  normalizeAndSave<TResult, TData, TSchema extends Schema>(
    data: TData,
    schema: TSchema,
  ) {
    const { result, entities } = normalize<any, AllEntities, TResult>(
      data,
      schema,
    );

    for (const entityName of Object.keys(entities) as EntityType[]) {
      const allEntities = Object.values(entities[entityName]);
      for (const entity of allEntities) {
        this.#repositories[entityName].upsertOne(entity);
      }
    }

    return {
      normalizedData: result,
      allEntities: [],
    };
  }

  denormalizeData<TResult>(normalizedData: unknown, schema: Schema) {
    const allEntities = this.getAllEntities();

    const res: AllEntities = {} as AllEntities;

    for (const entityName of Object.keys(allEntities) as EntityType[]) {
      const map = allEntities[entityName];

      res[entityName] = [...map.values()].reduce((accum, entity) => {
        accum[entity.id] = entity;
        return accum;
      }, {});
    }

    return denormalize(normalizedData, schema, res) as TResult;
  }

  getEntity<TEntityType extends EntityType>(
    entityType: TEntityType,
    entityId: string | number,
  ) {
    const normalizedEntity = this.#repositories[entityType].getOne(entityId);

    return this.denormalizeData<EntityTypeToEntityMap[TEntityType]>(
      normalizedEntity,
      entities[entityType].schema,
    );
  }

  updateEntity<TEntityName extends EntityType>(
    entityType: TEntityName,
    entityId: number,
    updateCallback: (
      old: EntityTypeToEntityMap[TEntityName],
    ) => EntityTypeToEntityMap[TEntityName],
  ) {
    const oldEntity = this.denormalizeData(
      entityId,
      entities[entityType].schema,
    ) as EntityTypeToEntityMap[TEntityName];

    const updated = updateCallback(oldEntity);

    this.normalizeAndSave(updated, entities[entityType].schema);
  }

  printAll() {
    console.log(this.getAllEntities());
  }
}
