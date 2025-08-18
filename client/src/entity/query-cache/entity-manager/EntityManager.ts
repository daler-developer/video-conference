import { denormalize, normalize, type Schema } from "normalizr";
import { UserRepository, type NormalizedUserEntity } from "./UserRepository.ts";
import {
  MessageRepository,
  type NormalizedMessageEntity,
} from "./MessageRepository.ts";
import { Entity } from "./Entity.ts";
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

  getRepository(entityName: EntityName) {
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
}
