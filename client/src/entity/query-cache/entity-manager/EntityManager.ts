import { denormalize, normalize, type Schema } from "normalizr";
import {
  UserRepository,
  type NormalizedUserEntity,
  UserEntitySchema,
  type UserEntity,
} from "./UserRepository.ts";
import {
  type MessageEntity,
  MessageEntitySchema,
  MessageRepository,
  type NormalizedMessageEntity,
} from "./MessageRepository.ts";
import { Subscribable } from "../Subscribable.ts";

export type EntityName =
  | typeof UserRepository.entityName
  | typeof MessageRepository.entityName;

type Entities = {
  users: Map<number, NormalizedUserEntity>;
  messages: Map<number, NormalizedMessageEntity>;
};

type EntityManagerNotifyEvent = {
  type: "entity-updated";
};

const entityNameToSchemaMap = {
  [UserRepository.entityName]: UserEntitySchema,
  [MessageRepository.entityName]: MessageEntitySchema,
};

type EntityNameToEntityMap = {
  [UserRepository.entityName]: UserEntity;
  [MessageRepository.entityName]: MessageEntity;
};

// type Update<TEntity extends BaseEntity> = {
//   id: number;
//   changes: Omit<Partial<TEntity>, "id">;
// };

type Listener = (event: EntityManagerNotifyEvent) => void;

export class EntityManager extends Subscribable<Listener> {
  #repositories = {
    [UserRepository.entityName]: new UserRepository(),
    [MessageRepository.entityName]: new MessageRepository(),
  };

  constructor() {
    super();
    Object.values(this.#repositories).forEach((repository) => {
      repository.subscribe((event) => {
        if (event.type === "entity-updated") {
          this.listeners.forEach((listener) => {
            listener({ type: "entity-updated" });
          });
        }
      });
    });
  }

  private getAllEntities() {
    const res: Entities = {} as any;
    for (const [entityName, repository] of Object.entries(this.#repositories)) {
      res[entityName] = repository.getAllById();
    }
    return res;
  }

  getRepository<TEntityName extends EntityName>(entityName: TEntityName) {
    return this.#repositories[entityName];
  }

  normalizeAndSave<TResult, TData, TSchema extends Schema>(
    data: TData,
    schema: TSchema,
  ) {
    const { result, entities } = normalize<any, Entities, TResult>(
      data,
      schema,
    );

    // const allEntities: Entity[] = [];

    for (const entityName of Object.keys(entities) as EntityName[]) {
      const allEntities = Object.values(entities[entityName]);
      for (const entity of allEntities) {
        this.getRepository(entityName).upsertOne(entity);
        // allEntities.push(entity_);
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
    for (const [entityName, map] of Object.entries(allEntities)) {
      res[entityName] = [...map.values()].reduce((accum, entity) => {
        accum[entity.id] = entity;
        return accum;
      }, {});
    }

    return denormalize(normalizedData, schema, res) as TResult;
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

    this.listeners.forEach((listener) => {
      listener({ type: "entity-updated" });
    });
  }
}
