import { denormalize, normalize, type Schema } from "normalizr";
import {
  UserRepository,
  ENTITY_NAME as USER_ENTITY_NAME,
  UserEntitySchema,
  identify as identifyUserEntity,
  type NormalizedUserEntity,
  type UserEntity,
} from "./entities/user.ts";
import {
  MessageRepository,
  ENTITY_NAME as MESSAGE_ENTITY_NAME,
  MessageEntitySchema,
  identify as identifyMessageEntity,
  type NormalizedMessageEntity,
  type MessageEntity,
} from "./entities/message.ts";
import { entityTypeSymbol } from "@/entity/query-cache/entity-manager/Repository.ts";

export type EntityName = typeof USER_ENTITY_NAME | typeof MESSAGE_ENTITY_NAME;

type Entities = {
  [USER_ENTITY_NAME]: Map<number, NormalizedUserEntity>;
  [MESSAGE_ENTITY_NAME]: Map<number, NormalizedMessageEntity>;
};

// type EntityManagerNotifyEvent = {
//   type: "entity-updated";
// };

const entityNameToSchemaMap = {
  [USER_ENTITY_NAME]: UserEntitySchema,
  [MESSAGE_ENTITY_NAME]: MessageEntitySchema,
};

const entityTypeToIdentifierMap = {
  [USER_ENTITY_NAME]: identifyUserEntity,
  [MESSAGE_ENTITY_NAME]: identifyMessageEntity,
};

type EntityNameToEntityMap = {
  [USER_ENTITY_NAME]: UserEntity;
  [MESSAGE_ENTITY_NAME]: MessageEntity;
};

type Entity = UserEntity | MessageEntity;

// type Update<TEntity extends BaseEntity> = {
//   id: number;
//   changes: Omit<Partial<TEntity>, "id">;
// };

// type Listener = (event: EntityManagerNotifyEvent) => void;

export class EntityManager {
  #repositories = {
    [USER_ENTITY_NAME]: new UserRepository(),
    [MESSAGE_ENTITY_NAME]: new MessageRepository(),
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
    const entityType = entity[entityTypeSymbol];

    return entityTypeToIdentifierMap[entityType](entity);
  }

  private getAllEntities() {
    const res: Entities = {} as Entities;
    for (const entityName of Object.keys(this.#repositories) as EntityName[]) {
      const repository = this.#repositories[entityName];
      res[entityName] = repository.getAllById();
    }
    return res;
  }

  normalizeAndSave<TResult, TData, TSchema extends Schema>(
    data: TData,
    schema: TSchema,
  ) {
    const { result, entities } = normalize<any, Entities, TResult>(
      data,
      schema,
    );

    for (const entityName of Object.keys(entities) as EntityName[]) {
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

    const res: Entities = {} as Entities;

    for (const entityName of Object.keys(allEntities) as EntityName[]) {
      const map = allEntities[entityName];

      res[entityName] = [...map.values()].reduce((accum, entity) => {
        accum[entity.id] = entity;
        return accum;
      }, {});
    }

    return denormalize(normalizedData, schema, res) as TResult;
  }

  getEntity(entityType: EntityName, entityId: string | number) {
    const normalizedEntity = this.#repositories[entityType].getOne(entityId);

    return this.denormalizeData(
      normalizedEntity,
      entityNameToSchemaMap[entityType],
    );
  }

  updateEntity<TEntityName extends EntityName>(
    entityName: TEntityName,
    entityId: number,
    updateCallback: (
      old: EntityNameToEntityMap[TEntityName],
    ) => EntityNameToEntityMap[TEntityName],
  ) {
    const oldEntity = this.denormalizeData(
      entityId,
      entityNameToSchemaMap[entityName],
    ) as EntityNameToEntityMap[TEntityName];

    const updated = updateCallback(oldEntity);

    this.normalizeAndSave(updated, entityNameToSchemaMap[entityName]);
  }

  printAll() {
    console.log(this.getAllEntities());
  }
}
