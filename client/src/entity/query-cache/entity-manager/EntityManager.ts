import { denormalize, normalize, type Schema } from "normalizr";
import { entityTypeSymbol } from "@/entity/query-cache/entity-manager/BaseRepository.ts";

import {
  type Entity as UserEntity,
  type NormalizedEntity as NormalizedUserEntity,
  ENTITY_TYPE as USER_ENTITY_TYPE,
  Repository as UserRepository,
  identify as identifyUser,
  EntitySchema as UserEntitySchema,
} from "./entities/user.ts";

import {
  type Entity as MessageEntity,
  type NormalizedEntity as NormalizedMessageEntity,
  ENTITY_TYPE as MESSAGE_ENTITY_TYPE,
  Repository as MessageRepository,
  identify as identifyMessage,
  EntitySchema as MessageEntitySchema,
} from "./entities/message.ts";

export type EntityType = typeof USER_ENTITY_TYPE | typeof MESSAGE_ENTITY_TYPE;

export type EntityId = string | number;

type Entity = UserEntity | MessageEntity;

type AllEntities = {
  [USER_ENTITY_TYPE]: Map<number, NormalizedUserEntity>;
  [MESSAGE_ENTITY_TYPE]: Map<number, NormalizedMessageEntity>;
};

type EntityTypeToEntityMap = {
  [USER_ENTITY_TYPE]: UserEntity;
  [MESSAGE_ENTITY_TYPE]: MessageEntity;
};

const entityTypeToIdentifyMap = {
  [USER_ENTITY_TYPE]: identifyUser,
  [MESSAGE_ENTITY_TYPE]: identifyMessage,
};

const entityTypeToSchemaMap = {
  [USER_ENTITY_TYPE]: UserEntitySchema,
  [MESSAGE_ENTITY_TYPE]: MessageEntitySchema,
};

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
    [USER_ENTITY_TYPE]: new UserRepository(),
    [MESSAGE_ENTITY_TYPE]: new MessageRepository(),
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

    return entityTypeToIdentifyMap[entityType](entity);
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
      entityTypeToSchemaMap[entityType],
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
      entityTypeToSchemaMap[entityType],
    ) as EntityTypeToEntityMap[TEntityName];

    const updated = updateCallback(oldEntity);

    this.normalizeAndSave(updated, entityTypeToSchemaMap[entityType]);
  }

  printAll() {
    console.log(this.getAllEntities());
  }
}
