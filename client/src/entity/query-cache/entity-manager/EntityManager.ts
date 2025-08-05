import { denormalize, normalize, type Schema } from "normalizr";
import { UserRepository, type NormalizedUserEntity } from "./UserRepository.ts";
import {
  MessageRepository,
  type NormalizedMessageEntity,
} from "./MessageRepository.ts";
import { Entity } from "./Entity.ts";

type EntityName =
  | typeof UserRepository.entityName
  | typeof MessageRepository.entityName;

type Entities = {
  users: Map<number, Entity<NormalizedUserEntity>>;
  messages: Map<number, Entity<NormalizedMessageEntity>>;
};

export class EntityManager {
  #repositories = {
    [UserRepository.entityName]: new UserRepository(),
    [MessageRepository.entityName]: new MessageRepository(),
  };

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
        const entity_ = new Entity(entity);
        this.getRepository(entityName).addOne(entity_);
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

    const res: Entities = {} as any;
    for (const [entityName, map] of Object.entries(allEntities)) {
      res[entityName] = [...map.values()].reduce((accum, entity) => {
        accum[entity.getData().id] = entity.getData();
        return accum;
      }, {});
    }

    return denormalize(normalizedData, schema, res) as TResult;
  }
}
